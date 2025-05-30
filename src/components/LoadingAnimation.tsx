
import React from 'react';
import { Brain, Zap, Sparkles } from 'lucide-react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-vibeflow-dark/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-8 max-w-md mx-auto p-8">
        {/* Floating Orbs Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-orb w-32 h-32 top-4 left-4 animate-pulse"></div>
          <div className="floating-orb w-24 h-24 bottom-8 right-8 animate-pulse delay-1000"></div>
          <div className="floating-orb w-16 h-16 top-1/2 right-1/4 animate-pulse delay-2000"></div>
        </div>

        {/* Main Loading Animation */}
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            {/* Rotating outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-vibeflow-violet/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-vibeflow-violet animate-spin"></div>
            
            {/* Pulsing center */}
            <div className="absolute inset-3 bg-vibeflow-gradient rounded-full flex items-center justify-center animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold gradient-text">
              AI Processing Document
            </h2>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-white/70">
                <Zap className="w-4 h-4 animate-pulse" />
                <span>Analyzing content structure...</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/70">
                <Sparkles className="w-4 h-4 animate-pulse delay-500" />
                <span>Generating intelligent tasks...</span>
              </div>
            </div>

            {/* Loading dots */}
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-2 h-2 bg-vibeflow-violet rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-vibeflow-blue rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-vibeflow-emerald rounded-full animate-bounce delay-300"></div>
            </div>

            <p className="text-sm text-white/50 mt-4">
              This may take a few moments for complex documents
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
