import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Send } from 'lucide-react';
import { supabase } from '../supabase';
import { useApp } from '../store';
import { MentorVideo } from '../components/MentorVideo';
import { ShareQuizLink } from '../components/ShareQuizLink';

// Webhook do N8N que gera o Relatório Profundo (agente de IA) a partir da jornada.
// Substitui o antigo disparo para o GHL.
const SURVEY_WEBHOOK_URL = 'https://webhook.alquimiazen.com.br/webhook/ikigai-report';

// O campo Celular é livre/opcional: o usuário digita em qualquer formato
// ("(21) 98181-8696", "21981818696"...). A Evolution API exige o número com
// código do país. Normaliza para dígitos e garante o 55 (Brasil) quando o
// telefone vier no formato local (DDD + 8/9 dígitos).
function normalizePhoneBR(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits; // fallback: envia os dígitos como estão
}

const PERFIL_OPTIONS = [
  'Estudante escolhendo curso/carreira',
  'Jovem já na faculdade ou trabalhando',
  'Pai/mãe que fez pelo filho(a) ou junto com ele(a)',
  'Educador/orientador',
  'Curioso de outra idade 😄',
];

const CLAREZA_OPTIONS = [
  'Com MAIS clareza sobre meus caminhos',
  'Igual — nada mudou',
  'Com MAIS dúvidas do que antes',
];

const MISSOES = [
  '01 — Mapa de Energia',
  '02 — Talentos na Mochila',
  '03 — A Grande Causa',
  '04 — Duelo de Mundos',
  '05 — Ministério dos Sonhos',
  '06 — O Arquétipo',
  '07 — O Garimpo',
  '08 — A Carta para o Futuro',
];

const PRECISAO_OPTIONS = [
  'Muito eu — me reconheci na hora',
  'Parcialmente eu — acertou umas coisas, errou outras',
  'Não me reconheci',
];

