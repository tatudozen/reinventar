// =============================================================================
// Prompt-spec — Gerador do Relatório Profundo Reinventar
//
// Recebe os dados brutos de phase_data (Supabase) e o primeiro nome do
// participante, e devolve o prompt completo pronto para enviar ao Gemini.
//
// Para editar o estilo, tom ou estrutura do relatório, altere a função
// SYSTEM_PROMPT ou DATA_SECTION abaixo.
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
}

interface Phase3 {
  impactPoints?:  Record<string, number>;
  uniqueProblem?: string;
}

interface Phase4 {
  sceneDuels?:    Record<string, string>;
  environments?:  string[];
  forcedChoices?: Record<string, string>;
}

interface Phase5 {
  ministry?:         string;
  cargo?:            string;
  savedFigures?:     string[];
  discardedFigures?: string[];
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

const CAUSE_LABELS: Record<string, string> = {
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

const PROBLEM_LABELS: Record<string, string> = {
  solidao_idosos:          'Idosos sozinhos sem apoio ou companhia',
  conhecimento_perdido:    'Conhecimento que se perde sem ser transmitido',
  cuidadores:              'Cuidadores sobrecarregados e sem suporte',
  jovens_sem_mentores:     'Jovens sem mentores ou referências',
  saude_acesso:            'Comunidades sem acesso à saúde de qualidade',
  experiencia_desvalorizada: 'Desvalorização de quem tem mais experiência',
};

const MINISTRY_LABELS: Record<string, string> = {
  economia:              'Economia',
  saude:                 'Saúde',
  ciencia_tecnologia:    'Ciência e Tecnologia',
  educacao:              'Educação',
  justica:               'Justiça',
  cultura:               'Cultura',
  meio_ambiente:         'Meio Ambiente',
  infraestrutura:        'Infraestrutura',
  desenvolvimento_social: 'Desenvolvimento Social',
  comunicacoes:          'Comunicações',
};

const CARGO_LABELS: Record<string, string> = {
  ministro:              'Ministro(a) — lidera e define a visão',
  consultor_tecnico:     'Consultor(a) Técnico(a) — resolve com análise e dados',
  assessor_comunicacao:  'Assessor(a) de Comunicação — traduz e comunica ideias',
  diretor_operacoes:     'Diretor(a) de Operações — organiza e garante execução',
  coordenador_campo:     'Coordenador(a) de Campo — coloca a mão na massa',
  secretario_social:     'Secretário(a) de Bem-Estar — cuida das pessoas',
};

const FIGURE_LABELS: Record<string, string> = {
  sanders:      'Colonel Sanders (reinventou aos 65)',
  child:        'Julia Child (primeiro livro aos 50)',
  moses:        'Vovó Moses (começou a pintar aos 78)',
  kroc:         'Ray Kroc (McDonald\'s aos 52)',
  mandela:      'Nelson Mandela (presidente aos 71)',
  frankl:       'Viktor Frankl (logoterapia e sentido)',
  marco:        'Marco Aurélio (filosofia estoica)',
  gandhi:       'Mahatma Gandhi (resistência não-violenta)',
  curie:        'Marie Curie (Nobel em duas áreas)',
  sagan:        'Carl Sagan (curiosidade como missão)',
  attenborough: 'David Attenborough (voz da natureza)',
  davinci:      'Leonardo da Vinci (arte e ciência)',
  kahlo:        'Frida Kahlo (autenticidade e resiliência)',
  tolkien:      'J.R.R. Tolkien (Senhor dos Anéis aos 62)',
  niemeyer:     'Oscar Niemeyer (criou até os 104)',
  drummond:     'Carlos Drummond de Andrade (poesia)',
  freire:       'Paulo Freire (educação como amor)',
  evaristo:     'Conceição Evaristo (primeiro livro aos 44)',
  clarice:      'Clarice Lispector (interior humano)',
  teresa:       'Madre Teresa (Nobel da Paz aos 69)',
  wangari:      'Wangari Maathai (47 mi de árvores)',
  malala:       'Malala Yousafzai (educação como direito)',
  drucker:      'Peter Drucker (liderança pelo autoconhecimento)',
  buffett:      'Warren Buffett (paciência e princípios)',
  aristoteles:  'Aristóteles (o que é uma vida boa?)',
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

  // FASE 2
  const p2 = d.phase2 ?? {};
  if (nonEmptyObj(p2.skillRatings) || nonEmpty(p2.whoAsksYou).length || nonEmpty(p2.hiddenTalents).length) {
    lines.push('── FASE 2: TALENTOS MADUROS ──');
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
    lines.push('');
  }

  // FASE 3
  const p3 = d.phase3 ?? {};
  if (nonEmptyObj(p3.impactPoints) || p3.uniqueProblem) {
    lines.push('── FASE 3: CAUSA DA REINVENÇÃO ──');
    if (nonEmptyObj(p3.impactPoints)) {
      const sorted = Object.entries(p3.impactPoints!)
        .filter(([, v]) => v > 0)
        .sort(([, a], [, b]) => b - a);
      lines.push('Distribuição de moedas por causa (10 no total):');
      for (const [id, pts] of sorted) {
        lines.push(`  • ${CAUSE_LABELS[id] ?? id}: ${pts} moeda(s)`);
      }
    }
    if (p3.uniqueProblem) {
      lines.push(`Problema mais urgente escolhido: ${PROBLEM_LABELS[p3.uniqueProblem] ?? p3.uniqueProblem}`);
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

  // FASE 5
  const p5 = d.phase5 ?? {};
  if (p5.ministry || p5.cargo || nonEmpty(p5.savedFigures).length || nonEmpty(p5.discardedFigures).length) {
    lines.push('── FASE 5: MINISTÉRIO DOS SONHOS ──');
    if (p5.ministry) {
      lines.push(`Área dos sonhos: ${MINISTRY_LABELS[p5.ministry] ?? p5.ministry}`);
    }
    if (p5.cargo) {
      lines.push(`Papel preferido: ${CARGO_LABELS[p5.cargo] ?? p5.cargo}`);
    }
    if (nonEmpty(p5.savedFigures).length) {
      lines.push(`Figuras que ressoam (time dos sonhos): ${translateList(p5.savedFigures!, FIGURE_LABELS)}`);
    }
    if (nonEmpty(p5.discardedFigures).length) {
      lines.push(`Figuras descartadas (o que NÃO quer ser): ${translateList(p5.discardedFigures!, FIGURE_LABELS)}`);
    }
    lines.push('');
  }

  // FASE 6
  const p6 = d.phase6 ?? {};
  if (nonEmpty(p6.connections).length || nonEmpty(p6.modes).length) {
    lines.push('── FASE 6: COM QUEM E COMO ──');
    if (nonEmpty(p6.connections).length) {
      lines.push(`Públicos com quem quer atuar: ${translateList(p6.connections!, CONNECTION_LABELS)}`);
    }
    if (nonEmpty(p6.modes).length) {
      lines.push(`Como quer atuar: ${translateList(p6.modes!, MODE_LABELS)}`);
    }
    lines.push('');
  }

  // FASE 7
  const p7 = d.phase7 ?? {};
  if (nonEmpty(p7.savedRoles).length || nonEmpty(p7.discardedRoles).length) {
    lines.push('── FASE 7: POSSIBILIDADES EXPLORADAS ──');
    if (nonEmpty(p7.savedRoles).length) {
      lines.push(`Papéis que ressoaram: ${translateList(p7.savedRoles!, ROLE_LABELS)}`);
    }
    if (nonEmpty(p7.discardedRoles).length) {
      lines.push(`Papéis descartados: ${translateList(p7.discardedRoles!, ROLE_LABELS)}`);
    }
    lines.push('');
  }

  // FASE 8
  const p8 = d.phase8 ?? {};
  if (p8.letter?.trim()) {
    lines.push('── FASE 8: CARTA AO EU DE AMANHÃ ──');
    lines.push(p8.letter.trim());
    lines.push('');
  }

  return lines.join('\n');
}

// ─── Prompt de sistema (instruções estáticas) ────────────────────────────────

function systemPrompt(firstName: string): string {
  return `Você é o analista da Jornada Reinventar (AlquimiaZen).

Recebe as respostas de ${firstName}, que tem 55 anos ou mais e está em um momento de reinvenção — aposentadoria, transição, legado ou novo propósito. Sua tarefa é gerar um **Relatório Profundo** personalizado em português (pt-BR).

${firstName} precisa se reconhecer em cada linha e sentir que décadas de vida têm valor imenso neste próximo capítulo.

### VOZ E TOM
- Caloroso, respeitoso, direto ao leitor ("Você"), com profundidade — nunca condescendente, nunca corporativo.
- Honra a experiência acumulada como o maior ativo, não como peso.
- Abre com **"Para ${firstName}, que chegou até aqui."**
- Fecha com **"Com admiração pela sua coragem de reinventar, AlquimiaZen"** seguido de um **P.S.** com uma pergunta aberta e reflexiva.
- CAPS pontual para ênfase emocional. Parágrafos curtos.
- Linguagem de HIPÓTESE, nunca de sentença: "sinal forte", "pista", "vale explorar". NUNCA determinista.

### ESTRUTURA OBRIGATÓRIA (7 SEÇÕES)

**1. Motor de Energia**
Compare atividades flow/boost (energizam) vs. drain (esvaziam). Cruze com os verbos de identidade e as escolhas de valor (forcedChoices). Encontre o padrão do que alimenta este capítulo de vida. Se a carta mencionar algo que aparece como "flow", aponte a convergência com cuidado.

**2. Talentos Maduros**
Perfil de competências a partir das autoavaliações. Valide com "quem pede ajuda" — o que os outros já reconhecem há décadas. Nomeie o perfil usando os talentos subestimados, se existirem. Inclua UM alerta honesto sobre o talento menos desenvolvido — como oportunidade de parceria, nunca como fraqueza.

**3. A Causa da Reinvenção**
Leia a distribuição de moedas + problema escolhido. Mostre a convergência com outras fases: causa + energia + público escolhido + papéis salvos. A causa não é abstrata — é onde décadas de vida encontram o mundo que precisa de alguém como ${firstName}.

**4. A Contradição mais Reveladora**
Encontre UMA tensão real entre fases (ex.: perfil RIASEC vs. papéis salvos; escolha mentor_vs_executor vs. cargo; ambientes vs. modos; figuras descartadas vs. causa). Apresente como PERGUNTA aberta, nunca como erro.

**5. Figuras Inspiradoras & o Espelho do Time**
Leia as figuras que ressoam como espelho de valores. Leia as descartadas com igual atenção — o que ${firstName} claramente NÃO quer ser diz tanto quanto o que quer. Conecte com a área e o papel do Ministério dos Sonhos.

**6. 3 Hipóteses de Segundo Ato**
Sintetize TUDO pelas 3 lentes do Reinventar:
- ESSÊNCIA (quem você naturalmente é): energia, verbos, talentos, RIASEC, figuras.
- IMPACTO (o que você quer construir): causa, problema, conexões, modos, forcedChoices.profundo_vs_amplo.
- TERRITÓRIO (a arena que você escolheu): área do ministério, cargo, ambientes, papéis salvos.

Cada hipótese: nome do segundo ato, aderência (alta/média), evidências das respostas reais, conexão com a carta (se existir).

**7. Primeiros Passos Concretos**
3 ações de 2 a 4 semanas — realistas para 55+:
- Uma conversa: entrevistar alguém que já vive um dos papéis salvos.
- Um experimento: testar na prática (voluntariado, projeto piloto, oficina).
- Uma reflexão: ler, assistir ou acompanhar algo ligado à causa principal.

### REGRAS DE ANÁLISE
- Cite as respostas REAIS de ${firstName} como evidência — o leitor precisa se reconhecer.
- Cruze no mínimo 3 fases por conclusão. Nunca conclua de uma resposta só.
- Campos ausentes (seções vazias): simplesmente não mencione.
- Feche com convite de compartilhamento + P.S. reflexivo.

### SEGURANÇA PSICOLÓGICA (não negociável)
- Sem diagnóstico de personalidade ou de saúde mental.
- Contradições viram perguntas, nunca julgamentos.
- Se as respostas sugerirem isolamento ou sofrimento, inclua com delicadeza o incentivo a buscar apoio.
- Nunca use linguagem de "chegou tarde" ou que implique urgência negativa. A reinvenção é um ato de abundância.`;
}

// ─── Função pública ───────────────────────────────────────────────────────────

export function buildDeepReportPrompt(firstName: string, phaseData: unknown): string {
  const d = (phaseData ?? {}) as PhaseData;
  const name = firstName.trim() || 'Viajante';

  return `${systemPrompt(name)}

${buildDataSection(name, d)}

Gere agora o Relatório Profundo completo para ${name}, seguindo as 7 seções obrigatórias.`;
}
