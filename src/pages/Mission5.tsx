import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, Sparkles, Users, Landmark, Briefcase, ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { MissionWrapper } from '../components/MissionWrapper';
import { MINISTRIES, CARGOS } from '../lib/ikigai-analysis';

const PERSONALITIES = [
  // Tecnologia & Inovação
  { id: 'jobs',     name: 'Steve Jobs',           area: 'Tecnologia',       desc: 'Visionário que redefiniu design e tecnologia com a Apple' },
  { id: 'tesla_n',  name: 'Nikola Tesla',          area: 'Invenção',         desc: 'Gênio que inventou o sistema de corrente alternada' },
  { id: 'musk',     name: 'Elon Musk',             area: 'Inovação',         desc: 'Por trás da Tesla, SpaceX e Neuralink' },
  { id: 'gates',    name: 'Bill Gates',            area: 'Tecnologia',       desc: 'Co-fundador da Microsoft e filantropo global' },
  // Ciência & Pensamento
  { id: 'einstein', name: 'Albert Einstein',       area: 'Ciência',          desc: 'Revolucionou a compreensão do espaço, tempo e energia' },
  { id: 'curie',    name: 'Marie Curie',           area: 'Ciência',          desc: 'Única pessoa a ganhar Nobel em duas áreas diferentes' },
  { id: 'sagan',    name: 'Carl Sagan',            area: 'Ciência',          desc: 'Astrônomo que aproximou a ciência do grande público' },
  { id: 'aristoteles', name: 'Aristóteles',        area: 'Filosofia',        desc: 'Fundou a lógica, ética e a ciência política' },
  // Arte & Criação
  { id: 'davinci',  name: 'Leonardo da Vinci',     area: 'Arte & Ciência',   desc: 'Pintor, inventor e cientista do Renascimento' },
  { id: 'picasso',  name: 'Pablo Picasso',         area: 'Arte',             desc: 'Co-criador do cubismo e ícone da arte moderna' },
  { id: 'frida',    name: 'Frida Kahlo',           area: 'Arte',             desc: 'Símbolo de resiliência e identidade na pintura' },
  { id: 'disney',   name: 'Walt Disney',           area: 'Criação',          desc: 'Criou um império de entretenimento e imaginação' },
  // Negócios & Estratégia
  { id: 'buffett',  name: 'Warren Buffett',        area: 'Finanças',         desc: 'Maior investidor de todos os tempos, mestre do valor longo prazo' },
  { id: 'bezos',    name: 'Jeff Bezos',            area: 'Negócios',         desc: 'Fundador da Amazon, pioneiro no e-commerce' },
  { id: 'coco',     name: 'Coco Chanel',           area: 'Moda & Negócios',  desc: 'Revolucionou a moda e criou um dos maiores impérios do luxo' },
  { id: 'drucker',  name: 'Peter Drucker',         area: 'Gestão',           desc: 'Pai da administração moderna' },
  // Liderança & Impacto
  { id: 'mandela',  name: 'Nelson Mandela',        area: 'Liderança',        desc: 'Símbolo mundial da luta pela liberdade e reconciliação' },
  { id: 'gandhi',   name: 'Mahatma Gandhi',        area: 'Paz',              desc: 'Liderou a independência da Índia pela resistência não-violenta' },
  { id: 'mlk',      name: 'Martin Luther King Jr.', area: 'Direitos Civis',  desc: 'Líder do movimento pelos direitos civis nos EUA' },
  { id: 'malala',   name: 'Malala Yousafzai',      area: 'Educação',         desc: 'Ativista pelo direito à educação, a mais jovem Nobel da Paz' },
  // Esportes & Performance
  { id: 'jordan',   name: 'Michael Jordan',        area: 'Esportes',         desc: 'Considerado o maior basquetebolista de todos os tempos' },
  { id: 'senna',    name: 'Ayrton Senna',          area: 'Automobilismo',    desc: 'Tricampeão de Fórmula 1, ícone brasileiro no mundo' },
  { id: 'serena',   name: 'Serena Williams',       area: 'Esportes',         desc: 'A maior tenista da era moderna, 23 Grand Slams' },
  // Filosofia & Psicologia
  { id: 'marco',    name: 'Marco Aurélio',         area: 'Filosofia',        desc: 'Imperador romano e filósofo estoico, autor de "Meditações"' },
  { id: 'frankl',   name: 'Viktor Frankl',         area: 'Psicologia',       desc: 'Criador da logoterapia, sobrevivente do Holocausto' },
  // Brasil
  { id: 'dumont',   name: 'Santos Dumont',         area: 'Brasil',           desc: 'Inventor brasileiro do avião, pioneiro da aviação mundial' },
  { id: 'niemeyer', name: 'Oscar Niemeyer',        area: 'Brasil',           desc: 'Arquiteto que projetou Brasília e redefiniu o modernismo' },
  { id: 'pele',     name: 'Pelé',                  area: 'Brasil',           desc: 'O Rei do Futebol, único tricampeão mundial da história' },
  { id: 'coelho',   name: 'Paulo Coelho',          area: 'Brasil',           desc: '"O Alquimista" é um dos livros mais lidos do mundo' },
];

