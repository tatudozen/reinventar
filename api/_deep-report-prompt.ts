// =============================================================================
// Prompt-spec — Gerador do Plano de Reinvenção Reinventar
//
// Recebe os dados brutos de phase_data (Supabase) e o primeiro nome do
// participante, e devolve o prompt completo pronto para enviar ao Gemini.
//
// Para editar o estilo, tom ou estrutura do plano, altere a função
// systemPrompt ou buildDataSection abaixo.
// =============================================================================

// ─── Tipos ──────────────────────────────────────────────────────────────────

interface Phase1 {
  energyCards?:    Record<string, 'flow' | 'boost' | 'neutral' | 'drain'>;
  maturityVerbs?:  string[];
  curiosityThemes?: string[];
}

interface Phase2 {
  skillRatings?:  Record<string, number>;
  detailRatings?: Record<string, number[]>;
  whoAsksYou?:    string[];
  hiddenTalents?: string[];
  cargo?:         string;
}

interface Phase3 {
  impactPoints?:  Record<string, number>;
  uniqueProblem?: string;
  niche?:         string;
  subNiche?:      string;
  ministry?:      string;
}

interface Phase4 {
  sceneDuels?:    Record<string, string>;
  environments?:  string[];
  forcedChoices?: Record<string, string>;
}

interface Phase5 {
  archetype?: string;
}

interface Phase6 {
  connections?: string[];
  modes?:       string[];
}

interface Phase7 {
  savedRoles?:    string[];
  discardedRoles?: string[];
}

interface Phase8 {
  letter?: string;
  businessVision?: string;
}

interface BusinessModel {
  offerFormats?:  string[];
  payer?:         string[];
  ambition?:      string;
  financialGoal?: string;
  assets?:        string[];
}

interface PhaseData {
  phase1?: Phase1;
  phase2?: Phase2;
  phase3?: Phase3;
  phase4?: Phase4;
  phase5?: Phase5;
  phase6?: Phase6;
  phase7?: Phase7;
  phase8?: Phase8;
  businessModel?: BusinessModel;
}

// ─── Dicionários de tradução de slugs ────────────────────────────────────────

const SKILL_LABELS: Record<string, string> = {
  lideranca:    'Liderança e Gestão',
  comunicacao:  'Comunicação e Persuasão',
  resolucao:    'Resolução de Problemas',
  empatia:      'Relações e Empatia',
  planejamento: 'Planejamento e Organização',
  conhecimento: 'Conhecimento Especializado',
  criatividade: 'Criatividade e Inovação',
  sabedoria:    'Autoconhecimento e Sabedoria',
};

const PROBLEM_LABELS: Record<string, string> = {
  solidao_idosos:          'Idosos sozinhos sem apoio ou companhia',
  conhecimento_perdido:    'Conhecimento que se perde sem ser transmitido',
  cuidadores:              'Cuidadores sobrecarregados e sem suporte',
  jovens_sem_mentores:     'Jovens sem mentores ou referências',
  saude_acesso:            'Comunidades sem acesso à saúde de qualidade',
  experiencia_desvalorizada: 'Desvalorização de quem tem mais experiência',
};

// Chapéu que o(a) dono(a) do negócio mais veste (é o CEO do negócio de 1 pessoa)
const CARGO_LABELS: Record<string, string> = {
  especialista: 'O(A) Especialista — entrega conhecimento direto (consultoria, mentoria)',
  criador:      'O(A) Criador(a) — cria produtos, conteúdo e soluções com a própria marca',
  vendedor:     'O(A) Conector(a) — vende, fecha parcerias e conecta pessoas',
  organizador:  'O(A) Organizador(a) — estrutura, planeja e faz a operação rodar',
  mao_na_massa: 'Mão na Massa — produz e executa com as próprias mãos',
  cuidador:     'O(A) Cuidador(a) — atende e cuida das pessoas de perto',
};

const CONNECTION_LABELS: Record<string, string> = {
  jovens:        'Crianças e jovens',
  adultos:       'Adultos em transição',
  pares:         'Pessoas da minha geração (55+)',
  idosos:        'Idosos (75+)',
  familia:       'Minha família',
  comunidade:    'Minha comunidade local',
  vulneraveis:   'Grupos vulneráveis',
  profissionais: 'Profissionais da minha área',
  estudantes:    'Estudantes e aprendizes',
  cuidadores:    'Cuidadores e famílias',
};

