import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, PenLine, Heart, Users, Hammer, Lightbulb,
  Link2, Mic, BookOpen, LayoutGrid, Rocket, Sprout,
  BatteryLow, Battery, Zap, Flame,
} from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MissionWrapper } from '../components/MissionWrapper';
import { MedalPodium } from '../components/MedalPodium';
import type { EnergyLevel } from '../store';

const ACTIVITIES = [
  { id: 'Ensinar e transmitir conhecimento', desc: 'Compartilhar o que aprendeu com quem está começando.',          Icon: GraduationCap, g0: '#1e1b4b', g1: '#4c1d95' },
  { id: 'Escrever e registrar histórias',   desc: 'Transformar experiências em palavras, memórias ou documentos.',  Icon: PenLine,       g0: '#1a0a00', g1: '#7c2d12' },
  { id: 'Cuidar de pessoas',                desc: 'Estar presente, apoiar e nutrir quem está ao seu redor.',         Icon: Heart,         g0: '#701a75', g1: '#86198f' },
  { id: 'Liderar e tomar decisões',         desc: 'Guiar grupos, definir direções e assumir responsabilidades.',     Icon: Users,         g0: '#0f2952', g1: '#1e3a8a' },
  { id: 'Criar com as mãos',                desc: 'Artesanato, culinária, jardinagem, marcenaria, costura.',         Icon: Hammer,        g0: '#14532d', g1: '#166534' },
  { id: 'Resolver problemas complexos',     desc: 'Encontrar soluções onde outros veem apenas obstáculos.',          Icon: Lightbulb,     g0: '#3b0764', g1: '#6b21a8' },
  { id: 'Conectar pessoas',                 desc: 'Apresentar quem precisa se conhecer, construir pontes.',          Icon: Link2,         g0: '#0f4c5c', g1: '#0e7490' },
  { id: 'Falar em público',                 desc: 'Comunicar ideias, contar histórias, inspirar platéias.',          Icon: Mic,           g0: '#7f1d1d', g1: '#991b1b' },
  { id: 'Pesquisar e aprender',             desc: 'Mergulhar em temas novos, ler, descobrir, questionar.',           Icon: BookOpen,      g0: '#1e3a5f', g1: '#1d4ed8' },
  { id: 'Organizar e planejar',             desc: 'Criar sistemas, estruturar projetos, trazer ordem ao caos.',      Icon: LayoutGrid,    g0: '#0f172a', g1: '#1e3a5f' },
  { id: 'Empreender e inovar',              desc: 'Criar algo do zero, testar novas ideias, assumir riscos.',        Icon: Rocket,        g0: '#134e4a', g1: '#0f766e' },
  { id: 'Cultivar e criar vida',            desc: 'Jardinar, cozinhar, cuidar de animais, criar ambientes.',         Icon: Sprout,        g0: '#1a2e05', g1: '#3f6212' },
];

const ENERGY_LEVELS: { id: EnergyLevel; label: string; sublabel: string; Icon: React.ElementType; color: string }[] = [
  { id: 'drain',   label: 'Drena',   sublabel: 'Me esgota',         Icon: BatteryLow, color: '#ef4444' },
  { id: 'neutral', label: 'Neutro',  sublabel: 'Nem dá nem tira',   Icon: Battery,    color: '#9ca3af' },
  { id: 'boost',   label: 'Energiza',sublabel: 'Me anima',           Icon: Zap,        color: '#f59e0b' },
  { id: 'flow',    label: 'Flow',    sublabel: 'Não vejo o tempo',   Icon: Flame,      color: '#00f2ff' },
];

const CURIOSITY_THEMES = [
  'Saúde e longevidade', 'Arte e expressão', 'Espiritualidade e sentido',
  'Negócios e empreendedorismo', 'Educação e pedagogia', 'Natureza e meio ambiente',
  'Tecnologia e inovação', 'Comunidade e voluntariado', 'Escrita e comunicação',
  'Finanças e independência', 'Psicologia e comportamento', 'História e cultura',
];

const cardVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 280 : -280, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? -280 : 280, opacity: 0, scale: 0.95 }),
};

