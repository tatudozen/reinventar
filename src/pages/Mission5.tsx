import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, Sparkles, Users, Wifi } from 'lucide-react';
import { useApp } from '../store';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { MissionWrapper } from '../components/MissionWrapper';

const FIGURES = [
  { id: 'mandela',      name: 'Nelson Mandela',       area: 'Liderança',       desc: 'Saiu da prisão aos 71 e se tornou presidente. Símbolo de perdão, resiliência e reconciliação.' },
  { id: 'frankl',       name: 'Viktor Frankl',        area: 'Psicologia',      desc: 'Sobrevivente do Holocausto que criou a logoterapia. Ensinou que o sentido da vida pode ser encontrado mesmo no sofrimento.' },
  { id: 'gandhi',       name: 'Mahatma Gandhi',       area: 'Paz',             desc: 'Liderou uma nação inteira pela força do exemplo e da não-violência. Mostrou que a mudança começa por dentro.' },
  { id: 'curie',        name: 'Marie Curie',          area: 'Ciência',         desc: 'Primeira mulher a ganhar um Nobel — e ganhou dois. Paixão e persistência que superam qualquer barreira.' },
  { id: 'kahlo',        name: 'Frida Kahlo',          area: 'Arte',            desc: 'Transformou dor em arte e arte em identidade. Ícone de autenticidade e resiliência.' },
  { id: 'niemeyer',     name: 'Oscar Niemeyer',       area: 'Brasil',          desc: 'Projetou Brasília aos 52 e seguiu criando até os 104 anos. A longevidade como obra de arte.' },
  { id: 'freire',       name: 'Paulo Freire',         area: 'Brasil',          desc: 'Criou uma pedagogia que devolveu dignidade a milhões. Educação como ato de amor.' },
  { id: 'evaristo',     name: 'Conceição Evaristo',   area: 'Brasil',          desc: 'Publicou seu primeiro livro aos 44. Hoje é um dos maiores nomes da literatura brasileira.' },
  { id: 'pele',         name: 'Pelé',                 area: 'Esportes',        desc: 'O Rei do Futebol deixou os campos mas nunca parou de inspirar. Um legado que vai muito além do esporte.' },
  { id: 'senna',        name: 'Ayrton Senna',         area: 'Automobilismo',   desc: 'Mais do que velocidade, Senna era propósito. Corria pelo Brasil e pela busca do impossível.' },
  { id: 'teresa',       name: 'Madre Teresa',         area: 'Compaixão',       desc: 'Dedicou décadas ao serviço dos mais pobres. Ganhou o Nobel da Paz aos 69 anos.' },
  { id: 'wangari',      name: 'Wangari Maathai',      area: 'Meio Ambiente',   desc: 'Plantou 47 milhões de árvores na África e ganhou o Nobel da Paz. Uma vida é suficiente para mudar o mundo.' },
];

const AREA_COLORS: Record<string, string> = {
  'Liderança':        '#4ade80',
  'Psicologia':       '#c084fc',
  'Paz':              '#4ade80',
  'Ciência':          '#60a5fa',
  'Arte':             '#f472b6',
  'Brasil':           '#34d399',
  'Esportes':         '#f59e0b',
  'Automobilismo':    '#f59e0b',
  'Compaixão':        '#f97316',
  'Meio Ambiente':    '#22c55e',
};

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

type Step = 'figures' | 'who' | 'how' | 'done';

