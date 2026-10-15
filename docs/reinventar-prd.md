# PRD — Reinventar: Jornada de Propósito para a Terceira Idade

**Versão:** 0.1  
**Autor:** Fernando Santiago  
**Status:** Rascunho  
**Criado:** 2026-10-09  
**Base:** Jornada Ikigai (app em produção) — adaptação de conteúdo e UX para público 55+

---

## 1. Visão

Criar um web app separado que adapta a experiência da Jornada Ikigai para pessoas na terceira fase da vida (55+), ajudando-as a descobrir — ou redescobrir — um propósito renovado, reconhecer a sabedoria acumulada e imaginar o próximo capítulo com clareza e entusiasmo.

**Tagline:** *"Você já viveu muito. Agora, o que ainda quer viver?"*

---

## 2. Público-Alvo

| Perfil | Detalhe |
|--------|---------|
| Idade | 55–80 anos |
| Momento de vida | Aposentadoria recente ou próxima, "ninho vazio", transição de carreira, busca de significado na segunda metade da vida |
| Motivação central | Sentir que ainda há muito a contribuir e descobrir |
| Barreiras típicas | Baixa familiaridade com interfaces digitais complexas, cansaço visual, medo de "ser tarde demais" |
| Diferença do público Ikigai | Não estão escolhendo uma profissão; estão redescobrindo quem são e o que querem fazer com o tempo e a experiência que têm |

---

## 3. Princípios de Adaptação

1. **Linguagem acolhedora, não juvenil.** Sem gírias, sem "missões épicas". Tom de conversa respeitosa entre adultos.
2. **Foco no que já foi vivido.** As perguntas partem da experiência acumulada, não de sonhos futuros abstratos.
3. **UX acessível.** Fontes maiores, áreas de toque generosas, fluxo mais linear e sem pressa.
4. **Sem ranking, sem pressão.** Mesmos princípios éticos da Jornada Ikigai — hipóteses, não sentenças; sem FOMO.
5. **Profundidade emocional.** O público 55+ tolera e aprecia reflexões mais longas e significativas.
6. **Sem gamificação excessiva.** XP e moedas existem no backend, mas a linguagem na tela é de "reflexão concluída", não de "missão completada".

---

## 4. Stack Técnica

Idêntica à Jornada Ikigai — app React completamente separado, mesmo padrão de componentes.

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS 4 |
| Roteamento | React Router 7 |
| Animação | Framer Motion |
| IA | Google Gemini (`@google/genai`) |
| Banco/Auth | Firebase (Firestore + Auth) ou Supabase |
| Deploy | Vercel |
| Componentes base | Reutilizados da Jornada Ikigai (`ImageSwiper`, `MissionWrapper`, `ShareQuizLink`, etc.) |

---

## 5. Adaptações de UX

| Item | Jornada Ikigai (adolescentes) | Reinventar (55+) |
|------|-------------------------------|-----------------|
| Tamanho de fonte base | 14–16px | 16–18px |
| Área mínima de toque | 44px | 52px |
| Velocidade de animação | Rápida (0.2–0.3s) | Moderada (0.3–0.5s) |
| Linguagem dos steps | "Missão 1", "XP", "Flow/Drain" | "Fase 1", "Reflexão concluída", "Energiza/Esgota" |
| Número de fases | 8 | 8 |
| Progresso | Barra + ícone de missão | Barra + nome da fase por extenso |
| Mentores | Arquétipos ficcionais jovens | Figuras de sabedoria e presença madura |
| Conclusão | "Avançar para Missão X" | "Continuar para a próxima reflexão" |
| Compartilhamento | Link de indicação | Mantido (am_id) |

---

## 6. As 8 Fases

### Fase 1 — Mapa de Energia
*"O que te dá vida?"*

**Mecânica:** Card sort (idêntico à Missão 1 — cartas deslizadas para quadrantes). Nomenclatura adaptada: Energiza / Neutro / Cansa / Flui.

