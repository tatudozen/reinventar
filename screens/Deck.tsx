
import React, { useMemo } from 'react';
import { useGame } from '../store/GameContext';
import { categories } from '../data';
import { ChevronLeft } from 'lucide-react';

export const DeckScreen: React.FC = () => {
  const { currentCategoryKey, selectCard, goToScreen } = useGame();
  
  const category = currentCategoryKey ? categories[currentCategoryKey] : null;

  // Shuffle logic ensuring we use available questions
  // Maps visual index (0-7) to actual question index
  const shuffledIndices = useMemo(() => {
    if (!category) return [];
    const indices = category.questions.map((_, i) => i);
    // Simple shuffle
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [category]);

  if (!category) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-lg mb-4 flex items-center">
        <button 
          onClick={() => goToScreen('selection')}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="flex-1 text-center text-xl font-bold tracking-widest uppercase text-gray-700">
            {category.label}
        </h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-light text-gray-800 mb-1">Escolha uma carta</h1>
        <p className="text-sm text-gray-500">Siga sua intuição</p>
      </div>

      {/* Grid for 8 cards */}
      <div className="grid grid-cols-4 gap-3 max-w-md w-full">
        {shuffledIndices.map((questionIndex, i) => (
          <button
            key={i}
            onClick={() => selectCard(questionIndex)}
            className="relative w-full aspect-[2/3] rounded-lg shadow-md transform transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-1 overflow-hidden group bg-gray-200"
            style={{ 
                // Border color from category
                '--tw-ring-color': category.color
            } as React.CSSProperties}
          >
            {/* Background Image Logic */}
            <img 
              src={category.cardBackImage} 
              alt="Card Back" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                // Fallback caso a imagem não carregue: usa cor sólida
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.backgroundColor = category.color;
              }}
            />
            
            {/* Overlay Gradient for readability */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

            {/* Card Number (1-8) */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white drop-shadow-md font-serif border-2 border-white/60 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                  {i + 1}
                </span>
            </div>
            
            {/* Decorative Border */}
            <div className="absolute inset-1 border border-white/40 rounded-md border-dashed opacity-70"></div>
          </button>
        ))}
      </div>
    </div>
  );
};
