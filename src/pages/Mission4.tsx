import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, GitMerge, Map } from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MissionWrapper } from '../components/MissionWrapper';

type RIASECType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

interface DuelOption {
  type: RIASECType;
  label: string;
  text: string;
  img: string;
}

interface Duel {
  id: string;
  A: DuelOption;
  B: DuelOption;
}

// 12 duelos — cada tipo aparece exatamente 4 vezes
// R:1,2,3,4 | I:1,5,6,7 | A:2,5,8,9 | S:3,8,10,11 | E:6,9,10,12 | C:4,7,11,12
const DUELS: Duel[] = [
  {
    id: '1',
    A: { type: 'R', label: 'Colocar a mão na massa', text: 'Testar, montar e ajustar com as próprias mãos até funcionar.', img: '/questions/fase4-duelo1-a-maos-na-massa.jpeg' },
    B: { type: 'I', label: 'Entender o porquê', text: 'Pesquisar fundo, ler, refletir até chegar na raiz do problema.', img: '/questions/fase4-duelo1-b-entender-raiz.jpeg' },
  },
  {
    id: '2',
    A: { type: 'A', label: 'Criar algo do zero', text: 'Partir de um papel em branco e transformar imaginação em algo real.', img: '/questions/fase4-duelo2-a-criar-zero.jpeg' },
    B: { type: 'R', label: 'Construir algo concreto', text: 'Seguir um plano e erguer algo tangível com esforço e habilidade.', img: '/questions/fase4-duelo2-b-construir-concreto.jpeg' },
  },
  {
    id: '3',
    A: { type: 'R', label: 'Trabalhar com as mãos', text: 'Jardim, marcenaria, culinária, artesanato — o prazer do físico.', img: '/questions/fase4-duelo3-a-maos-jardim.jpeg' },
    B: { type: 'S', label: 'Trabalhar com pessoas', text: 'Rodeado de relações humanas, conversas e conexões genuínas.', img: '/questions/fase4-duelo3-b-pessoas-conexao.jpeg' },
  },
  {
    id: '4',
    A: { type: 'R', label: 'No mundo físico', text: 'Lidar com espaço, matéria, ferramentas e o mundo concreto.', img: '/questions/fase4-duelo4-a-fisico.jpeg' },
    B: { type: 'C', label: 'Nos bastidores', text: 'Cuidar da ordem, dos processos e da consistência que sustenta tudo.', img: '/questions/fase4-duelo4-b-bastidores-ordem.jpeg' },
  },
  {
    id: '5',
    A: { type: 'I', label: 'Investigar fundo', text: 'Descobrir padrões ocultos com curiosidade quase científica.', img: '/questions/fase4-duelo5-a-investigar.jpeg' },
    B: { type: 'A', label: 'Contar histórias', text: 'Transformar experiência em narrativa que toca e inspira outros.', img: '/questions/fase4-duelo5-b-contar-historias.jpeg' },
  },
  {
    id: '6',
    A: { type: 'I', label: 'Refletir antes de agir', text: 'Pensar com calma, mapear o terreno, decidir com sabedoria.', img: '/questions/fase4-duelo6-a-refletir.jpeg' },
    B: { type: 'E', label: 'Agir e mobilizar', text: 'Liderar a mudança, engajar pessoas e fazer as coisas saírem do papel.', img: '/questions/fase4-duelo6-b-agir-mobilizar.jpeg' },
  },
  {
    id: '7',
    A: { type: 'I', label: 'Explorar sem mapa', text: 'Mergulhar em ideias sem destino fixo — a curiosidade como bússola.', img: '/questions/fase4-duelo7-a-explorar.jpeg' },
    B: { type: 'C', label: 'Criar sistemas que durem', text: 'Estruturar processos claros que outras pessoas possam seguir.', img: '/questions/fase4-duelo7-b-criar-sistemas.jpeg' },
  },
  {
    id: '8',
    A: { type: 'A', label: 'Me expressar livremente', text: 'Arte, escrita, música, design — a vida como expressão pessoal.', img: '/questions/fase4-duelo8-a-expressar.jpeg' },
    B: { type: 'S', label: 'Transmitir o que sei', text: 'Ensinar, mentorar e ver a semente do conhecimento germinar em outros.', img: '/questions/fase4-duelo8-b-transmitir.jpeg' },
  },
  {
    id: '9',
    A: { type: 'A', label: 'Criar beleza e sentido', text: 'Projetos que emocionam, provocam ou iluminam quem os encontra.', img: '/questions/fase4-duelo9-a-beleza.jpeg' },
    B: { type: 'E', label: 'Construir algo maior', text: 'Liderar uma causa, um negócio ou uma iniciativa que ganha escala.', img: '/questions/fase4-duelo9-b-impacto-amplo.jpeg' },
  },
  {
    id: '10',
    A: { type: 'S', label: 'Cuidar de perto', text: 'Estar presente, apoiar o bem-estar de pessoas reais ao meu redor.', img: '/questions/fase4-duelo10-a-cuidar-perto.jpeg' },
    B: { type: 'E', label: 'Gerar impacto amplo', text: 'Criar soluções que cheguem a muitas pessoas de uma só vez.', img: '/questions/fase4-duelo10-b-impacto-muitos.jpeg' },
  },
  {
    id: '11',
    A: { type: 'S', label: 'Colaborar em grupo', text: 'Co-criar com outros — a sinergia de talentos diferentes.', img: '/questions/fase4-duelo11-a-colaborar.jpeg' },
    B: { type: 'C', label: 'Dar ordem ao caos', text: 'Organizar, documentar e criar clareza onde havia confusão.', img: '/questions/fase4-duelo11-b-ordem-caos.jpeg' },
  },
  {
    id: '12',
    A: { type: 'E', label: 'Renovar e transformar', text: 'Criar o que ainda não existe, mesmo que exija sair da zona de conforto.', img: '/questions/fase4-duelo12-a-renovar.jpeg' },
    B: { type: 'C', label: 'Preservar e aprimorar', text: 'Proteger o que funciona e refiná-lo com cuidado e consistência.', img: '/questions/fase4-duelo12-b-preservar.jpeg' },
  },
];