**Atividades (cards):**

| Atividade | Descrição |
|-----------|-----------|
| Cozinhar para outros | Preparar refeições com carinho e ver as pessoas apreciarem |
| Cuidar de netos | Acompanhar e participar do crescimento das próximas gerações |
| Ler e pesquisar | Mergulhar em livros, artigos e novas ideias com curiosidade |
| Viajar e explorar | Conhecer lugares, culturas e histórias diferentes das suas |
| Jardinar e cultivar | Cuidar de plantas, hortas e da relação com a natureza |
| Ensinar e transmitir | Compartilhar o que sabe com quem quer aprender |
| Criar e construir | Fazer algo com as próprias mãos — artesanato, marcenaria, costura, arte |
| Ajudar amigos e família | Estar presente nos momentos que importam, dar suporte |
| Fazer voluntariado | Contribuir com sua comunidade ou causa sem esperar retorno financeiro |
| Liderar e organizar | Coordenar grupos, eventos ou iniciativas com propósito |
| Praticar exercícios | Caminhar, nadar, dançar, pedalar — cuidar do corpo com prazer |
| Engajar em debates | Discutir ideias, política, filosofia, espiritualidade com profundidade |

**Verbos da Maturidade** (o que sempre fizeram naturalmente, substituindo "Linha do Tempo da Infância"):
- criar, cuidar, organizar, ensinar, construir, descobrir, liderar, conectar, preservar, escutar

**Temas de Curiosidade** (substituindo "Radar de Curiosidade"):
- Saúde e bem-estar, Espiritualidade e significado, Família e relações, Viagens e cultura, Arte e criatividade, Natureza e ecologia, História e memória, Empreendedorismo social, Tecnologia no dia a dia, Gastronomia, Voluntariado e impacto social

---

### Fase 2 — Sabedoria Acumulada
*"O que você sabe — e talvez não perceba o quanto vale?"*

**Mecânica:** Rating grid (idêntico à Missão 2 — avaliação de habilidades em escala, com sub-perguntas detalhadas).

**Dimensões de Habilidade:**

| Dimensão | Descrição |
|----------|-----------|
| Relações e mediação | Habilidade para criar conexões genuínas e resolver conflitos |
| Gestão e organização | Estruturar processos, projetos e rotinas com precisão |
| Criatividade e expressão | Criar, narrar, desenhar, decorar ou inventar soluções originais |
| Conhecimento técnico | Domínio profundo de uma área específica construído ao longo da vida |
| Cuidado e empatia | Ler as emoções dos outros e oferecer suporte com presença |
| Liderança e influência | Inspirar e guiar pessoas com a autoridade da experiência |
| Ensino e transmissão | Explicar o que sabe de forma que os outros consigam aprender |
| Análise e estratégia | Enxergar padrões, antecipar consequências e tomar decisões ponderadas |
| Conexão e rede | Apresentar pessoas, criar pontes e ampliar comunidades |

**"Quem te procura?"** (substituindo "matérias em que os colegas pedem ajuda"):
- Perguntas como: "Quem te liga quando precisa de um conselho?" / "Para que tipo de problema as pessoas vêm até você?"
- Opções: conselhos de vida, ajuda prática, apoio emocional, orientação profissional, conhecimento técnico, mediação de conflitos, organização de eventos, contatos e indicações

**Talentos Ocultos** (mantido, com opções adaptadas):
- Escutar sem julgamento, lembrar de detalhes importantes, fazer perguntas certas, manter a calma em crises, ver o lado bom das situações, persistir quando todos desistem, criar ambientes acolhedores, encontrar humor nas adversidades

---

### Fase 3 — O Legado
*"O que você quer deixar para o mundo?"*

**Mecânica:** Coin allocation (idêntico à Missão 3 — 10 moedas distribuídas entre causas) + seleção do Problema Único (ImageSwiper com duplo toque).

