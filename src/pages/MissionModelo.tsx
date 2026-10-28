import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Coins, Users, Target, Rocket, Sparkles } from 'lucide-react';
import { useApp } from '../store';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { MissionWrapper } from '../components/MissionWrapper';

// Como a sua contribuição vira algo que alguém recebe
const OFFER_FORMATS = [
  { id: 'servico_1a1',  label: 'Serviço ou atendimento 1:1',            emoji: '🤝', hint: 'consultoria, mentoria, cuidado' },
  { id: 'oficina',      label: 'Oficinas, cursos ou aulas',             emoji: '🎓', hint: 'presenciais ou ao vivo' },
  { id: 'produto',      label: 'Produto físico ou artesanal',           emoji: '🧵', hint: 'algo que você cria com as mãos' },
  { id: 'conteudo',     label: 'Conteúdo ou assinatura',               emoji: '🎙️', hint: 'podcast, canal, newsletter' },
  { id: 'consultoria',  label: 'Projetos para empresas',                emoji: '💼', hint: 'consultoria, assessoria' },
  { id: 'experiencia',  label: 'Experiências e eventos',                emoji: '🎪', hint: 'passeios, encontros, retiros' },
  { id: 'intermediacao',label: 'Conectar pessoas e negócios',           emoji: '🔗', hint: 'intermediação, comissão' },
  { id: 'digital',      label: 'Produto digital',                       emoji: '💻', hint: 'e-book, curso gravado, template' },
];

// Quem paga (cliente — pode ser diferente de quem você quer impactar)
const PAYERS = [
  { id: 'pessoas',       label: 'Pessoas físicas',              emoji: '🙋' },
  { id: 'familias',      label: 'Famílias',                     emoji: '👨‍👩‍👧' },
  { id: 'empresas',      label: 'Empresas e negócios',          emoji: '🏢' },
  { id: 'escolas_ongs',  label: 'Escolas, ONGs e instituições', emoji: '🏫' },
  { id: 'poder_publico', label: 'Poder público / prefeituras',  emoji: '⚖️' },
  { id: 'turistas',      label: 'Turistas e visitantes',        emoji: '✈️' },
  { id: 'profissionais', label: 'Outros profissionais',         emoji: '💼' },
  { id: 'plataformas',   label: 'Marcas e plataformas',         emoji: '🌐' },
];

// Nível de ambição / tempo de dedicação
const AMBITIONS = [
  { id: 'extra_leve',   label: 'Renda extra leve',        desc: 'Poucas horas por semana, no meu ritmo.',       emoji: '🌱' },
  { id: 'meio_periodo', label: 'Atividade significativa', desc: 'Meio período — uma ocupação de verdade.',       emoji: '⏳' },
  { id: 'principal',    label: 'Nova fonte principal',    desc: 'Dedicação alta, quero que vire meu sustento.', emoji: '🚀' },
];

// Meta financeira aproximada (mensal)
const GOALS = [
  { id: 'ate_1k',   label: 'Até R$ 1.000 / mês' },
  { id: '1k_3k',    label: 'R$ 1.000 a 3.000 / mês' },
  { id: '3k_6k',    label: 'R$ 3.000 a 6.000 / mês' },
  { id: 'acima_6k', label: 'Acima de R$ 6.000 / mês' },
  { id: 'nao_sei',  label: 'Ainda não sei — quero descobrir' },
];

// Ativos que já possui (reduzem a fricção do começo)
const ASSETS = [
  { id: 'rede',              label: 'Rede de contatos e indicações',    emoji: '📇' },
  { id: 'reputacao',         label: 'Reputação na minha área',          emoji: '🏅' },
  { id: 'audiencia',         label: 'Audiência (redes, lista)',         emoji: '📣' },
  { id: 'capital',           label: 'Capital para investir no começo',  emoji: '💰' },
  { id: 'espaco',            label: 'Espaço físico (sala, ateliê)',     emoji: '🏠' },
  { id: 'equipamento',       label: 'Equipamentos e ferramentas',       emoji: '🛠️' },
  { id: 'tempo',             label: 'Tempo livre disponível',           emoji: '⏰' },
  { id: 'experiencia_setor', label: 'Experiência profunda no setor',    emoji: '📚' },
];

