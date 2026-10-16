import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, Leaf, Mail, Flame, Zap, TrendingUp, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
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

// ── Cross-signal maps ──────────────────────────────────────────────────────────

const SKILL_RIASEC: Record<string, RIASECType> = {
  lideranca: 'E', comunicacao: 'A', resolucao: 'I',
  empatia: 'S', planejamento: 'C', conhecimento: 'I',
  criatividade: 'A', sabedoria: 'S',
};

const ROLE_RIASEC: Record<string, RIASECType> = {
  mentor: 'S', escritora: 'A', consultor: 'E', professor: 'S',
  voluntario: 'S', podcast: 'A', artesao: 'A', coach: 'S',
  cuidador: 'S', guia: 'E', horta: 'R', genealogia: 'I',
  facilitador: 'S', fotografo: 'A', mediador: 'S', narrador: 'A',
  idiomas: 'S', palestrante: 'E', acompanhante: 'S', curador: 'A',
  produtor: 'E', terapeuta: 'S', embaixador: 'E', empreendedor: 'E',
};

// ── Life Paths ─────────────────────────────────────────────────────────────────

interface LifePath {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  examples: string[];
  riasec: RIASECType[];
  roles: string[];
  archetypes: string[];
  causes: string[];
  skills: string[];
  connections_who: string[];
  modes: string[];
}

