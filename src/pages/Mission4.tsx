import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, GitMerge, Map } from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MissionWrapper } from '../components/MissionWrapper';

type RIASECType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

interface DuelOption {
  type: RIASECType;
  label: string;
  text: string;
  img: string;
}

interface Duel {
  id: string;
  A: DuelOption;
  B: DuelOption;
}

// 12 duelos: cada tipo RIASEC aparece exatamente 4 vezes
// R:1,2,3,4 | I:1,5,6,7 | A:2,5,8,9 | S:3,8,10,11 | E:6,9,10,12 | C:4,7,11,12
const DUELS: Duel[] = [
  {
    id: '1',
    A: {
      type: 'R', label: 'Experimentar',
      text: 'Colocar a mão na massa e testar na prática',
      img: '/questions/fase4-experimentar.jpeg',
    },
    B: {
      type: 'I', label: 'Investigar',
      text: 'Pesquisar fundo até entender o porquê das coisas',
      img: '/questions/fase4-investigar.jpeg',
    },
  },
  {
    id: '2',
    A: {
      type: 'A', label: 'Criar',
      text: 'Criar algo original a partir da imaginação',
      img: '/questions/fase4-criar.jpeg',
    },
    B: {
      type: 'R', label: 'Construir',
      text: 'Montar algo concreto com ferramentas e esforço',
      img: '/questions/fase4-construir.jpeg',
    },
  },
  {
    id: '3',
    A: {
      type: 'R', label: 'Trabalho físico',
      text: 'Trabalhar com o corpo, a terra e o espaço físico',
      img: '/questions/fase4-trabalho-fisico.jpeg',
    },
    B: {
      type: 'S', label: 'Com pessoas',
      text: 'Trabalhar rodeado de pessoas e conexões humanas',
      img: '/questions/fase4-com-pessoas.png',
    },
  },
  {
    id: '4',
    A: {
      type: 'R', label: 'Analógico',
      text: 'Operar máquinas, equipamentos e sistemas físicos',
      img: '/questions/fase4-analogico.jpeg',
    },
    B: {
      type: 'C', label: 'Digital',
      text: 'Gerenciar dados, processos e fluxos virtuais',
      img: '/questions/fase4-digital.jpeg',
    },
  },
  {
    id: '5',
    A: {
      type: 'I', label: 'Investigar',
      text: 'Descobrir verdades ocultas com curiosidade científica',
      img: '/questions/fase4-investigar.jpeg',
    },
    B: {
      type: 'A', label: 'Narrar',
      text: 'Criar narrativas e contar histórias que emocionam',
      img: '/questions/fase4-narrar.png',
    },
  },
  {
    id: '6',
    A: {
      type: 'I', label: 'Refletir',
      text: 'Pensar profundamente antes de qualquer decisão',
      img: '/questions/fase4-refletir.jpeg',
    },
    B: {
      type: 'E', label: 'Agir',
      text: 'Liderar e fazer as coisas acontecerem agora',
      img: '/questions/fase4-agir.jpeg',
    },
  },
  {
    id: '7',
    A: {
      type: 'I', label: 'Explorar',
      text: 'Explorar ideias complexas sem fronteiras definidas',
      img: '/questions/fase4-explorar.jpeg',
    },
    B: {
      type: 'C', label: 'Estruturar',
      text: 'Estruturar sistemas com regras claras e precisas',
      img: '/questions/fase4-estruturar.jpeg',
    },
  },
  {
    id: '8',
    A: {
      type: 'A', label: 'Autoexpressão',
      text: 'Se expressar de forma única, criativa e livre',
      img: '/questions/fase4-auto-expressao.jpeg',
    },
    B: {
      type: 'S', label: 'Conexão',
      text: 'Conectar, ensinar e apoiar outras pessoas',
      img: '/questions/fase4-conexao.jpeg',
    },
  },
  {
    id: '9',
    A: {
      type: 'A', label: 'Expressão',
      text: 'Criar arte, design ou música que toca as pessoas',
      img: '/questions/fase4-expressao.jpeg',
    },
    B: {
      type: 'E', label: 'Liderança',
      text: 'Persuadir, influenciar e liderar iniciativas',
      img: '/questions/fase4-lideranca.jpeg',
    },
  },
  {
    id: '10',
    A: {
      type: 'S', label: 'Cuidar',
      text: 'Cuidar do bem-estar e da saúde das pessoas',
      img: '/questions/fase4-cuidar.jpeg',
    },
    B: {
      type: 'E', label: 'Empreender',
      text: 'Criar e escalar um negócio do zero',
      img: '/questions/fase4-empreender.jpeg',
    },
  },
  {
    id: '11',
    A: {
      type: 'S', label: 'Colaborar',
      text: 'Trabalhar junto com outros em prol de um objetivo coletivo',
      img: '/questions/fase4-colaborar.jpeg',
    },
    B: {
      type: 'C', label: 'Organizar',
      text: 'Organizar fluxos, planilhas e procedimentos com rigor',
      img: '/questions/fase4-organizar.jpeg',
    },
  },
  {
    id: '12',
    A: {
      type: 'E', label: 'Inovar',
      text: 'Disruptar, criar o novo e assumir riscos calculados',
      img: '/questions/fase4-inovar.png',
    },
    B: {
      type: 'C', label: 'Preservar',
      text: 'Manter a excelência e a consistência dos sistemas',
      img: '/questions/fase4-preservar.jpeg',
    },
  },
];

