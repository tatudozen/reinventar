import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Flame, Briefcase, Compass, Check, CheckCircle2 } from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MissionWrapper } from '../components/MissionWrapper';

// Nichos de mercado genéricos para um negócio de uma pessoa só
const NICHES = [
  { id: 'saude',          label: 'Saúde & Bem-estar',          emoji: '🧘', examples: ['longevidade', 'saúde da mulher 50+', 'nutrição', 'saúde mental'] },
  { id: 'financas',       label: 'Finanças & Dinheiro',        emoji: '💰', examples: ['aposentadoria', 'educação financeira', 'investimentos simples'] },
  { id: 'carreira',       label: 'Carreira & Trabalho',        emoji: '💼', examples: ['recolocação 50+', 'transição de carreira', 'freelancer'] },
  { id: 'educacao',       label: 'Educação & Ensino',          emoji: '📚', examples: ['reforço escolar', 'idiomas', 'oficinas para adultos'] },
  { id: 'relacionamentos',label: 'Relacionamentos & Família',  emoji: '❤️', examples: ['casais', 'maternidade/paternidade', 'cuidado com idosos'] },
  { id: 'casa',           label: 'Casa & Organização',         emoji: '🏠', examples: ['organização', 'jardinagem', 'reformas', 'decoração'] },
  { id: 'arte',           label: 'Arte & Criatividade',        emoji: '🎨', examples: ['artesanato', 'escrita', 'música', 'fotografia'] },
  { id: 'negocios',       label: 'Negócios & Empreendedorismo',emoji: '🚀', examples: ['pequenos negócios locais', 'marketing', 'vendas'] },
  { id: 'desenvolvimento',label: 'Desenvolvimento Pessoal',    emoji: '🌱', examples: ['propósito', 'hábitos', 'espiritualidade', 'autoconhecimento'] },
  { id: 'lazer',          label: 'Lazer, Viagem & Hobbies',    emoji: '✈️', examples: ['turismo', 'culinária', 'esportes', 'colecionismo'] },
  { id: 'tecnologia',     label: 'Tecnologia & Digital',       emoji: '💻', examples: ['inclusão digital 60+', 'redes sociais', 'IA no dia a dia'] },
  { id: 'natureza',       label: 'Natureza, Pets & Sustentabilidade', emoji: '🌿', examples: ['pets', 'horta', 'consumo consciente'] },
];

// Chapéu que o(a) dono(a) do negócio mais veste (CEO do negócio de uma pessoa só)
const CARGOS = [
  { id: 'especialista', name: 'O(A) Especialista', profile: 'Entrego meu conhecimento direto: consultoria, mentoria, diagnóstico.' },
  { id: 'criador',      name: 'O(A) Criador(a)',   profile: 'Crio produtos, conteúdo e soluções com a minha marca.' },
  { id: 'vendedor',     name: 'O(A) Conector(a)',  profile: 'Faço acontecer: vendo, fecho parcerias e conecto pessoas.' },
  { id: 'organizador',  name: 'O(A) Organizador(a)', profile: 'Estruturo, planejo e faço a operação rodar com ordem.' },
  { id: 'mao_na_massa', name: 'Mão na Massa',      profile: 'Produzo e executo com as próprias mãos, no detalhe.' },
  { id: 'cuidador',     name: 'O(A) Cuidador(a)',  profile: 'Atendo e cuido das pessoas de perto, com presença.' },
];

// Dores genéricas que um negócio pode resolver (sem foco em público — isso vem na Fase 5)
const PROBLEMS = [
  { id: 'conhecimento', text: 'Falta de conhecimento ou orientação', desc: 'As pessoas não sabem por onde começar nem em quem confiar.' },
  { id: 'tempo',        text: 'Falta de tempo e sobrecarga',          desc: 'Vida corrida: precisam de ajuda para resolver mais rápido.' },
  { id: 'renda',        text: 'Dificuldade financeira ou pouca renda', desc: 'Querem ganhar mais, gastar melhor ou criar uma nova fonte.' },
  { id: 'conexao',      text: 'Solidão ou falta de conexão',          desc: 'Faltam vínculos, comunidade e pertencimento.' },
  { id: 'saude',        text: 'Falta de saúde ou bem-estar',          desc: 'Querem viver com mais energia, equilíbrio e qualidade.' },
  { id: 'metodo',       text: 'Desorganização ou falta de método',    desc: 'Têm vontade, mas não têm um caminho claro para seguir.' },
  { id: 'confianca',    text: 'Falta de confiança ou autoestima',     desc: 'Precisam de apoio para dar o próximo passo com segurança.' },
  { id: 'aprender',     text: 'Dificuldade de aprender algo novo',    desc: 'Querem dominar uma habilidade, mas se sentem perdidas.' },
  { id: 'acesso',       text: 'Falta de acesso a oportunidades',      desc: 'Não encontram a porta de entrada que procuram.' },
];

