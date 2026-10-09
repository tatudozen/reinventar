import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Rocket, Eye, Cpu } from 'lucide-react';
import { useApp } from '../store';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { MissionWrapper } from '../components/MissionWrapper';

const ARCHETYPES = [
  { id: 'builder', title: 'A Construtora / O Construtor', desc: 'Engenharia, Programação, Arquitetura. Foco em criar coisas que funcionam do zero.', icon: '🏗️' },
  { id: 'optimizer', title: 'O Otimizador', desc: 'Dados, Finanças, Logística. Foco em eficiência, escalar e fazer o sistema render.', icon: '📈' },
  { id: 'caregiver', title: 'O Cuidador', desc: 'Saúde, Psicologia, Ensino. Foco em curar, desenvolver mentes e apoiar a vida.', icon: '❤️' },
  { id: 'creator', title: 'O Criativo', desc: 'Design, Arte, Marketing, Mídia. Foco em estética, narrativas e provocar emoções.', icon: '🎨' },
  { id: 'explorer', title: 'A Exploradora / O Pesquisador', desc: 'Ciência, Inovação Radical, Academia. Foco no desconhecido e na verdade.', icon: '🔭' },
  { id: 'maestro', title: 'O Maestro', desc: 'Gestão, Política, Empreendedorismo. Foco em orquestrar pessoas para uma visão.', icon: '👑' },
];

const PREDEFINED_PROBLEMS = [
  { id: 'aquecimento', text: 'Aquecimento Global', image: 'https://picsum.photos/seed/aquecimento/400/300' },
  { id: 'pobreza', text: 'Pobreza Extrema e Fome', image: 'https://picsum.photos/seed/pobreza/400/300' },
  { id: 'mobilidade', text: 'Mobilidade e Trânsito', image: 'https://picsum.photos/seed/mobilidade/400/300' },
  { id: 'saude_idosos', text: 'Saúde na Velhice', image: 'https://picsum.photos/seed/idosos/400/300' },
  { id: 'saude_mental', text: 'Saúde Mental', image: 'https://picsum.photos/seed/mente/400/300' },
  { id: 'educacao', text: 'Desigualdade na Educação', image: 'https://picsum.photos/seed/escola/400/300' },
];

const PREDEFINED_SOLUTIONS = [
  { id: 'ai', text: 'Inteligência Artificial & Dados', image: 'https://picsum.photos/seed/ia/400/300' },
  { id: 'bio', text: 'Biotecnologia & Saúde', image: 'https://picsum.photos/seed/bio/400/300' },
  { id: 'edu', text: 'Educação Imersiva (VR/AR)', image: 'https://picsum.photos/seed/edu/400/300' },
  { id: 'energia', text: 'Energias Renováveis', image: 'https://picsum.photos/seed/energia/400/300' },
  { id: 'social', text: 'Políticas Públicas Sociais', image: 'https://picsum.photos/seed/social/400/300' },
  { id: 'art', text: 'Arte e Mídia de Conscientização', image: 'https://picsum.photos/seed/arte/400/300' },
];