**Causas (coin allocation):**

| Causa | Gradiente |
|-------|-----------|
| Saúde e qualidade de vida | #0c1a2e → #1e3a5f |
| Educação das próximas gerações | #0a1a0a → #14532d |
| Comunidade e pertencimento | #1a1a0a → #854d0e |
| Meio ambiente e natureza | #052e16 → #166534 |
| Espiritualidade e valores | #1a0a1a → #701a75 |
| Saúde mental e emoções | #0c0a1e → #1e1b4b |
| Inclusão e igualdade | #1c0404 → #7c2d12 |
| Cultura e memória | #0a1a1a → #0e7490 |
| Bem-estar familiar | #0a0e1a → #0f766e |
| Tecnologia e inclusão digital | #0a1a0a → #3f6212 |

**Problema Único (ImageSwiper):**
- Solidão na terceira idade
- Exclusão digital dos mais velhos
- Desigualdade na educação básica
- Saúde mental e depressão silenciosa
- Abandono e isolamento de idosos
- Perda de valores e memória cultural

---

### Fase 4 — O Novo Território
*"Onde você floresce?"*

**Mecânica:** Scene duels + seleção de ambientes + escolhas forçadas (idêntico à Missão 4).

**Ambientes:**
- Casa e jardim, Comunidade/bairro, Escola ou universidade, ONG ou voluntariado, Consultoria ou mentoria, Ateliê ou estúdio criativo, Campo e natureza, Associação ou clube, Negócio próprio, Centro cultural, Hospital ou saúde, Espaço espiritual

**Escolhas Forçadas:**

| id | Opção A | Opção B |
|----|---------|---------|
| `liberdade_vs_rotina` | **Liberdade Total + Incerteza** — Você cria sua agenda e projetos, mas não tem garantia de renda ou resultado. | **Rotina Significativa + Previsibilidade** — Tem estrutura e estabilidade, mas menos espaço para improvisar. |
| `muitos_vs_poucos` | **Impacto em Muitos + Esforço** — Alcança muitas pessoas, mas exige energia constante e exposição. | **Presença Profunda para Poucos** — Dedica atenção total a poucas pessoas ou causas, com mais intensidade emocional. |

**Cenas do Duelo** (adaptadas para 55+):
- Situações de vida cotidiana, voluntariado, mentoria, criação, família, comunidade — sem foco em carreira corporativa

---

### Fase 5 — Quem Sou Eu Agora
*"Qual papel você quer exercer neste próximo capítulo?"*

**Mecânica:** Seleção de arquétipo (idêntico à Missão 5 — ImageSwiper ou grid de cards).

**Arquétipos para a terceira fase da vida:**

| id | Arquétipo | Papel | Descrição |
|----|-----------|-------|-----------|
| `mentor` | O Mentor / A Mentora | Guia quem está começando | Transfere experiência com generosidade. Encontra sentido em ver o outro crescer. |
| `criador` | O Criador / A Criadora | Manifesta ideias em forma | Pinta, escreve, cuida, constrói. A expressão é o que o move. |
| `guardiao` | O Guardião / A Guardiã | Protege o que importa | Preserva tradições, memórias, valores e pessoas. Âncora da família e da comunidade. |
| `explorador` | O Explorador / A Exploradora | Sempre em descoberta | Viaja, experimenta, aprende coisas novas. Recusa a ideia de que já viu tudo. |
| `curador` | O Curador / A Curadora | Cuida e restaura | Encontra propósito no cuidado — de pessoas, animais, plantas, espaços. |
| `sabio` | O Sábio / A Sábia | Pensa antes de agir | Reflete, aconselha, equilibra. A comunidade o busca quando há decisões difíceis. |
| `conector` | O Conector / A Conectora | Une pessoas e mundos | Apresenta, facilita, cria pontes. O capital mais importante é a rede de relações. |
| `realizador` | O Realizador / A Realizadora | Faz acontecer | Organiza, executa, conclui. Sente-se vivo quando vê projetos saindo do papel. |

