
import React from 'react';

interface WelcomeScreenProps {
  onExampleClick: (prompt: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  const examples = [
    "Explain quantum computing in simple terms",
    "What are some healthy dinner recipes?",
    "Write a short story about a robot who discovers music",
    "How does a black hole work?",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
      <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-tr from-purple-600 to-blue-400 flex-shrink-0"></div>
      <h2 className="text-3xl font-bold text-gray-200 mb-2">Hello!</h2>
      <p className="max-w-md mb-8">
        I'm a friendly assistant powered by Gemini. How can I help you today?
      </p>

      <div className="w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onExampleClick(example)}
            className="p-4 bg-gray-800/80 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-left"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