const AREA_COLORS: Record<string, string> = {
  'Tecnologia':      '#00f2ff',
  'Invenção':        '#00f2ff',
  'Inovação':        '#00f2ff',
  'Ciência':         '#60a5fa',
  'Arte & Ciência':  '#a78bfa',
  'Arte':            '#f472b6',
  'Criação':         '#f472b6',
  'Filosofia':       '#c084fc',
  'Psicologia':      '#c084fc',
  'Moda & Negócios': '#fb923c',
  'Negócios':        '#fb923c',
  'Finanças':        '#fb923c',
  'Gestão':          '#fb923c',
  'Liderança':       '#4ade80',
  'Paz':             '#4ade80',
  'Direitos Civis':  '#4ade80',
  'Educação':        '#4ade80',
  'Esportes':        '#f59e0b',
  'Automobilismo':   '#f59e0b',
  'Brasil':          '#34d399',
};

type Step = 'ministry' | 'cargo' | 'team' | 'done';

export default function Mission5() {
  const navigate = useNavigate();
  const { state, updateMission, addXP, completeMission } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<Step>('ministry');
  const [exitDir, setExitDir] = useState(0);

  const { ministry = '', cargo = '', saved = [], discarded = [] } = state.mission5 || {};
  const currentPersonality = PERSONALITIES[currentIndex];
  const remaining = PERSONALITIES.length - currentIndex;
  const ministryInfo = MINISTRIES.find(m => m.id === ministry);

  const setMinistry = (id: string) => updateMission('mission5', { ...state.mission5, ministry: id });
  const setCargo = (id: string) => updateMission('mission5', { ...state.mission5, cargo: id });

  const handleAction = (action: 'save' | 'discard') => {
    setExitDir(action === 'save' ? 1 : -1);
    if (action === 'save') {
      updateMission('mission5', { ...state.mission5, saved: [...saved, currentPersonality.id] });
    } else {
      updateMission('mission5', { ...state.mission5, discarded: [...discarded, currentPersonality.id] });
    }
    if (currentIndex < PERSONALITIES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStep('done');
    }
  };

  const handleFinish = () => {
    addXP(100);
    completeMission(5);
    navigate('/comecar/missao/6');
  };

  const areaColor = AREA_COLORS[currentPersonality?.area] || '#00f2ff';

  return (
    <MissionWrapper videoTitle="Ministério dos Sonhos" videoDescription="O presidente eleito te convidou para o governo. Que ministério e cargo você escolhe?" videoId="missao5">
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── Passo 1: escolher o Ministério ─────────────────────────────── */}
          {step === 'ministry' && (
            <motion.div key="ministry" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-8 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[18px] mb-1">O convite do Presidente</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed mb-2">
                    O presidente eleito te convidou para ajudar a governar o país. Em qual <strong className="text-[var(--color-brand-500)]">Ministério</strong> você quer atuar?
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● Selecione 1 ministério
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {MINISTRIES.map(m => {
                  const active = ministry === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMinistry(m.id)}
                      className={`relative rounded-xl border p-4 text-center transition-all ${
                        active
                          ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)]'
                          : 'border-[var(--color-brand-200)] hover:border-[var(--color-brand-400)] bg-[rgba(255,255,255,0.03)]'
                      }`}
                    >
                      {active && <Check className="w-4 h-4 text-[var(--color-brand-500)] absolute top-2 right-2" />}
                      <div className="text-3xl mb-2">{m.emoji}</div>
                      <div className="text-sm font-semibold text-[var(--text-main)] leading-tight">{m.name}</div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto flex justify-end pt-4 border-t border-[var(--color-brand-100)]">
                <button
                  onClick={() => setStep('cargo')}
                  disabled={!ministry}
                  className="px-8 py-3 bg-[var(--color-brand-600)] text-white rounded-xl font-medium hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  Continuar →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Passo 2: escolher o Cargo ──────────────────────────────────── */}
          {step === 'cargo' && (
            <motion.div key="cargo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-8 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[18px] mb-1">Seu cargo no Ministério {ministryInfo ? `da ${ministryInfo.name}` : ''}</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed mb-2">
                    Todo ministério precisa de perfis diferentes. Qual papel combina mais com você?
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● Selecione 1 cargo
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 mb-8">
                {CARGOS.map(c => {
                  const active = cargo === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCargo(c.id)}
                      className={`w-full text-left rounded-xl border p-4 flex items-start gap-3 transition-all ${
                        active
                          ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)]'
                          : 'border-[var(--color-brand-200)] hover:border-[var(--color-brand-400)] bg-[rgba(255,255,255,0.03)]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${active ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-500)]' : 'border-[var(--color-brand-300)]'}`}>
                        {active && <Check className="w-3 h-3 text-[var(--bg-dark)]" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[var(--text-main)]">{c.name}</div>
                        <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">{c.profile}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto flex justify-between pt-4 border-t border-[var(--color-brand-100)]">
                <button
                  onClick={() => setStep('ministry')}
                  className="px-6 py-3 border border-[var(--color-brand-200)] text-[var(--color-text-muted)] rounded-xl font-medium hover:bg-[var(--glass)] transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
                <button
                  onClick={() => setStep('team')}
                  disabled={!cargo}
                  className="px-8 py-3 bg-[var(--color-brand-600)] text-white rounded-xl font-medium hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  Montar a equipe →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Passo 3: montar a equipe (personalidades) ──────────────────── */}
          {step === 'team' && (
            <motion.div key="team" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-8 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[18px] mb-1">A equipe do Ministério {ministryInfo ? `da ${ministryInfo.name}` : 'dos Sonhos'}</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed mb-2">
                    Agora monte a sua equipe dos sonhos. A cada carta, decida rápido: você convidaria essa pessoa para o seu ministério?
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                    ● ♥ guardar ou ✕ descartar cada personalidade
                  </span>
                </div>
              </div>

              <div className="text-center text-sm text-[var(--color-text-muted)] mb-6 font-mono uppercase tracking-widest flex items-center justify-center gap-4">
                <span>{remaining} restantes</span>
                <span>·</span>
                <span className="text-[var(--color-brand-500)]">{saved.length} na equipe</span>
              </div>

              <div className="flex-grow flex flex-col items-center justify-center">
                <AnimatePresence mode="popLayout" custom={exitDir}>
                  <motion.div
                    key={currentPersonality.id}
                    custom={exitDir}
                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={(dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, rotate: dir > 0 ? 8 : -8, scale: 0.9 })}
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    className="w-full max-w-sm mb-10 relative"
                  >
                    <div
                      className="rounded-3xl border shadow-[var(--btn-shadow)] overflow-hidden"
                      style={{ borderColor: `${areaColor}40`, backgroundColor: 'rgba(255,255,255,0.04)' }}
                    >
                      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${areaColor}80, ${areaColor}20)` }} />
                      <div className="p-8 flex flex-col items-center text-center">
                        <div className="px-3 py-1 rounded-full text-[11px] font-bold font-mono uppercase tracking-wider mb-6"
                          style={{ backgroundColor: `${areaColor}18`, color: areaColor, border: `1px solid ${areaColor}40` }}>
                          {currentPersonality.area}
                        </div>
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center mb-5 text-2xl font-bold font-serif"
                          style={{ backgroundColor: `${areaColor}15`, color: areaColor, border: `2px solid ${areaColor}40` }}
                        >
                          {currentPersonality.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-[var(--text-main)] mb-2 leading-tight">
                          {currentPersonality.name}
                        </h2>
                        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-[220px]">
                          {currentPersonality.desc}
                        </p>
                      </div>
                      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${areaColor}20, ${areaColor}80)` }} />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-10">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleAction('discard')}
                      className="w-16 h-16 rounded-full bg-[var(--bg-dark)] border border-red-500/50 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all shadow-lg hover:scale-110"
                    >
                      <X className="w-8 h-8" />
                    </button>
                    <span className="text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider opacity-50">Não</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleAction('save')}
                      className="w-16 h-16 rounded-full bg-[var(--bg-dark)] border border-[var(--color-brand-500)] flex items-center justify-center text-[var(--color-brand-500)] hover:bg-[var(--color-brand-500)] hover:text-[var(--bg-dark)] transition-all shadow-[var(--btn-shadow)] hover:scale-110"
                    >
                      <Heart className="w-8 h-8" />
                    </button>
                    <span className="text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider opacity-50">Sim!</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center pt-6 border-t border-[var(--color-brand-100)]">
                <button
                  onClick={() => setStep('done')}
                  className="px-6 py-2 rounded-xl text-sm font-mono text-[var(--color-text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass)] transition-all"
                >
                  Pular cartas restantes
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Passo 4: conclusão ─────────────────────────────────────────── */}
          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-grow justify-center py-10">
              <div className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)] text-[var(--neon-magenta)]">
                <Sparkles className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Ministério montado!</h2>
              <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-3 leading-relaxed">
                Você assumiu o <strong className="text-[var(--color-brand-500)]">Ministério {ministryInfo ? `da ${ministryInfo.name}` : 'dos Sonhos'}</strong>
                {cargo ? <> como <strong className="text-[var(--color-brand-500)]">{CARGOS.find(c => c.id === cargo)?.name}</strong></> : null}
                {' '}e montou uma equipe de <strong className="text-[var(--color-brand-500)]">{saved.length} {saved.length === 1 ? 'personalidade' : 'personalidades'}</strong>.
              </p>
              <p className="text-sm text-[var(--color-text-muted)] max-w-md text-center mb-10 leading-relaxed opacity-80">
                O ministério que você escolheu, o cargo e quem você admira revelam muito sobre seus valores e o impacto que quer causar.
              </p>

              {saved.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-10 max-w-sm">
                  {saved.map(id => {
                    const p = PERSONALITIES.find(p => p.id === id);
                    if (!p) return null;
                    const color = AREA_COLORS[p.area] || '#00f2ff';
                    return (
                      <span key={id} className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}40` }}>
                        {p.name}
                      </span>
                    );
                  })}
                </div>
              )}

              <button
                onClick={handleFinish}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform flex items-center gap-2"
              >
                Avançar para Missão 06 <Sparkles className="w-5 h-5" />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