---

### Fase 6 — Conexões que Constroem
*"Com quem você quer caminhar?"*

**Mecânica:** Seleção de tipos de pessoa (idêntico à Missão 6 — Dream Team), adaptado para redes de relacionamento na terceira fase.

**Tipos de conexão:**

| Tipo | Descrição |
|------|-----------|
| O jovem que quer aprender | Alguém de outra geração que se beneficia da sua experiência |
| O parceiro de projetos | Quem complementa suas habilidades e divide a energia de criar |
| A amizade de longa data | Quem te conhece há décadas e te mantém inteiro |
| O especialista diferente de você | Quem sabe o que você não sabe — e te faz crescer |
| O familiar próximo | A família como fonte de sentido e de presença |
| O companheiro espiritual | Quem compartilha valores, fé ou visão de mundo |
| O desafiador de ideias | Quem questiona suas certezas com respeito |
| O apoio emocional | Quem está lá nos momentos difíceis, sem julgamento |

---

### Fase 7 — O Próximo Capítulo
*"Como você imagina os próximos anos?"*

**Mecânica:** Formulário estruturado (idêntico à Missão 7 — campos de visão de futuro), com perguntas adaptadas para o horizonte de 3–10 anos de quem está na terceira fase.

**Campos:**

| Campo | Pergunta |
|-------|---------|
| `proxima_contribuicao` | O que você ainda quer criar, ensinar ou deixar? |
| `vida_daqui_3_anos` | Em 3 anos, como é um dia típico ideal para você? |
| `papel_na_familia` | Que papel quer ter na vida das pessoas que ama? |
| `deixar_para_tras` | O que está pronto para soltar ou deixar para trás? |
| `novo_comeco` | Que novo começo você sente que está pronto para dar? |

---

### Fase 8 — Carta ao Eu de Amanhã
*"O que você diria a si mesmo no próximo capítulo?"*

**Mecânica:** Carta livre (idêntico à Missão 8) + campos de visão curtos + formulário de salvamento do resultado.

**Adaptações de linguagem:**
- "Querido eu do futuro" em vez de "Querido eu de X anos"
- Foco em intenções, não em conquistas a alcançar
- Tom de permissão e encorajamento, não de cobrança

---

## 7. Análise por IA (Gemini)

O prompt de análise é adaptado para o público 55+:

- Reconhece a sabedoria e experiência acumulada como ativos principais
- Identifica padrões de energia, habilidade e causa que apontam para papéis concretos no próximo capítulo (voluntariado, mentoria, criação, cuidado, empreendedorismo social, projetos comunitários)
- Evita sugerir "carreiras" ou empregos formais como padrão — propõe formas de contribuição e realização
- Usa linguagem respeitosa, calorosa e esperançosa
- Valida que reinventar-se a qualquer idade é possível e significativo

---

## 8. Fluxo da Experiência

```
Home / Landing
  ↓
Escolha do Guia (adaptado de MentorSelection)
  ↓
Fase 1 — Mapa de Energia
  ↓
Fase 2 — Sabedoria Acumulada
  ↓
Fase 3 — O Legado
  ↓
Fase 4 — O Novo Território
  ↓
Fase 5 — Quem Sou Eu Agora
  ↓
Fase 6 — Conexões que Constroem
  ↓
Fase 7 — O Próximo Capítulo
  ↓
Fase 8 — Carta ao Eu de Amanhã
  ↓
Salvar Resultado (nome + e-mail + telefone)
  ↓
Dashboard de Resultado (análise IA + mandala adaptada)
```

---

## 9. Guias de Jornada (adaptado de MentorSelection)

Substituem os mentores ficcionais da Jornada Ikigai por figuras de sabedoria madura — pessoas reais ou arquétipos que representam diferentes formas de viver com propósito na terceira fase. O visual e a mecânica de seleção (ImageSwiper + duplo toque) são mantidos.

