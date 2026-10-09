import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, Leaf, Mail, Flame, Zap, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';
import { useApp } from '../store';
import { supabase } from '../supabase';
import { ShareQuizLink } from '../components/ShareQuizLink';
import { MINISTRY_NAMES, CARGO_NAMES, computeResultLenses } from '../lib/ikigai-analysis';
import type { AppState } from '../store';

// ─── Career types ────────────────────────────────────────────────────────────

interface Course {
  id: number;
  career_id: number;
  name: string;
  university: string | null;
  summary: string | null;
  link: string | null;
}

interface Career {
  id: number;
  area: string;
  profession: string;
  description: string | null;
  trend_demand: string | null;
  ikigai_pillars: string[];
  riasec_types: string[];
  intelligence_types: string[];
  courses: Course[];
}

// ─── Static maps ────────────────────────────────────────────────────────────

const INT_NAMES: Record<string, string> = {
  log:   'Lógica & Números',
  ling:  'Comunicação',
  esp:   'Visão Espacial',
  cin:   'Físico & Motor',
  mus:   'Musical',
  inter: 'Relações & Empatia',
  intra: 'Autoconhecimento',
  nat:   'Natureza & Biologia',
};

const ARCHETYPES_INFO: Record<string, { title: string; desc: string }> = {
  builder:   { title: 'Construtor(a)',  desc: 'Engenharia, Programação, Arquitetura' },
  optimizer: { title: 'Otimizador(a)', desc: 'Dados, Finanças, Logística' },
  caregiver: { title: 'Cuidador(a)',   desc: 'Saúde, Psicologia, Ensino' },
  creator:   { title: 'Criativo(a)',   desc: 'Design, Arte, Marketing' },
  explorer:  { title: 'Explorador(a)', desc: 'Ciência, Pesquisa' },
  maestro:   { title: 'Maestro(a)',    desc: 'Gestão, Empreendedorismo' },
};

const CAUSE_LABELS: Record<string, string> = {
  saude_mental:  'Saúde Mental',
  educacao:      'Educação',
  tech_etica:    'Tecnologia Ética',
  meio_ambiente: 'Meio Ambiente',
  desigualdade:  'Desigualdade Social',
  saude:         'Saúde Física',
  cidades:       'Cidades e Mobilidade',
  cultura:       'Cultura e Arte',
  ciencia:       'Ciência e Inovação',
  animal:        'Bem-estar Animal',
};

type RIASECType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

const RIASEC: Record<RIASECType, { full: string; color: string; icon: string; desc: string; careers: string[] }> = {
  R: { full: 'Realista',       color: '#f97316', icon: '🔧', desc: 'Trabalho prático, ferramentas, espaço físico',           careers: ['Engenheiro', 'Arquiteto', 'Técnico', 'Atleta'] },
  I: { full: 'Investigativo',  color: '#8b5cf6', icon: '🔬', desc: 'Pesquisa, análise e resolução de problemas complexos',  careers: ['Cientista', 'Analista', 'Médico', 'Programador'] },
  A: { full: 'Artístico',      color: '#ec4899', icon: '🎨', desc: 'Criação, expressão e imaginação',                       careers: ['Designer', 'Escritor', 'Músico', 'Cineasta'] },
  S: { full: 'Social',         color: '#22c55e', icon: '🤝', desc: 'Ajudar, ensinar e conectar pessoas',                    careers: ['Professor', 'Psicólogo', 'Terapeuta', 'Assistente Social'] },
  E: { full: 'Empreendedor',   color: '#f59e0b', icon: '🚀', desc: 'Liderar, influenciar e criar negócios',                 careers: ['Empresário', 'Gerente', 'Advogado', 'Produtor'] },
  C: { full: 'Convencional',   color: '#06b6d4', icon: '📊', desc: 'Organizar, estruturar e trabalhar com dados',           careers: ['Contador', 'Administrador', 'Auditor', 'Analista Fin.'] },
};

// Activity → RIASEC (primary signal)
const ACTIVITY_RIASEC: Record<string, RIASECType> = {
  'Escrever histórias':              'A',
  'Resolver problemas matemáticos':  'I',
  'Desenhar e criar':                'A',
  'Falar em público':                'E',
  'Cuidar de pessoas/animais':       'S',
  'Organizar e planejar':            'C',
  'Liderar grupos':                  'E',
  'Criar vídeos ou conteúdo':        'A',
  'Ler e pesquisar':                 'I',
  'Fazer experimentos':              'R',
  'Ajudar os outros':                'S',
  'Trabalhar com tecnologia':        'I',
};

