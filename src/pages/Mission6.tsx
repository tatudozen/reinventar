import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, X, Heart, Sparkles } from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { MissionWrapper } from '../components/MissionWrapper';
import { CoinRanker } from '../components/CoinRanker';

// 24 possibilidades concretas de atuação para quem reinventa a vida depois dos 55
const ALL_ROLES = [
  { id: 'mentor',         text: 'Mentor(a) de jovens empreendedores',          emoji: '🌱' },
  { id: 'escritora',      text: 'Escritora(a) de memórias e histórias de vida', emoji: '📖' },
  { id: 'consultor',      text: 'Consultor(a) independente na minha área',      emoji: '💡' },
  { id: 'professor',      text: 'Professor(a) particular ou de oficinas',       emoji: '✏️' },
  { id: 'voluntario',     text: 'Voluntário(a) em causa que acredito',          emoji: '🫂' },
  { id: 'podcast',        text: 'Criador(a) de podcast ou canal de conteúdo',   emoji: '🎙️' },
  { id: 'artesao',        text: 'Artesão(ã) e criador(a) de produtos próprios', emoji: '🧵' },
  { id: 'coach',          text: 'Coach de transição de carreira ou vida',        emoji: '🧭' },
  { id: 'cuidador',       text: 'Cuidador(a) especializado(a) de idosos',       emoji: '🌸' },
  { id: 'guia',           text: 'Guia de turismo cultural ou de natureza',      emoji: '🗺️' },
  { id: 'horta',          text: 'Criador(a) de horta comunitária ou terapêutica', emoji: '🌿' },
  { id: 'genealogia',     text: 'Pesquisador(a) de genealogia e história familiar', emoji: '🔍' },
  { id: 'facilitador',    text: 'Facilitador(a) de grupos e círculos de conversa', emoji: '🔵' },
  { id: 'fotografo',      text: 'Fotógrafo(a) de família e momentos de vida',   emoji: '📷' },
  { id: 'mediador',       text: 'Mediador(a) de conflitos familiares ou comunitários', emoji: '⚖️' },
  { id: 'narrador',       text: 'Narrador(a) de audiolivros e histórias orais', emoji: '🎧' },
  { id: 'idiomas',        text: 'Professor(a) de idiomas para adultos',         emoji: '🌍' },
  { id: 'palestrante',    text: 'Palestrante sobre experiência de vida',        emoji: '🎤' },
  { id: 'acompanhante',   text: 'Acompanhante terapêutico(a) de idosos',        emoji: '🤲' },
  { id: 'curador',        text: 'Curador(a) de espaço cultural ou biblioteca comunitária', emoji: '🏛️' },
  { id: 'produtor',       text: 'Produtor(a) de eventos comunitários',          emoji: '🎪' },
  { id: 'terapeuta',      text: 'Terapeuta ou facilitador(a) de bem-estar',     emoji: '🧘' },
  { id: 'embaixador',     text: 'Embaixador(a) de marca ou causa que acredito', emoji: '🌟' },
  { id: 'empreendedor',   text: 'Empreendedor(a) social de pequena escala',     emoji: '🚀' },
];

