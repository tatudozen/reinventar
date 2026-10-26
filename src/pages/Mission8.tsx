import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, CheckCircle2, PenLine } from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { MissionWrapper } from '../components/MissionWrapper';
import { MentorVideo } from '../components/MentorVideo';
import { ImageSwiper } from '../components/ui/image-swiper';

const QUESTIONS = [
  {
    id: 'morando',
    title: 'Onde você está morando?',
    options: [
      { text: 'Em uma cidade grande, perto de tudo',        image: '/questions/fase8-morando-metropole.png' },
      { text: 'Perto da natureza, com mais tranquilidade',   image: '/questions/fase8-morando-natureza.png' },
      { text: 'Próximo à praia ou à beira-rio',              image: '/questions/fase8-morando-praia.png' },
      { text: 'Viajando, com liberdade de escolher',         image: '/questions/fase8-morando-nomade.png' },
    ],
  },
  {
    id: 'companhia',
    title: 'Com quem você está?',
    options: [
      { text: 'Com meu(a) parceiro(a) ou grande amor',      image: '/questions/fase8-companhia-casal.png' },
      { text: 'Cercado(a) de família',                       image: '/questions/fase8-companhia-familia.png' },
      { text: 'Perto de amigos próximos e comunidade',       image: '/questions/fase8-companhia-amigos.png' },
      { text: 'Com meus animais de estimação',               image: '/questions/fase8-companhia-pets.png' },
    ],
  },
  {
    id: 'manha',
    title: 'Como é a sua manhã?',
    options: [
      { text: 'Acordo cedo para exercícios e meditação',    image: '/questions/fase8-manha-exercicio.png' },
      { text: 'Tomo café com calma, sem pressa',             image: '/questions/fase8-manha-cafe.png' },
      { text: 'Já começo o dia com encontros e conversas',   image: '/questions/fase8-maha-reuniao.png' },
      { text: 'Acordo devagar e foco minha energia à tarde', image: '/questions/fase8-manha-noite.png' },
    ],
  },
  {
    id: 'trabalho',
    title: 'Onde e como você exerce sua contribuição?',
    options: [
      { text: 'Em um espaço próprio, com estrutura',         image: '/questions/fase8-trabalho-escritorio.png' },
      { text: 'De forma remota, de qualquer lugar',          image: '/questions/fase8-trabalho-remoto.png' },
      { text: 'No campo, ao ar livre, perto das pessoas',    image: '/questions/fase8-trabalho-campo.png' },
      { text: 'No meu estúdio ou ateliê criativo',           image: '/questions/fase8-trabalho-estudio.png' },
    ],
  },
  {
    id: 'fim_dia',
    title: 'O que te faz sorrir no final do dia?',
    options: [
      { text: 'Saber que contribuí com algo que importa',    image: '/questions/fase8-fim-impacto.png' },
      { text: 'A liberdade e o conforto que conquistei',     image: '/questions/fase8-fim-liberdade.png' },
      { text: 'A criação ou projeto que avancei',            image: '/questions/fase8-fim-criacao.png' },
      { text: 'Uma conversa ou conexão verdadeira',          image: '/questions/fase8-fim-problema.png' },
    ],
  },
];

const ROLE_LABELS: Record<string, string> = {
  mentor: 'mentoria de jovens', escritora: 'escrita de histórias de vida',
  consultor: 'consultoria independente', professor: 'ensino e oficinas',
  voluntario: 'voluntariado em causas', podcast: 'criação de conteúdo',
  artesao: 'artesanato e criação própria', coach: 'coaching de transição',
  cuidador: 'cuidado especializado', guia: 'guia cultural ou de natureza',
  horta: 'horta comunitária', genealogia: 'pesquisa genealógica',
  facilitador: 'facilitação de grupos', fotografo: 'fotografia de momentos',
  mediador: 'mediação de conflitos', narrador: 'narração de histórias',
  idiomas: 'ensino de idiomas', palestrante: 'palestras de experiência de vida',
  acompanhante: 'acompanhamento terapêutico', curador: 'curadoria cultural',
  produtor: 'produção de eventos', terapeuta: 'facilitação de bem-estar',
  embaixador: 'embaixador(a) de causas', empreendedor: 'empreendedorismo social',
};

