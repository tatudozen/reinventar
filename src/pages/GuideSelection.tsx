import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Shield, Compass, Palette, Users, Target, CheckCircle2, Feather } from 'lucide-react';
import { useApp } from '../store';
import { cn } from '../lib/utils';
import type { Archetype } from '../store';

const GUIDES: {
  id: Archetype;
  name: string;
  essence: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  g0: string;
  g1: string;
}[] = [
  {
    id: 'sabio',
    name: 'O Sábio / A Sábia',
    essence: 'Calma e visão de longo prazo',
    desc: 'Você encontra sentido na reflexão, no conhecimento e na profundidade. Prefere compreender antes de agir.',
    icon: <Brain className="w-7 h-7" />,
    color: '#d4af37',
    g0: '#1a1500', g1: '#3d3000',
  },
  {
    id: 'guardiao',
    name: 'O Guardião / A Guardiã',
    essence: 'Presença e proteção do que importa',
    desc: 'Você cuida, preserva e mantém vivo o que é essencial — pessoas, memórias, valores e laços.',
    icon: <Shield className="w-7 h-7" />,
    color: '#33ccff',
    g0: '#001a2e', g1: '#003d5c',
  },
  {
    id: 'explorador',
    name: 'O Explorador / A Exploradora',
    essence: 'Curiosidade e descoberta contínua',
    desc: 'Você ainda quer conhecer lugares, ideias e pessoas novas. Para você, parar de aprender é parar de viver.',
    icon: <Compass className="w-7 h-7" />,
    color: '#ffcc00',
    g0: '#1a1400', g1: '#3d3000',
  },
  {
    id: 'criador',
    name: 'O Criador / A Criadora',
    essence: 'Expressão e manifestação de ideias',
    desc: 'Você se realiza criando — seja com as mãos, com palavras, com imagens ou com projetos que antes não existiam.',
    icon: <Palette className="w-7 h-7" />,
    color: '#c084fc',
    g0: '#1a0033', g1: '#3d0066',
  },
  {
    id: 'conector',
    name: 'O Conector / A Conectora',
    essence: 'Relações, pontes e comunidade',
    desc: 'Seu maior talento é unir pessoas. Você cria redes, apresenta quem precisa se conhecer e constrói comunidade.',
    icon: <Users className="w-7 h-7" />,
    color: '#34d399',
    g0: '#001a0e', g1: '#003d1f',
  },
  {
    id: 'realizador',
    name: 'O Realizador / A Realizadora',
    essence: 'Ação, execução e projetos concretos',
    desc: 'Você se sente vivo quando faz acontecer. Planos saindo do papel, resultados concretos, entregas reais.',
    icon: <Target className="w-7 h-7" />,
    color: '#fb923c',
    g0: '#1a0a00', g1: '#3d1500',
  },
];

const INTENTIONS = [
  'Responderei com sinceridade, não com o que acho que é certo.',
  'Minha experiência de vida é um ativo — não um peso.',
  'Este é um momento só meu, sem pressa e sem julgamento.',
];