export default function Mission5() {
  const navigate  = useNavigate();
  const { state, updatePhase, completePhase, addXP } = useApp();

  const savedFigures  = state.phase5.savedFigures   || [];
  const discardedFigs = state.phase5.discardedFigures || [];
  const connections: string[] = state.phase6.connections ?? [];
  const modes: string[]       = state.phase6.modes       ?? [];

  const [currentIndex, setCurrentIndex] = useState(() => {
    const answered = savedFigures.length + discardedFigs.length;
    return Math.min(answered, FIGURES.length - 1);
  });
  const [step, setStep] = useState<Step>(() => {
    if (connections.length > 0 && modes.length > 0) return 'done';
    if (connections.length > 0) return 'how';
    if (savedFigures.length + discardedFigs.length >= FIGURES.length) return 'who';
    return 'figures';
  });
  const [exitDir, setExitDir] = useState(0);

  const currentFigure = FIGURES[currentIndex];
  const remaining     = FIGURES.length - currentIndex;
  const areaColor     = AREA_COLORS[currentFigure?.area] || '#00f2ff';

  const handleFigureAction = (action: 'save' | 'discard') => {
    setExitDir(action === 'save' ? 1 : -1);
    if (action === 'save') {
      updatePhase('phase5', { savedFigures: [...savedFigures, currentFigure.id] });
    } else {
      updatePhase('phase5', { discardedFigures: [...discardedFigs, currentFigure.id] });
    }
    if (currentIndex < FIGURES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStep('who');
    }
  };

  const toggleConnection = (id: string) => {
    const next = connections.includes(id) ? connections.filter(c => c !== id) : [...connections, id];
    updatePhase('phase6', { connections: next });
  };

  const toggleMode = (id: string) => {
    const next = modes.includes(id) ? modes.filter(m => m !== id) : [...modes, id];
    updatePhase('phase6', { modes: next });
  };

  const handleFinish = () => {
    addXP(100);
    completePhase(5);
    completePhase(6);
    setStep('done');
  };

  return (
    <MissionWrapper
      videoTitle="Conexões que Importam"
      videoDescription="Quem te inspira, com quem você quer estar e como quer se conectar na próxima fase da sua vida?"
      videoId="fase5"
    >
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── Figuras inspiradoras ── */}
          {step === 'figures' && (
            <motion.div key="figures" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-6 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[18px] mb-1">Quem te inspira?</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed mb-2">
                    A cada carta, decida rápido: essa pessoa ressoa com quem você é ou quer ser?
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● ♥ ressoa ou ✕ não ressoa — {FIGURES.length} figuras
                  </span>
                </div>
              </div>

              <div className="text-center text-sm text-[var(--color-text-muted)] mb-6 font-mono uppercase tracking-widest flex items-center justify-center gap-4">
                <span>{remaining} restantes</span>
                <span>·</span>
                <span className="text-[var(--color-brand-500)]">{savedFigures.length} ressoam</span>
              </div>

              <div className="flex-grow flex flex-col items-center justify-center">
                <AnimatePresence mode="popLayout" custom={exitDir}>
                  <motion.div
                    key={currentFigure.id}
                    custom={exitDir}
                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={(dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, rotate: dir > 0 ? 8 : -8, scale: 0.9 })}
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    className="w-full max-w-sm mb-10"
                  >
                    <div className="rounded-3xl border shadow-[var(--btn-shadow)] overflow-hidden"
                      style={{ borderColor: `${areaColor}40`, backgroundColor: 'rgba(255,255,255,0.04)' }}>
                      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${areaColor}80, ${areaColor}20)` }} />
                      <div className="p-8 flex flex-col items-center text-center">
                        <div className="px-3 py-1 rounded-full text-[11px] font-bold font-mono uppercase tracking-wider mb-6"
                          style={{ backgroundColor: `${areaColor}18`, color: areaColor, border: `1px solid ${areaColor}40` }}>
                          {currentFigure.area}
                        </div>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 text-2xl font-bold font-serif"
                          style={{ backgroundColor: `${areaColor}15`, color: areaColor, border: `2px solid ${areaColor}40` }}>
                          {currentFigure.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-[var(--text-main)] mb-2 leading-tight">
                          {currentFigure.name}
                        </h2>
                        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-[220px]">
                          {currentFigure.desc}
                        </p>
                      </div>
                      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${areaColor}20, ${areaColor}80)` }} />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-10">
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={() => handleFigureAction('discard')}
                      className="w-16 h-16 rounded-full bg-[var(--bg-dark)] border border-red-500/50 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all shadow-lg hover:scale-110">
                      <X className="w-8 h-8" />
                    </button>
                    <span className="text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider opacity-50">Não ressoa</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={() => handleFigureAction('save')}
                      className="w-16 h-16 rounded-full bg-[var(--bg-dark)] border border-[var(--color-brand-500)] flex items-center justify-center text-[var(--color-brand-500)] hover:bg-[var(--color-brand-500)] hover:text-[var(--bg-dark)] transition-all shadow-[var(--btn-shadow)] hover:scale-110">
                      <Heart className="w-8 h-8" />
                    </button>
                    <span className="text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider opacity-50">Ressoa!</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center pt-6 border-t border-[var(--color-brand-100)]">
                <button onClick={() => setStep('who')}
                  className="px-6 py-2 rounded-xl text-sm font-mono text-[var(--color-text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass)] transition-all">
                  Pular cartas restantes
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Quem você quer impactar ── */}
          {step === 'who' && (
            <motion.div key="who" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
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
                <button onClick={() => setStep('how')} disabled={connections.length < 2}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    connections.length >= 2
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Próxima Etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Como prefere se conectar ── */}
          {step === 'how' && (
            <motion.div key="how" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
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
              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Conexões Mapeadas</h2>
              <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-10 leading-relaxed">
                Saber com quem e como você quer se conectar é o primeiro passo para construir relações verdadeiras.
              </p>

              <div className="w-full max-w-md space-y-4 mb-10">
                {savedFigures.length > 0 && (
                  <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Figuras que inspiram</p>
                    <div className="flex flex-wrap gap-1.5">
                      {savedFigures.map(id => {
                        const f = FIGURES.find(x => x.id === id);
                        if (!f) return null;
                        const color = AREA_COLORS[f.area] || '#00f2ff';
                        return (
                          <span key={id} className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}40` }}>
                            {f.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
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

              <button onClick={() => navigate('/comecar/fase/6')}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform">
                Avançar para Fase 6 →
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
