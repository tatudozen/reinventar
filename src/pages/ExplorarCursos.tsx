import { useState, useEffect, useMemo, Fragment } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Leaf, Search, TrendingUp, Sparkles, BookOpen, ChevronDown, Check, GraduationCap } from 'lucide-react';
import { useApp } from '../store';
import { supabase } from '../supabase';
import { SurveyCallout } from '../components/SurveyCallout';
import { CourseList } from '../components/CourseList';
import {
  computeCareerCompatibility,
  computeUserProfile,
  computeLensRanking,
  RESULT_LENSES,
  RIASEC,
} from '../lib/ikigai-analysis';
import type { RIASECType } from '../lib/ikigai-analysis';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Course {
  id: number;
  career_id: number;
  name: string;
  university: string | null;
  summary: string | null;
  link: string | null;
  sort_order: number;
}

interface Career {
  id: number;
  area: string;
  profession: string;
  description: string | null;
  trend_demand: string | null;
  riasec_types: string[];
  intelligence_types: string[];
  ikigai_pillars: string[];
  courses: Course[];
}

interface ScoredCareer extends Career {
  score: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function compatLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 70) return { label: 'Alta compatibilidade', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' };
  if (score >= 40) return { label: 'Boa compatibilidade', color: '#d97706', bg: 'rgba(217,119,6,0.1)' };
  if (score >= 20) return { label: 'Compatível',          color: '#0891b2', bg: 'rgba(8,145,178,0.1)' };
  return                      { label: 'Para explorar',   color: '#78716c', bg: 'rgba(120,113,108,0.08)' };
}

// ─── Featured Card (top 3 personalized) ──────────────────────────────────────

function FeaturedCard({ career, riasecTop3 }: { career: ScoredCareer; riasecTop3: RIASECType[] }) {
  const compat = compatLabel(career.score);
  const activeCourses = career.courses.filter(c => c !== null);

  return (
    <div className="bg-white border-2 border-[var(--color-brand-200)] rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:border-[var(--color-brand-400)] transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--color-brand-500)] bg-[var(--color-brand-50)] px-2 py-1 rounded-full">
          {career.area}
        </span>
        {riasecTop3.length > 0 && (
          <div className="text-right shrink-0">
            <div className="text-xl font-black" style={{ color: compat.color }}>{career.score}%</div>
            <div
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ color: compat.color, background: compat.bg }}
            >
              {compat.label}
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-bold text-[var(--color-brand-900)] text-lg leading-tight mb-1">
          {career.profession}
        </h3>
        {career.description && (
          <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">{career.description}</p>
        )}
      </div>

      {career.riasec_types.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {career.riasec_types.map(t => {
            const info = RIASEC[t as RIASECType];
            const matched = riasecTop3.includes(t as RIASECType);
            return info ? (
              <span
                key={t}
                className="text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{
                  background: matched ? info.color + '22' : 'rgba(120,113,108,0.08)',
                  color: matched ? info.color : '#78716c',
                  border: `1px solid ${matched ? info.color + '44' : 'rgba(120,113,108,0.15)'}`,
                }}
              >
                {t} — {info.full}
              </span>
            ) : null;
          })}
        </div>
      )}

      {activeCourses.length > 0 && (
        <div className="bg-stone-50 rounded-xl p-3 mt-auto">
          <div className="text-[10px] font-mono tracking-widest uppercase text-stone-400 mb-2">
            Cursos relacionados
          </div>
          <CourseList courses={activeCourses} limitPerGroup={2} />
        </div>
      )}

      {career.trend_demand && (
        <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
          <TrendingUp className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
          <span>{career.trend_demand}</span>
        </div>
      )}
    </div>
  );
}

// ─── Career Card (grid) ───────────────────────────────────────────────────────