export default function Mission3() {
  const navigate = useNavigate();
  const { state, updatePhase, completePhase, addXP } = useApp();

  const niche    = state.phase3.niche    || '';
  const subNiche = state.phase3.subNiche || '';
  const cargo    = state.phase3.cargo    || '';

  // Steps: 0 = nicho + sub-nicho + chapéu · 1 = a dor que resolve · 2 = conclusão
  const [step, setStep] = useState(() => {
    if (state.phase3.uniqueProblem) return 2;
    if (niche && cargo) return 1;
    return 0;
  });

  const [customNiche, setCustomNiche] = useState(() =>
    NICHES.some(n => n.label === niche) ? '' : niche,
  );
  const [customProblem, setCustomProblem] = useState(() =>
    PROBLEMS.some(p => p.text === state.phase3.uniqueProblem) ? '' : (state.phase3.uniqueProblem || ''),
  );
  const [selectedProblem, setSelectedProblem] = useState<string | null>(
    state.phase3.uniqueProblem || null,
  );

  const selectedNicheObj = NICHES.find(n => n.label === niche);

  const handleNextStep = () => {
    if (step === 0 && niche && cargo) setStep(1);
    else if (step === 1) {
      const problem = (customProblem.trim() || selectedProblem || '').trim();
      if (!problem) return;
      updatePhase('phase3', { uniqueProblem: problem });
      addXP(100);
      completePhase(3);
      setStep(2);
    }
  };

  const chooseNiche = (label: string) => {
    updatePhase('phase3', { niche: label });
    setCustomNiche('');
  };

  return (
    <MissionWrapper
      videoTitle="A Dor que Você Resolve"
      videoDescription="Todo negócio nasce num nicho e resolve uma dor real. Vamos achar o seu território — e o problema que as pessoas pagariam para resolver."
      videoId="fase3"
    >
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── STEP 0: Nicho + Sub-nicho + Chapéu de dono(a) ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              {/* Nicho */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Compass className="w-4 h-4 text-[var(--color-brand-500)]" />
                  <h3 className="font-bold text-base text-[var(--text-main)]">Qual o nicho do seu negócio?</h3>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mb-3 leading-relaxed">
                  O território de mercado onde você vai atuar. Escolha um ou digite o seu.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {NICHES.map(n => {
                    const active = niche === n.label;
                    return (
                      <button key={n.id} onClick={() => chooseNiche(n.label)}
                        className={cn('relative rounded-xl border p-3 text-center transition-all',
                          active
                            ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)]'
                            : 'border-[var(--color-brand-200)] hover:border-[var(--color-brand-400)] bg-[rgba(255,255,255,0.03)]')}>
                        {active && <Check className="w-3 h-3 text-[var(--color-brand-500)] absolute top-1.5 right-1.5" />}
                        <div className="text-2xl mb-1">{n.emoji}</div>
                        <div className="text-xs font-semibold text-[var(--text-main)] leading-tight">{n.label}</div>
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={customNiche}
                  onChange={e => { setCustomNiche(e.target.value); updatePhase('phase3', { niche: e.target.value }); }}
                  placeholder="Ou digite outro nicho…"
                  className="w-full rounded-xl border border-[var(--color-brand-200)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand-500)] focus:outline-none"
                />
              </div>

              {/* Sub-nicho */}
              <div className="mb-6">
                <h3 className="font-bold text-base text-[var(--text-main)] mb-1">Dá para ser mais específico? (sub-nicho)</h3>
                <p className="text-xs text-[var(--color-text-muted)] mb-3 leading-relaxed">
                  Quanto mais afunilado, mais fácil se destacar. Opcional.
                </p>
                <input
                  type="text"
                  value={subNiche}
                  onChange={e => updatePhase('phase3', { subNiche: e.target.value })}
                  placeholder="Ex.: longevidade, recolocação 50+, organização de casa…"
                  className="w-full rounded-xl border border-[var(--color-brand-200)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand-500)] focus:outline-none mb-2"
                />
                {selectedNicheObj && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNicheObj.examples.map(ex => (
                      <button key={ex} onClick={() => updatePhase('phase3', { subNiche: ex })}
                        className="text-xs px-2.5 py-1 rounded-full border border-[var(--color-brand-200)] text-[var(--color-text-muted)] hover:border-[var(--color-brand-400)] hover:text-[var(--text-main)] transition-colors">
                        {ex}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Chapéu de dono(a) */}
              <div className="mb-auto">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-[var(--color-brand-500)]" />
                  <h3 className="font-bold text-base text-[var(--text-main)]">No seu negócio, você é o(a) dono(a). Qual chapéu veste melhor?</h3>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mb-3 leading-relaxed">
                  Você será o CEO do seu negócio de uma pessoa só. Escolha a função que mais combina — o resto dá para delegar com o tempo.
                </p>
                <div className="space-y-2">
                  {CARGOS.map(c => {
                    const active = cargo === c.id;
                    return (
                      <button key={c.id} onClick={() => updatePhase('phase3', { cargo: c.id })}
                        className={cn('w-full text-left rounded-xl border p-3 flex items-start gap-3 transition-all',
                          active
                            ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)]'
                            : 'border-[var(--color-brand-200)] hover:border-[var(--color-brand-400)] bg-[rgba(255,255,255,0.03)]')}>
                        <div className={cn('w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center',
                          active ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-500)]' : 'border-[var(--color-brand-300)]')}>
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
                <button onClick={handleNextStep} disabled={!niche || !cargo}
                  className="px-8 py-3 bg-[var(--color-brand-600)] text-white rounded-xl font-medium hover:opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Escolher minha dor →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: A Dor que Você Resolve ── */}
          {step === 1 && (
            <motion.div key="step1problem" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-grow">

              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl text-[var(--text-main)] mb-2">A Dor que Você Resolve</h3>
                <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
                  Que dor real o seu negócio{niche ? ` em ${niche}` : ''} vai resolver? Escolha uma possibilidade ou descreva a sua.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 flex-grow">
                {PROBLEMS.map(p => {
                  const isSelected = selectedProblem === p.text && !customProblem.trim();
                  return (
                    <button key={p.id} onClick={() => { setSelectedProblem(p.text); setCustomProblem(''); }}
                      className={cn('text-left rounded-2xl border-2 p-5 transition-all duration-200',
                        isSelected
                          ? 'border-[var(--color-brand-500)] bg-[var(--glass)] scale-[1.02] shadow-[var(--btn-shadow)]'
                          : 'border-white/10 bg-[var(--glass)] hover:border-white/25')}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[var(--color-brand-100)] text-[var(--color-brand-600)] border border-[var(--color-brand-200)]">
                          <Target className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-[var(--text-main)] text-sm leading-tight">{p.text}</h4>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{p.desc}</p>
                      {isSelected && (
                        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selecionado
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mb-6">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--color-brand-500)] block mb-2">
                  Ou descreva a dor que você quer resolver
                </label>
                <input
                  type="text"
                  value={customProblem}
                  onChange={e => { setCustomProblem(e.target.value); if (e.target.value.trim()) setSelectedProblem(null); }}
                  placeholder="Ex.: ajudar aposentados a transformar um hobby em renda"
                  className="w-full rounded-xl border border-[var(--color-brand-200)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand-500)] focus:outline-none"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[var(--color-brand-100)]">
                <button onClick={() => setStep(0)}
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--text-main)] py-1">
                  ← Voltar
                </button>
                <motion.button
                  animate={{ opacity: (customProblem.trim() || selectedProblem) ? 1 : 0.3 }}
                  disabled={!(customProblem.trim() || selectedProblem)}
                  onClick={handleNextStep}
                  className="px-8 py-3 rounded-xl font-bold uppercase tracking-wider bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)] disabled:pointer-events-none">
                  Confirmar →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Conclusão ── */}
          {step === 2 && (
            <motion.div key="step2done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-grow justify-center py-10">
              <div className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)]">
                <Flame className="w-12 h-12 text-[var(--neon-magenta)]" />
              </div>
              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Dor Encontrada</h2>
              <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-6 leading-relaxed">
                Todo negócio começa resolvendo uma dor real num nicho claro. Sua experiência é a ferramenta certa para o problema certo.
              </p>
              <div className="w-full max-w-md space-y-3 mb-8">
                {niche && (
                  <div className="px-6 py-3 rounded-xl bg-[var(--glass)] border border-[var(--color-brand-300)] text-center">
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Seu nicho</p>
                    <p className="font-bold text-[var(--text-main)]">{niche}{subNiche ? ` · ${subNiche}` : ''}</p>
                  </div>
                )}
                {state.phase3.uniqueProblem && (
                  <div className="px-6 py-3 rounded-xl bg-[var(--glass)] border border-[var(--color-brand-300)] text-center">
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-1">A dor que você resolve</p>
                    <p className="font-bold text-[var(--text-main)]">{state.phase3.uniqueProblem}</p>
                  </div>
                )}
              </div>
              <button onClick={() => navigate('/comecar/fase/4')}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform">
                Avançar para Fase 4 →
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
