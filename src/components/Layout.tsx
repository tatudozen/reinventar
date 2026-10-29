import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, ArrowLeft, RotateCcw } from 'lucide-react';
import { useApp, type AppState } from '../store';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const PHASE_TITLES: Record<string, string> = {
  '/comecar/guia':   'Intenções de Jornada',
  '/comecar/fase/1': 'Mapa de Energia',
  '/comecar/fase/2': 'Talentos na Mochila',
  '/comecar/fase/3': 'Cenários de Vida',
  '/comecar/fase/4': 'O Garimpo',
  '/comecar/fase/5': 'A Dor que Você Resolve',
  '/comecar/fase/6': 'Público e Cliente',
  '/comecar/fase/7': 'O Modelo da Reinvenção',
  '/comecar/fase/8': 'A Carta para o Eu de Amanhã',
  '/comecar/salvar': 'Salvar Jornada',
};

// Fatias do store que cada fase preenche — usadas por "Refazer esta fase".
const PHASE_SLICES: Record<number, (keyof AppState)[]> = {
  1: ['phase1'],       // Mapa de Energia
  2: ['phase2'],       // Talentos + chapéu de dono
  3: ['phase4'],       // Cenários de Vida
  4: ['phase7'],       // O Garimpo
  5: ['phase3'],       // A Dor que Você Resolve
  6: ['phase6'],       // Público e Cliente
  7: ['businessModel'],// O Modelo da Reinvenção
  8: ['phase8'],       // A Carta
};

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state, resetPhases } = useApp();
  const [remountKey, setRemountKey] = useState(0);

  const phaseMatch = pathname.match(/\/comecar\/fase\/(\d)/);
  const missionId = phaseMatch ? parseInt(phaseMatch[1], 10) : null;
  const isSavePage = pathname.includes('salvar');

  const handleRedoPhase = () => {
    if (!missionId) return;
    const slices = PHASE_SLICES[missionId];
    if (slices) resetPhases(slices);
    setRemountKey(k => k + 1); // força remontar a fase do zero
  };

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-main)]">
      {/* Top Banner Wrapper - Cyber-Tech Themed */}
      {!isSavePage && (
        <header className="h-[70px] flex justify-between items-center px-6 md:px-10 border-b border-[var(--color-brand-100)] bg-[var(--bg-dark)]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-full hover:bg-[var(--glass)] text-[var(--text-main)] transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-[11px] uppercase tracking-[2px] text-[var(--neon-cyan)] font-bold hidden md:inline">Reinventar</span>
            <div className="bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)] px-4 py-1.5 rounded-full font-extrabold text-sm tracking-widest shadow-md text-white">
              XP: {state.xp}
            </div>
          </div>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(step => (
              <button
                key={step}
                onClick={() => navigate(`/comecar/fase/${step}`)}
                aria-label={`Ir para a fase ${step}`}
                title={`Ir para a fase ${step}`}
                className={cn(
                  "w-6 md:w-10 h-2 rounded-full transition-transform hover:scale-110 cursor-pointer",
                  missionId && step <= missionId
                    ? "bg-[var(--neon-cyan)] shadow-[var(--btn-shadow)]"
                    : "bg-[var(--glass)]"
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {missionId && (
              <button
                onClick={handleRedoPhase}
                title="Refazer esta fase (apaga as respostas desta fase)"
                aria-label="Refazer esta fase"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-brand-200)] text-[var(--color-text-muted)] hover:text-[var(--text-main)] hover:border-[var(--color-brand-400)] transition-colors text-xs font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Refazer fase</span>
              </button>
            )}
            <div className="text-sm font-bold opacity-70 hidden lg:block uppercase tracking-wider text-[var(--text-main)]">
              {missionId ? `FASE 0${missionId}` : 'FASE 00'}: {PHASE_TITLES[pathname] || ''}
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${pathname}-${remountKey}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
