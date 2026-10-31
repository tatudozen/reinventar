import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Send } from 'lucide-react';
import { supabase } from '../supabase';
import { useApp } from '../store';
import { MentorVideo } from '../components/MentorVideo';
import { ShareQuizLink } from '../components/ShareQuizLink';

// Webhook do N8N que gera o Relatório Profundo via IA.
// Recebe apenas o jornada_id; N8N busca nome/e-mail/dados com service_role.
const SURVEY_WEBHOOK_URL = 'https://webhook.alquimiazen.com.br/webhook/reinventar-report';

const PERFIL_OPTIONS = [
  'Aposentado(a) buscando novo propósito',
  'Ainda trabalhando, mas planejando a transição',
  'Empreendedor(a) querendo reinventar o negócio ou a carreira',
  'Cuidador(a) retomando a própria vida (filhos crescidos, luto, etc.)',
  'Outro momento de transição ou mudança',
];

const CLAREZA_OPTIONS = [
  'Com MAIS clareza sobre meus próximos passos',
  'Igual — nada mudou',
  'Com MAIS dúvidas do que antes',
];

const FASES = [
  'Fase 1 — Mapa de Energia',
  'Fase 2 — Talentos na Mochila',
  'Fase 3 — Cenários de Vida',
  'Fase 4 — O Garimpo',
  'Fase 5 — A Dor que Você Resolve',
  'Fase 6 — Público e Cliente',
  'Fase 7 — O Modelo da Reinvenção',
  'Fase 8 — A Carta para o Eu de Amanhã',
];

const PRECISAO_OPTIONS = [
  'Muito eu — me reconheci na hora',
  'Parcialmente eu — acertou umas coisas, errou outras',
  'Não me reconheci no resultado',
];

const TAMANHO_OPTIONS = [
  'Poderia ser MAIOR — queria explorar mais',
  'Está no tamanho certo',
  'Poderia ser MENOR — senti que foi longa',
];

const SUPORTE_OPTIONS = [
  'Mentoria individual com especialista',
  'Grupo de pessoas na mesma fase de vida',
  'Cursos ou formações online',
  'Oportunidades de voluntariado',
  'Networking com pessoas da minha área',
  'Conteúdo sobre como usar IA no dia a dia',
];

const optionCls = (selected: boolean) =>
  `w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
    selected
      ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-50)] text-[var(--color-brand-700)] font-medium'
      : 'border-stone-200 text-stone-600 hover:border-[var(--color-brand-300)] hover:bg-stone-50'
  }`;

