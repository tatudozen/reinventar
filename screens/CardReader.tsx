import React, { useState, useEffect } from 'react';
import { useGame } from '../store/GameContext';
import { categories } from '../data';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

export const CardReader: React.FC = () => {
  const { currentCategoryKey, currentQuestionIndex, goToScreen, saveAnswer, answers, completeCategory } = useGame();
  const [isFlipped, setIsFlipped] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const category = currentCategoryKey ? categories[currentCategoryKey] : null;
  const question = (category && currentQuestionIndex !== null) 
    ? category.questions[currentQuestionIndex] 
    : "Pergunta não encontrada";

  // Load existing answer if any
  useEffect(() => {
    // Logic to load answer from context would go here
    // For now we start fresh or from context if persisted
  }, []);

  const handleSave = () => {
    saveAnswer(inputText);
    completeCategory();
  };

  if (!category) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <button onClick={() => goToScreen('deck')} className="text-gray-500 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <span className="text-sm font-bold tracking-wider text-gray-400 uppercase">
          {category.label}
        </span>
        <div className="w-6"></div>
      </div>

      {/* 3D Card Container */}
      <div 
        className="relative w-full max-w-[320px] aspect-[3/4] cursor-pointer perspective-1000 mb-8"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div 
          className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* FRONT */}
          <div 
            className="absolute inset-0 backface-hidden rounded-2xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: category.color }}
          >
            {/* Placeholder Image Logic */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white bg-gradient-to-br from-white/10 to-black/10">
               <img 
                 src={`https://placehold.co/300x400/${category.color.replace('#', '')}/FFFFFF/png?text=${category.label}`} 
                 alt="Card Front"
                 className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-overlay"
               />
               <div className="z-10 bg-white/20 backdrop-blur-sm p-4 rounded-full mb-4">
                 <Sparkles className="w-8 h-8 text-white" />
               </div>
               <p className="z-10 text-white font-medium tracking-wide animate-pulse">Toque para revelar</p>
            </div>
          </div>

          {/* BACK */}
          <div 
            className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl shadow-2xl overflow-hidden bg-white flex flex-col"
          >
            <div className="h-2 w-full" style={{ backgroundColor: category.color }}></div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Reflexão</span>
              <h3 className="text-xl font-medium text-gray-800 leading-relaxed">
                {question}
              </h3>
            </div>
            <div className="h-4 w-full" style={{ backgroundColor: category.color }}></div>
          </div>
        </div>
      </div>

      {/* Input Section - Only visible if flipped */}
      <div className={`w-full max-w-md transition-all duration-700 transform ${isFlipped ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Sua resposta:
          </label>
          <textarea
            className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent outline-none resize-none text-gray-700 bg-gray-50"
            style={{ '--tw-ring-color': category.color } as React.CSSProperties}
            placeholder="Escreva seus pensamentos aqui..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          
          <button
            onClick={handleSave}
            disabled={!inputText.trim()}
            className="mt-4 w-full py-3 rounded-lg text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ backgroundColor: category.color }}
          >
            <Save size={18} />
            SALVAR E CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
};