const LIFE_PATHS: LifePath[] = [
  {
    id: 'mentoria',
    title: 'Mentoria & Transmissão',
    desc: 'Compartilhar décadas de experiência para acelerar o crescimento de outros',
    icon: '🎓',
    color: '#7c3aed',
    examples: ['Mentor(a) de jovens', 'Coach de vida', 'Tutor(a) voluntário(a)', 'Palestrante de experiência'],
    riasec: ['S', 'E'],
    roles: ['mentor', 'professor', 'coach', 'facilitador', 'palestrante', 'idiomas'],
    archetypes: ['sabio', 'guardiao'],
    causes: ['educacao', 'intergeracoes'],
    skills: ['comunicacao', 'empatia', 'sabedoria', 'lideranca'],
    connections_who: ['jovens', 'adultos', 'estudantes'],
    modes: ['individual', 'grupos', 'eventos'],
  },
  {
    id: 'criacao',
    title: 'Criação & Expressão',
    desc: 'Produzir obras, conteúdo ou objetos que expressam sua visão de mundo',
    icon: '🎨',
    color: '#ec4899',
    examples: ['Escritor(a)', 'Criador(a) de conteúdo', 'Artesão(ã)', 'Fotógrafo(a)', 'Podcaster'],
    riasec: ['A', 'I'],
    roles: ['escritora', 'podcast', 'artesao', 'fotografo', 'narrador', 'curador'],
    archetypes: ['criador', 'explorador'],
    causes: ['cultura', 'saude_mental', 'intergeracoes'],
    skills: ['criatividade', 'comunicacao', 'sabedoria'],
    connections_who: ['comunidade', 'pares', 'jovens'],
    modes: ['escrito', 'arte', 'online'],
  },
  {
    id: 'cuidado',
    title: 'Cuidado & Bem-Estar',
    desc: 'Acompanhar e cuidar de pessoas com presença e especialidade',
    icon: '❤️',
    color: '#f43f5e',
    examples: ['Acompanhante terapêutico(a)', 'Cuidador(a) de idosos', 'Terapeuta', 'Voluntário(a) em saúde'],
    riasec: ['S', 'R'],
    roles: ['cuidador', 'acompanhante', 'terapeuta', 'voluntario'],
    archetypes: ['guardiao', 'sabio'],
    causes: ['saude', 'saude_mental', 'cuidado', 'solidao'],
    skills: ['empatia', 'sabedoria', 'conhecimento'],
    connections_who: ['idosos', 'cuidadores', 'vulneraveis', 'familia'],
    modes: ['presencial', 'individual'],
  },
  {
    id: 'consultoria',
    title: 'Consultoria & Especialização',
    desc: 'Aplicar conhecimento acumulado como especialista independente',
    icon: '💼',
    color: '#f59e0b',
    examples: ['Consultor(a) independente', 'Mediador(a)', 'Advisor empresarial', 'Especialista de projetos'],
    riasec: ['E', 'I', 'C'],
    roles: ['consultor', 'palestrante', 'mediador', 'coach'],
    archetypes: ['sabio', 'realizador'],
    causes: ['educacao', 'empreendedorismo'],
    skills: ['conhecimento', 'lideranca', 'resolucao', 'planejamento'],
    connections_who: ['profissionais', 'adultos'],
    modes: ['individual', 'online', 'eventos'],
  },
  {
    id: 'comunidade',
    title: 'Comunidade & Conexão',
    desc: 'Conectar pessoas e fortalecer laços comunitários e intergeracionais',
    icon: '🤝',
    color: '#0891b2',
    examples: ['Facilitador(a) de grupos', 'Organizador(a) comunitário(a)', 'Embaixador(a) de causa'],
    riasec: ['S', 'E'],
    roles: ['facilitador', 'mediador', 'produtor', 'voluntario', 'embaixador'],
    archetypes: ['conector', 'guardiao'],
    causes: ['solidao', 'intergeracoes', 'cultura', 'desigualdade'],
    skills: ['empatia', 'comunicacao', 'lideranca'],
    connections_who: ['pares', 'familia', 'comunidade', 'vulneraveis'],
    modes: ['grupos', 'presencial', 'eventos'],
  },
  {
    id: 'empreendedorismo',
    title: 'Empreendedorismo Social',
    desc: 'Criar iniciativas que geram valor concreto para comunidades e causas',
    icon: '🌱',
    color: '#16a34a',
    examples: ['Empreendedor(a) social', 'Produtor(a) de eventos', 'Fundador(a) de iniciativa'],
    riasec: ['E', 'R'],
    roles: ['empreendedor', 'produtor', 'guia', 'facilitador', 'embaixador'],
    archetypes: ['realizador', 'conector'],
    causes: ['desigualdade', 'solidao', 'empreendedorismo'],
    skills: ['lideranca', 'planejamento', 'resolucao'],
    connections_who: ['vulneraveis', 'comunidade', 'adultos'],
    modes: ['presencial', 'grupos', 'sistema'],
  },
  {
    id: 'legado',
    title: 'Legado & Memória',
    desc: 'Preservar história e transmitir sabedoria para as próximas gerações',
    icon: '📚',
    color: '#b45309',
    examples: ['Genealogista', 'Contador(a) de histórias', 'Curador(a) cultural', 'Escritor(a) de memórias'],
    riasec: ['A', 'S'],
    roles: ['genealogia', 'narrador', 'escritora', 'curador', 'fotografo'],
    archetypes: ['guardiao', 'sabio'],
    causes: ['cultura', 'intergeracoes', 'educacao'],
    skills: ['comunicacao', 'sabedoria', 'conhecimento', 'criatividade'],
    connections_who: ['familia', 'jovens', 'comunidade'],
    modes: ['escrito', 'arte', 'presencial'],
  },
  {
    id: 'natureza',
    title: 'Natureza & Sustentabilidade',
    desc: 'Cuidar do meio ambiente e promover formas de vida sustentáveis',
    icon: '🌿',
    color: '#65a30d',
    examples: ['Cultivador(a) de horta comunitária', 'Guia de ecoturismo', 'Educador(a) ambiental'],
    riasec: ['R', 'I'],
    roles: ['horta', 'guia', 'voluntario'],
    archetypes: ['explorador', 'guardiao', 'realizador'],
    causes: ['meio_ambiente'],
    skills: ['resolucao', 'planejamento', 'conhecimento'],
    connections_who: ['comunidade', 'jovens', 'pares'],
    modes: ['presencial', 'grupos'],
  },
  {
    id: 'presenca',
    title: 'Presença & Autoconhecimento',
    desc: 'Aprofundar a jornada interior e facilitar o crescimento de outros',
    icon: '✨',
    color: '#a855f7',
    examples: ['Facilitador(a) de grupos reflexivos', 'Terapeuta holístico(a)', 'Prof. de meditação'],
    riasec: ['S', 'I'],
    roles: ['terapeuta', 'facilitador', 'acompanhante', 'coach'],
    archetypes: ['sabio', 'explorador'],
    causes: ['saude_mental', 'solidao'],
    skills: ['empatia', 'sabedoria'],
    connections_who: ['pares', 'adultos', 'vulneraveis'],
    modes: ['individual', 'grupos', 'presencial'],
  },
  {
    id: 'lideranca_causa',
    title: 'Liderança & Causa',
    desc: 'Defender causas, liderar movimentos ou representar sua comunidade',
    icon: '✊',
    color: '#dc2626',
    examples: ['Líder comunitário(a)', 'Defensor(a) de direitos', 'Conselheiro(a)', 'Palestrante de causa'],
    riasec: ['E', 'S'],
    roles: ['palestrante', 'embaixador', 'mediador', 'voluntario'],
    archetypes: ['realizador', 'conector', 'guardiao'],
    causes: ['desigualdade', 'saude', 'saude_mental', 'solidao', 'intergeracoes'],
    skills: ['lideranca', 'comunicacao', 'resolucao'],
    connections_who: ['vulneraveis', 'comunidade', 'pares'],
    modes: ['eventos', 'grupos', 'presencial'],
  },
];

// ── Types ──────────────────────────────────────────────────────────────────────