type Step = 'offer' | 'model' | 'done';

export default function MissionModelo() {
  const navigate = useNavigate();
  const { state, updatePhase, completePhase, addXP } = useApp();

  const bm = state.businessModel ?? { offerFormats: [], payer: [], ambition: '', financialGoal: '', assets: [] };
  const offerFormats: string[] = bm.offerFormats ?? [];
  const payer: string[]        = bm.payer ?? [];
  const assets: string[]       = bm.assets ?? [];
  const ambition               = bm.ambition ?? '';
  const financialGoal          = bm.financialGoal ?? '';

  const [step, setStep] = useState<Step>(() => {
    if (ambition && financialGoal) return 'done';
    if (offerFormats.length > 0 && payer.length > 0) return 'model';
    return 'offer';
  });

  const toggle = (key: 'offerFormats' | 'payer' | 'assets', list: string[], id: string) => {
    const next = list.includes(id) ? list.filter(x => x !== id) : [...list, id];
    updatePhase('businessModel', { [key]: next });
  };

  const offerReady = offerFormats.length > 0 && payer.length > 0;
  const modelReady = !!ambition && !!financialGoal;

  const handleFinish = () => {
    addXP(100);
    completePhase(7);
    setStep('done');
  };

  return (
    <MissionWrapper
      videoTitle="O Modelo da Reinvenção"
      videoDescription="Vamos transformar quem você é em algo que gera valor — e renda — no mundo real."
      videoId="modelo"
    >
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── Passo 1: Oferta + Quem paga ── */}
          {step === 'offer' && (
            <motion.div key="offer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-5 mb-6 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Sua oferta</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                    Sua experiência só vira renda quando toma a forma de algo concreto que alguém recebe. Como a sua contribuição pode chegar às pessoas?
                  </p>
                </div>
              </div>

              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-brand-500)]">Formato da oferta</span>
                <span className="text-[11px] text-[var(--color-text-muted)]">· escolha 1 a 3</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {OFFER_FORMATS.map(opt => {
                  const active = offerFormats.includes(opt.id);
                  return (
                    <button key={opt.id} onClick={() => toggle('offerFormats', offerFormats, opt.id)}
                      className={cn('p-4 rounded-xl border text-left transition-all flex items-start gap-3',
                        active
                          ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)] scale-[1.02]'
                          : 'border-white/10 bg-[var(--glass)] hover:border-white/25')}>
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <span className="leading-tight">
                        <span className={cn('text-sm font-medium block', active ? 'text-[var(--text-main)]' : 'text-[var(--color-text-muted)]')}>
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-[var(--color-text-muted)] opacity-70">{opt.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mb-3 flex items-center gap-2">
                <Coins className="w-4 h-4 text-[var(--color-brand-500)]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-brand-500)]">Quem paga</span>
                <span className="text-[11px] text-[var(--color-text-muted)]">· o cliente pode não ser quem você impacta</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6 flex-grow">
                {PAYERS.map(opt => {
                  const active = payer.includes(opt.id);
                  return (
                    <button key={opt.id} onClick={() => toggle('payer', payer, opt.id)}
                      className={cn('p-3.5 rounded-xl border text-left transition-all flex items-center gap-3',
                        active
                          ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)] scale-[1.02]'
                          : 'border-white/10 bg-[var(--glass)] hover:border-white/25')}>
                      <span className="text-xl shrink-0">{opt.emoji}</span>
                      <span className={cn('text-sm font-medium leading-tight', active ? 'text-[var(--text-main)]' : 'text-[var(--color-text-muted)]')}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[var(--color-brand-100)]">
                <span className="text-sm font-mono opacity-60">{offerFormats.length + payer.length} selecionados</span>
                <button onClick={() => setStep('model')} disabled={!offerReady}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    offerReady
                      ? 'bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)]'
                      : 'bg-[var(--glass)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-brand-200)]')}>
                  Próxima Etapa
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Passo 2: Ambição + Meta + Ativos ── */}
          {step === 'model' && (
            <motion.div key="model" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-5 mb-6 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Sua ambição</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                    Não existe tamanho certo — existe o que faz sentido para a sua vida agora. Quanto você quer que isso ocupe e renda?
                  </p>
                </div>
              </div>

              <div className="mb-3 text-xs font-mono uppercase tracking-widest text-[var(--color-brand-500)]">Quanto quer que ocupe</div>
              <div className="grid gap-3 mb-8">
                {AMBITIONS.map(opt => {
                  const active = ambition === opt.id;
                  return (
                    <button key={opt.id} onClick={() => updatePhase('businessModel', { ambition: opt.id })}
                      className={cn('p-4 rounded-xl border text-left transition-all flex items-center gap-4',
                        active
                          ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)] scale-[1.01]'
                          : 'border-white/10 bg-[var(--glass)] hover:border-white/25')}>
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <span className="leading-tight">
                        <span className={cn('text-sm font-bold block', active ? 'text-[var(--text-main)]' : 'text-[var(--color-text-muted)]')}>{opt.label}</span>
                        <span className="text-xs text-[var(--color-text-muted)] opacity-80">{opt.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mb-3 flex items-center gap-2">
                <Coins className="w-4 h-4 text-[var(--color-brand-500)]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-brand-500)]">Meta de renda</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {GOALS.map(opt => {
                  const active = financialGoal === opt.id;
                  return (
                    <button key={opt.id} onClick={() => updatePhase('businessModel', { financialGoal: opt.id })}
                      className={cn('px-4 py-2.5 rounded-full border text-sm font-medium transition-all',
                        active
                          ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-600)] text-[var(--bg-dark)] shadow-[var(--btn-shadow)]'
                          : 'border-white/10 bg-[var(--glass)] text-[var(--color-text-muted)] hover:border-white/25')}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <div className="mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--color-brand-500)]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-brand-500)]">O que você já tem</span>
                <span className="text-[11px] text-[var(--color-text-muted)]">· opcional</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6 flex-grow">
                {ASSETS.map(opt => {
                  const active = assets.includes(opt.id);
                  return (
                    <button key={opt.id} onClick={() => toggle('assets', assets, opt.id)}
                      className={cn('p-3.5 rounded-xl border text-left transition-all flex items-center gap-3',
                        active
                          ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)] scale-[1.02]'
                          : 'border-white/10 bg-[var(--glass)] hover:border-white/25')}>
                      <span className="text-xl shrink-0">{opt.emoji}</span>
                      <span className={cn('text-sm font-medium leading-tight', active ? 'text-[var(--text-main)]' : 'text-[var(--color-text-muted)]')}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[var(--color-brand-100)]">
                <button onClick={() => setStep('offer')} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] py-1">
                  ← Voltar
                </button>
                <button onClick={handleFinish} disabled={!modelReady}
                  className={cn('px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all',
                    modelReady
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
              <div className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)] text-[var(--neon-cyan)]">
                <Rocket className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Modelo Esboçado</h2>
              <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-10 leading-relaxed">
                Você acabou de desenhar os contornos do seu Plano de Reinvenção: o que oferece, para quem, e com que ambição. É daqui que nasce a próxima renda.
              </p>

              <div className="w-full max-w-md space-y-4 mb-10">
                {offerFormats.length > 0 && (
                  <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Sua oferta</p>
                    <div className="flex flex-wrap gap-1.5">
                      {offerFormats.map(id => {
                        const o = OFFER_FORMATS.find(x => x.id === id);
                        return o ? (
                          <span key={id} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)] font-medium">
                            {o.emoji} {o.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                {payer.length > 0 && (
                  <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Quem paga</p>
                    <div className="flex flex-wrap gap-1.5">
                      {payer.map(id => {
                        const o = PAYERS.find(x => x.id === id);
                        return o ? (
                          <span key={id} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)] font-medium">
                            {o.emoji} {o.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                {(ambition || financialGoal) && (
                  <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Ambição e meta</p>
                    <p className="text-sm text-[var(--text-main)]">
                      {AMBITIONS.find(a => a.id === ambition)?.label}
                      {financialGoal && <span className="text-[var(--color-text-muted)]"> · {GOALS.find(g => g.id === financialGoal)?.label}</span>}
                    </p>
                  </div>
                )}
              </div>

              <button onClick={() => navigate('/comecar/fase/8')}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform flex items-center gap-2">
                Avançar para Fase 8 <Sparkles className="w-5 h-5" />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
