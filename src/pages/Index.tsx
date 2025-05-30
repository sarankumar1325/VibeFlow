import React, { useState } from 'react';
import { Brain, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import DocumentUpload from '@/components/DocumentUpload';
import TaskViewer from '@/components/TaskViewer';
import LoadingAnimation from '@/components/LoadingAnimation';
import TextHoverEffect from '@/components/TextHoverEffect';
import { PDFExtractionResult } from '@/services/pdfService';
import { EnhancedGeminiService, AIProcessingResult } from '@/services/enhancedGeminiService';

const Index = () => {
  const [extractedDocument, setExtractedDocument] = useState<PDFExtractionResult | null>(null);
  const [aiResult, setAiResult] = useState<AIProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyBHiSdm1ZUwlyEM3tNt5BX9cuvwuMFwRZI');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const { toast } = useToast();

  const handleFileProcessed = async (result: PDFExtractionResult) => {
    console.log('📄 Document processed:', result);
    setExtractedDocument(result);
    
    // Check if we have an API key
    if (!apiKey) {
      setShowApiKeyInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your Google Gemini API key to process with AI.",
        variant: "destructive",
      });
      return;
    }
    
    await processWithAI(result);
  };

  const processWithAI = async (docResult: PDFExtractionResult) => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Gemini API key.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('🤖 Starting AI processing...');
      const geminiService = new EnhancedGeminiService(apiKey);
      
      const projectContext = `
        Project Type: Document Analysis and Task Generation
        Tech Stack: React, TypeScript, Tailwind CSS, PDF.js, Gemini AI
        Goal: Transform project documents into actionable task breakdowns
        Target: Professional software development teams and AI agents
      `;
      
      const result = await geminiService.processDocument(
        docResult.text,
        docResult.metadata.fileName,
        projectContext
      );
      
      if (result.success) {
        setAiResult(result);
        toast({
          title: "AI Processing Complete!",
          description: `Generated ${result.tasks.length} intelligent tasks from your document.`,
        });
      } else {
        throw new Error(result.error || 'AI processing failed');
      }
      
    } catch (error) {
      console.error('❌ AI processing error:', error);
      toast({
        title: "AI Processing Failed",
        description: error instanceof Error ? error.message : "Failed to process document with AI.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApiKeySubmit = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid Google Gemini API key.",
        variant: "destructive",
      });
      return;
    }
    
    setShowApiKeyInput(false);
    
    if (extractedDocument) {
      await processWithAI(extractedDocument);
    }
  };

  const resetApp = () => {
    setExtractedDocument(null);
    setAiResult(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-vibeflow-dark relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-96 h-96 -top-48 -left-48 opacity-30"></div>
        <div className="floating-orb w-80 h-80 -bottom-40 -right-40 opacity-20"></div>
        <div className="floating-orb w-64 h-64 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-vibeflow-gradient rounded-xl flex items-center justify-center glow-effect">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">
                  <TextHoverEffect text="VibeFlow" className="gradient-text" />
                </h1>
                <p className="text-sm text-white/60">Premium AI-Powered Project Intelligence</p>
              </div>
            </div>
            
            {(extractedDocument || aiResult) && (
              <Button 
                onClick={resetApp}
                variant="outline" 
                className="glass-effect border-white/20 hover:border-vibeflow-violet/50"
              >
                New Document
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        {!extractedDocument && !aiResult && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-4xl mx-auto animate-fade-in">
              <h2 className="text-4xl md:text-6xl font-display font-bold gradient-text leading-tight">
                Transform Documents into 
                <br />
                Intelligent Tasks
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                Upload complex project documents and let our AI transform them into structured, 
                actionable tasks with intelligent prioritization and resource optimization.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-vibeflow-emerald rounded-full animate-pulse"></div>
                  Enterprise Ready
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-vibeflow-blue rounded-full animate-pulse delay-200"></div>
                  AI-Powered Analysis
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-vibeflow-purple rounded-full animate-pulse delay-400"></div>
                  Optimized for Scale
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <DocumentUpload 
              onFileProcessed={handleFileProcessed}
              isProcessing={isProcessing}
            />

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-fade-in">
              <Card className="glass-effect p-6 text-center magnetic-hover">
                <div className="w-16 h-16 bg-vibeflow-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-vibeflow-blue" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  AI Intelligence
                </h3>
                <p className="text-white/70">
                  Advanced AI analysis transforms complex documents into structured, actionable insights
                </p>
              </Card>

              <Card className="glass-effect p-6 text-center magnetic-hover">
                <div className="w-16 h-16 bg-vibeflow-violet/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-vibeflow-violet" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  Smart Prioritization
                </h3>
                <p className="text-white/70">
                  Intelligent task prioritization with risk assessment and resource optimization
                </p>
              </Card>

              <Card className="glass-effect p-6 text-center magnetic-hover">
                <div className="w-16 h-16 bg-vibeflow-emerald/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-vibeflow-emerald" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  Collaboration Ready
                </h3>
                <p className="text-white/70">
                  Export, edit, and manage tasks with real-time collaboration features
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* API Key Input Modal */}
        {showApiKeyInput && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="glass-effect max-w-md w-full p-6 animate-scale-in">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-vibeflow-gradient rounded-2xl flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white">
                  Google Gemini API Key Required
                </h3>
                <p className="text-sm text-white/70">
                  Enter your Google Gemini API key to enable AI-powered task generation.
                </p>
                <input
                  type="password"
                  placeholder="Enter your API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-vibeflow-violet"
                  onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
                />
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setShowApiKeyInput(false)}
                    variant="outline"
                    className="flex-1 border-white/20"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleApiKeySubmit}
                    className="flex-1 bg-vibeflow-gradient hover:opacity-90"
                  >
                    Continue
                  </Button>
                </div>
                <p className="text-xs text-white/50">
                  Your API key is stored locally and never sent to our servers
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Document Preview */}
        {extractedDocument && !aiResult && !isProcessing && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-display font-bold gradient-text">
                Document Processed Successfully
              </h2>
              <p className="text-white/70">
                Ready to generate intelligent tasks from your document
              </p>
            </div>
            
            <Card className="glass-effect max-w-4xl mx-auto">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {extractedDocument.metadata.fileName}
                  </h3>
                  <Button
                    onClick={() => processWithAI(extractedDocument)}
                    className="bg-vibeflow-gradient hover:opacity-90"
                  >
                    Generate Tasks with AI
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Pages:</span>
                    <span className="text-white ml-2">{extractedDocument.metadata.pageCount}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Size:</span>
                    <span className="text-white ml-2">{Math.round(extractedDocument.metadata.fileSize / 1024)}KB</span>
                  </div>
                  <div>
                    <span className="text-white/60">Characters:</span>
                    <span className="text-white ml-2">{extractedDocument.text.length}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Words:</span>
                    <span className="text-white ml-2">{extractedDocument.text.split(' ').length}</span>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <p className="text-sm text-white/70 font-mono leading-relaxed">
                    {extractedDocument.text.substring(0, 500)}
                    {extractedDocument.text.length > 500 && '...'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* AI Results */}
        {aiResult && (
          <div className="animate-fade-in">
            <TaskViewer result={aiResult} />
          </div>
        )}
      </main>

      {/* Loading Overlay */}
      {isProcessing && <LoadingAnimation />}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-white/50">
            Powered by <span className="gradient-text font-semibold">VibeFlow AI</span> • 
            Enterprise-ready project intelligence platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
