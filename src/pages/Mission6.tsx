import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Wifi, Heart, Sparkles } from 'lucide-react';
import { useApp } from '../store';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { MissionWrapper } from '../components/MissionWrapper';

const WHO_OPTIONS = [
  { id: 'jovens',        label: 'Crianças e jovens',               emoji: '🧒' },
  { id: 'adultos',       label: 'Adultos em transição',            emoji: '🔄' },
  { id: 'pares',         label: 'Pessoas da minha geração (55+)',  emoji: '🤝' },
  { id: 'idosos',        label: 'Idosos (75+)',                    emoji: '👴' },
  { id: 'familia',       label: 'Minha família',                   emoji: '🏠' },
  { id: 'comunidade',    label: 'Minha comunidade local',          emoji: '🏘️' },
  { id: 'vulneraveis',   label: 'Grupos vulneráveis',              emoji: '🫂' },
  { id: 'profissionais', label: 'Profissionais da minha área',     emoji: '💼' },
  { id: 'estudantes',    label: 'Estudantes e aprendizes',         emoji: '📖' },
  { id: 'cuidadores',    label: 'Cuidadores e famílias',           emoji: '❤️‍🩹' },
];

const HOW_OPTIONS = [
  { id: 'presencial',    label: 'Presencialmente',                 emoji: '🤲' },
  { id: 'online',        label: 'Online / Digital',                emoji: '💻' },
  { id: 'grupos',        label: 'Em grupos e encontros',           emoji: '👥' },
  { id: 'individual',    label: 'Um a um (1:1)',                   emoji: '🫀' },
  { id: 'escrito',       label: 'Por escrito (blog, livro, cartas)', emoji: '✍️' },
  { id: 'arte',          label: 'Através da arte / expressão',     emoji: '🎨' },
  { id: 'sistema',       label: 'Indiretamente (impacto em sistemas)', emoji: '⚙️' },
  { id: 'eventos',       label: 'Em eventos e palestras',          emoji: '🎤' },
];

