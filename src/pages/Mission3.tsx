import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, Flame, Users, BookOpen, Heart,
  Briefcase, Handshake, ShieldCheck, CheckCircle2,
  Landmark, Check, Leaf, Brain, Globe, Home, Wifi, TreePine,
} from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MissionWrapper } from '../components/MissionWrapper';

const CAUSES = [
  { id: 'solidao',        label: 'Solidão e Isolamento',        g0: '#0c0a1e', g1: '#1e1b4b' },
  { id: 'educacao',       label: 'Educação e Formação',          g0: '#0a1a0a', g1: '#14532d' },
  { id: 'saude',          label: 'Saúde e Longevidade',          g0: '#0a0e1a', g1: '#0f766e' },
  { id: 'cuidado',        label: 'Cuidado com Idosos',           g0: '#701a75', g1: '#86198f' },
  { id: 'desigualdade',   label: 'Desigualdade Social',          g0: '#1c0404', g1: '#7c2d12' },
  { id: 'meio_ambiente',  label: 'Meio Ambiente e Legado',       g0: '#052e16', g1: '#166534' },
  { id: 'saude_mental',   label: 'Saúde Mental',                 g0: '#3b0764', g1: '#6b21a8' },
  { id: 'empreendedorismo', label: 'Empreendedorismo',           g0: '#1a1500', g1: '#854d0e' },
  { id: 'cultura',        label: 'Arte, Cultura e Memória',      g0: '#1a0a1a', g1: '#701a75' },
  { id: 'intergeracoes',  label: 'Conexão entre Gerações',       g0: '#0f2952', g1: '#1e3a8a' },
];

type Problem = { id: string; text: string; desc: string; icon: React.ElementType; color: string };

