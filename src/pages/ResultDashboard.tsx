import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, Leaf, Mail, Flame, Zap, TrendingUp, Heart, Users } from 'lucide-react';
import { useApp } from '../store';
import { supabase } from '../supabase';
import { ShareQuizLink } from '../components/ShareQuizLink';
import type { AppState } from '../store';

// ── Static maps ────────────────────────────────────────────────────────────────

const CAUSE_LABELS: Record<string, string> = {
  solidao: 'Solidão e Isolamento',
  educacao: 'Educação e Formação',
  saude: 'Saúde e Longevidade',
  cuidado: 'Cuidado com Idosos',
  desigualdade: 'Desigualdade Social',
  meio_ambiente: 'Meio Ambiente e Legado',
  saude_mental: 'Saúde Mental',
  empreendedorismo: 'Empreendedorismo',
  cultura: 'Arte, Cultura e Memória',
  intergeracoes: 'Conexão entre Gerações',
};

const COMPETENCY_LABELS: Record<string, string> = {
  lideranca: 'Liderança e Gestão',
  comunicacao: 'Comunicação e Persuasão',
  resolucao: 'Resolução de Problemas',
  empatia: 'Relações e Empatia',
  planejamento: 'Planejamento e Organização',
  conhecimento: 'Conhecimento Especializado',
  criatividade: 'Criatividade e Inovação',
  sabedoria: 'Autoconhecimento e Sabedoria',
};

type RIASECType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

const RIASEC: Record<RIASECType, { full: string; color: string; icon: string; desc: string }> = {
  R: { full: 'Prático',       color: '#f97316', icon: '🔧', desc: 'Trabalho concreto, construção e soluções tangíveis' },
  I: { full: 'Investigativo', color: '#8b5cf6', icon: '🔬', desc: 'Pesquisa, análise e curiosidade intelectual' },
  A: { full: 'Artístico',     color: '#ec4899', icon: '🎨', desc: 'Criação, expressão e imaginação' },
  S: { full: 'Social',        color: '#22c55e', icon: '🤝', desc: 'Cuidar, ensinar e conectar pessoas' },
  E: { full: 'Empreendedor',  color: '#f59e0b', icon: '🚀', desc: 'Liderar, influenciar e criar iniciativas' },
  C: { full: 'Estruturador',  color: '#06b6d4', icon: '📋', desc: 'Organizar, estruturar e garantir qualidade' },
};

const ROLE_LABELS: Record<string, string> = {
  mentor: 'Mentor(a) de jovens empreendedores',
  escritora: 'Escritor(a) de memórias e histórias de vida',
  consultor: 'Consultor(a) independente na minha área',
  professor: 'Professor(a) particular ou de oficinas',
  voluntario: 'Voluntário(a) em causa que acredito',
  podcast: 'Criador(a) de podcast ou canal de conteúdo',
  artesao: 'Artesão(ã) e criador(a) de produtos próprios',
  coach: 'Coach de transição de carreira ou vida',
  cuidador: 'Cuidador(a) especializado(a) de idosos',
  guia: 'Guia de turismo cultural ou de natureza',
  horta: 'Criador(a) de horta comunitária ou terapêutica',
  genealogia: 'Pesquisador(a) de genealogia e história familiar',
  facilitador: 'Facilitador(a) de grupos e círculos de conversa',
  fotografo: 'Fotógrafo(a) de família e momentos de vida',
  mediador: 'Mediador(a) de conflitos familiares ou comunitários',
  narrador: 'Narrador(a) de audiolivros e histórias orais',
  idiomas: 'Professor(a) de idiomas para adultos',
  palestrante: 'Palestrante sobre experiência de vida',
  acompanhante: 'Acompanhante terapêutico(a) de idosos',
  curador: 'Curador(a) de espaço cultural ou biblioteca comunitária',
  produtor: 'Produtor(a) de eventos comunitários',
  terapeuta: 'Terapeuta ou facilitador(a) de bem-estar',
  embaixador: 'Embaixador(a) de marca ou causa que acredito',
  empreendedor: 'Empreendedor(a) social de pequena escala',
};

