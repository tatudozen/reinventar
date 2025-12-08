
import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './store/GameContext';
import { Wheel } from './components/Wheel';
import { DeckScreen } from './screens/Deck';
import { CardReader } from './screens/CardReader';
import { AuditScreen } from './screens/Audit';
import { quotes } from './data';
import { Quote } from './types';
import { Wifi, WifiOff, AlertTriangle, RefreshCcw } from 'lucide-react';

const ConnectionStatus: React.FC = () => {
  const { isOffline, isInitialized, connectionError } = useGame();
  
  if (!isInitialized) return null;

  return (
    <div 
      className={`fixed bottom-2 right-2 z-50 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono shadow-md backdrop-blur transition-all ${isOffline ? 'bg-red-50 border border-red-200 cursor-help' : 'bg-white/80'}`}
      title={isOffline ? (connectionError || "Modo Offline") : "Conectado ao Firebase"}
    >
      {isOffline ? (
        <>
          {connectionError && connectionError.includes("Regras") ? (
             <AlertTriangle size={14} className="text-red-600" />
          ) : (
             <WifiOff size={14} className="text-red-500" />
          )}
          <span className="text-red-700 font-bold">Offline</span>
          {connectionError && (
             <span className="hidden sm:inline text-red-500 truncate max-w-[200px] ml-1 opacity-75">
               - {connectionError}
             </span>
          )}
        </>
      ) : (
        <>
          <Wifi size={14} className="text-green-500" />
          <span className="text-gray-500">Online</span>
        </>
      )}
    </div>
  );
};

const MainContent: React.FC = () => {
  const { currentScreen, goToScreen, completedCategories, resetProgress } = useGame();
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  useEffect(() => {
    if (currentScreen === 'quote') {
        setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  }, [currentScreen]);

  return (
    <>
      <ConnectionStatus />
      {(() => {
        switch (currentScreen) {
          case 'landing':
            return (
              <div className="min-h-screen bg-brand-blue flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-brand-blue z-0"></div>
                 <div className="z-10 text-center">
                   <h1 className="text-5xl font-bold mb-4 tracking-tighter">JORNADA 50+</h1>
                   <p className="text-xl mb-12 opacity-90 font-light">Redescubra. Reinvente. Realize.</p>
                   <button 
                      onClick={() => goToScreen('selection')}
                      className="bg-white text-brand-blue px-10 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                   >
                      INICIAR CICLO
                   </button>
                 </div>
              </div>
            );
          
          case 'selection':
            return (
              <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
                <div className="text-center mb-8">
                  <h2 className="text-white text-3xl font-light mb-2">Selecione uma área</h2>
                  <p className="text-gray-400 text-sm tracking-widest uppercase">
                    {completedCategories.length} de 5 Concluídas
                  </p>
                  <div className="w-full max-w-[100px] h-1 bg-gray-700 mx-auto mt-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-orange transition-all duration-1000" 
                      style={{ width: `${(completedCategories.length / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <Wheel />
                
                {/* Botão de Reset (Útil para testes) - Agora com ação imediata */}
                <button 
                  onClick={() => resetProgress(true)}
                  className="mt-12 flex items-center gap-2 text-gray-600 hover:text-red-400 text-xs transition-colors px-4 py-2 rounded border border-transparent hover:border-gray-800"
                >
                  <RefreshCcw size={12} />
                  Reiniciar Jornada (Forçar Reset)
                </button>
              </div>
            );

          case 'quote':
            return (
              <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                 <p className="text-2xl md:text-3xl text-white font-serif italic mb-6 leading-relaxed">
                   "{currentQuote?.text}"
                 </p>
                 <p className="text-gray-500 font-medium tracking-widest uppercase text-sm">
                   — {currentQuote?.author}
                 </p>
              </div>
            );

          case 'deck':
            return <DeckScreen />;

          case 'card':
            return <CardReader />;
            
          case 'audit':
            return <AuditScreen />;

          default:
            return <div>Screen not found</div>;
        }
      })()}
    </>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <MainContent />
    </GameProvider>
  );
};

export default App;
