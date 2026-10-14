import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Feather } from 'lucide-react';
import { useApp } from '../store';
import { cn } from '../lib/utils';

const INTENTIONS = [
  'Responderei com sinceridade, não com o que acho que é certo.',
  'Minha experiência de vida é um ativo — não um peso.',
  'Este é um momento só meu, sem pressa e sem julgamento.',
];

export default function GuideSelection() {
  const navigate = useNavigate();
  const { setGuide, addXP } = useApp();
  const [accepted, setAccepted] = useState<number[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setGuide('explorador'); }, []);

  const toggle = (idx: number) =>
    setAccepted(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);

  const handleStart = () => {
    if (accepted.length !== INTENTIONS.length) return;
    addXP(50);
    navigate('/comecar/fase/1');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <div className="max-w-lg mx-auto rounded-2xl border border-[var(--color-brand-200)] bg-[var(--glass)] backdrop-blur-xl p-8 md:p-10 relative overflow-hidden">

        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Feather className="w-24 h-24 text-[var(--color-brand-500)]" />
        </div>

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
              <div key={i} onClick={() => toggle(i)} className="flex items-start gap-4 cursor-pointer group">
                <div className={cn(
                  'mt-0.5 w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg border-2 transition-all',
                  isChecked
                    ? 'bg-[var(--color-brand-600)] border-[var(--color-brand-600)]'
                    : 'border-[var(--color-brand-300)] group-hover:border-[var(--color-brand-500)]',
                )}>
                  {isChecked && <CheckCircle2 className="w-4 h-4 text-[var(--bg-dark)]" />}
                </div>
                <p className={cn(
                  'text-base md:text-lg leading-snug transition-colors',
                  isChecked
                    ? 'text-[var(--text-main)] font-medium'
                    : 'text-[var(--color-text-muted)] group-hover:text-[var(--text-main)]',
                )}>
                  {intention}
                </p>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleStart}
          disabled={accepted.length !== INTENTIONS.length}
          className={cn(
            'w-full bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-[1.02] transition-all',
            accepted.length === INTENTIONS.length ? 'opacity-100' : 'opacity-30 cursor-not-allowed pointer-events-none',
          )}
        >
          Começar minha Jornada
        </button>
      </div>
    </div>
  );
}
