import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';
import { useApp } from '../store';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const PHASE_TITLES: Record<string, string> = {
  '/comecar/guia':   'Intenções de Jornada',
  '/comecar/fase/1': 'Mapa de Energia',
  '/comecar/fase/2': 'Talentos na Mochila',
  '/comecar/fase/3': 'A Grande Causa',
  '/comecar/fase/4': 'Cenários de Vida',
  '/comecar/fase/5': 'Conexões que Importam',
  '/comecar/fase/6': 'O Garimpo',
  '/comecar/fase/7': 'A Carta para o Eu de Amanhã',
  '/comecar/salvar': 'Salvar Jornada',
};

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();
  
  const phaseMatch = pathname.match(/\/comecar\/fase\/(\d)/);
  const missionId = phaseMatch ? parseInt(phaseMatch[1], 10) : null;
  const isSavePage = pathname.includes('salvar');
  
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
            {[1, 2, 3, 4, 5, 6, 7].map(step => (
              <div 
                key={step} 
                className={cn(
                  "w-6 md:w-10 h-2 rounded-full",
                  missionId && step <= missionId 
                    ? "bg-[var(--neon-cyan)] shadow-[var(--btn-shadow)]" 
                    : "bg-[var(--glass)]"
                )}
              />
            ))}
          </div>

          <div className="text-sm font-bold opacity-70 hidden md:block uppercase tracking-wider text-[var(--text-main)]">
            {missionId ? `FASE 0${missionId}` : 'FASE 00'}: {PHASE_TITLES[pathname] || ''}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
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