// step 0 = intro (MissionWrapper), 1-5 = questions, 6 = carta, 7 = concluída
export default function Mission8() {
  const navigate = useNavigate();
  const { state, updatePhase, completePhase, addXP } = useApp();

  const future = state.phase8?.future ?? {};
  const savedLetter = state.phase8?.letter ?? '';

  const [step, setStep] = useState<number>(0);
  const [letter, setLetter] = useState('');

  const autoLetter = useMemo(() => {
    const roles = (state.phase7?.savedRoles ?? [])
      .slice(0, 3)
      .map(id => ROLE_LABELS[id])
      .filter(Boolean);
    const intention: string = state.phase6?.intention ?? '';

    const lines: string[] = ['Querida(o) eu do futuro,', ''];

    lines.push(
      `Imagino como vou estar nos próximos anos: morando ${future.morando?.toLowerCase() || 'em algum lugar que me faz bem'}, ${future.companhia?.toLowerCase() || 'com quem eu amo'}.`
    );
    lines.push('');

    lines.push(
      `Minha manhã começa assim: ${future.manha?.toLowerCase() || 'com presença e intenção'}. Exerço minha contribuição ${future.trabalho?.toLowerCase() || 'do meu jeito'}. E no final do dia, o que me faz sorrir é ${future.fim_dia?.toLowerCase() || 'saber que fiz algo que valeu'}.`
    );
    lines.push('');

    if (roles.length > 0) {
      lines.push(`Descobri que posso contribuir como ${roles.join(', ')}.`);
      lines.push('');
    }

    if (intention.length > 10) {
      const snippet = intention.length > 120 ? intention.slice(0, 120) + '...' : intention;
      lines.push(`Carrego esta intenção comigo: "${snippet}"`);
      lines.push('');
    }

    lines.push('Não preciso ter tudo resolvido agora. O próximo capítulo começa com um único passo.');
    lines.push('');
    lines.push('Com carinho,\nEu do presente.');

    return lines.join('\n');
  }, [future, state.phase6?.intention, state.phase7?.savedRoles]);

  const handleFieldChange = (field: string, value: string) => {
    updatePhase('phase8', { future: { ...future, [field]: value } });
  };

  const handleComplete = () => {
    const finalLetter = letter || savedLetter || autoLetter;
    if (finalLetter.length >= 20) {
      updatePhase('phase8', { letter: finalLetter });
      addXP(200);
      completePhase(8);
      setStep(7);
    }
  };

  // ── Step 0: intro com vídeo ───────────────────────────────────────────────
  if (step === 0) {
    return (
      <MissionWrapper
        videoTitle="A Carta para o Eu de Amanhã"
        videoDescription="Respire fundo. Vamos visualizar onde você quer estar nos próximos anos."
        videoId="fase8"
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p className="text-[var(--color-text-muted)] max-w-sm mb-10 leading-relaxed">
            Respire fundo. Visualize onde você quer estar nos próximos anos — sem pressão, sem julgamento.
          </p>
          <button
            onClick={() => setStep(1)}
            className="bg-[var(--color-brand-600)] text-white font-bold px-10 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-[var(--btn-shadow)] uppercase tracking-wider"
          >
            Começar →
          </button>
        </div>
      </MissionWrapper>
    );
  }

  // ── Step 7: Missão Concluída ──────────────────────────────────────────────
  if (step === 7) {
    return (
      <div className="flex flex-col items-center text-center max-w-md mx-auto w-full py-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="w-20 h-20 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-6 shadow-[var(--btn-shadow)]"
        >
          <CheckCircle2 className="w-10 h-10 text-[var(--color-brand-500)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="font-serif text-4xl text-[var(--text-main)] mb-2">Missão concluída</h2>
          <p className="text-[var(--color-text-muted)] mb-8">+200 XP adicionados à sua jornada</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full mb-8"
        >
          <MentorVideo
            title="Parabéns pela sua Jornada!"
            description="Uma mensagem especial para você."
            videoId="concluida"
          />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          onClick={() => navigate('/comecar/salvar')}
          className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform"
        >
          Ver meu Resultado →
        </motion.button>
      </div>
    );
  }

  // ── Steps 1-5: perguntas com ImageSwiper ─────────────────────────────────
  if (step >= 1 && step <= 5) {
    const qIndex = step - 1;
    const q = QUESTIONS[qIndex];
    const qImages = q.options.map(o => o.image).join(',');
    const activeText = future[q.id] || q.options[0].text;

    return (
      <div className="flex flex-col min-h-[70vh] max-w-2xl mx-auto w-full">
        <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-5 mb-5 flex items-start gap-3">
          <div className="bg-[var(--bg-dark)] p-2 rounded-full text-[var(--color-brand-500)] shrink-0 mt-0.5">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[var(--text-main)] text-sm leading-relaxed mb-1.5">
              Imagine os próximos anos da sua vida. Responda com o coração, sem julgamentos.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
              ● Arraste para explorar · Toque 2× para confirmar
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          {QUESTIONS.map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full bg-[var(--glass)] overflow-hidden">
              {i < qIndex && <div className="h-full w-full bg-[var(--color-brand-500)]" />}
              {i === qIndex && <div className="h-full w-full bg-[var(--neon-cyan)]" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col items-center"
          >
            <h2 className="font-serif text-2xl text-[var(--text-main)] mb-5 text-center">
              {q.title}
            </h2>

            <div className="flex flex-col items-center mb-4">
              <ImageSwiper
                images={qImages}
                cardWidth={300}
                cardHeight={400}
                onActiveIndexChange={(index) => handleFieldChange(q.id, q.options[index].text)}
                onSelect={() => { if (future[q.id]?.length > 3) setStep(s => s + 1); addXP(10); }}
                overlay={
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeText}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 65%, transparent 100%)',
                        padding: '3.5rem 1.25rem 1.5rem',
                        borderRadius: '0 0 0.75rem 0.75rem',
                      }}
                    >
                      <p className="text-white font-semibold text-base text-center leading-snug drop-shadow-lg">
                        {activeText}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                }
              />
              <p className="text-[10px] font-mono tracking-widest uppercase mt-3 text-[var(--color-text-muted)]">
                ← Arraste para explorar · Toque 2× para confirmar →
              </p>
            </div>

            <div className="w-full flex justify-between mt-auto pt-4 border-t border-[var(--color-brand-100)]">
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-6 py-2.5 border border-[var(--color-brand-200)] rounded-xl font-medium text-[var(--color-text-muted)] hover:bg-[var(--glass)] transition-colors"
              >
                ← Anterior
              </button>
              <button
                onClick={() => { addXP(10); setStep(s => s + 1); }}
                disabled={!(future[q.id]?.length > 3)}
                className="px-6 py-2.5 bg-[var(--color-brand-600)] text-[var(--bg-dark)] rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step === 5 ? 'Escrever Carta →' : 'Próxima →'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── Step 6: editor da carta ───────────────────────────────────────────────
  const currentLetter = letter || savedLetter || autoLetter;

  return (
    <div className="flex flex-col min-h-[70vh] max-w-3xl mx-auto w-full">
      <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-6 mb-6 flex items-start gap-4">
        <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0 mt-0.5">
          <PenLine className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">Sua Visão Compilada</h3>
          <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-2">
            Montamos uma carta com base nas suas escolhas e descobertas. Edite à vontade — esta carta é para você.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]">
            ● Quando estiver satisfeito(a), clique em "Selar a Carta"
          </span>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <textarea
          value={currentLetter}
          onChange={(e) => setLetter(e.target.value)}
          rows={14}
          className="flex-grow w-full p-6 bg-[var(--bg-dark)] border border-[var(--color-brand-300)] rounded-xl outline-none focus:border-[var(--color-brand-500)] focus:ring-1 focus:ring-[var(--color-brand-500)] transition-colors resize-none text-[var(--text-main)] font-serif leading-relaxed text-lg shadow-inner"
        />
        <p className="text-xs text-[var(--color-text-muted)] mt-2 text-right font-mono">
          {currentLetter.length} caracteres
        </p>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-[var(--color-brand-100)] mt-4">
        <button
          onClick={() => setStep(5)}
          className="px-6 py-2.5 border border-[var(--color-brand-200)] rounded-xl font-medium text-[var(--color-text-muted)] hover:bg-[var(--glass)] transition-colors"
        >
          ← Voltar
        </button>
        <button
          onClick={handleComplete}
          disabled={currentLetter.length < 20}
          className="px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] text-white shadow-[var(--btn-shadow)] hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Selar a Carta →
        </button>
      </div>
    </div>
  );
}
