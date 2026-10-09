import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator, MessageCircle, ScanLine, Dumbbell, Music, Users, Brain, Leaf,
  MessageSquare, Sparkles, Gem, Star,
} from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MissionWrapper } from '../components/MissionWrapper';

const INTELLIGENCES = [
  { id: 'log',   label: 'Lógica & Números',   desc: 'Facilidade com padrões, cálculos e resolução estruturada de problemas.',  Icon: Calculator,    g0: '#1a2e05', g1: '#14532d',
    questions: ['Gosto de resolver quebra-cabeças lógicos', 'Matemática faz sentido para mim', 'Gosto de categorizar e encontrar padrões', 'Tomo decisões baseadas em fatos e dados'] },
  { id: 'ling',  label: 'Comunicação',         desc: 'Habilidade com palavras, persuasão, escrita e expressão verbal clara.',   Icon: MessageCircle, g0: '#0c1a2e', g1: '#1e3a5f',
    questions: ['Escrever é natural para mim', 'Aprendo melhor lendo ou ouvindo histórias', 'Gosto de jogos de palavras', 'Explico coisas complexas com facilidade'] },
  { id: 'esp',   label: 'Visão Espacial',      desc: 'Capacidade de visualizar o mundo em 3D, design, arte e navegação.',       Icon: ScanLine,      g0: '#1e1b4b', g1: '#4c1d95',
    questions: ['Tenho facilidade com mapas e rotas', 'Gosto de desenhar ou fotografar', 'Consigo imaginar objetos em 3D', 'Lembro de lugares pelos detalhes visuais'] },
  { id: 'cin',   label: 'Físico & Motor',      desc: 'Coordenação corporal, habilidades manuais e aprendizado pelo movimento.', Icon: Dumbbell,      g0: '#431407', g1: '#7c2d12',
    questions: ['Aprendo melhor fazendo na prática', 'Gosto de esportes ou dança', 'Gesticulo muito ao falar', 'Tenho boa coordenação motora'] },
  { id: 'mus',   label: 'Musical',             desc: 'Sensibilidade a ritmos, tons, padrões sonoros e expressão musical.',      Icon: Music,         g0: '#4a044e', g1: '#701a75',
    questions: ['Identifico sons fora do tom facilmente', 'Lembro facilmente de melodias', 'Estudo ou trabalho melhor com música', 'Batuco ou cantarolo com frequência'] },
  { id: 'inter', label: 'Relações & Empatia',  desc: 'Facilidade em ler os outros, mediar conflitos e criar conexões.',         Icon: Users,         g0: '#134e4a', g1: '#0f766e',
    questions: ['Percebo quando alguém está triste', 'Gosto de trabalhar em equipe', 'As pessoas costumam me pedir conselhos', 'Sou bom(a) em mediar conflitos'] },
  { id: 'intra', label: 'Autoconhecimento',    desc: 'Clareza sobre emoções próprias, motivações e padrões internos.',          Icon: Brain,         g0: '#3b0764', g1: '#6b21a8',
    questions: ['Gosto de passar tempo comigo mesmo(a)', 'Entendo meus próprios sentimentos', 'Tenho metas pessoais bem definidas', 'Reflito bastante antes de agir'] },
  { id: 'nat',   label: 'Natureza & Biologia', desc: 'Conexão com o mundo natural, animais, sistemas vivos e ecologia.',        Icon: Leaf,          g0: '#052e16', g1: '#14532d',
    questions: ['Gosto de estar ao ar livre', 'Me interesso por animais e plantas', 'Presto atenção em mudanças no clima', 'Gosto de acampar ou fazer trilhas'] },
];

const getStarColor = (score: number) => {
  if (score <= 1) return '#ef4444';
  if (score === 2) return '#f97316';
  if (score === 3) return '#f59e0b';
  if (score === 4) return '#60a5fa';
  return '#00f2ff';
};

const PRAISES = [
  'Matemática', 'Física', 'Química', 'Biologia',
  'Português / Redação', 'História', 'Geografia',
  'Inglês / Idiomas', 'Artes / Desenho', 'Programação / Computação',
  'Filosofia / Sociologia', 'Educação Física',
];