const RIASEC: Record<RIASECType, { full: string; desc: string; color: string; icon: string; careers: string[] }> = {
  R: {
    full: 'Realista',
    desc: 'Você tem perfil prático e gosta de trabalhar com coisas concretas, ferramentas, máquinas e o mundo físico.',
    color: '#f97316',
    icon: '🔧',
    careers: ['Engenheiro', 'Arquiteto', 'Técnico Industrial', 'Atleta', 'Mecânico'],
  },
  I: {
    full: 'Investigativo',
    desc: 'Você adora investigar, analisar e resolver problemas complexos de forma intelectual e criativa.',
    color: '#8b5cf6',
    icon: '🔬',
    careers: ['Cientista', 'Pesquisador', 'Médico', 'Analista de Dados', 'Programador'],
  },
  A: {
    full: 'Artístico',
    desc: 'Você se expressa de forma criativa e original, trabalhando com emoções, ideias e imaginação.',
    color: '#ec4899',
    icon: '🎨',
    careers: ['Designer', 'Músico', 'Escritor', 'Cineasta', 'Arquiteto Criativo'],
  },
  S: {
    full: 'Social',
    desc: 'Você tem vocação para ajudar, ensinar e conectar pessoas — seu ambiente ideal é o coletivo.',
    color: '#22c55e',
    icon: '🤝',
    careers: ['Professor', 'Psicólogo', 'Assistente Social', 'Enfermeiro', 'Terapeuta'],
  },
  E: {
    full: 'Empreendedor',
    desc: 'Você lidera, persuade e faz as coisas acontecerem — seu terreno é a ação, a influência e o risco.',
    color: '#f59e0b',
    icon: '🚀',
    careers: ['Empresário', 'Gerente', 'Advogado', 'Vendedor', 'Produtor Executivo'],
  },
  C: {
    full: 'Convencional',
    desc: 'Você valoriza organização, precisão e consistência — seu talento está em estruturar e sistematizar.',
    color: '#06b6d4',
    icon: '📊',
    careers: ['Contador', 'Administrador', 'Auditor', 'Analista Financeiro', 'Gestor Operacional'],
  },
};

const ENVIRONMENTS = [
  'Laboratório', 'Estúdio Criativo', 'Hospital / Clínica',
  'Escritório Corporativo', 'Campo / Fazenda', 'Sala de Aula',
  'Palco / Bastidor', 'Startup / Coworking', 'Oficina / Indústria',
  'Tribunal', 'Comunidade / Rua', 'Universidade / Pesquisa'
];