const PROBLEMS_BY_MINISTRY: Record<string, Problem[]> = {
  saude: [
    { id: 's1', text: 'Saúde mental na terceira idade',               desc: 'Depressão e ansiedade crescem com o envelhecimento, mas seguem invisíveis e sem tratamento.',                  icon: Brain,      color: '#c084fc' },
    { id: 's2', text: 'Cuidadores sem apoio ou reconhecimento',       desc: 'Quem cuida de idosos ou doentes raramente recebe suporte emocional, financeiro ou descanso.',              icon: Heart,      color: '#f97316' },
    { id: 's3', text: 'Acesso desigual à saúde preventiva',           desc: 'Prevenção e diagnóstico precoce não chegam a quem mais precisa — periferias e regiões remotas.',           icon: ShieldCheck, color: '#34d399' },
    { id: 's4', text: 'Solidão como epidemia silenciosa',             desc: 'Isolamento social encurta a vida mais do que o tabagismo — e não aparece nos boletins de saúde.',          icon: Users,      color: '#33ccff' },
    { id: 's5', text: 'Saúde ocupacional ignorada no trabalho',       desc: 'Doenças causadas pelo trabalho afetam milhões mas são sistematicamente invisibilizadas.',                   icon: Briefcase,  color: '#fb923c' },
    { id: 's6', text: 'Desnutrição em populações vulneráveis',        desc: 'Comunidades inteiras sem acesso regular a alimentação nutritiva, especialmente crianças e idosos.',         icon: Home,       color: '#f59e0b' },
  ],
  educacao: [
    { id: 'e1', text: 'Jovens sem mentores nem referências adultas',  desc: 'Uma geração cresce sem acesso a quem já viveu e pode orientar com sabedoria e experiência.',              icon: Handshake,  color: '#34d399' },
    { id: 'e2', text: 'Sabedoria que se perde sem ser transmitida',   desc: 'Décadas de experiência desaparecem porque não encontramos formas de registrá-las e passá-las adiante.',   icon: BookOpen,   color: '#d4af37' },
    { id: 'e3', text: 'Analfabetismo funcional em adultos',           desc: 'Milhões de brasileiros leem palavras mas não compreendem textos — um obstáculo silencioso à dignidade.',   icon: Target,     color: '#60a5fa' },
    { id: 'e4', text: 'Professores esgotados e sem suporte',          desc: 'Educadores dedicados abandonam a profissão por falta de condições, salário e valorização.',                icon: Heart,      color: '#f97316' },
    { id: 'e5', text: 'Exclusão digital de idosos e comunidades rurais', desc: 'Quem não domina a tecnologia fica fora do mercado, dos serviços e das oportunidades do século XXI.',  icon: Wifi,       color: '#a78bfa' },
    { id: 'e6', text: 'Jovens talentosos sem acesso à universidade',  desc: 'O potencial de uma geração desperdiçado por falta de apoio financeiro e orientação adequada.',            icon: Users,      color: '#33ccff' },
  ],
  ciencia_tecnologia: [
    { id: 'ct1', text: 'Desinformação em saúde causando mortes',      desc: 'Fake news sobre vacinas, remédios e tratamentos matam — e se espalham mais rápido que a ciência.',        icon: ShieldCheck, color: '#f87171' },
    { id: 'ct2', text: 'Exclusão digital de idosos e periferias',     desc: 'Quem não acessa a internet fica excluído de saúde, emprego e participação cidadã.',                       icon: Wifi,       color: '#a78bfa' },
    { id: 'ct3', text: 'Pesquisa científica com financiamento precário', desc: 'Cortes em ciência e tecnologia comprometem o futuro do país por décadas.',                             icon: Brain,      color: '#60a5fa' },
    { id: 'ct4', text: 'Tecnologia inacessível para pessoas com deficiência', desc: 'Ferramentas digitais ignoram usuários com limitações físicas ou cognitivas.',                     icon: Users,      color: '#34d399' },
    { id: 'ct5', text: 'Jovens talentos em ciência sem oportunidades', desc: 'Pesquisadores brilhantes migram para fora porque não encontram condições de trabalho no Brasil.',         icon: Briefcase,  color: '#fb923c' },
    { id: 'ct6', text: 'Dados pessoais usados sem ética ou consentimento', desc: 'Empresas e governos monitoram, vendem e exploram dados de cidadãos sem transparência.',             icon: Target,     color: '#c084fc' },
  ],
  justica: [
    { id: 'j1', text: 'Acesso à justiça negado a quem não tem recursos', desc: 'A lentidão e o custo do sistema judicial protegem quem pode pagar advogados — não os direitos.',     icon: ShieldCheck, color: '#60a5fa' },
    { id: 'j2', text: 'Sistema prisional que fabrica reincidência',    desc: 'Cadeias superlotadas, violentas e sem ressocialização perpetuam o ciclo do crime.',                       icon: Home,       color: '#f87171' },
    { id: 'j3', text: 'Trabalho análogo à escravidão ainda existente', desc: 'Milhares de brasileiros são resgatados anualmente em condições desumanas de trabalho forçado.',          icon: Briefcase,  color: '#fb923c' },
    { id: 'j4', text: 'Violência doméstica sem punição efetiva',       desc: 'Mulheres morrem diariamente enquanto o sistema falha em protegê-las de agressores conhecidos.',          icon: Heart,      color: '#f97316' },
    { id: 'j5', text: 'Crianças sem documentação e direitos básicos',  desc: 'Sem certidão de nascimento, crianças ficam invisíveis para o Estado e vulneráveis à exploração.',        icon: Users,      color: '#34d399' },
    { id: 'j6', text: 'Discriminação racial no acesso a oportunidades', desc: 'Desigualdade estrutural persiste mesmo quando não há lei que a sustente — está no cotidiano.',         icon: Handshake,  color: '#a78bfa' },
  ],
  cultura: [
    { id: 'cu1', text: 'Memória oral e cultura popular se apagando',  desc: 'Tradições, cantos, histórias e saberes transmitidos de geração em geração desaparecem com os idosos.',   icon: BookOpen,   color: '#d4af37' },
    { id: 'cu2', text: 'Artistas sem sustento e reconhecimento justo', desc: 'Criadores que alimentam a alma do país não conseguem viver de arte no Brasil.',                          icon: Heart,      color: '#f97316' },
    { id: 'cu3', text: 'Patrimônio histórico degradado e sem cuidado', desc: 'Prédios, monumentos e sítios históricos se deterioram por falta de investimento e política cultural.',  icon: Landmark,   color: '#fb923c' },
    { id: 'cu4', text: 'Periferias sem acesso a espaços culturais',   desc: 'Cinema, teatro e museus são privilégio de quem mora nos bairros ricos das grandes cidades.',              icon: Home,       color: '#60a5fa' },
    { id: 'cu5', text: 'Línguas indígenas em extinção',               desc: 'Com cada falante nativo que morre, uma visão de mundo única e irreplicável desaparece para sempre.',      icon: Globe,      color: '#34d399' },
    { id: 'cu6', text: 'Jovens desconectados da própria história',    desc: 'Novas gerações crescem sem conhecer as raízes culturais que moldaram quem elas são.',                     icon: Users,      color: '#a78bfa' },
  ],
  meio_ambiente: [
    { id: 'ma1', text: 'Desmatamento da Amazônia e Cerrado',          desc: 'O Brasil perde anualmente uma área equivalente a países inteiros em florestas que nunca voltarão.',       icon: TreePine,   color: '#4ade80' },
    { id: 'ma2', text: 'Aquecimento global e eventos extremos',       desc: 'Enchentes, secas e calor intenso já afetam milhões de brasileiros — e vai piorar.',                       icon: Globe,      color: '#f59e0b' },
    { id: 'ma3', text: 'Plástico contaminando rios e oceanos',        desc: 'Resíduos plásticos entram na cadeia alimentar e chegam à mesa de todos — visíveis ou não.',             icon: Leaf,       color: '#60a5fa' },
    { id: 'ma4', text: 'Perda de biodiversidade e espécies extintas', desc: 'Animais e plantas desaparecem mais rápido do que a ciência consegue catalogar.',                          icon: TreePine,   color: '#34d399' },
    { id: 'ma5', text: 'Falta de saneamento em comunidades',          desc: 'Milhões de brasileiros sem acesso a água tratada ou esgoto — um problema com solução conhecida.',         icon: Home,       color: '#a78bfa' },
    { id: 'ma6', text: 'Cultura do desperdício e consumo irresponsável', desc: 'Produzimos lixo como se o planeta tivesse capacidade ilimitada de absorvê-lo.',                       icon: Target,     color: '#fb923c' },
  ],
  infraestrutura: [
    { id: 'in1', text: 'Mobilidade urbana que paralisa cidades',      desc: 'Horas perdidas no trânsito todos os dias roubam qualidade de vida de milhões de brasileiros.',           icon: Target,     color: '#f59e0b' },
    { id: 'in2', text: 'Acessibilidade inexistente para quem precisa', desc: 'Cadeirantes, idosos e pessoas com deficiência enfrentam cidades que não foram pensadas para elas.',     icon: Users,      color: '#34d399' },
    { id: 'in3', text: 'Habitação precária e risco de desabamentos',  desc: 'Famílias em áreas de risco esperam por uma tragédia que poderia ser evitada com política habitacional.',  icon: Home,       color: '#f87171' },
    { id: 'in4', text: 'Saneamento ausente em comunidades rurais',    desc: 'Municípios inteiros no Brasil ainda convivem com água contaminada e esgoto a céu aberto.',               icon: Leaf,       color: '#60a5fa' },
    { id: 'in5', text: 'Internet precária em regiões remotas',        desc: 'Sem conectividade de qualidade, comunidades ficam fora da economia digital e do ensino à distância.',    icon: Wifi,       color: '#a78bfa' },
    { id: 'in6', text: 'Lixo sem coleta nem destinação adequada',     desc: 'Resíduos sólidos lançados em lixões a céu aberto contaminam solo, rios e a saúde de comunidades.',      icon: TreePine,   color: '#fb923c' },
  ],
  desenvolvimento_social: [
    { id: 'ds1', text: 'Crianças em situação de vulnerabilidade extrema', desc: 'Fome, violência e abandono marcam os primeiros anos de vida de milhares de crianças brasileiras.',  icon: Heart,      color: '#f97316' },
    { id: 'ds2', text: 'Pessoas em situação de rua sem perspectiva',  desc: 'Invisíveis para a cidade, sem endereço, sem documentos e sem acesso a nenhum serviço básico.',            icon: Home,       color: '#60a5fa' },
    { id: 'ds3', text: 'Idosos abandonados sem rede de apoio',        desc: 'Solidão e negligência afetam milhões de idosos que deram tudo — e agora não recebem nada de volta.',     icon: Users,      color: '#33ccff' },
    { id: 'ds4', text: 'Violência doméstica e ciclos intergeracionais', desc: 'Filhos que testemunham violência repetem os padrões — um ciclo que só se quebra com intervenção.',    icon: ShieldCheck, color: '#f87171' },
    { id: 'ds5', text: 'Desigualdade de renda que se perpetua',       desc: 'No Brasil, nascer pobre quase sempre significa morrer pobre — mobilidade social segue restrita.',        icon: Briefcase,  color: '#fb923c' },
    { id: 'ds6', text: 'Jovens sem oportunidades fora do crime',      desc: 'Sem escola boa, emprego ou perspectiva, o crime se torna a única saída para muitos jovens.',             icon: Handshake,  color: '#34d399' },
  ],
  economia: [
    { id: 'ec1', text: 'Desemprego estrutural em periferias',         desc: 'Comunidades inteiras onde o desemprego é a norma — não a exceção — por falta de acesso e qualificação.',  icon: Briefcase,  color: '#fb923c' },
    { id: 'ec2', text: 'Microempreendedores sem crédito ou suporte',  desc: 'Pequenos negócios com potencial real fecham por falta de acesso a crédito justo e orientação.',          icon: Target,     color: '#f59e0b' },
    { id: 'ec3', text: 'Trabalhadores informais sem proteção',        desc: 'Metade da força de trabalho brasileira vive sem previdência, saúde ou direitos trabalhistas.',            icon: ShieldCheck, color: '#34d399' },
    { id: 'ec4', text: 'Aposentados com renda insuficiente para viver', desc: 'Idosos que trabalharam a vida toda chegam à aposentadoria sem condições dignas de sustento.',          icon: Users,      color: '#33ccff' },
    { id: 'ec5', text: 'Economia local sufocada pelo grande varejo',  desc: 'Comércio de bairro e produtores locais perdem espaço para grandes redes — matando a diversidade econômica.', icon: Home,    color: '#60a5fa' },
    { id: 'ec6', text: 'Jovens sem preparo para o mercado de trabalho', desc: 'Currículos desatualizados formam jovens sem as habilidades que o mercado realmente precisa.',          icon: BookOpen,   color: '#a78bfa' },
  ],
  comunicacoes: [
    { id: 'co1', text: 'Fake news destruindo confiança em instituições', desc: 'Desinformação mina a democracia, a saúde pública e a coesão social em velocidade alarmante.',        icon: Globe,      color: '#f87171' },
    { id: 'co2', text: 'Voz de idosos e comunidades invisível na mídia', desc: 'Histórias reais e perspectivas valiosas de pessoas experientes raramente chegam ao grande público.', icon: Users,      color: '#33ccff' },
    { id: 'co3', text: 'Jornalismo local moribundo e sem recursos',   desc: 'Cidades e comunidades perdem a cobertura local — e com ela, a accountability do poder público.',         icon: BookOpen,   color: '#d4af37' },
    { id: 'co4', text: 'Conteúdo educativo de qualidade escasso',     desc: 'Muito ruído, pouca substância: há carência de material que realmente ensine e inspire em português.',    icon: Target,     color: '#60a5fa' },
    { id: 'co5', text: 'Jovens sem habilidades de comunicação crítica', desc: 'A incapacidade de argumentar, questionar e se expressar bem limita vidas e empobrece o debate.',      icon: Brain,      color: '#a78bfa' },
    { id: 'co6', text: 'Desinformação em saúde causando mortes evitáveis', desc: 'Remédios falsos, tratamentos negados e vacinas rejeitadas por causa de mentiras espalhadas online.', icon: ShieldCheck, color: '#34d399' },
  ],
};

