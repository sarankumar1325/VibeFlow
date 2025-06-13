import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  Play, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  Video,
  Code,
  Lightbulb,
  Users,
  Zap,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import TextHoverEffect from '@/components/TextHoverEffect';

const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const quickStartSteps = [
    {
      title: "Install Dependencies",
      description: "Set up your development environment with required tools",
      duration: "5 min",
      completed: true
    },
    {
      title: "API Configuration",
      description: "Configure your Google Gemini API key for AI processing",
      duration: "3 min", 
      completed: true
    },
    {
      title: "Upload First Document",
      description: "Process your first document and generate tasks",
      duration: "10 min",
      completed: false
    },
    {
      title: "Explore Features",
      description: "Learn about advanced features and workflows",
      duration: "15 min",
      completed: false
    }
  ];

  const documentation = [
    {
      id: 1,
      title: "Getting Started Guide",
      description: "Complete guide to setting up and using VibeFlow AI for the first time",
      category: "Tutorial",
      icon: Play,
      difficulty: "Beginner",
      duration: "20 min",
      topics: ["Installation", "Configuration", "First Project", "Basic Features"]
    },
    {
      id: 2,
      title: "API Reference",
      description: "Comprehensive API documentation with examples and best practices",
      category: "Reference",
      icon: Code,
      difficulty: "Advanced",
      duration: "60 min",
      topics: ["Authentication", "Endpoints", "Rate Limits", "Error Handling"]
    },
    {
      id: 3,
      title: "AI Processing Deep Dive",
      description: "Understanding how VibeFlow AI analyzes documents and generates insights",
      category: "Guide",
      icon: Lightbulb,
      difficulty: "Intermediate",
      duration: "30 min",
      topics: ["AI Models", "Processing Pipeline", "Output Formats", "Optimization"]
    },
    {
      id: 4,
      title: "Team Collaboration Features",
      description: "How to use VibeFlow AI effectively in team environments",
      category: "Guide",
      icon: Users,
      difficulty: "Intermediate",
      duration: "25 min",
      topics: ["Sharing Projects", "Team Settings", "Permissions", "Workflows"]
    },
    {
      id: 5,
      title: "Advanced Workflows",
      description: "Complex workflows and automation techniques for power users",
      category: "Tutorial",
      icon: Zap,
      difficulty: "Advanced",
      duration: "45 min",
      topics: ["Automation", "Custom Templates", "Integrations", "Bulk Processing"]
    },
    {
      id: 6,
      title: "Troubleshooting Guide",
      description: "Common issues and solutions for VibeFlow AI users",
      category: "Reference",
      icon: CheckCircle2,
      difficulty: "Beginner",
      duration: "15 min",
      topics: ["Common Errors", "Performance", "Compatibility", "Support"]
    }
  ];

  const faqs = [
    {
      question: "How do I get started with VibeFlow AI?",
      answer: "Start by uploading a document (PDF, DOC, or TXT), configure your API key, and let our AI analyze it to generate actionable tasks and insights. Check out our Getting Started Guide for a step-by-step walkthrough."
    },
    {
      question: "What file formats are supported?",
      answer: "VibeFlow AI supports PDF, DOC, DOCX, TXT, and Markdown files. We're continuously adding support for more formats based on user feedback."
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes, we take security seriously. All documents are processed securely, and we don't store your sensitive data. Your API keys are encrypted and stored locally in your browser."
    },
    {
      question: "Can I use VibeFlow AI for team projects?",
      answer: "Absolutely! VibeFlow AI includes collaboration features like project sharing, team workspaces, and shared templates. See our Team Collaboration guide for details."
    },
    {
      question: "What's the difference between free and premium features?",
      answer: "The free tier includes basic document processing and task generation. Premium features include advanced analytics, team collaboration, custom templates, and priority processing."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI models are continuously trained and improved. Accuracy depends on document quality and complexity, but typically ranges from 85-95% for well-structured documents."
    }
  ];

  const filteredDocs = documentation.filter(doc =>
    searchQuery === '' ||
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-vibeflow-emerald border-vibeflow-emerald/30 bg-vibeflow-emerald/10';
      case 'Intermediate': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      case 'Advanced': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-white/60 border-white/20 bg-white/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tutorial': return Play;
      case 'Guide': return BookOpen;
      case 'Reference': return FileText;
      default: return FileText;
    }
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
              <Link to="/">
                <Button
                  variant="outline"
                  className="glass-effect border-white/20 hover:border-vibeflow-blue/50 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  <TextHoverEffect text="Documentation" />
                </h1>
                <p className="text-white/60 mt-2">
                  Comprehensive guides, tutorials, and API reference
                </p>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-effect border-white/20 text-white placeholder-white/40"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Quick Start */}
          {!searchQuery && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Zap className="h-6 w-6 text-vibeflow-emerald" />
                Quick Start
              </h2>
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="glass-effect border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-vibeflow-emerald" />
                      Getting Started Checklist
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Follow these steps to get up and running quickly
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {quickStartSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-white/10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed ? 'bg-vibeflow-emerald text-white' : 'bg-white/10 text-white/60'
                          }`}>
                            {step.completed ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{step.title}</h3>
                            <p className="text-sm text-white/70">{step.description}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Clock className="h-4 w-4" />
                            {step.duration}
                          </div>
                        </div>
                      ))}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                          <span>Progress</span>
                          <span>50%</span>
                        </div>
                        <Progress value={50} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Video className="h-5 w-5 text-vibeflow-blue" />
                      Video Tutorials
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Watch video guides for visual learners
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 hover:border-vibeflow-blue/30 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-vibeflow-blue/20 rounded-lg flex items-center justify-center">
                          <Play className="h-6 w-6 text-vibeflow-blue" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">Introduction to VibeFlow AI</h3>
                          <p className="text-sm text-white/70">Overview of features and capabilities</p>
                        </div>
                        <div className="text-sm text-white/60">5:30</div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 hover:border-vibeflow-blue/30 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-vibeflow-emerald/20 rounded-lg flex items-center justify-center">
                          <Play className="h-6 w-6 text-vibeflow-emerald" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">Document Processing Walkthrough</h3>
                          <p className="text-sm text-white/70">Step-by-step document analysis demo</p>
                        </div>
                        <div className="text-sm text-white/60">12:45</div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 hover:border-vibeflow-blue/30 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-vibeflow-violet/20 rounded-lg flex items-center justify-center">
                          <Play className="h-6 w-6 text-vibeflow-violet" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">Advanced Features Tutorial</h3>
                          <p className="text-sm text-white/70">Power user tips and tricks</p>
                        </div>
                        <div className="text-sm text-white/60">18:20</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Documentation Grid */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {searchQuery ? `Search Results (${filteredDocs.length})` : 'Documentation'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => {
                const IconComponent = doc.icon;
                const CategoryIcon = getCategoryIcon(doc.category);
                
                return (
                  <Card key={doc.id} className="glass-effect border-white/20 hover:border-vibeflow-blue/30 transition-all duration-300 group cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <IconComponent className="h-5 w-5 text-vibeflow-blue" />
                          {doc.title}
                        </span>
                        <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-vibeflow-blue transition-colors" />
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        {doc.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="h-4 w-4 text-white/60" />
                            <span className="text-sm text-white/60">{doc.category}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Clock className="h-4 w-4" />
                            {doc.duration}
                          </div>
                        </div>
                        
                        <Badge variant="outline" className={getDifficultyColor(doc.difficulty)}>
                          {doc.difficulty}
                        </Badge>
                        
                        <div className="flex flex-wrap gap-2">
                          {doc.topics.slice(0, 3).map((topic) => (
                            <Badge key={topic} variant="outline" className="border-white/20 text-white/60 text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {doc.topics.length > 3 && (
                            <Badge variant="outline" className="border-white/20 text-white/40 text-xs">
                              +{doc.topics.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          {!searchQuery && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-orange-400" />
                Frequently Asked Questions
              </h2>
              <Card className="glass-effect border-white/20">
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                        <AccordionTrigger className="text-white hover:text-vibeflow-blue text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-white/70">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Links */}
          {!searchQuery && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-effect border-white/20 hover:border-vibeflow-blue/30 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <ExternalLink className="h-8 w-8 text-vibeflow-blue mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">API Documentation</h3>
                    <p className="text-sm text-white/70">Complete API reference</p>
                  </CardContent>
                </Card>
                
                <Card className="glass-effect border-white/20 hover:border-vibeflow-emerald/30 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-vibeflow-emerald mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Community Forum</h3>
                    <p className="text-sm text-white/70">Get help from the community</p>
                  </CardContent>
                </Card>
                
                <Card className="glass-effect border-white/20 hover:border-vibeflow-violet/30 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Code className="h-8 w-8 text-vibeflow-violet mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Code Examples</h3>
                    <p className="text-sm text-white/70">Ready-to-use code snippets</p>
                  </CardContent>
                </Card>
                
                <Card className="glass-effect border-white/20 hover:border-orange-400/30 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <CheckCircle2 className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Support</h3>
                    <p className="text-sm text-white/70">Get technical support</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Documentation;
