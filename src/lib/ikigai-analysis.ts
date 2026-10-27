// @ts-nocheck — arquivo será reescrito para Reinventar (análise de fases 1-8 adaptada para 55+)
import type { AppState } from '../store';

// ─── Static maps ─────────────────────────────────────────────────────────────

export const INT_NAMES: Record<string, string> = {
  log:   'Lógica & Números',
  ling:  'Comunicação',
  esp:   'Visão Espacial',
  cin:   'Físico & Motor',
  mus:   'Musical',
  inter: 'Relações & Empatia',
  intra: 'Autoconhecimento',
  nat:   'Natureza & Biologia',
};

export const ARCHETYPES_INFO: Record<string, { title: string; desc: string }> = {
  builder:   { title: 'Construtor(a)',  desc: 'Engenharia, Programação, Arquitetura' },
  optimizer: { title: 'Otimizador(a)', desc: 'Dados, Finanças, Logística' },
  caregiver: { title: 'Cuidador(a)',   desc: 'Saúde, Psicologia, Ensino' },
  creator:   { title: 'Criativo(a)',   desc: 'Design, Arte, Marketing' },
  explorer:  { title: 'Explorador(a)', desc: 'Ciência, Pesquisa' },
  maestro:   { title: 'Maestro(a)',    desc: 'Gestão, Empreendedorismo' },
};