export default function Mission6() {
  const navigate = useNavigate();
  const { state, updateMission, addXP, completeMission } = useApp();
  
  const [step, setStep] = useState(0);
  
  const selectedArchetypes = state.mission6?.selectedArchetypes || [];
  const futureVision = state.mission6?.futureVision || {};
  const ultimateRole = state.mission6?.ultimateRole || '';

  const toggleArchetype = (id: string) => {
    const newSel = selectedArchetypes.includes(id)
      ? selectedArchetypes.filter(a => a !== id)
      : [...selectedArchetypes, id];
    updateMission('mission6', { ...state.mission6, selectedArchetypes: newSel });
  };

  const handleVisionChange = (updates: Record<string, string>) => {
    updateMission('mission6', { 
      ...state.mission6, 
      futureVision: { ...futureVision, ...updates } 
    });
  };

  const setUltimateRole = (val: string) => {
    updateMission('mission6', { ...state.mission6, ultimateRole: val });
  };

  const handleNextStep = () => {
    if (step === 0 && selectedArchetypes.length >= 1 && selectedArchetypes.length <= 2) setStep(1);
    else if (step === 1 && futureVision.q1?.length > 5 && futureVision.q2?.length > 5) {
      setStep(2);
      addXP(100);
      completeMission(6);
    }
  };

  return (
    <MissionWrapper videoTitle="O Arquétipo" videoDescription="É hora de conectar quem você é no núcleo ao problema que deseja resolver e às tecnologias do futuro." videoId="missao6">
      <div className="flex flex-col min-h-[70vh]">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
            <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-8 flex items-start gap-4">
              <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] mb-1">Cargos Morrem, Arquétipos Ficam</h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed mb-2">
                  Profissões do futuro ainda nem têm nome, mas os papéis fundamentais sempre existirão. Escolha o(s) arquétipo(s) que mais combinam com você.
                  {selectedArchetypes.length >= 2 && <span className="block mt-1 text-[var(--neon-cyan)] animate-pulse">Desmarque um para escolher outro.</span>}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                  ● Selecione 1 ou 2 arquétipos
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-auto">
              {ARCHETYPES.map(arch => {
                const isSelected = selectedArchetypes.includes(arch.id);
                const disabled = !isSelected && selectedArchetypes.length >= 2;
                
                return (
                  <button
                    key={arch.id}
                    onClick={() => toggleArchetype(arch.id)}
                    disabled={disabled}
                    className={cn(
                      "p-6 rounded-xl border text-left transition-all",
                      isSelected 
                        ? "bg-[var(--color-brand-600)] border-[var(--color-brand-600)] text-[var(--bg-dark)] shadow-[var(--btn-shadow)] scale-[1.02]"
                        : "bg-[var(--glass)] border-[var(--color-brand-100)] text-[var(--text-main)] hover:border-[var(--color-brand-300)]",
                      disabled && "opacity-40 grayscale cursor-not-allowed hover:border-[var(--color-brand-100)]"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-2xl">{arch.icon}</span>
                       <h4 className="font-bold text-lg">{arch.title}</h4>
                    </div>
                    <p className={cn("text-sm", isSelected ? "text-[rgba(0,0,0,0.7)]" : "text-[var(--color-text-muted)]")}>{arch.desc}</p>
                  </button>
                )
              })}
            </div>

            <div className="mt-12 flex justify-between items-center pt-6 border-t border-[var(--color-brand-100)]">
              <span className="text-sm opacity-60 font-mono">{selectedArchetypes.length}/2 arquétipos</span>
              <button
                onClick={handleNextStep}
                disabled={selectedArchetypes.length === 0}
                className={cn(
                  "px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all",
                  selectedArchetypes.length > 0
                    ? "bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]"
                    : "bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]"
                )}
              >
                Próxima Etapa
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
            <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-8 flex items-start gap-4">
              <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] mb-1">Visão de Futuro</h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed mb-2">
                  Conecte seu arquétipo ao problema que você escolheu na Missão 3. Que tecnologia ou conhecimento você usaria para resolvê-lo?
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                  ● Selecione 1 tecnologia ou abordagem
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-8 mb-auto max-w-5xl mx-auto w-full">
              {/* Equation Visualization: Archetypes + Tech = Problem */}
              <div className="flex flex-col md:flex-row gap-4 mb-2 items-stretch justify-center">
                 <div className="flex-1 bg-[var(--bg-dark)] border border-[var(--color-brand-300)] p-4 rounded-xl flex items-center justify-center flex-col text-center shadow-[var(--btn-shadow)] relative min-h-[160px]">
                    <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold absolute top-3">Seus Arquétipos</span>
                    <div className="flex gap-4 mt-6">
                      {selectedArchetypes.map((id: string) => {
                        const arch = ARCHETYPES.find(a => a.id === id);
                        return arch ? (
                          <div key={id} className="flex flex-col items-center">
                            <span className="text-3xl mb-1">{arch.icon}</span>
                            <span className="text-[11px] font-bold text-[var(--text-main)] w-20 leading-tight">{arch.title}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                 </div>

                 <div className="flex items-center justify-center opacity-70 px-1">
                    <span className="text-4xl font-mono text-[var(--neon-cyan)]">+</span>
                 </div>

                 <div className={cn(
                   "flex-1 bg-[var(--bg-dark)] border-2 p-4 rounded-xl flex items-center justify-center flex-col text-center transition-all relative min-h-[160px] overflow-hidden",
                   futureVision.q2 ? "border-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,242,255,0.2)]" : "border-[var(--color-brand-300)] opacity-60 border-dashed"
                 )}>
                    <span className="text-xs uppercase tracking-widest font-bold drop-shadow-md absolute top-3 z-10 w-full bg-[var(--bg-dark)]/90 py-1 text-[var(--neon-cyan)]">Sua Tecnologia</span>
                    {futureVision.q2 ? (
                       <div className="flex flex-col items-center justify-center h-full pt-6">
                          <Cpu className="w-8 h-8 text-[var(--neon-cyan)] mb-2" />
                          <span className="text-xs font-bold text-[var(--text-main)] max-w-[120px] leading-tight">{futureVision.q2}</span>
                       </div>
                    ) : (
                       <div className="flex flex-col items-center justify-center h-full pt-6 opacity-30">
                          <Cpu className="w-8 h-8 mb-2" />
                          <span className="text-[10px] uppercase tracking-widest">Selecione<br/>Abaixo</span>
                       </div>
                    )}
                 </div>

                 <div className="flex items-center justify-center opacity-70 px-1">
                    <span className="text-4xl font-mono text-[var(--neon-magenta)]">=</span>
                 </div>

                 <div className="flex-1 bg-[var(--bg-dark)] border border-[var(--color-brand-300)] rounded-xl flex items-center justify-center flex-col text-center shadow-[var(--btn-shadow)] relative min-h-[160px] overflow-hidden">
                    <span className="text-xs uppercase tracking-widest text-white/90 font-bold drop-shadow-md absolute top-3 z-10 w-full bg-black/50 py-1">O Problema</span>
                    {(() => {
                       const probText = state.mission3?.uniqueProblem;
                       const prob = PREDEFINED_PROBLEMS.find(p => p.text === probText) || PREDEFINED_PROBLEMS[0];
                       return (
                         <div className="absolute inset-0 flex items-center justify-center mt-6">
                           <div className="absolute inset-0 opacity-40 grayscale blur-[1px]">
                             <img src={prob.image} alt="Problema" className="w-full h-full object-cover" />
                           </div>
                           <div className="z-10 bg-black/40 backdrop-blur-sm p-2 rounded-lg mt-2 mx-2">
                             <h4 className="text-white font-serif text-[14px] leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">{prob.text}</h4>
                           </div>
                         </div>
                       );
                    })()}
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-[var(--neon-cyan)] mt-6 mb-4 text-center border-b border-[var(--color-brand-200)/30] pb-2">
                  Que Conhecimento ou Tecnologia seus arquétipos vão usar para resolver isso?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {PREDEFINED_SOLUTIONS.map(sol => {
                    const isSelected = futureVision.q2 === sol.text;
                    return (
                      <div
                        key={sol.id}
                        onClick={() => {
                          handleVisionChange({
                            'q2': sol.text,
                            'q1': `Conectando os meus arquétipos à necessidade de ${sol.text}`
                          });
                        }}
                        className={cn(
                          "rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 group relative bg-[var(--bg-dark)]",
                          isSelected 
                            ? "border-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,242,255,0.3)] scale-[1.03]" 
                            : "border-[var(--color-brand-200)] hover:border-[var(--color-brand-400)] grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
                        )}
                      >
                        <div className="aspect-[16/7] w-full relative">
                          <img src={sol.image} alt={sol.text} className="w-full h-full object-cover opacity-60" />
                          <div className={cn(
                            "absolute inset-0 bg-gradient-to-t from-[var(--bg-dark)] to-transparent",
                            isSelected ? "opacity-100" : "opacity-80"
                          )} />
                        </div>
                        <div className="p-3 absolute bottom-0 left-0 right-0 flex items-center justify-center">
                          <h4 className="text-[var(--text-main)] font-bold text-center text-[13px] leading-tight drop-shadow-md">{sol.text}</h4>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-between items-center pt-6 border-t border-[var(--color-brand-100)]">
              <span className="text-sm opacity-60 font-mono">Reflexão Profunda</span>
              <button
                onClick={handleNextStep}
                disabled={!futureVision.q1 || futureVision.q1.length <= 5 || !futureVision.q2 || futureVision.q2.length <= 5}
                className={cn(
                  "px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all",
                  futureVision.q1?.length > 5 && futureVision.q2?.length > 5
                    ? "bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]"
                    : "bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]"
                )}
              >
                Próxima Etapa
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-grow justify-center py-10">
            <div className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)]">
              <Rocket className="w-12 h-12 text-[var(--neon-cyan)]" />
            </div>
            
            <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Arquétipos Sintetizados</h2>
            <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-10 leading-relaxed">
              Você transpôs a barreira dos moldes tradicionais e combinou quem você é com as necessidades do mundo e o poder da tecnologia. A sua função no mundo está cada vez mais clara.
            </p>

            <button
              onClick={() => navigate('/comecar/missao/7')}
              className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform"
            >
              Avançar para Missão 07
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </MissionWrapper>
  );
}

