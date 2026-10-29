import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, MessageCircle, Lightbulb, Heart,
  LayoutGrid, BookOpen, Sparkles, Brain,
  Star, Gem, Briefcase, Check,
} from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MissionWrapper } from '../components/MissionWrapper';

const COMPETENCIES = [
  {
    id: 'lideranca', label: 'Liderança e Gestão',
    desc: 'Guiar pessoas, tomar decisões difíceis e manter equipes motivadas.',
    Icon: Users, g0: '#0f2952', g1: '#1e3a8a',
    questions: [
      'Já assumi a liderança de equipes ou projetos',
      'Pessoas costumam me seguir naturalmente',
      'Sei motivar outros em momentos de dificuldade',
      'Tomo decisões mesmo sem ter todas as informações',
    ],
  },
  {
    id: 'comunicacao', label: 'Comunicação e Persuasão',
    desc: 'Explicar ideias com clareza, convencer, escrever e falar em público.',
    Icon: MessageCircle, g0: '#1a0a00', g1: '#7c2d12',
    questions: [
      'Explico coisas complexas de forma simples',
      'Consigo convencer pessoas de maneira respeitosa',
      'Escrever ou falar em público é natural para mim',
      'Sou bom(a) em adaptar minha linguagem ao público',
    ],
  },
  {
    id: 'resolucao', label: 'Resolução de Problemas',
    desc: 'Encontrar soluções práticas em situações complexas ou de pressão.',
    Icon: Lightbulb, g0: '#1a1500', g1: '#3d3000',
    questions: [
      'Mantenho a calma quando surgem crises',
      'Vejo soluções onde outros só veem obstáculos',
      'Tenho raciocínio rápido sob pressão',
      'Gosto de analisar problemas de vários ângulos',
    ],
  },
  {
    id: 'empatia', label: 'Relações e Empatia',
    desc: 'Construir conexões genuínas, mediar conflitos e entender os outros.',
    Icon: Heart, g0: '#701a75', g1: '#86198f',
    questions: [
      'Percebo o estado emocional das pessoas ao redor',
      'Consigo mediar conflitos com facilidade',
      'As pessoas se abrem comigo com facilidade',
      'Crio laços duradouros com quem convivo',
    ],
  },
  {
    id: 'planejamento', label: 'Planejamento e Organização',
    desc: 'Estruturar projetos, antecipar riscos e criar sistemas que funcionam.',
    Icon: LayoutGrid, g0: '#0f172a', g1: '#1e3a5f',
    questions: [
      'Gosto de planejar antes de agir',
      'Crio estruturas e processos naturalmente',
      'Antecipo problemas antes que aconteçam',
      'Mantenho clareza em situações complexas',
    ],
  },
  {
    id: 'conhecimento', label: 'Conhecimento Especializado',
    desc: 'Expertise acumulada em uma ou mais áreas ao longo da carreira e da vida.',
    Icon: BookOpen, g0: '#1e1b4b', g1: '#4c1d95',
    questions: [
      'Tenho profundidade em pelo menos uma área de conhecimento',
      'Fui reconhecido(a) como referência em algum campo',
      'Continuo aprendendo e me atualizando',
      'Sei identificar o que não sei e buscar quem sabe',
    ],
  },
  {
    id: 'criatividade', label: 'Criatividade e Inovação',
    desc: 'Gerar novas ideias, adaptar recursos e criar onde havia só rotina.',
    Icon: Sparkles, g0: '#134e4a', g1: '#0f766e',
    questions: [
      'Tenho facilidade em pensar fora do padrão',
      'Já criei soluções originais no trabalho ou na vida',
      'Gosto de experimentar e testar novas abordagens',
      'Transformo recursos limitados em resultados criativos',
    ],
  },
  {
    id: 'sabedoria', label: 'Autoconhecimento e Sabedoria',
    desc: 'Clareza sobre si mesmo, padrões emocionais e perspectiva de vida.',
    Icon: Brain, g0: '#3b0764', g1: '#6b21a8',
    questions: [
      'Entendo bem meus próprios gatilhos e padrões',
      'Aprendo com erros sem me punir excessivamente',
      'Consigo ver o quadro geral em situações complexas',
      'A experiência me deu uma perspectiva que os mais jovens não têm',
    ],
  },
];


const HIDDEN_TALENTS = [
  'Apaziguar situações de conflito com naturalidade',
  'Identificar rapidamente o que é essencial no caos',
  'Manter a calma quando todos estão em pânico',
  'Fazer as perguntas que ninguém mais fez',
  'Transformar conhecimento complexo em algo simples',
  'Conectar histórias do passado com situações do presente',
  'Perceber o potencial nas pessoas antes delas mesmas',
  'Terminar o que começa — mesmo quando é difícil',
];