const HIDDEN_TALENTS = [
  'Adaptação rápida a mudanças', 'Agir bem sob pressão', 'Notar quando alguém está triste',
  'Aprender sozinho fuçando', 'Improvisar com o que tem', 'Conectar pessoas que combinam',
];

const MENTOR_QUOTES: Record<string, string> = {
  sabio:       'Quais são as ferramentas que você já trouxe na sua mochila? Vamos mapear suas inteligências inatas.',
  heroi:       'Todo herói tem suas armas naturais. Vamos descobrir quais são as suas.',
  rebelde:     'Você já nasceu com poderes únicos. É hora de reconhecê-los sem filtro.',
  curadora:    'Seus talentos naturais são presentes. Vamos iluminá-los com cuidado.',
  exploradora: 'Cada inteligência é um terreno para explorar. Vamos mapear o seu.',
  criadora:    'A matéria-prima da criação são seus dons naturais. Vamos inventariá-los.',
};

const cardVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit:  (dir: number) => ({ x: dir >= 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
};

export default function Mission2() {
  const navigate = useNavigate();
  const { state, updateMission, addXP, completeMission } = useApp();

  const [step, setStep]             = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection]   = useState(1);
  const [subMode, setSubMode]       = useState<'general' | 'detail'>('general');
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [detailAnswers, setDetailAnswers] = useState<Record<number, number>>({});
  const [hoverDetail, setHoverDetail]     = useState<{ q: number; s: number } | null>(null);

  const lightningChallenges = state.mission2?.lightningChallenges || {};
  const detailRatings       = state.mission2?.detailRatings       || {};
  const praiseMap           = state.mission2?.praiseMap           || [];
  const hiddenTalents       = state.mission2?.hiddenTalents       || [];

  const currentCard   = INTELLIGENCES[currentIndex];
  const currentScore  = lightningChallenges[currentCard.id];
  const isComplete    = Object.keys(detailRatings).length === INTELLIGENCES.length;
  const classifiedCount = Object.keys(detailRatings).length;

  const mentor      = state.mentor || 'sabio';
  const mentorQuote = MENTOR_QUOTES[mentor] ?? MENTOR_QUOTES.sabio;

  const goToCard = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    setSubMode('general');
    setDetailAnswers({});
    setHoverScore(null);
    setHoverDetail(null);
  };

  const navigateCard = (dir: number) => {
    const next = currentIndex + dir;
    if (next >= 0 && next < INTELLIGENCES.length) goToCard(next);
  };

  const handleScore = (value: number) => {
    updateMission('mission2', { ...state.mission2, lightningChallenges: { ...lightningChallenges, [currentCard.id]: value } });
    // Pre-populate detail answers if already rated
    const saved = detailRatings[currentCard.id];
    setDetailAnswers(saved ? { 0: saved[0], 1: saved[1], 2: saved[2], 3: saved[3] } : {});
    setHoverScore(null);
    setSubMode('detail');
  };

  const handleDetailNext = () => {
    const ratings: number[] = [detailAnswers[0] ?? 0, detailAnswers[1] ?? 0, detailAnswers[2] ?? 0, detailAnswers[3] ?? 0];
    const newDetailRatings = { ...detailRatings, [currentCard.id]: ratings };
    updateMission('mission2', { ...state.mission2, detailRatings: newDetailRatings });

    setSubMode('general');
    setDetailAnswers({});
    setHoverDetail(null);

    const nextIdx = INTELLIGENCES.findIndex((c, i) => i > currentIndex && !newDetailRatings[c.id]);
    if (nextIdx !== -1) {
      setDirection(1);
      setCurrentIndex(nextIdx);
    } else {
      const firstUncompleted = INTELLIGENCES.findIndex(c => !newDetailRatings[c.id]);
      if (firstUncompleted !== -1) {
        setDirection(firstUncompleted > currentIndex ? 1 : -1);
        setCurrentIndex(firstUncompleted);
      }
    }
  };

  const togglePraise = (praise: string) => {
    const next = praiseMap.includes(praise) ? praiseMap.filter(p => p !== praise) : [...praiseMap, praise];
    updateMission('mission2', { ...state.mission2, praiseMap: next });
  };

  const toggleHiddenTalent = (talent: string) => {
    const next = hiddenTalents.includes(talent) ? hiddenTalents.filter(t => t !== talent) : [...hiddenTalents, talent];
    updateMission('mission2', { ...state.mission2, hiddenTalents: next });
  };

  const handleNextStep = () => {
    if (step === 0 && isComplete)               setStep(1);
    else if (step === 1 && praiseMap.length >= 1)  setStep(2);
    else if (step === 2 && hiddenTalents.length >= 1) {
      setStep(3);
      addXP(100);
      completeMission(2);
    }
  };

  const isDetailComplete = Object.keys(detailAnswers).length === 4;

  return (
    <MissionWrapper videoTitle="Talentos na Mochila" videoDescription="Identifique suas forças mais latentes neste momento." videoId="missao2">
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── STEP 0: Desafio Relâmpago ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              {/* Mentor bubble */}
              <div className="flex items-start gap-3 mb-6 p-4 rounded-2xl bg-[var(--glass)] border border-white/10">
                <div className="w-10 h-10 rounded-full bg-[var(--color-brand-600)] flex items-center justify-center shrink-0 text-[var(--bg-dark)]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-[var(--color-text-muted)] mb-1">
                    {mentor.charAt(0).toUpperCase() + mentor.slice(1)}
                  </p>
                  <p className="text-sm text-[var(--text-main)] leading-relaxed italic">"{mentorQuote}"</p>
                </div>
              </div>

              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-[var(--text-main)]">Desafio Relâmpago</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5 mb-1.5">
                    {subMode === 'general'
                      ? 'Avalie seu nível de afinidade geral com cada área de inteligência.'
                      : 'Agora detalhe sua afinidade com as 4 afirmações sobre esta área.'}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    {subMode === 'general' ? '● Avalie de 1 a 5 estrelas por área' : '● Responda as 4 afirmações (1 a 5 ★)'}
                  </span>
                </div>
                <span className="text-xs font-mono text-[var(--color-text-muted)] tabular-nums">
                  {classifiedCount}/{INTELLIGENCES.length}
                </span>
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5 mb-5">
                {INTELLIGENCES.map((c, i) => {
                  const hasDetail = detailRatings[c.id] !== undefined;
                  const hasGeneral = lightningChallenges[c.id] !== undefined;
                  const dotColor = hasDetail
                    ? getStarColor(lightningChallenges[c.id] ?? 3)
                    : hasGeneral ? '#f59e0b' : undefined;
                  return (
                    <button
                      key={c.id}
                      onClick={() => goToCard(i)}
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: i === currentIndex ? '1.5rem' : '0.5rem',
                        backgroundColor: dotColor ?? (i === currentIndex ? 'var(--alpha-text)' : 'var(--alpha-border)'),
                      }}
                    />
                  );
                })}
              </div>

              {/* Card area */}
              <div className="relative overflow-hidden mb-6 flex-grow">
                <AnimatePresence mode="wait">
                  {subMode === 'general' && (
                    <motion.div
                      key={`g-${currentCard.id}`}
                      custom={direction}
                      variants={cardVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.15}
                      onDragEnd={(_, info) => {
                        if (info.offset.x > 70) navigateCard(-1);
                        else if (info.offset.x < -70) navigateCard(1);
                      }}
                      className="cursor-grab active:cursor-grabbing max-w-sm mx-auto select-none"
                    >
                      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                        <div
                          className="h-44 flex flex-col items-center justify-center relative gap-3"
                          style={{ background: `linear-gradient(135deg, ${currentCard.g0}, ${currentCard.g1})` }}
                        >
                          <currentCard.Icon className="w-16 h-16 text-white/25" strokeWidth={1} />
                          <button onClick={(e) => { e.stopPropagation(); navigateCard(-1); }} disabled={currentIndex === 0}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/60 hover:text-white/90 disabled:opacity-20 transition-opacity text-lg">‹</button>
                          <button onClick={(e) => { e.stopPropagation(); navigateCard(1); }} disabled={currentIndex === INTELLIGENCES.length - 1}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/60 hover:text-white/90 disabled:opacity-20 transition-opacity text-lg">›</button>
                          {currentScore !== undefined && (() => {
                            const color = getStarColor(currentScore);
                            return (
                              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider flex items-center gap-0.5"
                                style={{ backgroundColor: `${color}33`, color, border: `1px solid ${color}55` }}>
                                {currentScore}<Star className="w-3 h-3 fill-current" />
                              </div>
                            );
                          })()}
                        </div>
                        <div className="p-5 bg-[var(--glass)] backdrop-blur">
                          <h3 className="font-bold text-[var(--text-main)] text-base mb-1">{currentCard.label}</h3>
                          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">{currentCard.desc}</p>
                          <p className="text-xs text-[var(--color-text-muted)] text-center mb-3 font-mono uppercase tracking-wider opacity-60">Avaliação geral</p>
                          <div className="flex justify-center gap-3 pt-1" onMouseLeave={() => setHoverScore(null)}>
                            {[1, 2, 3, 4, 5].map(star => {
                              const active = (hoverScore ?? currentScore ?? 0) >= star;
                              const color  = getStarColor(hoverScore ?? currentScore ?? star);
                              return (
                                <button key={star} onClick={() => handleScore(star)} onMouseEnter={() => setHoverScore(star)}
                                  className="transition-transform hover:scale-125 active:scale-110" style={{ color: active ? color : 'var(--alpha-border-coin)' }}>
                                  <Star className="w-8 h-8 transition-colors" fill={active ? color : 'transparent'} strokeWidth={1.5} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {subMode === 'detail' && (
                    <motion.div
                      key={`d-${currentCard.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="max-w-sm mx-auto"
                    >
                      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                        {/* Detail header */}
                        <div className="px-5 py-4 flex items-center gap-3"
                          style={{ background: `linear-gradient(135deg, ${currentCard.g0}, ${currentCard.g1})` }}>
                          <currentCard.Icon className="w-7 h-7 text-white/60 shrink-0" strokeWidth={1} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest">Detalhando</p>
                            <h3 className="font-bold text-white text-sm truncate">{currentCard.label}</h3>
                          </div>
                          {currentScore !== undefined && (() => {
                            const color = getStarColor(currentScore);
                            return (
                              <div className="px-2 py-0.5 rounded-full text-[11px] font-bold font-mono flex items-center gap-0.5 shrink-0"
                                style={{ backgroundColor: `${color}33`, color, border: `1px solid ${color}55` }}>
                                {currentScore}<Star className="w-3 h-3 fill-current" />
                              </div>
                            );
                          })()}
                        </div>

                        {/* 4 questions */}
                        <div className="p-4 bg-[var(--glass)] space-y-4">
                          {currentCard.questions.map((q, qIdx) => {
                            const savedVal = detailAnswers[qIdx] ?? 0;
                            return (
                              <div key={qIdx} className={cn('pb-4 last:pb-0', qIdx < 3 && 'border-b border-white/5')}>
                                <p className="text-sm text-[var(--text-main)] mb-2 leading-snug">{q}</p>
                                <div className="flex gap-2" onMouseLeave={() => setHoverDetail(null)}>
                                  {[1, 2, 3, 4, 5].map(star => {
                                    const isHovering = hoverDetail?.q === qIdx;
                                    const activeVal  = isHovering ? (hoverDetail?.s ?? 0) : savedVal;
                                    const active     = activeVal >= star;
                                    const color      = getStarColor(isHovering ? (hoverDetail?.s ?? star) : (savedVal || star));
                                    return (
                                      <button key={star}
                                        onClick={() => setDetailAnswers(prev => ({ ...prev, [qIdx]: star }))}
                                        onMouseEnter={() => setHoverDetail({ q: qIdx, s: star })}
                                        className="transition-transform hover:scale-125 active:scale-110"
                                        style={{ color: active ? color : 'var(--alpha-border-coin)' }}>
                                        <Star className="w-6 h-6 transition-colors" fill={active ? color : 'transparent'} strokeWidth={1.5} />
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Detail navigation */}
                      <div className="flex justify-between items-center mt-4">
                        <button onClick={() => { setSubMode('general'); setDetailAnswers({}); setHoverDetail(null); }}
                          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
                          ← Re-avaliar geral
                        </button>
                        <button
                          onClick={handleDetailNext}
                          disabled={!isDetailComplete}
                          className={cn(
                            'px-6 py-2 rounded-xl font-bold uppercase tracking-wider text-sm transition-all',
                            isDetailComplete
                              ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                              : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]'
                          )}
                        >
                          {currentIndex === INTELLIGENCES.length - 1 ? 'Concluir Áreas' : 'Próxima Área'} →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {subMode === 'general' && (
                <div className="mt-auto flex justify-end">
                  <button
                    onClick={handleNextStep}
                    disabled={!isComplete}
                    className={cn(
                      'px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                      isComplete
                        ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                        : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]'
                    )}
                  >
                    Próxima Etapa
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 1: Mapa de Elogios ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="mb-6">
                <h3 className="font-bold text-xl text-[var(--text-main)] mb-1">Quais matérias os seus colegas pedem ajuda pra você?</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-2">Selecione as matérias em que você costuma ser o ponto de referência.</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                  ● Selecione pelo menos 1
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mb-auto">
                {PRAISES.map(praise => {
                  const isSelected = praiseMap.includes(praise);
                  return (
                    <button key={praise} onClick={() => togglePraise(praise)}
                      className="px-5 py-3 rounded-full border transition-all font-medium text-sm"
                      style={{
                        borderColor:     isSelected ? 'rgba(0,242,255,0.6)' : 'var(--alpha-border)',
                        backgroundColor: isSelected ? 'rgba(0,242,255,0.12)' : 'var(--alpha-bg)',
                        color:           isSelected ? 'var(--neon-cyan)'     : 'var(--alpha-text)',
                        transform:       isSelected ? 'scale(1.04)'          : 'scale(1)',
                      }}>
                      {praise}
                    </button>
                  );
                })}
              </div>
              <div className="mt-12 flex justify-between items-center pt-6 border-t border-[var(--color-brand-100)]">
                <span className="text-sm opacity-60 font-mono">{praiseMap.length} escolhas</span>
                <button onClick={handleNextStep} disabled={praiseMap.length < 1}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    praiseMap.length >= 1
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Próxima Etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Talento Oculto ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="mb-6">
                <h3 className="font-bold text-xl text-[var(--text-main)] mb-1">Talento Oculto</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-2">Essas habilidades raramente ganham nota na escola, mas são superpoderes na vida real. Qual delas você sente que possui?</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                  ● Selecione pelo menos 1
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-auto">
                {HIDDEN_TALENTS.map(talent => {
                  const isSelected = hiddenTalents.includes(talent);
                  return (
                    <button key={talent} onClick={() => toggleHiddenTalent(talent)}
                      className="p-5 rounded-xl border text-center transition-all font-medium text-sm"
                      style={{
                        borderColor:     isSelected ? 'rgba(0,242,255,0.5)'  : 'var(--alpha-border)',
                        backgroundColor: isSelected ? 'rgba(0,242,255,0.1)'  : 'var(--alpha-bg)',
                        color:           isSelected ? 'var(--neon-cyan)'      : 'var(--alpha-text)',
                        transform:       isSelected ? 'scale(1.02)'           : 'scale(1)',
                      }}>
                      <Sparkles className="w-4 h-4 mx-auto mb-2 opacity-60" />
                      {talent}
                    </button>
                  );
                })}
              </div>
              <div className="mt-12 flex justify-between items-center pt-6 border-t border-[var(--color-brand-100)]">
                <span className="text-sm opacity-60 font-mono">{hiddenTalents.length} poderes</span>
                <button onClick={handleNextStep} disabled={hiddenTalents.length < 1}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    hiddenTalents.length >= 1
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Concluir Missão
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Conclusão ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-grow justify-center py-10">
              <div className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)]">
                <Gem className="w-12 h-12 text-[var(--neon-cyan)]" />
              </div>
              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Prisma dos Talentos Adquirido</h2>
              <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-10 leading-relaxed">
                Você mapeou seus potenciais! As habilidades onde você tem facilidade natural são as engrenagens que farão sua jornada mais fluida e autêntica.
              </p>
              <button onClick={() => navigate('/comecar/missao/3')}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform">
                Avançar para Missão 03
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
