import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, CheckCircle2, FileText, FolderOpen, Code, BookOpen, Wrench, Map, Menu, X, BarChart3, Settings, Home, Upload, ArrowRight, Star, Users, Shield, Sparkles, Play, ChevronDown, Download, Clock, Target, TrendingUp, Github, Twitter, Linkedin, Mail, Heart, Globe, Lock, Zap as Lightning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import DocumentUpload from '@/components/DocumentUpload';
import TaskViewer from '@/components/TaskViewer';
import LoadingAnimation from '@/components/LoadingAnimation';
import TextHoverEffect from '@/components/TextHoverEffect';
import { PDFExtractionResult } from '@/services/pdfService';
import { EnhancedGeminiService, AIProcessingResult } from '@/services/enhancedGeminiService';

const Index = () => {
  const location = useLocation();
  const { user } = useUser();
  const [extractedDocument, setExtractedDocument] = useState<PDFExtractionResult | null>(null);
  const [aiResult, setAiResult] = useState<AIProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyBHiSdm1ZUwlyEM3tNt5BX9cuvwuMFwRZI');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [playDemo, setPlayDemo] = useState(false);
  const { toast } = useToast();

  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  // Handle scroll animations
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (demoRef.current) {
      observer.observe(demoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Helper function to determine if a path is active
  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    return path !== '/' && location.pathname.startsWith(path);
  };

  // Helper function to get button classes with active state
  const getNavButtonClasses = (path: string, baseClasses: string) => {
    const isActive = isActivePath(path);
    return `${baseClasses} ${isActive ? 'bg-white/10 border-vibeflow-blue text-white' : ''}`;
  };

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
      <header className={`relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-md transition-all duration-300 ${scrollY > 50 ? 'shadow-lg shadow-black/20 bg-black/40' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Section */}
            <Link to="/" className="flex items-center gap-3 group min-w-0 relative">
              <div className="w-10 h-10 bg-vibeflow-gradient rounded-xl flex items-center justify-center glow-effect group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0 group-hover:shadow-lg group-hover:shadow-vibeflow-violet/20">
                <Brain className="w-5 h-5 text-white group-hover:scale-110 transition-all duration-300" />
              </div>
              <div className="hidden sm:block min-w-0">
                <h1 className="text-xl font-display font-bold text-white truncate group-hover:text-vibeflow-violet transition-colors duration-300">
                  <TextHoverEffect text="VibeFlow" />
                </h1>
              </div>
              {/* Animated underline */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-vibeflow-gradient group-hover:w-full transition-all duration-300"></div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center flex-1 max-w-3xl mx-8" role="navigation" aria-label="Main navigation">
              <div className="flex items-center space-x-1 bg-black/20 rounded-xl p-1 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-black/30">
                {/* Primary Navigation Group */}
                <Link to="/" className="relative group">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`${getNavButtonClasses('/', 'px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 hover:scale-105 relative overflow-hidden')} group-hover:shadow-lg group-hover:shadow-vibeflow-blue/20`}
                    aria-label="Home"
                  >
                    <Home className="w-4 h-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:text-vibeflow-blue" />
                    <span className="text-sm font-medium group-hover:translate-x-0.5 transition-all duration-300">Home</span>
                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                  </Button>
                  {/* Sliding indicator */}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-vibeflow-blue transition-all duration-300 ${isActivePath('/') ? 'w-3/4' : 'group-hover:w-1/2'}`}></div>
                </Link>
                
                <Link to="/projects" className="relative group">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`${getNavButtonClasses('/projects', 'px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 hover:scale-105 relative overflow-hidden')} group-hover:shadow-lg group-hover:shadow-vibeflow-emerald/20`}
                    aria-label="Projects"
                  >
                    <CheckCircle2 className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 group-hover:text-vibeflow-emerald" />
                    <span className="text-sm font-medium group-hover:translate-x-0.5 transition-all duration-300">Projects</span>
                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                  </Button>
                  {/* Sliding indicator */}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-vibeflow-emerald transition-all duration-300 ${isActivePath('/projects') ? 'w-3/4' : 'group-hover:w-1/2'}`}></div>
                </Link>
                
                <Link to="/analytics" className="relative group">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`${getNavButtonClasses('/analytics', 'px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 hover:scale-105 relative overflow-hidden')} group-hover:shadow-lg group-hover:shadow-vibeflow-purple/20`}
                    aria-label="Analytics"
                  >
                    <BarChart3 className="w-4 h-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:text-vibeflow-purple" />
                    <span className="text-sm font-medium group-hover:translate-x-0.5 transition-all duration-300">Analytics</span>
                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                  </Button>
                  {/* Sliding indicator */}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-vibeflow-purple transition-all duration-300 ${isActivePath('/analytics') ? 'w-3/4' : 'group-hover:w-1/2'}`}></div>
                </Link>
                
                <Link to="/resources" className="relative group">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`${getNavButtonClasses('/resources', 'px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 hover:scale-105 relative overflow-hidden')} group-hover:shadow-lg group-hover:shadow-vibeflow-violet/20`}
                    aria-label="Resources"
                  >
                    <FolderOpen className="w-4 h-4 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 group-hover:text-vibeflow-violet" />
                    <span className="text-sm font-medium group-hover:translate-x-0.5 transition-all duration-300">Resources</span>
                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                  </Button>
                  {/* Sliding indicator */}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-vibeflow-violet transition-all duration-300 ${isActivePath('/resources') ? 'w-3/4' : 'group-hover:w-1/2'}`}></div>
                </Link>
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* User Profile */}
              <div className="hidden lg:flex items-center gap-2 group">
                <div className="relative">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-vibeflow-violet/30",
                        userButtonPopoverCard: "bg-black/90 border border-white/20",
                        userButtonPopoverActions: "text-white",
                        userButtonPopoverFooter: "hidden"
                      }
                    }}
                  />
                  {/* Animated ring around avatar */}
                  <div className="absolute inset-0 rounded-full border-2 border-vibeflow-violet/0 group-hover:border-vibeflow-violet/50 transition-all duration-300 group-hover:scale-125"></div>
                </div>
              </div>

              {/* Action Button for New Document */}
              {(extractedDocument || aiResult) && (
                <div className="relative group">
                  <Button 
                    onClick={resetApp}
                    variant="outline" 
                    size="sm"
                    className="hidden md:flex glass-effect border-white/20 hover:border-vibeflow-violet/50 hover:bg-vibeflow-violet/10 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105 hover:shadow-lg hover:shadow-vibeflow-violet/20 group-hover:-translate-y-0.5"
                  >
                    <span className="group-hover:translate-x-0.5 transition-all duration-300">New Document</span>
                  </Button>
                  {/* Floating particles effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-1 left-1 w-1 h-1 bg-vibeflow-violet rounded-full animate-ping"></div>
                    <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-vibeflow-blue rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-3 group-hover:shadow-lg group-hover:shadow-white/10"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  <div className="relative">
                    {isMobileMenuOpen ? (
                      <X className="w-5 h-5 group-hover:rotate-90 transition-all duration-300" />
                    ) : (
                      <Menu className="w-5 h-5 group-hover:scale-110 transition-all duration-300" />
                    )}
                  </div>
                </Button>
                {/* Animated border */}
                <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-white/20 transition-all duration-300"></div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-black/30 backdrop-blur-md border-b border-white/10 animate-in slide-in-from-top-2 duration-300 shadow-xl z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Primary Navigation */}
                <div className="space-y-1 mb-6">
                  <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3 px-3 animate-in fade-in duration-500 delay-100">
                    Navigation
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    <div className="animate-in slide-in-from-left-4 duration-300 delay-150">
                      <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block group">
                        <Button 
                          variant="ghost" 
                          className={`${getNavButtonClasses('/', 'w-full justify-start text-white/80 hover:text-white hover:bg-white/10 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:translate-x-2 relative overflow-hidden')} group-hover:shadow-lg group-hover:shadow-vibeflow-blue/20`}
                        >
                          <Home className="w-5 h-5 mr-3 group-hover:scale-110 group-hover:rotate-6 group-hover:text-vibeflow-blue transition-all duration-300" />
                          <span className="font-medium group-hover:translate-x-1 transition-all duration-300">Home</span>
                          {/* Slide effect */}
                          <div className="absolute left-0 top-0 h-full w-1 bg-vibeflow-blue scale-y-0 group-hover:scale-y-100 transition-all duration-300 origin-top"></div>
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="animate-in slide-in-from-left-4 duration-300 delay-200">
                      <Link to="/projects" onClick={() => setIsMobileMenuOpen(false)} className="block group">
                        <Button 
                          variant="ghost" 
                          className={`${getNavButtonClasses('/projects', 'w-full justify-start text-white/80 hover:text-white hover:bg-white/10 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:translate-x-2 relative overflow-hidden')} group-hover:shadow-lg group-hover:shadow-vibeflow-emerald/20`}
                        >
                          <CheckCircle2 className="w-5 h-5 mr-3 group-hover:scale-110 group-hover:rotate-12 group-hover:text-vibeflow-emerald transition-all duration-300" />
                          <span className="font-medium group-hover:translate-x-1 transition-all duration-300">Projects</span>
                          {/* Slide effect */}
                          <div className="absolute left-0 top-0 h-full w-1 bg-vibeflow-emerald scale-y-0 group-hover:scale-y-100 transition-all duration-300 origin-top"></div>
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="animate-in slide-in-from-left-4 duration-300 delay-250">
                      <Link to="/analytics" onClick={() => setIsMobileMenuOpen(false)} className="block group">
                        <Button 
                          variant="ghost" 
                          className={`${getNavButtonClasses('/analytics', 'w-full justify-start text-white/80 hover:text-white hover:bg-white/10 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:translate-x-2 relative overflow-hidden')} group-hover:shadow-lg group-hover:shadow-vibeflow-purple/20`}
                        >
                          <BarChart3 className="w-5 h-5 mr-3 group-hover:scale-110 group-hover:rotate-3 group-hover:text-vibeflow-purple transition-all duration-300" />
                          <span className="font-medium group-hover:translate-x-1 transition-all duration-300">Analytics</span>
                          {/* Slide effect */}
                          <div className="absolute left-0 top-0 h-full w-1 bg-vibeflow-purple scale-y-0 group-hover:scale-y-100 transition-all duration-300 origin-top"></div>
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="animate-in slide-in-from-left-4 duration-300 delay-300">
                      <Link to="/resources" onClick={() => setIsMobileMenuOpen(false)} className="block group">
                        <Button 
                          variant="ghost" 
                          className={`${getNavButtonClasses('/resources', 'w-full justify-start text-white/80 hover:text-white hover:bg-white/10 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:translate-x-2 relative overflow-hidden')} group-hover:shadow-lg group-hover:shadow-vibeflow-violet/20`}
                        >
                          <FolderOpen className="w-5 h-5 mr-3 group-hover:scale-110 group-hover:-rotate-6 group-hover:text-vibeflow-violet transition-all duration-300" />
                          <span className="font-medium group-hover:translate-x-1 transition-all duration-300">Resources</span>
                          {/* Slide effect */}
                          <div className="absolute left-0 top-0 h-full w-1 bg-vibeflow-violet scale-y-0 group-hover:scale-y-100 transition-all duration-300 origin-top"></div>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Secondary Navigation */}
                <div className="space-y-1 mb-6">
                  <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3 px-3">
                    Additional
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    <Link to="/templates" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        variant="ghost" 
                        className={getNavButtonClasses('/templates', 'w-full justify-start text-white/70 hover:text-white hover:bg-white/10 p-3 rounded-lg transition-all duration-200')}
                      >
                        <Code className="w-4 h-4 mr-2" />
                        <span className="text-sm">Templates</span>
                      </Button>
                    </Link>
                    
                    <Link to="/documentation" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        variant="ghost" 
                        className={getNavButtonClasses('/documentation', 'w-full justify-start text-white/70 hover:text-white hover:bg-white/10 p-3 rounded-lg transition-all duration-200')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        <span className="text-sm">Docs</span>
                      </Button>
                    </Link>
                    
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        variant="ghost" 
                        className={getNavButtonClasses('/about', 'w-full justify-start text-white/70 hover:text-white hover:bg-white/10 p-3 rounded-lg transition-all duration-200')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        <span className="text-sm">About</span>
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* User Profile Section */}
                <div className="space-y-1 mb-6 animate-in slide-in-from-bottom-4 duration-400 delay-350">
                  <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3 px-3 animate-in fade-in duration-500 delay-400">
                    Account
                  </p>
                  <div className="flex items-center justify-center p-4 group">
                    <div className="relative">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-10 h-10 hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-vibeflow-violet/30",
                            userButtonPopoverCard: "bg-black/90 border border-white/20",
                            userButtonPopoverActions: "text-white",
                            userButtonPopoverFooter: "hidden"
                          }
                        }}
                      />
                      {/* Animated ring around avatar */}
                      <div className="absolute inset-0 rounded-full border-2 border-vibeflow-violet/0 group-hover:border-vibeflow-violet/50 transition-all duration-300 group-hover:scale-125 group-hover:animate-pulse"></div>
                      {/* Floating particles */}
                      <div className="absolute -top-1 -left-1 w-1 h-1 bg-vibeflow-violet rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                      <div className="absolute -bottom-1 -right-1 w-0.5 h-0.5 bg-vibeflow-blue rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
                
                {/* Action Section */}
                {(extractedDocument || aiResult) && (
                  <div className="pt-4 border-t border-white/10 animate-in slide-in-from-bottom-4 duration-400 delay-400">
                    <div className="relative group">
                      <Button 
                        onClick={() => {
                          resetApp();
                          setIsMobileMenuOpen(false);
                        }}
                        variant="outline" 
                        className="w-full glass-effect border-white/20 hover:border-vibeflow-violet/50 hover:bg-vibeflow-violet/10 p-4 rounded-lg transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg hover:shadow-vibeflow-violet/20 group-hover:-translate-y-0.5 relative overflow-hidden"
                      >
                        <span className="group-hover:translate-x-1 transition-all duration-300">New Document</span>
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                      </Button>
                      {/* Floating particles */}
                      <div className="absolute top-2 right-2 w-1 h-1 bg-vibeflow-violet rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                      <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-vibeflow-blue rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce delay-300"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {!extractedDocument && !aiResult && (
          <>
            {/* Hero Section */}
            <section ref={heroRef} className="min-h-screen flex items-center justify-center relative">
              <div className="container mx-auto px-4 text-center space-y-8 max-w-6xl animate-fade-in">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-vibeflow-violet/10 border border-vibeflow-violet/20 rounded-full text-vibeflow-violet text-sm font-medium animate-glow">
                    <Sparkles className="w-4 h-4" />
                    AI-Powered Document Intelligence
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-display font-bold gradient-text leading-tight">
                    Transform Documents into 
                    <br />
                    <span className="relative gradient-text">
                      Intelligent Tasks
                      <div className="absolute -bottom-2 left-0 right-0 h-1 bg-vibeflow-gradient opacity-50 animate-pulse"></div>
                    </span>
                  </h1>
                  
                  {user && (
                    <div className="flex items-center justify-center gap-3 text-lg text-white/80 animate-fade-in">
                      <span>Welcome back,</span>
                      <span className="font-semibold text-vibeflow-violet">{user.firstName || user.username}</span>
                      <span>👋</span>
                    </div>
                  )}
                  
                  <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                    Upload complex project documents and let our advanced AI transform them into structured, 
                    actionable tasks with intelligent prioritization and resource optimization.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-8 text-sm text-white/50 pt-6">
                    <div className="flex items-center gap-2 group">
                      <div className="w-2 h-2 bg-vibeflow-emerald rounded-full animate-pulse group-hover:scale-150 transition-transform"></div>
                      <span className="group-hover:text-white/70 transition-colors">Enterprise Ready</span>
                    </div>
                    <div className="flex items-center gap-2 group">
                      <div className="w-2 h-2 bg-vibeflow-blue rounded-full animate-pulse delay-200 group-hover:scale-150 transition-transform"></div>
                      <span className="group-hover:text-white/70 transition-colors">AI-Powered Analysis</span>
                    </div>
                    <div className="flex items-center gap-2 group">
                      <div className="w-2 h-2 bg-vibeflow-purple rounded-full animate-pulse delay-400 group-hover:scale-150 transition-transform"></div>
                      <span className="group-hover:text-white/70 transition-colors">Optimized for Scale</span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                  <Button 
                    onClick={() => demoRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    size="lg"
                    className="bg-vibeflow-gradient hover:opacity-90 text-white font-semibold px-8 py-4 rounded-xl text-lg group"
                  >
                    See Demo
                    <Play className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      const uploadSection = document.querySelector('[data-upload-section]');
                      uploadSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-lg group"
                  >
                    Try Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <ChevronDown className="w-6 h-6 text-white/50" />
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
                  <div className="space-y-2 group cursor-pointer">
                    <div className="text-3xl md:text-4xl font-bold gradient-text group-hover:scale-110 transition-transform">98%</div>
                    <div className="text-white/70 text-sm">Accuracy Rate</div>
                  </div>
                  <div className="space-y-2 group cursor-pointer">
                    <div className="text-3xl md:text-4xl font-bold gradient-text group-hover:scale-110 transition-transform">15k+</div>
                    <div className="text-white/70 text-sm">Documents Processed</div>
                  </div>
                  <div className="space-y-2 group cursor-pointer">
                    <div className="text-3xl md:text-4xl font-bold gradient-text group-hover:scale-110 transition-transform">80%</div>
                    <div className="text-white/70 text-sm">Time Saved</div>
                  </div>
                  <div className="space-y-2 group cursor-pointer">
                    <div className="text-3xl md:text-4xl font-bold gradient-text group-hover:scale-110 transition-transform">500+</div>
                    <div className="text-white/70 text-sm">Teams Using</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Product Demo Section */}
            <section ref={demoRef} className="py-32 relative overflow-hidden">
              <div className="container mx-auto px-4">
                <div className="text-center space-y-6 mb-16 animate-fade-in">
                  <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
                    See VibeFlow in Action
                  </h2>
                  <p className="text-xl text-white/70 max-w-2xl mx-auto">
                    Watch how our AI transforms a complex project document into organized, actionable tasks in seconds
                  </p>
                </div>

                {/* Interactive Demo */}
                <div className="max-w-6xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Demo Animation */}
                    <div className="relative">
                      <div className="glass-effect rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-vibeflow-gradient opacity-5"></div>
                        
                        {/* Mock Document Upload */}
                        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                          <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                              <FileText className="w-5 h-5 text-vibeflow-blue" />
                              <span className="text-white text-sm font-medium">project-requirements.pdf</span>
                              <div className="ml-auto w-3 h-3 bg-vibeflow-emerald rounded-full animate-pulse"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full bg-vibeflow-gradient transition-all duration-3000 ${isVisible ? 'w-full' : 'w-0'}`}></div>
                              </div>
                              <div className="text-xs text-white/50">AI Processing: Extracting requirements...</div>
                            </div>
                          </div>

                          {/* Generated Tasks Preview */}
                          <div className={`space-y-3 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                            <div className="text-sm font-medium text-white mb-2">Generated Tasks:</div>
                            {[
                              { title: "Setup Development Environment", priority: "High", time: "2h" },
                              { title: "Design Database Schema", priority: "Medium", time: "4h" },
                              { title: "Implement Authentication", priority: "High", time: "6h" },
                            ].map((task, index) => (
                              <div 
                                key={index}
                                className={`bg-white/5 rounded-lg p-3 border border-white/10 flex items-center gap-3 transition-all duration-500`}
                                style={{ animationDelay: `${2000 + index * 300}ms` }}
                              >
                                <CheckCircle2 className="w-4 h-4 text-vibeflow-emerald" />
                                <div className="flex-1">
                                  <div className="text-white text-sm font-medium">{task.title}</div>
                                  <div className="text-white/50 text-xs">{task.time} estimated</div>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs ${
                                  task.priority === 'High' 
                                    ? 'bg-red-500/20 text-red-300' 
                                    : 'bg-yellow-500/20 text-yellow-300'
                                }`}>
                                  {task.priority}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Demo Benefits */}
                    <div className="space-y-8">
                      <div className="space-y-6">
                        {[
                          {
                            icon: Brain,
                            title: "AI-Powered Analysis",
                            description: "Advanced natural language processing identifies key requirements and dependencies"
                          },
                          {
                            icon: Target,
                            title: "Smart Prioritization",
                            description: "Automatically ranks tasks by importance, complexity, and project impact"
                          },
                          {
                            icon: Clock,
                            title: "Time Estimation",
                            description: "Intelligent estimation based on task complexity and historical data"
                          }
                        ].map((benefit, index) => (
                          <div 
                            key={index}
                            className={`flex gap-4 transition-all duration-700 ${
                              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                            }`}
                            style={{ animationDelay: `${500 + index * 200}ms` }}
                          >
                            <div className="w-12 h-12 bg-vibeflow-violet/20 rounded-xl flex items-center justify-center flex-shrink-0">
                              <benefit.icon className="w-6 h-6 text-vibeflow-violet" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                              <p className="text-white/70 text-sm">{benefit.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button 
                        onClick={() => setPlayDemo(!playDemo)}
                        className="bg-vibeflow-gradient hover:opacity-90 text-white font-semibold px-6 py-3 rounded-lg group"
                      >
                        {playDemo ? 'Replay Demo' : 'Play Demo'}
                        <Play className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Deep Dive */}
            <section ref={featuresRef} className="py-32 bg-black/20 backdrop-blur-sm">
              <div className="container mx-auto px-4">
                <div className="text-center space-y-6 mb-20 animate-fade-in">
                  <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
                    Powerful Features for Modern Teams
                  </h2>
                  <p className="text-xl text-white/70 max-w-2xl mx-auto">
                    Everything you need to transform complex documents into actionable project plans
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                  {[
                    {
                      icon: Brain,
                      title: "Advanced AI Analysis",
                      description: "Powered by state-of-the-art language models for deep document understanding",
                      features: ["Natural Language Processing", "Context Understanding", "Requirement Extraction"],
                      color: "vibeflow-blue"
                    },
                    {
                      icon: Zap,
                      title: "Smart Automation",
                      description: "Automate repetitive planning tasks and focus on what matters most",
                      features: ["Auto Task Generation", "Priority Scoring", "Dependency Mapping"],
                      color: "vibeflow-violet"
                    },
                    {
                      icon: Users,
                      title: "Team Collaboration",
                      description: "Built for teams with real-time collaboration and sharing capabilities",
                      features: ["Real-time Editing", "Team Sharing", "Role Management"],
                      color: "vibeflow-emerald"
                    },
                    {
                      icon: Shield,
                      title: "Enterprise Security",
                      description: "Bank-level security with end-to-end encryption and compliance",
                      features: ["Data Encryption", "SOC 2 Compliant", "GDPR Ready"],
                      color: "vibeflow-purple"
                    },
                    {
                      icon: TrendingUp,
                      title: "Analytics & Insights",
                      description: "Gain insights into project patterns and team productivity",
                      features: ["Progress Tracking", "Performance Metrics", "Predictive Analytics"],
                      color: "vibeflow-blue"
                    },
                    {
                      icon: Code,
                      title: "Developer Friendly",
                      description: "APIs and integrations for seamless workflow integration",
                      features: ["REST APIs", "Webhook Support", "Custom Integrations"],
                      color: "vibeflow-violet"
                    }
                  ].map((feature, index) => (
                    <Card 
                      key={index}
                      className="glass-effect p-8 magnetic-hover group relative overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-${feature.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      
                      <div className="relative z-10">
                        <div className={`w-16 h-16 bg-${feature.color}/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                        </div>
                        
                        <h3 className="text-xl font-display font-semibold text-white mb-3 group-hover:text-white transition-colors">
                          {feature.title}
                        </h3>
                        
                        <p className="text-white/70 mb-4 leading-relaxed">
                          {feature.description}
                        </p>
                        
                        <ul className="space-y-2">
                          {feature.features.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                              <CheckCircle2 className={`w-4 h-4 text-${feature.color}`} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Social Proof Section */}
            <section className="py-32">
              <div className="container mx-auto px-4">
                <div className="text-center space-y-6 mb-16">
                  <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
                    Trusted by Leading Teams
                  </h2>
                  <p className="text-xl text-white/70 max-w-2xl mx-auto">
                    Join thousands of teams who have transformed their workflow with VibeFlow
                  </p>
                </div>

                {/* Testimonials */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                  {[
                    {
                      name: "Sarah Chen",
                      role: "Project Manager at TechFlow",
                      content: "VibeFlow reduced our project planning time by 70%. The AI insights are incredibly accurate.",
                      rating: 5
                    },
                    {
                      name: "Marcus Rodriguez",
                      role: "CTO at InnovateX",
                      content: "Best investment for our development team. The automated task breakdown is a game-changer.",
                      rating: 5
                    },
                    {
                      name: "Emily Watson",
                      role: "Senior Developer at CodeCraft",
                      content: "Finally, a tool that understands complex requirements and turns them into actionable tasks.",
                      rating: 5
                    }
                  ].map((testimonial, index) => (
                    <Card key={index} className="glass-effect p-6 magnetic-hover">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-white/80 mb-4 italic">"{testimonial.content}"</p>
                      <div className="border-t border-white/10 pt-4">
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-white/60 text-sm">{testimonial.role}</div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Company Logos */}
                <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
                  {['TechFlow', 'InnovateX', 'CodeCraft', 'DevStudio', 'AgileTeam'].map((company, index) => (
                    <div key={index} className="text-white/40 font-semibold text-lg hover:text-white/70 transition-colors cursor-pointer">
                      {company}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Upload Section - Now positioned after all the content */}
            <section data-upload-section className="py-32 bg-black/20 backdrop-blur-sm">
              <div className="container mx-auto px-4">
                <div className="text-center space-y-6 mb-12">
                  <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl text-white/70 max-w-2xl mx-auto">
                    Upload your first document and experience the power of AI-driven project planning
                  </p>
                </div>

                <DocumentUpload 
                  onFileProcessed={handleFileProcessed}
                  isProcessing={isProcessing}
                />
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-32">
              <div className="container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                  <h2 className="text-4xl md:text-6xl font-display font-bold gradient-text">
                    Transform Your Workflow Today
                  </h2>
                  <p className="text-xl text-white/70 max-w-2xl mx-auto">
                    Join the AI revolution in project management. Start turning your documents into intelligent action plans.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    <Button 
                      onClick={() => {
                        const uploadSection = document.querySelector('[data-upload-section]');
                        uploadSection?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      size="lg"
                      className="bg-vibeflow-gradient hover:opacity-90 text-white font-semibold px-12 py-4 rounded-xl text-lg group"
                    >
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <Button 
                      variant="outline"
                      size="lg"
                      className="border-white/20 text-white hover:bg-white/10 font-semibold px-12 py-4 rounded-xl text-lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Demo
                    </Button>
                  </div>

                  <div className="flex flex-wrap justify-center gap-8 text-sm text-white/50 pt-8">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-vibeflow-emerald" />
                      No credit card required
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-vibeflow-emerald" />
                      14-day free trial
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-vibeflow-emerald" />
                      Cancel anytime
                    </div>
                  </div>

                  {/* Additional Engagement Content */}
                  <div className="grid md:grid-cols-3 gap-8 pt-16 max-w-5xl mx-auto">
                    <div className="text-center space-y-4 group cursor-pointer">
                      <div className="w-16 h-16 bg-vibeflow-violet/20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300">
                        <Zap className="w-8 h-8 text-vibeflow-violet" />
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-vibeflow-violet transition-colors">
                        Instant Results
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Transform documents into actionable tasks in under 30 seconds. No complex setup required.
                      </p>
                    </div>

                    <div className="text-center space-y-4 group cursor-pointer">
                      <div className="w-16 h-16 bg-vibeflow-emerald/20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300">
                        <Users className="w-8 h-8 text-vibeflow-emerald" />
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-vibeflow-emerald transition-colors">
                        Team Ready
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Built for collaboration with real-time sharing, comments, and team management features.
                      </p>
                    </div>

                    <div className="text-center space-y-4 group cursor-pointer">
                      <div className="w-16 h-16 bg-vibeflow-blue/20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300">
                        <Shield className="w-8 h-8 text-vibeflow-blue" />
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-vibeflow-blue transition-colors">
                        Enterprise Security
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Bank-level encryption and compliance with SOC 2, GDPR, and enterprise security standards.
                      </p>
                    </div>
                  </div>

                  {/* Success Metrics */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mt-16 border border-white/10">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-semibold text-white mb-2">
                        Join <span className="gradient-text">10,000+</span> Teams Already Saving Time
                      </h3>
                      <p className="text-white/70">Real results from real teams using VibeFlow</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                      <div className="space-y-2">
                        <div className="text-3xl font-bold gradient-text animate-pulse">75%</div>
                        <div className="text-white/70 text-sm">Faster Planning</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold gradient-text animate-pulse">50k+</div>
                        <div className="text-white/70 text-sm">Tasks Generated</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold gradient-text animate-pulse">99.9%</div>
                        <div className="text-white/70 text-sm">Uptime</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold gradient-text animate-pulse">4.9/5</div>
                        <div className="text-white/70 text-sm">User Rating</div>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Preview */}
                  <div className="mt-16 space-y-6">
                    <h3 className="text-2xl font-semibold text-white text-center mb-8">
                      Frequently Asked Questions
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                      <div className="glass-effect rounded-xl p-6 group hover:border-vibeflow-violet/30 transition-all duration-300">
                        <h4 className="text-white font-semibold mb-3 group-hover:text-vibeflow-violet transition-colors">
                          How accurate is the AI analysis?
                        </h4>
                        <p className="text-white/70 text-sm">
                          Our AI achieves 98% accuracy in requirement extraction and task generation, validated across thousands of documents.
                        </p>
                      </div>

                      <div className="glass-effect rounded-xl p-6 group hover:border-vibeflow-emerald/30 transition-all duration-300">
                        <h4 className="text-white font-semibold mb-3 group-hover:text-vibeflow-emerald transition-colors">
                          What file formats are supported?
                        </h4>
                        <p className="text-white/70 text-sm">
                          We support PDF, DOC, DOCX, TXT, and more. Advanced OCR handles scanned documents seamlessly.
                        </p>
                      </div>

                      <div className="glass-effect rounded-xl p-6 group hover:border-vibeflow-blue/30 transition-all duration-300">
                        <h4 className="text-white font-semibold mb-3 group-hover:text-vibeflow-blue transition-colors">
                          Is my data secure?
                        </h4>
                        <p className="text-white/70 text-sm">
                          Yes. We use end-to-end encryption, SOC 2 compliance, and never store your documents after processing.
                        </p>
                      </div>

                      <div className="glass-effect rounded-xl p-6 group hover:border-vibeflow-purple/30 transition-all duration-300">
                        <h4 className="text-white font-semibold mb-3 group-hover:text-vibeflow-purple transition-colors">
                          Can I integrate with existing tools?
                        </h4>
                        <p className="text-white/70 text-sm">
                          Absolutely. We offer APIs and integrations with Jira, Asana, Trello, and 50+ project management tools.
                        </p>
                      </div>
                    </div>

                    <div className="text-center pt-8">
                      <Button 
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 font-medium px-6 py-2 rounded-lg"
                      >
                        View All FAQs
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>

                  {/* Final CTA with urgency */}
                  <div className="bg-vibeflow-gradient/10 border border-vibeflow-violet/20 rounded-2xl p-8 mt-16 text-center">
                    <div className="max-w-2xl mx-auto space-y-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-vibeflow-violet/20 border border-vibeflow-violet/30 rounded-full text-vibeflow-violet text-sm font-medium animate-pulse">
                        <Clock className="w-4 h-4" />
                        Limited Time: Free Premium Features
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white">
                        Start Your Free Trial Today
                      </h3>
                      
                      <p className="text-white/80">
                        Get full access to all premium features for 14 days. No commitments, no hidden fees.
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                        <Button 
                          onClick={() => {
                            const uploadSection = document.querySelector('[data-upload-section]');
                            uploadSection?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="bg-vibeflow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 rounded-lg group"
                        >
                          Get Started Now
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
        
        {/* Existing content for when document is processed */}
        <div className="container mx-auto px-4 py-12">

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
          <div className="container mx-auto px-4 py-12">
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
          </div>
        )}

        {/* AI Results */}
        {aiResult && (
          <div className="container mx-auto px-4 py-12 animate-fade-in">
            <TaskViewer result={aiResult} />
          </div>
        )}
        </div>
      </main>

      {/* Loading Overlay */}
      {isProcessing && <LoadingAnimation />}

      {/* Newsletter Section - No Hover Effect */}
      <section className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm mt-8">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="space-y-2">
              <h4 className="text-xl font-semibold text-white flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-vibeflow-violet animate-pulse" />
                Stay Updated
              </h4>
              <p className="text-white/70 text-sm">
                Get the latest updates on AI features, product releases, and industry insights
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-vibeflow-violet/50 focus:bg-white/10 transition-all duration-300"
              />
              <Button className="bg-vibeflow-gradient hover:opacity-90 px-6 py-3 rounded-lg font-medium transition-all duration-300 group/btn">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <p className="text-xs text-white/50">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer - With Hover Effect */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm group hover:bg-gradient-to-br hover:from-vibeflow-violet/20 hover:via-vibeflow-blue/10 hover:to-vibeflow-emerald/20 transition-all duration-700 ease-out">
        <div className="container mx-auto px-4 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 group/brand">
                <div className="w-12 h-12 bg-vibeflow-gradient rounded-xl flex items-center justify-center glow-effect group-hover/brand:scale-110 transition-all duration-300">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold gradient-text">VibeFlow</h3>
                  <p className="text-xs text-white/60">AI-Powered Intelligence</p>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Transform your documents into intelligent, actionable tasks with our cutting-edge AI technology. 
                Built for modern teams who demand efficiency.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-vibeflow-violet/20 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 group/social">
                  <Github className="w-5 h-5 group-hover/social:scale-110 transition-transform" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-vibeflow-blue/20 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 group/social">
                  <Twitter className="w-5 h-5 group-hover/social:scale-110 transition-transform" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-vibeflow-emerald/20 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 group/social">
                  <Linkedin className="w-5 h-5 group-hover/social:scale-110 transition-transform" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-vibeflow-purple/20 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 group/social">
                  <Mail className="w-5 h-5 group-hover/social:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-6">
              <h4 className="text-white font-semibold text-lg flex items-center gap-2">
                <Lightning className="w-5 h-5 text-vibeflow-violet" />
                Product
              </h4>
              <nav className="space-y-3">
                <Link to="/" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Features</span>
                </Link>
                <Link to="/analytics" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Analytics</span>
                </Link>
                <Link to="/projects" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Projects</span>
                </Link>
                <a href="#" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Integrations</span>
                </a>
                <a href="#" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">API</span>
                </a>
              </nav>
            </div>

            {/* Resources Links */}
            <div className="space-y-6">
              <h4 className="text-white font-semibold text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-vibeflow-emerald" />
                Resources
              </h4>
              <nav className="space-y-3">
                <Link to="/documentation" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Documentation</span>
                </Link>
                <Link to="/templates" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Templates</span>
                </Link>
                <a href="#" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Blog</span>
                </a>
                <a href="#" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Tutorials</span>
                </a>
                <a href="#" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Community</span>
                </a>
                <a href="#" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Support</span>
                </a>
              </nav>
            </div>

            {/* Company Links */}
            <div className="space-y-6">
              <h4 className="text-white font-semibold text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-vibeflow-blue" />
                Company
              </h4>
              <nav className="space-y-3">
                <a href="#" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">About Us</span>
                </a>
                <a href="#" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Careers</span>
                </a>
                <a href="#" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Press</span>
                </a>
                <a href="#" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Contact</span>
                </a>
                <a href="#" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Privacy Policy</span>
                </a>
                <a href="#" className="block text-white/70 hover:text-white transition-colors duration-200 text-sm group/link">
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">Terms of Service</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-white/50">
                <p className="flex items-center gap-2">
                  Made with <Heart className="w-4 h-4 text-red-400 animate-pulse" /> by the VibeFlow team
                </p>
                <div className="hidden md:block w-1 h-1 bg-white/30 rounded-full"></div>
                <p className="hidden md:block">© 2025 VibeFlow AI. All rights reserved.</p>
              </div>
              
              <div className="flex items-center gap-6 text-xs text-white/50">
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  <span>Global CDN</span>
                </div>
              </div>
            </div>
            
            {/* Mobile Copyright */}
            <div className="md:hidden text-center mt-4">
              <p className="text-xs text-white/50">© 2025 VibeFlow AI. All rights reserved.</p>
            </div>
          </div>
        </div>
        
        {/* Animated Background Pattern on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-vibeflow-violet/5 via-transparent to-vibeflow-emerald/5"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-vibeflow-blue/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-vibeflow-purple/10 rounded-full blur-2xl animate-pulse delay-300"></div>
          <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-vibeflow-emerald/10 rounded-full blur-xl animate-pulse delay-700"></div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