**Opções de Guia:**

| id | Guia | Essência |
|----|------|---------|
| `sabio` | O Sábio / A Sábia | Calma, profundidade e visão de longo prazo |
| `guardiao` | O Guardião / A Guardiã | Presença, cuidado e proteção do que importa |
| `explorador` | O Explorador / A Exploradora | Curiosidade, movimento e descoberta contínua |
| `criador` | O Criador / A Criadora | Expressão, beleza e manifestação de ideias |
| `conector` | O Conector / A Conectora | Relações, pontes e comunidade |
| `realizador` | O Realizador / A Realizadora | Ação, execução e projetos concretos |

---

## 10. Multi-tenant (Parceiros)

Mesma arquitetura da Jornada Ikigai:
- `home_url` do parceiro usado no link de compartilhamento e no botão de retorno
- `explore_url` + `explore_label` para CTA de exploração (ex.: cursos, grupos, comunidades para 55+)
- `am_id` passado em todas as URLs de saída
- Configuração via Supabase (`tenant_config` ou equivalente)

---

## 11. Infraestrutura

| Item | Decisão |
|------|---------|
| Repositório | Novo repo separado — `reinventar` |
| Deploy | Vercel (subdomínio próprio) |
| Banco | Supabase (novo projeto) ou Firebase (novo projeto) |
| GTM | Tag Manager próprio ou reaproveitado com parâmetro `tenant` = `reinventar` |
| Componentes | Fork inicial da Jornada Ikigai, evoluindo de forma independente |

---

## 12. Fora do Escopo (MVP)

- Modo imersivo 3D (épico IM-01 não se aplica inicialmente)
- Múltiplos idiomas
- App nativo mobile
- Relatório PDF
- Skip logic condicional

---

## 13. Métricas de Sucesso

| Métrica | Meta |
|---------|------|
| Taxa de conclusão da jornada completa | ≥ 60% |
| NPS (pesquisa de satisfação ao final) | ≥ 8,0 |
| Tempo médio de sessão | 25–45 min |
| Taxa de salvamento do resultado | ≥ 70% |
| Taxa de compartilhamento | ≥ 25% |

---

## 14. Próximos Passos

1. Revisar e validar as 8 fases e seus conteúdos com o público-alvo
2. Definir nome final do app e domínio
3. Criar o repositório `reinventar` com fork do Jornada Ikigai
4. Adaptar `MentorSelection` para os 6 Guias de Jornada
5. Criar as 8 fases (`Phase1.tsx` … `Phase8.tsx`) com conteúdo adaptado
6. Adaptar o prompt de análise da IA para o público 55+
7. Adaptar visual (paleta mais serena, tipografia maior)
8. Deploy inicial no Vercel e teste com grupo focal de 5–10 pessoas 55+

---

*Próximo passo: validar estrutura das 8 fases e iniciar implementação.*

---

## 15. Status de Implementação (outubro 2026)

**Versão do app:** em produção em `reinventar.simplesescolhas.com.br`  
**Repositório:** `tatudozen/reinventar` (GitHub)  
**Deploy:** Vercel (Serverless Functions + frontend React)  
**Banco:** Supabase self-hosted Docker Swarm — schema `reinventar`

### 15.1 O que foi construído

#### Frontend (React + Vite + Tailwind CSS 4)

