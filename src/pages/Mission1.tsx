import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, BookOpen, Compass,
  PenLine, Calculator, Palette, Mic, Heart, LayoutGrid, Users, Video,
  FlaskConical, HeartHandshake, Cpu,
  BatteryLow, Battery, Zap, Flame,
} from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

import { MissionWrapper } from '../components/MissionWrapper';

type Quadrant = 'flow' | 'boost' | 'neutral' | 'drain';

const ACTIVITIES_DATA = [
  { id: 'Escrever histórias',              desc: 'Criar narrativas, personagens e mundos com palavras.',                       Icon: PenLine,       g0: '#1e1b4b', g1: '#4c1d95' },
  { id: 'Resolver problemas matemáticos',  desc: 'Encontrar padrões e soluções lógicas em desafios complexos.',               Icon: Calculator,    g0: '#14532d', g1: '#166534' },
  { id: 'Desenhar e criar',               desc: 'Transformar ideias em formas visuais e expressões artísticas.',             Icon: Palette,       g0: '#581c87', g1: '#7e22ce' },
  { id: 'Falar em público',               desc: 'Engajar plateias e comunicar ideias com presença e clareza.',               Icon: Mic,           g0: '#7f1d1d', g1: '#991b1b' },
  { id: 'Cuidar de pessoas/animais',      desc: 'Nutrir, apoiar e criar conexões genuínas de cuidado.',                      Icon: Heart,         g0: '#701a75', g1: '#86198f' },
  { id: 'Organizar e planejar',           desc: 'Estruturar sistemas, processos e rotinas com precisão.',                    Icon: LayoutGrid,    g0: '#0f2952', g1: '#1e3a8a' },
  { id: 'Liderar grupos',                 desc: 'Inspirar equipes e guiar pessoas rumo a objetivos comuns.',                 Icon: Users,         g0: '#431407', g1: '#7c2d12' },
  { id: 'Criar vídeos ou conteúdo',       desc: 'Produzir experiências multimídia que informam e entretêm.',                 Icon: Video,         g0: '#134e4a', g1: '#0f766e' },
  { id: 'Ler e pesquisar',                desc: 'Mergulhar em conhecimento e conectar ideias de diferentes áreas.',          Icon: BookOpen,      g0: '#1e3a5f', g1: '#1d4ed8' },
  { id: 'Fazer experimentos',             desc: 'Testar hipóteses, observar resultados e aprender com dados reais.',         Icon: FlaskConical,  g0: '#0f172a', g1: '#1e3a5f' },
  { id: 'Ajudar os outros',               desc: 'Contribuir com o bem-estar e crescimento de outras pessoas.',               Icon: HeartHandshake,g0: '#3b0764', g1: '#6b21a8' },
  { id: 'Trabalhar com tecnologia',       desc: 'Construir, programar e resolver problemas com ferramentas digitais.',       Icon: Cpu,           g0: '#030712', g1: '#0f172a' },
];

const ENERGY_LEVELS: { id: Quadrant; label: string; Icon: React.ElementType; color: string }[] = [
  { id: 'drain',   label: 'Drain',   Icon: BatteryLow, color: '#ef4444' },
  { id: 'neutral', label: 'Neutral', Icon: Battery,    color: '#9ca3af' },
  { id: 'boost',   label: 'Boost',   Icon: Zap,        color: '#f59e0b' },
  { id: 'flow',    label: 'Flow',    Icon: Flame,      color: '#00f2ff' },
];

const CHILDHOOD_VERBS = [
  'criar', 'liderar', 'cuidar', 'organizar',
  'investigar', 'performar', 'construir', 'competir'
];

const CURIOSITY_THEMES = [
  'Tecnologia', 'Arte e Design', 'Psicologia', 'Finanças',
  'Biologia e Natureza', 'História', 'Ciência e Espaço',
  'Empreendedorismo', 'Esportes', 'Música', 'Política'
];

const cardVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 280 : -280, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? -280 : 280, opacity: 0, scale: 0.95 }),
};

