
import React, { useState } from 'react';

interface TextHoverEffectProps {
  text: string;
  className?: string;
}

const TextHoverEffect: React.FC<TextHoverEffectProps> = ({ text, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative inline-block cursor-default ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10 transition-all duration-300">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={`inline-block transition-all duration-300 ${
              isHovered ? 'animate-magnetic text-shadow' : ''
            }`}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {char}
          </span>
        ))}
      </span>
      
      {/* Gradient background effect */}
      <div
        className={`absolute inset-0 bg-vibeflow-gradient opacity-0 blur-xl transition-opacity duration-500 ${
          isHovered ? 'opacity-30' : ''
        }`}
      />
    </div>
  );
};

export default TextHoverEffect;
