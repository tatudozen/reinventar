import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, Flame, Users, BookOpen, Heart,
  Briefcase, Handshake, ShieldCheck, CheckCircle2,
  Landmark, Check,
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

const PROBLEMS = [
  {
    id: 'solidao_idosos',
    text: 'Idosos sozinhos sem apoio ou companhia',
    desc: 'Milhões de pessoas chegam à velhice sem redes de suporte ou convivência significativa.',
    icon: Users, color: '#33ccff',
  },
  {
    id: 'conhecimento_perdido',
    text: 'Conhecimento que se perde sem ser transmitido',
    desc: 'Décadas de experiência e sabedoria desaparecem porque não encontramos formas de transmiti-las.',
    icon: BookOpen, color: '#d4af37',
  },
  {
    id: 'cuidadores',
    text: 'Cuidadores sobrecarregados e sem suporte',
    desc: 'Quem cuida de pais, cônjuges ou parentes adoecidos raramente recebe cuidado de volta.',
    icon: Heart, color: '#f97316',
  },
  {
    id: 'jovens_sem_mentores',
    text: 'Jovens sem mentores ou referências',
    desc: 'Uma geração inteira cresce sem acesso a quem já viveu e pode orientar com sabedoria.',
    icon: Handshake, color: '#34d399',
  },
  {
    id: 'saude_acesso',
    text: 'Comunidades sem acesso à saúde de qualidade',
    desc: 'Prevenção e cuidado chegam tarde — ou não chegam — para quem mais precisa.',
    icon: ShieldCheck, color: '#c084fc',
  },
  {
    id: 'experiencia_desvalorizada',
    text: 'Desvalorização de quem tem mais experiência',
    desc: 'O mercado e a sociedade rejeitam o que a experiência tem de mais valioso: perspectiva e maturidade.',
    icon: Briefcase, color: '#fb923c',
  },
];

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

// Problemas relevantes por área de ministério
const MINISTRY_PROBLEMS: Record<string, string[]> = {
  educacao:             ['conhecimento_perdido', 'jovens_sem_mentores', 'experiencia_desvalorizada'],
  saude:                ['solidao_idosos', 'cuidadores', 'saude_acesso'],
  desenvolvimento_social: ['solidao_idosos', 'cuidadores', 'jovens_sem_mentores'],
  cultura:              ['conhecimento_perdido', 'experiencia_desvalorizada', 'solidao_idosos'],
  economia:             ['experiencia_desvalorizada', 'jovens_sem_mentores', 'saude_acesso'],
  ciencia_tecnologia:   ['saude_acesso', 'conhecimento_perdido', 'experiencia_desvalorizada'],
  justica:              ['experiencia_desvalorizada', 'solidao_idosos', 'jovens_sem_mentores'],
  meio_ambiente:        ['solidao_idosos', 'saude_acesso', 'conhecimento_perdido'],
  infraestrutura:       ['saude_acesso', 'cuidadores', 'experiencia_desvalorizada'],
  comunicacoes:         ['conhecimento_perdido', 'jovens_sem_mentores', 'experiencia_desvalorizada'],
};

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

  const ministryInfo   = MINISTRIES.find(m => m.id === ministry);
  const filteredProblems = ministry && MINISTRY_PROBLEMS[ministry]
    ? PROBLEMS.filter(p => MINISTRY_PROBLEMS[ministry].includes(p.id))
    : PROBLEMS;

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