function CareerCard({ career, riasecTop3 }: { career: ScoredCareer; riasecTop3: RIASECType[] }) {
  const [expanded, setExpanded] = useState(false);
  const compat = compatLabel(career.score);
  const activeCourses = career.courses.filter(c => c !== null);

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-3 hover:border-[var(--color-brand-300)] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400 block mb-1">{career.area}</span>
          <h3 className="font-bold text-[var(--color-brand-900)] text-sm leading-tight">{career.profession}</h3>
        </div>
        {riasecTop3.length > 0 && (
          <div className="shrink-0 text-right">
            <div className="text-base font-black" style={{ color: compat.color }}>{career.score}%</div>
            <div
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
              style={{ color: compat.color, background: compat.bg }}
            >
              {compat.label}
            </div>
          </div>
        )}
      </div>

      {career.description && (
        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">{career.description}</p>
      )}

      {activeCourses.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-xs text-[var(--color-brand-600)] hover:text-[var(--color-brand-700)] font-medium"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {activeCourses.length} curso{activeCourses.length > 1 ? 's' : ''} disponíve{activeCourses.length > 1 ? 'is' : 'l'}
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>

          {expanded && (
            <div className="bg-stone-50 rounded-xl p-3">
              <CourseList courses={activeCourses} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExplorarCursos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const jornadaId = searchParams.get('id');
  const pathTypes = (searchParams.get('riasec') || '').split('').filter(Boolean);
  const { state } = useApp();

  const clearPathFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('riasec');
    setSearchParams(next, { replace: true });
  };

  const [remoteData, setRemoteData] = useState<{ mission_data: Record<string, unknown> } | null>(null);
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedLens, setSelectedLens] = useState<string>(() => {
    const p = searchParams.get('lente');
    return RESULT_LENSES.some(l => l.id === p) ? p! : RESULT_LENSES[0].id;
  });

  const toggleArea = (area: string) => {
    setShowAll(false);
    setSelectedAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
  };

  useEffect(() => {
    if (!jornadaId) return;
    supabase
      .from('jornadas')
      .select('mission_data')
      .eq('id', jornadaId)
      .single()
      .then(({ data }) => {
        if (data) setRemoteData(data as { mission_data: Record<string, unknown> });
      });
  }, [jornadaId]);

  useEffect(() => {
    supabase
      .from('careers')
      .select('*, courses(*)')
      .eq('active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setCareers(data as Career[]);
        setLoading(false);
      });
  }, []);

  const md = useMemo(() => ({
    mission1: (remoteData?.mission_data?.mission1 as typeof state.mission1) ?? state.mission1,
    mission2: (remoteData?.mission_data?.mission2 as typeof state.mission2) ?? state.mission2,
    mission3: (remoteData?.mission_data?.mission3 as typeof state.mission3) ?? state.mission3,
    mission4: (remoteData?.mission_data?.mission4 as typeof state.mission4) ?? state.mission4,
    mission5: (remoteData?.mission_data?.mission5 as typeof state.mission5) ?? state.mission5,
    mission6: (remoteData?.mission_data?.mission6 as typeof state.mission6) ?? state.mission6,
  }), [remoteData, state]);

  const { riasecTop3, topIntIds, pillarWeights, ministryArea } = useMemo(() => computeUserProfile(md), [md]);
  const hasProfile = riasecTop3.length > 0;

  const scoredCareers = useMemo<ScoredCareer[]>(() => {
    return careers
      .map(c => ({
        ...c,
        score: hasProfile ? computeCareerCompatibility(c, riasecTop3, topIntIds, pillarWeights, ministryArea) : 0,
        courses: [...c.courses].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
      }))
      .sort((a, b) => b.score - a.score);
  }, [careers, riasecTop3, topIntIds, pillarWeights, ministryArea, hasProfile]);

  const areas = useMemo(
    () => Array.from(new Set(careers.map(c => c.area))).sort(),
    [careers],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return scoredCareers.filter(c => {
      const matchArea = selectedAreas.length === 0 || selectedAreas.includes(c.area);
      const matchPath = pathTypes.length === 0 || c.riasec_types.some(t => pathTypes.includes(t));
      const matchQuery =
        !q ||
        c.profession.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        c.courses.some(
          co => co.name.toLowerCase().includes(q) || (co.university || '').toLowerCase().includes(q),
        );
      return matchArea && matchPath && matchQuery;
    });
  }, [scoredCareers, query, selectedAreas, pathTypes]);

  // Destaque: as 3 mais compatíveis pela LENTE escolhida (essência/impacto/território)
  const featured = useMemo<ScoredCareer[]>(() => {
    if (!hasProfile || careers.length === 0) return [];
    return computeLensRanking<Career>(md, careers, selectedLens, 3).map(r => ({
      ...r.career,
      score: r.score,
      courses: [...r.career.courses].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    }));
  }, [md, careers, selectedLens, hasProfile]);
  const gridCareers = showAll ? filtered : filtered.slice(0, 12);

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">

      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-stone-200">
        <div className="flex items-center gap-2 text-[var(--color-brand-600)] font-serif font-medium">
          <Leaf className="w-5 h-5" />
          <span>Jornada Ikigai</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={`/explorar-por-curso${jornadaId ? `?id=${jornadaId}` : ''}`}
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-[var(--color-brand-700)] font-medium transition-colors"
          >
            <GraduationCap className="w-4 h-4" /> Explorar por Curso
          </Link>
          {jornadaId && (
            <Link
              to={`/resultado/${jornadaId}`}
              className="text-sm text-stone-500 hover:text-[var(--color-brand-700)] font-medium transition-colors"
            >
              ← Voltar ao Resultado
            </Link>
          )}
          <Link to="/" className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
            Início
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="mb-10">
          <p className="text-xs font-mono text-stone-400 tracking-widest uppercase mb-2">
            Explorar Carreiras
          </p>
          <h1 className="font-serif text-4xl text-[var(--color-brand-900)] mb-3">
            {hasProfile ? 'Cursos alinhados com o seu Ikigai' : 'Explorar Cursos e Carreiras'}
          </h1>
          <p className="text-stone-500 max-w-2xl leading-relaxed">
            {hasProfile
              ? 'Com base no seu perfil, identificamos as carreiras mais compatíveis. Explore os cursos universitários associados a cada caminho.'
              : 'Descubra cursos universitários alinhados com os caminhos profissionais da Jornada Ikigai.'}
          </p>

          {hasProfile && (
            <div className="flex flex-wrap gap-2 mt-4">
              {riasecTop3.map(t => {
                const info = RIASEC[t];
                return (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: info.color + '18', color: info.color, border: `1px solid ${info.color}44` }}
                  >
                    <span>{info.icon}</span>
                    {t} — {info.full}
                  </span>
                );
              })}
              <span className="text-xs text-stone-400 self-center ml-1">seu perfil Holland</span>
            </div>
          )}

          {hasProfile && (
            <div className="mt-5">
              <div className="text-xs font-mono text-stone-400 tracking-widest uppercase mb-2">Lente de análise</div>
              <div className="flex flex-wrap gap-2">
                {RESULT_LENSES.map(l => {
                  const active = selectedLens === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLens(l.id)}
                      title={l.question}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        active
                          ? 'bg-[var(--color-brand-600)] text-white border-[var(--color-brand-600)]'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-[var(--color-brand-300)]'
                      }`}
                    >
                      {l.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Top 3 personalized */}
        {hasProfile && featured.length > 0 && (
          <section className="mb-14">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--color-brand-500)]" />
                <h2 className="font-serif text-2xl text-[var(--color-brand-800)]">
                  As 3 mais compatíveis · <span className="italic text-[var(--color-brand-500)]">{RESULT_LENSES.find(l => l.id === selectedLens)?.shortLabel}</span>
                </h2>
              </div>
              <p className="text-sm text-stone-500 mt-1">{RESULT_LENSES.find(l => l.id === selectedLens)?.question}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featured.map(career => (
                <Fragment key={career.id}>
                  <FeaturedCard career={career} riasecTop3={riasecTop3} />
                </Fragment>
              ))}
            </div>
          </section>
        )}

        {/* Divider */}
        {hasProfile && (
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-stone-200" />
            <span className="text-xs font-mono text-stone-400 tracking-widest uppercase">
              Explorar todas as carreiras
            </span>
            <div className="h-px flex-1 bg-stone-200" />
          </div>
        )}

        {/* Filtro por caminho (vindo do resultado) */}
        {pathTypes.length > 0 && (
          <div className="mb-6 flex items-center justify-between gap-3 bg-[var(--color-brand-50)] border border-[var(--color-brand-200)] rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 flex-wrap text-sm text-[var(--color-brand-800)]">
              <span className="font-medium">Carreiras deste caminho:</span>
              {pathTypes.map(t => {
                const info = RIASEC[t as RIASECType];
                return info ? (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: info.color + '18', color: info.color, border: `1px solid ${info.color}44` }}
                  >
                    {t} — {info.full}
                  </span>
                ) : null;
              })}
            </div>
            <button
              onClick={clearPathFilter}
              className="shrink-0 text-xs text-stone-500 hover:text-stone-700 font-medium"
            >
              Limpar ✕
            </button>
          </div>
        )}

        {/* Filtro por área (seleção múltipla) */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-stone-400 tracking-widest uppercase">Filtrar por área</span>
            {selectedAreas.length > 0 && (
              <button
                onClick={() => { setSelectedAreas([]); setShowAll(false); }}
                className="text-xs text-[var(--color-brand-600)] hover:underline font-medium"
              >
                Limpar seleção
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {areas.map(area => {
              const active = selectedAreas.includes(area);
              return (
                <button
                  key={area}
                  onClick={() => toggleArea(area)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    active
                      ? 'bg-[var(--color-brand-600)] text-white border-[var(--color-brand-600)]'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-[var(--color-brand-300)]'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                  {area}
                </button>
              );
            })}
          </div>
        </div>

        {/* Busca */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowAll(false); }}
            placeholder="Buscar por carreira, área ou curso..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-lg text-sm outline-none focus:border-[var(--color-brand-400)] transition-colors"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-stone-400 text-sm">Carregando carreiras...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-400 text-sm">
            Nenhuma carreira encontrada para &ldquo;{query}&rdquo;.
          </div>
        ) : (
          <>
            <p className="text-xs text-stone-400 mb-4 font-mono">
              {filtered.length} carreira{filtered.length > 1 ? 's' : ''} encontrada{filtered.length > 1 ? 's' : ''}
              {selectedAreas.length > 0 ? ` · ${selectedAreas.length} área${selectedAreas.length > 1 ? 's' : ''}` : ''}
              {query ? ` · "${query}"` : ''}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gridCareers.map(career => (
                <Fragment key={career.id}>
                  <CareerCard career={career} riasecTop3={riasecTop3} />
                </Fragment>
              ))}
            </div>

            {!showAll && filtered.length > 12 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2.5 border border-stone-200 text-stone-600 rounded-full text-sm font-medium hover:bg-stone-50 hover:border-stone-300 transition-colors"
                >
                  Ver todas as {filtered.length} carreiras
                </button>
              </div>
            )}
          </>
        )}

        <SurveyCallout jornadaId={jornadaId} />
      </main>
    </div>
  );
}