export default function SatisfactionSurvey() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [searchParams] = useSearchParams();
  const jornadaId = searchParams.get('id') || localStorage.getItem('reinventar_jornada_id');

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState<boolean | null>(null);
  const [tenantConfig, setTenantConfig] = useState<{ explore_label: string; explore_url: string } | null>(null);

  useEffect(() => {
    supabase
      .schema('public')
      .from('tenant_configs')
      .select('explore_label, explore_url')
      .eq('host', window.location.hostname)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.explore_label && data?.explore_url) setTenantConfig(data);
      });
  }, []);

  useEffect(() => {
    if (!jornadaId) { setAlreadyCompleted(false); return; }
    supabase
      .rpc('is_survey_completed', { p_id: jornadaId })
      .then(({ data }) => setAlreadyCompleted(data === true));
  }, [jornadaId]);

  // Form state
  const [perfil,        setPerfil]        = useState('');
  const [nps,           setNps]           = useState<number | null>(null);
  const [clareza,       setClareza]       = useState('');
  const [faseFav,       setFaseFav]       = useState('');
  const [dificuldade,   setDificuldade]   = useState('');
  const [precisao,      setPrecisao]      = useState('');
  const [tamanho,       setTamanho]       = useState('');
  const [sugestao,      setSugestao]      = useState('');
  const [comunidadeIA,  setComunidadeIA]  = useState<boolean | null>(null);
  const [suporte,       setSuporte]       = useState<string[]>([]);

  const toggleSuporte = (opt: string) =>
    setSuporte(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);

  const canSubmit = perfil && nps !== null && clareza && faseFav && precisao && tamanho && comunidadeIA !== null;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const { error: insertError } = await supabase.from('jornada_surveys').insert({
      jornada_id:       jornadaId ?? null,
      perfil,
      nps,
      clareza,
      fase_fav:         faseFav,
      dificuldade:      dificuldade.trim() || null,
      precisao,
      tamanho_jornada:  tamanho,
      sugestao:         sugestao.trim() || null,
      comunidade_ia:    comunidadeIA,
      suporte_desejado: suporte.length ? suporte : null,
    });
    if (insertError) {
      console.error('Erro ao salvar pesquisa:', insertError.code, insertError.message);
    }

    // Dispara N8N para gerar relatório aprofundado — N8N busca nome/e-mail com service_role
    try {
      await fetch(SURVEY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jornada_id:  jornadaId ?? undefined,
          first_name:  state.user?.name?.trim().split(/\s+/)[0] || undefined,
        }),
      });
    } catch (err) {
      console.error('Erro ao disparar webhook de relatório:', err);
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (alreadyCompleted === null && !submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-stone-400 text-sm">Carregando...</p>
      </div>
    );
  }

  // ── Já respondeu ─────────────────────────────────────────────────────────────
  if (alreadyCompleted && !submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-600)] flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl text-[var(--text-main)] mb-3">Pesquisa já Respondida</h2>
        <p className="text-stone-500 mb-8 leading-relaxed">
          Você já respondeu a pesquisa desta jornada. Em breve você receberá seu relatório aprofundado.
        </p>
        {jornadaId && (
          <button
            onClick={() => navigate(`/resultado/${jornadaId}`)}
            className="px-6 py-3 bg-[var(--color-brand-600)] text-white rounded-[4px] font-medium hover:bg-[var(--color-brand-700)] transition-colors"
          >
            Voltar ao Resultado →
          </button>
        )}
      </div>
    );
  }

  // ── Confirmação pós-envio ─────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-600)] flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl text-[var(--text-main)] mb-3">Obrigado!</h2>
        <p className="text-stone-500 mb-8 leading-relaxed">
          Sua opinião vai nos ajudar a tornar a Jornada ainda melhor. Em breve você receberá seu
          relatório aprofundado gerado por IA.
        </p>

        <MentorVideo
          title="Uma última mensagem"
          description="Assista antes de continuar sua jornada."
          videoId="pesquisa_obrigado"
        />

        {jornadaId && (
          <div className="w-full mb-8">
            <ShareQuizLink jornadaId={jornadaId} />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {jornadaId && (
            <button
              onClick={() => navigate(`/resultado/${jornadaId}`)}
              className="px-6 py-3 bg-[var(--color-brand-600)] text-white rounded-[4px] font-medium hover:bg-[var(--color-brand-700)] transition-colors"
            >
              Voltar ao Resultado →
            </button>
          )}
          {tenantConfig ? (
            <a
              href={/^https?:\/\//.test(tenantConfig.explore_url) ? tenantConfig.explore_url : '#'}
              rel="noreferrer noopener"
              className="px-6 py-3 border border-stone-200 text-stone-600 rounded-[4px] font-medium hover:bg-stone-50 transition-colors"
            >
              {tenantConfig.explore_label}
            </a>
          ) : (
            <button onClick={() => navigate('/')}
              className="px-6 py-3 border border-stone-200 text-stone-600 rounded-[4px] font-medium hover:bg-stone-50 transition-colors">
              Retornar ao Início
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Formulário ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      <div className="mb-8">
        <p className="text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-2">
          Pesquisa de Satisfação
        </p>
        <h1 className="font-serif text-3xl text-[var(--text-main)] mb-2">Como foi sua Jornada?</h1>
        <p className="text-stone-500 text-sm">Leva menos de 2 minutos. Sua resposta molda as próximas versões e libera seu relatório aprofundado.</p>
      </div>

      <div className="space-y-8">

        {/* Q1 — Perfil */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-3">
            1. Qual é o seu momento de vida agora?
          </p>
          <div className="space-y-2">
            {PERFIL_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setPerfil(opt)} className={optionCls(perfil === opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q2 — NPS */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-3">
            2. De 0 a 10, o quanto você recomendaria o Reinventar para um amigo ou familiar?
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => setNps(i)}
                className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
                  nps === i
                    ? 'bg-[var(--color-brand-600)] text-white border-[var(--color-brand-600)]'
                    : 'border-stone-200 text-stone-600 hover:border-[var(--color-brand-300)]'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-stone-400">Improvável</span>
            <span className="text-xs text-stone-400">Muito provável</span>
          </div>
        </div>

        {/* Q3 — Clareza */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-3">
            3. Depois da Jornada, você se sente...
          </p>
          <div className="space-y-2">
            {CLAREZA_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setClareza(opt)} className={optionCls(clareza === opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q4 — Fase favorita */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-3">
            4. Qual fase você MAIS gostou?
          </p>
          <div className="space-y-2">
            {FASES.map(opt => (
              <button key={opt} onClick={() => setFaseFav(opt)} className={optionCls(faseFav === opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q5 — Dificuldade (opcional) */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-1">
            5. Em algum momento você quase desistiu ou ficou confuso? Onde?
          </p>
          <p className="text-xs text-stone-400 mb-3">Opcional</p>
          <textarea
            value={dificuldade}
            onChange={e => setDificuldade(e.target.value)}
            placeholder="Ex: em uma das fases não entendi bem o que fazer..."
            rows={3}
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:border-[var(--color-brand-400)] transition-colors resize-none"
          />
        </div>

        {/* Q6 — Precisão */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-3">
            6. O resultado final (Síntese da Reinvenção + análise de convergência) pareceu...
          </p>
          <div className="space-y-2">
            {PRECISAO_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setPrecisao(opt)} className={optionCls(precisao === opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q7 — Tamanho */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-3">
            7. E o tamanho da Jornada? Você achou que ela...
          </p>
          <div className="space-y-2">
            {TAMANHO_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setTamanho(opt)} className={optionCls(tamanho === opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q8 — Sugestão (opcional) */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-1">
            8. O que faltou? Se você pudesse adicionar UMA coisa na Jornada, o que seria?
          </p>
          <p className="text-xs text-stone-400 mb-3">Opcional</p>
          <textarea
            value={sugestao}
            onChange={e => setSugestao(e.target.value)}
            placeholder="Ex: gostaria de ter explorado mais o tema X..."
            rows={3}
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:border-[var(--color-brand-400)] transition-colors resize-none"
          />
        </div>

        {/* Q9 — Comunidade IA */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-3">
            9. Você teria interesse em participar de uma comunidade gratuita com pessoas
            na mesma fase de vida, explorando o uso de IA para avançar no próximo capítulo?
          </p>
          <div className="flex gap-3">
            <button onClick={() => setComunidadeIA(true)}  className={optionCls(comunidadeIA === true)  + ' flex-1'}>Sim, tenho interesse!</button>
            <button onClick={() => setComunidadeIA(false)} className={optionCls(comunidadeIA === false) + ' flex-1'}>Não por enquanto</button>
          </div>
        </div>

        {/* Q10 — Suporte desejado (multi-select, opcional) */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-1">
            10. Que tipo de suporte ajudaria você a avançar no próximo capítulo?
          </p>
          <p className="text-xs text-stone-400 mb-3">Opcional · escolha quantos quiser</p>
          <div className="space-y-2">
            {SUPORTE_OPTIONS.map(opt => {
              const active = suporte.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleSuporte(opt)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                    active
                      ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-50)] text-[var(--color-brand-700)] font-medium'
                      : 'border-stone-200 text-stone-600 hover:border-[var(--color-brand-300)] hover:bg-stone-50'
                  }`}
                >
                  <span className="mr-2">{active ? '✓' : '○'}</span>{opt}
                </button>
              );
            })}
          </div>
          {suporte.length > 0 && (
            <p className="text-xs text-[var(--color-brand-600)] mt-2 font-medium">
              {suporte.length} opç{suporte.length > 1 ? 'ões selecionadas' : 'ão selecionada'}
            </p>
          )}
        </div>

        {/* Enviar */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="w-full py-3.5 bg-[var(--color-brand-600)] text-white text-sm rounded-[4px] font-medium hover:bg-[var(--color-brand-700)] transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {submitting ? 'Enviando...' : 'Enviar e Receber Relatório Aprofundado'}
        </button>

        <div className="text-center pb-8">
          <button
            onClick={() => navigate(jornadaId ? `/resultado/${jornadaId}` : '/comecar/salvar')}
            className="text-xs text-stone-400 hover:text-stone-600 underline underline-offset-4"
          >
            Pular e voltar ao resultado
          </button>
        </div>

      </div>
    </div>
  );
}
