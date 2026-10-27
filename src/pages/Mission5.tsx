import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, Sparkles, Users, Landmark, Briefcase, ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { MissionWrapper } from '../components/MissionWrapper';

const FIGURES = [
  // Reinvenção depois dos 50
  { id: 'mandela',      name: 'Nelson Mandela',       area: 'Liderança',       desc: 'Saiu da prisão aos 71 e se tornou presidente. Símbolo de perdão, resiliência e reconciliação.' },
  { id: 'frankl',       name: 'Viktor Frankl',        area: 'Psicologia',      desc: 'Sobrevivente do Holocausto que criou a logoterapia. Ensinou que o sentido da vida pode ser encontrado mesmo no sofrimento.' },
  // Arte e expressão
  { id: 'kahlo',        name: 'Frida Kahlo',          area: 'Arte',            desc: 'Transformou dor em arte e arte em identidade. Ícone de autenticidade e resiliência.' },
  // Brasil — sabedoria e legado
  { id: 'niemeyer',     name: 'Oscar Niemeyer',       area: 'Brasil',          desc: 'Projetou Brasília aos 52 e seguiu criando até os 104 anos. A longevidade como obra de arte.' },
  { id: 'freire',       name: 'Paulo Freire',         area: 'Brasil',          desc: 'Criou uma pedagogia que devolveu dignidade a milhões. Educação como ato de amor.' },
  { id: 'evaristo',     name: 'Conceição Evaristo',   area: 'Brasil',          desc: 'Publicou seu primeiro livro aos 44. Hoje é um dos maiores nomes da literatura brasileira.' },
  // Impacto social
  { id: 'teresa',       name: 'Madre Teresa',         area: 'Compaixão',       desc: 'Dedicou décadas ao serviço dos mais pobres. Ganhou o Nobel da Paz aos 69 anos.' },
  { id: 'wangari',      name: 'Wangari Maathai',      area: 'Meio Ambiente',   desc: 'Plantou 47 milhões de árvores na África e ganhou o Nobel da Paz. Uma vida é suficiente para mudar o mundo.' },
];

const AREA_COLORS: Record<string, string> = {
  'Reinvenção':       '#00f2ff',
  'Arte':             '#f472b6',
  'Arte & Ciência':   '#a78bfa',
  'Empreendedorismo': '#fb923c',
  'Liderança':        '#4ade80',
  'Psicologia':       '#c084fc',
  'Filosofia':        '#c084fc',
  'Paz':              '#4ade80',
  'Ciência':          '#60a5fa',
  'Natureza':         '#34d399',
  'Literatura':       '#f472b6',
  'Brasil':           '#34d399',
  'Compaixão':        '#f97316',
  'Meio Ambiente':    '#22c55e',
  'Educação':         '#4ade80',
  'Gestão':           '#fb923c',
  'Estratégia':       '#fb923c',
};

const MINISTRIES = [
  { id: 'economia',               name: 'Economia',               emoji: '💰' },
  { id: 'saude',                  name: 'Saúde',                  emoji: '🏥' },
  { id: 'ciencia_tecnologia',     name: 'Ciência e Tecnologia',   emoji: '🔬' },
  { id: 'educacao',               name: 'Educação',               emoji: '📚' },
  { id: 'justica',                name: 'Justiça',                emoji: '⚖️' },
  { id: 'cultura',                name: 'Cultura',                emoji: '🎭' },
  { id: 'meio_ambiente',          name: 'Meio Ambiente',          emoji: '🌱' },
  { id: 'infraestrutura',         name: 'Infraestrutura',         emoji: '🏗️' },
  { id: 'desenvolvimento_social', name: 'Desenvolvimento Social', emoji: '🤝' },
  { id: 'comunicacoes',           name: 'Comunicações',           emoji: '📡' },
];

const CARGOS = [
  { id: 'ministro',             name: 'Ministro(a)',                 profile: 'Lidera, define a visão e toma as grandes decisões.' },
  { id: 'consultor_tecnico',    name: 'Consultor(a) Técnico(a)',     profile: 'Resolve problemas complexos com pesquisa, análise e dados.' },
  { id: 'assessor_comunicacao', name: 'Assessor(a) de Comunicação',  profile: 'Traduz e comunica as ideias para o mundo.' },
  { id: 'diretor_operacoes',    name: 'Diretor(a) de Operações',     profile: 'Organiza processos e garante que tudo funcione.' },
  { id: 'coordenador_campo',    name: 'Coordenador(a) de Campo',     profile: 'Coloca a mão na massa e executa na prática.' },
  { id: 'secretario_social',    name: 'Secretário(a) de Bem-Estar',  profile: 'Cuida das pessoas e do impacto humano das ações.' },
];

type Step = 'setup' | 'team' | 'done';