const getStarColor = (score: number) => {
  if (score <= 1) return '#ef4444';
  if (score === 2) return '#f97316';
  if (score === 3) return '#f59e0b';
  if (score === 4) return '#60a5fa';
  return '#00f2ff';
};

const cardVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit:  (dir: number) => ({ x: dir >= 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
};

// Chapéu que o(a) dono(a) do negócio mais veste (CEO do negócio de uma pessoa só)
const CARGOS = [
  { id: 'especialista', name: 'O(A) Especialista', profile: 'Entrego meu conhecimento direto: consultoria, mentoria, diagnóstico.' },
  { id: 'criador',      name: 'O(A) Criador(a)',   profile: 'Crio produtos, conteúdo e soluções com a minha marca.' },
  { id: 'vendedor',     name: 'O(A) Conector(a)',  profile: 'Faço acontecer: vendo, fecho parcerias e conecto pessoas.' },
  { id: 'organizador',  name: 'O(A) Organizador(a)', profile: 'Estruturo, planejo e faço a operação rodar com ordem.' },
  { id: 'mao_na_massa', name: 'Mão na Massa',      profile: 'Produzo e executo com as próprias mãos, no detalhe.' },
  { id: 'cuidador',     name: 'O(A) Cuidador(a)',  profile: 'Atendo e cuido das pessoas de perto, com presença.' },
];

export default function Mission2() {
  const navigate = useNavigate();
  const { state, updatePhase, addXP, completePhase } = useApp();

  const skillRatings  = state.phase2.skillRatings  ?? {};
  const hiddenTalents = state.phase2.hiddenTalents ?? [];
  const cargo         = state.phase2.cargo         ?? '';

  const [step, setStep] = useState(() => {
    if (cargo) return 2;
    if (Object.keys(skillRatings).length === COMPETENCIES.length) return 1;
    return 0;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection]   = useState(1);
  const [hoverScore, setHoverScore] = useState<number | null>(null);

  const currentCard     = COMPETENCIES[currentIndex];
  const currentScore    = skillRatings[currentCard.id];
  const classifiedCount = Object.keys(skillRatings).length;
  const isComplete      = classifiedCount === COMPETENCIES.length;

  const goToCard = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    setHoverScore(null);
  };

  const navigateCard = (dir: number) => {
    const next = currentIndex + dir;
    if (next >= 0 && next < COMPETENCIES.length) goToCard(next);
  };

  const handleScore = (value: number) => {
    const newRatings = { ...skillRatings, [currentCard.id]: value };
    updatePhase('phase2', { skillRatings: newRatings });
    setHoverScore(null);

    const nextIdx = COMPETENCIES.findIndex((c, i) => i > currentIndex && !newRatings[c.id]);
    if (nextIdx !== -1) {
      setDirection(1);
      setCurrentIndex(nextIdx);
    } else {
      const first = COMPETENCIES.findIndex(c => !newRatings[c.id]);
      if (first !== -1) {
        setDirection(first > currentIndex ? 1 : -1);
        setCurrentIndex(first);
      }
    }
  };

  const toggleHiddenTalent = (talent: string) => {
    const next = hiddenTalents.includes(talent)
      ? hiddenTalents.filter(t => t !== talent)
      : [...hiddenTalents, talent];
    updatePhase('phase2', { hiddenTalents: next });
  };

  const handleNextStep = () => {
    if (step === 0 && isComplete) setStep(1);
    else if (step === 1 && hiddenTalents.length >= 1) setStep(2);
    else if (step === 2 && cargo) {
      addXP(100);
      completePhase(2);
      navigate('/comecar/fase/3');
    }
  };

  return (
    <MissionWrapper
      videoTitle="Talentos na Mochila"
      videoDescription="Suas competências de décadas são o produto que o seu negócio vende. Vamos mapear a expertise que te dá autoridade — e que as pessoas pagam para acessar."
      videoId="fase2"
    >
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── STEP 0: Avaliação de Competências ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-[var(--text-main)]">Competências de Vida</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5 mb-1.5">
                    Avalie sua afinidade com cada competência acumulada ao longo da vida.
                  </p>
                  <span className="inline-flex text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● Avalie de 1 a 5 estrelas
                  </span>
                </div>
                <span className="text-xs font-mono text-[var(--color-text-muted)] tabular-nums">
                  {classifiedCount}/{COMPETENCIES.length}
                </span>
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5 mb-5">
                {COMPETENCIES.map((c, i) => {
                  const rated    = skillRatings[c.id] !== undefined;
                  const dotColor = rated ? getStarColor(skillRatings[c.id] ?? 3) : undefined;
                  return (
                    <button key={c.id} onClick={() => goToCard(i)}
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

                  <motion.div
                    key={`g-${currentCard.id}`}
                    custom={direction}
                    variants={cardVariants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.15}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 70) navigateCard(-1);
                      else if (info.offset.x < -70) navigateCard(1);
                    }}
                    className="cursor-grab active:cursor-grabbing max-w-sm mx-auto select-none"
                  >
                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                      <div className="h-44 flex flex-col items-center justify-center relative gap-3"
                        style={{ background: `linear-gradient(135deg, ${currentCard.g0}, ${currentCard.g1})` }}>
                        <currentCard.Icon className="w-16 h-16 text-white/25" strokeWidth={1} />
                        <button onClick={(e) => { e.stopPropagation(); navigateCard(-1); }} disabled={currentIndex === 0}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/60 hover:text-white/90 disabled:opacity-20 text-lg">‹</button>
                        <button onClick={(e) => { e.stopPropagation(); navigateCard(1); }} disabled={currentIndex === COMPETENCIES.length - 1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/60 hover:text-white/90 disabled:opacity-20 text-lg">›</button>
                        {currentScore !== undefined && (() => {
                          const color = getStarColor(currentScore);
                          return (
                            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono flex items-center gap-0.5"
                              style={{ backgroundColor: `${color}33`, color, border: `1px solid ${color}55` }}>
                              {currentScore}<Star className="w-3 h-3 fill-current" />
                            </div>
                          );
                        })()}
                      </div>
                      <div className="p-5 bg-[var(--glass)] backdrop-blur">
                        <h3 className="font-bold text-[var(--text-main)] text-base mb-1">{currentCard.label}</h3>
                        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">{currentCard.desc}</p>
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

                </AnimatePresence>
              </div>

              <div className="mt-auto flex justify-end">
                <button onClick={handleNextStep} disabled={!isComplete}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    isComplete
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Próxima Etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: Talentos Invisíveis ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="mb-6">
                <h3 className="font-bold text-xl text-[var(--text-main)] mb-1">Talentos que você não reconhece como talentos</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-2">
                  Algumas habilidades são tão naturais que você deixou de percebê-las como dons. Quais das abaixo se aplicam a você?
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                  ● Selecione pelo menos 1
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mb-auto">
                {HIDDEN_TALENTS.map(talent => {
                  const selected = hiddenTalents.includes(talent);
                  return (
                    <button key={talent} onClick={() => toggleHiddenTalent(talent)}
                      className="p-4 rounded-xl border text-left transition-all text-sm"
                      style={{
                        borderColor:     selected ? 'rgba(0,242,255,0.5)' : 'var(--alpha-border)',
                        backgroundColor: selected ? 'rgba(0,242,255,0.1)' : 'var(--alpha-bg)',
                        color:           selected ? 'var(--neon-cyan)' : 'var(--alpha-text)',
                        transform:       selected ? 'scale(1.01)' : 'scale(1)',
                      }}>
                      <Sparkles className="w-4 h-4 mb-2 opacity-60" />
                      {talent}
                    </button>
                  );
                })}
              </div>
              <div className="mt-10 flex justify-between items-center pt-6 border-t border-[var(--color-brand-100)]">
                <button onClick={() => setStep(0)} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] py-1">← Voltar</button>
                <button onClick={handleNextStep} disabled={hiddenTalents.length < 1}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    hiddenTalents.length >= 1
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] shadow-[var(--btn-shadow)] hover:opacity-90'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Próxima Etapa →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Chapéu de dono(a) ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-[var(--color-brand-500)]" />
                  <h3 className="font-bold text-xl text-[var(--text-main)]">No seu negócio, você é o(a) dono(a). Qual chapéu veste melhor?</h3>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Com tudo que você sabe fazer, qual função combina mais com você no dia a dia? Você será o CEO do seu negócio de uma pessoa só — o resto dá para delegar com o tempo.
                </p>
              </div>
              <div className="space-y-2 mb-auto">
                {CARGOS.map(c => {
                  const active = cargo === c.id;
                  return (
                    <button key={c.id} onClick={() => updatePhase('phase2', { cargo: c.id })}
                      className={cn('w-full text-left rounded-xl border p-3 flex items-start gap-3 transition-all',
                        active
                          ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)]'
                          : 'border-[var(--color-brand-200)] hover:border-[var(--color-brand-400)] bg-[rgba(255,255,255,0.03)]')}>
                      <div className={cn('w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center',
                        active ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-500)]' : 'border-[var(--color-brand-300)]')}>
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
              <div className="mt-10 flex justify-between items-center pt-6 border-t border-[var(--color-brand-100)]">
                <button onClick={() => setStep(1)} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] py-1">← Voltar</button>
                <button onClick={handleNextStep} disabled={!cargo}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    cargo
                      ? 'bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] text-white shadow-[var(--btn-shadow)] hover:opacity-90'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Concluir Fase 2 →
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
