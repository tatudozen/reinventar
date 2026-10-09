import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';

export function SurveyCallout({ jornadaId }: { jornadaId?: string | null }) {
  return (
    <div className="mt-14 max-w-2xl mx-auto text-center bg-[var(--color-brand-50)] border border-[var(--color-brand-200)] rounded-2xl p-6">
      <p className="text-sm text-stone-600 mb-4 leading-relaxed">
        Se ainda não respondeu a pesquisa de satisfação, responda para receber o seu relatório especial ✨
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to={`/comecar/pesquisa${jornadaId ? `?id=${jornadaId}` : ''}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-brand-600)] text-white rounded-full font-medium hover:bg-[var(--color-brand-700)] transition-colors"
        >
          <ClipboardList className="w-4 h-4" />
          Responder pesquisa de satisfação
        </Link>
        {jornadaId && (
          <Link
            to={`/resultado/${jornadaId}`}
            className="inline-block px-6 py-2.5 border border-[var(--color-brand-300)] text-[var(--color-brand-600)] rounded-full font-medium hover:bg-[var(--color-brand-50)] transition-colors"
          >
            Voltar ao Resultado →
          </Link>
        )}
      </div>
    </div>
  );
}