| Componente | Status | Notas |
|-----------|--------|-------|
| Home (`/`) | ✅ Produção | Título corrigido para "Jornada Reinventar"; vídeo de apresentação configurável via admin |
| Seleção de Guia (`/comecar/guia`) | ✅ Produção | 6 arquétipos: Sábio, Guardião, Explorador, Criador, Conector, Realizador |
| Fase 1 — Mapa de Energia | ✅ Produção | Card sort com quadrantes Flow/Boost/Neutro/Drena; verbos da maturidade; temas de curiosidade |
| Fase 2 — Talentos na Mochila | ✅ Produção | Rating grid de 8 competências; "quem te procura"; talentos ocultos |
| Fase 3 — A Grande Causa | ✅ Produção | Coin allocation (10 causas) + problema único (ImageSwiper) |
| Fase 4 — Duelo de Mundos | ✅ Produção | Scene duels RIASEC + ambientes + escolhas forçadas |
| Fase 5 — Ministério dos Sonhos | ✅ Produção | Arquétipo + área de impacto + papel + figuras inspiradoras |
| Fase 6 — Conexões que Importam | ✅ Produção | Seleção de "com quem" e "como"; intenção livre |
| Fase 7 — O Garimpo | ✅ Produção | Swipe de papéis (salvar/descartar) com 24 opções |
| Fase 8 — Carta ao Eu de Amanhã | ✅ Produção | Carta livre + salvamento do resultado |
| Dashboard de Resultado (`/resultado/:id`) | ✅ Produção | 4 dimensões + análise de convergência + **Caminhos para Explorar** |
| Página de Relatório Profundo (`/relatorio/:id`) | ✅ Produção | Renderiza Markdown do relatório gerado por IA; busca via RPC `get_deep_report` |
| Admin (`/admin`) | ✅ Produção | Gerenciamento de vídeos por fase, configuração de tenant |

#### Backend (Supabase self-hosted)

| Artefato | Status | Notas |
|---------|--------|-------|
| Schema `reinventar` | ✅ Ativo | Isolado do schema `public` via PostgREST `PGRST_DB_SCHEMAS` |
| Tabela `jornadas` | ✅ Ativa | Armazena todas as respostas em `phase_data` (JSONB) |
| Tabela `deep_reports` | ✅ Ativa | ID curto (12 chars md5) como token de acesso; FK para `jornadas` |
| RPC `get_jornada` | ✅ Ativa | Busca por ID, SECURITY DEFINER |
| RPC `get_deep_report` | ✅ Ativa | Busca relatório profundo por ID |
| RPC `count_referrals` | ✅ Ativa | Conta indicações por jornada |

#### API Serverless (Vercel)

| Endpoint | Status | Autenticação | Finalidade |
|---------|--------|-------------|-----------|
| `POST /api/deep-report` | ✅ Ativo | Bearer secret | Gera relatório profundo via Gemini; salva em `deep_reports`; retorna `report_url` |
| `GET /api/admin-auth` | ✅ Ativo | Senha admin | Autenticação do painel admin |
| `GET /api/admin-tenants` | ✅ Ativo | JWT admin | Lista tenants |

#### Automação N8N

| Workflow | Status | Gatilho |
|---------|--------|---------|
| `reinventar-report` | ✅ Produção (`webhook.alquimiazen.com.br`) | Webhook ao completar jornada |

**Fluxo do workflow:**
1. Webhook recebe `jornada_id`
2. Edit Fields extrai dados
3. `POST /api/deep-report` → Gemini gera relatório, salva em `deep_reports`, retorna `report_url`, `user_name`, `user_email`, `user_phone`
4. GHL webhook envia e-mail com link para `/relatorio/:id`
5. Evolution API envia WhatsApp com o mesmo link

---

### 15.2 Feature: Caminhos para Explorar

Análogo à "Explorar Carreiras" da Jornada Ikigai, adaptado para o público 55+.

**Objetivo:** Transformar o resultado de um espelho de respostas em sugestões concretas de caminhos possíveis para o próximo capítulo.

**Implementação:** Cálculo de compatibilidade no cliente (sem chamada de servidor) em `ResultDashboard.tsx`.

**10 Caminhos Definidos:**