export const CAUSE_LABELS: Record<string, string> = {
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

export type RIASECType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export const RIASEC: Record<RIASECType, { full: string; color: string; icon: string; desc: string; careers: string[] }> = {
  R: { full: 'Realista',       color: '#f97316', icon: '🔧', desc: 'Trabalho prático, ferramentas, espaço físico',           careers: ['Engenheiro', 'Arquiteto', 'Técnico', 'Atleta'] },
  I: { full: 'Investigativo',  color: '#8b5cf6', icon: '🔬', desc: 'Pesquisa, análise e resolução de problemas complexos',  careers: ['Cientista', 'Analista', 'Médico', 'Programador'] },
  A: { full: 'Artístico',      color: '#ec4899', icon: '🎨', desc: 'Criação, expressão e imaginação',                       careers: ['Designer', 'Escritor', 'Músico', 'Cineasta'] },
  S: { full: 'Social',         color: '#22c55e', icon: '🤝', desc: 'Ajudar, ensinar e conectar pessoas',                    careers: ['Professor', 'Psicólogo', 'Terapeuta', 'Assistente Social'] },
  E: { full: 'Empreendedor',   color: '#f59e0b', icon: '🚀', desc: 'Liderar, influenciar e criar negócios',                 careers: ['Empresário', 'Gerente', 'Advogado', 'Produtor'] },
  C: { full: 'Convencional',   color: '#06b6d4', icon: '📊', desc: 'Organizar, estruturar e trabalhar com dados',           careers: ['Contador', 'Administrador', 'Auditor', 'Analista Fin.'] },
};

export const ACTIVITY_RIASEC: Record<string, RIASECType> = {
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

export const INT_RIASEC: Record<string, RIASECType> = {
  log:   'I',
  ling:  'A',
  esp:   'A',
  cin:   'R',
  mus:   'A',
  inter: 'S',
  intra: 'E',
  nat:   'R',
};

export const ARCH_RIASEC: Record<string, RIASECType> = {
  builder:   'R',
  optimizer: 'C',
  caregiver: 'S',
  creator:   'A',
  explorer:  'I',
  maestro:   'E',
};

export const CURIOSITY_RIASEC: Record<string, RIASECType> = {
  'Tecnologia':           'I',
  'Arte e Design':        'A',
  'Psicologia':           'S',
  'Finanças':             'C',
  'Biologia e Natureza':  'R',
  'História':             'I',
  'Ciência e Espaço':     'I',
  'Empreendedorismo':     'E',
  'Esportes':             'R',
  'Música':               'A',
  'Política':             'E',
};

export const CAREER_PATHS: { types: RIASECType[]; title: string; desc: string; examples: string[] }[] = [
  { types: ['I', 'A'], title: 'Inovação Criativa',              desc: 'Onde ciência e arte se encontram',                  examples: ['UX Design', 'Games', 'IA Criativa', 'Arquitetura'] },
  { types: ['S', 'A'], title: 'Criatividade com Propósito',     desc: 'Expressão que transforma vidas',                    examples: ['Arte-Terapia', 'Educação Criativa', 'Jornalismo Social'] },
  { types: ['E', 'I'], title: 'Empreendedorismo Científico',    desc: 'Inovar com base em dados e visão',                  examples: ['Startups de Tech', 'Consultoria', 'Inovação Corporativa'] },
  { types: ['S', 'I'], title: 'Ciências da Saúde e Humanas',    desc: 'Cuidar com rigor e empatia',                        examples: ['Psicologia', 'Saúde Pública', 'Neurociência', 'Educação'] },
  { types: ['R', 'I'], title: 'Engenharia e Tecnologia',        desc: 'Construir sistemas que funcionam',                  examples: ['Engenharia de Software', 'Biotecnologia', 'Automação'] },
  { types: ['A', 'E'], title: 'Empreendedorismo Criativo',      desc: 'Criar e escalar negócios com alma',                 examples: ['Agência Criativa', 'Produção Cultural', 'Marketing'] },
  { types: ['S', 'E'], title: 'Liderança com Impacto',          desc: 'Mover pessoas rumo a um bem maior',                 examples: ['ONG / Terceiro Setor', 'Políticas Públicas', 'RH Estratégico'] },
  { types: ['I', 'C'], title: 'Dados e Inteligência',           desc: 'Extrair sentido da complexidade',                   examples: ['Ciência de Dados', 'Business Intelligence', 'Pesquisa'] },
  { types: ['R', 'E'], title: 'Empreendedorismo Prático',       desc: 'Construir negócios com mãos na massa',              examples: ['Construção Civil', 'Agronegócio', 'Indústria', 'Logística'] },
  { types: ['A', 'C'], title: 'Design e Comunicação',           desc: 'Beleza com precisão e estratégia',                  examples: ['Design Gráfico', 'Publicidade', 'UX Writing', 'Editorial'] },
  { types: ['S', 'C'], title: 'Gestão de Pessoas e Processos',  desc: 'Cuidar de equipes com estrutura',                   examples: ['RH', 'Gestão Educacional', 'Saúde Hospitalar', 'Admin. Pública'] },
  { types: ['R', 'C'], title: 'Tecnologia Operacional',         desc: 'Sistemas físicos com excelência técnica',           examples: ['Engenharia Industrial', 'TI Operacional', 'Qualidade e Processos'] },
  { types: ['E', 'A'], title: 'Influência e Cultura',           desc: 'Liderar através da criação',                        examples: ['Influência Digital', 'Direção Criativa', 'Branding'] },
  { types: ['I', 'S'], title: 'Psicologia e Ciências Sociais',  desc: 'Entender a mente e a sociedade',                    examples: ['Pesquisa Social', 'Neuropsicologia', 'Antropologia'] },
  { types: ['R', 'A'], title: 'Design Industrial e Artesanato', desc: 'Criar objetos bonitos e funcionais',                examples: ['Design de Produto', 'Arquitetura', 'Artesanato Digital'] },
];

// ─── Ministério dos Sonhos (Missão 5) ────────────────────────────────────────

// Cada ministério aponta para uma das 10 macro-áreas de carreira.
export const MINISTRIES: { id: string; name: string; emoji: string; area: string }[] = [
  { id: 'economia',               name: 'Economia',               emoji: '💰', area: 'Negócios e Gestão' },
  { id: 'saude',                  name: 'Saúde',                  emoji: '🏥', area: 'Saúde e Bem-Estar' },
  { id: 'ciencia_tecnologia',     name: 'Ciência e Tecnologia',   emoji: '🔬', area: 'Tecnologia e Dados' },
  { id: 'educacao',               name: 'Educação',               emoji: '📚', area: 'Educação e Ensino' },
  { id: 'justica',                name: 'Justiça',                emoji: '⚖️', area: 'Direito, Política e Sociedade' },
  { id: 'cultura',                name: 'Cultura',                emoji: '🎭', area: 'Artes, Design e Criatividade' },
  { id: 'meio_ambiente',          name: 'Meio Ambiente',          emoji: '🌱', area: 'Ciências e Meio Ambiente' },
  { id: 'infraestrutura',         name: 'Infraestrutura',         emoji: '🏗️', area: 'Engenharia e Infraestrutura' },
  { id: 'desenvolvimento_social', name: 'Desenvolvimento Social', emoji: '🤝', area: 'Psicologia e Desenvolvimento Humano' },
  { id: 'comunicacoes',           name: 'Comunicações',           emoji: '📡', area: 'Comunicação e Mídias' },
];

// Cada cargo revela um perfil profissional → um tipo RIASEC.
export const CARGOS: { id: string; name: string; profile: string; riasec: RIASECType }[] = [
  { id: 'ministro',             name: 'Ministro(a)',                profile: 'Lidera o ministério, define a visão e toma as grandes decisões.', riasec: 'E' },
  { id: 'consultor_tecnico',    name: 'Consultor(a) Técnico(a)',    profile: 'Resolve problemas complexos com pesquisa, análise e dados.',      riasec: 'I' },
  { id: 'assessor_comunicacao', name: 'Assessor(a) de Comunicação', profile: 'Traduz e comunica as ideias do ministério para o mundo.',         riasec: 'A' },
  { id: 'diretor_operacoes',    name: 'Diretor(a) de Operações',    profile: 'Organiza processos e garante que tudo funcione com eficiência.',  riasec: 'C' },
  { id: 'coordenador_campo',    name: 'Coordenador(a) de Campo',    profile: 'Põe a mão na massa e executa os projetos na prática.',            riasec: 'R' },
  { id: 'secretario_social',    name: 'Secretário(a) de Bem-Estar', profile: 'Cuida das pessoas e do impacto social das políticas.',            riasec: 'S' },
];

export const MINISTRY_AREA: Record<string, string> = Object.fromEntries(MINISTRIES.map(m => [m.id, m.area]));
export const CARGO_RIASEC: Record<string, RIASECType> = Object.fromEntries(CARGOS.map(c => [c.id, c.riasec]));
export const MINISTRY_NAMES: Record<string, string> = Object.fromEntries(MINISTRIES.map(m => [m.id, m.name]));
export const CARGO_NAMES: Record<string, string> = Object.fromEntries(CARGOS.map(c => [c.id, c.name]));

// Tecnologia escolhida na Missão 6 (futureVision.q2) → macro-área de carreira.
export const TECH_AREA: Record<string, string> = {
  'Inteligência Artificial & Dados':   'Tecnologia e Dados',
  'Biotecnologia & Saúde':             'Saúde e Bem-Estar',
  'Educação Imersiva (VR/AR)':         'Educação e Ensino',
  'Energias Renováveis':               'Ciências e Meio Ambiente',
  'Políticas Públicas Sociais':        'Direito, Política e Sociedade',
  'Arte e Mídia de Conscientização':   'Comunicação e Mídias',
};

// ─── Career compatibility ─────────────────────────────────────────────────────

export interface CareerSuggestion {
  profession: string;
  area: string;
  description: string | null;
  trend_demand: string | null;
  riasec_types: string[];
  score: number;
}

export type Pillar = 'love' | 'good' | 'world' | 'paid';

type ScoringMissions = Pick<AppState, 'mission1' | 'mission2' | 'mission3' | 'mission4' | 'mission5' | 'mission6' | 'phase3'>;

// ── Pesos calibráveis (ajuste aqui para rebalancear todo o ranking) ──────────

// Passo 1 — RIASEC multi-fonte: quanto cada missão contribui ao sinal RIASEC.
// Antes o RIASEC vinha 100% dos Duelos (M4); agora arquétipos, atividades de
// paixão e curiosidades também entram, reduzindo o domínio de uma única etapa.
export const RIASEC_BLEND = {
  duel:      2, // por vitória de Duelo de Cena (M4)
  archetype: 2, // por arquétipo selecionado (M6)
  cargo:     2, // pelo cargo escolhido no Ministério dos Sonhos (M5)
  passion:   1, // por atividade em flow/boost (M1)
  curiosity: 1, // por tema de curiosidade (M1)
};

// Orçamento de pontos da compatibilidade de carreira (soma = 100).
export const CAREER_WEIGHTS = {
  riasec: [25, 17, 8] as number[], // 1º/2º/3º tipo compatível — máx 50
  intelligence: 22,                // match de inteligências (M2)
  pillar: 18,                      // alinhamento de pilares Ikigai
  area: 10,                        // carreira na área do Ministério escolhido (M5)
};

// Passo 2 — quantos sinais saturam cada pilar (vira 1.0 no peso do pilar).
const PILLAR_SATURATION = { love: 6, good: 4, world: 5, paid: 2 };

// ── Passo 1: RIASEC combinado de várias missões ──────────────────────────────

export function computeBlendedRIASEC(
  md: ScoringMissions,
  w: typeof RIASEC_BLEND = RIASEC_BLEND,
): Record<RIASECType, number> {
  const scores: Record<RIASECType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  Object.values(md.mission4?.sceneDuels || {}).forEach(t => {
    if (t in scores) scores[t as RIASECType] += w.duel;
  });
  (md.mission6?.selectedArchetypes || []).forEach(a => {
    const t = ARCH_RIASEC[a];
    if (t) scores[t] += w.archetype;
  });
  const cargoType = md.phase3?.cargo ? CARGO_RIASEC[md.phase3.cargo] : undefined;
  if (cargoType) scores[cargoType] += w.cargo;
  Object.entries(md.mission1?.energyCards || {}).forEach(([act, q]) => {
    if (q === 'flow' || q === 'boost') {
      const t = ACTIVITY_RIASEC[act];
      if (t) scores[t] += w.passion;
    }
  });
  (md.mission1?.curiosityRadar || []).forEach(theme => {
    const t = CURIOSITY_RIASEC[theme];
    if (t) scores[t] += w.curiosity;
  });

  return scores;
}

// Inteligências fortes (média >= 3.0) da Missão 2, da mais forte para a mais fraca.
function topIntelligences(md: ScoringMissions): string[] {
  const detail = md.mission2?.detailRatings || {};
  return Object.entries(detail)
    .map(([id, r]) => {
      const arr = r as number[];
      return [id, arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0] as [string, number];
    })
    .filter(([, s]) => s >= 3.0)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
}

// ── Passo 2: peso relativo de cada pilar Ikigai a partir dos sinais do usuário ─

export function computePillarWeights(md: ScoringMissions): Record<Pillar, number> {
  const energyCards = md.mission1?.energyCards || {};
  const passions = Object.values(energyCards).filter(q => q === 'flow' || q === 'boost').length;

  const detail = md.mission2?.detailRatings || {};
  const strongInts = Object.values(detail).filter(r => {
    const arr = r as number[];
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length >= 3.5 : false;
  }).length;

  const causes = Object.values(md.mission3?.impactPoints || {}).filter(v => (v as number) > 0).length;
  const archetypes = (md.mission6?.selectedArchetypes || []).length;

  return {
    love:  Math.min(1, passions   / PILLAR_SATURATION.love),
    good:  Math.min(1, strongInts / PILLAR_SATURATION.good),
    world: Math.min(1, causes     / PILLAR_SATURATION.world),
    paid:  Math.min(1, archetypes / PILLAR_SATURATION.paid),
  };
}

// ── Perfil consolidado usado pelo ranking de carreiras ───────────────────────

export interface UserProfile {
  riasecTop3: RIASECType[];
  topIntIds: string[];
  pillarWeights: Record<Pillar, number>;
  ministryArea: string;
}

export function computeUserProfile(md: ScoringMissions): UserProfile {
  const blended = computeBlendedRIASEC(md);
  const riasecTop3 = sortedTypes(blended).filter(t => blended[t] > 0).slice(0, 3);
  const ministryArea = md.phase3?.ministry ? (MINISTRY_AREA[md.phase3.ministry] ?? '') : '';

  return {
    riasecTop3,
    topIntIds: topIntelligences(md),
    pillarWeights: computePillarWeights(md),
    ministryArea,
  };
}

// ── Compatibilidade de carreira: RIASEC (55) + inteligências (25) + pilares (20)

export function computeCareerCompatibility(
  career: { riasec_types: string[]; intelligence_types: string[]; ikigai_pillars?: string[]; area?: string },
  riasecTop3: RIASECType[],
  topIntIds: string[],
  pillarWeights?: Record<Pillar, number>,
  bonusArea?: string,
  w: typeof CAREER_WEIGHTS = CAREER_WEIGHTS,
): number {
  let score = 0;

  // RIASEC (multi-fonte via riasecTop3)
  let riasec = 0;
  for (const type of career.riasec_types) {
    const pos = riasecTop3.indexOf(type as RIASECType);
    if (pos >= 0) riasec += w.riasec[pos] ?? 4;
  }
  score += Math.min(riasec, w.riasec.reduce((a, b) => a + b, 0));

  // Inteligências (M2)
  if (career.intelligence_types.length > 0) {
    const matches = career.intelligence_types.filter(t => topIntIds.includes(t)).length;
    score += Math.round((matches / career.intelligence_types.length) * w.intelligence);
  }

  // Pilares Ikigai
  if (pillarWeights && career.ikigai_pillars && career.ikigai_pillars.length > 0) {
    const avg = career.ikigai_pillars
      .map(p => pillarWeights[p as Pillar] ?? 0)
      .reduce((a, b) => a + b, 0) / career.ikigai_pillars.length;
    score += Math.round(avg * w.pillar);
  }

  // Bônus se a carreira estiver na área destacada (Ministério ou Tecnologia)
  if (bonusArea && career.area === bonusArea) {
    score += w.area;
  }

  return Math.min(score, 100);
}

// ── 3 Caminhos (lentes) — cada lente pondera sinais diferentes da jornada ─────

export interface ResultLens {
  id: string;
  title: string;
  shortLabel: string;
  question: string;
  blend: typeof RIASEC_BLEND;
  weights: typeof CAREER_WEIGHTS;
  areaSource: 'none' | 'tech' | 'ministry';
}

export const RESULT_LENSES: ResultLens[] = [
  {
    id: 'essencia',
    title: 'Sua essência',
    shortLabel: 'Essência',
    question: 'Por quem você naturalmente é',
    blend: { duel: 3, archetype: 1, cargo: 1, passion: 1, curiosity: 1 },
    weights: { riasec: [35, 25, 15], intelligence: 20, pillar: 5, area: 0 },
    areaSource: 'none',
  },
  {
    id: 'construir',
    title: 'O que você quer construir',
    shortLabel: 'Impacto',
    question: 'Pelo impacto e pela criação que te atraem',
    blend: { duel: 1, archetype: 4, cargo: 1, passion: 1, curiosity: 1 },
    weights: { riasec: [28, 18, 10], intelligence: 12, pillar: 22, area: 22 },
    areaSource: 'tech',
  },
  {
    id: 'arena',
    title: 'A arena que você escolheu',
    shortLabel: 'Território',
    question: 'Pelo território e papel que você quer ocupar',
    blend: { duel: 1, archetype: 1, cargo: 4, passion: 0, curiosity: 0 },
    weights: { riasec: [24, 16, 8], intelligence: 12, pillar: 8, area: 30 },
    areaSource: 'ministry',
  },
];

export interface LensPick<T> {
  lens: ResultLens;
  items: { career: T; score: number }[];
}

type LensCareer = { riasec_types: string[]; intelligence_types: string[]; ikigai_pillars?: string[]; area?: string };
interface LensCtx { topIntIds: string[]; pillarWeights: Record<Pillar, number>; ministryArea: string; techArea: string }

function lensCtx(md: ScoringMissions): LensCtx {
  return {
    topIntIds: topIntelligences(md),
    pillarWeights: computePillarWeights(md),
    ministryArea: md.phase3?.ministry ? (MINISTRY_AREA[md.phase3.ministry] ?? '') : '',
    techArea: md.mission6?.futureVision?.q2 ? (TECH_AREA[md.mission6.futureVision.q2] ?? '') : '',
  };
}

function rankByLens<T extends LensCareer>(md: ScoringMissions, careers: T[], lens: ResultLens, ctx: LensCtx): { career: T; score: number }[] {
  const blended = computeBlendedRIASEC(md, lens.blend);
  const riasecTop3 = sortedTypes(blended).filter(t => blended[t] > 0).slice(0, 3);
  const bonusArea = lens.areaSource === 'ministry' ? ctx.ministryArea : lens.areaSource === 'tech' ? ctx.techArea : '';
  return careers
    .map(career => ({ career, score: computeCareerCompatibility(career, riasecTop3, ctx.topIntIds, ctx.pillarWeights, bonusArea, lens.weights) }))
    .sort((a, b) => b.score - a.score);
}

// Ranking por UMA lente (sem dedupe) — usado na página Explorar Carreiras.
export function computeLensRanking<T extends LensCareer>(md: ScoringMissions, careers: T[], lensId: string, n = 3): { career: T; score: number }[] {
  const lens = RESULT_LENSES.find(l => l.id === lensId) ?? RESULT_LENSES[0];
  return rankByLens(md, careers, lens, lensCtx(md)).slice(0, n);
}

// Calcula os 3 caminhos. Cada carreira aparece em no máximo um caminho
// (dedupe guloso na ordem das lentes), garantindo 3 recortes distintos.
export function computeResultLenses<T extends LensCareer>(
  md: ScoringMissions,
  careers: T[],
  perLens = 3,
): LensPick<T>[] {
  const ctx = lensCtx(md);
  const claimed = new Set<T>();
  return RESULT_LENSES.map(lens => {
    const ranked = rankByLens(md, careers, lens, ctx);
    const items: { career: T; score: number }[] = [];
    for (const r of ranked) {
      if (claimed.has(r.career)) continue;
      claimed.add(r.career);
      items.push(r);
      if (items.length >= perLens) break;
    }
    return { lens, items };
  });
}

export const MENTOR_NAMES: Record<string, string> = {
  jobs:        'Steve Jobs',
  tesla_n:     'Nikola Tesla',
  musk:        'Elon Musk',
  gates:       'Bill Gates',
  einstein:    'Albert Einstein',
  curie:       'Marie Curie',
  sagan:       'Carl Sagan',
  aristoteles: 'Aristóteles',
  davinci:     'Leonardo da Vinci',
  picasso:     'Pablo Picasso',
  frida:       'Frida Kahlo',
  disney:      'Walt Disney',
  buffett:     'Warren Buffett',
  bezos:       'Jeff Bezos',
  coco:        'Coco Chanel',
  drucker:     'Peter Drucker',
  mandela:     'Nelson Mandela',
  gandhi:      'Mahatma Gandhi',
  mlk:         'Martin Luther King Jr.',
  malala:      'Malala Yousafzai',
  jordan:      'Michael Jordan',
  senna:       'Ayrton Senna',
  serena:      'Serena Williams',
  marco:       'Marco Aurélio',
  frankl:      'Viktor Frankl',
  dumont:      'Santos Dumont',
  niemeyer:    'Oscar Niemeyer',
  pele:        'Pelé',
  coelho:      'Paulo Coelho',
};

const ENERGY_LABELS: Record<string, string> = {
  flow:    'Flow (energia total)',
  boost:   'Boost (dá energia)',
  neutral: 'Neutro',
  drain:   'Drena',
};

const FORCED_CHOICE_LABELS: Record<string, string> = {
  impact:     'Alto Impacto + Caos',
  peace:      'Paz Mental + Rotina',
  leader:     'Líder / Gestor',
  specialist: 'Especialista Técnico',
};

const FUTURE_LABELS: Record<string, string> = {
  morando:   'Onde está morando',
  companhia: 'Com quem está',
  manha:     'Como é sua manhã',
  trabalho:  'Onde trabalha',
  fim_dia:   'Fim de dia ideal',
};

// ─── Analysis functions ───────────────────────────────────────────────────────

export function computeRIASECScores(duels: Record<string, string>): Record<RIASECType, number> {
  const scores: Record<RIASECType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  Object.values(duels).forEach(t => {
    if (t in scores) scores[t as RIASECType]++;
  });
  return scores;
}

export function sortedTypes(scores: Record<RIASECType, number>): RIASECType[] {
  return (Object.entries(scores) as [RIASECType, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);
}

// Texto legível com todas as respostas, para campos de texto em CRMs (ex.: GHL).
// Não usar JSON aqui: o GHL faz parse automático de strings em formato JSON.
export function formatMissionDataText(state: AppState): string {
  const list = (arr?: string[]) => (arr && arr.length ? arr.join(', ') : '—');
  const text = (s?: string) => (s && s.trim() ? s.trim() : '—');
  const lines: string[] = [];

  const m1 = state.mission1;
  lines.push('=== MISSÃO 1 — O QUE VOCÊ AMA ===');
  const energyGroups: Record<string, string[]> = { flow: [], boost: [], neutral: [], drain: [] };
  Object.entries(m1?.energyCards ?? {}).forEach(([activity, quadrant]) => {
    if (quadrant && energyGroups[quadrant]) energyGroups[quadrant].push(activity);
  });
  lines.push('Cartas de energia:');
  for (const [id, label] of Object.entries(ENERGY_LABELS)) {
    lines.push(`- ${label}: ${list(energyGroups[id])}`);
  }
  lines.push(`Verbos da infância: ${list(m1?.childhoodVerbs)}`);
  lines.push(`Radar de curiosidade: ${list(m1?.curiosityRadar)}`);

  const m2 = state.mission2;
  lines.push('');
  lines.push('=== MISSÃO 2 — NO QUE VOCÊ É BOM ===');
  const avgRatings = Object.entries(m2?.detailRatings ?? {})
    .map(([id, vals]) => ({
      name: INT_NAMES[id] ?? id,
      avg: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0,
    }))
    .sort((a, b) => b.avg - a.avg);
  lines.push('Inteligências (média das autoavaliações, 1-5):');
  avgRatings.forEach(r => lines.push(`- ${r.name}: ${r.avg.toFixed(1)}`));
  const lightning = Object.entries(m2?.lightningChallenges ?? {})
    .map(([id, v]) => `${INT_NAMES[id] ?? id}: ${v}`);
  lines.push(`Desafios relâmpago: ${lightning.length ? lightning.join(', ') : '—'}`);
  lines.push(`Elogios que recebe: ${list(m2?.praiseMap)}`);
  lines.push(`Talentos ocultos: ${list(m2?.hiddenTalents)}`);

  const m3 = state.mission3;
  lines.push('');
  lines.push('=== MISSÃO 3 — O QUE O MUNDO PRECISA ===');
  const causes = Object.entries(m3?.impactPoints ?? {})
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([id, v]) => `${CAUSE_LABELS[id] ?? id}: ${v}`);
  lines.push(`Causas (pontos de impacto): ${causes.length ? causes.join(', ') : '—'}`);
  lines.push(`Problema que gostaria de resolver: ${text(m3?.uniqueProblem)}`);
  lines.push(`Escala de impacto: ${text(m3?.impactScale)}`);
  lines.push(`Tipo de contribuição: ${list(m3?.contributionType)}`);

  const m4 = state.mission4;
  lines.push('');
  lines.push('=== MISSÃO 4 — MUNDO DO TRABALHO (RIASEC) ===');
  const riasecScores = computeRIASECScores(m4?.sceneDuels ?? {});
  const riasecLines = sortedTypes(riasecScores)
    .filter(t => riasecScores[t] > 0)
    .map(t => `${RIASEC[t].full} (${t}): ${riasecScores[t]}`);
  lines.push(`Duelos de cena: ${riasecLines.length ? riasecLines.join(', ') : '—'}`);
  lines.push(`Ambientes preferidos: ${list(m4?.environments)}`);
  const choices = Object.values(m4?.forcedChoices ?? {})
    .map(v => FORCED_CHOICE_LABELS[v] ?? v);
  lines.push(`Escolhas difíceis: ${choices.length ? choices.join('; ') : '—'}`);

  const m3extra = state.phase3;
  lines.push('');
  lines.push('=== FASE 3 — ÁREA E PAPEL ===');
  lines.push(`Área de atuação: ${m3extra?.ministry ? (MINISTRY_NAMES[m3extra.ministry] ?? m3extra.ministry) : '—'}`);
  lines.push(`Papel preferido: ${m3extra?.cargo ? (CARGO_NAMES[m3extra.cargo] ?? m3extra.cargo) : '—'}`);
  lines.push(`Equipe (inspirações): ${list(m5?.saved?.map(id => MENTOR_NAMES[id] ?? id))}`);
  lines.push(`Descartadas: ${list(m5?.discarded?.map(id => MENTOR_NAMES[id] ?? id))}`);

  const m6 = state.mission6;
  lines.push('');
  lines.push('=== MISSÃO 6 — ARQUÉTIPOS & VISÃO ===');
  lines.push(`Arquétipos: ${list(m6?.selectedArchetypes?.map(id => ARCHETYPES_INFO[id]?.title ?? id))}`);
  Object.entries(m6?.futureVision ?? {}).forEach(([k, v]) => {
    lines.push(`Visão de futuro (${k}): ${text(v)}`);
  });
  lines.push(`Papel definitivo: ${text(m6?.ultimateRole)}`);

  const m7 = state.mission7;
  lines.push('');
  lines.push('=== MISSÃO 7 — PROFISSÕES DO FUTURO ===');
  lines.push(`Salvas: ${list(m7?.saved)}`);
  lines.push(`Descartadas: ${list(m7?.discarded)}`);

  const m8 = state.mission8;
  lines.push('');
  lines.push('=== MISSÃO 8 — CARTA AO FUTURO ===');
  Object.entries(m8?.future ?? {}).forEach(([k, v]) => {
    lines.push(`${FUTURE_LABELS[k] ?? k}: ${text(v)}`);
  });
  lines.push('Carta:');
  lines.push(text(m8?.letter));

  return lines.join('\n');
}

export interface CrossSignal {
  type: RIASECType;
  sources: string[];
  strength: number;
}

export function buildCrossSignals(
  riasecTop: RIASECType[],
  passionActivities: string[],
  topIntIds: string[],
  selectedArchetypes: string[],
  curiosityRadar: string[],
): CrossSignal[] {
  const sources: Record<RIASECType, string[]> = { R: [], I: [], A: [], S: [], E: [], C: [] };

  riasecTop.slice(0, 3).forEach((t, i) => {
    const labels = ['tipo principal', 'tipo secundário', 'terceiro tipo'];
    sources[t].push(`Duelos RIASEC (${labels[i]})`);
  });
  passionActivities.forEach(act => {
    const t = ACTIVITY_RIASEC[act];
    if (t) sources[t].push(`Atividade: "${act}"`);
  });
  topIntIds.forEach(id => {
    const t = INT_RIASEC[id];
    if (t) sources[t].push(`Inteligência: ${INT_NAMES[id]}`);
  });
  selectedArchetypes.forEach(arch => {
    const t = ARCH_RIASEC[arch];
    const info = ARCHETYPES_INFO[arch];
    if (t && info) sources[t].push(`Arquétipo: ${info.title}`);
  });
  curiosityRadar.forEach(theme => {
    const t = CURIOSITY_RIASEC[theme];
    if (t) sources[t].push(`Curiosidade: ${theme}`);
  });

  return (Object.entries(sources) as [RIASECType, string[]][])
    .map(([type, srcs]) => ({ type, sources: srcs, strength: srcs.length }))
    .sort((a, b) => b.strength - a.strength)
    .filter(s => s.strength > 0);
}

export interface Tension { title: string; body: string }

export function detectTensions(
  riasecTop3: RIASECType[],
  passionActivities: string[],
  drainActivities: string[],
  selectedArchetypes: string[],
): Tension[] {
  const tensions: Tension[] = [];
  const topSet = new Set(riasecTop3.slice(0, 2));

  const archTypes = selectedArchetypes.map(a => ARCH_RIASEC[a]).filter(Boolean) as RIASECType[];
  const archConflicts = archTypes.filter(t => !topSet.has(t));
  if (archConflicts.length > 0 && archTypes.length > 0 && archConflicts.length === archTypes.length) {
    const archLabels = selectedArchetypes.map(a => ARCHETYPES_INFO[a]?.title).filter(Boolean);
    tensions.push({
      title: 'Arquétipos vs. preferências visuais',
      body: `Você se identificou como ${archLabels.join(' e ')} na Missão 6, mas nos Duelos de Cenas seu perfil predominante foi ${RIASEC[riasecTop3[0]]?.full}. Isso pode indicar que suas aspirações profissionais conscientes diferem das suas atrações instintivas — ambas são informações válidas.`,
    });
  }

  const drainMapped = drainActivities.map(a => ACTIVITY_RIASEC[a]).filter(Boolean) as RIASECType[];
  if (drainMapped.filter(t => t === riasecTop3[0]).length >= 2) {
    tensions.push({
      title: 'Energia invertida no perfil dominante',
      body: `Seu tipo RIASEC principal (${RIASEC[riasecTop3[0]]?.full}) sugere afinidade com certas atividades, mas algumas delas foram classificadas como "drain" na Missão 1. Pode valer explorar qual contexto específico faz essa diferença — às vezes o problema é o ambiente, não a atividade em si.`,
    });
  }

  const analyticalTypes: RIASECType[] = ['I', 'C'];
  const socialTypes: RIASECType[] = ['S', 'E'];
  if (riasecTop3.slice(0, 3).every(t => analyticalTypes.includes(t)) &&
      passionActivities.some(a => ACTIVITY_RIASEC[a] === 'A' || ACTIVITY_RIASEC[a] === 'S')) {
    tensions.push({
      title: 'Curiosidade criativa vs. perfil analítico',
      body: 'Seus duelos apontam fortemente para análise e dados, mas algumas das suas atividades de energia alta têm caráter criativo ou social. Explorar essa zona híbrida pode revelar caminhos mais completos para você.',
    });
  }
  if (riasecTop3.slice(0, 3).every(t => socialTypes.includes(t)) &&
      passionActivities.some(a => ACTIVITY_RIASEC[a] === 'I' || ACTIVITY_RIASEC[a] === 'C')) {
    tensions.push({
      title: 'Perfil social com interesse analítico',
      body: 'Seu perfil RIASEC predomina no espectro social, mas você demonstrou interesse em atividades mais analíticas. Isso pode indicar potencial para papéis que combinam gestão de pessoas com rigor técnico.',
    });
  }

  return tensions;
}

// ─── HTML report generator ────────────────────────────────────────────────────

export function generateRelatorioHtml(
  name: string,
  email: string,
  id: string,
  missionData: AppState,
  topCareers: CareerSuggestion[] = [],
  lenses: LensPick<{ profession: string; area: string }>[] = [],
): string {
  const { mission1, mission2, mission3, mission4, mission6, mission8 } = missionData;

  // Pilar 1
  const energyCards      = mission1?.energyCards || {};
  const flowActivities   = Object.entries(energyCards).filter(([, q]) => q === 'flow').map(([a]) => a);
  const boostActivities  = Object.entries(energyCards).filter(([, q]) => q === 'boost').map(([a]) => a);
  const neutralActivities = Object.entries(energyCards).filter(([, q]) => q === 'neutral').map(([a]) => a);
  const drainActivities  = Object.entries(energyCards).filter(([, q]) => q === 'drain').map(([a]) => a);
  const passionActivities = [...flowActivities, ...boostActivities];
  const curiosityRadar   = mission1?.curiosityRadar || [];
  const childhoodVerbs   = mission1?.childhoodVerbs || [];

  // Pilar 2 — scores de inteligência a partir dos ratings detalhados da missão 2
  const rawDetailRatings = mission2?.detailRatings || {};
  const intScores: Record<string, number> = Object.fromEntries(
    Object.entries(rawDetailRatings).map(([id, ratings]) => {
      const arr = ratings as number[];
      return [id, arr.reduce((a, b) => a + b, 0) / arr.length];
    })
  );
  const topIntIds  = Object.entries(intScores)
    .filter(([, s]) => s >= 3.0)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  const riasecScores  = computeRIASECScores(mission4?.sceneDuels || {});
  const riasecSorted  = sortedTypes(riasecScores);
  const riasecTop3    = riasecSorted.filter(t => riasecScores[t] > 0).slice(0, 3);
  const hollandCode   = riasecTop3.join('');

  // Pilar 3
  const { uniqueProblem = '', impactPoints = {}, contributionType = [], impactScale = '' } = mission3 || {};
  const topCauses = Object.entries(impactPoints)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .filter(([, v]) => (v as number) > 0)
    .slice(0, 5);
  const maxCoins = (topCauses[0]?.[1] as number) || 1;

  // Pilar 4
  const selectedArchetypes = mission6?.selectedArchetypes || [];
  const ultimateRole       = mission6?.ultimateRole || '';
  const futureTech         = mission6?.futureVision?.q2 || '';

  // Carta
  const future = mission8?.future || {};
  const autoLetter = Object.keys(future).length > 0
    ? `Querido(a) eu do futuro...\n\nHoje, imaginei que daqui a 10 anos estarei vivendo ${future.morando?.toLowerCase() || 'em algum lugar incrível'}, e estarei acompanhado(a) ${future.companhia?.toLowerCase() || 'de quem amo'}.\n\nMinha rotina ideal começa de uma forma bem específica: ${future.manha?.toLowerCase() || 'com bastante calma'}. Durante o dia, passo a maior parte do tempo trabalhando ${future.trabalho?.toLowerCase() || 'com meu propósito'}, e a sensação de que valeu a pena vem de ${future.fim_dia?.toLowerCase() || 'fazer o que gosto'}.\n\nNão quero esquecer dessa visão, vou lutar por ela.\nAssinado,\nEu do presente.`
    : '';
  const letter = mission8?.letter || autoLetter;

  // Analysis
  const crossSignals   = buildCrossSignals(riasecSorted, passionActivities, topIntIds, selectedArchetypes, curiosityRadar);
  const topSignal      = crossSignals[0];
  const tensions       = detectTensions(riasecTop3, passionActivities, drainActivities, selectedArchetypes);
  const suggestedPaths = CAREER_PATHS.filter(p => p.types.every(t => riasecTop3.includes(t))).slice(0, 3);
  const explorationPaths = CAREER_PATHS.filter(p =>
    !suggestedPaths.includes(p) &&
    p.types.some(t => riasecTop3.slice(0, 2).includes(t)) &&
    p.types.some(t => crossSignals.slice(3).map(s => s.type).includes(t))
  ).slice(0, 2);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const tags = (items: string[], bg: string, fg: string) =>
    items.map(i => `<span style="display:inline-block;background:${bg};color:${fg};border-radius:999px;padding:3px 10px;font-size:12px;margin:2px 3px 2px 0;border:1px solid ${bg}">${i}</span>`).join('');

  const pilarHeader = (label: string, sub: string, accent: string) => `
    <div style="border-radius:12px;padding:18px 20px;background:#fff;border:1px solid #e5e7eb;margin-bottom:12px">
      <div style="font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:2px;color:${accent};margin-bottom:2px">${label}</div>
      <div style="font-size:12px;color:#9ca3af;margin-bottom:12px">${sub}</div>`;

  const pilarClose = `</div>`;

  const sectionTitle = (text: string) =>
    `<h2 style="font-family:Georgia,serif;font-size:22px;color:#1f2937;border-bottom:2px solid #f3f4f6;padding-bottom:8px;margin:28px 0 16px">${text}</h2>`;

  const subLabel = (text: string, color = '#6b7280') =>
    `<div style="font-size:11px;font-weight:600;color:${color};margin:10px 0 5px;text-transform:uppercase;letter-spacing:1px">${text}</div>`;

  // ── Build sections ────────────────────────────────────────────────────────

  // Pilar 1
  const pilar1 = pilarHeader('O que você ama', 'Interesses, fluidez e curiosidade', '#7c3aed') + `
    ${flowActivities.length > 0 ? subLabel('⚡ Flow — te energiza de verdade', '#ea580c') + tags(flowActivities, '#fff7ed', '#c2410c') : ''}
    ${boostActivities.length > 0 ? subLabel('🔋 Boost — gosta, mas ainda não explora muito', '#d97706') + tags(boostActivities, '#fffbeb', '#b45309') : ''}
    ${neutralActivities.length > 0 ? subLabel('😐 Neutral', '#6b7280') + tags(neutralActivities, '#f9fafb', '#4b5563') : ''}
    ${drainActivities.length > 0 ? subLabel('🔴 Drain', '#dc2626') + tags(drainActivities, '#fef2f2', '#b91c1c') : ''}
    ${curiosityRadar.length > 0 ? subLabel('Curiosidade natural por', '#7c3aed') + tags(curiosityRadar, '#f5f3ff', '#6d28d9') : ''}
    ${childhoodVerbs.length > 0 ? subLabel('Verbos da infância', '#4b5563') + tags(childhoodVerbs, '#f9fafb', '#374151') : ''}
  ` + pilarClose;

  // Pilar 2
  const riasecBars = riasecTop3.map(t => {
    const info = RIASEC[t];
    return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      <span style="width:28px;text-align:center;font-size:16px">${info.icon}</span>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px">
          <strong style="color:${info.color}">${info.full}</strong>
          <span style="color:#9ca3af">${info.desc}</span>
        </div>
        <div style="height:5px;background:#f3f4f6;border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${Math.round((riasecScores[t] / (riasecScores[riasecTop3[0]] || 1)) * 100)}%;background:${info.color};border-radius:3px"></div>
        </div>
      </div>
    </div>`;
  }).join('');

  const pilar2 = pilarHeader('No que é bom', 'Inteligências e perfil de interesses', '#c2410c') + `
    ${topIntIds.length > 0 ? subLabel('Inteligências destacadas (≥ 3/4)', '#c2410c') +
      `<ul style="padding-left:16px;margin:4px 0">${topIntIds.map(id =>
        `<li style="font-size:13px;color:#7c2d12;margin-bottom:3px">${INT_NAMES[id] || id}</li>`
      ).join('')}</ul>` : ''}
    ${riasecTop3.length > 0 ? `
      <div style="border-top:1px solid #fed7aa;padding-top:12px;margin-top:10px">
        ${subLabel('Perfil RIASEC', '#c2410c')}
        <div style="display:inline-block;font-family:monospace;font-weight:900;font-size:18px;letter-spacing:4px;padding:4px 12px;background:#fff7ed;border:1px solid #fdba74;border-radius:6px;color:#9a3412;margin-bottom:12px">${hollandCode || '—'}</div>
        ${riasecBars}
      </div>` : ''}
  ` + pilarClose;

  // Pilar 3
  const barsHtml = topCauses.map(([causeId, coins]) => {
    const pct = Math.round(((coins as number) / maxCoins) * 100);
    return `<div style="margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
        <span style="color:#365314;font-weight:500">${CAUSE_LABELS[causeId] || causeId}</span>
        <span style="color:#84cc16;font-family:monospace">${coins as number} moedas</span>
      </div>
      <div style="height:6px;background:#f7fee7;border-radius:3px;overflow:hidden;border:1px solid #d9f99d">
        <div style="height:100%;width:${pct}%;background:#84cc16;border-radius:3px"></div>
      </div>
    </div>`;
  }).join('');

  const pilar3 = pilarHeader('O que o mundo precisa', 'Seu impacto desejado', '#65a30d') + `
    ${uniqueProblem ? `<div style="background:#f7fee7;border:1px solid #bef264;border-radius:8px;padding:10px 14px;margin-bottom:10px">
      <div style="font-size:10px;font-weight:600;color:#65a30d;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px">Problema Foco</div>
      <p style="font-size:13px;font-weight:500;color:#365314;margin:0">${uniqueProblem}</p>
    </div>` : ''}
    ${topCauses.length > 0 ? subLabel('Causas que mais importam', '#65a30d') + barsHtml : ''}
    ${contributionType.length > 0 ? `<p style="font-size:13px;color:#365314;margin:6px 0"><strong>Como quer contribuir:</strong> ${contributionType.join(', ')}</p>` : ''}
    ${impactScale ? `<p style="font-size:13px;color:#365314;margin:6px 0"><strong>Escala:</strong> ${impactScale}</p>` : ''}
  ` + pilarClose;

  // Pilar 4
  const archHtml = selectedArchetypes.map(id => {
    const info = ARCHETYPES_INFO[id];
    return info ? `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:10px 14px;margin-bottom:8px">
      <strong style="font-size:13px;color:#111827;display:block;margin-bottom:2px">${info.title}</strong>
      <span style="font-size:12px;color:#6b7280">${info.desc}</span>
    </div>` : '';
  }).join('');

  const pilar4 = pilarHeader('Pelo que pode ser pago', 'Rotas profissionais', '#374151') + `
    ${archHtml}
    ${ultimateRole ? `<p style="font-size:13px;color:#374151;margin:8px 0"><strong>Papel desejado:</strong> ${ultimateRole}</p>` : ''}
    ${futureTech ? `<p style="font-size:12px;color:#9ca3af;font-style:italic;margin:4px 0">Tecnologia ponte: ${futureTech}</p>` : ''}
  ` + pilarClose;

  // Analysis
  const topSignalHtml = topSignal ? (() => {
    const info = RIASEC[topSignal.type];
    return `<div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:18px 20px;margin-bottom:12px">
      <div style="font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;margin-bottom:12px">↗ Tendência Principal</div>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="width:52px;height:52px;border-radius:10px;border:2px solid ${info.color};background:${info.color}18;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">${info.icon}</div>
        <div>
          <h3 style="margin:0 0 4px;font-size:17px;color:#111827">Perfil <span style="color:${info.color}">${info.full}</span>${topSignal.strength >= 4 ? ' — convergência forte' : topSignal.strength >= 2 ? ' — tendência consistente' : ''}</h3>
          <p style="font-size:13px;color:#6b7280;margin:0 0 8px">${info.desc}</p>
          <div>${topSignal.sources.map(s =>
            `<span style="display:inline-block;font-size:11px;padding:2px 8px;background:#f3f4f6;color:#6b7280;border-radius:999px;margin:2px 2px 2px 0;border:1px solid #e5e7eb">${s}</span>`
          ).join('')}</div>
        </div>
      </div>
    </div>`;
  })() : '';

  const suggestedHtml = suggestedPaths.length > 0 ? `
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:18px 20px;margin-bottom:12px">
      <div style="font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;margin-bottom:14px">⭐ Caminhos que Fazem Sentido</div>
      ${suggestedPaths.map(path => `
        <div style="border:1px solid #f3f4f6;border-radius:10px;padding:14px;margin-bottom:8px;background:#fafafa">
          <div style="margin-bottom:6px">${path.types.map(t =>
            `<span style="display:inline-block;font-size:10px;font-weight:900;padding:2px 6px;border-radius:999px;background:${RIASEC[t].color}22;color:${RIASEC[t].color};margin-right:4px">${t}</span>`
          ).join('')}</div>
          <strong style="font-size:14px;color:#111827;display:block;margin-bottom:4px">${path.title}</strong>
          <p style="font-size:12px;color:#6b7280;margin:0 0 8px">${path.desc}</p>
          <div>${path.examples.map(e =>
            `<span style="display:inline-block;font-size:11px;padding:2px 7px;background:#fff;border:1px solid #e5e7eb;border-radius:4px;color:#6b7280;margin:2px 2px 2px 0">${e}</span>`
          ).join('')}</div>
        </div>`).join('')}
    </div>` : '';

  const tensionsHtml = tensions.length > 0 ? `
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:18px 20px;margin-bottom:12px">
      <div style="font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:2px;color:#b45309;margin-bottom:6px">⚠ Pontos de Atenção</div>
      <p style="font-size:12px;color:#92400e;margin:0 0 12px">Tensões não são problemas — são convites para explorar com mais profundidade.</p>
      ${tensions.map(t => `
        <div style="border-left:3px solid #fbbf24;padding-left:14px;margin-bottom:12px">
          <strong style="font-size:13px;color:#78350f;display:block;margin-bottom:4px">${t.title}</strong>
          <p style="font-size:13px;color:#92400e;margin:0;line-height:1.6">${t.body}</p>
        </div>`).join('')}
    </div>` : '';

  const explorationHtml = explorationPaths.length > 0 ? `
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:18px 20px;margin-bottom:12px">
      <div style="font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;margin-bottom:6px">💡 Para Explorar</div>
      <p style="font-size:12px;color:#9ca3af;margin:0 0 12px">Estes caminhos aparecem nos seus dados de forma secundária — vale conhecer antes de descartar.</p>
      ${explorationPaths.map(path => `
        <div style="border:1px dashed #e5e7eb;border-radius:10px;padding:14px;margin-bottom:8px">
          <div style="margin-bottom:6px">${path.types.map(t =>
            `<span style="display:inline-block;font-size:10px;font-weight:900;padding:2px 6px;border-radius:999px;background:${RIASEC[t].color}18;color:${RIASEC[t].color};margin-right:4px;opacity:0.8">${t}</span>`
          ).join('')}</div>
          <strong style="font-size:13px;color:#374151;display:block;margin-bottom:4px">${path.title}</strong>
          <p style="font-size:12px;color:#9ca3af;margin:0 0 8px">${path.desc}</p>
          <div>${path.examples.slice(0, 3).map(e =>
            `<span style="display:inline-block;font-size:11px;padding:2px 7px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:4px;color:#9ca3af;margin:2px 2px 2px 0">${e}</span>`
          ).join('')}</div>
        </div>`).join('')}
    </div>` : '';

  // Carreiras sugeridas
  const careersHtml = topCareers.length > 0 ? `
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:18px 20px;margin-bottom:12px">
      <div style="font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;margin-bottom:14px">🎯 Sugestões de Carreiras</div>
      <p style="font-size:12px;color:#9ca3af;margin:0 0 14px">Carreiras com maior compatibilidade com o seu perfil Ikigai, ordenadas por score.</p>
      ${topCareers.map(c => {
        const matchColor = c.score >= 70 ? '#16a34a' : c.score >= 40 ? '#d97706' : '#0891b2';
        const matchLabel = c.score >= 70 ? 'Alta compatibilidade' : c.score >= 40 ? 'Boa compatibilidade' : 'Compatível';
        return `<div style="border:1px solid #f3f4f6;border-radius:10px;padding:14px;margin-bottom:8px;background:#fafafa">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
            <div>
              <span style="font-size:10px;color:#9ca3af;font-family:monospace;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:2px">${c.area}</span>
              <strong style="font-size:14px;color:#111827">${c.profession}</strong>
            </div>
            <div style="text-align:right;flex-shrink:0;margin-left:12px">
              <div style="font-size:18px;font-weight:900;color:${matchColor}">${c.score}%</div>
              <span style="font-size:10px;font-weight:600;color:${matchColor};background:${matchColor}18;padding:2px 6px;border-radius:999px">${matchLabel}</span>
            </div>
          </div>
          ${c.description ? `<p style="font-size:12px;color:#6b7280;margin:4px 0">${c.description}</p>` : ''}
          ${c.trend_demand ? `<p style="font-size:11px;color:#9ca3af;margin:4px 0;font-style:italic">📈 ${c.trend_demand}</p>` : ''}
          <div style="margin-top:6px">${c.riasec_types.map(t => {
            const info = RIASEC[t as RIASECType];
            return info ? `<span style="display:inline-block;font-size:10px;font-weight:900;padding:2px 6px;border-radius:999px;background:${info.color}22;color:${info.color};margin-right:4px">${t}</span>` : '';
          }).join('')}</div>
        </div>`;
      }).join('')}
    </div>` : '';

  // Seus 3 Caminhos (lentes) — espelha o dashboard
  const lensTopAreas = lenses.map(l => l.items[0]?.career.area).filter(Boolean) as string[];
  const convergentArea = lensTopAreas.length === lenses.length && lenses.length > 0 && new Set(lensTopAreas).size === 1
    ? lensTopAreas[0]
    : null;
  const lensesHtml = lenses.some(l => l.items.length > 0) ? `
    <p style="font-size:13px;color:#6b7280;margin:0 0 14px">Cada caminho olha para você por uma lente diferente — e revela carreiras diferentes. Não é escolher uma; é enxergar o leque.</p>
    ${convergentArea ? `<div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:10px;padding:12px 16px;margin-bottom:14px">
      <p style="font-size:13px;color:#5b21b6;margin:0"><strong>Seus sinais convergem.</strong> As três lentes apontam para a mesma direção — <strong>${convergentArea}</strong>. Quando quem você é, o que quer construir e a arena que escolheu se alinham, costuma ser um forte sinal de foco e clareza sobre o seu caminho.</p>
    </div>` : ''}
    ${lenses.map(({ lens, items }, idx) => items.length === 0 ? '' : `
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px 18px;margin-bottom:10px">
        <div style="font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;margin-bottom:4px">Caminho ${idx + 1}</div>
        <strong style="font-size:15px;color:#111827;display:block">${lens.title}</strong>
        <p style="font-size:12px;color:#9ca3af;margin:2px 0 12px">${lens.question}</p>
        ${items[0] ? `<div style="margin-bottom:10px">
          <div style="font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:2px">Aponta para a área</div>
          <div style="font-size:16px;font-weight:700;color:#5b21b6">${items[0].career.area}</div>
        </div>` : ''}
        <div style="border-top:1px solid #f3f4f6;padding-top:10px">
          <div style="font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:6px">Carreiras possíveis</div>
          ${items.map(it =>
            `<div style="font-size:13px;color:#4b5563;margin-bottom:3px">${it.career.profession} <span style="color:#9ca3af">· ${it.career.area}</span></div>`
          ).join('')}
        </div>
      </div>`).join('')}
  ` : '';

  const letterHtml = letter ? `
    <div style="background:#422006;border:1px solid #78350f;border-radius:12px;padding:20px 24px;margin-top:12px;position:relative">
      <div style="font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:2px;color:#d97706;margin-bottom:8px">📮 Carta do Eu do Futuro</div>
      <h3 style="font-family:Georgia,serif;font-size:17px;color:#fef3c7;border-bottom:1px solid #78350f;padding-bottom:10px;margin:0 0 14px">Uma mensagem para você</h3>
      <div style="white-space:pre-wrap;font-family:Georgia,serif;font-size:14px;line-height:1.8;color:#fef3c7">${letter}</div>
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>O Ikigai de ${name}</title>
</head>
<body style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;padding:24px 20px;color:#111827;line-height:1.6;background:#fff">

  <!-- Header -->
  <div style="text-align:center;padding:32px 0 24px;border-bottom:2px solid #f3f4f6;margin-bottom:28px">
    <div style="font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:3px;color:#9ca3af;margin-bottom:8px">Bússola de Autoconhecimento</div>
    <h1 style="font-family:Georgia,serif;font-size:34px;color:#111827;margin:0 0 8px">O Ikigai de <em style="color:#7c3aed">${name}</em></h1>
    <p style="color:#9ca3af;font-size:13px;margin:0">${email} · ID: ${id}</p>
    ${hollandCode ? `<div style="margin-top:14px;display:inline-block;font-family:monospace;font-weight:900;font-size:20px;letter-spacing:6px;padding:6px 18px;background:#f5f3ff;border:2px solid #c4b5fd;border-radius:8px;color:#7c3aed">Código Holland: ${hollandCode}</div>` : ''}
  </div>

  <!-- 4 Pilares -->
  ${sectionTitle('Os 4 Pilares da sua Escolha')}
  ${pilar1}
  ${pilar2}
  ${pilar3}
  ${pilar4}

  <!-- Seus 3 Caminhos -->
  ${lensesHtml ? sectionTitle('Seus 3 Caminhos') + lensesHtml : ''}

  <!-- Análise de Convergência -->
  ${(topSignal || suggestedPaths.length > 0 || tensions.length > 0) ? sectionTitle('Análise de Convergência') + topSignalHtml + suggestedHtml + tensionsHtml + explorationHtml : ''}

  <!-- Sugestões de Carreiras -->
  ${topCareers.length > 0 ? sectionTitle('Sugestões de Carreiras') + careersHtml : ''}

  <!-- Carta -->
  ${letterHtml}

  <!-- Footer -->
  <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #f3f4f6">
    <p style="font-style:italic;color:#9ca3af;font-size:13px">"O Ikigai reside no centro desse equilíbrio. Não é um destino final, mas uma jornada contínua."</p>
    <p style="font-size:11px;color:#d1d5db;margin-top:8px">Jornada Ikigai · ${new Date().getFullYear()}</p>
  </div>
</body>
</html>`;
}

// ─── Reinventar Report ────────────────────────────────────────────────────────

const REINVENTAR_COMPETENCIES: Record<string, string> = {
  lideranca:     'Liderança e Gestão',
  comunicacao:   'Comunicação e Persuasão',
  resolucao:     'Resolução de Problemas',
  empatia:       'Relações e Empatia',
  planejamento:  'Planejamento e Organização',
  conhecimento:  'Conhecimento Especializado',
  criatividade:  'Criatividade e Inovação',
  sabedoria:     'Autoconhecimento e Sabedoria',
};

const REINVENTAR_CAUSES: Record<string, string> = {
  solidao:          'Solidão e Isolamento',
  educacao:         'Educação e Formação',
  saude:            'Saúde e Longevidade',
  cuidado:          'Cuidado com Idosos',
  desigualdade:     'Desigualdade Social',
  meio_ambiente:    'Meio Ambiente e Legado',
  saude_mental:     'Saúde Mental',
  empreendedorismo: 'Empreendedorismo',
  cultura:          'Arte, Cultura e Memória',
  intergeracoes:    'Conexão entre Gerações',
};

const REINVENTAR_PROBLEMS: Record<string, string> = {
  solidao_idosos:           'Idosos sozinhos sem apoio ou companhia',
  conhecimento_perdido:     'Conhecimento que se perde sem ser transmitido',
  cuidadores:               'Cuidadores sobrecarregados e sem suporte',
  jovens_sem_mentores:      'Jovens sem mentores ou referências',
  saude_acesso:             'Comunidades sem acesso à saúde de qualidade',
  experiencia_desvalorizada: 'Desvalorização de quem tem mais experiência',
};

const REINVENTAR_ARCHETYPES: Record<string, string> = {
  sabio:      'Sábio(a)',
  guardiao:   'Guardião(ã)',
  explorador: 'Explorador(a)',
  criador:    'Criador(a)',
  conector:   'Conector(a)',
  realizador: 'Realizador(a)',
};

const REINVENTAR_MINISTRIES: Record<string, string> = {
  economia:               '💰 Economia',
  saude:                  '🏥 Saúde',
  ciencia_tecnologia:     '🔬 Ciência e Tecnologia',
  educacao:               '📚 Educação',
  justica:                '⚖️ Justiça',
  cultura:                '🎭 Cultura',
  meio_ambiente:          '🌱 Meio Ambiente',
  infraestrutura:         '🏗️ Infraestrutura',
  desenvolvimento_social: '🤝 Desenvolvimento Social',
  comunicacoes:           '📡 Comunicações',
};

const REINVENTAR_CARGOS: Record<string, string> = {
  ministro:             'Ministro(a)',
  consultor_tecnico:    'Consultor(a) Técnico(a)',
  assessor_comunicacao: 'Assessor(a) de Comunicação',
  diretor_operacoes:    'Diretor(a) de Operações',
  coordenador_campo:    'Coordenador(a) de Campo',
  secretario_social:    'Secretário(a) de Bem-Estar',
};

const REINVENTAR_ROLES: Record<string, string> = {
  mentor:       'Mentor(a)',
  escritora:    'Escritor(a)',
  consultor:    'Consultor(a)',
  professor:    'Professor(a)',
  voluntario:   'Voluntário(a)',
  podcast:      'Podcaster',
  artesao:      'Artesão/ã',
  coach:        'Coach',
  cuidador:     'Cuidador(a)',
  guia:         'Guia de Viagem',
  horta:        'Cultivador(a)',
  genealogia:   'Genealogista',
  facilitador:  'Facilitador(a)',
  fotografo:    'Fotógrafo(a)',
  mediador:     'Mediador(a)',
  narrador:     'Contador(a) de histórias',
  idiomas:      'Prof. de Idiomas',
  palestrante:  'Palestrante',
  acompanhante: 'Acompanhante Terapêutico(a)',
  curador:      'Curador(a)',
  produtor:     'Produtor(a)',
  terapeuta:    'Terapeuta',
  embaixador:   'Embaixador(a)',
  empreendedor: 'Empreendedor(a)',
};

const REINVENTAR_WHO: Record<string, string> = {
  jovens:        '🧒 Crianças e jovens',
  adultos:       '🔄 Adultos em transição',
  pares:         '🤝 Pessoas da minha geração (55+)',
  idosos:        '👴 Idosos (75+)',
  familia:       '🏠 Minha família',
  comunidade:    '🏘️ Minha comunidade local',
  vulneraveis:   '🫂 Grupos vulneráveis',
  profissionais: '💼 Profissionais da minha área',
  estudantes:    '📖 Estudantes e aprendizes',
  cuidadores:    '❤️‍🩹 Cuidadores e famílias',
};

const REINVENTAR_HOW: Record<string, string> = {
  presencial: '🤲 Presencialmente',
  online:     '💻 Online / Digital',
  grupos:     '👥 Em grupos e encontros',
  individual: '🫀 Um a um (1:1)',
  escrito:    '✍️ Por escrito',
  arte:       '🎨 Através da arte',
  sistema:    '⚙️ Indiretamente (sistemas)',
  eventos:    '🎤 Em eventos e palestras',
};

const REINVENTAR_FORCED: Record<string, Record<string, string>> = {
  estrutura_vs_liberdade: { estrutura: 'Estrutura e equipe', liberdade: 'Autonomia e ritmo próprio' },
  mentor_vs_executor:     { mentor: 'Guiar e transmitir', executor: 'Executar e implementar' },
  profundo_vs_amplo:      { profundo: 'Impacto profundo, alcance menor', amplo: 'Alcance amplo, impacto distribuído' },
};

const REINVENTAR_FIGURES: Record<string, string> = {
  sanders:     'Colonel Sanders', child:      'Julia Child',
  moses:       'Vovó Moses',      kroc:       'Ray Kroc',
  mandela:     'Nelson Mandela',  frankl:     'Viktor Frankl',
  marco:       'Marco Aurélio',   gandhi:     'Mahatma Gandhi',
  curie:       'Marie Curie',     sagan:      'Carl Sagan',
  attenborough: 'David Attenborough', davinci: 'Leonardo da Vinci',
  kahlo:       'Frida Kahlo',     tolkien:    'J.R.R. Tolkien',
  niemeyer:    'Oscar Niemeyer',  drummond:   'Carlos Drummond',
  freire:      'Paulo Freire',    evaristo:   'Conceição Evaristo',
  clarice:     'Clarice Lispector', teresa:   'Madre Teresa',
  wangari:     'Wangari Maathai', malala:     'Malala Yousafzai',
  drucker:     'Peter Drucker',   buffett:    'Warren Buffett',
  aristoteles: 'Aristóteles',
};

export function generateReinventarRelatorioHtml(
  name: string,
  email: string,
  id: string,
  state: AppState,
): string {
  const { phase1, phase2, phase3, phase4, phase5, phase6, phase7, phase8 } = state;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const esc = (s: string) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  // dict() resolves a key from a trusted map; falls back to the raw key, always escaped
  const dict = (map: Record<string, string>, key: string) => esc(map[key] || key);

  const tags = (items: string[], bg: string, fg: string) =>
    items.map(i => `<span style="display:inline-block;background:${bg};color:${fg};border-radius:999px;padding:3px 10px;font-size:12px;margin:2px 3px 2px 0;border:1px solid ${bg}">${esc(i)}</span>`).join('');

  const section = (title: string, accent: string, sub: string, body: string) => `
    <div style="border-radius:12px;padding:18px 20px;background:#fff;border:1px solid #e5e7eb;margin-bottom:16px">
      <div style="font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:2px;color:${accent};margin-bottom:2px">${title}</div>
      <div style="font-size:12px;color:#9ca3af;margin-bottom:12px">${sub}</div>
      ${body}
    </div>`;

  const sublabel = (text: string, color = '#6b7280') =>
    `<div style="font-size:11px;font-weight:600;color:${color};margin:10px 0 5px;text-transform:uppercase;letter-spacing:1px">${text}</div>`;

  // ── Phase 1 — Mapa de Energia ─────────────────────────────────────────────
  const energyCards: Record<string, string> = phase1?.energyCards ?? {};
  const flowActs    = Object.entries(energyCards).filter(([, q]) => q === 'flow').map(([a]) => a);
  const boostActs   = Object.entries(energyCards).filter(([, q]) => q === 'boost').map(([a]) => a);
  const neutralActs = Object.entries(energyCards).filter(([, q]) => q === 'neutral').map(([a]) => a);
  const drainActs   = Object.entries(energyCards).filter(([, q]) => q === 'drain').map(([a]) => a);
  const maturityVerbs  = phase1?.maturityVerbs ?? [];
  const curiosityThemes = phase1?.curiosityThemes ?? [];

  const phase1Html = section('Fase 1', '#7c3aed', 'Mapa de Energia — o que te dá vida', `
    ${flowActs.length > 0 ? sublabel('⚡ Flow — não vejo o tempo passar', '#7c3aed') + tags(flowActs, '#f5f3ff', '#6d28d9') : ''}
    ${boostActs.length > 0 ? sublabel('🔋 Energiza', '#d97706') + tags(boostActs, '#fffbeb', '#b45309') : ''}
    ${neutralActs.length > 0 ? sublabel('😐 Neutro', '#6b7280') + tags(neutralActs, '#f9fafb', '#4b5563') : ''}
    ${drainActs.length > 0 ? sublabel('🔴 Drena', '#dc2626') + tags(drainActs, '#fef2f2', '#b91c1c') : ''}
    ${maturityVerbs.length > 0 ? sublabel('Verbos da maturidade', '#4b5563') + tags(maturityVerbs, '#f9fafb', '#374151') : ''}
    ${curiosityThemes.length > 0 ? sublabel('Temas de curiosidade', '#7c3aed') + tags(curiosityThemes, '#f5f3ff', '#6d28d9') : ''}
  `);

  // ── Phase 2 — Talentos na Mochila ────────────────────────────────────────
  const skillRatings: Record<string, number> = phase2?.skillRatings ?? {};
  const topSkills = Object.entries(skillRatings)
    .filter(([, v]) => v >= 4)
    .sort((a, b) => b[1] - a[1])
    .map(([id, v]) => `${REINVENTAR_COMPETENCIES[id] || id} (${v}/5)`);
  const whoAsksYou    = phase2?.whoAsksYou ?? [];
  const hiddenTalents = phase2?.hiddenTalents ?? [];

  const skillBarsHtml = Object.entries(skillRatings)
    .sort((a, b) => b[1] - a[1])
    .map(([id, val]) => {
      const pct = Math.round((val / 5) * 100);
      return `<div style="margin-bottom:6px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px">
          <span style="color:#374151">${dict(REINVENTAR_COMPETENCIES, id)}</span>
          <span style="color:#6b7280;font-family:monospace">${val}/5</span>
        </div>
        <div style="height:5px;background:#f3f4f6;border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:#7c3aed;border-radius:3px"></div>
        </div>
      </div>`;
    }).join('');

  const phase2Html = section('Fase 2', '#c2410c', 'Talentos na Mochila — seus pontos fortes', `
    ${skillBarsHtml}
    ${topSkills.length > 0 ? sublabel('Competências de destaque (≥4/5)', '#c2410c') + tags(topSkills, '#fff7ed', '#c2410c') : ''}
    ${whoAsksYou.length > 0 ? sublabel('Pedidos que você recebe', '#4b5563') + tags(whoAsksYou, '#f9fafb', '#374151') : ''}
    ${hiddenTalents.length > 0 ? sublabel('Talentos ocultos', '#6b7280') + tags(hiddenTalents, '#f9fafb', '#4b5563') : ''}
  `);

  // ── Phase 3 — A Grande Causa ──────────────────────────────────────────────
  const impactPoints: Record<string, number> = phase3?.impactPoints ?? {};
  const uniqueProblem = phase3?.uniqueProblem ?? '';
  const topCauses = Object.entries(impactPoints)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCoins = topCauses[0]?.[1] ?? 1;

  const causeBarsHtml = topCauses.map(([id, coins]) => {
    const pct = Math.round((coins / maxCoins) * 100);
    return `<div style="margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
        <span style="color:#365314;font-weight:500">${dict(REINVENTAR_CAUSES, id)}</span>
        <span style="color:#84cc16;font-family:monospace">${coins} moeda${coins !== 1 ? 's' : ''}</span>
      </div>
      <div style="height:5px;background:#f0fdf4;border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:#16a34a;border-radius:3px"></div>
      </div>
    </div>`;
  }).join('');

  const phase3Html = section('Fase 3', '#16a34a', 'A Grande Causa — onde quer deixar sua marca', `
    ${causeBarsHtml}
    ${uniqueProblem ? sublabel('Problema que mais te mobiliza', '#16a34a') +
      `<p style="font-size:13px;color:#374151;font-style:italic;padding:8px 12px;background:#f0fdf4;border-left:3px solid #16a34a;border-radius:4px;margin:4px 0">${dict(REINVENTAR_PROBLEMS, uniqueProblem)}</p>` : ''}
    ${phase3?.ministry ? sublabel('Área de atuação', '#16a34a') +
      `<p style="font-size:14px;color:#374151;margin:4px 0">${dict(REINVENTAR_MINISTRIES, phase3.ministry)}</p>` : ''}
    ${phase3?.cargo ? sublabel('Papel preferido', '#16a34a') +
      `<p style="font-size:13px;color:#166534;margin:4px 0">${dict(REINVENTAR_CARGOS, phase3.cargo)}</p>` : ''}
  `);

  // ── Phase 4 — Duelo de Mundos ─────────────────────────────────────────────
  const sceneDuels: Record<string, string>    = phase4?.sceneDuels ?? {};
  const environments: string[]               = phase4?.environments ?? [];
  const forcedChoices: Record<string, string> = phase4?.forcedChoices ?? {};

  const riasecCount: Record<string, number> = {};
  Object.values(sceneDuels).forEach(type => { riasecCount[type] = (riasecCount[type] || 0) + 1; });
  const riasecSorted = Object.entries(riasecCount).sort((a, b) => b[1] - a[1]);
  const riasecLabels: Record<string, string> = {
    R: '🛠️ Prático', I: '🔬 Investigativo', A: '🎨 Artístico',
    S: '🤝 Social',  E: '🚀 Empreendedor', C: '📊 Estruturador',
  };
  const riasecBarsHtml = riasecSorted.map(([type, count]) => {
    const pct = Math.round((count / (riasecSorted[0]?.[1] || 1)) * 100);
    return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
      <span style="width:130px;font-size:12px;color:#374151">${dict(riasecLabels, type)}</span>
      <div style="flex:1;height:5px;background:#f3f4f6;border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:#f59e0b;border-radius:3px"></div>
      </div>
      <span style="width:20px;font-size:11px;color:#9ca3af;font-family:monospace">${count}</span>
    </div>`;
  }).join('');

  const forcedChoicesHtml = Object.entries(forcedChoices).map(([questionId, choiceId]) => {
    const q = REINVENTAR_FORCED[questionId];
    const label = esc(q?.[choiceId] || choiceId);
    return `<div style="font-size:12px;color:#374151;padding:5px 10px;background:#fffbeb;border-radius:6px;margin-bottom:4px;border:1px solid #fde68a">✓ ${label}</div>`;
  }).join('');

  const phase4Html = section('Fase 4', '#d97706', 'Duelo de Mundos — perfil e preferências', `
    ${riasecSorted.length > 0 ? sublabel('Perfil RIASEC (preferências de atuação)', '#d97706') + riasecBarsHtml : ''}
    ${environments.length > 0 ? sublabel('Ambientes preferidos', '#4b5563') + tags(environments, '#fffbeb', '#92400e') : ''}
    ${Object.keys(forcedChoices).length > 0 ? sublabel('Escolhas de estilo de vida', '#d97706') + forcedChoicesHtml : ''}
  `);

  // ── Phase 3 extra — Área e Papel (movidos da F5) ─────────────────────────
  const ministry      = phase3?.ministry ?? '';
  const cargo         = phase3?.cargo ?? '';

  // ── Phase 5 — Conexões / Figuras ─────────────────────────────────────────
  const archetype     = phase5?.archetype ?? '';
  const savedFigures  = phase5?.savedFigures ?? [];

  const figuresHtml = savedFigures.length > 0
    ? `<div style="display:flex;flex-wrap:wrap;gap:6px">${
        savedFigures.map(id =>
          `<span style="display:inline-block;background:#fdf4ff;color:#7e22ce;border-radius:999px;padding:3px 10px;font-size:12px;border:1px solid #e9d5ff">${dict(REINVENTAR_FIGURES, id)}</span>`
        ).join('')
      }</div>` : '';

  const phase5Html = section('Fase 5', '#0891b2', 'Conexões que Importam', `
    ${archetype ? sublabel('Arquétipo', '#7e22ce') +
      `<span style="display:inline-block;font-size:15px;font-weight:700;color:#7e22ce;padding:6px 14px;background:#fdf4ff;border-radius:8px;border:1px solid #e9d5ff">${dict(REINVENTAR_ARCHETYPES, archetype)}</span>` : ''}
    ${savedFigures.length > 0 ? sublabel(`Figuras inspiradoras (${savedFigures.length})`, '#4b5563') + figuresHtml : ''}
  `);

  // ── Phase 6 — Conexões ────────────────────────────────────────────────────
  const connections = phase6?.connections ?? [];
  const modes       = phase6?.modes ?? [];
  const intention   = phase6?.intention ?? '';

  const phase6Html = section('Fase 6', '#0891b2', 'Conexões que Importam — com quem e como', `
    ${connections.length > 0 ? sublabel('Quem você quer impactar', '#0891b2') + tags(connections.map(id => REINVENTAR_WHO[id] || id), '#ecfeff', '#0e7490') : ''}
    ${modes.length > 0 ? sublabel('Como prefere se conectar', '#4b5563') + tags(modes.map(id => REINVENTAR_HOW[id] || id), '#f0f9ff', '#0369a1') : ''}
    ${intention ? sublabel('Intenção de relação', '#0891b2') +
      `<p style="font-size:13px;color:#374151;font-style:italic;padding:8px 12px;background:#ecfeff;border-left:3px solid #0891b2;border-radius:4px;margin:4px 0">"${esc(intention)}"</p>` : ''}
  `);

  // ── Phase 7 — O Garimpo ───────────────────────────────────────────────────
  const savedRoles    = phase7?.savedRoles ?? [];
  const discardedRoles = phase7?.discardedRoles ?? [];

  const phase7Html = section('Fase 7', '#059669', 'O Garimpo — papéis que ressoam', `
    ${savedRoles.length > 0 ? sublabel(`✓ Ressoam (${savedRoles.length})`, '#059669') +
      tags(savedRoles.map(id => REINVENTAR_ROLES[id] || id), '#ecfdf5', '#065f46') : ''}
    ${discardedRoles.length > 0 ? sublabel(`✗ Descartados (${discardedRoles.length})`, '#9ca3af') +
      tags(discardedRoles.map(id => REINVENTAR_ROLES[id] || id), '#f9fafb', '#6b7280') : ''}
  `);

  // ── Phase 8 — A Carta ─────────────────────────────────────────────────────
  const letter = phase8?.letter ?? '';
  const letterSection = letter
    ? section('Fase 8', '#dc2626', 'A Carta para o Futuro', `
        <div style="font-size:13px;color:#374151;line-height:1.7;white-space:pre-wrap;font-style:italic;padding:12px;background:#fff5f5;border-radius:8px;border:1px solid #fecaca">${esc(letter)}</div>
      `) : '';

  // ── Compose ───────────────────────────────────────────────────────────────
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Jornada Reinventar — ${esc(name)}</title>
</head>
<body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;color:#1f2937;max-width:700px;margin:0 auto">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#7c3aed,#0891b2);border-radius:16px;padding:28px 24px;margin-bottom:24px;color:#fff">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:3px;opacity:0.8;margin-bottom:4px">Jornada Reinventar</div>
    <h1 style="margin:0 0 4px;font-size:26px;font-weight:700">${esc(name)}</h1>
    <div style="font-size:13px;opacity:0.8">${esc(email)}</div>
    <div style="font-size:11px;opacity:0.6;margin-top:8px;font-family:monospace">ID: ${esc(id)} · ${new Date().toLocaleDateString('pt-BR')}</div>
  </div>

  ${phase1Html}
  ${phase2Html}
  ${phase3Html}
  ${phase4Html}
  ${phase5Html}
  ${phase6Html}
  ${phase7Html}
  ${letterSection}

  <!-- Footer -->
  <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #e5e7eb">
    <p style="font-style:italic;color:#9ca3af;font-size:13px">"A maturidade não é o fim da jornada — é onde ela começa de verdade."</p>
    <p style="font-size:11px;color:#d1d5db;margin-top:8px">Reinventar · ${new Date().getFullYear()}</p>
  </div>
</body>
</html>`;
}