export default function Mission1() {
  const navigate = useNavigate();
  const { state, updateMission, addXP, completeMission } = useApp();

  const [step, setStep] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const mappedActivities = state.mission1.energyCards;
  const selectedVerbs = state.mission1.childhoodVerbs;
  const selectedThemes = state.mission1.curiosityRadar;

  const isCardsComplete = Object.keys(mappedActivities).length === ACTIVITIES_DATA.length;

  const currentActivity = ACTIVITIES_DATA[currentIndex];
  const currentQuadrant = mappedActivities[currentActivity.id] as Quadrant | undefined;
  const classified = Object.keys(mappedActivities).length;

  const navigateCard = (dir: number) => {
    const next = currentIndex + dir;
    if (next >= 0 && next < ACTIVITIES_DATA.length) {
      setDirection(dir);
      setCurrentIndex(next);
    }
  };

  const handleEnergy = (quadrantId: Quadrant) => {
    const newMap = { ...mappedActivities, [currentActivity.id]: quadrantId };
    const wasNew = !mappedActivities[currentActivity.id];
    updateMission('mission1', { energyCards: newMap });
    if (wasNew) addXP(10);

    // Advance to next unclassified card after current
    const nextIdx = ACTIVITIES_DATA.findIndex((a, i) => i > currentIndex && !newMap[a.id]);
    if (nextIdx !== -1) {
      setDirection(1);
      setCurrentIndex(nextIdx);
    } else {
      const firstIdx = ACTIVITIES_DATA.findIndex(a => !newMap[a.id]);
      if (firstIdx !== -1) {
        setDirection(firstIdx > currentIndex ? 1 : -1);
        setCurrentIndex(firstIdx);
      }
    }
  };

  const toggleVerb = (verb: string) => {
    const newVerbs = selectedVerbs.includes(verb)
      ? selectedVerbs.filter(v => v !== verb)
      : [...selectedVerbs, verb];
    updateMission('mission1', { childhoodVerbs: newVerbs });
  };

  const toggleTheme = (theme: string) => {
    const newThemes = selectedThemes.includes(theme)
      ? selectedThemes.filter(v => v !== theme)
      : [...selectedThemes, theme];
    updateMission('mission1', { curiosityRadar: newThemes });
  };

  const handleNextStep = () => {
    if (step === 0 && isCardsComplete) setStep(1);
    else if (step === 1 && selectedVerbs.length >= 2) setStep(2);
    else if (step === 2 && selectedThemes.length >= 2) {
      setStep(3);
      addXP(100);
      completeMission(1);
    }
  };

  return (
    <MissionWrapper videoTitle="Mapa de Energia" videoDescription="Vamos analisar o que te dá energia e o que drena sua energia na realidade atual." videoId="missao1">
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── STEP 0: Energy Cards Carousel ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              {/* Header */}
              <div className="mb-5 text-center">
                <h3 className="font-bold text-lg text-[var(--text-main)]">Mesa de Cartas de Energia</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-2 max-w-xs mx-auto leading-relaxed">
                  Para cada carta, indique como essa atividade afeta sua energia: do Drain (te esgota) ao Flow (não vê o tempo passar).
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                  ● 1 opção por carta — classifique todas as {ACTIVITIES_DATA.length}
                </span>
                <p className="text-xs font-mono text-[var(--color-text-muted)] mt-2 tracking-wider">
                  {classified} / {ACTIVITIES_DATA.length} CLASSIFICADAS
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5 justify-center mb-6 flex-wrap">
                {ACTIVITIES_DATA.map((a, i) => {
                  const rawVal = mappedActivities[a.id];
                  const lvl = rawVal ? ENERGY_LEVELS.find(e => e.id === rawVal) : undefined;
                  return (
                    <button
                      key={a.id}
                      onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
                      className="w-2.5 h-2.5 rounded-full transition-all"
                      style={{
                        backgroundColor: lvl ? lvl.color : i === currentIndex ? 'var(--alpha-text)' : 'var(--alpha-border)',
                        transform: i === currentIndex ? 'scale(1.4)' : 'scale(1)',
                      }}
                    />
                  );
                })}
              </div>

              {/* Card carousel */}
              <div className="relative overflow-hidden mb-6 flex-grow">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentActivity.id}
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
                      {/* Illustration area */}
                      <div
                        className="h-52 flex items-center justify-center relative"
                        style={{ background: `linear-gradient(135deg, ${currentActivity.g0}, ${currentActivity.g1})` }}
                      >
                        <currentActivity.Icon className="w-24 h-24 text-white/20" strokeWidth={1} />

                        {/* Nav arrows */}
                        <button
                          onClick={(e) => { e.stopPropagation(); navigateCard(-1); }}
                          disabled={currentIndex === 0}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/60 hover:text-white/90 disabled:opacity-20 transition-opacity text-lg"
                        >‹</button>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigateCard(1); }}
                          disabled={currentIndex === ACTIVITIES_DATA.length - 1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/60 hover:text-white/90 disabled:opacity-20 transition-opacity text-lg"
                        >›</button>

                        {/* Already-classified badge */}
                        {currentQuadrant && (() => {
                          const lvl = ENERGY_LEVELS.find(e => e.id === currentQuadrant);
                          if (!lvl) return null;
                          return (
                            <div
                              className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-widest"
                              style={{ backgroundColor: `${lvl.color}33`, color: lvl.color, border: `1px solid ${lvl.color}55` }}
                            >
                              {lvl.label}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Text area */}
                      <div className="p-5 bg-[var(--glass)] backdrop-blur">
                        <h3 className="font-bold text-[var(--text-main)] text-base mb-1">{currentActivity.id}</h3>
                        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{currentActivity.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Energy level buttons */}
              <div className="flex justify-center gap-3 mb-8">
                {ENERGY_LEVELS.map(({ id, label, Icon, color }) => {
                  const isSelected = currentQuadrant === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleEnergy(id)}
                      className="flex flex-col items-center gap-2 px-3 py-3 rounded-2xl border transition-all duration-200"
                      style={{
                        borderColor: isSelected ? `${color}66` : 'var(--alpha-border)',
                        backgroundColor: isSelected ? `${color}18` : 'var(--alpha-bg)',
                        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                        style={{ backgroundColor: isSelected ? `${color}28` : 'var(--alpha-bg)' }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <span className="text-[10px] font-mono tracking-widest" style={{ color: isSelected ? color : 'var(--alpha-text)' }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="mt-auto flex justify-end">
                <button
                  onClick={handleNextStep}
                  disabled={!isCardsComplete}
                  className={cn(
                    'px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    isCardsComplete
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]'
                  )}
                >
                  Próxima Etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: Childhood Verbs ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-8 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[18px] mb-1">Linha do Tempo da Infância</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed mb-2">
                    Quando você brincava quando criança, quais eram os verbos de ação mais recorrentes?
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● Selecione 2 ou mais verbos
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-4 grid-cols-2 gap-4 mb-auto">
                {CHILDHOOD_VERBS.map(verb => {
                  const isSelected = selectedVerbs.includes(verb);
                  return (
                    <button
                      key={verb}
                      onClick={() => toggleVerb(verb)}
                      className={cn(
                        'p-6 rounded-xl border text-center transition-all capitalize font-medium',
                        isSelected
                          ? 'bg-[var(--color-brand-600)] border-[var(--color-brand-600)] text-[var(--bg-dark)] shadow-[var(--btn-shadow)] scale-[1.02]'
                          : 'bg-[var(--glass)] border-[var(--color-brand-100)] text-[var(--text-main)] hover:border-[var(--color-brand-300)]'
                      )}
                    >
                      {verb}
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-between items-center pt-6 border-t border-[var(--color-brand-100)]">
                <span className="text-sm opacity-60 font-mono">{selectedVerbs.length} verbos escolhidos</span>
                <button
                  onClick={handleNextStep}
                  disabled={selectedVerbs.length < 2}
                  className={cn(
                    'px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    selectedVerbs.length >= 2
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]'
                  )}
                >
                  Próxima Etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Curiosity Radar ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-8 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[18px] mb-1">Radar de Curiosidade</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed mb-2">
                    Que temas você consome por curiosidade própria, mesmo sem ter prova, nota ou recompensa?
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● Selecione 2 ou mais temas
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-auto">
                {CURIOSITY_THEMES.map(theme => {
                  const isSelected = selectedThemes.includes(theme);
                  return (
                    <button
                      key={theme}
                      onClick={() => toggleTheme(theme)}
                      className={cn(
                        'px-5 py-3 rounded-lg border transition-all font-medium text-sm',
                        isSelected
                          ? 'bg-[var(--color-brand-600)] border-[var(--color-brand-600)] text-[var(--bg-dark)] shadow-[var(--btn-shadow)] scale-105'
                          : 'bg-[var(--glass)] border-[var(--color-brand-100)] text-[var(--text-main)] hover:border-[var(--color-brand-300)]'
                      )}
                    >
                      {theme}
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-between items-center pt-6 border-t border-[var(--color-brand-100)]">
                <span className="text-sm opacity-60 font-mono">{selectedThemes.length} temas escolhidos</span>
                <button
                  onClick={handleNextStep}
                  disabled={selectedThemes.length < 2}
                  className={cn(
                    'px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    selectedThemes.length >= 2
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]'
                  )}
                >
                  Analisar Dados
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Completion ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-grow justify-center py-10">
              <div className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)]">
                <Compass className="w-12 h-12 text-[var(--neon-cyan)]" />
              </div>

              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Bússola do Propósito Adquirida</h2>
              <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-10 leading-relaxed">
                Você mapeou com sucesso suas fontes de energia e curiosidade natural. Esses blocos são essenciais para entender onde você entrará em "estado de fluxo" no futuro.
              </p>

              <button
                onClick={() => navigate('/comecar/missao/2')}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform"
              >
                Avançar para Missão 02
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