const WHO_LABELS: Record<string, string> = {
  jovens: '🧒 Crianças e jovens', adultos: '🔄 Adultos em transição',
  pares: '🤝 Pessoas da minha geração', idosos: '👴 Idosos',
  familia: '🏠 Minha família', comunidade: '🏘️ Minha comunidade',
  vulneraveis: '🫂 Grupos vulneráveis', profissionais: '💼 Profissionais da minha área',
  estudantes: '📖 Estudantes', cuidadores: '❤️‍🩹 Cuidadores',
};

const HOW_LABELS: Record<string, string> = {
  presencial: '🤲 Presencialmente', online: '💻 Online',
  grupos: '👥 Em grupos', individual: '🫀 Um a um',
  escrito: '✍️ Por escrito', arte: '🎨 Pela arte',
  sistema: '⚙️ Indiretamente', eventos: '🎤 Em eventos',
};

const FIGURE_NAMES: Record<string, string> = {
  sanders: 'Colonel Sanders', child: 'Julia Child', moses: 'Vovó Moses', kroc: 'Ray Kroc',
  mandela: 'Nelson Mandela', frankl: 'Viktor Frankl', marco: 'Marco Aurélio', gandhi: 'Mahatma Gandhi',
  curie: 'Marie Curie', sagan: 'Carl Sagan', attenborough: 'David Attenborough',
  davinci: 'Leonardo da Vinci', kahlo: 'Frida Kahlo', tolkien: 'J.R.R. Tolkien',
  niemeyer: 'Oscar Niemeyer', drummond: 'Carlos Drummond', freire: 'Paulo Freire',
  evaristo: 'Conceição Evaristo', clarice: 'Clarice Lispector', teresa: 'Madre Teresa',
  wangari: 'Wangari Maathai', malala: 'Malala Yousafzai', drucker: 'Peter Drucker',
  buffett: 'Warren Buffett', aristoteles: 'Aristóteles',
};

const MINISTRY_LABELS: Record<string, string> = {
  economia: 'Economia', saude: 'Saúde', ciencia_tecnologia: 'Ciência e Tecnologia',
  educacao: 'Educação', justica: 'Justiça', cultura: 'Cultura',
  meio_ambiente: 'Meio Ambiente', infraestrutura: 'Infraestrutura',
  desenvolvimento_social: 'Desenvolvimento Social', comunicacoes: 'Comunicações',
};

const CARGO_LABELS: Record<string, string> = {
  ministro: 'Ministro(a)', consultor_tecnico: 'Consultor(a) Técnico(a)',
  assessor_comunicacao: 'Assessor(a) de Comunicação', diretor_operacoes: 'Diretor(a) de Operações',
  coordenador_campo: 'Coordenador(a) de Campo', secretario_social: 'Secretário(a) de Bem-Estar',
};

// ── Types ──────────────────────────────────────────────────────────────────────