export default function Mission6() {
  const navigate  = useNavigate();
  const { state, updatePhase, completePhase, addXP } = useApp();

  const connections: string[] = state.phase6.connections ?? [];
  const modes: string[]       = state.phase6.modes       ?? [];
  const intention: string     = state.phase6.intention   ?? '';

  const [step, setStep] = useState(() => {
    if (connections.length > 0 && modes.length > 0 && intention.length > 5) return 3;
    if (connections.length > 0 && modes.length > 0) return 2;
    if (connections.length > 0) return 1;
    return 0;
  });

  const toggleConnection = (id: string) => {
    const next = connections.includes(id)
      ? connections.filter(c => c !== id)
      : [...connections, id];
    updatePhase('phase6', { connections: next });
  };

  const toggleMode = (id: string) => {
    const next = modes.includes(id)
      ? modes.filter(m => m !== id)
      : [...modes, id];
    updatePhase('phase6', { modes: next });
  };

  const handleFinish = () => {
    addXP(100);
    completePhase(6);
    setStep(3);
  };

  return (
    <MissionWrapper
      videoTitle="Conexões que Importam"
      videoDescription="Com quem você quer estar e como quer se conectar na próxima fase da sua vida?"
      videoId="fase6"
    >
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── Step 0: Quem você quer impactar ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-5 mb-6 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Quem você quer impactar?</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-2">
                    As conexões que cultivamos moldam quem nos tornamos. Quais grupos de pessoas você quer ter na sua vida e no seu trabalho nesta próxima fase?
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● Selecione 2 ou mais
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6 flex-grow">
                {WHO_OPTIONS.map(opt => {
                  const active = connections.includes(opt.id);
                  return (
                    <button key={opt.id} onClick={() => toggleConnection(opt.id)}
                      className={cn('p-4 rounded-xl border text-left transition-all flex items-center gap-3',
                        active
                          ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)] scale-[1.02]'
                          : 'border-white/10 bg-[var(--glass)] hover:border-white/25')}>
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <span className={cn('text-sm font-medium leading-tight', active ? 'text-[var(--text-main)]' : 'text-[var(--color-text-muted)]')}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[var(--color-brand-100)]">
                <span className="text-sm font-mono opacity-60">{connections.length} selecionados</span>
                <button onClick={() => setStep(1)} disabled={connections.length < 2}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    connections.length >= 2
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Próxima Etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 1: Como prefere se conectar ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-5 mb-6 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0">
                  <Wifi className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Como prefere se conectar?</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-2">
                    O formato das conexões importa tanto quanto as pessoas. Como você se sente mais vivo ao interagir?
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● Selecione 1 ou mais formatos
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6 flex-grow">
                {HOW_OPTIONS.map(opt => {
                  const active = modes.includes(opt.id);
                  return (
                    <button key={opt.id} onClick={() => toggleMode(opt.id)}
                      className={cn('p-4 rounded-xl border text-left transition-all flex items-center gap-3',
                        active
                          ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)] scale-[1.02]'
                          : 'border-white/10 bg-[var(--glass)] hover:border-white/25')}>
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <span className={cn('text-sm font-medium leading-tight', active ? 'text-[var(--text-main)]' : 'text-[var(--color-text-muted)]')}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[var(--color-brand-100)]">
                <button onClick={() => setStep(0)} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] py-1">
                  ← Voltar
                </button>
                <button onClick={() => setStep(2)} disabled={modes.length === 0}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    modes.length > 0
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Próxima Etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Intenção de relação ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-5 mb-6 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">A relação que quer cultivar</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                    Nesta fase da vida, qual relação você quer cultivar com mais intenção — e o que isso exigirá de você?
                  </p>
                </div>
              </div>

              <div className="flex-grow flex flex-col">
                <textarea
                  value={intention}
                  onChange={e => updatePhase('phase6', { intention: e.target.value })}
                  placeholder="Ex: Quero cultivar uma relação de mentoria com jovens da minha área. Isso exige que eu crie espaço na minha agenda e aprenda a escutar mais do que falar..."
                  rows={7}
                  className="w-full rounded-xl border border-[var(--color-brand-200)] bg-[var(--glass)] text-[var(--text-main)] p-4 text-sm leading-relaxed placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-brand-500)] resize-none flex-grow"
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-2 text-right font-mono">
                  {intention.length} caracteres
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[var(--color-brand-100)]">
                <button onClick={() => setStep(1)} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] py-1">
                  ← Voltar
                </button>
                <button onClick={handleFinish} disabled={intention.length < 10}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    intention.length >= 10
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Concluir Fase →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Conclusão ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-grow justify-center py-10">
              <div className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)]">
                <Sparkles className="w-12 h-12 text-[var(--neon-cyan)]" />
              </div>
              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Conexões Mapeadas</h2>
              <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-10 leading-relaxed">
                Saber com quem e como você quer se conectar é o primeiro passo para construir relações verdadeiras. O próximo capítulo já começa a tomar forma.
              </p>

              {/* Resumo */}
              <div className="w-full max-w-md space-y-4 mb-10">
                {connections.length > 0 && (
                  <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Quem você quer impactar</p>
                    <div className="flex flex-wrap gap-1.5">
                      {connections.map(id => {
                        const opt = WHO_OPTIONS.find(o => o.id === id);
                        return opt ? (
                          <span key={id} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)] font-medium">
                            {opt.emoji} {opt.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                {modes.length > 0 && (
                  <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Como prefere se conectar</p>
                    <div className="flex flex-wrap gap-1.5">
                      {modes.map(id => {
                        const opt = HOW_OPTIONS.find(o => o.id === id);
                        return opt ? (
                          <span key={id} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)] font-medium">
                            {opt.emoji} {opt.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => navigate('/comecar/fase/7')}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform">
                Avançar para Fase 7 →
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