const RIASEC: Record<RIASECType, { full: string; desc: string; color: string; icon: string; roles: string[] }> = {
  R: {
    full: 'Prático',
    desc: 'Você encontra satisfação no trabalho concreto — com as mãos, com espaços, com ferramentas. O resultado tangível é a sua recompensa.',
    color: '#f97316',
    icon: '🛠️',
    roles: ['Artesão / Artesã', 'Jardineiro / Horta', 'Restaurador(a)', 'Voluntário de campo', 'Construtor(a) de comunidade'],
  },
  I: {
    full: 'Investigativo',
    desc: 'Você é movido pela curiosidade intelectual — adorar entender como as coisas funcionam e por quê o mundo é como é.',
    color: '#8b5cf6',
    icon: '🔬',
    roles: ['Pesquisador(a) independente', 'Escritor(a) de não-ficção', 'Consultor(a) especialista', 'Mentor de carreira', 'Tutor(a)'],
  },
  A: {
    full: 'Artístico',
    desc: 'Você precisa se expressar de forma criativa e original — a arte, a escrita e a beleza são formas de dar sentido à vida.',
    color: '#ec4899',
    icon: '🎨',
    roles: ['Escritor(a) / Poeta', 'Artista plástico(a)', 'Músico(a)', 'Contador(a) de histórias', 'Designer'],
  },
  S: {
    full: 'Social',
    desc: 'Sua vocação é humana — você floresce ajudando, ensinando, ouvindo e criando pontes entre pessoas.',
    color: '#22c55e',
    icon: '🤝',
    roles: ['Mentor(a)', 'Terapeuta / Coach', 'Voluntário em ONGs', 'Professor(a)', 'Cuidador(a)'],
  },
  E: {
    full: 'Empreendedor',
    desc: 'Você lidera naturalmente, mobiliza recursos e pessoas, e tem energia para transformar ideias em realidade.',
    color: '#f59e0b',
    icon: '🚀',
    roles: ['Empreendedor(a) social', 'Líder de comunidade', 'Consultor(a) de negócios', 'Fundador(a) de projeto', 'Gestor(a) de impacto'],
  },
  C: {
    full: 'Estruturador',
    desc: 'Você valoriza ordem, clareza e consistência — sua habilidade de sistematizar cria a base sobre a qual tudo o mais funciona.',
    color: '#06b6d4',
    icon: '📊',
    roles: ['Gestor(a) de projetos', 'Planejador(a) financeiro', 'Administrador(a) de ONG', 'Arquivista / Documentalista', 'Organizador(a) de processos'],
  },
};