export default function Mission5() {
  const navigate = useNavigate();
  const { state, updatePhase, completePhase, addXP } = useApp();

  const ministry        = state.phase5.ministry       || '';
  const cargo           = state.phase5.cargo          || '';
  const savedFigures    = state.phase5.savedFigures   || [];
  const discardedFigs   = state.phase5.discardedFigures || [];

  const [currentIndex, setCurrentIndex] = useState(() => {
    const answered = savedFigures.length + discardedFigs.length;
    return Math.min(answered, FIGURES.length - 1);
  });
  const [step, setStep] = useState<Step>(() => {
    if (!ministry || !cargo) return 'setup';
    if (savedFigures.length + discardedFigs.length < FIGURES.length) return 'team';
    return 'done';
  });
  const [exitDir, setExitDir] = useState(0);

  const ministryInfo  = MINISTRIES.find(m => m.id === ministry);
  const currentFigure = FIGURES[currentIndex];
  const remaining     = FIGURES.length - currentIndex;

  const handleAction = (action: 'save' | 'discard') => {
    setExitDir(action === 'save' ? 1 : -1);
    if (action === 'save') {
      updatePhase('phase5', { savedFigures: [...savedFigures, currentFigure.id] });
    } else {
      updatePhase('phase5', { discardedFigures: [...discardedFigs, currentFigure.id] });
    }
    if (currentIndex < FIGURES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStep('done');
    }
  };

  const handleFinish = () => {
    addXP(100);
    completePhase(5);
    navigate('/comecar/fase/6');
  };

  const areaColor = AREA_COLORS[currentFigure?.area] || '#00f2ff';

  return (
    <MissionWrapper
      videoTitle="Sua Iniciativa de Impacto"
      videoDescription="Se você tivesse recursos para criar uma iniciativa que muda o mundo, o que você escolheria?"
      videoId="fase5"
    >
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── Passo 1: Área + Papel ── */}
          {step === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              {/* Área de atuação */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Landmark className="w-4 h-4 text-[var(--color-brand-500)]" />
                  <h3 className="font-bold text-base text-[var(--text-main)]">Em qual área você atuaria?</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MINISTRIES.map(m => {
                    const active = ministry === m.id;
                    return (
                      <button key={m.id} onClick={() => updatePhase('phase5', { ministry: m.id })}
                        className={`relative rounded-xl border p-3 text-center transition-all ${
                          active
                            ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)]'
                            : 'border-[var(--color-brand-200)] hover:border-[var(--color-brand-400)] bg-[rgba(255,255,255,0.03)]'
                        }`}>
                        {active && <Check className="w-3 h-3 text-[var(--color-brand-500)] absolute top-1.5 right-1.5" />}
                        <div className="text-2xl mb-1">{m.emoji}</div>
                        <div className="text-xs font-semibold text-[var(--text-main)] leading-tight">{m.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Papel / Cargo */}
              <div className="mb-auto">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-[var(--color-brand-500)]" />
                  <h3 className="font-bold text-base text-[var(--text-main)]">
                    Como você prefere atuar{ministryInfo ? ` em ${ministryInfo.name}` : ''}?
                  </h3>
                </div>
                <div className="space-y-2">
                  {CARGOS.map(c => {
                    const active = cargo === c.id;
                    return (
                      <button key={c.id} onClick={() => updatePhase('phase5', { cargo: c.id })}
                        className={`w-full text-left rounded-xl border p-3 flex items-start gap-3 transition-all ${
                          active
                            ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)]'
                            : 'border-[var(--color-brand-200)] hover:border-[var(--color-brand-400)] bg-[rgba(255,255,255,0.03)]'
                        }`}>
                        <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${active ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-500)]' : 'border-[var(--color-brand-300)]'}`}>
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
              </div>

              <div className="mt-6 flex justify-end pt-4 border-t border-[var(--color-brand-100)]">
                <button onClick={() => setStep('team')} disabled={!ministry || !cargo}
                  className="px-8 py-3 bg-[var(--color-brand-600)] text-white rounded-xl font-medium hover:opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Quem te inspira →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Passo 3: Figuras inspiradoras ── */}
          {step === 'team' && (
            <motion.div key="team" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-8 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[18px] mb-1">Quem te inspira?</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed mb-2">
                    A cada carta, decida rápido: essa pessoa ressoa com quem você é ou quer ser? Não precisa admirar tudo — basta sentir alguma afinidade.
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
                <button onClick={() => setStep('done')}
                  className="px-6 py-2 rounded-xl text-sm font-mono text-[var(--color-text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass)] transition-all">
                  Pular cartas restantes
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Passo 4: Conclusão ── */}
          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-grow justify-center py-10">
              <div className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)] text-[var(--neon-magenta)]">
                <Sparkles className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Iniciativa definida!</h2>
              <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-3 leading-relaxed">
                Você escolheu atuar em{' '}
                <strong className="text-[var(--color-brand-500)]">{ministryInfo?.name || 'uma área de impacto'}</strong>
                {cargo ? <> como <strong className="text-[var(--color-brand-500)]">{CARGOS.find(c => c.id === cargo)?.name}</strong></> : null}
                {' '}e se identificou com{' '}
                <strong className="text-[var(--color-brand-500)]">{savedFigures.length} {savedFigures.length === 1 ? 'figura' : 'figuras'}</strong>.
              </p>
              <p className="text-sm text-[var(--color-text-muted)] max-w-md text-center mb-10 leading-relaxed opacity-80">
                Quem você admira revela muito sobre quem você quer ser. As figuras que ressoam carregam traços seus que ainda estão se expressando.
              </p>

              {savedFigures.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-10 max-w-sm">
                  {savedFigures.map(id => {
                    const f     = FIGURES.find(x => x.id === id);
                    if (!f) return null;
                    const color = AREA_COLORS[f.area] || '#00f2ff';
                    return (
                      <span key={id} className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}40` }}>
                        {f.name}
                      </span>
                    );
                  })}
                </div>
              )}

              <button onClick={handleFinish}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform flex items-center gap-2">
                Avançar para Fase 6 <Sparkles className="w-5 h-5" />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