// Intelligence → RIASEC
const INT_RIASEC: Record<string, RIASECType> = {
  linguistica:   'A',
  logico:        'I',
  espacial:      'A',
  corporal:      'R',
  musical:       'A',
  interpessoal:  'S',
  intrapessoal:  'E',
  naturalista:   'R',
};

// Archetype → RIASEC
const ARCH_RIASEC: Record<string, RIASECType> = {
  builder:   'R',
  optimizer: 'C',
  caregiver: 'S',
  creator:   'A',
  explorer:  'I',
  maestro:   'E',
};

// Curiosity theme → RIASEC
const CURIOSITY_RIASEC: Record<string, RIASECType> = {
  'Tecnologia':       'I',
  'Arte e Design':    'A',
  'Psicologia':       'S',
  'Finanças':         'C',
  'Biologia e Natureza': 'R',
  'História':         'I',
  'Ciência e Espaço': 'I',
  'Empreendedorismo': 'E',
  'Esportes':         'R',
  'Música':           'A',
  'Política':         'E',
};

// Career convergence suggestions (require types to be in user's top 3)
const CAREER_PATHS: { types: RIASECType[]; title: string; desc: string; examples: string[] }[] = [
  { types: ['I', 'A'], title: 'Inovação Criativa',           desc: 'Onde ciência e arte se encontram',                       examples: ['UX Design', 'Games', 'IA Criativa', 'Arquitetura'] },
  { types: ['S', 'A'], title: 'Criatividade com Propósito',  desc: 'Expressão que transforma vidas',                        examples: ['Arte-Terapia', 'Educação Criativa', 'Jornalismo Social'] },
  { types: ['E', 'I'], title: 'Empreendedorismo Científico', desc: 'Inovar com base em dados e visão',                      examples: ['Startups de Tech', 'Consultoria', 'Inovação Corporativa'] },
  { types: ['S', 'I'], title: 'Ciências da Saúde e Humanas', desc: 'Cuidar com rigor e empatia',                            examples: ['Psicologia', 'Saúde Pública', 'Neurociência', 'Educação'] },
  { types: ['R', 'I'], title: 'Engenharia e Tecnologia',     desc: 'Construir sistemas que funcionam',                      examples: ['Engenharia de Software', 'Biotecnologia', 'Automação'] },
  { types: ['A', 'E'], title: 'Empreendedorismo Criativo',   desc: 'Criar e escalar negócios com alma',                     examples: ['Agência Criativa', 'Produção Cultural', 'Marketing'] },
  { types: ['S', 'E'], title: 'Liderança com Impacto',       desc: 'Mover pessoas rumo a um bem maior',                    examples: ['ONG / Terceiro Setor', 'Políticas Públicas', 'RH Estratégico'] },
  { types: ['I', 'C'], title: 'Dados e Inteligência',        desc: 'Extrair sentido da complexidade',                       examples: ['Ciência de Dados', 'Business Intelligence', 'Pesquisa'] },
  { types: ['R', 'E'], title: 'Empreendedorismo Prático',    desc: 'Construir negócios com mãos na massa',                  examples: ['Construção Civil', 'Agronegócio', 'Indústria', 'Logística'] },
  { types: ['A', 'C'], title: 'Design e Comunicação',        desc: 'Beleza com precisão e estratégia',                     examples: ['Design Gráfico', 'Publicidade', 'UX Writing', 'Editorial'] },
  { types: ['S', 'C'], title: 'Gestão de Pessoas e Processos', desc: 'Cuidar de equipes com estrutura',                   examples: ['RH', 'Gestão Educacional', 'Saúde Hospitalar', 'Administração Pública'] },
  { types: ['R', 'C'], title: 'Tecnologia Operacional',      desc: 'Sistemas físicos com excelência técnica',               examples: ['Engenharia Industrial', 'TI Operacional', 'Qualidade e Processos'] },
  { types: ['E', 'A'], title: 'Influência e Cultura',        desc: 'Liderar através da criação',                           examples: ['Influência Digital', 'Direção Criativa', 'Branding'] },
  { types: ['I', 'S'], title: 'Psicologia e Ciências Sociais', desc: 'Entender a mente e a sociedade',                    examples: ['Pesquisa Social', 'Neuropsicologia', 'Antropologia'] },
  { types: ['R', 'A'], title: 'Design Industrial e Artesanato', desc: 'Criar objetos bonitos e funcionais',               examples: ['Design de Produto', 'Arquitetura', 'Artesanato Digital'] },
];

// ─── Types ──────────────────────────────────────────────────────────────────

interface JornadaRow {
  id: string;
  user_name: string;
  survey_completed?: boolean;
  mission_data: {
    mission1?: AppState['mission1'];
    mission2?: AppState['mission2'];
    mission3?: AppState['mission3'];
    mission4?: AppState['mission4'];
    mission5?: AppState['mission5'];
    mission6?: AppState['mission6'];
    mission8?: AppState['mission8'];
  } | null;
}