const ENVIRONMENTS = [
  'Casa / Ateliê pessoal',
  'Natureza / Campo',
  'Escola / Centro educacional',
  'Hospital / Clínica',
  'ONG / Terceiro setor',
  'Consultoria / Mentoria',
  'Espaço cultural / Biblioteca',
  'Comunidade / Associação',
  'Coworking / Startup',
  'Online / Remoto',
  'Empresa familiar',
  'Espaço espiritual / Retiro',
];

const FORCED_CHOICES = [
  {
    id: 'estrutura_vs_liberdade',
    optionA: { id: 'estrutura', text: 'Estrutura e equipe', desc: 'Prefiro ter horários definidos, papéis claros e um grupo de pessoas com quem contar, mesmo que isso reduza minha autonomia.' },
    optionB: { id: 'liberdade', text: 'Autonomia e ritmo próprio', desc: 'Prefiro trabalhar no meu tempo e do meu jeito, mesmo que isso signifique mais incerteza e isolamento em certos momentos.' },
  },
  {
    id: 'mentor_vs_executor',
    optionA: { id: 'mentor', text: 'Guiar e transmitir', desc: 'Meu maior prazer está em acompanhar outros, compartilhar experiência e ver quem aprende crescer.' },
    optionB: { id: 'executor', text: 'Executar e implementar', desc: 'Prefiro estar na linha de frente, fazendo acontecer — o prazer está no resultado concreto que crio com as próprias mãos.' },
  },
  {
    id: 'profundo_vs_amplo',
    optionA: { id: 'profundo', text: 'Impacto profundo, alcance menor', desc: 'Transformar profundamente a vida de 10 pessoas me satisfaz mais do que ter um impacto leve em 1.000.' },
    optionB: { id: 'amplo', text: 'Alcance amplo, impacto distribuído', desc: 'Prefiro que minha contribuição chegue ao maior número possível, mesmo que cada contato seja mais superficial.' },
  },
];

