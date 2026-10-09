import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Wrench, Star, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../supabase';

const RATING_LABELS = ['', 'Muito insatisfeito', 'Insatisfeito', 'Neutro', 'Satisfeito', 'Muito satisfeito'];

export default function EmConstrucao() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating || submitting) return;
    setSubmitting(true);
    try {
      await supabase.from('user_feedback').insert({
        rating,
        comment: comment.trim() || null,
        page: 'em-construcao',
        user_agent: navigator.userAgent,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Erro ao salvar feedback:', error);
      setSubmitted(true); // mostra sucesso mesmo se falhar (UX)
    } finally {
      setSubmitting(false);
    }
  };

  const activeStars = hovered || rating;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12"
      style={{ background: 'var(--bg-gradient)', backgroundColor: 'var(--bg-dark)' }}
    >
      <div className="max-w-md w-full">

        {/* Ícone */}
        <div className="w-20 h-20 mx-auto rounded-full bg-[var(--glass)] border border-[var(--alpha-border)] flex items-center justify-center mb-8">
          <Wrench className="w-9 h-9 text-[var(--neon-cyan)]" />
        </div>

        <div className="text-xs font-mono text-[var(--text-muted)] tracking-widest uppercase mb-4">
          Em breve
        </div>

        <h1 className="font-serif text-4xl text-[var(--text-main)] mb-4 leading-tight">
          Explorar Cursos
        </h1>

        <p className="text-[var(--text-muted)] text-base mb-3 leading-relaxed">
          Esta seção está sendo construída com muito cuidado.
        </p>
        <p className="text-[var(--text-muted)] text-base mb-10 leading-relaxed">
          Em breve você poderá explorar cursos de graduação alinhados com o seu perfil Ikigai.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-brand-600)] text-white rounded-full font-medium hover:bg-[var(--color-brand-700)] transition-colors shadow-sm"
          >
            <Leaf className="w-4 h-4" />
            Voltar ao Início
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-[var(--alpha-border)] text-[var(--text-muted)] rounded-full font-medium hover:bg-[var(--glass)] transition-colors"
          >
            ← Voltar ao Resultado
          </button>
        </div>

        {/* Divisor */}
        <div className="border-t border-[var(--alpha-border)] mb-10" />

        {/* Avaliação */}
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle className="w-10 h-10 text-[var(--neon-cyan)]" />
            <p className="text-[var(--text-main)] font-medium text-lg">Obrigado pelo feedback!</p>
            <p className="text-[var(--text-muted)] text-sm">Sua opinião nos ajuda a melhorar a experiência.</p>
          </div>
        ) : (
          <div className="text-left">
            <h2 className="font-serif text-xl text-[var(--text-main)] mb-1 text-center">
              Avalie sua experiência
            </h2>
            <p className="text-[var(--text-muted)] text-sm mb-6 text-center">
              O que você achou da jornada até aqui?
            </p>

            {/* Estrelas */}
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  aria-label={RATING_LABELS[star]}
                >
                  <Star
                    className="w-8 h-8 transition-colors"
                    fill={activeStars >= star ? 'var(--neon-cyan)' : 'transparent'}
                    stroke={activeStars >= star ? 'var(--neon-cyan)' : 'var(--text-muted)'}
                  />
                </button>
              ))}
            </div>

            {/* Label da nota */}
            <p className="text-[var(--text-muted)] text-xs text-center mb-6 min-h-[1em]">
              {rating > 0 ? RATING_LABELS[rating] : ''}
            </p>

            {/* Comentário */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Críticas, sugestões ou o que você gostaria de ver aqui... (opcional)"
              rows={4}
              className="w-full rounded-2xl bg-[var(--glass)] border border-[var(--alpha-border)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] px-4 py-3 text-sm resize-none focus:outline-none focus:border-[var(--neon-cyan)] transition-colors mb-5"
            />

            {/* Botão enviar */}
            <button
              onClick={handleSubmit}
              disabled={!rating || submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-brand-600)] text-white rounded-full font-medium hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Enviando...' : 'Enviar avaliação'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
