import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Target } from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MissionWrapper } from '../components/MissionWrapper';
import { ImageSwiper } from '../components/ui/image-swiper';

const CAUSES = [
  { id: 'saude_mental',  label: 'Saúde Mental',          g0: '#0c0a1e', g1: '#1e1b4b' },
  { id: 'educacao',      label: 'Educação',               g0: '#0a1a0a', g1: '#14532d' },
  { id: 'tech_etica',    label: 'Tecnologia Ética',       g0: '#0c1a2e', g1: '#1e3a5f' },
  { id: 'meio_ambiente', label: 'Meio Ambiente',           g0: '#052e16', g1: '#166534' },
  { id: 'desigualdade',  label: 'Desigualdade Social',    g0: '#1c0404', g1: '#7c2d12' },
  { id: 'saude',         label: 'Saúde Física',           g0: '#0a0e1a', g1: '#0f766e' },
  { id: 'cidades',       label: 'Cidades e Mobilidade',   g0: '#1a1a0a', g1: '#854d0e' },
  { id: 'cultura',       label: 'Cultura e Arte',         g0: '#1a0a1a', g1: '#701a75' },
  { id: 'ciencia',       label: 'Ciência e Inovação',     g0: '#0a1a1a', g1: '#0e7490' },
  { id: 'animal',        label: 'Bem-estar Animal',       g0: '#0a1a0a', g1: '#3f6212' },
];

const PREDEFINED_PROBLEMS = [
  { id: 'aquecimento',  text: 'Aquecimento Global',          image: '/questions/aquecimento-global.png' },
  { id: 'pobreza',      text: 'Pobreza Extrema e Fome',      image: '/questions/pobreza-fome.png' },
  { id: 'mobilidade',   text: 'Mobilidade e Trânsito',       image: '/questions/mobilidade-transito.png' },
  { id: 'saude_idosos', text: 'Saúde na Velhice',            image: '/questions/saude-velhice.png' },
  { id: 'saude_mental', text: 'Saúde Mental',                image: '/questions/saude-mental.png' },
  { id: 'educacao',     text: 'Desigualdade na Educação',    image: '/questions/desigualdade-educacao.png' },
];

const PROBLEM_IMAGES = PREDEFINED_PROBLEMS.map(p => p.image).join(',');
const TOTAL_COINS = 10;

const getCoinColor = (allocated: number) => {
  if (allocated <= 2) return '#f97316';
  if (allocated <= 5) return '#f59e0b';
  if (allocated <= 7) return '#fbbf24';
  return '#00f2ff';
};

