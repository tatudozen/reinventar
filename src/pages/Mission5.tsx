import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, Wifi } from 'lucide-react';
import { useApp } from '../store';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { MissionWrapper } from '../components/MissionWrapper';

// Quem o seu negócio serve (o público — pode ou não ser quem paga)
const WHO_OPTIONS = [
  { id: 'jovens',        label: 'Crianças e jovens',               emoji: '🧒' },
  { id: 'adultos',       label: 'Adultos em transição',            emoji: '🔄' },
  { id: 'pares',         label: 'Pessoas da minha geração (55+)',  emoji: '🤝' },
  { id: 'idosos',        label: 'Idosos (75+)',                    emoji: '👴' },
  { id: 'familia',       label: 'Famílias',                        emoji: '🏠' },
  { id: 'comunidade',    label: 'Minha comunidade local',          emoji: '🏘️' },
  { id: 'vulneraveis',   label: 'Grupos vulneráveis',              emoji: '🫂' },
  { id: 'profissionais', label: 'Profissionais da minha área',     emoji: '💼' },
  { id: 'estudantes',    label: 'Estudantes e aprendizes',         emoji: '📖' },
  { id: 'cuidadores',    label: 'Cuidadores e famílias',           emoji: '❤️‍🩹' },
];

// Como o seu negócio entrega valor
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

type Step = 'who' | 'how' | 'done';

export default function Mission5() {
  const navigate  = useNavigate();
  const { state, updatePhase, completePhase, addXP } = useApp();

  const connections: string[] = state.phase6.connections ?? [];
  const modes: string[]       = state.phase6.modes       ?? [];

  // Separa públicos da lista (presets) de um público específico digitado (texto livre)
  const isPreset = (id: string) => WHO_OPTIONS.some(o => o.id === id);
  const presetConnections = connections.filter(isPreset);
  const [customAudience, setCustomAudience] = useState<string>(
    () => connections.find(c => !isPreset(c)) ?? '',
  );

  const [step, setStep] = useState<Step>(() => {
    if (connections.length > 0 && modes.length > 0) return 'done';
    if (connections.length > 0) return 'how';
    return 'who';
  });

  // Reconstrói connections = presets selecionados + público específico (se houver)
  const writeConnections = (presets: string[], custom: string) => {
    const next = [...presets, ...(custom.trim() ? [custom.trim()] : [])];
    updatePhase('phase6', { connections: next });
  };

  const toggleConnection = (id: string) => {
    const nextPresets = presetConnections.includes(id)
      ? presetConnections.filter(c => c !== id)
      : [...presetConnections, id];
    writeConnections(nextPresets, customAudience);
  };

  const handleCustomAudience = (value: string) => {
    setCustomAudience(value);
    writeConnections(presetConnections, value);
  };

  const toggleMode = (id: string) => {
    const next = modes.includes(id) ? modes.filter(m => m !== id) : [...modes, id];
    updatePhase('phase6', { modes: next });
  };

  const handleFinish = () => {
    addXP(100);
    completePhase(6);
    setStep('done');
  };

  return (
    <MissionWrapper
      videoTitle="Público e Cliente"
      videoDescription="Todo negócio precisa de gente do outro lado. Quem você quer servir — e como quer entregar valor a essas pessoas?"
      videoId="fase5"
    >
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── Quem você quer servir ── */}
          {step === 'who' && (
            <motion.div key="who" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-5 mb-6 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Quem você quer servir?</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-2">
                    Todo negócio existe para alguém. Quais grupos de pessoas você quer ter no centro do seu negócio nesta próxima fase?
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● Escolha 1 ou mais — ou descreva um público específico
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 flex-grow">
                {WHO_OPTIONS.map(opt => {
                  const active = presetConnections.includes(opt.id);
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

              <div className="mb-6">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--color-brand-500)] block mb-2">
                  Público específico (nicho)
                </label>
                <input
                  type="text"
                  value={customAudience}
                  onChange={e => handleCustomAudience(e.target.value)}
                  placeholder="Ex.: mulheres empreendedoras 50+, aposentados que querem renda extra…"
                  className="w-full rounded-xl border border-[var(--color-brand-200)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand-500)] focus:outline-none"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[var(--color-brand-100)]">
                <span className="text-sm font-mono opacity-60">{connections.length} selecionado{connections.length !== 1 ? 's' : ''}</span>
                <button onClick={() => setStep('how')} disabled={connections.length < 1}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    connections.length >= 1
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Próxima Etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Como prefere entregar ── */}
          {step === 'how' && (
            <motion.div key="how" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-5 mb-6 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0">
                  <Wifi className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Como você quer entregar?</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-2">
                    O formato da entrega molda o negócio tanto quanto o público. Como você se sente mais vivo ao servir essas pessoas?
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
                <button onClick={() => setStep('who')} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] py-1">
                  ← Voltar
                </button>
                <button onClick={handleFinish} disabled={modes.length === 0}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    modes.length > 0
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Concluir Fase →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Conclusão ── */}
          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-grow justify-center py-10">
              <div className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)]">
                <Sparkles className="w-12 h-12 text-[var(--neon-cyan)]" />
              </div>
              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Público Definido</h2>
              <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-10 leading-relaxed">
                Saber a quem você serve e como quer entregar é o que separa um hobby de um negócio. Esse é o coração da sua futura oferta.
              </p>

              <div className="w-full max-w-md space-y-4 mb-10">
                {connections.length > 0 && (
                  <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Quem você serve</p>
                    <div className="flex flex-wrap gap-1.5">
                      {connections.map(id => {
                        const opt = WHO_OPTIONS.find(o => o.id === id);
                        return (
                          <span key={id} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)] font-medium">
                            {opt ? `${opt.emoji} ${opt.label}` : `🎯 ${id}`}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                {modes.length > 0 && (
                  <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Como você entrega</p>
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
