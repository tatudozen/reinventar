
import React from 'react';
import { categories } from '../data';
import { useGame } from '../store/GameContext';

export const Wheel: React.FC = () => {
  const { selectCategory, completedCategories } = useGame();
  
  const categoryKeys = Object.keys(categories);
  const total = categoryKeys.length;
  const radius = 150;
  const center = 150;
  const textRadius = 115;
  const rotationOffset = -162;

  return (
    <div className="w-full max-w-md mx-auto aspect-square relative">
      <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
        {categoryKeys.map((key, index) => {
          const category = categories[key];
          const isCompleted = completedCategories.includes(key);
          
          const startAngle = (index * 360) / total + rotationOffset;
          const endAngle = ((index + 1) * 360) / total + rotationOffset;

          const x1 = center + radius * Math.cos(Math.PI * startAngle / 180);
          const y1 = center + radius * Math.sin(Math.PI * startAngle / 180);
          const x2 = center + radius * Math.cos(Math.PI * endAngle / 180);
          const y2 = center + radius * Math.sin(Math.PI * endAngle / 180);

          const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

          // Text Path Logic
          let midAngle = (startAngle + endAngle) / 2;
          midAngle = (midAngle % 360 + 360) % 360;
          const isBottomHalf = midAngle > 0 && midAngle < 180;

          let textPathData;
          if (isBottomHalf) {
            const tx1 = center + textRadius * Math.cos(Math.PI * endAngle / 180);
            const ty1 = center + textRadius * Math.sin(Math.PI * endAngle / 180);
            const tx2 = center + textRadius * Math.cos(Math.PI * startAngle / 180);
            const ty2 = center + textRadius * Math.sin(Math.PI * startAngle / 180);
            textPathData = `M ${tx1} ${ty1} A ${textRadius} ${textRadius} 0 0 0 ${tx2} ${ty2}`;
          } else {
            const tx1 = center + textRadius * Math.cos(Math.PI * startAngle / 180);
            const ty1 = center + textRadius * Math.sin(Math.PI * startAngle / 180);
            const tx2 = center + textRadius * Math.cos(Math.PI * endAngle / 180);
            const ty2 = center + textRadius * Math.sin(Math.PI * endAngle / 180);
            textPathData = `M ${tx1} ${ty1} A ${textRadius} ${textRadius} 0 0 1 ${tx2} ${ty2}`;
          }

          const pathId = `text-path-${key}`;

          // Visual Styles based on completion
          const fillColor = isCompleted ? '#D1D5DB' : category.color; // Gray-300 if done
          const labelText = isCompleted ? `✓ ${category.label}` : category.label;
          // Se estiver completo, remove interatividade visual e de clique
          const cursorClass = isCompleted ? 'cursor-default' : 'cursor-pointer hover:opacity-90 active:scale-95';

          return (
            <g 
              key={key} 
              onClick={() => !isCompleted && selectCategory(key)} 
              className={`transition-all origin-center ${cursorClass}`}
            >
              <defs>
                <path id={pathId} d={textPathData} />
              </defs>
              <path 
                d={pathData} 
                fill={fillColor} 
                stroke="white" 
                strokeWidth="2"
                className="transition-colors duration-500"
              />
              <text 
                fill="white" 
                fontSize="13" 
                fontWeight="bold" 
                letterSpacing="1"
                className="uppercase pointer-events-none select-none"
              >
                <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
                  {labelText}
                </textPath>
              </text>
            </g>
          );
        })}
        {/* Center decorative circle */}
        <circle cx={center} cy={center} r={30} fill="white" className="shadow-inner" />
        <circle cx={center} cy={center} r={25} fill="#f3f4f6" />
      </svg>
    </div>
  );
};