export default function Mission4() {
  const navigate = useNavigate();
  const { state, updatePhase, completePhase, addXP } = useApp();

  const sceneDuels: Record<string, string>    = state.phase4.sceneDuels   ?? {};
  const environments: string[]               = state.phase4.environments  ?? [];
  const forcedChoices: Record<string, string> = state.phase4.forcedChoices ?? {};

  const [step, setStep] = useState(() => {
    const duelsOk  = DUELS.every(d => sceneDuels[d.id]);
    const step1Ok  = environments.length >= 2 && Object.keys(forcedChoices).length === FORCED_CHOICES.length;
    if (duelsOk && step1Ok) return 2;
    if (duelsOk) return 1;
    return 0;
  });

  const [currentDuelIndex, setCurrentDuelIndex] = useState(() => {
    const first = DUELS.findIndex(d => !sceneDuels[d.id]);
    return first === -1 ? DUELS.length - 1 : first;
  });

  const [selectedSide, setSelectedSide] = useState<'A' | 'B' | null>(null);

  const isForcedComplete = Object.keys(forcedChoices).length === FORCED_CHOICES.length;
  const answeredCount    = DUELS.filter(d => sceneDuels[d.id]).length;

  const handleDuelSelect = (side: 'A' | 'B') => {
    if (selectedSide) return;
    const duel = DUELS[currentDuelIndex];
    const type = duel[side].type;
    setSelectedSide(side);
    const newDuels = { ...sceneDuels, [duel.id]: type };
    updatePhase('phase4', { sceneDuels: newDuels });

    setTimeout(() => {
      if (currentDuelIndex < DUELS.length - 1) {
        setCurrentDuelIndex(prev => prev + 1);
        setSelectedSide(null);
      } else {
        setSelectedSide(null);
        setTimeout(() => setStep(1), 400);
      }
    }, 750);
  };

  const toggleEnvironment = (env: string) => {
    const newEnvs = environments.includes(env)
      ? environments.filter(e => e !== env)
      : [...environments, env];
    updatePhase('phase4', { environments: newEnvs });
  };

  const handleForcedSelect = (choiceId: string, optionId: string) => {
    updatePhase('phase4', { forcedChoices: { ...forcedChoices, [choiceId]: optionId } });
  };

  const handleNextStep = () => {
    if (step === 1 && environments.length >= 2 && isForcedComplete) {
      addXP(100);
      completePhase(4);
      setStep(2);
    }
  };

  const riasecScores = Object.values(sceneDuels).reduce((acc, type) => {
    const t = type as RIASECType;
    if (RIASEC[t]) acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Partial<Record<RIASECType, number>>);

  const topTypes = (Object.entries(riasecScores) as [RIASECType, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([t]) => t);

  const hollandCode = topTypes.join('');

  const previousSide: 'A' | 'B' | null = (() => {
    const duel     = DUELS[currentDuelIndex];
    const savedType = sceneDuels[duel.id] as RIASECType | undefined;
    if (!savedType) return null;
    return duel.A.type === savedType ? 'A' : duel.B.type === savedType ? 'B' : null;
  })();

  return (
    <MissionWrapper
      videoTitle="Cenários de Vida"
      videoDescription="Escolha instintivamente — seus padrões de preferência revelam como você quer viver e contribuir."
      videoId="fase4"
    >
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── STEP 0: Duelos de cenas ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-1 flex-1">
                  {DUELS.map((d, i) => (
                    <button key={d.id}
                      onClick={() => { if (!selectedSide) { setCurrentDuelIndex(i); setSelectedSide(null); } }}
                      disabled={!!selectedSide}
                      className={cn('h-1.5 rounded-full flex-1 transition-all duration-500',
                        sceneDuels[d.id] ? 'bg-[var(--neon-cyan)] hover:opacity-70'
                          : i === currentDuelIndex ? 'bg-[var(--color-brand-400)]'
                          : 'bg-[var(--color-brand-100)] hover:bg-[var(--color-brand-200)]')}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-[var(--color-text-muted)] shrink-0">
                  {answeredCount} / {DUELS.length}
                </span>
              </div>

              <div className="text-center mb-5">
                <p className="text-sm text-[var(--color-text-muted)] mb-2">
                  Confie no primeiro impulso — qual dessas formas de viver ressoa mais com você?
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                  ● {DUELS.length} duelos — escolha 1 em cada
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={currentDuelIndex}
                  initial={{ opacity: 0, scale: 0.96, x: 30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.96, x: -30 }}
                  transition={{ duration: 0.28 }}
                  className="relative flex gap-3 md:gap-5 mb-auto">

                  {(['A', 'B'] as const).map(side => {
                    const opt       = DUELS[currentDuelIndex][side];
                    const isChosen  = selectedSide === side;
                    const isOther   = selectedSide !== null && selectedSide !== side;
                    const isPrev    = !selectedSide && previousSide === side;
                    const typeInfo  = RIASEC[opt.type];

                    return (
                      <button key={side} onClick={() => handleDuelSelect(side)} disabled={!!selectedSide}
                        className={cn('relative flex-1 rounded-2xl overflow-hidden border-2 transition-all duration-300 min-h-[260px] md:min-h-[380px] text-left',
                          isChosen  ? 'scale-[1.025] z-10'
                          : isOther ? 'opacity-30 scale-[0.975] grayscale'
                          : isPrev  ? 'opacity-80 hover:opacity-100 hover:scale-[1.01] cursor-pointer'
                          : 'hover:scale-[1.01] cursor-pointer')}
                        style={{
                          borderColor: isChosen ? typeInfo.color : isPrev ? typeInfo.color + '88' : 'rgba(255,255,255,0.12)',
                          boxShadow:   isChosen ? `0 0 28px ${typeInfo.color}44` : 'none',
                        }}>

                        {/* Imagem de fundo */}
                        <img src={opt.img} alt={opt.label} className="absolute inset-0 w-full h-full object-cover object-top" />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        {isChosen && <div className="absolute inset-0 animate-pulse" style={{ background: `${typeInfo.color}18` }} />}

                        {/* Badge de tipo */}
                        <div className="absolute top-3 left-3 text-[10px] font-black px-2 py-0.5 rounded-full bg-black/60 border"
                          style={{ color: typeInfo.color, borderColor: typeInfo.color + '55' }}>
                          {typeInfo.full}
                        </div>

                        {/* Texto na parte inferior */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="font-black text-white text-base md:text-lg mb-1 leading-tight drop-shadow-lg">
                            {opt.label}
                          </h3>
                          <p className="text-white/70 text-xs md:text-sm leading-snug drop-shadow-md line-clamp-2">
                            {opt.text}
                          </p>
                        </div>

                        {(isPrev || isChosen) && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                            style={{ background: typeInfo.color }}>
                            <span className="text-white text-[10px] font-black">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20
                                  bg-[var(--bg-dark)] border-2 border-[var(--neon-magenta)] rounded-full
                                  w-9 h-9 flex items-center justify-center text-[10px] font-black
                                  text-[var(--neon-magenta)] shadow-[0_0_12px_rgba(255,0,200,0.4)] pointer-events-none">
                    VS
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-5">
                <button onClick={() => { setCurrentDuelIndex(prev => prev - 1); setSelectedSide(null); }}
                  disabled={currentDuelIndex === 0 || !!selectedSide}
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] px-3 py-1.5 rounded-lg hover:bg-[var(--glass)] disabled:opacity-25 disabled:pointer-events-none">
                  ← Duelo anterior
                </button>
                <p className="text-xs text-[var(--color-text-muted)] font-mono">Confie no seu instinto</p>
                <div className="w-[110px]" />
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: Ambientes + Escolhas forçadas ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              {/* Ambientes */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="w-4 h-4 text-[var(--color-brand-500)]" />
                  <h3 className="font-bold text-base text-[var(--text-main)]">Onde você prefere atuar?</h3>
                  <span className="ml-auto text-xs font-mono text-[var(--color-text-muted)]">{environments.length} / 2+</span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {ENVIRONMENTS.map(env => {
                    const isSelected = environments.includes(env);
                    return (
                      <button key={env} onClick={() => toggleEnvironment(env)}
                        className={cn('p-3 rounded-xl border text-center transition-all font-medium text-xs',
                          isSelected
                            ? 'bg-[var(--color-brand-600)] border-[var(--color-brand-600)] text-[var(--bg-dark)] shadow-[var(--btn-shadow)] scale-[1.02]'
                            : 'bg-[var(--glass)] border-[var(--color-brand-100)] text-[var(--text-main)] hover:border-[var(--color-brand-300)]')}>
                        {env}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Escolhas forçadas */}
              <div className="mb-auto">
                <div className="flex items-center gap-2 mb-3">
                  <GitMerge className="w-4 h-4 text-[var(--color-brand-500)]" />
                  <h3 className="font-bold text-base text-[var(--text-main)]">Escolha forçada</h3>
                  <span className="ml-auto text-xs font-mono text-[var(--color-text-muted)]">{Object.keys(forcedChoices).length} / {FORCED_CHOICES.length}</span>
                </div>
                <div className="space-y-3">
                  {FORCED_CHOICES.map(choice => {
                    const selected = forcedChoices[choice.id];
                    return (
                      <div key={choice.id} className="grid grid-cols-2 gap-2">
                        {[choice.optionA, choice.optionB].map(opt => (
                          <button key={opt.id} onClick={() => handleForcedSelect(choice.id, opt.id)}
                            className={cn('p-4 rounded-xl border text-left transition-all h-full',
                              selected === opt.id
                                ? 'bg-[var(--color-brand-600)] border-[var(--color-brand-600)] text-[var(--bg-dark)] shadow-[var(--btn-shadow)] scale-[1.02]'
                                : 'bg-[var(--glass)] border-[var(--color-brand-100)] hover:border-[var(--color-brand-400)] text-[var(--text-main)]')}>
                            <h4 className="font-bold text-sm mb-1">{opt.text}</h4>
                            <p className={cn('text-xs leading-relaxed', selected === opt.id ? 'text-[rgba(0,0,0,0.7)]' : 'text-[var(--color-text-muted)]')}>
                              {opt.desc}
                            </p>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center pt-4 border-t border-[var(--color-brand-100)]">
                <button onClick={() => { setCurrentDuelIndex(0); setSelectedSide(null); setStep(0); }}
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)]">
                  ← Refazer duelos
                </button>
                <button onClick={handleNextStep} disabled={environments.length < 2 || !isForcedComplete}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    environments.length >= 2 && isForcedComplete
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Ver meu perfil →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Resultado RIASEC ── */}
          {step === 2 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-grow justify-center py-8">

              <div className="w-20 h-20 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-6 shadow-[var(--btn-shadow)]">
                <Map className="w-10 h-10 text-[var(--neon-cyan)]" />
              </div>

              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-2 text-center">Seu Perfil de Atuação</h2>

              {hollandCode && (
                <div className="mb-4 px-5 py-2 rounded-full bg-[var(--glass)] border border-[var(--neon-cyan)]/40 font-mono font-black text-2xl tracking-[0.3em] text-[var(--neon-cyan)]">
                  {hollandCode}
                </div>
              )}

              <p className="text-[var(--color-text-muted)] max-w-md text-center leading-relaxed mb-8 text-sm">
                Seu código combina os três perfis dominantes. Quanto mais sua atuação se alinhar a esses perfis, mais natural e sustentável ela será.
              </p>

              <div className="flex flex-col gap-4 w-full max-w-lg mb-8">
                {topTypes.map((type, idx) => {
                  const info  = RIASEC[type];
                  const score = riasecScores[type] || 0;
                  return (
                    <motion.div key={type} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.15 }}
                      className="bg-[var(--glass)] border rounded-xl p-5 flex items-start gap-4"
                      style={{ borderColor: info.color + '44' }}>
                      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black border-2"
                        style={{ borderColor: info.color, color: info.color, background: info.color + '18' }}>
                        {idx === 0 ? '①' : idx === 1 ? '②' : '③'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{info.icon}</span>
                          <span className="font-black" style={{ color: info.color }}>{type} — {info.full}</span>
                          <span className="ml-auto text-xs font-mono text-[var(--color-text-muted)]">{score}/{DUELS.length}</span>
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] leading-snug mb-2">{info.desc}</p>
                        <div className="flex flex-wrap gap-1">
                          {info.roles.slice(0, 3).map(r => (
                            <span key={r} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                              style={{ background: info.color + '22', color: info.color }}>
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="w-full max-w-lg mb-10">
                <p className="text-xs font-mono text-[var(--color-text-muted)] mb-3 uppercase tracking-widest text-center">Distribuição completa</p>
                <div className="grid grid-cols-6 gap-2">
                  {(['R', 'I', 'A', 'S', 'E', 'C'] as RIASECType[]).map(t => {
                    const score = riasecScores[t] || 0;
                    const pct   = (score / 4) * 100;
                    const info  = RIASEC[t];
                    return (
                      <div key={t} className="flex flex-col items-center gap-1">
                        <div className="w-full bg-[var(--color-brand-100)] rounded-full h-16 relative overflow-hidden">
                          <div className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-700"
                            style={{ height: `${pct}%`, background: info.color + 'cc' }} />
                        </div>
                        <span className="text-xs font-black" style={{ color: info.color }}>{t}</span>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono">{score}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button onClick={() => navigate('/comecar/fase/5')}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform">
                Avançar para Fase 5 →
              </button>

              <button onClick={() => { setCurrentDuelIndex(0); setSelectedSide(null); setStep(0); }}
                className="mt-4 text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] px-4 py-2 rounded-lg hover:bg-[var(--glass)]">
                ← Refazer duelos
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