export default function Mission6() {
  const navigate = useNavigate();
  const { state, updatePhase, completePhase, addXP } = useApp();

  const savedRoles:    string[] = state.phase7.savedRoles    ?? [];
  const discardedRoles: string[] = state.phase7.discardedRoles ?? [];
  const rolesRanking: Record<string, number> = state.phase7.rolesRanking ?? {};

  const rankTotal    = savedRoles.length + 1;
  const rankUsed     = Object.values(rolesRanking).reduce((a, b) => a + (b || 0), 0);
  // Se guardou <2, não há o que rankear; com >=2 exige distribuir todas as moedas.
  const rankComplete = savedRoles.length < 2 || rankUsed === rankTotal;

  const [currentIndex, setCurrentIndex] = useState(() => {
    const answered = savedRoles.length + discardedRoles.length;
    return Math.min(answered, ALL_ROLES.length - 1);
  });
  // Steps: 0 = cartas · 1 = ranking (se >=2) · 2 = conclusão
  const [step, setStep] = useState(() => {
    if (savedRoles.length + discardedRoles.length >= ALL_ROLES.length) {
      return savedRoles.length >= 2 ? 1 : 2;
    }
    return 0;
  });
  const [exitDir, setExitDir] = useState(0);

  const currentRole = ALL_ROLES[currentIndex];
  const remaining   = ALL_ROLES.length - currentIndex;

  const goAfterCards = (finalSaved: number) => setStep(finalSaved >= 2 ? 1 : 2);

  const handleAction = (action: 'save' | 'discard') => {
    setExitDir(action === 'save' ? 1 : -1);
    if (action === 'save') {
      updatePhase('phase7', { savedRoles: [...savedRoles, currentRole.id] });
    } else {
      updatePhase('phase7', { discardedRoles: [...discardedRoles, currentRole.id] });
    }
    if (currentIndex < ALL_ROLES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      goAfterCards(savedRoles.length + (action === 'save' ? 1 : 0));
    }
  };

  const handleFinish = () => {
    addXP(100);
    completePhase(4);
    navigate('/comecar/fase/5');
  };

  return (
    <MissionWrapper
      videoTitle="O Garimpo"
      videoDescription="Cada possibilidade que ressoa é uma pista sobre quem você está se tornando."
      videoId="fase7"
    >
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── Step 0: Cartas ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-6 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[18px] mb-1">Possibilidades do Próximo Capítulo</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed mb-2">
                    Cada carta é uma forma real de atuação para quem reinventa a vida. Decida rápido — confie no primeiro impulso. Não precisa fazer sentido agora.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● ♥ ressoa ou ✕ não ressoa — {ALL_ROLES.length} possibilidades
                  </span>
                </div>
              </div>

              <div className="text-center text-sm text-[var(--color-text-muted)] mb-4 font-mono uppercase tracking-widest flex items-center justify-center gap-4">
                <span>{remaining} restantes</span>
                <span>·</span>
                <span className="text-[var(--color-brand-500)]">{savedRoles.length} ressoam</span>
              </div>

              <div className="flex-grow flex flex-col items-center justify-center">
                <AnimatePresence mode="popLayout" custom={exitDir}>
                  <motion.div
                    key={currentRole.id}
                    custom={exitDir}
                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={(dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, rotate: dir > 0 ? 8 : -8, scale: 0.9 })}
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    className="w-full max-w-sm mb-12"
                  >
                    <div className="bg-[var(--glass)] border border-[var(--color-brand-300)] rounded-3xl aspect-square flex flex-col items-center justify-center shadow-[var(--btn-shadow)] relative overflow-hidden p-8">
                      <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 70% 30%, var(--neon-cyan), transparent 60%)' }} />
                      <span className="text-6xl mb-6 z-10">{currentRole.emoji}</span>
                      <h2 className="font-serif text-2xl font-bold text-[var(--text-main)] text-center leading-tight z-10">
                        {currentRole.text}
                      </h2>
                      <div className="absolute bottom-8 w-24 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-brand-400)] to-transparent opacity-50" />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-10">
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={() => handleAction('discard')}
                      className="w-16 h-16 rounded-full bg-[var(--bg-dark)] border border-red-500/50 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all shadow-lg hover:scale-110">
                      <X className="w-8 h-8" />
                    </button>
                    <span className="text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider opacity-50">Não ressoa</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={() => handleAction('save')}
                      className="w-16 h-16 rounded-full bg-[var(--bg-dark)] border border-[var(--color-brand-500)] flex items-center justify-center text-[var(--color-brand-500)] hover:bg-[var(--color-brand-500)] hover:text-[var(--bg-dark)] transition-all shadow-[var(--btn-shadow)] hover:scale-110">
                      <Heart className="w-8 h-8" />
                    </button>
                    <span className="text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider opacity-50">Ressoa!</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center pt-6 border-t border-[var(--color-brand-100)]">
                <button onClick={() => goAfterCards(savedRoles.length)}
                  className="px-6 py-2 rounded-xl text-sm font-mono text-[var(--color-text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass)] transition-all">
                  Pular cartas restantes
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 1: Ranking das possibilidades (moedas) ── */}
          {step === 1 && (
            <motion.div key="rank" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-xl mx-auto w-full py-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-serif text-[var(--text-main)] mb-2">Quais te atraem MAIS?</h2>
                <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
                  Você guardou {savedRoles.length} possibilidades. Distribua as moedas para mostrar quais mais ressoam — isso ajuda a priorizar o que testar primeiro.
                </p>
              </div>

              <CoinRanker
                items={savedRoles.map(id => {
                  const role = ALL_ROLES.find(r => r.id === id);
                  return { id, label: role?.text ?? id, emoji: role?.emoji };
                })}
                values={rolesRanking}
                totalCoins={rankTotal}
                onChange={next => updatePhase('phase7', { rolesRanking: next })}
              />

              <div className="text-center mt-8">
                <button onClick={() => setStep(2)} disabled={!rankComplete}
                  className="px-10 py-3.5 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform disabled:opacity-40 disabled:pointer-events-none">
                  Avançar →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Conclusão ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-grow justify-center py-10">
              <div className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)] text-[var(--neon-magenta)]">
                <Sparkles className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Garimpo Concluído</h2>
              <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-6 leading-relaxed">
                Você guardou <strong className="text-[var(--color-brand-500)]">{savedRoles.length} possibilidades</strong> que ressoaram.
                O que atrai e o que repele são igualmente reveladores.
              </p>

              {savedRoles.length > 0 && (
                <div className="w-full max-w-md bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-5 mb-10">
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Possibilidades que ressoaram</p>
                  <div className="flex flex-wrap gap-2">
                    {savedRoles.map(id => {
                      const role = ALL_ROLES.find(r => r.id === id);
                      return role ? (
                        <span key={id} className="text-xs px-3 py-1.5 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)] font-medium flex items-center gap-1">
                          <span>{role.emoji}</span> {role.text}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <button onClick={handleFinish}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform flex items-center gap-2">
                Avançar para Fase 5 <Sparkles className="w-5 h-5" />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