const FORCED_CHOICES = [
  {
    id: 'impact_vs_peace',
    optionA: { id: 'impact', text: 'Alto Impacto + Caos', desc: 'Você trabalha em algo muito significativo, mas a rotina é imprevisível e exige muito.' },
    optionB: { id: 'peace', text: 'Paz Mental + Rotina', desc: 'Você tem estabilidade, horários claros e paz, mas sente falta de um desafio épico.' },
  },
  {
    id: 'leadership_vs_specialty',
    optionA: { id: 'leader', text: 'Líder / Gestor', desc: 'Toma decisões difíceis, guia o barco, mas lida com política e problemas humanos o dia todo.' },
    optionB: { id: 'specialist', text: 'Especialista Técnico', desc: 'É o melhor no que faz tecnicamente, mas tem menos poder de decisão sobre o projeto todo.' },
  }
];

export default function Mission4() {
  const navigate = useNavigate();
  const { state, updateMission, addXP, completeMission } = useApp();

  const sceneDuels = state.mission4?.sceneDuels || {};
  const environments = state.mission4?.environments || [];
  const forcedChoices = state.mission4?.forcedChoices || {};

  const isDuelsComplete = DUELS.every(d => sceneDuels[d.id]);

  const [step, setStep] = useState(() => {
    const m4 = state.mission4;
    if (!m4) return 0;
    const duelsOk = DUELS.every(d => m4.sceneDuels?.[d.id]);
    const envsOk = (m4.environments || []).length >= 2;
    const forcedOk = Object.keys(m4.forcedChoices || {}).length === FORCED_CHOICES.length;
    if (duelsOk && envsOk && forcedOk) return 3;
    if (duelsOk && envsOk) return 2;
    if (duelsOk) return 1;
    return 0;
  });

  const [currentDuelIndex, setCurrentDuelIndex] = useState(() => {
    const answered = state.mission4?.sceneDuels || {};
    const first = DUELS.findIndex(d => !answered[d.id]);
    return first === -1 ? DUELS.length - 1 : first;
  });

  const [selectedSide, setSelectedSide] = useState<'A' | 'B' | null>(null);

  const isForcedComplete = Object.keys(forcedChoices).length === FORCED_CHOICES.length;
  const answeredCount = Object.keys(sceneDuels).filter(k => DUELS.some(d => d.id === k)).length;

  const handleDuelSelect = (side: 'A' | 'B') => {
    if (selectedSide) return;
    const duel = DUELS[currentDuelIndex];
    const type = duel[side].type;
    setSelectedSide(side);
    const newDuels = { ...sceneDuels, [duel.id]: type };
    updateMission('mission4', { ...state.mission4, sceneDuels: newDuels });

    setTimeout(() => {
      if (currentDuelIndex < DUELS.length - 1) {
        setCurrentDuelIndex(prev => prev + 1);
        setSelectedSide(null);
      } else {
        setSelectedSide(null);
        setTimeout(() => setStep(1), 400);
      }
    }, 750);
  };

  const toggleEnvironment = (env: string) => {
    const newEnvs = environments.includes(env)
      ? environments.filter(e => e !== env)
      : [...environments, env];
    updateMission('mission4', { ...state.mission4, environments: newEnvs });
  };

  const handleForcedSelect = (choiceId: string, optionId: string) => {
    updateMission('mission4', { ...state.mission4, forcedChoices: { ...forcedChoices, [choiceId]: optionId } });
  };

  const handleNextStep = () => {
    if (step === 1 && environments.length >= 2) setStep(2);
    else if (step === 2 && isForcedComplete) {
      addXP(100);
      completeMission(4);
      setStep(3);
    }
  };

  // Compute RIASEC scores from answered duels
  const riasecScores = Object.values(sceneDuels).reduce((acc, type) => {
    const t = type as RIASECType;
    if (RIASEC[t]) acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Partial<Record<RIASECType, number>>);

  const topTypes = (Object.entries(riasecScores) as [RIASECType, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([t]) => t);

  const hollandCode = topTypes.join('');

  const previousSide: 'A' | 'B' | null = (() => {
    const duel = DUELS[currentDuelIndex];
    const savedType = sceneDuels[duel.id] as RIASECType | undefined;
    if (!savedType) return null;
    if (duel.A.type === savedType) return 'A';
    if (duel.B.type === savedType) return 'B';
    return null;
  })();

  return (
    <MissionWrapper
      videoTitle="Duelo de Mundos"
      videoDescription="Sem pensar demais — qual cenário te atrai? Suas escolhas visuais revelam seu perfil de interesses profissionais."
      videoId="missao4"
    >
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ─── STEP 0: Duel Carousel ─── */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col flex-grow"
            >
              {/* Progress bar */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-1 flex-1">
                  {DUELS.map((d, i) => (
                    <button
                      key={d.id}
                      onClick={() => { if (!selectedSide) { setCurrentDuelIndex(i); setSelectedSide(null); } }}
                      disabled={!!selectedSide}
                      title={sceneDuels[d.id] ? `Duelo ${i + 1} — respondido` : `Duelo ${i + 1}`}
                      className={cn(
                        'h-1.5 rounded-full flex-1 transition-all duration-500',
                        sceneDuels[d.id]
                          ? 'bg-[var(--neon-cyan)] hover:opacity-70'
                          : i === currentDuelIndex
                            ? 'bg-[var(--color-brand-400)]'
                            : 'bg-[var(--color-brand-100)] hover:bg-[var(--color-brand-200)]'
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-[var(--color-text-muted)] shrink-0">
                  {answeredCount} / {DUELS.length}
                </span>
              </div>

              {/* Question */}
              <div className="text-center mb-5">
                <p className="text-sm text-[var(--color-text-muted)] mb-2">
                  Sem pensar demais — qual cenário te atrai mais? Confie no seu instinto.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                  ● Escolha 1 cena em cada duelo — {DUELS.length} duelos no total
                </span>
              </div>

              {/* Duel cards */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDuelIndex}
                  initial={{ opacity: 0, scale: 0.96, x: 30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.96, x: -30 }}
                  transition={{ duration: 0.28 }}
                  className="relative flex gap-2 md:gap-4 h-[260px] md:h-[380px] mb-auto"
                >
                  {(['A', 'B'] as const).map(side => {
                    const opt = DUELS[currentDuelIndex][side];
                    const isChosen = selectedSide === side;
                    const isOther = selectedSide !== null && selectedSide !== side;
                    const isPrev = !selectedSide && previousSide === side;

                    return (
                      <button
                        key={side}
                        onClick={() => handleDuelSelect(side)}
                        disabled={!!selectedSide}
                        className={cn(
                          'relative flex-1 rounded-2xl overflow-hidden border-2 transition-all duration-400 text-left',
                          isChosen
                            ? 'border-[var(--neon-cyan)] shadow-[0_0_30px_rgba(0,242,255,0.45)] scale-[1.025] z-10'
                            : isOther
                              ? 'border-transparent opacity-40 grayscale scale-[0.975]'
                              : isPrev
                                ? 'border-[var(--neon-cyan)] opacity-80 hover:opacity-100 hover:scale-[1.01] cursor-pointer'
                                : 'border-[var(--color-brand-200)] hover:border-[var(--color-brand-400)] hover:scale-[1.01] cursor-pointer'
                        )}
                      >
                        <img
                          src={opt.img}
                          alt={opt.label}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        {/* Neon flash on select */}
                        {isChosen && (
                          <div className="absolute inset-0 bg-[var(--neon-cyan)]/15 animate-pulse" />
                        )}
                        {/* Text */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                          <div className="font-black text-white text-base md:text-lg mb-1 leading-tight drop-shadow-lg">
                            {opt.label}
                          </div>
                          <p className="text-white/75 text-xs md:text-sm leading-snug drop-shadow-md line-clamp-2">
                            {opt.text}
                          </p>
                        </div>
                        {/* Type badge */}
                        <div
                          className="absolute top-3 left-3 text-xs font-black px-2 py-0.5 rounded-full bg-black/60 border"
                          style={{ color: RIASEC[opt.type].color, borderColor: RIASEC[opt.type].color + '55' }}
                        >
                          {opt.type}
                        </div>
                        {/* Previously chosen indicator */}
                        {isPrev && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--neon-cyan)] flex items-center justify-center z-10 shadow-[0_0_8px_rgba(0,242,255,0.6)]">
                            <span className="text-black text-[10px] font-black">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}

                  {/* VS badge */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20
                                  bg-[var(--bg-dark)] border-2 border-[var(--neon-magenta)]
                                  rounded-full w-9 h-9 flex items-center justify-center
                                  text-[10px] font-black text-[var(--neon-magenta)] shadow-[0_0_12px_rgba(255,0,200,0.4)]
                                  pointer-events-none">
                    VS
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-5">
                <button
                  onClick={() => { setCurrentDuelIndex(prev => prev - 1); setSelectedSide(null); }}
                  disabled={currentDuelIndex === 0 || !!selectedSide}
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--glass)] disabled:opacity-25 disabled:pointer-events-none"
                >
                  ← Duelo anterior
                </button>
                <p className="text-xs text-[var(--color-text-muted)] font-mono">
                  Clique na cena que te atrai — sem pensar muito
                </p>
                <div className="w-[108px]" />
              </div>
            </motion.div>
          )}

          {/* ─── STEP 1: Environments ─── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col flex-grow"
            >
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-8 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[18px] mb-1">Afinidade por Ambiente</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed mb-2">
                    O local onde você passa suas 8 horas diárias importa. Escolha os ambientes onde você poderia trabalhar todos os dias e se sentir bem.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● Selecione pelo menos 2 ambientes
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-4 grid-cols-2 gap-4 mb-auto">
                {ENVIRONMENTS.map(env => {
                  const isSelected = environments.includes(env);
                  return (
                    <button
                      key={env}
                      onClick={() => toggleEnvironment(env)}
                      className={cn(
                        'p-5 rounded-xl border text-center transition-all font-medium',
                        isSelected
                          ? 'bg-[var(--color-brand-600)] border-[var(--color-brand-600)] text-[var(--bg-dark)] shadow-[var(--btn-shadow)] scale-[1.02]'
                          : 'bg-[var(--glass)] border-[var(--color-brand-100)] text-[var(--text-main)] hover:border-[var(--color-brand-300)]'
                      )}
                    >
                      {env}
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-between items-center pt-6 border-t border-[var(--color-brand-100)]">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => { setCurrentDuelIndex(0); setSelectedSide(null); setStep(0); }}
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] transition-colors text-left"
                  >
                    ← Refazer duelos
                  </button>
                  <span className="text-sm opacity-60 font-mono">{environments.length} ambientes escolhidos</span>
                </div>
                <button
                  onClick={handleNextStep}
                  disabled={environments.length < 2}
                  className={cn(
                    'px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    environments.length >= 2
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]'
                  )}
                >
                  Próxima Etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 2: Forced choices ─── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col flex-grow"
            >
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-8 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                  <GitMerge className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[18px] mb-1">Escolha Forçada</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed mb-2">
                    Não existe caminho perfeito. Quais dessas opções imperfeitas você estaria mais disposto a tolerar na sua carreira?
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● Escolha 1 opção em cada dilema
                  </span>
                </div>
              </div>

              <div className="space-y-6 mb-auto">
                {FORCED_CHOICES.map(choice => {
                  const selected = forcedChoices[choice.id];
                  return (
                    <div key={choice.id} className="grid grid-cols-2 gap-4">
                      {[choice.optionA, choice.optionB].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleForcedSelect(choice.id, opt.id)}
                          className={cn(
                            'p-6 rounded-xl border text-left transition-all h-full',
                            selected === opt.id
                              ? 'bg-[var(--color-brand-600)] border-[var(--color-brand-600)] text-[var(--bg-dark)] shadow-[var(--btn-shadow)] scale-[1.02]'
                              : 'bg-[var(--glass)] border-[var(--color-brand-100)] hover:border-[var(--color-brand-400)] text-[var(--text-main)]'
                          )}
                        >
                          <h4 className="font-bold text-lg mb-2">{opt.text}</h4>
                          <p className={cn('text-sm', selected === opt.id ? 'text-[rgba(0,0,0,0.7)]' : 'text-[var(--color-text-muted)]')}>
                            {opt.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-end pt-6 border-t border-[var(--color-brand-100)]">
                <button
                  onClick={handleNextStep}
                  disabled={!isForcedComplete}
                  className={cn(
                    'px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    isForcedComplete
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]'
                  )}
                >
                  Concluir Missão
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: RIASEC Result ─── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center flex-grow justify-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-6 shadow-[var(--btn-shadow)]">
                <Map className="w-10 h-10 text-[var(--neon-cyan)]" />
              </div>

              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-2 text-center">
                Seu Perfil RIASEC
              </h2>

              {hollandCode && (
                <div className="mb-4 px-5 py-2 rounded-full bg-[var(--glass)] border border-[var(--neon-cyan)]/40 font-mono font-black text-2xl tracking-[0.3em] text-[var(--neon-cyan)]">
                  {hollandCode}
                </div>
              )}

              <p className="text-[var(--color-text-muted)] max-w-md text-center leading-relaxed mb-8 text-sm">
                Seu Código Holland combina os três tipos de interesse dominantes.
                Quanto mais alinhada for sua carreira a esses tipos, maior tende a ser sua satisfação profissional.
              </p>

              {/* Top 3 type cards */}
              <div className="flex flex-col gap-4 w-full max-w-lg mb-8">
                {topTypes.map((type, idx) => {
                  const info = RIASEC[type];
                  const score = riasecScores[type] || 0;
                  return (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="bg-[var(--glass)] border rounded-xl p-5 flex items-start gap-4"
                      style={{ borderColor: info.color + '44' }}
                    >
                      <div
                        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black border-2"
                        style={{ borderColor: info.color, color: info.color, background: info.color + '18' }}
                      >
                        {idx === 0 ? '①' : idx === 1 ? '②' : '③'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{info.icon}</span>
                          <span className="font-black text-[var(--text-main)]" style={{ color: info.color }}>
                            {type} — {info.full}
                          </span>
                          <span className="ml-auto text-xs font-mono text-[var(--color-text-muted)]">
                            {score}/{DUELS.length}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] leading-snug mb-2">
                          {info.desc}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {info.careers.slice(0, 3).map(c => (
                            <span
                              key={c}
                              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                              style={{ background: info.color + '22', color: info.color }}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* All 6 scores mini bar */}
              <div className="w-full max-w-lg mb-10">
                <p className="text-xs font-mono text-[var(--color-text-muted)] mb-3 uppercase tracking-widest text-center">
                  Distribuição completa
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {(['R', 'I', 'A', 'S', 'E', 'C'] as RIASECType[]).map(t => {
                    const score = riasecScores[t] || 0;
                    const pct = (score / 4) * 100;
                    const info = RIASEC[t];
                    return (
                      <div key={t} className="flex flex-col items-center gap-1">
                        <div className="w-full bg-[var(--color-brand-100)] rounded-full h-16 relative overflow-hidden">
                          <div
                            className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-700"
                            style={{ height: `${pct}%`, background: info.color + 'cc' }}
                          />
                        </div>
                        <span className="text-xs font-black" style={{ color: info.color }}>{t}</span>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono">{score}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => navigate('/comecar/missao/5')}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform"
              >
                Avançar para Missão 05
              </button>

              <button
                onClick={() => { setCurrentDuelIndex(0); setSelectedSide(null); setStep(0); }}
                className="mt-4 text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] transition-colors px-4 py-2 rounded-lg hover:bg-[var(--glass)]"
              >
                ← Refazer duelos
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
