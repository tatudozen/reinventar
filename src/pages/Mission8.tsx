import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { MissionWrapper } from '../components/MissionWrapper';

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

const WHO_LABELS: Record<string, string> = {
  jovens: 'crianças e jovens', adultos: 'adultos em transição',
  pares: 'pessoas da minha geração', idosos: 'idosos',
  familia: 'minha família', comunidade: 'minha comunidade local',
  vulneraveis: 'grupos vulneráveis', profissionais: 'profissionais da minha área',
  estudantes: 'estudantes', cuidadores: 'cuidadores e famílias',
};

const STARTERS = [
  'Querida(o) eu do futuro,\n\nAo olhar para onde estou agora, vejo com mais clareza o que me move e o que tenho a oferecer...',
  'Querida(o) eu do futuro,\n\nNesta jornada aprendi que o próximo capítulo começa com honestidade — sobre quem sou, o que sei fazer e o que o mundo precisa...',
  'Querida(o) eu do futuro,\n\nSe você esqueceu quem você era quando começou tudo isso, lembre-se: você teve coragem suficiente para se reinventar...',
];

export default function Mission8() {
  const navigate = useNavigate();
  const { state, updatePhase, completePhase, addXP } = useApp();

  const savedLetter: string = state.phase8?.letter ?? '';

  const autoDraft = useMemo(() => {
    const roles = (state.phase7?.savedRoles ?? [])
      .slice(0, 3)
      .map(id => ROLE_LABELS[id])
      .filter(Boolean);
    const connections = (state.phase6?.connections ?? [])
      .slice(0, 3)
      .map(id => WHO_LABELS[id])
      .filter(Boolean);
    const intention: string = state.phase6?.intention ?? '';

    const lines: string[] = ['Querida(o) eu do futuro,', ''];
    lines.push('Ao terminar esta jornada, algumas coisas ficaram mais claras para mim.');
    lines.push('');

    if (roles.length > 0) {
      lines.push(`Possibilidades que ressoam com quem estou me tornando: ${roles.join(', ')}.`);
      lines.push('');
    }

    if (connections.length > 0) {
      lines.push(`Quero construir conexões verdadeiras, especialmente com ${connections.join(', ')}.`);
      lines.push('');
    }

    if (intention.length > 10) {
      const snippet = intention.length > 150 ? intention.slice(0, 150) + '...' : intention;
      lines.push(`Uma intenção que carrego: "${snippet}"`);
      lines.push('');
    }

    lines.push('Não preciso ter tudo resolvido agora. O próximo capítulo começa com um único passo.');
    lines.push('');
    lines.push('Com carinho,\nEu do presente.');

    return lines.join('\n');
  }, [state]);

  const [step, setStep] = useState<0 | 1>(() =>
    savedLetter.length > 10 && state.completedPhases.includes(8) ? 1 : 0
  );
  const [letter, setLetter] = useState(savedLetter || autoDraft);
  const [showStarters, setShowStarters] = useState(false);

  const handleComplete = () => {
    if (letter.length >= 50) {
      updatePhase('phase8', { letter });
      addXP(100);
      completePhase(8);
      setStep(1);
    }
  };

  return (
    <MissionWrapper
      videoTitle="A Carta para o Eu de Amanhã"
      videoDescription="Você chegou ao final desta jornada. Escreva uma mensagem para quem você está se tornando."
      videoId="fase8"
    >
      <div className="flex flex-col min-h-[70vh]">
        <AnimatePresence mode="wait">

          {/* ── Step 0: Escrita da carta ── */}
          {step === 0 && (
            <motion.div
              key="writing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col flex-grow"
            >
              <div className="bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-5 mb-5 flex items-start gap-4">
                <div className="bg-[var(--bg-dark)] p-3 rounded-full text-[var(--color-brand-600)] shrink-0">
                  <PenLine className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Carta ao Eu de Amanhã</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-3">
                    Preparamos um rascunho com o que você descobriu nesta jornada. Edite à vontade — ou escreva do zero. Esta carta é para você.
                  </p>
                  <button
                    onClick={() => setShowStarters(s => !s)}
                    className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)] hover:bg-[var(--color-brand-200)] transition-colors"
                  >
                    ✨ Ver inícios sugeridos
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showStarters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="flex flex-col gap-2">
                      {STARTERS.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => { setLetter(s); setShowStarters(false); }}
                          className="text-left text-sm px-4 py-3 bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl hover:border-[var(--color-brand-500)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--text-main)] leading-relaxed"
                        >
                          {s.split('\n')[0]} <span className="opacity-50">...</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-grow flex flex-col">
                <textarea
                  value={letter}
                  onChange={e => setLetter(e.target.value)}
                  rows={12}
                  className="flex-grow w-full p-6 bg-[var(--bg-dark)] border border-[var(--color-brand-300)] rounded-xl outline-none focus:border-[var(--color-brand-500)] focus:ring-1 focus:ring-[var(--color-brand-500)] transition-colors resize-none text-[var(--text-main)] font-serif leading-relaxed text-lg shadow-inner"
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-2 text-right font-mono">
                  {letter.length} caracteres
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[var(--color-brand-100)] mt-4">
                <span className="text-xs text-[var(--color-text-muted)] font-mono opacity-60">
                  {letter.length < 50
                    ? `mín. ${50 - letter.length} caracteres restantes`
                    : 'pronta para selar ✓'}
                </span>
                <button
                  onClick={handleComplete}
                  disabled={letter.length < 50}
                  className="px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:opacity-90 shadow-[var(--btn-shadow)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selar a Carta →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 1: Conclusão ── */}
          {step === 1 && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center flex-grow justify-center py-10"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="w-24 h-24 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-8 shadow-[var(--btn-shadow)]"
              >
                <CheckCircle2 className="w-12 h-12 text-[var(--color-brand-500)]" />
              </motion.div>

              <h2 className="text-3xl font-serif text-[var(--text-main)] mb-4 text-center">Carta Selada</h2>
              <p className="text-[var(--color-text-muted)] max-w-lg text-center mb-10 leading-relaxed">
                Você completou todas as 8 fases da jornada. A carta que escreveu é um compromisso com quem você está se tornando.
              </p>

              <div className="w-full max-w-md bg-[var(--glass)] border border-[var(--color-brand-200)] rounded-xl p-5 mb-10">
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Sua carta</p>
                <p className="text-sm text-[var(--text-main)] font-serif leading-relaxed line-clamp-6 whitespace-pre-wrap">
                  {letter}
                </p>
              </div>

              <button
                onClick={() => navigate('/comecar/salvar')}
                className="px-10 py-4 bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] rounded-xl font-bold uppercase tracking-widest text-white shadow-[var(--btn-shadow)] hover:scale-105 transition-transform flex items-center gap-2"
              >
                Ver meu Resultado <Sparkles className="w-5 h-5" />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MissionWrapper>
  );
}