| ID | Título | Cor | Arquétipos compatíveis |
|----|--------|-----|----------------------|
| `mentoria` | Mentoria & Transmissão | #7c3aed | sabio, guardiao |
| `criacao` | Criação & Expressão | #ec4899 | criador, explorador |
| `cuidado` | Cuidado & Bem-Estar | #f43f5e | guardiao, sabio |
| `consultoria` | Consultoria & Especialização | #f59e0b | sabio, realizador |
| `comunidade` | Comunidade & Conexão | #0891b2 | conector, guardiao |
| `empreendedorismo` | Empreendedorismo Social | #16a34a | realizador, conector |
| `legado` | Legado & Memória | #b45309 | guardiao, sabio |
| `natureza` | Natureza & Sustentabilidade | #65a30d | explorador, guardiao |
| `presenca` | Presença & Autoconhecimento | #a855f7 | sabio, explorador |
| `lideranca_causa` | Liderança & Causa | #dc2626 | realizador, conector |

**Algoritmo de Scoring (total máx. 100 pontos):**

| Fonte | Pontos máx. | Lógica |
|-------|-------------|--------|
| RIASEC (Fase 4) | 25 | 1º tipo: 15; 2º: 7; 3º: 3 por tipo compatível |
| Papéis salvos (Fase 7) | 22 | 5 pts × matches (cap 22) |
| Competências ≥3/5 (Fase 2) | 18 | 4 pts × matches (cap 18) |
| Causas com pontos (Fase 3) | 15 | 5 pts × matches (cap 15) |
| Arquétipo (Fase 5) | 10 | 10 se arquétipo da fase 5 coincide |
| Conexões + modos (Fase 6) | 10 | 2 pts × (conn + mode matches, cap 10) |

**UI:** Top 6 caminhos com barra de compatibilidade colorida, exemplos de atuação, e sinais que geraram o score ("2 papéis salvos", "Arquétipo alinhado", etc.).

---

### 15.3 Feature: Relatório Profundo (Deep Report)

Relatório gerado por Gemini com tom personalizado, entregue por e-mail e WhatsApp.

**Infraestrutura:**
- Tabela `reinventar.deep_reports` (id 12-char, jornada_id FK, report_md TEXT)
- Endpoint `POST /api/deep-report` (Vercel) autenticado por `DEEP_REPORT_SECRET`
- Gemini `gemini-3.8-flash`, `maxOutputTokens: 8192`
- Página `/relatorio/:id` renderiza Markdown com CSS customizado

**Brand Voice:** Ver `docs/reinventar-brand-voice.md` — persona "testemunha", não analista. Princípio "Point of Witness": "Vi que você...". Tom caloroso sem açúcar, filosófico sem avisar, finais abertos. P.S. genuíno e específico.

---

### 15.4 Scripts de Vídeo

Scripts para vídeos de introdução de cada fase, gravados no Google Flow Omni. Ver `docs/video-scripts.md`.

**Formato:** Blocos de 8–10 segundos (uma tomada por bloco). 10 scripts: home, fase1–fase8, resultado.

**Estilo:** Esparso — cada linha respira por si. O usuário completa o pensamento. Sem redundâncias, sem motivacional genérico.

---

### 15.5 Decisões de Arquitetura

| Decisão | Contexto | Escolha |
|---------|---------|---------|
| N8N não acessa Supabase diretamente | RLS + schema customizado causam erros 42501 mesmo com service_role | Toda leitura/escrita de Supabase é feita pela Vercel Function (`/api/deep-report`); N8N recebe os dados como resposta do endpoint |
| PostgREST schema cache | Após `CREATE TABLE`, PostgREST não vê a nova tabela até reload | `docker service update --force supabase_supabase_rest` reinicia o cache |
| ESM no Vercel | Node.js em modo ESM exige extensões explícitas nos imports | Todos os imports entre arquivos API usam `.js` (mesmo sendo `.ts`) |
| `DEEP_REPORT_SECRET` trailing newline | `echo` no shell adiciona `\n`; comparação string falhava | `.trim()` no valor lido + recriar a variável com `printf` sem newline |

---

*Última atualização: outubro 2026*