const MINISTRIES = [
  { id: 'economia',               name: 'Economia',               emoji: '💰' },
  { id: 'saude',                  name: 'Saúde',                  emoji: '🏥' },
  { id: 'ciencia_tecnologia',     name: 'Ciência e Tecnologia',   emoji: '🔬' },
  { id: 'educacao',               name: 'Educação',               emoji: '📚' },
  { id: 'justica',                name: 'Justiça',                emoji: '⚖️' },
  { id: 'cultura',                name: 'Cultura',                emoji: '🎭' },
  { id: 'meio_ambiente',          name: 'Meio Ambiente',          emoji: '🌱' },
  { id: 'infraestrutura',         name: 'Infraestrutura',         emoji: '🏗️' },
  { id: 'desenvolvimento_social', name: 'Desenvolvimento Social', emoji: '🤝' },
  { id: 'comunicacoes',           name: 'Comunicações',           emoji: '📡' },
];

const CARGOS = [
  { id: 'ministro',             name: 'Ministro(a)',                 profile: 'Lidera, define a visão e toma as grandes decisões.' },
  { id: 'consultor_tecnico',    name: 'Consultor(a) Técnico(a)',     profile: 'Resolve problemas complexos com pesquisa, análise e dados.' },
  { id: 'assessor_comunicacao', name: 'Assessor(a) de Comunicação',  profile: 'Traduz e comunica as ideias para o mundo.' },
  { id: 'diretor_operacoes',    name: 'Diretor(a) de Operações',     profile: 'Organiza processos e garante que tudo funcione.' },
  { id: 'coordenador_campo',    name: 'Coordenador(a) de Campo',     profile: 'Coloca a mão na massa e executa na prática.' },
  { id: 'secretario_social',    name: 'Secretário(a) de Bem-Estar',  profile: 'Cuida das pessoas e do impacto humano das ações.' },
];