interface JornadaRow {
  id: string;
  user_name: string;
  survey_completed?: boolean;
  phase_data: Partial<{
    phase1: AppState['phase1'];
    phase2: AppState['phase2'];
    phase3: AppState['phase3'];
    phase4: AppState['phase4'];
    phase5: AppState['phase5'];
    phase6: AppState['phase6'];
    phase7: AppState['phase7'];
    phase8: AppState['phase8'];
  }> | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function computeRIASECScores(duels: Record<string, string>): Record<RIASECType, number> {
  const scores: Record<RIASECType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  Object.values(duels).forEach(t => { if (t in scores) scores[t as RIASECType]++; });
  return scores;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ResultDashboard() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const [remoteData, setRemoteData] = useState<JornadaRow | null>(null);
  const [tenantConfig, setTenantConfig] = useState<{ home_url: string; explore_label: string; explore_url: string } | null>(null);

  useEffect(() => {
    supabase
      .from('tenant_configs')
      .select('home_url, explore_label, explore_url')
      .eq('host', window.location.hostname)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.explore_label && data?.explore_url) setTenantConfig(data);
      });
  }, []);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('jornadas')
      .select('id, user_name, survey_completed, phase_data')
      .eq('id', id)
      .single()
      .then(({ data }) => { if (data) setRemoteData(data as JornadaRow); });
  }, [id]);

  const name = remoteData?.user_name || state.user?.name || 'Viajante';
  const pd   = remoteData?.phase_data;

  const phase1 = pd?.phase1 ?? state.phase1;
  const phase2 = pd?.phase2 ?? state.phase2;
  const phase3 = pd?.phase3 ?? state.phase3;
  const phase4 = pd?.phase4 ?? state.phase4;
  const phase5 = pd?.phase5 ?? state.phase5;
  const phase6 = pd?.phase6 ?? state.phase6;
  const phase7 = pd?.phase7 ?? state.phase7;
  const phase8 = pd?.phase8 ?? state.phase8;

  // ── Phase 1: O que te Move ──────────────────────────────────────────────────
  const energyCards    = phase1?.energyCards    ?? {};
  const maturityVerbs  = phase1?.maturityVerbs  ?? [];
  const curiosityThemes = phase1?.curiosityThemes ?? [];
  const flowActivities  = Object.entries(energyCards).filter(([, q]) => q === 'flow').map(([a]) => a);
  const boostActivities = Object.entries(energyCards).filter(([, q]) => q === 'boost').map(([a]) => a);

  // ── Phase 2: O que Você Sabe Fazer ─────────────────────────────────────────
  const skillRatings  = phase2?.skillRatings  ?? {};
  const whoAsksYou    = phase2?.whoAsksYou    ?? [];
  const hiddenTalents = phase2?.hiddenTalents ?? [];
  const topSkills = Object.entries(skillRatings)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .filter(([, s]) => (s as number) >= 3)
    .slice(0, 5)
    .map(([skillId, score]) => ({ label: COMPETENCY_LABELS[skillId] || skillId, score: score as number }));

  // ── Phase 3: O que o Mundo Precisa ─────────────────────────────────────────
  const uniqueProblem = phase3?.uniqueProblem ?? '';
  const impactPoints  = phase3?.impactPoints  ?? {};
  const topCauses = Object.entries(impactPoints)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .filter(([, v]) => (v as number) > 0)
    .slice(0, 5);
  const maxCoins = (topCauses[0]?.[1] as number) || 1;

  // ── Phase 4: RIASEC ─────────────────────────────────────────────────────────
  const riasecScores = computeRIASECScores(phase4?.sceneDuels ?? {});
  const riasecTop3 = (Object.entries(riasecScores) as [RIASECType, number][])
    .sort((a, b) => b[1] - a[1])
    .filter(([, n]) => n > 0)
    .slice(0, 3)
    .map(([t]) => t);
  const hollandCode = riasecTop3.join('');

  // ── Phase 5: Figuras & Iniciativa ───────────────────────────────────────────
  const savedFigures = phase5?.savedFigures ?? [];
  const ministry     = phase5?.ministry ?? '';
  const cargo        = phase5?.cargo ?? '';

  // ── Phase 6: Conexões ───────────────────────────────────────────────────────
  const connections = phase6?.connections ?? [];
  const modes       = phase6?.modes       ?? [];
  const intention   = phase6?.intention   ?? '';

  // ── Phase 7: Possibilidades ─────────────────────────────────────────────────
  const savedRoles = phase7?.savedRoles ?? [];

  // ── Phase 8: Carta ──────────────────────────────────────────────────────────
  const letter = phase8?.letter ?? '';

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-stone-200">
        <div className="flex items-center gap-2 text-[var(--color-brand-600)] font-serif font-medium">
          <Leaf className="w-5 h-5" />
          <span>Reinventar</span>
        </div>
        {tenantConfig?.home_url ? (
          <a href={/^https?:\/\//.test(tenantConfig.home_url) ? tenantConfig.home_url : '#'} rel="noreferrer noopener"
            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-900)] transition-colors">
            Voltar ao início
          </a>
        ) : (
          <Link to="/" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-900)] transition-colors">
            Voltar ao início
          </Link>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-16 pb-24">

        {/* ── Hero ── */}
        <div className="text-center mb-16">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-600)] flex items-center justify-center mb-6">
            <Star className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-5xl text-[var(--color-brand-800)] mb-4">
            O Próximo Capítulo de<br/>
            <span className="italic text-[var(--color-brand-500)]">{name}</span>
          </h1>
          <p className="text-stone-500 max-w-lg mx-auto leading-relaxed">
            Esta é a síntese da sua jornada de reinvenção — o que você descobriu sobre quem você é e o que pode fazer com isso.
          </p>
        </div>

        {/* ── Carta ao Eu de Amanhã ── */}
        {letter && (
          <div className="bg-amber-950 border border-amber-800 shadow-lg rounded-xl p-8 mb-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-xl" />
            <div className="absolute top-5 right-6 text-amber-600 opacity-40">
              <Mail className="w-9 h-9" />
            </div>
            <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-3 pl-3">Carta ao Eu de Amanhã</div>
            <h3 className="font-serif text-xl pb-4 mb-5 text-amber-100 border-b border-amber-800 pl-3">Uma mensagem para você mesmo(a)</h3>
            <div className="whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-amber-100 pl-3">{letter}</div>
          </div>
        )}

        {/* ── Possibilidades que Ressoaram ── */}
        {savedRoles.length > 0 && (
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-[var(--color-brand-800)] mb-2">Possibilidades que Ressoaram</h2>
            <p className="text-stone-500 mb-6 leading-relaxed">
              As formas de atuação que chamaram sua atenção — cada uma é uma pista sobre quem você está se tornando.
            </p>
            <div className="flex flex-wrap gap-3">
              {savedRoles.map(roleId => (
                <span key={roleId} className="px-4 py-2 bg-[var(--color-brand-50)] border border-[var(--color-brand-200)] rounded-full text-sm font-medium text-[var(--color-brand-800)]">
                  {ROLE_LABELS[roleId] || roleId}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── As Quatro Dimensões ── */}
        <h2 className="font-serif text-3xl text-[var(--color-brand-800)] mb-8 text-center lg:text-left">As Quatro Dimensões</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">

          {/* Pilar 1: O que te Move */}
          <div className="bg-[var(--color-brand-50)] border border-[var(--color-brand-200)] rounded-xl p-6">
            <div className="text-xs font-mono text-[var(--color-brand-600)] tracking-wider uppercase mb-1">O que te Move</div>
            <div className="text-sm text-stone-500 mb-4">Energia, curiosidade e verbos naturais</div>

            {flowActivities.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 mb-1.5">
                  <Flame className="w-3.5 h-3.5" /> Flow — energiza de verdade
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {flowActivities.map(a => (
                    <span key={a} className="text-xs px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full border border-orange-200">{a}</span>
                  ))}
                </div>
              </div>
            )}
            {boostActivities.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 mb-1.5">
                  <Zap className="w-3.5 h-3.5" /> Boost — gosta, mas ainda explora pouco
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {boostActivities.map(a => (
                    <span key={a} className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">{a}</span>
                  ))}
                </div>
              </div>
            )}
            {maturityVerbs.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-semibold text-[var(--color-brand-700)] mb-1.5">Verbos que sempre fez naturalmente</div>
                <div className="flex flex-wrap gap-1.5">
                  {maturityVerbs.map(v => (
                    <span key={v} className="text-xs px-2.5 py-1 bg-white text-[var(--color-brand-700)] rounded-full border border-[var(--color-brand-300)] italic">{v}</span>
                  ))}
                </div>
              </div>
            )}
            {curiosityThemes.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-[var(--color-brand-700)] mb-1.5">Curiosidade natural</div>
                <div className="flex flex-wrap gap-1.5">
                  {curiosityThemes.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 bg-[var(--color-brand-100)] text-[var(--color-brand-800)] rounded-full border border-[var(--color-brand-200)]">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {flowActivities.length === 0 && boostActivities.length === 0 && maturityVerbs.length === 0 && curiosityThemes.length === 0 && (
              <div className="text-stone-400 italic text-sm">Não mapeado ainda.</div>
            )}
          </div>

          {/* Pilar 2: O que Você Sabe Fazer */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="text-xs font-mono text-orange-700 tracking-wider uppercase mb-1">O que Você Sabe Fazer</div>
            <div className="text-sm text-stone-500 mb-4">Competências, talentos e o que pedem para você</div>

            {topSkills.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-orange-700 mb-2">Competências em destaque</div>
                <div className="space-y-2">
                  {topSkills.map(({ label, score }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-orange-900 font-medium">{label}</span>
                        <span className="text-orange-600 font-mono">{score}/5</span>
                      </div>
                      <div className="h-1.5 bg-orange-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(score / 5) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {whoAsksYou.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-orange-700 mb-1.5">As pessoas te procuram para</div>
                <ul className="space-y-1">
                  {whoAsksYou.map(w => (
                    <li key={w} className="flex items-start gap-2 text-xs text-orange-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {hiddenTalents.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-orange-700 mb-1.5">Talentos ocultos</div>
                <ul className="space-y-1">
                  {hiddenTalents.map(t => (
                    <li key={t} className="flex items-start gap-2 text-xs text-orange-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {topSkills.length === 0 && whoAsksYou.length === 0 && hiddenTalents.length === 0 && (
              <div className="text-stone-400 italic text-sm">Mapeamento de talentos incompleto.</div>
            )}
          </div>

          {/* Pilar 3: O que o Mundo Precisa */}
          <div className="bg-lime-50 border border-lime-200 rounded-xl p-6">
            <div className="text-xs font-mono text-lime-700 tracking-wider uppercase mb-1">O que o Mundo Precisa</div>
            <div className="text-sm text-stone-500 mb-4">Causas e problema único</div>

            {uniqueProblem && (
              <div className="mb-4 p-3 bg-lime-100 rounded-lg border border-lime-300">
                <div className="text-xs font-semibold text-lime-700 mb-1">Problema Foco</div>
                <p className="text-sm font-medium text-lime-900">{uniqueProblem}</p>
              </div>
            )}
            {topCauses.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-lime-700 mb-2">Causas que mais importam</div>
                <div className="space-y-2">
                  {topCauses.map(([causeId, coins]) => {
                    const pct = Math.round(((coins as number) / maxCoins) * 100);
                    return (
                      <div key={causeId}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-lime-800 font-medium">{CAUSE_LABELS[causeId] || causeId}</span>
                          <span className="text-lime-600 font-mono">{coins as number}🪙</span>
                        </div>
                        <div className="h-1.5 bg-lime-100 rounded-full overflow-hidden">
                          <div className="h-full bg-lime-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {!uniqueProblem && topCauses.length === 0 && (
              <div className="text-stone-400 italic text-sm">Missão de impacto não definida.</div>
            )}
          </div>

          {/* Pilar 4: Perfil de Personalidade */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
            <div className="text-xs font-mono text-stone-700 tracking-wider uppercase mb-1">Perfil de Personalidade</div>
            <div className="text-sm text-stone-500 mb-4">Como você prefere trabalhar e criar</div>

            {riasecTop3.length > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-stone-700">Código Holland</span>
                  <span className="font-mono font-black text-sm tracking-widest px-2 py-0.5 rounded bg-stone-200 border border-stone-300 text-stone-800">
                    {hollandCode}
                  </span>
                </div>
                <div className="space-y-3">
                  {riasecTop3.map(t => {
                    const info = RIASEC[t];
                    return (
                      <div key={t} className="flex items-start gap-2">
                        <span className="shrink-0 text-base">{info.icon}</span>
                        <div>
                          <span className="text-sm font-semibold" style={{ color: info.color }}>{info.full}</span>
                          <span className="text-xs text-stone-500 ml-1">— {info.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {(ministry || cargo) && (
                  <div className="mt-4 pt-4 border-t border-stone-200">
                    <div className="text-xs font-semibold text-stone-700 mb-1">Iniciativa de Impacto</div>
                    <p className="text-xs text-stone-600">
                      {ministry && `Área: ${MINISTRY_LABELS[ministry] || ministry}`}
                      {ministry && cargo && ' · '}
                      {cargo && `Papel: ${CARGO_LABELS[cargo] || cargo}`}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-stone-400 italic text-sm">Perfil não mapeado.</div>
            )}
          </div>
        </div>

        {/* ── Suas Conexões ── */}
        {(connections.length > 0 || modes.length > 0 || intention) && (
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-[var(--color-brand-800)] mb-8 text-center lg:text-left">Suas Conexões</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {connections.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-[var(--color-brand-600)]" />
                    <span className="text-xs font-mono text-[var(--color-brand-600)] tracking-wider uppercase">Com quem</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {connections.map(connId => (
                      <span key={connId} className="text-xs px-2.5 py-1 bg-[var(--color-brand-50)] text-[var(--color-brand-700)] rounded-full border border-[var(--color-brand-200)]">
                        {WHO_LABELS[connId] || connId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {modes.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[var(--color-brand-600)]" />
                    <span className="text-xs font-mono text-[var(--color-brand-600)] tracking-wider uppercase">Como</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {modes.map(modeId => (
                      <span key={modeId} className="text-xs px-2.5 py-1 bg-[var(--color-brand-50)] text-[var(--color-brand-700)] rounded-full border border-[var(--color-brand-200)]">
                        {HOW_LABELS[modeId] || modeId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {intention && (
                <div className="bg-white border border-stone-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-[var(--color-brand-600)]" />
                    <span className="text-xs font-mono text-[var(--color-brand-600)] tracking-wider uppercase">Intenção</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-6">{intention}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Referências Inspiradoras ── */}
        {savedFigures.length > 0 && (
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-[var(--color-brand-800)] mb-4 text-center lg:text-left">Referências Inspiradoras</h2>
            <p className="text-stone-500 mb-6 leading-relaxed">As figuras que ressoaram durante a jornada — pistas sobre seus valores e aspirações.</p>
            <div className="flex flex-wrap gap-2">
              {savedFigures.map(figId => (
                <span key={figId} className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-full border border-stone-200 text-sm">
                  {FIGURE_NAMES[figId] || figId}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer ── */}
        <div className="mt-4 text-center">
          <p className="text-stone-400 italic mb-6">"O próximo capítulo não começa com uma decisão perfeita — começa com um primeiro passo honesto."</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {tenantConfig?.explore_url && (
              <a
                href={/^https?:\/\//.test(tenantConfig.explore_url)
                  ? `${tenantConfig.explore_url}${tenantConfig.explore_url.includes('?') ? '&' : '?'}am_id=${encodeURIComponent(id ?? '')}`
                  : '#'}
                rel="noreferrer noopener"
                className="inline-block px-6 py-2.5 bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)] rounded-full font-medium transition-colors shadow-sm"
              >
                {tenantConfig.explore_label}
              </a>
            )}
            {!remoteData?.survey_completed && (
              <Link
                to={`/comecar/pesquisa${id ? `?id=${id}` : ''}`}
                className="inline-block px-6 py-2.5 border border-[var(--color-brand-300)] text-[var(--color-brand-600)] hover:bg-[var(--color-brand-50)] rounded-full font-medium transition-colors"
              >
                Pesquisa de Satisfação
              </Link>
            )}
          </div>
          {!remoteData?.survey_completed && (
            <p className="mt-3 text-sm text-stone-500">
              Responda a pesquisa para receber o seu relatório aprofundado ✨
            </p>
          )}
          {id && (
            <div className="mt-6">
              <ShareQuizLink jornadaId={id} homeUrl={tenantConfig?.home_url} />
            </div>
          )}
          <div className="mt-3">
            {tenantConfig?.home_url ? (
              <a href={/^https?:\/\//.test(tenantConfig.home_url) ? tenantConfig.home_url : '#'} rel="noreferrer noopener"
                className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
                Voltar ao Início
              </a>
            ) : (
              <Link to="/" className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
                Voltar ao Início
              </Link>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