const MODE_LABELS: Record<string, string> = {
  presencial: 'Presencialmente',
  online:     'Online / Digital',
  grupos:     'Em grupos e encontros',
  individual: 'Um a um (1:1)',
  escrito:    'Por escrito (blog, livro, cartas)',
  arte:       'Através da arte / expressão',
  sistema:    'Indiretamente (impacto em sistemas)',
  eventos:    'Em eventos e palestras',
};

const ROLE_LABELS: Record<string, string> = {
  mentor:       'Mentor(a) de jovens empreendedores',
  escritora:    'Escritor(a) de memórias e histórias de vida',
  consultor:    'Consultor(a) independente na minha área',
  professor:    'Professor(a) particular ou de oficinas',
  voluntario:   'Voluntário(a) em causa que acredito',
  podcast:      'Criador(a) de podcast ou canal de conteúdo',
  artesao:      'Artesão(ã) e criador(a) de produtos próprios',
  coach:        'Coach de transição de carreira ou vida',
  cuidador:     'Cuidador(a) especializado(a) de idosos',
  guia:         'Guia de turismo cultural ou de natureza',
  horta:        'Criador(a) de horta comunitária ou terapêutica',
  genealogia:   'Pesquisador(a) de genealogia e história familiar',
  facilitador:  'Facilitador(a) de grupos e círculos de conversa',
  fotografo:    'Fotógrafo(a) de família e momentos de vida',
  mediador:     'Mediador(a) de conflitos familiares ou comunitários',
  narrador:     'Narrador(a) de audiolivros e histórias orais',
  idiomas:      'Professor(a) de idiomas para adultos',
  palestrante:  'Palestrante sobre experiência de vida',
  acompanhante: 'Acompanhante terapêutico(a) de idosos',
  curador:      'Curador(a) de espaço cultural ou biblioteca comunitária',
  produtor:     'Produtor(a) de eventos comunitários',
  terapeuta:    'Terapeuta ou facilitador(a) de bem-estar',
  embaixador:   'Embaixador(a) de marca ou causa que acredito',
  empreendedor: 'Empreendedor(a) social de pequena escala',
};

const OFFER_FORMAT_LABELS: Record<string, string> = {
  servico_1a1:   'Serviço ou atendimento 1:1 (consultoria, mentoria, cuidado)',
  oficina:       'Oficinas, cursos ou aulas',
  produto:       'Produto físico ou artesanal',
  conteudo:      'Conteúdo ou assinatura (podcast, canal, newsletter)',
  consultoria:   'Projetos / consultoria para empresas',
  experiencia:   'Experiências e eventos (passeios, encontros, retiros)',
  intermediacao: 'Conectar pessoas e negócios (intermediação, comissão)',
  digital:       'Produto digital (e-book, curso gravado, template)',
};

const PAYER_LABELS: Record<string, string> = {
  pessoas:       'Pessoas físicas / consumidores finais',
  familias:      'Famílias',
  empresas:      'Empresas e negócios',
  escolas_ongs:  'Escolas, ONGs e instituições',
  poder_publico: 'Poder público / prefeituras',
  turistas:      'Turistas e visitantes',
  profissionais: 'Outros profissionais da área',
  plataformas:   'Marcas e plataformas (patrocínio, parceria)',
};

const AMBITION_LABELS: Record<string, string> = {
  extra_leve:   'Renda extra leve (poucas horas por semana)',
  meio_periodo: 'Atividade significativa de meio período',
  principal:    'Nova fonte principal de renda (dedicação alta)',
};

const GOAL_LABELS: Record<string, string> = {
  ate_1k:   'Até R$ 1.000/mês',
  '1k_3k':  'R$ 1.000 a 3.000/mês',
  '3k_6k':  'R$ 3.000 a 6.000/mês',
  acima_6k: 'Acima de R$ 6.000/mês',
  nao_sei:  'Ainda não tem meta definida — quer descobrir',
};

const ASSET_LABELS: Record<string, string> = {
  rede:              'Rede de contatos e indicações',
  reputacao:         'Reputação / autoridade na área',
  audiencia:         'Audiência (redes sociais, lista)',
  capital:           'Capital para investir no começo',
  espaco:            'Espaço físico (sala, ateliê, imóvel)',
  equipamento:       'Equipamentos / ferramentas',
  tempo:             'Tempo livre disponível',
  experiencia_setor: 'Experiência profunda no setor',
};

