import { useState, useEffect, useMemo, Fragment } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Leaf, Search, TrendingUp, GraduationCap, Check, Compass } from 'lucide-react';
import { useApp } from '../store';
import { supabase } from '../supabase';
import { SurveyCallout } from '../components/SurveyCallout';
import { CourseList } from '../components/CourseList';
import {
  computeCareerCompatibility,
  computeUserProfile,
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

// Card de carreira resultante, destacando os cursos selecionados que levam a ela
function CareerResult({ career, selected, riasecTop3 }: { career: ScoredCareer; selected: Set<string>; riasecTop3: RIASECType[] }) {
  const compat = compatLabel(career.score);
  const matchingCourses = career.courses.filter(c => selected.has(c.name));

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-3 hover:border-[var(--color-brand-300)] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400 block mb-1">{career.area}</span>
          <h3 className="font-bold text-[var(--color-brand-900)] text-base leading-tight">{career.profession}</h3>
        </div>
        {riasecTop3.length > 0 && (
          <div className="shrink-0 text-right">
            <div className="text-lg font-black" style={{ color: compat.color }}>{career.score}%</div>
            <div
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
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

      {/* Conexão com o(s) curso(s) selecionado(s) */}
      {matchingCourses.length > 0 && (
        <div className="border-t border-stone-100 pt-3 flex items-start gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-[var(--color-brand-500)] shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-stone-400 mb-0.5">Você chega aqui por</div>
            <p className="text-xs font-semibold text-[var(--color-brand-700)]">
              {Array.from(new Set(matchingCourses.map(c => c.name))).join(' · ')}
            </p>
          </div>
        </div>
      )}

      {/* Onde estudar (Brasil + exterior) */}
      <div className="border-t border-stone-100 pt-3">
        <div className="text-[10px] font-mono tracking-widest uppercase text-stone-400 mb-2">Onde estudar</div>
        <CourseList courses={career.courses} />
      </div>

      {career.trend_demand && (
        <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
          <TrendingUp className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
          <span>{career.trend_demand}</span>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExplorarPorCurso() {
  const { state } = useApp();
  const [searchParams] = useSearchParams();
  const jornadaId = searchParams.get('id');

  const [remoteData, setRemoteData] = useState<{ mission_data: Record<string, unknown> } | null>(null);
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseQuery, setCourseQuery] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const toggleCourse = (name: string) => {
    setSelectedCourses(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
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

  // Índice de cursos: nome → nº de carreiras que ele alcança
  const courseIndex = useMemo(() => {
    const counts = new Map<string, number>();
    careers.forEach(c => {
      // Só cursos brasileiros no seletor (os internacionais são equivalentes e aparecem no resultado)
      new Set<string>(c.courses.filter(co => (co.sort_order ?? 1) <= 3).map(co => co.name)).forEach(n => counts.set(n, (counts.get(n) || 0) + 1));
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [careers]);

  // Chips visíveis: busca filtra os 126; sem busca, mostra os mais comuns + os já selecionados
  const visibleCourses = useMemo(() => {
    const q = courseQuery.trim().toLowerCase();
    if (q) return courseIndex.filter(c => c.name.toLowerCase().includes(q)).slice(0, 60);
    const top = courseIndex.slice(0, 24);
    const selectedOutside = courseIndex.filter(
      c => selectedCourses.includes(c.name) && !top.some(t => t.name === c.name),
    );
    return [...selectedOutside, ...top];
  }, [courseIndex, courseQuery, selectedCourses]);

  const selectedSet = useMemo(() => new Set(selectedCourses), [selectedCourses]);
  const matched = useMemo(() => {
    if (selectedCourses.length === 0) return [];
    return scoredCareers.filter(c => c.courses.some(co => selectedSet.has(co.name)));
  }, [scoredCareers, selectedCourses, selectedSet]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">

      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-stone-200">
        <div className="flex items-center gap-2 text-[var(--color-brand-600)] font-serif font-medium">
          <Leaf className="w-5 h-5" />
          <span>Jornada Ikigai</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={`/explorar-cursos${jornadaId ? `?id=${jornadaId}` : ''}`}
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-[var(--color-brand-700)] font-medium transition-colors"
          >
            <Compass className="w-4 h-4" /> Explorar por Carreira
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
        <div className="mb-8">
          <p className="text-xs font-mono text-stone-400 tracking-widest uppercase mb-2">
            Explorar Cursos
          </p>
          <h1 className="font-serif text-4xl text-[var(--color-brand-900)] mb-3">
            Comece pelo curso que te atrai
          </h1>
          <p className="text-stone-500 max-w-2xl leading-relaxed">
            Selecione os cursos de graduação que despertam seu interesse e descubra para quais
            carreiras eles abrem portas{hasProfile ? ' — ordenadas pela compatibilidade com o seu Ikigai' : ''}.
          </p>
        </div>

        {/* Seleção de cursos (múltipla) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-stone-400 tracking-widest uppercase">
              Selecione os cursos
            </span>
            {selectedCourses.length > 0 && (
              <button
                onClick={() => setSelectedCourses([])}
                className="text-xs text-[var(--color-brand-600)] hover:underline font-medium"
              >
                Limpar ({selectedCourses.length})
              </button>
            )}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={courseQuery}
              onChange={e => setCourseQuery(e.target.value)}
              placeholder="Buscar curso (ex: Direito, Engenharia, Psicologia)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-lg text-sm outline-none focus:border-[var(--color-brand-400)] transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {visibleCourses.map(({ name, count }) => {
              const active = selectedSet.has(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleCourse(name)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    active
                      ? 'bg-[var(--color-brand-600)] text-white border-[var(--color-brand-600)]'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-[var(--color-brand-300)]'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                  {name}
                  <span className={active ? 'text-white/70' : 'text-stone-400'}>· {count}</span>
                </button>
              );
            })}
          </div>
          {!courseQuery && courseIndex.length > 24 && (
            <p className="text-xs text-stone-400 mt-3">
              Mostrando os {Math.min(24, courseIndex.length)} cursos mais comuns · use a busca para os outros {courseIndex.length - 24}.
            </p>
          )}
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="text-center py-20 text-stone-400 text-sm">Carregando cursos...</div>
        ) : selectedCourses.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 text-stone-300" />
            <p className="text-sm">Selecione um ou mais cursos acima para ver as carreiras que eles alcançam.</p>
          </div>
        ) : matched.length === 0 ? (
          <div className="text-center py-20 text-stone-400 text-sm">
            Nenhuma carreira encontrada para os cursos selecionados.
          </div>
        ) : (
          <>
            <p className="text-xs text-stone-400 mb-4 font-mono">
              {matched.length} carreira{matched.length > 1 ? 's' : ''} a partir de {selectedCourses.length} curso{selectedCourses.length > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matched.map(career => (
                <Fragment key={career.id}>
                  <CareerResult career={career} selected={selectedSet} riasecTop3={riasecTop3} />
                </Fragment>
              ))}
            </div>
          </>
        )}

        <SurveyCallout jornadaId={jornadaId} />
      </main>
    </div>
  );
}
