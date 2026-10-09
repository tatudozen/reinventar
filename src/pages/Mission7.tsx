import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, X, Heart, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../store';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { MissionWrapper } from '../components/MissionWrapper';

const ALL_ROLES = [
  'Arquiteta de Ecossistemas Virtuais', 'Engenheiro de IA Ética', 'Curadora de Memórias Digitais', 'Especialista em Longevidade', 
  'Psicólogo de Interações Humano-Máquina', 'Designer de Órgãos 3D', 'Advogado de Direitos Planetários', 'Chef de Gastronomia Sintética',
  'Piloto de Drones de Resgate', 'Educador de Algoritmos', 'Diretor de Narrativas Imersivas', 'Jornalista de Dados Climáticos',
  'Especialista em Cibersegurança Quântica', 'Veterinária de Espécies Ameaçadas', 'Astrônomo de Exoplanetas', 'Diplomata de Recursos Globais',
  'Engenheira de Mineração Espacial', 'Compositor de Trilhas Neurais', 'Fisioterapeuta Cibernético', 'Pesquisador de Energia Escura'
];

export default function Mission7() {
  const navigate = useNavigate();
  const { state, updateMission, addXP, completeMission } = useApp();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(0);
  
  const { saved, discarded } = state.mission7 || { saved: [], discarded: [] };

  const currentRole = ALL_ROLES[currentIndex];
  const remaining = ALL_ROLES.length - currentIndex;

  const handleAction = (action: 'save' | 'discard') => {
    if (action === 'save') {
      updateMission('mission7', { ...state.mission7, saved: [...saved, currentRole] });
    } else {
      updateMission('mission7', { ...state.mission7, discarded: [...discarded, currentRole] });
    }
    
    if (currentIndex < ALL_ROLES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (remaining === 1) {
      // Finished all cards
      setStep(1);
    }
  };

  const isComplete = step === 1;

  const handleFinish = () => {
    addXP(100);
    completeMission(7);
    navigate('/comecar/missao/8');
  };

  const handleSkipToFinish = () => {
    setStep(1);
  };

  return (
    <MissionWrapper videoTitle="O Garimpo" videoDescription="É hora de explorar profissões em alta. Rejeite as que não conectam, guarde as favoritas." videoId="missao7">
      <div className="flex flex-col min-h-[70vh]">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
            <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-8 flex items-start gap-4">
               <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                  <Filter className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="font-bold text-[18px] mb-1">A Peneira do Futuro</h3>
                 <p className="text-[var(--color-text-muted)] leading-relaxed mb-2">
                   Abaixo estão títulos profissionais especulativos. A cada carta, decida rápido: te atrai ou não? Siga seu instinto.
                 </p>
                 <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                   ● ♥ guardar ou ✕ descartar cada profissão
                 </span>
               </div>
            </div>

            <div className="text-center text-sm text-[var(--color-text-muted)] mb-4 font-mono uppercase tracking-widest flex items-center justify-center gap-4">
              <span>{remaining} cartas restantes</span>
              <span>-</span>
              <span className="text-[var(--color-brand-500)]">{saved.length} salvas</span>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center -mt-4">
              <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentRole}
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -50 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-[var(--glass)] border border-[var(--color-brand-300)] rounded-3xl w-full max-w-sm aspect-square flex flex-col items-center justify-center shadow-[var(--btn-shadow)] mb-12 relative overflow-hidden"
                  >
                    <Layers className="absolute top-4 right-4 w-12 h-12 text-[var(--color-brand-500)] opacity-10" />
                    <h2 className="font-serif text-3xl font-bold text-[var(--text-main)] text-center px-8 leading-tight z-10">
                      {currentRole}
                    </h2>
                    <div className="absolute bottom-8 w-24 h-1 bg-gradient-to-r from-transparent via-[var(--color-brand-400)] to-transparent opacity-50" />
                  </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-8 px-4 w-full max-w-sm justify-between">
                 <button
                   onClick={() => handleAction('discard')}
                   className="w-16 h-16 rounded-full bg-[var(--bg-dark)] border border-red-500/50 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all shadow-lg hover:scale-110"
                 >
                   <X className="w-8 h-8" />
                 </button>
                 <button
                   onClick={() => handleAction('save')}
                   className="w-16 h-16 rounded-full bg-[var(--bg-dark)] border border-[var(--color-brand-500)] flex items-center justify-center text-[var(--color-brand-500)] hover:bg-[var(--color-brand-500)] hover:text-[var(--bg-dark)] transition-all shadow-[var(--btn-shadow)] hover:scale-110"
                 >
                   <Heart className="w-8 h-8" />
                 </button>
              </div>
              
              <div className="text-xs text-[var(--color-text-muted)] font-mono mt-6 flex gap-12 uppercase tracking-widest opacity-60">
                 <span>← Descartar</span>
                 <span>Guardar →</span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center pt-6 border-t border-[var(--color-brand-100)]">
              <button
                onClick={handleSkipToFinish}
                className="px-6 py-2 rounded-xl text-sm font-mono text-[var(--color-text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass)] transition-all"
              >
                Pular Etapa de Cartas
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-grow justify-center py-10">
            <div className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)] text-[var(--neon-magenta)]">
              <Sparkles className="w-12 h-12" />
            </div>
            
            <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Coleção Analisada</h2>
            <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-10 leading-relaxed">
              Você guardou {saved.length} interesses e descartou {discarded.length}. Nossas aversões dizem tanto sobre nós quanto nossas paixões.
            </p>

            <button
              onClick={handleFinish}
              className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform flex items-center gap-2"
            >
              Avançar para Missão 08 <Sparkles className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </MissionWrapper>
  );
}