// ─── Analysis helpers ────────────────────────────────────────────────────────

function computeRIASECScores(duels: Record<string, string>): Record<RIASECType, number> {
  const scores: Record<RIASECType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  Object.values(duels).forEach(t => {
    if (t in scores) scores[t as RIASECType]++;
  });
  return scores;
}

function sortedTypes(scores: Record<RIASECType, number>): RIASECType[] {
  return (Object.entries(scores) as [RIASECType, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);
}

interface CrossSignal {
  type: RIASECType;
  sources: string[];
  strength: number;
}

function buildCrossSignals(
  riasecTop: RIASECType[],
  passionActivities: string[],
  topIntIds: string[],
  selectedArchetypes: string[],
  curiosityRadar: string[],
): CrossSignal[] {
  const sources: Record<RIASECType, string[]> = { R: [], I: [], A: [], S: [], E: [], C: [] };

  // M4 duels (weight: 3 for 1st, 2 for 2nd, 1 for 3rd)
  riasecTop.slice(0, 3).forEach((t, i) => {
    const labels = ['tipo principal', 'tipo secundário', 'terceiro tipo'];
    sources[t].push(`Duelos RIASEC (${labels[i]})`);
  });

  // M1 flow/boost
  passionActivities.forEach(act => {
    const t = ACTIVITY_RIASEC[act];
    if (t) sources[t].push(`Atividade: "${act}"`);
  });

  // M5 intelligences
  topIntIds.forEach(id => {
    const t = INT_RIASEC[id];
    if (t) sources[t].push(`Inteligência: ${INT_NAMES[id]}`);
  });

  // M6 archetypes
  selectedArchetypes.forEach(arch => {
    const t = ARCH_RIASEC[arch];
    const info = ARCHETYPES_INFO[arch];
    if (t && info) sources[t].push(`Arquétipo: ${info.title}`);
  });

  // M1 curiosity radar
  curiosityRadar.forEach(theme => {
    const t = CURIOSITY_RIASEC[theme];
    if (t) sources[t].push(`Curiosidade: ${theme}`);
  });

  return (Object.entries(sources) as [RIASECType, string[]][])
    .map(([type, srcs]) => ({ type, sources: srcs, strength: srcs.length }))
    .sort((a, b) => b.strength - a.strength)
    .filter(s => s.strength > 0);
}

interface Tension {
  title: string;
  body: string;
}

function detectTensions(
  riasecTop3: RIASECType[],
  passionActivities: string[],
  drainActivities: string[],
  selectedArchetypes: string[],
): Tension[] {
  const tensions: Tension[] = [];
  const topSet = new Set(riasecTop3.slice(0, 2));

  // Archetype conflicts with RIASEC
  const archTypes = selectedArchetypes.map(a => ARCH_RIASEC[a]).filter(Boolean) as RIASECType[];
  const archConflicts = archTypes.filter(t => !topSet.has(t));
  if (archConflicts.length > 0 && archTypes.length > 0 && archConflicts.length === archTypes.length) {
    const archLabels = selectedArchetypes.map(a => ARCHETYPES_INFO[a]?.title).filter(Boolean);
    tensions.push({
      title: 'Arquétipos vs. preferências visuais',
      body: `Você se identificou como ${archLabels.join(' e ')} na Missão 6, mas nos Duelos de Cenas seu perfil predominante foi ${RIASEC[riasecTop3[0]]?.full}. Isso pode indicar que suas aspirações profissionais conscientes diferem das suas atrações instintivas — ambas são informações válidas.`,
    });
  }

  // Drain activities align with top RIASEC
  const drainMapped = drainActivities.map(a => ACTIVITY_RIASEC[a]).filter(Boolean) as RIASECType[];
  const topRIASECDrained = drainMapped.filter(t => t === riasecTop3[0]);
  if (topRIASECDrained.length >= 2) {
    tensions.push({
      title: 'Energia invertida no perfil dominante',
      body: `Seu tipo RIASEC principal (${RIASEC[riasecTop3[0]]?.full}) sugere afinidade com certas atividades, mas algumas delas foram classificadas como "drain" na Missão 1. Pode valer explorar qual contexto específico faz essa diferença — às vezes o problema é o ambiente, não a atividade em si.`,
    });
  }

  // Low diversity: all top 3 same direction (e.g., all analytical)
  const analyticalTypes: RIASECType[] = ['I', 'C'];
  const socialTypes: RIASECType[] = ['S', 'E'];
  const creativeTypes: RIASECType[] = ['A', 'R'];
  const allAnalytical = riasecTop3.slice(0, 3).every(t => analyticalTypes.includes(t));
  const allSocial = riasecTop3.slice(0, 3).every(t => socialTypes.includes(t));
  if (allAnalytical && passionActivities.some(a => ACTIVITY_RIASEC[a] === 'A' || ACTIVITY_RIASEC[a] === 'S')) {
    tensions.push({
      title: 'Curiosidade criativa vs. perfil analítico',
      body: 'Seus duelos apontam fortemente para análise e dados, mas algumas das suas atividades de energia alta têm caráter criativo ou social. Explorar essa zona híbrida pode revelar caminhos mais completos para você.',
    });
  }
  if (allSocial && passionActivities.some(a => ACTIVITY_RIASEC[a] === 'I' || ACTIVITY_RIASEC[a] === 'C')) {
    tensions.push({
      title: 'Perfil social com interesse analítico',
      body: 'Seu perfil RIASEC predomina no espectro social, mas você demonstrou interesse em atividades mais analíticas. Isso pode indicar potencial para papéis que combinam gestão de pessoas com rigor técnico.',
    });
  }
  void creativeTypes; // used for future patterns

  return tensions;
}

// ─── Compatibility scoring ────────────────────────────────────────────────────

// ─── Component ───────────────────────────────────────────────────────────────

interface LensCareer {
  profession: string;
  area: string;
  riasec_types: string[];
  intelligence_types: string[];
  ikigai_pillars: string[];
}

export default function ResultDashboard() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const [remoteData, setRemoteData] = useState<JornadaRow | null>(null);
  const [lensCareers, setLensCareers] = useState<LensCareer[]>([]);
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
    supabase
      .from('careers')
      .select('profession, area, riasec_types, intelligence_types, ikigai_pillars')
      .eq('active', true)
      .then(({ data }) => { if (data) setLensCareers(data as LensCareer[]); });
  }, []);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('jornadas')
      .select('id, user_name, survey_completed, mission_data')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) setRemoteData(data as JornadaRow);
      });
  }, [id]);

  const name      = remoteData?.user_name || state.user?.name || 'Viajante';
  const mission1  = remoteData?.mission_data?.mission1 ?? state.mission1;
  const mission2  = remoteData?.mission_data?.mission2 ?? state.mission2;
  const mission3  = remoteData?.mission_data?.mission3 ?? state.mission3;
  const mission4  = remoteData?.mission_data?.mission4 ?? state.mission4;
  const mission5  = remoteData?.mission_data?.mission5 ?? state.mission5;
  const mission6  = remoteData?.mission_data?.mission6 ?? state.mission6;
  const ministryName = mission5?.ministry ? (MINISTRY_NAMES[mission5.ministry] || '') : '';
  const cargoName    = mission5?.cargo ? (CARGO_NAMES[mission5.cargo] || '') : '';
  const mission8  = remoteData?.mission_data?.mission8 ?? state.mission8;

  // 3 Caminhos (lentes): cada um pondera sinais diferentes da jornada
  const lenses = lensCareers.length > 0
    ? computeResultLenses<LensCareer>({ mission1, mission2, mission3, mission4, mission5, mission6 }, lensCareers)
    : [];
  // Convergência: quando as 3 lentes apontam para a mesma área
  const lensTopAreas = lenses.map(l => l.items[0]?.career.area).filter(Boolean) as string[];
  const convergentArea = lensTopAreas.length === lenses.length && lenses.length > 0 && new Set(lensTopAreas).size === 1
    ? lensTopAreas[0]
    : '';

  // ── Pilar 1: O que você ama ─────────────────────────────────────────────
  const energyCards      = mission1?.energyCards || {};
  const flowActivities   = Object.entries(energyCards).filter(([, q]) => q === 'flow').map(([a]) => a);
  const boostActivities  = Object.entries(energyCards).filter(([, q]) => q === 'boost').map(([a]) => a);
  const drainActivities  = Object.entries(energyCards).filter(([, q]) => q === 'drain').map(([a]) => a);
  const passionActivities = [...flowActivities, ...boostActivities];
  const curiosityRadar   = mission1?.curiosityRadar || [];
  const childhoodVerbs   = mission1?.childhoodVerbs || [];

  // ── Pilar 2: No que é bom ────────────────────────────────────────────────
  // Computa score médio por inteligência a partir dos ratings detalhados da missão 2
  const rawDetailRatings = mission2?.detailRatings || {};
  const intScores: Record<string, number> = Object.fromEntries(
    Object.entries(rawDetailRatings).map(([id, ratings]) => {
      const arr = ratings as number[];
      return [id, arr.reduce((a, b) => a + b, 0) / arr.length];
    })
  );
  const topIntIds      = Object.entries(intScores)
    .filter(([, s]) => s >= 3.0)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
  const topIntNames    = topIntIds.map(id => INT_NAMES[id] || id);

  const riasecScores   = computeRIASECScores(mission4?.sceneDuels || {});
  const riasecSorted   = sortedTypes(riasecScores);
  const riasecTop3     = riasecSorted.filter(t => riasecScores[t] > 0).slice(0, 3);
  const hollandCode    = riasecTop3.join('');

  // ── Pilar 3: O que o mundo precisa ──────────────────────────────────────
  const uniqueProblem  = mission3?.uniqueProblem || '';
  const impactPoints   = mission3?.impactPoints || {};
  const topCauses      = Object.entries(impactPoints)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .filter(([, v]) => (v as number) > 0)
    .slice(0, 4);
  const maxCauseCoins  = topCauses[0]?.[1] as number || 1;
  const contributionType = mission3?.contributionType || [];
  const impactScale    = mission3?.impactScale || '';

  // ── Pilar 4: Pelo que pode ser pago ─────────────────────────────────────
  const selectedArchetypes = mission6?.selectedArchetypes || [];
  const futureTech         = mission6?.futureVision?.q2 || '';
  const ultimateRole       = mission6?.ultimateRole || '';

  // ── Carta ────────────────────────────────────────────────────────────────
  const future = mission8?.future || {};
  const autoLetter = Object.keys(future).length > 0
    ? `Querido(a) eu do futuro...\n\nHoje, imaginei que daqui a 10 anos estarei vivendo ${future.morando?.toLowerCase() || 'em algum lugar incrível'}, e estarei acompanhado(a) ${future.companhia?.toLowerCase() || 'de quem amo'}. \n\nMinha rotina ideal começa de uma forma bem específica: ${future.manha?.toLowerCase() || 'com bastante calma'}. Durante o dia, passo a maior parte do tempo trabalhando ${future.trabalho?.toLowerCase() || 'com meu propósito'}, e a sensação de que valeu a pena vem de ${future.fim_dia?.toLowerCase() || 'fazer o que gosto'}.\n\nNão quero esquecer dessa visão, vou lutar por ela.\nAssinado,\nEu do presente.`
    : '';
  const letter = mission8?.letter || autoLetter;

  // ── Analysis ─────────────────────────────────────────────────────────────
  const crossSignals = buildCrossSignals(riasecSorted, passionActivities, topIntIds, selectedArchetypes, curiosityRadar);
  const topSignal    = crossSignals[0];
  const tensions     = detectTensions(riasecTop3, passionActivities, drainActivities, selectedArchetypes);

  const hasAnalysis = riasecTop3.length > 0 || crossSignals.length > 0;

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-stone-200">
        <div className="flex items-center gap-2 text-[var(--color-brand-600)] font-serif font-medium">
          <Leaf className="w-5 h-5" />
          <span>Jornada Ikigai</span>
        </div>
        {tenantConfig?.home_url ? (
          <a href={/^https?:\/\//.test(tenantConfig.home_url) ? tenantConfig.home_url : '#'} rel="noreferrer noopener" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-900)] transition-colors">
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
            O Ikigai de <span className="italic text-[var(--color-brand-500)]">{name}</span>
          </h1>
          <p className="text-stone-500 max-w-lg mx-auto">
            Esta é a síntese da sua jornada e as profissões que mais combinam com o seu Ikigai.
          </p>
        </div>

        {/* ── Mandala + Carta ── */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16 items-start justify-center">
          <div className="bg-white border text-center p-8 border-stone-200 rounded-xl overflow-hidden relative w-full lg:w-1/2">
            <h3 className="font-serif text-xl text-[var(--color-brand-800)] mb-12 text-center lg:text-left">Sua Mandala Ikigai</h3>
            <div className="relative w-72 h-72 mx-auto mt-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border bg-[var(--color-brand-50)]/60 mix-blend-multiply flex flex-col items-center justify-start pt-6 c-love">
                <span className="text-[10px] font-mono text-[var(--text-main)] opacity-90 uppercase tracking-wider text-center drop-shadow-md">O que<br/>você AMA</span>
              </div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-40 h-40 rounded-full border mix-blend-multiply flex flex-col items-end justify-center pr-6 c-good">
                <span className="text-[10px] font-mono text-[var(--text-main)] opacity-90 uppercase tracking-wider text-right drop-shadow-md">No que<br/>é BOM</span>
              </div>
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-40 h-40 rounded-full border mix-blend-multiply flex flex-col items-start justify-center pl-6 c-world">
                <span className="text-[10px] font-mono text-[var(--text-main)] opacity-90 uppercase tracking-wider text-left drop-shadow-md">O mundo<br/>PRECISA</span>
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border mix-blend-multiply flex flex-col items-center justify-end pb-6 c-paid">
                <span className="text-[10px] font-mono text-[var(--text-main)] opacity-90 uppercase tracking-wider text-center drop-shadow-md">Pode ser<br/>PAGO</span>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black p-4 rounded-full font-black text-lg shadow-2xl border-4 border-cyan-400 z-10">
                IKIGAI
              </div>
            </div>
          </div>

          {letter && (
            <div className="bg-amber-950 border border-amber-800 shadow-lg rounded-xl p-8 w-full lg:w-1/2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-xl" />
              <div className="absolute top-5 right-6 text-amber-600 opacity-40">
                <Mail className="w-9 h-9" />
              </div>
              <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-3 pl-3">Carta do Eu do Futuro</div>
              <h3 className="font-serif text-xl pb-4 mb-5 text-amber-100 border-b border-amber-800 pl-3">Uma mensagem para você</h3>
              <div className="whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-amber-100 pl-3">{letter}</div>
            </div>
          )}
        </div>

        {/* ── 4 Pilares ── */}
        <h2 className="font-serif text-3xl text-[var(--color-brand-800)] mb-8 text-center lg:text-left">Os 4 Pilares da sua Escolha</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">

          {/* Pilar 1: O que você ama */}
          <div className="bg-[var(--color-brand-50)] border border-[var(--color-brand-200)] rounded-xl p-6">
            <div className="text-xs font-mono text-[var(--color-brand-600)] tracking-wider uppercase mb-1">O que você ama</div>
            <div className="text-sm text-stone-500 mb-4">Interesses, fluidez e curiosidade</div>
            {flowActivities.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 mb-1.5">
                  <Flame className="w-3.5 h-3.5" /> Flow — te energiza de verdade
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
                  <Zap className="w-3.5 h-3.5" /> Boost — gosta, mas ainda não explora muito
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {boostActivities.map(a => (
                    <span key={a} className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">{a}</span>
                  ))}
                </div>
              </div>
            )}
            {curiosityRadar.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-semibold text-[var(--color-brand-700)] mb-1.5">Curiosidade natural por</div>
                <div className="flex flex-wrap gap-1.5">
                  {curiosityRadar.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 bg-[var(--color-brand-100)] text-[var(--color-brand-800)] rounded-full border border-[var(--color-brand-200)]">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {childhoodVerbs.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-[var(--color-brand-700)] mb-1.5">Verbos da infância</div>
                <div className="flex flex-wrap gap-1.5">
                  {childhoodVerbs.map(v => (
                    <span key={v} className="text-xs px-2.5 py-1 bg-white text-[var(--color-brand-700)] rounded-full border border-[var(--color-brand-300)] italic">{v}</span>
                  ))}
                </div>
              </div>
            )}
            {passionActivities.length === 0 && curiosityRadar.length === 0 && (
              <div className="text-stone-400 italic text-sm">Não mapeado ainda.</div>
            )}
          </div>

          {/* Pilar 2: No que é bom */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="text-xs font-mono text-orange-700 tracking-wider uppercase mb-1">No que é bom</div>
            <div className="text-sm text-stone-500 mb-4">Inteligências e perfil de interesses</div>

            {topIntNames.length > 0 && (
              <div className="mb-5">
                <div className="text-xs font-semibold text-orange-700 mb-2">Inteligências destacadas (≥ 3/4)</div>
                <ul className="space-y-1">
                  {topIntNames.map(n => (
                    <li key={n} className="flex items-center gap-2 text-sm text-orange-900">
                      <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {riasecTop3.length > 0 && (
              <div className="border-t border-orange-200 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-xs font-semibold text-orange-700">Perfil RIASEC</div>
                  <span className="font-mono font-black text-sm tracking-widest px-2 py-0.5 rounded bg-orange-100 border border-orange-300 text-orange-800">
                    {hollandCode}
                  </span>
                </div>
                <div className="space-y-2">
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
              </div>
            )}

            {topIntNames.length === 0 && riasecTop3.length === 0 && (
              <div className="text-stone-400 italic text-sm">Mapeamento de talentos incompleto.</div>
            )}
          </div>

          {/* Pilar 3: O que o mundo precisa */}
          <div className="bg-lime-50 border border-lime-200 rounded-xl p-6">
            <div className="text-xs font-mono text-lime-700 tracking-wider uppercase mb-1">O que o mundo precisa</div>
            <div className="text-sm text-stone-500 mb-4">Seu impacto desejado</div>

            {uniqueProblem && (
              <div className="mb-4 p-3 bg-lime-100 rounded-lg border border-lime-300">
                <div className="text-xs font-semibold text-lime-700 mb-1">Problema Foco</div>
                <p className="text-sm font-medium text-lime-900">{uniqueProblem}</p>
              </div>
            )}

            {topCauses.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-lime-700 mb-2">Causas que mais importam</div>
                <div className="space-y-2">
                  {topCauses.map(([causeId, coins]) => {
                    const pct = Math.round(((coins as number) / maxCauseCoins) * 100);
                    return (
                      <div key={causeId}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-lime-800 font-medium">{CAUSE_LABELS[causeId] || causeId}</span>
                          <span className="text-lime-600 font-mono">{coins as number} moedas</span>
                        </div>
                        <div className="h-1.5 bg-lime-100 rounded-full overflow-hidden">
                          <div className="h-full bg-lime-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {(contributionType.length > 0 || impactScale) && (
              <div className="text-sm text-lime-900 space-y-1 border-t border-lime-200 pt-3">
                {contributionType.length > 0 && <p><strong>Como quer contribuir:</strong> {contributionType.join(', ')}</p>}
                {impactScale && <p><strong>Escala:</strong> {impactScale}</p>}
              </div>
            )}

            {!uniqueProblem && topCauses.length === 0 && (
              <div className="text-stone-400 italic text-sm">Missão de impacto não definida.</div>
            )}
          </div>

          {/* Pilar 4: Pelo que pode ser pago */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
            <div className="text-xs font-mono text-stone-700 tracking-wider uppercase mb-1">Pelo que pode ser pago</div>
            <div className="text-sm text-stone-500 mb-4">Rotas profissionais</div>
            {selectedArchetypes.length > 0 ? (
              <div className="text-sm text-stone-800 space-y-3">
                <ul className="space-y-2">
                  {selectedArchetypes.map(id => {
                    const info = ARCHETYPES_INFO[id];
                    return info ? (
                      <li key={id} className="bg-white border rounded-lg p-3 text-xs">
                        <strong className="block text-[13px] mb-0.5">{info.title}</strong>
                        <span className="text-stone-500">{info.desc}</span>
                      </li>
                    ) : null;
                  })}
                </ul>
                {ultimateRole && (
                  <p className="text-xs text-stone-700 mt-2 bg-white border rounded-lg p-3">
                    <strong>Papel desejado:</strong> {ultimateRole}
                  </p>
                )}
                {futureTech && (
                  <p className="text-xs italic text-stone-500 text-center">Tecnologia ponte: {futureTech}</p>
                )}
              </div>
            ) : (
              <div className="text-stone-400 italic text-sm">Sua identidade profissional não foi finalizada.</div>
            )}

            {(ministryName || cargoName) && (
              <div className="mt-3 bg-white border rounded-lg p-3 text-xs">
                <strong className="block text-[13px] mb-0.5">Ministério dos Sonhos</strong>
                <span className="text-stone-500">
                  {ministryName && `Ministério da ${ministryName}`}
                  {ministryName && cargoName && ' · '}
                  {cargoName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Seus 3 Caminhos (lentes) ── */}
        {lenses.some(l => l.items.length > 0) && (
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-[var(--color-brand-800)] mb-2 text-center lg:text-left">Seus 3 Caminhos</h2>
            <p className="text-stone-500 mb-8 text-center lg:text-left">
              Cada caminho olha para você por uma lente diferente — e revela carreiras diferentes. Não é escolher uma; é enxergar o leque.
            </p>
            {convergentArea && (
              <div className="mb-8 flex items-start gap-3 bg-[var(--color-brand-50)] border border-[var(--color-brand-200)] rounded-xl p-4">
                <Sparkles className="w-5 h-5 text-[var(--color-brand-600)] shrink-0 mt-0.5" />
                <p className="text-sm text-stone-600 leading-relaxed">
                  <strong className="text-[var(--color-brand-700)]">Seus sinais convergem.</strong> As três lentes apontam para a mesma direção — <strong>{convergentArea}</strong>. Quando quem você é, o que quer construir e a arena que escolheu se alinham, costuma ser um forte sinal de foco e clareza sobre o seu caminho.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lenses.map(({ lens, items }, idx) => (
                <div key={lens.id} className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col">
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[var(--color-brand-500)] mb-1">Caminho {idx + 1}</div>
                  <h3 className="font-bold text-[var(--color-brand-900)] text-base leading-tight mb-1">{lens.title}</h3>
                  <p className="text-xs text-stone-500 mb-4">{lens.question}</p>
                  {items[0] && (
                    <div className="mb-4">
                      <div className="text-[10px] font-mono tracking-widest uppercase text-stone-400 mb-1">Aponta para a área</div>
                      <div className="font-bold text-[var(--color-brand-800)] text-lg leading-tight">{items[0].career.area}</div>
                    </div>
                  )}
                  {items.length > 0 && (
                    <div className="border-t border-stone-100 pt-3">
                      <div className="text-[10px] font-mono tracking-widest uppercase text-stone-400 mb-1.5">Carreiras possíveis</div>
                      <ul className="space-y-1">
                        {items.map(it => (
                          <li key={it.career.profession} className="text-xs text-stone-600">
                            {it.career.profession} <span className="text-stone-400">· {it.career.area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Link
                    to={`/explorar-cursos?${id ? `id=${id}&` : ''}lente=${lens.id}`}
                    className="inline-flex items-center gap-1 mt-auto pt-4 text-xs font-medium text-[var(--color-brand-600)] hover:underline"
                  >
                    Explorar por esta lente →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Análise de Convergência ── */}
        {hasAnalysis && (
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-[var(--color-brand-800)] mb-2 text-center lg:text-left">Análise de Convergência</h2>
            <p className="text-stone-500 mb-8 text-center lg:text-left">
              Cruzando os dados de todas as missões para revelar padrões, tendências e oportunidades.
            </p>

            {/* Dominant signal */}
            {topSignal && (
              <div className="bg-white border border-stone-200 rounded-xl p-6 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-[var(--color-brand-600)]" />
                  <span className="text-xs font-mono text-[var(--color-brand-600)] tracking-wider uppercase">Tendência Principal</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl border-2 font-black"
                    style={{ borderColor: RIASEC[topSignal.type]?.color, background: RIASEC[topSignal.type]?.color + '18' }}>
                    {RIASEC[topSignal.type]?.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-[var(--color-brand-900)] mb-1">
                      Perfil <span style={{ color: RIASEC[topSignal.type]?.color }}>{RIASEC[topSignal.type]?.full}</span>
                      {topSignal.strength >= 4 ? ' — convergência forte' : topSignal.strength >= 2 ? ' — tendência consistente' : ''}
                    </h3>
                    <p className="text-sm text-stone-600 mb-3">{RIASEC[topSignal.type]?.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {topSignal.sources.map((s, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full border border-stone-200">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* All signals overview */}
                {crossSignals.length > 1 && (
                  <div className="mt-5 pt-4 border-t border-stone-100">
                    <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">Força de sinal por tipo</div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {(['R', 'I', 'A', 'S', 'E', 'C'] as RIASECType[]).map(t => {
                        const sig = crossSignals.find(s => s.type === t);
                        const strength = sig?.strength || 0;
                        const maxStr = crossSignals[0]?.strength || 1;
                        return (
                          <div key={t} className="text-center">
                            <div className="text-xs font-mono mb-1" style={{ color: RIASEC[t].color }}>{t}</div>
                            <div className="h-8 bg-stone-100 rounded mx-auto w-full relative overflow-hidden">
                              <div className="absolute bottom-0 left-0 right-0 rounded transition-all"
                                style={{ height: `${(strength / maxStr) * 100}%`, background: RIASEC[t].color + 'cc' }} />
                            </div>
                            <div className="text-[10px] text-stone-400 mt-0.5">{strength}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tensions */}
            {tensions.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-mono text-amber-700 tracking-wider uppercase">Pontos de Atenção</span>
                </div>
                <p className="text-xs text-amber-700 mb-4">Tensões não são problemas — são convites para explorar com mais profundidade.</p>
                <div className="space-y-4">
                  {tensions.map((t, i) => (
                    <div key={i} className="border-l-2 border-amber-400 pl-4">
                      <h4 className="font-semibold text-sm text-amber-900 mb-1">{t.title}</h4>
                      <p className="text-sm text-amber-800 leading-relaxed">{t.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </section>
        )}

        {/* ── Footer ── */}
        <div className="mt-4 text-center">
          <p className="text-stone-400 italic mb-6">"O Ikigai reside no centro desse equilíbrio. Não é um destino final, mas uma jornada contínua."</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {tenantConfig ? (
              <a
                href={/^https?:\/\//.test(tenantConfig.explore_url) ? `${tenantConfig.explore_url}${tenantConfig.explore_url.includes('?') ? '&' : '?'}am_id=${encodeURIComponent(id ?? '')}` : '#'}
                rel="noreferrer noopener"
                className="inline-block px-6 py-2.5 bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)] rounded-full font-medium transition-colors shadow-sm"
              >
                {tenantConfig.explore_label}
              </a>
            ) : (
              <Link
                to={`/explorar-cursos${id ? `?id=${id}` : ''}`}
                className="inline-block px-6 py-2.5 bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)] rounded-full font-medium transition-colors shadow-sm"
              >
                Explorar Carreiras
              </Link>
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
              <a href={/^https?:\/\//.test(tenantConfig.home_url) ? tenantConfig.home_url : '#'} rel="noreferrer noopener" className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
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
