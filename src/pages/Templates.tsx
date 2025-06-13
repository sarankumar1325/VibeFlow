import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Search, 
  Filter, 
  Code, 
  FileText, 
  Layout, 
  Globe, 
  Smartphone, 
  Database,
  Star,
  Eye,
  Copy,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import TextHoverEffect from '@/components/TextHoverEffect';

const Templates = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const templateCategories = {
    project: {
      title: "Project Templates",
      icon: Code,
      color: "text-vibeflow-blue"
    },
    document: {
      title: "Document Templates", 
      icon: FileText,
      color: "text-vibeflow-emerald"
    },
    design: {
      title: "Design Templates",
      icon: Layout,
      color: "text-vibeflow-violet"
    },
    workflow: {
      title: "Workflow Templates",
      icon: CheckCircle2,
      color: "text-orange-400"
    }
  };

  const templates = [
    {
      id: 1,
      name: "React TypeScript Starter",
      description: "Production-ready React app with TypeScript, Tailwind CSS, and shadcn/ui components",
      category: "project",
      framework: "React",
      language: "TypeScript",
      downloads: 2847,
      rating: 4.8,
      featured: true,
      preview: "https://react-ts-starter-demo.vercel.app",
      tags: ["React", "TypeScript", "Tailwind", "Vite"]
    },
    {
      id: 2,
      name: "Next.js Full-Stack Template",
      description: "Complete Next.js app with authentication, database, and deployment config",
      category: "project",
      framework: "Next.js",
      language: "TypeScript",
      downloads: 1923,
      rating: 4.9,
      featured: true,
      preview: "https://nextjs-template-demo.vercel.app",
      tags: ["Next.js", "Prisma", "NextAuth", "PostgreSQL"]
    },
    {
      id: 3,
      name: "API Documentation Template",
      description: "Comprehensive API documentation template with interactive examples",
      category: "document",
      framework: "Markdown",
      language: "Markdown",
      downloads: 856,
      rating: 4.6,
      tags: ["API", "Documentation", "OpenAPI", "Examples"]
    },
    {
      id: 4,
      name: "Project Requirements Document",
      description: "Professional PRD template with user stories, acceptance criteria, and stakeholder analysis",
      category: "document",
      framework: "Template",
      language: "Markdown",
      downloads: 1234,
      rating: 4.7,
      featured: true,
      tags: ["PRD", "Requirements", "Planning", "Stakeholders"]
    },
    {
      id: 5,
      name: "Landing Page Design System",
      description: "Modern landing page components with animations and responsive design",
      category: "design",
      framework: "Figma",
      language: "Design",
      downloads: 445,
      rating: 4.5,
      tags: ["Landing Page", "Components", "Responsive", "Animations"]
    },
    {
      id: 6,
      name: "Mobile App UI Kit",
      description: "Complete mobile app design system with 50+ screens and components",
      category: "design",
      framework: "Figma",
      language: "Design",
      downloads: 678,
      rating: 4.8,
      tags: ["Mobile", "UI Kit", "Components", "Design System"]
    },
    {
      id: 7,
      name: "Agile Sprint Planning Template",
      description: "Complete sprint planning workflow with user stories, estimation, and retrospective",
      category: "workflow",
      framework: "Process",
      language: "Template",
      downloads: 534,
      rating: 4.4,
      tags: ["Agile", "Sprint", "Planning", "Retrospective"]
    },
    {
      id: 8,
      name: "CI/CD Pipeline Template",
      description: "GitHub Actions workflow for automated testing, building, and deployment",
      category: "workflow",
      framework: "GitHub Actions",
      language: "YAML",
      downloads: 789,
      rating: 4.7,
      tags: ["CI/CD", "GitHub Actions", "Deployment", "Testing"]
    },
    {
      id: 9,
      name: "Vue 3 SPA Template",
      description: "Modern Vue 3 single-page application with Composition API and Pinia",
      category: "project",
      framework: "Vue.js",
      language: "TypeScript",
      downloads: 1156,
      rating: 4.6,
      tags: ["Vue 3", "Composition API", "Pinia", "Vite"]
    },
    {
      id: 10,
      name: "Technical Architecture Document",
      description: "Comprehensive technical architecture template with diagrams and decision logs",
      category: "document",
      framework: "Template",
      language: "Markdown",
      downloads: 923,
      rating: 4.8,
      tags: ["Architecture", "Technical", "Diagrams", "ADR"]
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredTemplates = templates.filter(template => template.featured);

  const handleDownload = (template: typeof templates[0]) => {
    toast({
      title: "Download Started",
      description: `Downloading ${template.name} template...`,
    });
    // In a real app, this would trigger the actual download
  };

  const handlePreview = (template: typeof templates[0]) => {
    if (template.preview) {
      window.open(template.preview, '_blank');
    } else {
      toast({
        title: "Preview Available Soon",
        description: "Preview for this template is coming soon!",
        variant: "default",
      });
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
                  <TextHoverEffect text="Project Templates" />
                </h1>
                <p className="text-white/60 mt-2">
                  Ready-to-use templates for projects, documents, and workflows
                </p>
              </div>
            </div>
            
            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-effect border-white/20 text-white placeholder-white/40"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48 glass-effect border-white/20 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="glass-effect border-white/20 bg-vibeflow-dark">
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(templateCategories).map(([key, category]) => (
                    <SelectItem key={key} value={key}>{category.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Featured Templates */}
          {!searchQuery && filterCategory === 'all' && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Star className="h-6 w-6 text-vibeflow-emerald" />
                Featured Templates
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTemplates.map((template) => (
                  <Card key={template.id} className="glass-effect border-white/20 hover:border-vibeflow-blue/30 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {templateCategories[template.category as keyof typeof templateCategories].icon && (
                            React.createElement(templateCategories[template.category as keyof typeof templateCategories].icon, { 
                              className: `h-5 w-5 ${templateCategories[template.category as keyof typeof templateCategories].color}` 
                            })
                          )}
                          {template.name}
                        </span>
                        <Badge variant="secondary" className="bg-vibeflow-emerald/20 text-vibeflow-emerald border-vibeflow-emerald/30">
                          Featured
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="border-white/20 text-white/60 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {template.downloads.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            {template.rating}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 glass-effect border-white/20 hover:border-vibeflow-blue/50"
                            onClick={() => handleDownload(template)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          {template.preview && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="glass-effect border-white/20 hover:border-vibeflow-emerald/50"
                              onClick={() => handlePreview(template)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Templates */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {searchQuery || filterCategory !== 'all' ? 
                `Templates (${filteredTemplates.length})` : 
                'All Templates'
              }
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="glass-effect border-white/20 hover:border-vibeflow-blue/30 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {templateCategories[template.category as keyof typeof templateCategories].icon && (
                          React.createElement(templateCategories[template.category as keyof typeof templateCategories].icon, { 
                            className: `h-5 w-5 ${templateCategories[template.category as keyof typeof templateCategories].color}` 
                          })
                        )}
                        {template.name}
                      </span>
                      {template.featured && (
                        <Badge variant="secondary" className="bg-vibeflow-emerald/20 text-vibeflow-emerald border-vibeflow-emerald/30">
                          Featured
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-white/20 text-white/60">
                          {template.framework}
                        </Badge>
                        <span className="text-sm text-white/60">{template.language}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="border-white/20 text-white/60 text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="outline" className="border-white/20 text-white/40 text-xs">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {template.downloads.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          {template.rating}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 glass-effect border-white/20 hover:border-vibeflow-blue/50"
                          onClick={() => handleDownload(template)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        {template.preview && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="glass-effect border-white/20 hover:border-vibeflow-emerald/50"
                            onClick={() => handlePreview(template)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Templates;