interface JornadaRow {
  id: string;
  user_name: string;
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

interface CrossSignal {
  type: RIASECType;
  sources: string[];
  strength: number;
}

interface Tension {
  title: string;
  body: string;
}

// ── Analysis helpers ───────────────────────────────────────────────────────────

function computeRIASECScores(duels: Record<string, string>): Record<RIASECType, number> {
  const scores: Record<RIASECType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  Object.values(duels).forEach(t => { if (t in scores) scores[t as RIASECType]++; });
  return scores;
}

function buildCrossSignals(
  riasecTop3: RIASECType[],
  topSkillIds: string[],
  savedRoles: string[],
): CrossSignal[] {
  const sources: Record<RIASECType, string[]> = { R: [], I: [], A: [], S: [], E: [], C: [] };

  riasecTop3.slice(0, 3).forEach((t, i) => {
    const labels = ['tipo principal', 'tipo secundário', 'terceiro tipo'];
    sources[t].push(`Duelos de Cenas (${labels[i]})`);
  });

  topSkillIds.forEach(id => {
    const t = SKILL_RIASEC[id];
    if (t) sources[t].push(`Competência: ${COMPETENCY_LABELS[id] || id}`);
  });

  savedRoles.forEach(role => {
    const t = ROLE_RIASEC[role];
    if (t) sources[t].push(`Papel salvo: ${ROLE_LABELS[role] ? ROLE_LABELS[role].split(' ').slice(0, 3).join(' ') + '…' : role}`);
  });

  return (Object.entries(sources) as [RIASECType, string[]][])
    .map(([type, srcs]) => ({ type, sources: srcs, strength: srcs.length }))
    .sort((a, b) => b.strength - a.strength)
    .filter(s => s.strength > 0);
}

function detectTensions(
  riasecTop3: RIASECType[],
  savedRoles: string[],
  topSkillIds: string[],
): Tension[] {
  const tensions: Tension[] = [];
  if (riasecTop3.length === 0) return tensions;
  const topSet = new Set(riasecTop3.slice(0, 2));

  // Papéis salvos sugerem tipo diferente do RIASEC principal
  const roleTypes = savedRoles.map(r => ROLE_RIASEC[r]).filter(Boolean) as RIASECType[];
  const roleOutside = roleTypes.filter(t => !topSet.has(t));
  if (roleTypes.length >= 2 && roleOutside.length >= Math.ceil(roleTypes.length * 0.7)) {
    tensions.push({
      title: 'Papéis escolhidos vs. perfil natural',
      body: `Os papéis que mais te atraíram apontam para um perfil diferente do seu código Holland dominante (${RIASEC[riasecTop3[0]]?.full}). Isso pode indicar que você está sendo atraído por aspirações de crescimento — uma expansão consciente, não uma contradição. Vale perguntar: em que contextos você já atuou assim?`,
    });
  }

  // Top skill RIASEC diverge do RIASEC principal
  if (topSkillIds.length >= 2) {
    const skillTypes = topSkillIds.map(s => SKILL_RIASEC[s]).filter(Boolean) as RIASECType[];
    const freq: Partial<Record<RIASECType, number>> = {};
    skillTypes.forEach(t => { freq[t] = (freq[t] || 0) + 1; });
    const dominantSkillType = (Object.entries(freq) as [RIASECType, number][])
      .sort((a, b) => b[1] - a[1])[0]?.[0];
    if (dominantSkillType && !topSet.has(dominantSkillType) && (freq[dominantSkillType] || 0) >= 2) {
      tensions.push({
        title: 'Competências vs. preferências de personalidade',
        body: `Suas competências mais destacadas convergem para o perfil ${RIASEC[dominantSkillType]?.full}, enquanto seus Duelos de Cenas indicam preferência por ${RIASEC[riasecTop3[0]]?.full}. Às vezes desenvolvemos habilidades pelo que a vida exigiu — diferente do que genuinamente nos energiza. Esse contraste é um dado valioso sobre onde você pode querer crescer.`,
      });
    }
  }

  // Perfil muito concentrado (3 tipos iguais) — baixa diversidade
  const analyticalTypes: RIASECType[] = ['I', 'C'];
  const allAnalytical = riasecTop3.slice(0, 2).every(t => analyticalTypes.includes(t));
  if (allAnalytical && savedRoles.some(r => ['facilitador', 'mentor', 'coach', 'professor', 'mediador'].includes(r))) {
    tensions.push({
      title: 'Perfil analítico com aspiração relacional',
      body: 'Seu código Holland é predominantemente analítico, mas vários papéis que você salvou têm forte componente de conexão humana. Isso sugere um híbrido valioso: a combinação de rigor e cuidado é rara e muito necessária em papéis de mentoria, facilitação e consultoria.',
    });
  }

  return tensions;
}

function buildSynthesisSentence(
  riasecTop3: RIASECType[],
  topCauseLabel: string,
  topRole: string,
  flowActivities: string[],
): string {
  if (riasecTop3.length === 0) return '';
  const primary = RIASEC[riasecTop3[0]];
  const secondary = riasecTop3[1] ? RIASEC[riasecTop3[1]] : null;
  const causeText = topCauseLabel ? ` com interesse especial em ${topCauseLabel.toLowerCase()}` : '';
  const roleText = topRole ? `. O papel que mais ressoou — ${ROLE_LABELS[topRole]?.split(' ').slice(0, 4).join(' ')}... — é uma pista concreta sobre o próximo capítulo` : '';
  const energyText = flowActivities.length > 0 ? `. Atividades como "${flowActivities[0]}" estão no centro do que te energiza` : '';
  const secondaryText = secondary ? ` e inclinação para o perfil ${secondary.full.toLowerCase()}` : '';
  return `Você tem um perfil predominantemente ${primary.full.toLowerCase()}${secondaryText}${causeText}${energyText}${roleText}.`;
}

interface PathResult {
  path: LifePath;
  score: number;
  signals: string[];
}

function computePathScores(
  riasecTop3: RIASECType[],
  savedRoles: string[],
  topSkillIds: string[],
  impactPoints: Record<string, unknown>,
  archetype5: string,
  connections: string[],
  modes: string[],
): PathResult[] {
  const posWeights = [15, 7, 3];
  return LIFE_PATHS.map(path => {
    let score = 0;
    const signals: string[] = [];

    // RIASEC (max 25)
    let riasecScore = 0;
    path.riasec.forEach(type => {
      const pos = riasecTop3.indexOf(type);
      if (pos >= 0) riasecScore += posWeights[pos] ?? 2;
    });
    riasecScore = Math.min(riasecScore, 25);
    score += riasecScore;
    if (riasecScore >= 10) {
      const matched = path.riasec.filter(t => riasecTop3.slice(0, 2).includes(t));
      if (matched.length > 0)
        signals.push(`Perfil ${matched.map(t => RIASEC[t].full).join(' + ')}`);
    }

    // Saved roles (max 22)
    const roleMatches = savedRoles.filter(r => path.roles.includes(r));
    score += Math.min(roleMatches.length * 5, 22);
    if (roleMatches.length > 0)
      signals.push(`${roleMatches.length} papel${roleMatches.length > 1 ? 'éis salvos' : ' salvo'}`);

    // Skills (max 18)
    const skillMatches = topSkillIds.filter(s => path.skills.includes(s));
    score += Math.min(skillMatches.length * 4, 18);
    if (skillMatches.length >= 2)
      signals.push(`${skillMatches.length} competências em destaque`);

    // Causes (max 15)
    const causeMatches = path.causes.filter(c => (impactPoints[c] as number ?? 0) > 0);
    score += Math.min(causeMatches.length * 5, 15);
    if (causeMatches.length > 0)
      signals.push(`Causa: ${CAUSE_LABELS[causeMatches[0]] || causeMatches[0]}`);

    // Archetype (max 10)
    if (archetype5 && path.archetypes.includes(archetype5)) {
      score += 10;
      signals.push('Arquétipo alinhado');
    }

    // Connections + modes (max 10)
    const connMatches = connections.filter(c => path.connections_who.includes(c)).length;
    const modeMatches = modes.filter(m => path.modes.includes(m)).length;
    score += Math.min((connMatches + modeMatches) * 2, 10);

    return { path, score: Math.min(Math.round(score), 100), signals };
  }).sort((a, b) => b.score - a.score);
}

// ── Reinventar Mandala ─────────────────────────────────────────────────────────

function ReinventarMandala({ hollandCode }: { hollandCode: string }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col items-center">
      <div className="text-[10px] font-mono text-[var(--color-brand-500)] tracking-widest uppercase mb-3 text-center">
        Mandala da Reinvenção
      </div>
      <svg viewBox="0 0 260 260" className="w-full max-w-[200px] mx-auto" aria-hidden="true">
        {/* TL — O que te Energiza */}
        <circle cx="93" cy="93" r="70" fill="#7c3aed" fillOpacity="0.13" stroke="#7c3aed" strokeOpacity="0.4" strokeWidth="1.5" />
        {/* TR — O que Você Sabe Fazer */}
        <circle cx="167" cy="93" r="70" fill="#ea580c" fillOpacity="0.13" stroke="#ea580c" strokeOpacity="0.4" strokeWidth="1.5" />
        {/* BL — Seu Perfil Natural */}
        <circle cx="93" cy="167" r="70" fill="#0891b2" fillOpacity="0.13" stroke="#0891b2" strokeOpacity="0.4" strokeWidth="1.5" />
        {/* BR — O que o Mundo Precisa */}
        <circle cx="167" cy="167" r="70" fill="#16a34a" fillOpacity="0.13" stroke="#16a34a" strokeOpacity="0.4" strokeWidth="1.5" />

        {/* Corner labels */}
        <text x="46" y="20" textAnchor="middle" fill="#7c3aed" fontSize="7" fontWeight="600">O que te</text>
        <text x="46" y="29" textAnchor="middle" fill="#7c3aed" fontSize="7" fontWeight="600">Energiza</text>

        <text x="214" y="20" textAnchor="middle" fill="#ea580c" fontSize="7" fontWeight="600">O que Sabe</text>
        <text x="214" y="29" textAnchor="middle" fill="#ea580c" fontSize="7" fontWeight="600">Fazer</text>

        <text x="46" y="238" textAnchor="middle" fill="#0891b2" fontSize="7" fontWeight="600">Seu Perfil</text>
        <text x="46" y="247" textAnchor="middle" fill="#0891b2" fontSize="7" fontWeight="600">Natural</text>

        <text x="214" y="238" textAnchor="middle" fill="#16a34a" fontSize="7" fontWeight="600">O que o Mundo</text>
        <text x="214" y="247" textAnchor="middle" fill="#16a34a" fontSize="7" fontWeight="600">Precisa</text>

        {/* Center — Holland code */}
        {hollandCode ? (
          <>
            <text x="130" y="124" textAnchor="middle" fill="#78716c" fontSize="7" fontStyle="italic">seu perfil</text>
            <text x="130" y="142" textAnchor="middle" fill="#1c1917" fontSize="17" fontWeight="900" letterSpacing="3">{hollandCode}</text>
          </>
        ) : (
          <text x="130" y="135" textAnchor="middle" fill="#78716c" fontSize="9" fontStyle="italic">reinvenção</text>
        )}
      </svg>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ResultDashboard() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const [remoteData, setRemoteData] = useState<JornadaRow | null>(null);
  const [loading, setLoading] = useState(!!id);
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
      .rpc('get_jornada', { p_id: id })
      .single()
      .then(({ data, error }) => {
        if (error) console.error('Error loading jornada:', error.code, error.message);
        if (data) setRemoteData(data as JornadaRow);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-light)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand-400)] mx-auto mb-3" />
          <p className="text-sm text-stone-400">Carregando seu resultado...</p>
        </div>
      </div>
    );
  }

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

  // ── Phase 1 ─────────────────────────────────────────────────────────────────
  const energyCards     = phase1?.energyCards    ?? {};
  const maturityVerbs   = phase1?.maturityVerbs  ?? [];
  const curiosityThemes = phase1?.curiosityThemes ?? [];
  const flowActivities  = Object.entries(energyCards).filter(([, q]) => q === 'flow').map(([a]) => a);
  const boostActivities = Object.entries(energyCards).filter(([, q]) => q === 'boost').map(([a]) => a);

  // ── Phase 2 ─────────────────────────────────────────────────────────────────
  const skillRatings  = phase2?.skillRatings  ?? {};
  const whoAsksYou    = phase2?.whoAsksYou    ?? [];
  const hiddenTalents = phase2?.hiddenTalents ?? [];
  const topSkills = Object.entries(skillRatings)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .filter(([, s]) => (s as number) >= 3)
    .slice(0, 5)
    .map(([skillId, score]) => ({ label: COMPETENCY_LABELS[skillId] || skillId, score: score as number, id: skillId }));
  const topSkillIds = topSkills.map(s => s.id);

  // ── Phase 3 ─────────────────────────────────────────────────────────────────
  const uniqueProblem = phase3?.uniqueProblem ?? '';
  const impactPoints  = phase3?.impactPoints  ?? {};
  const topCauses = Object.entries(impactPoints)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .filter(([, v]) => (v as number) > 0)
    .slice(0, 5);
  const maxCoins = (topCauses[0]?.[1] as number) || 1;
  const topCauseLabel = topCauses[0] ? (CAUSE_LABELS[topCauses[0][0]] || topCauses[0][0]) : '';

  // ── Phase 4 ─────────────────────────────────────────────────────────────────
  const riasecScores = computeRIASECScores(phase4?.sceneDuels ?? {});
  const riasecTop3 = (Object.entries(riasecScores) as [RIASECType, number][])
    .sort((a, b) => b[1] - a[1])
    .filter(([, n]) => n > 0)
    .slice(0, 3)
    .map(([t]) => t);
  const hollandCode = riasecTop3.join('');

  // ── Phase 5 ─────────────────────────────────────────────────────────────────
  const savedFigures = phase5?.savedFigures ?? [];
  const ministry     = phase5?.ministry ?? '';
  const cargo        = phase5?.cargo ?? '';

  // ── Phase 6 ─────────────────────────────────────────────────────────────────
  const connections = phase6?.connections ?? [];
  const modes       = phase6?.modes       ?? [];
  const intention   = phase6?.intention   ?? '';

  // ── Phase 7 ─────────────────────────────────────────────────────────────────
  const savedRoles = phase7?.savedRoles ?? [];
  const topRole = savedRoles[0] ?? '';

  // ── Phase 8 ─────────────────────────────────────────────────────────────────
  const letter = phase8?.letter ?? '';

  // ── Cross-phase analysis ────────────────────────────────────────────────────
  const crossSignals   = buildCrossSignals(riasecTop3, topSkillIds, savedRoles);
  const topSignal      = crossSignals[0];
  const tensions       = detectTensions(riasecTop3, savedRoles, topSkillIds);
  const synthesisSentence = buildSynthesisSentence(riasecTop3, topCauseLabel, topRole, flowActivities);
  const hasAnalysis    = riasecTop3.length > 0 || crossSignals.length > 0;

  // Convergência: quando RIASEC, skills E roles apontam para o mesmo tipo
  const skillDominant = (() => {
    const freq: Partial<Record<RIASECType, number>> = {};
    topSkillIds.forEach(s => { const t = SKILL_RIASEC[s]; if (t) freq[t] = (freq[t] || 0) + 1; });
    return (Object.entries(freq) as [RIASECType, number][]).sort((a, b) => b[1] - a[1])[0]?.[0];
  })();
  const roleDominant = (() => {
    const freq: Partial<Record<RIASECType, number>> = {};
    savedRoles.forEach(r => { const t = ROLE_RIASEC[r]; if (t) freq[t] = (freq[t] || 0) + 1; });
    return (Object.entries(freq) as [RIASECType, number][]).sort((a, b) => b[1] - a[1])[0]?.[0];
  })();
  const strongConvergence =
    riasecTop3[0] &&
    skillDominant === riasecTop3[0] &&
    roleDominant === riasecTop3[0];

  const archetype5 = phase5?.archetype ?? '';
  const topPathScores = computePathScores(
    riasecTop3, savedRoles, topSkillIds, impactPoints, archetype5, connections, modes,
  );

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

        {/* ── Síntese da Reinvenção + Carta ── */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16 items-stretch">

          {/* Síntese card */}
          {riasecTop3.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-xl p-8 w-full lg:w-1/2 flex flex-col gap-5">
              <div className="text-[10px] font-mono text-[var(--color-brand-500)] tracking-widest uppercase">Síntese da Reinvenção</div>

              {/* Dominant RIASEC type */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 shrink-0"
                  style={{ borderColor: RIASEC[riasecTop3[0]].color, background: RIASEC[riasecTop3[0]].color + '18' }}>
                  {RIASEC[riasecTop3[0]].icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-lg" style={{ color: RIASEC[riasecTop3[0]].color }}>
                      {RIASEC[riasecTop3[0]].full}
                    </span>
                    {hollandCode && (
                      <span className="font-mono font-black text-xs tracking-widest px-2 py-0.5 rounded bg-stone-100 border border-stone-300 text-stone-700">
                        {hollandCode}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500">{RIASEC[riasecTop3[0]].desc}</p>
                </div>
              </div>

              {/* Synthesis sentence */}
              {synthesisSentence && (
                <p className="text-sm text-stone-600 leading-relaxed border-l-2 border-[var(--color-brand-300)] pl-3 italic">
                  {synthesisSentence}
                </p>
              )}

              {/* Key attributes from across phases */}
              <div className="grid grid-cols-2 gap-3 border-t border-stone-100 pt-4">
                {topCauseLabel && (
                  <div className="bg-lime-50 border border-lime-200 rounded-lg p-3">
                    <div className="text-[10px] font-mono text-lime-600 uppercase tracking-wider mb-1">Principal causa</div>
                    <p className="text-sm font-medium text-lime-900 leading-tight">{topCauseLabel}</p>
                  </div>
                )}
                {topRole && (
                  <div className="bg-[var(--color-brand-50)] border border-[var(--color-brand-200)] rounded-lg p-3">
                    <div className="text-[10px] font-mono text-[var(--color-brand-600)] uppercase tracking-wider mb-1">Papel que ressoou</div>
                    <p className="text-xs font-medium text-[var(--color-brand-900)] leading-tight">{ROLE_LABELS[topRole] || topRole}</p>
                  </div>
                )}
                {flowActivities.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="text-[10px] font-mono text-orange-600 uppercase tracking-wider mb-1">Energia máxima em</div>
                    <p className="text-xs font-medium text-orange-900 leading-tight">{flowActivities.slice(0, 2).join(' · ')}</p>
                  </div>
                )}
                {topSkills.length > 0 && (
                  <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                    <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-1">Competência forte</div>
                    <p className="text-xs font-medium text-stone-800 leading-tight">{topSkills[0].label}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right column: Mandala + Carta */}
          {(riasecTop3.length > 0 || letter) && (
            <div className={`w-full flex flex-col gap-6 ${riasecTop3.length > 0 ? 'lg:w-1/2' : ''}`}>
              {riasecTop3.length > 0 && (
                <ReinventarMandala hollandCode={hollandCode} />
              )}
              {letter && (
                <div className="bg-amber-950 border border-amber-800 shadow-lg rounded-xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-xl" />
                  <div className="absolute top-5 right-6 text-amber-600 opacity-40">
                    <Mail className="w-9 h-9" />
                  </div>
                  <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-3 pl-3">Carta ao Eu de Amanhã</div>
                  <h3 className="font-serif text-xl pb-4 mb-5 text-amber-100 border-b border-amber-800 pl-3">Uma mensagem para você mesmo(a)</h3>
                  <div className="whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-amber-100 pl-3">{letter}</div>
                </div>
              )}
            </div>
          )}
        </div>

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

        {/* ── Análise de Convergência ── */}
        {hasAnalysis && (
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-[var(--color-brand-800)] mb-2 text-center lg:text-left">Análise de Convergência</h2>
            <p className="text-stone-500 mb-8 text-center lg:text-left">
              Cruzando os dados de todas as fases para revelar padrões, tendências e oportunidades.
            </p>

            {/* Strong convergence banner */}
            {strongConvergence && riasecTop3[0] && (
              <div className="mb-6 flex items-start gap-3 bg-[var(--color-brand-50)] border border-[var(--color-brand-200)] rounded-xl p-4">
                <Sparkles className="w-5 h-5 text-[var(--color-brand-600)] shrink-0 mt-0.5" />
                <p className="text-sm text-stone-600 leading-relaxed">
                  <strong className="text-[var(--color-brand-700)]">Seus sinais convergem fortemente.</strong>{' '}
                  Seu perfil de personalidade, suas competências destacadas e os papéis que você escolheu apontam todos para o mesmo tipo —{' '}
                  <strong style={{ color: RIASEC[riasecTop3[0]].color }}>{RIASEC[riasecTop3[0]].full}</strong>.
                  Quando quem você é, o que sabe fazer e como quer atuar se alinham, é um forte sinal de clareza sobre o próximo capítulo.
                </p>
              </div>
            )}

            {/* Possibilidades × Perfil RIASEC */}
            {savedRoles.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-xl p-6 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[var(--color-brand-600)]" />
                  <span className="text-xs font-mono text-[var(--color-brand-600)] tracking-wider uppercase">Possibilidades × Perfil</span>
                </div>
                <p className="text-sm text-stone-500 mb-5 leading-relaxed">
                  As possibilidades que chamaram sua atenção, organizadas pelo tipo de personalidade que mais ativam — revelando onde há convergência e onde há espaço para expansão.
                </p>
                {(() => {
                  const byType = {} as Record<RIASECType, string[]>;
                  for (const roleId of savedRoles) {
                    const t = ROLE_RIASEC[roleId];
                    if (t) {
                      if (!byType[t]) byType[t] = [];
                      byType[t].push(roleId);
                    }
                  }
                  const presentTypes = (['R', 'I', 'A', 'S', 'E', 'C'] as RIASECType[]).filter(t => byType[t]?.length);
                  if (presentTypes.length === 0) return null;
                  const aligned = presentTypes.filter(t => riasecTop3.includes(t));
                  const expansion = presentTypes.filter(t => !riasecTop3.includes(t));
                  return (
                    <div className="space-y-4">
                      {aligned.length > 0 && (
                        <div>
                          <div className="text-[10px] font-mono text-[var(--color-brand-600)] uppercase tracking-wider mb-2">
                            Alinhadas com seu perfil natural
                          </div>
                          <div className="space-y-2">
                            {aligned.map(t => (
                              <div key={t} className="rounded-lg p-3 border border-[var(--color-brand-200)]"
                                style={{ background: RIASEC[t].color + '0d' }}>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <span className="text-base">{RIASEC[t].icon}</span>
                                  <span className="text-xs font-bold" style={{ color: RIASEC[t].color }}>{RIASEC[t].full}</span>
                                  <span className="text-[10px] text-stone-400 ml-1">— {RIASEC[t].desc}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {byType[t].map(roleId => (
                                    <span key={roleId} className="text-xs px-2.5 py-1 rounded-full border font-medium"
                                      style={{ background: RIASEC[t].color + '15', borderColor: RIASEC[t].color + '40', color: RIASEC[t].color }}>
                                      {ROLE_LABELS[roleId] || roleId}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {expansion.length > 0 && (
                        <div>
                          <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-2">
                            Aspirações de expansão
                          </div>
                          <div className="space-y-2">
                            {expansion.map(t => (
                              <div key={t} className="rounded-lg p-3 border border-stone-200 bg-stone-50">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <span className="text-base">{RIASEC[t].icon}</span>
                                  <span className="text-xs font-bold text-stone-500">{RIASEC[t].full}</span>
                                  <span className="text-[10px] text-stone-400 italic ml-1">— explorar com curiosidade</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {byType[t].map(roleId => (
                                    <span key={roleId} className="text-xs px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-500">
                                      {ROLE_LABELS[roleId] || roleId}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

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

                {/* All signals bar chart */}
                {crossSignals.length > 1 && (
                  <div className="mt-5 pt-4 border-t border-stone-100">
                    <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">Força de sinal por tipo (quantas fontes convergem)</div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {(['R', 'I', 'A', 'S', 'E', 'C'] as RIASECType[]).map(t => {
                        const sig = crossSignals.find(s => s.type === t);
                        const strength = sig?.strength || 0;
                        const maxStr = crossSignals[0]?.strength || 1;
                        return (
                          <div key={t} className="text-center">
                            <div className="text-xs font-mono mb-1" style={{ color: RIASEC[t].color }}>{t}</div>
                            <div className="h-10 bg-stone-100 rounded mx-auto w-full relative overflow-hidden">
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
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
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

        {/* ── Caminhos para Explorar ── */}
        {topPathScores.length > 0 && topPathScores[0].score > 15 && (
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-[var(--color-brand-800)] mb-2 text-center lg:text-left">
              Caminhos para Explorar
            </h2>
            <p className="text-stone-500 mb-8 text-center lg:text-left leading-relaxed">
              Com base nas suas respostas, estes caminhos têm maior compatibilidade com quem você é e o que te move. São hipóteses, não certezas — explore com curiosidade.
            </p>
            <div className="space-y-4">
              {topPathScores.slice(0, 6).map(({ path, score, signals }, idx) => {
                const matchColor = score >= 65 ? '#16a34a' : score >= 40 ? '#d97706' : '#6b7280';
                const matchLabel = score >= 65 ? 'Alta compatibilidade' : score >= 40 ? 'Boa compatibilidade' : 'Compatível';
                return (
                  <div key={path.id} className="bg-white border border-stone-200 rounded-xl p-6 hover:border-stone-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2"
                        style={{ borderColor: path.color + '50', background: path.color + '18' }}>
                        {path.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            {idx === 0 && (
                              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border"
                                style={{ color: path.color, borderColor: path.color + '60', background: path.color + '12' }}>
                                maior match
                              </span>
                            )}
                            <h3 className="font-semibold text-stone-900">{path.title}</h3>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="font-mono font-black text-lg" style={{ color: matchColor }}>{score}%</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ color: matchColor, background: matchColor + '18' }}>{matchLabel}</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden mb-3">
                          <div className="h-full rounded-full" style={{ width: `${score}%`, background: path.color }} />
                        </div>
                        <p className="text-sm text-stone-600 mb-3">{path.desc}</p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {path.examples.slice(0, 4).map(ex => (
                            <span key={ex} className="text-xs px-2 py-0.5 rounded-full bg-stone-50 border border-stone-200 text-stone-500">{ex}</span>
                          ))}
                        </div>
                        {signals.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {signals.map((s, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{ color: path.color, background: path.color + '12', border: `1px solid ${path.color}30` }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Próximo Passo ── */}
        {tenantConfig?.explore_url && (
          <section className="mb-12">
            <div className="bg-[var(--color-brand-50)] border border-[var(--color-brand-200)] rounded-2xl px-8 py-10 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-600)] flex items-center justify-center mb-4">
                <Star className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl text-[var(--color-brand-800)] mb-2">
                Pronto para o próximo passo?
              </h2>
              <p className="text-stone-500 max-w-sm mx-auto mb-6 text-sm leading-relaxed">
                Leve o que você descobriu aqui para uma conversa real — e veja o que pode acontecer a partir daí.
              </p>
              <a
                href={/^https?:\/\//.test(tenantConfig.explore_url)
                  ? `${tenantConfig.explore_url}${tenantConfig.explore_url.includes('?') ? '&' : '?'}am_id=${encodeURIComponent(id ?? '')}`
                  : '#'}
                rel="noreferrer noopener"
                className="inline-block px-8 py-3 bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)] rounded-full font-semibold transition-colors shadow-sm text-base"
              >
                {tenantConfig.explore_label}
              </a>
            </div>
          </section>
        )}

        {/* ── Footer ── */}
        <div className="mt-4 text-center">
          <p className="text-stone-400 italic mb-6">"O próximo capítulo não começa com uma decisão perfeita — começa com um primeiro passo honesto."</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/comecar/pesquisa${id ? `?id=${id}` : ''}`}
              className="inline-block px-6 py-2.5 border border-[var(--color-brand-300)] text-[var(--color-brand-600)] hover:bg-[var(--color-brand-50)] rounded-full font-medium transition-colors"
            >
              Pesquisa de Satisfação
            </Link>
          </div>
          <p className="mt-3 text-sm text-stone-500">
            Responda a pesquisa para receber o seu relatório aprofundado ✨
          </p>
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