export default function Mission3() {
  const navigate = useNavigate();
  const { state, updateMission, completeMission, addXP } = useApp();

  const [step, setStep] = useState(0);
  const [hoverId, setHoverId]       = useState<string | null>(null);
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [activeProblemIndex, setActiveProblemIndex] = useState(() => {
    const saved = state.mission3?.uniqueProblem || '';
    const idx = PREDEFINED_PROBLEMS.findIndex(p => p.text === saved);
    return idx >= 0 ? idx : 0;
  });

  const impactPoints = state.mission3?.impactPoints || {};
  const activeProblem = PREDEFINED_PROBLEMS[activeProblemIndex];

  const coinsUsed = (Object.values(impactPoints) as number[]).reduce((a, b) => a + b, 0);
  const coinsLeft = TOTAL_COINS - coinsUsed;

  const handleCoinScore = (causeId: string, value: number) => {
    const current = (impactPoints[causeId] as number) || 0;
    const delta = value - current;
    // block if we'd exceed the total budget
    if (delta > coinsLeft) return;

    const newPoints = { ...impactPoints };
    if (value === current) {
      delete newPoints[causeId]; // tap same coin → remove allocation
    } else {
      newPoints[causeId] = value;
    }
    updateMission('mission3', { ...state.mission3, impactPoints: newPoints });
  };

  const handleProblemSwiperChange = (index: number) => {
    setActiveProblemIndex(index);
    updateMission('mission3', { ...state.mission3, uniqueProblem: PREDEFINED_PROBLEMS[index].text });
  };

  const handleProblemSelect = (index: number) => {
    const problem = PREDEFINED_PROBLEMS[index];
    setActiveProblemIndex(index);
    updateMission('mission3', { ...state.mission3, uniqueProblem: problem.text });
    setStep(2);
    addXP(100);
    completeMission(3);
  };

  const handleNextStep = () => {
    if (step === 0 && coinsLeft === 0) {
      setStep(1);
    } else if (step === 1) {
      updateMission('mission3', { ...state.mission3, uniqueProblem: activeProblem.text });
      setStep(2);
      addXP(100);
      completeMission(3);
    }
  };

  return (
    <MissionWrapper videoTitle="A Grande Causa" videoDescription="Para o que você quer direcionar sua energia no mundo real?" videoId="missao3">
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── STEP 0: Mapa de Impacto (lista vertical + coins) ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              {/* Header com barra de progresso */}
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-5 mb-5 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[18px] mb-1">Mapa de Impacto</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-2">
                    Distribua suas {TOTAL_COINS} moedas entre as causas que chamam sua atenção. Pode concentrar tudo em uma ou espalhar entre várias.
                  </p>
                  <span className="inline-flex items-center gap-1 mb-3 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● Distribua exatamente {TOTAL_COINS} moedas
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(coinsUsed / TOTAL_COINS) * 100}%`,
                          background: coinsLeft === 0
                            ? 'var(--neon-cyan)'
                            : 'linear-gradient(to right, var(--neon-magenta), var(--neon-cyan))',
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold tabular-nums whitespace-nowrap" style={{ color: 'var(--neon-cyan)' }}>
                      {coinsUsed}/{TOTAL_COINS}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cards verticais */}
              <div className="flex flex-col gap-3 mb-6 flex-grow">
                {CAUSES.map(cause => {
                  const score      = (impactPoints[cause.id] as number) || 0;
                  const maxAllowed = Math.min(TOTAL_COINS, score + coinsLeft);
                  const display    = (hoverId === cause.id && hoverScore !== null && hoverScore <= maxAllowed)
                    ? hoverScore
                    : score;
                  const coinColor  = score > 0 ? getCoinColor(score) : '#f97316';

                  return (
                    <div key={cause.id} className="rounded-2xl overflow-hidden border border-white/10">
                      {/* Gradient header */}
                      <div
                        className="h-12 flex items-center justify-between px-5"
                        style={{ background: `linear-gradient(135deg, ${cause.g0}, ${cause.g1})` }}
                      >
                        <h3 className="font-bold text-white text-sm">{cause.label}</h3>
                        {score > 0 && (
                          <span
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${coinColor}33`,
                              color:           coinColor,
                              border:          `1px solid ${coinColor}55`,
                            }}
                          >
                            {score} 🪙
                          </span>
                        )}
                      </div>

                      {/* Coin row */}
                      <div
                        className="px-4 py-3 bg-[var(--glass)] flex justify-center gap-1.5"
                        onMouseLeave={() => { setHoverId(null); setHoverScore(null); }}
                      >
                        {Array.from({ length: TOTAL_COINS }, (_, i) => i + 1).map(coin => {
                          const active    = display >= coin;
                          const available = coin <= maxAllowed;
                          const color     = getCoinColor(display > 0 ? display : coin);
                          return (
                            <button
                              key={coin}
                              onClick={() => available && handleCoinScore(cause.id, coin)}
                              onMouseEnter={() => { if (available) { setHoverId(cause.id); setHoverScore(coin); } }}
                              disabled={!available && !active}
                              className={cn(
                                'w-5 h-5 rounded-full border-2 transition-all shrink-0',
                                available ? 'hover:scale-125 active:scale-110 cursor-pointer' : 'cursor-not-allowed opacity-25',
                              )}
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
                <button
                  onClick={handleNextStep}
                  disabled={coinsLeft > 0}
                  className={cn(
                    'ml-auto px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    coinsLeft === 0
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]'
                  )}
                >
                  Próxima Etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: Problema Único (ImageSwiper) ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              <div className="mb-8 text-center">
                <h3 className="font-serif text-3xl text-[var(--text-main)] mb-3">O Problema Único</h3>
                <p className="text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed mb-2">
                  Se você pudesse ajudar a resolver apenas <strong>um</strong> problema real com o seu trabalho, qual seria?
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                  ● Arraste para explorar · Duplo toque para confirmar
                </span>
              </div>

              <div className="flex flex-col items-center mb-8">
                <ImageSwiper
                  images={PROBLEM_IMAGES}
                  cardWidth={300}
                  cardHeight={440}
                  onActiveIndexChange={handleProblemSwiperChange}
                  onSelect={handleProblemSelect}
                  overlay={
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeProblem.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-b-xl overflow-hidden"
                        style={{
                          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 65%, transparent 100%)',
                          padding: '3.5rem 1.25rem 1.25rem',
                        }}
                      >
                        <h2 className="text-xl font-bold text-white">{activeProblem.text}</h2>
                      </motion.div>
                    </AnimatePresence>
                  }
                />
                <p className="text-[10px] font-mono tracking-widest uppercase mt-2 text-[var(--color-text-muted)]">
                  ← Arraste para explorar · Duplo toque para confirmar →
                </p>
              </div>

              <div className="mt-auto flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]"
                >
                  Confirmar e Concluir
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Conclusão ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-grow justify-center py-10">
              <div className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)]">
                <Flame className="w-12 h-12 text-[var(--neon-magenta)]" />
              </div>

              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Chama da Contribuição Adquirida</h2>
              <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-10 leading-relaxed">
                Você descobriu como unir seu interesse ao mundo. Profissões não são apenas cargos, são ferramentas para resolver problemas que você considera importantes.
              </p>

              <button
                onClick={() => navigate('/comecar/missao/4')}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform"
              >
                Avançar para Missão 04
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