export default function GuideSelection() {
  const navigate = useNavigate();
  const { setGuide, addXP } = useApp();

  const [step, setStep] = useState(0);
  const [selectedId, setSelectedId] = useState<Archetype | null>(null);
  const [accepted, setAccepted] = useState<number[]>([]);

  const selectedGuide = GUIDES.find(g => g.id === selectedId);

  const toggleIntention = (idx: number) => {
    setAccepted(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleConfirmGuide = () => {
    if (!selectedId) return;
    setGuide(selectedId);
    setStep(1);
  };

  const handleStart = () => {
    if (accepted.length !== INTENTIONS.length) return;
    addXP(50);
    navigate('/comecar/fase/1');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <AnimatePresence mode="wait">

        {/* ── Step 0: Seleção do Guia ── */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-brand-800)] mb-3">
                Escolha seu Guia de Jornada
              </h1>
              <p className="text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
                Cada guia representa uma forma de olhar para este momento da vida.
                Escolha o que mais ressoa com quem você é agora.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {GUIDES.map(guide => {
                const isSelected = selectedId === guide.id;
                return (
                  <button
                    key={guide.id}
                    onClick={() => setSelectedId(guide.id)}
                    className={cn(
                      'text-left rounded-2xl border-2 p-5 transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2',
                      isSelected
                        ? 'border-[var(--color-brand-500)] bg-[var(--glass)] scale-[1.02] shadow-lg'
                        : 'border-white/10 bg-[var(--glass)] hover:border-white/25 hover:scale-[1.01]'
                    )}
                    style={isSelected ? { boxShadow: `0 0 20px ${guide.color}33` } : {}}
                  >
                    {/* Ícone + nome */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${guide.g0}, ${guide.g1})`,
                          color: guide.color,
                          border: `1px solid ${guide.color}44`,
                        }}
                      >
                        {guide.icon}
                      </div>
                      <div>
                        <p
                          className="text-[10px] font-mono tracking-widest uppercase mb-0.5"
                          style={{ color: guide.color }}
                        >
                          {guide.essence}
                        </p>
                        <h3 className="font-bold text-[var(--text-main)] text-base leading-tight">
                          {guide.name}
                        </h3>
                      </div>
                    </div>

                    {/* Descrição */}
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {guide.desc}
                    </p>

                    {/* Indicador de seleção */}
                    {isSelected && (
                      <div
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${guide.color}22`,
                          color: guide.color,
                          border: `1px solid ${guide.color}55`,
                        }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selecionado
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="text-center">
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: selectedId ? 1 : 0.3, y: 0 }}
                disabled={!selectedId}
                onClick={handleConfirmGuide}
                className="px-10 py-4 rounded-xl font-bold uppercase tracking-wider text-[var(--bg-dark)] bg-[var(--color-brand-600)] hover:opacity-90 transition-all disabled:pointer-events-none disabled:opacity-30"
                style={selectedGuide ? { boxShadow: `0 4px 20px ${selectedGuide.color}44` } : {}}
              >
                Confirmar Guia
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── Step 1: Intenções de Jornada ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
          >
            <div className="max-w-lg mx-auto rounded-2xl border border-[var(--color-brand-200)] bg-[var(--glass)] backdrop-blur-xl p-8 md:p-10 relative overflow-hidden">

              {/* Ícone decorativo */}
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Feather className="w-24 h-24 text-[var(--color-brand-500)]" />
              </div>

              {/* Guia escolhido */}
              {selectedGuide && (
                <div
                  className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full mb-6"
                  style={{
                    backgroundColor: `${selectedGuide.color}18`,
                    color: selectedGuide.color,
                    border: `1px solid ${selectedGuide.color}44`,
                  }}
                >
                  {selectedGuide.icon}
                  {selectedGuide.name}
                </div>
              )}

              <h2 className="text-2xl md:text-3xl font-serif text-[var(--text-main)] mb-2">
                Intenções de Jornada
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] mb-8 leading-relaxed">
                Antes de começar, confirme estas três intenções. Elas vão orientar a qualidade das suas respostas.
              </p>

              <div className="flex flex-col gap-5 mb-10">
                {INTENTIONS.map((intention, i) => {
                  const isChecked = accepted.includes(i);
                  return (
                    <div
                      key={i}
                      onClick={() => toggleIntention(i)}
                      className="flex items-start gap-4 cursor-pointer group"
                    >
                      <div
                        className={cn(
                          'mt-0.5 w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg border-2 transition-all',
                          isChecked
                            ? 'bg-[var(--color-brand-600)] border-[var(--color-brand-600)]'
                            : 'border-[var(--color-brand-300)] group-hover:border-[var(--color-brand-500)]'
                        )}
                      >
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-[var(--bg-dark)]" />}
                      </div>
                      <p
                        className={cn(
                          'text-base md:text-lg leading-snug transition-colors',
                          isChecked
                            ? 'text-[var(--text-main)] font-medium'
                            : 'text-[var(--color-text-muted)] group-hover:text-[var(--text-main)]'
                        )}
                      >
                        {intention}
                      </p>
                    </div>
                  );
                })}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: accepted.length === INTENTIONS.length ? 1 : 0.3 }}
                disabled={accepted.length !== INTENTIONS.length}
                onClick={handleStart}
                className="w-full bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-[1.02] transition-all disabled:pointer-events-none"
              >
                Começar minha Jornada
              </motion.button>

              <button
                onClick={() => setStep(0)}
                className="w-full mt-3 text-sm text-[var(--color-text-muted)] hover:text-[var(--text-main)] transition-colors py-2"
              >
                ← Trocar guia
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