export default function Mission1() {
  const navigate = useNavigate();
  const { state, updatePhase, addXP, completePhase } = useApp();

  const [step, setStep] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const energyCards     = state.phase1.energyCards     ?? {};
  const curiosityThemes = state.phase1.curiosityThemes ?? [];
  const curiosityRanking = state.phase1.curiosityRanking ?? {};

  const MAX_CURIOSITY = 6;
  const podiumNeeded  = curiosityThemes.length >= 2;
  const medalCap      = Math.min(3, curiosityThemes.length);
  const rankComplete  = Object.keys(curiosityRanking).length === medalCap;

  const classified      = Object.keys(energyCards).length;
  const isCardsComplete = classified === ACTIVITIES.length;
  const currentActivity = ACTIVITIES[currentIndex];

  const navigateCard = (dir: number) => {
    const next = currentIndex + dir;
    if (next >= 0 && next < ACTIVITIES.length) {
      setDirection(dir);
      setCurrentIndex(next);
    }
  };

  const handleEnergy = (level: EnergyLevel) => {
    const newMap = { ...energyCards, [currentActivity.id]: level };
    const wasNew = !energyCards[currentActivity.id];
    updatePhase('phase1', { energyCards: newMap });
    if (wasNew) addXP(10);

    const nextIdx = ACTIVITIES.findIndex((a, i) => i > currentIndex && !newMap[a.id]);
    if (nextIdx !== -1) {
      setDirection(1);
      setCurrentIndex(nextIdx);
    } else {
      const firstIdx = ACTIVITIES.findIndex(a => !newMap[a.id]);
      if (firstIdx !== -1) {
        setDirection(firstIdx > currentIndex ? 1 : -1);
        setCurrentIndex(firstIdx);
      }
    }
  };

  const toggleTheme = (theme: string) => {
    const next = curiosityThemes.includes(theme)
      ? curiosityThemes.filter(t => t !== theme)
      : [...curiosityThemes, theme];
    // mantém o ranking só com os temas ainda selecionados
    const nextRanking = Object.fromEntries(
      Object.entries(curiosityRanking).filter(([id]) => next.includes(id)),
    );
    updatePhase('phase1', { curiosityThemes: next, curiosityRanking: nextRanking });
  };

  const handleNextStep = () => {
    if (step === 0 && isCardsComplete) setStep(1);
    else if (step === 1 && curiosityThemes.length >= 1) {
      if (podiumNeeded) setStep(2);
      else { addXP(100); completePhase(1); navigate('/comecar/fase/2'); }
    }
    else if (step === 2 && rankComplete) {
      addXP(100);
      completePhase(1);
      navigate('/comecar/fase/2');
    }
  };

  return (
    <MissionWrapper
      videoTitle="Mapa de Energia"
      videoDescription="Todo negócio de uma pessoa só roda com a energia do dono. Vamos descobrir o que te dá vida — e o que drena — para construir sobre o que te sustenta."
      videoId="fase1"
    >
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── STEP 0: Cartas de energia ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              <div className="mb-5 text-center">
                <h3 className="font-bold text-lg text-[var(--text-main)]">Mapa de Energia</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-2 max-w-xs mx-auto leading-relaxed">
                  Para cada atividade, diga como ela afeta sua energia hoje. Seja sincero — não existe resposta certa.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                  {classified} / {ACTIVITIES.length} classificadas
                </span>
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5 justify-center mb-6 flex-wrap">
                {ACTIVITIES.map((a, i) => {
                  const lvl = ENERGY_LEVELS.find(e => e.id === energyCards[a.id]);
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
                      <div
                        className="h-44 flex items-center justify-center relative"
                        style={{ background: `linear-gradient(135deg, ${currentActivity.g0}, ${currentActivity.g1})` }}
                      >
                        <currentActivity.Icon className="w-20 h-20 text-white/20" strokeWidth={1} />
                        <button onClick={(e) => { e.stopPropagation(); navigateCard(-1); }} disabled={currentIndex === 0}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white/60 hover:text-white flex items-center justify-center disabled:opacity-20 text-lg">‹</button>
                        <button onClick={(e) => { e.stopPropagation(); navigateCard(1); }} disabled={currentIndex === ACTIVITIES.length - 1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white/60 hover:text-white flex items-center justify-center disabled:opacity-20 text-lg">›</button>
                        {energyCards[currentActivity.id] && (
                          <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: ENERGY_LEVELS.find(e => e.id === energyCards[currentActivity.id])?.color + '33',
                                     border: `2px solid ${ENERGY_LEVELS.find(e => e.id === energyCards[currentActivity.id])?.color}` }}>
                            {React.createElement(ENERGY_LEVELS.find(e => e.id === energyCards[currentActivity.id])!.Icon, { className: 'w-3.5 h-3.5', style: { color: ENERGY_LEVELS.find(e => e.id === energyCards[currentActivity.id])?.color } })}
                          </div>
                        )}
                      </div>
                      <div className="bg-[var(--glass)] backdrop-blur-md p-5 border-t border-white/10">
                        <h4 className="font-bold text-[var(--text-main)] mb-1">{currentActivity.id}</h4>
                        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{currentActivity.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Energy buttons */}
              <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto w-full mb-6">
                {ENERGY_LEVELS.map(({ id, label, sublabel, Icon, color }) => {
                  const selected = energyCards[currentActivity.id] === id;
                  return (
                    <button key={id} onClick={() => handleEnergy(id)}
                      className={cn('flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all', selected ? 'scale-105 shadow-lg' : 'opacity-60 hover:opacity-100')}
                      style={{ borderColor: selected ? color : 'transparent', backgroundColor: selected ? `${color}18` : 'var(--glass)' }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                      <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color }}>{label}</span>
                      <span className="text-[9px] text-[var(--color-text-muted)] leading-tight text-center">{sublabel}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-center">
                <motion.button
                  animate={{ opacity: isCardsComplete ? 1 : 0.3 }}
                  disabled={!isCardsComplete}
                  onClick={handleNextStep}
                  className="px-8 py-3 rounded-xl bg-[var(--color-brand-600)] font-bold uppercase tracking-wider text-[var(--bg-dark)] disabled:pointer-events-none transition-all"
                >
                  Próximo →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: Temas de Curiosidade ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-6">
                <h3 className="font-bold text-xl text-[var(--text-main)] mb-2">O que ainda te desperta curiosidade?</h3>
                <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto leading-relaxed">
                  Quais temas você leria sobre às 23h sem sentir sono? O que te instiga costuma apontar para onde há gente disposta a aprender — e a pagar por isso. Escolha de 1 a {MAX_CURIOSITY}.
                </p>
                <span className="inline-flex mt-3 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                  {curiosityThemes.length}/{MAX_CURIOSITY} selecionados
                </span>
              </div>

              <div className="flex flex-wrap gap-3 justify-center mb-8 max-w-md mx-auto">
                {CURIOSITY_THEMES.map(theme => {
                  const selected = curiosityThemes.includes(theme);
                  const blocked  = !selected && curiosityThemes.length >= MAX_CURIOSITY;
                  return (
                    <button key={theme} onClick={() => !blocked && toggleTheme(theme)} disabled={blocked}
                      className={cn('px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2',
                        selected ? 'bg-[var(--color-brand-600)] border-[var(--color-brand-600)] text-[var(--bg-dark)] font-bold'
                                 : blocked ? 'border-[var(--color-brand-200)] text-[var(--color-text-muted)] opacity-30 cursor-not-allowed bg-[var(--glass)]'
                                 : 'border-[var(--color-brand-200)] text-[var(--color-text-muted)] hover:border-[var(--color-brand-400)] bg-[var(--glass)]')}>
                      {theme}
                    </button>
                  );
                })}
              </div>

              <div className="text-center">
                <motion.button
                  animate={{ opacity: curiosityThemes.length >= 1 ? 1 : 0.3 }}
                  disabled={curiosityThemes.length < 1}
                  onClick={handleNextStep}
                  className="px-8 py-3 rounded-xl bg-[var(--color-brand-600)] font-bold uppercase tracking-wider text-[var(--bg-dark)] shadow-[var(--btn-shadow)] disabled:pointer-events-none"
                >
                  {podiumNeeded ? 'Próxima Etapa →' : 'Concluir Fase 1 →'}
                </motion.button>
                <button onClick={() => setStep(0)} className="block mx-auto mt-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] py-1">← Voltar</button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Pódio das curiosidades ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-xl mx-auto w-full">
              <div className="text-center mb-6">
                <h3 className="font-bold text-xl text-[var(--text-main)] mb-2">Qual te puxa MAIS?</h3>
                <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
                  Monte o pódio: toque para dar 🥇 ouro, 🥈 prata e 🥉 bronze aos temas que mais te movem.
                </p>
              </div>

              <MedalPodium
                items={curiosityThemes.map(t => ({ id: t, label: t }))}
                values={curiosityRanking}
                onChange={next => updatePhase('phase1', { curiosityRanking: next })}
              />

              <div className="text-center mt-8">
                <motion.button
                  animate={{ opacity: rankComplete ? 1 : 0.3 }}
                  disabled={!rankComplete}
                  onClick={handleNextStep}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] font-bold uppercase tracking-wider text-white shadow-[var(--btn-shadow)] disabled:pointer-events-none"
                >
                  Concluir Fase 1 →
                </motion.button>
                <button onClick={() => setStep(1)} className="block mx-auto mt-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] py-1">← Voltar</button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
