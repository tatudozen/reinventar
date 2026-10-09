import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';
import { LEGAL_INFO } from '../lib/legal-info';

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-transparent text-[var(--text-main)]">
      {/* Header */}
      <header className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[var(--color-brand-600)] font-serif font-medium hover:opacity-80 transition-opacity">
          <Leaf className="w-5 h-5" />
          <span>Jornada Ikigai</span>
        </Link>
        <Link to="/" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-900)] transition-colors inline-flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Voltar ao início
        </Link>
      </header>

      {/* Conteúdo */}
      <main className="max-w-3xl mx-auto px-6 pt-8 pb-20">
        <h1 className="font-serif text-4xl text-[var(--color-brand-800)] mb-2 leading-tight">{title}</h1>
        <p className="text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-10">
          Última atualização: {LEGAL_INFO.ultimaAtualizacao}
        </p>

        <div className="legal-prose text-stone-600 leading-relaxed space-y-4">
          {children}
        </div>
      </main>

      {/* Footer com navegação entre as páginas legais */}
      <footer className="border-t border-stone-200 py-10">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-4">
          <div className="font-serif text-[var(--color-brand-600)] text-sm">Jornada Ikigai</div>
          <div className="flex gap-6">
            <Link to="/politica-de-privacidade" className="hover:text-stone-800 transition-colors">Política de Privacidade</Link>
            <Link to="/termos-de-uso" className="hover:text-stone-800 transition-colors">Termos de Uso</Link>
            <Link to="/" className="hover:text-stone-800 transition-colors">Início</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Helpers de tipografia para o conteúdo legal ───────────────────────────────

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl text-[var(--color-brand-800)] pt-8 mb-3 leading-snug">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-semibold text-lg text-stone-800 pt-4 mb-2">
      {children}
    </h3>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px]">{children}</p>;
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6 space-y-1.5 text-[15px] marker:text-[var(--color-brand-400)]">{children}</ul>;
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-[var(--color-brand-300)] bg-stone-50 rounded-r-lg px-4 py-3 text-[14px] text-stone-600">
      {children}
    </div>
  );
}