const TAMANHO_OPTIONS = [
  'Poderia ser MAIOR — queria mais missões',
  'Está no tamanho certo',
  'Poderia ser MENOR — senti que foi longa',
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
  // id da jornada: vem pela URL (robusto entre dispositivos) com fallback no localStorage
  const jornadaId = searchParams.get('id') || localStorage.getItem('ikigai_jornada_id');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState<boolean | null>(null);
  const [tenantConfig, setTenantConfig] = useState<{ explore_label: string; explore_url: string } | null>(null);

  useEffect(() => {
    supabase
      .from('tenant_configs')
      .select('explore_label, explore_url')
      .eq('host', window.location.hostname)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.explore_label && data?.explore_url) setTenantConfig(data);
      });
  }, []);

  useEffect(() => {
    if (!jornadaId) {
      setAlreadyCompleted(false);
      return;
    }
    supabase
      .from('jornadas')
      .select('survey_completed')
      .eq('id', jornadaId)
      .maybeSingle()
      .then(({ data }) => {
        setAlreadyCompleted(data?.survey_completed === true);
      });
  }, [jornadaId]);

  const [perfil, setPerfil] = useState('');
  const [nps, setNps] = useState<number | null>(null);
  const [clareza, setClareza] = useState('');
  const [missaoFav, setMissaoFav] = useState('');
  const [dificuldade, setDificuldade] = useState('');
  const [precisao, setPrecisao] = useState('');
  const [tamanhoJornada, setTamanhoJornada] = useState('');
  const [sugestao, setSugestao] = useState('');
  const [comunidadeIA, setComunidadeIA] = useState<boolean | null>(null);

  // Q9 — cursos em dúvida (opcional)
  const [cursosDuvida, setCursosDuvida] = useState<string[]>([]);
  const [courseQuery, setCourseQuery] = useState('');
  const [courseIndex, setCourseIndex] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    supabase.from('courses').select('name').then(({ data }) => {
      if (!data) return;
      const counts = new Map<string, number>();
      (data as { name: string }[]).forEach(r => counts.set(r.name, (counts.get(r.name) || 0) + 1));
      setCourseIndex(
        Array.from(counts.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
      );
    });
  }, []);

  const toggleCurso = (name: string) =>
    setCursosDuvida(prev => (prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]));

  const q = courseQuery.trim().toLowerCase();
  const visibleCursos = q
    ? courseIndex.filter(c => c.name.toLowerCase().includes(q)).slice(0, 40)
    : [
        ...courseIndex.filter(c => cursosDuvida.includes(c.name) && !courseIndex.slice(0, 20).some(t => t.name === c.name)),
        ...courseIndex.slice(0, 20),
      ];

  const canSubmit = perfil && nps !== null && clareza && missaoFav && precisao && tamanhoJornada && comunidadeIA !== null;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    const surveyData = {
      perfil,
      nps,
      clareza,
      missao_fav: missaoFav,
      dificuldade: dificuldade.trim() || null,
      precisao,
      tamanho_jornada: tamanhoJornada,
      sugestao: sugestao.trim() || null,
      comunidade_ia: comunidadeIA,
      cursos_duvida: cursosDuvida.length ? cursosDuvida : null,
    };
    try {
      await supabase.from('jornada_surveys').insert(surveyData);
      sessionStorage.setItem('ikigai_survey', JSON.stringify(surveyData));
      if (jornadaId) {
        await supabase.from('jornadas').update({ survey_completed: true }).eq('id', jornadaId);
      }
    } catch (error) {
      console.error('Erro ao salvar pesquisa:', error);
    }

    // Dispara o webhook do N8N que gera o Relatório Profundo a partir da jornada.
    // Nome/e-mail/telefone vivem na tabela `jornadas` (robusto entre dispositivos);
    // o telefone só existe lá, então buscamos sempre que houver jornada_id.
    try {
      let name = state.user?.name || '';
      let email = state.user?.email || '';
      let phone = '';
      if (jornadaId) {
        const { data } = await supabase
          .from('jornadas')
          .select('user_name, user_email, user_phone')
          .eq('id', jornadaId)
          .maybeSingle();
        if (data) {
          name = name || data.user_name;
          email = email || data.user_email;
          phone = data.user_phone || '';
        }
      }
      const firstName = name.trim().split(/\s+/)[0] || '';
      const phoneE164 = normalizePhoneBR(phone);
      if (email) {
        await fetch(SURVEY_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jornada_id: jornadaId ?? undefined,
            first_name: firstName || undefined,
            email,
            phone: phoneE164 || undefined,
            duvidas_curso: cursosDuvida.length ? cursosDuvida.join(', ') : undefined,
          }),
        });
      }
    } catch (error) {
      console.error('Erro ao enviar pesquisa ao webhook:', error);
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  if (alreadyCompleted === null && !submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-stone-400 text-sm">Carregando...</p>
      </div>
    );
  }

  if (alreadyCompleted && !submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-600)] flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl text-[var(--text-main)] mb-3">Pesquisa já Respondida</h2>
        <p className="text-stone-500 mb-8 leading-relaxed">
          Você já respondeu a pesquisa. Caso queira responder novamente, faça a jornada novamente.
        </p>
        {jornadaId && (
          <button
            onClick={() => navigate(`/resultado/${jornadaId}`)}
            className="px-6 py-3 bg-[var(--color-brand-600)] text-white rounded-[4px] font-medium hover:bg-[var(--color-brand-700)] transition-colors inline-flex items-center gap-2"
          >
            Voltar ao Resultado →
          </button>
        )}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-600)] flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl text-[var(--text-main)] mb-3">Obrigado!</h2>
        <p className="text-stone-500 mb-8 leading-relaxed">
          Sua opinião vai nos ajudar a tornar a Jornada ainda melhor para quem vem a seguir.
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
              className="px-6 py-3 bg-[var(--color-brand-600)] text-white rounded-[4px] font-medium hover:bg-[var(--color-brand-700)] transition-colors inline-flex items-center gap-2"
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
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-stone-200 text-stone-600 rounded-[4px] font-medium hover:bg-stone-50 transition-colors"
            >
              Retornar ao Início
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      <div className="mb-8">
        <p className="text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-2">
          Pesquisa de Satisfação
        </p>
        <h1 className="font-serif text-3xl text-[var(--text-main)] mb-2">Como foi sua Jornada?</h1>
        <p className="text-stone-500 text-sm">Leva menos de 2 minutos. Sua resposta molda as próximas versões.</p>
      </div>

      <div className="space-y-8">

        {/* Q1 — Perfil */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-3">
            1. Quem é você na Jornada?
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
            2. De 0 a 10, o quanto você recomendaria a Jornada Ikigai para um amigo?
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

        {/* Q4 — Missão favorita */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-3">
            4. Qual missão você MAIS gostou?
          </p>
          <div className="space-y-2">
            {MISSOES.map(opt => (
              <button key={opt} onClick={() => setMissaoFav(opt)} className={optionCls(missaoFav === opt)}>
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
            placeholder="Ex: Na missão 3 não entendi bem o que fazer..."
            rows={3}
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:border-[var(--color-brand-400)] transition-colors resize-none"
          />
        </div>

        {/* Q6 — Precisão */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-3">
            6. O resultado final (Mandala + caminhos sugeridos) pareceu...
          </p>
          <div className="space-y-2">
            {PRECISAO_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setPrecisao(opt)} className={optionCls(precisao === opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q7 — Tamanho da Jornada */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-3">
            7. E o tamanho da Jornada? Você achou que ela...
          </p>
          <div className="space-y-2">
            {TAMANHO_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setTamanhoJornada(opt)} className={optionCls(tamanhoJornada === opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q8 — Sugestão (opcional) */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-1">
            8. O que faltou? Se você pudesse adicionar UMA coisa na Jornada, o que seria? Sentiu falta de alguma profissão ou curso?
          </p>
          <p className="text-xs text-stone-400 mb-3">Opcional</p>
          <textarea
            value={sugestao}
            onChange={e => setSugestao(e.target.value)}
            placeholder="Ex: senti falta da profissão X / do curso Y..."
            rows={3}
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:border-[var(--color-brand-400)] transition-colors resize-none"
          />
        </div>

        {/* Q9 — Comunidade IA */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-3">
            9. Você teria interesse em participar de uma comunidade gratuita para aprender como a inteligência artificial pode te ajudar na sua jornada?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setComunidadeIA(true)}
              className={optionCls(comunidadeIA === true) + ' flex-1'}
            >
              Sim, tenho interesse!
            </button>
            <button
              onClick={() => setComunidadeIA(false)}
              className={optionCls(comunidadeIA === false) + ' flex-1'}
            >
              Não por enquanto
            </button>
          </div>
        </div>

        {/* Q10 — Cursos em dúvida (opcional) */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)] mb-1">
            10. Ainda em dúvida sobre qual curso fazer? Selecione abaixo e a gente te ajuda a decidir.
          </p>
          <p className="text-xs text-stone-400 mb-3">Opcional · escolha quantos quiser</p>
          <input
            type="text"
            value={courseQuery}
            onChange={e => setCourseQuery(e.target.value)}
            placeholder="Buscar curso (ex: Direito, Medicina, Design)..."
            className="w-full mb-3 p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:border-[var(--color-brand-400)] transition-colors"
          />
          <div className="flex flex-wrap gap-2">
            {visibleCursos.map(({ name }) => {
              const active = cursosDuvida.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleCurso(name)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    active
                      ? 'bg-[var(--color-brand-600)] text-white border-[var(--color-brand-600)]'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-[var(--color-brand-300)]'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
          {cursosDuvida.length > 0 && (
            <p className="text-xs text-[var(--color-brand-600)] mt-2 font-medium">
              {cursosDuvida.length} curso{cursosDuvida.length > 1 ? 's' : ''} selecionado{cursosDuvida.length > 1 ? 's' : ''}
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
          {submitting ? 'Enviando...' : 'Enviar Pesquisa'}
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