const FORCED_LABELS: Record<string, Record<string, string>> = {
  estrutura_vs_liberdade: { estrutura: 'Estrutura e equipe', liberdade: 'Autonomia e ritmo próprio' },
  mentor_vs_executor:     { mentor: 'Guiar e transmitir', executor: 'Executar e implementar' },
  profundo_vs_amplo:      { profundo: 'Impacto profundo, alcance menor', amplo: 'Alcance amplo, impacto distribuído' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function translateList<T extends string>(ids: T[], map: Record<string, string>): string {
  return ids.map(id => map[id] ?? id).join(', ') || '—';
}

function computeRiasec(duels: Record<string, string>): Record<string, number> {
  const freq: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const v of Object.values(duels)) {
    if (v in freq) freq[v]++;
  }
  return freq;
}

function formatRiasec(freq: Record<string, number>): string {
  const LABELS: Record<string, string> = {
    R: 'Realista', I: 'Investigativo', A: 'Artístico',
    S: 'Social', E: 'Empreendedor', C: 'Convencional',
  };
  return Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .map(([k, v]) => `${LABELS[k]}=${v}`)
    .join(' · ');
}

function nonEmpty<T>(arr: T[] | undefined): T[] {
  return arr?.filter(Boolean) ?? [];
}

function nonEmptyObj(obj: Record<string, unknown> | undefined): boolean {
  return !!obj && Object.keys(obj).length > 0;
}

// ─── Seção de dados (parte dinâmica do prompt) ───────────────────────────────

function buildDataSection(firstName: string, d: PhaseData): string {
  const lines: string[] = [`=== DADOS DE ${firstName.toUpperCase()} ===\n`];

  // FASE 1
  const p1 = d.phase1 ?? {};
  if (nonEmptyObj(p1.energyCards) || nonEmpty(p1.maturityVerbs).length || nonEmpty(p1.curiosityThemes).length) {
    lines.push('── FASE 1: ENERGIA E RAÍZES ──');
    if (nonEmptyObj(p1.energyCards)) {
      const byLevel: Record<string, string[]> = { flow: [], boost: [], neutral: [], drain: [] };
      for (const [act, level] of Object.entries(p1.energyCards!)) {
        byLevel[level]?.push(act);
      }
      if (byLevel.flow.length)    lines.push(`Flow (não vê o tempo): ${byLevel.flow.join(', ')}`);
      if (byLevel.boost.length)   lines.push(`Energiza: ${byLevel.boost.join(', ')}`);
      if (byLevel.neutral.length) lines.push(`Neutro: ${byLevel.neutral.join(', ')}`);
      if (byLevel.drain.length)   lines.push(`Drena: ${byLevel.drain.join(', ')}`);
    }
    if (nonEmpty(p1.maturityVerbs).length) {
      lines.push(`Verbos de quem é hoje: ${p1.maturityVerbs!.join(', ')}`);
    }
    if (nonEmpty(p1.curiosityThemes).length) {
      lines.push(`Temas de curiosidade: ${p1.curiosityThemes!.join(', ')}`);
    }
    lines.push('');
  }

  // FASE 2 — Talentos + chapéu de dono(a)
  const p2 = d.phase2 ?? {};
  if (nonEmptyObj(p2.skillRatings) || nonEmpty(p2.whoAsksYou).length || nonEmpty(p2.hiddenTalents).length || p2.cargo) {
    lines.push('── FASE 2: TALENTOS MADUROS E PAPEL ──');
    if (nonEmptyObj(p2.skillRatings)) {
      lines.push('Autoavaliação de talentos (1-5):');
      const detail = p2.detailRatings ?? {};
      for (const [id, baseRating] of Object.entries(p2.skillRatings!)) {
        const detailArr = detail[id];
        const score = detailArr?.length ? avg(detailArr) : baseRating;
        const label = SKILL_LABELS[id] ?? id;
        lines.push(`  • ${label}: ${score}`);
      }
    }
    if (nonEmpty(p2.whoAsksYou).length) {
      lines.push(`Quem pede ajuda a ${firstName}: ${p2.whoAsksYou!.join(', ')}`);
    }
    if (nonEmpty(p2.hiddenTalents).length) {
      lines.push(`Talentos que ${firstName} subestima: ${p2.hiddenTalents!.join(', ')}`);
    }
    if (p2.cargo) {
      lines.push(`Chapéu de dono(a) que mais veste: ${CARGO_LABELS[p2.cargo] ?? p2.cargo}`);
    }
    lines.push('');
  }

  // FASE 3 — Nicho + sub-nicho + a dor que resolve
  const p3 = d.phase3 ?? {};
  if (p3.niche || p3.subNiche || p3.uniqueProblem) {
    lines.push('── FASE 3: NICHO E A DOR QUE RESOLVE ──');
    if (p3.niche) {
      lines.push(`Nicho de mercado: ${p3.niche}${p3.subNiche ? ` (sub-nicho: ${p3.subNiche})` : ''}`);
    }
    if (p3.uniqueProblem) {
      lines.push(`Dor que o negócio vai resolver: ${PROBLEM_LABELS[p3.uniqueProblem] ?? p3.uniqueProblem}`);
    }
    lines.push('');
  }

  // FASE 4
  const p4 = d.phase4 ?? {};
  if (nonEmptyObj(p4.sceneDuels) || nonEmpty(p4.environments).length || nonEmptyObj(p4.forcedChoices)) {
    lines.push('── FASE 4: PERFIL E AMBIENTE ──');
    if (nonEmptyObj(p4.sceneDuels)) {
      const freq = computeRiasec(p4.sceneDuels!);
      lines.push(`Frequências RIASEC (12 duelos): ${formatRiasec(freq)}`);
    }
    if (nonEmpty(p4.environments).length) {
      lines.push(`Ambientes preferidos: ${p4.environments!.join(', ')}`);
    }
    if (nonEmptyObj(p4.forcedChoices)) {
      lines.push('Escolhas de valor:');
      for (const [choiceId, optionId] of Object.entries(p4.forcedChoices!)) {
        const label = FORCED_LABELS[choiceId]?.[optionId] ?? optionId;
        const choiceLabel = choiceId.replace(/_vs_/g, ' vs. ').replace(/_/g, ' ');
        lines.push(`  • ${choiceLabel} → ${label}`);
      }
    }
    lines.push('');
  }

  // FASE 5 — Público e Cliente
  const p6 = d.phase6 ?? {};
  if (nonEmpty(p6.connections).length || nonEmpty(p6.modes).length) {
    lines.push('── FASE 5: PÚBLICO E CLIENTE ──');
    if (nonEmpty(p6.connections).length) {
      lines.push(`Público que quer servir: ${translateList(p6.connections!, CONNECTION_LABELS)}`);
    }
    if (nonEmpty(p6.modes).length) {
      lines.push(`Como quer entregar valor: ${translateList(p6.modes!, MODE_LABELS)}`);
    }
    lines.push('');
  }

  // FASE 6 — Garimpo (formatos de oferta em potencial)
  const p7 = d.phase7 ?? {};
  if (nonEmpty(p7.savedRoles).length || nonEmpty(p7.discardedRoles).length) {
    lines.push('── FASE 6: FORMATOS DE OFERTA EXPLORADOS (GARIMPO) ──');
    if (nonEmpty(p7.savedRoles).length) {
      lines.push(`Formatos que ressoaram: ${translateList(p7.savedRoles!, ROLE_LABELS)}`);
    }
    if (nonEmpty(p7.discardedRoles).length) {
      lines.push(`Formatos descartados: ${translateList(p7.discardedRoles!, ROLE_LABELS)}`);
    }
    lines.push('');
  }

  // MODELO DA REINVENÇÃO (camada econômica)
  const bm = d.businessModel ?? {};
  if (nonEmpty(bm.offerFormats).length || nonEmpty(bm.payer).length || bm.ambition || bm.financialGoal || nonEmpty(bm.assets).length) {
    lines.push('── MODELO DA REINVENÇÃO (dados de negócio) ──');
    if (nonEmpty(bm.offerFormats).length) {
      lines.push(`Formato(s) de oferta: ${translateList(bm.offerFormats!, OFFER_FORMAT_LABELS)}`);
    }
    if (nonEmpty(bm.payer).length) {
      lines.push(`Quem paga (cliente): ${translateList(bm.payer!, PAYER_LABELS)}`);
    }
    if (bm.ambition) {
      lines.push(`Ambição / dedicação: ${AMBITION_LABELS[bm.ambition] ?? bm.ambition}`);
    }
    if (bm.financialGoal) {
      lines.push(`Meta de renda: ${GOAL_LABELS[bm.financialGoal] ?? bm.financialGoal}`);
    }
    if (nonEmpty(bm.assets).length) {
      lines.push(`Ativos que já possui: ${translateList(bm.assets!, ASSET_LABELS)}`);
    }
    lines.push('');
  }

  // FASE 8
  const p8 = d.phase8 ?? {};
  if (p8.businessVision?.trim()) {
    lines.push('── FASE 8: VISÃO DO NEGÓCIO EM 1 ANO ──');
    lines.push(p8.businessVision.trim());
    lines.push('');
  }
  if (p8.letter?.trim()) {
    lines.push('── FASE 8: CARTA AO EU DE AMANHÃ ──');
    lines.push(p8.letter.trim());
    lines.push('');
  }

  return lines.join('\n');
}

// ─── Prompt de sistema (instruções estáticas) ────────────────────────────────

function systemPrompt(firstName: string): string {
  return `Você é a voz do Plano de Reinvenção Reinventar (AlquimiaZen).

Você é duas coisas ao mesmo tempo: uma testemunha que leu com atenção tudo que ${firstName} revelou, e um(a) sócio(a) de negócio experiente, que sabe transformar experiência de vida em uma fonte de renda real. Caloroso como quem entende a pessoa; concreto como quem já ajudou muita gente a começar.

${firstName} tem 55 anos ou mais e está diante de uma pergunta prática e honesta: *"Como transformo tudo que vivi até aqui em uma nova fonte de renda — extra ou principal?"* Este Plano não entrega um sonho genérico. Entrega um esboço de negócio sob medida, baseado no que ${firstName} escolheu ao longo da jornada.

---

### VOZ E TOM (Brand Voice Reinventar)

**A voz é testemunhal — fale a partir do que VIU:**
- "Vi que você escolheu…", "Quando você colocou todas as moedas em…", "Três vezes durante a jornada você voltou a…"
- Nunca: "O participante demonstrou preferência por…" — impessoal não tem vez aqui.

**Caloroso sem açúcar:**
- O calor vem de ter prestado atenção de verdade — não de elogios genéricos.
- "Décadas construindo para os outros. Faz sentido que agora a pergunta seja: e para mim, o que fica?" — isso é calor real.
- Nunca: "Que respostas poderosas! Você é incrível!" — cheerleading vazio não entra.

**Filosófico sem avisar:**
- A reflexão emerge das evidências, nunca é anunciada com "A lição aqui é…"
- "Talvez o que você descartou diga tanto quanto o que guardou." — deixa o pensamento no ar.
- Nunca resolva o que a vida ainda mantém aberto.

**Cadência:**
- Parágrafos curtos. Respiro frequente. Frases que pausam quando o peso pede pausa.
- CAPS pontual para ênfase — não para gritar, mas para marcar o que importa.
- Linguagem de HIPÓTESE, nunca de sentença: "sinal forte", "pista", "vale explorar", "pode ser que".

**Linguagem:**
- Use: caminhada, capítulo, segundo ato, evidência, sinal, pista
- Evite: processo, jornada (sobrescrito), trajetória, competências, mapeamento, perfil comportamental
- Nunca: "ainda dá tempo", "não é tarde", linguagem de urgência negativa de qualquer tipo
- Nunca: "você deveria", "é recomendado" — convite sempre, ordem nunca

**Abertura e fechamento:**
- Abre com **"Plano de Reinvenção de ${firstName}"** e uma frase curta de boas-vindas.
- Fecha com **"Com admiração pela sua caminhada, AlquimiaZen"**
- Segue um **P.S.** — o pensamento que ficou depois de tudo. Uma pergunta genuína, específica às respostas de ${firstName}, que o leitor carrega por dias. Não retórica. Sem resposta embutida.

---

### ESTRUTURA OBRIGATÓRIA (8 SEÇÕES — este é um PLANO, não um relatório)

**1. Sua Essência Empreendedora**
Síntese curta (2 parágrafos) de quem ${firstName} é como base do negócio: a energia que sustenta (flow/boost), os talentos maduros e a causa que move. Nomeie a *vantagem injusta* dos 55+: experiência, rede e autoridade que ninguém começando do zero tem.

**2. A Oferta**
O coração do plano. A partir dos formatos de oferta escolhidos (Modelo da Reinvenção) + papéis que ressoaram (Fase 7) + talentos, proponha de 1 a 3 ofertas CONCRETAS. Cada uma com: um nome simples, uma frase que o próprio cliente entenderia ("Eu ajudo ___ a ___"), e o que a pessoa recebe na prática. Nada genérico — ofertas que dá para começar a vender.

**3. Para Quem & a Dor que Resolve**
Diferencie com clareza *quem paga* (o cliente, dos dados de negócio) de *quem ${firstName} quer impactar* (Fase 6) — às vezes são pessoas diferentes, e isso muda o plano. Conecte com a dor/problema escolhido na Fase 3. Explique, concretamente, por que esse cliente pagaria por isso.

**4. Como Gera Receita**
O modelo de dinheiro. Coerente com os formatos de oferta: como se cobra (por sessão, por projeto, mensalidade, por produto, ingresso…). Sugira uma FAIXA DE PREÇO inicial realista e conservadora, ancorada na meta de renda e no nível de ambição. Aponte os canais (presencial/online, dos modos da Fase 6 e ambientes da Fase 4) e de onde podem vir os 3 primeiros clientes — usando os ativos que ${firstName} já tem (rede, reputação, audiência).

**5. Sua Vantagem aos 55+**
Os ativos declarados (rede, reputação, audiência, capital, espaço, tempo, experiência de setor) + "quem já pede ajuda a ${firstName}" (Fase 2). O que reduz o risco do começo. Se faltar um ativo importante, trate como oportunidade de parceria — nunca como fraqueza.

**6. Plano dos Primeiros 90 Dias**
3 movimentos concretos e gentis, calibrados pelo nível de ambição:
- **Validar** (semanas 1-3): conversar com 5 possíveis clientes para confirmar a dor e o preço.
- **Estruturar** (semanas 4-8): montar a versão mínima da oferta (uma página simples, um roteiro, um portfólio pequeno).
- **Primeira venda** (semanas 9-12): conseguir o primeiro cliente pago ou um piloto, mesmo que pequeno.

**7. Metas & Horizonte**
Traduza a meta de renda em marcos realistas de 3, 6 e 12 meses, coerentes com a ambição escolhida (renda extra leve ≠ fonte principal). Números modestos e conservadores. Se não houver meta definida, proponha uma meta inicial de *descoberta* (ex.: "o objetivo dos primeiros 90 dias é a primeira venda, não o faturamento").

**8. Riscos Honestos & O Primeiro Passo desta Semana**
1 ou 2 riscos reais, ditos sem drama e já com uma forma de reduzir cada um. Termine com UM passo concreto para os próximos 7 dias — pequeno, possível de fazer ainda esta semana.

---

### REGRAS DO PLANO
- Cite as respostas REAIS de ${firstName} como base de cada recomendação — o plano precisa ser claramente DELE(A), não um template.
- Cruze múltiplas fases ao propor a oferta e o cliente. Nunca conclua a partir de uma resposta isolada.
- Seja concreto e acionável: nomes de oferta, faixas de preço, canais, números. Um plano que não dá para executar não serve.
- Campos ausentes: contorne com elegância, propondo o passo que preencheria a lacuna — sem "não foi possível analisar X".
- Se houver carta ou visão de negócio (Fase 8), ela tem peso especial: é a voz não filtrada de ${firstName}. Ancore o plano nela.

### RESPONSABILIDADE (não negociável)
- Preços, metas e projeções são SUGESTÕES realistas e conservadoras — nunca promessas de ganho. Deixe isso claro quando citar números.
- Nunca recomende investir dinheiro que ${firstName} não pode perder, nem dívidas para começar.
- Sem diagnóstico de personalidade ou de saúde mental.
- Se as respostas sugerirem isolamento ou sofrimento, inclua com delicadeza o incentivo a buscar apoio de pessoas próximas.
- Linguagem de urgência negativa é proibida. A reinvenção é um ato de abundância, não de compensação pelo tempo passado.`;
}

// ─── Função pública ───────────────────────────────────────────────────────────

export function buildDeepReportPrompt(firstName: string, phaseData: unknown): string {
  const d = (phaseData ?? {}) as PhaseData;
  const name = firstName.trim() || 'Viajante';

  return `${systemPrompt(name)}

${buildDataSection(name, d)}

Gere agora o Plano de Reinvenção completo para ${name}, seguindo as 8 seções obrigatórias.`;
}