const TOTAL_COINS = 10;

const getCoinColor = (allocated: number) => {
  if (allocated <= 2) return '#f97316';
  if (allocated <= 5) return '#f59e0b';
  if (allocated <= 7) return '#fbbf24';
  return '#00f2ff';
};

export default function Mission3() {
  const navigate = useNavigate();
  const { state, updatePhase, completePhase, addXP } = useApp();

  const ministry = state.phase3.ministry || '';
  const cargo    = state.phase3.cargo    || '';

  const [step, setStep] = useState(() => {
    if (state.phase3.uniqueProblem) return 3;
    if (ministry && cargo) return 2;
    const pts = state.phase3.impactPoints ?? {};
    if (Object.values(pts).reduce((a: number, b: number) => a + b, 0) === TOTAL_COINS) return 1;
    return 0;
  });
  const [hoverId, setHoverId]       = useState<string | null>(null);
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(
    state.phase3.uniqueProblem || null,
  );

  const impactPoints: Record<string, number> = state.phase3.impactPoints ?? {};
  const coinsUsed    = Object.values(impactPoints).reduce((a, b) => a + b, 0);
  const coinsLeft    = TOTAL_COINS - coinsUsed;

  const ministryInfo     = MINISTRIES.find(m => m.id === ministry);
  const filteredProblems = ministry && PROBLEMS_BY_MINISTRY[ministry]
    ? PROBLEMS_BY_MINISTRY[ministry]
    : Object.values(PROBLEMS_BY_MINISTRY).flat().slice(0, 6);

  const handleCoinScore = (causeId: string, value: number) => {
    const current = impactPoints[causeId] || 0;
    const delta   = value - current;
    if (delta > coinsLeft) return;
    const next = { ...impactPoints };
    if (value === current) delete next[causeId];
    else next[causeId] = value;
    updatePhase('phase3', { impactPoints: next });
  };

  const handleNextStep = () => {
    if (step === 0 && coinsLeft === 0) setStep(1);
    else if (step === 1 && ministry && cargo) setStep(2);
    else if (step === 2 && selectedProblem) {
      updatePhase('phase3', { uniqueProblem: selectedProblem });
      addXP(100);
      completePhase(3);
      setStep(3);
    }
  };

  return (
    <MissionWrapper
      videoTitle="A Grande Causa"
      videoDescription="Para qual problema do mundo você quer direcionar sua energia?"
      videoId="fase3"
    >
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── STEP 0: Mapa de Impacto ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-5 mb-5 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Mapa de Impacto</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-3">
                    Distribua suas {TOTAL_COINS} moedas entre as causas que mais chamam sua atenção. Concentre tudo em uma ou espalhe entre várias.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(coinsUsed / TOTAL_COINS) * 100}%`,
                          background: coinsLeft === 0 ? 'var(--neon-cyan)' : 'linear-gradient(to right, var(--neon-magenta), var(--neon-cyan))',
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold tabular-nums whitespace-nowrap" style={{ color: 'var(--neon-cyan)' }}>
                      {coinsUsed}/{TOTAL_COINS}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-6 flex-grow">
                {CAUSES.map(cause => {
                  const score      = impactPoints[cause.id] || 0;
                  const maxAllowed = Math.min(TOTAL_COINS, score + coinsLeft);
                  const display    = (hoverId === cause.id && hoverScore !== null && hoverScore <= maxAllowed)
                    ? hoverScore : score;
                  const coinColor  = score > 0 ? getCoinColor(score) : '#f97316';

                  return (
                    <div key={cause.id} className="rounded-2xl overflow-hidden border border-white/10">
                      <div className="h-11 flex items-center justify-between px-5"
                        style={{ background: `linear-gradient(135deg, ${cause.g0}, ${cause.g1})` }}>
                        <h3 className="font-bold text-white text-sm">{cause.label}</h3>
                        {score > 0 && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${coinColor}33`, color: coinColor, border: `1px solid ${coinColor}55` }}>
                            {score} 🪙
                          </span>
                        )}
                      </div>
                      <div className="px-4 py-3 bg-[var(--glass)] flex justify-center gap-1.5"
                        onMouseLeave={() => { setHoverId(null); setHoverScore(null); }}>
                        {Array.from({ length: TOTAL_COINS }, (_, i) => i + 1).map(coin => {
                          const active    = display >= coin;
                          const available = coin <= maxAllowed;
                          const color     = getCoinColor(display > 0 ? display : coin);
                          return (
                            <button key={coin}
                              onClick={() => available && handleCoinScore(cause.id, coin)}
                              onMouseEnter={() => { if (available) { setHoverId(cause.id); setHoverScore(coin); } }}
                              disabled={!available && !active}
                              className={cn('w-5 h-5 rounded-full border-2 transition-all shrink-0',
                                available ? 'hover:scale-125 cursor-pointer' : 'cursor-not-allowed opacity-25')}
                              style={{
                                borderColor:     active ? color : 'var(--alpha-border-coin)',
                                backgroundColor: active ? color : 'transparent',
                                boxShadow:       active ? `0 0 5px ${color}66` : 'none',
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto flex justify-between items-center">
                {coinsLeft > 0 && (
                  <span className="text-sm text-[var(--color-text-muted)] font-mono">
                    {coinsLeft} moeda{coinsLeft !== 1 ? 's' : ''} restante{coinsLeft !== 1 ? 's' : ''}
                  </span>
                )}
                <button onClick={handleNextStep} disabled={coinsLeft > 0}
                  className={cn('ml-auto px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    coinsLeft === 0
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Próxima Etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: Área + Cargo ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              {/* Área de atuação */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Landmark className="w-4 h-4 text-[var(--color-brand-500)]" />
                  <h3 className="font-bold text-base text-[var(--text-main)]">Em qual área você atuaria?</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MINISTRIES.map(m => {
                    const active = ministry === m.id;
                    return (
                      <button key={m.id} onClick={() => updatePhase('phase3', { ministry: m.id })}
                        className={`relative rounded-xl border p-3 text-center transition-all ${
                          active
                            ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)]'
                            : 'border-[var(--color-brand-200)] hover:border-[var(--color-brand-400)] bg-[rgba(255,255,255,0.03)]'
                        }`}>
                        {active && <Check className="w-3 h-3 text-[var(--color-brand-500)] absolute top-1.5 right-1.5" />}
                        <div className="text-2xl mb-1">{m.emoji}</div>
                        <div className="text-xs font-semibold text-[var(--text-main)] leading-tight">{m.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Papel / Cargo */}
              <div className="mb-auto">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-[var(--color-brand-500)]" />
                  <h3 className="font-bold text-base text-[var(--text-main)]">
                    Como você prefere atuar{ministryInfo ? ` em ${ministryInfo.name}` : ''}?
                  </h3>
                </div>
                <div className="space-y-2">
                  {CARGOS.map(c => {
                    const active = cargo === c.id;
                    return (
                      <button key={c.id} onClick={() => updatePhase('phase3', { cargo: c.id })}
                        className={`w-full text-left rounded-xl border p-3 flex items-start gap-3 transition-all ${
                          active
                            ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)]'
                            : 'border-[var(--color-brand-200)] hover:border-[var(--color-brand-400)] bg-[rgba(255,255,255,0.03)]'
                        }`}>
                        <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${active ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-500)]' : 'border-[var(--color-brand-300)]'}`}>
                          {active && <Check className="w-2.5 h-2.5 text-[var(--bg-dark)]" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[var(--text-main)]">{c.name}</div>
                          <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">{c.profile}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex justify-between pt-4 border-t border-[var(--color-brand-100)]">
                <button onClick={() => setStep(0)} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] py-1">← Voltar</button>
                <button onClick={handleNextStep} disabled={!ministry || !cargo}
                  className="px-8 py-3 bg-[var(--color-brand-600)] text-white rounded-xl font-medium hover:opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Escolher minha causa →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: O Problema Único ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl text-[var(--text-main)] mb-2">O Problema Único</h3>
                <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
                  Se você pudesse dedicar sua energia a resolver apenas <strong>um</strong> problema real{ministryInfo ? ` em ${ministryInfo.name}` : ''}, qual seria?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 flex-grow">
                {filteredProblems.map(p => {
                  const isSelected = selectedProblem === p.text;
                  return (
                    <button key={p.id} onClick={() => setSelectedProblem(p.text)}
                      className={cn('text-left rounded-2xl border-2 p-5 transition-all duration-200',
                        isSelected
                          ? 'border-[var(--color-brand-500)] bg-[var(--glass)] scale-[1.02]'
                          : 'border-white/10 bg-[var(--glass)] hover:border-white/25')}
                      style={isSelected ? { boxShadow: `0 0 18px ${p.color}33` } : {}}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${p.color}18`, color: p.color, border: `1px solid ${p.color}44` }}>
                          <p.icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-[var(--text-main)] text-sm leading-tight">{p.text}</h4>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{p.desc}</p>
                      {isSelected && (
                        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: `${p.color}22`, color: p.color, border: `1px solid ${p.color}55` }}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selecionado
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[var(--color-brand-100)]">
                <button onClick={() => setStep(1)}
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] py-1">
                  ← Voltar
                </button>
                <motion.button
                  animate={{ opacity: selectedProblem ? 1 : 0.3 }}
                  disabled={!selectedProblem}
                  onClick={handleNextStep}
                  className="px-8 py-3 rounded-xl font-bold uppercase tracking-wider bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)] disabled:pointer-events-none">
                  Confirmar →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Conclusão ── */}
          {step === 3 && (
            <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-grow justify-center py-10">
              <div className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)]">
                <Flame className="w-12 h-12 text-[var(--neon-magenta)]" />
              </div>
              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Causa Encontrada</h2>
              <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-4 leading-relaxed">
                Você identificou o que move você. Sua experiência não existe à toa — ela é a ferramenta certa para o problema certo.
              </p>
              {state.phase3.uniqueProblem && (
                <div className="mb-8 px-6 py-3 rounded-xl bg-[var(--glass)] border border-[var(--color-brand-300)] text-center">
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Seu problema único</p>
                  <p className="font-bold text-[var(--text-main)]">{state.phase3.uniqueProblem}</p>
                </div>
              )}
              <button onClick={() => navigate('/comecar/fase/4')}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform">
                Avançar para Fase 4 →
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
