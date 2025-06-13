import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Book, 
  ExternalLink, 
  Search, 
  Code, 
  Database, 
  Palette, 
  Monitor, 
  Smartphone, 
  Globe, 
  Zap, 
  Shield,
  Settings,
  FileText,
  GitBranch,
  Layers,
  Cloud,
  Terminal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextHoverEffect from '@/components/TextHoverEffect';

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const resourceCategories = {
    development: {
      title: "Development Tools",
      icon: Code,
      color: "text-vibeflow-blue",
      resources: [
        {
          name: "VS Code",
          description: "Powerful code editor with extensions",
          url: "https://code.visualstudio.com/",
          category: "Editor",
          featured: true
        },
        {
          name: "GitHub",
          description: "Version control and collaboration platform",
          url: "https://github.com/",
          category: "Version Control",
          featured: true
        },
        {
          name: "Postman",
          description: "API development and testing tool",
          url: "https://www.postman.com/",
          category: "API Testing"
        },
        {
          name: "Figma",
          description: "Collaborative design and prototyping",
          url: "https://www.figma.com/",
          category: "Design"
        },
        {
          name: "Vercel",
          description: "Frontend deployment platform",
          url: "https://vercel.com/",
          category: "Deployment"
        }
      ]
    },
    frameworks: {
      title: "Frameworks & Libraries",
      icon: Layers,
      color: "text-vibeflow-emerald",
      resources: [
        {
          name: "React",
          description: "Popular JavaScript library for building UIs",
          url: "https://react.dev/",
          category: "Frontend",
          featured: true
        },
        {
          name: "Next.js",
          description: "React framework for production applications",
          url: "https://nextjs.org/",
          category: "Full-stack"
        },
        {
          name: "Tailwind CSS",
          description: "Utility-first CSS framework",
          url: "https://tailwindcss.com/",
          category: "Styling",
          featured: true
        },
        {
          name: "Node.js",
          description: "JavaScript runtime for server-side development",
          url: "https://nodejs.org/",
          category: "Backend"
        },
        {
          name: "Prisma",
          description: "Next-generation ORM for database management",
          url: "https://www.prisma.io/",
          category: "Database"
        }
      ]
    },
    design: {
      title: "Design Resources",
      icon: Palette,
      color: "text-vibeflow-violet",
      resources: [
        {
          name: "Dribbble",
          description: "Design inspiration and showcase platform",
          url: "https://dribbble.com/",
          category: "Inspiration",
          featured: true
        },
        {
          name: "Unsplash",
          description: "High-quality free stock photography",
          url: "https://unsplash.com/",
          category: "Images"
        },
        {
          name: "Heroicons",
          description: "Beautiful hand-crafted SVG icons",
          url: "https://heroicons.com/",
          category: "Icons"
        },
        {
          name: "Google Fonts",
          description: "Free web fonts collection",
          url: "https://fonts.google.com/",
          category: "Typography"
        },
        {
          name: "Coolors",
          description: "Color scheme generator and palette tool",
          url: "https://coolors.co/",
          category: "Colors"
        }
      ]
    },
    documentation: {
      title: "Learning & Documentation",
      icon: Book,
      color: "text-orange-400",
      resources: [
        {
          name: "MDN Web Docs",
          description: "Comprehensive web development documentation",
          url: "https://developer.mozilla.org/",
          category: "Reference",
          featured: true
        },
        {
          name: "Stack Overflow",
          description: "Programming Q&A community",
          url: "https://stackoverflow.com/",
          category: "Community"
        },
        {
          name: "FreeCodeCamp",
          description: "Free coding curriculum and tutorials",
          url: "https://www.freecodecamp.org/",
          category: "Learning"
        },
        {
          name: "DevDocs",
          description: "Unified documentation for developers",
          url: "https://devdocs.io/",
          category: "Reference"
        },
        {
          name: "Codecademy",
          description: "Interactive coding courses",
          url: "https://www.codecademy.com/",
          category: "Learning"
        }
      ]
    },
    productivity: {
      title: "Productivity Tools",
      icon: Zap,
      color: "text-vibeflow-purple",
      resources: [
        {
          name: "Notion",
          description: "All-in-one workspace for notes and docs",
          url: "https://www.notion.so/",
          category: "Documentation",
          featured: true
        },
        {
          name: "Slack",
          description: "Team communication and collaboration",
          url: "https://slack.com/",
          category: "Communication"
        },
        {
          name: "Trello",
          description: "Visual project management boards",
          url: "https://trello.com/",
          category: "Project Management"
        },
        {
          name: "Linear",
          description: "Modern issue tracking and project management",
          url: "https://linear.app/",
          category: "Issue Tracking"
        },
        {
          name: "Calendly",
          description: "Automated scheduling tool",
          url: "https://calendly.com/",
          category: "Scheduling"
        }
      ]
    }
  };

  const allResources = Object.values(resourceCategories).flatMap(category => 
    category.resources.map(resource => ({ ...resource, categoryTitle: category.title }))
  );

  const filteredResources = searchQuery 
    ? allResources.filter(resource => 
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allResources;

  const featuredResources = allResources.filter(resource => resource.featured);

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
                  <TextHoverEffect text="Developer Resources" />
                </h1>
                <p className="text-white/60 mt-2">
                  Curated collection of essential tools, frameworks, and learning resources
                </p>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search resources..."
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
        <div className="max-w-7xl mx-auto">
          
          {/* Featured Resources */}
          {!searchQuery && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Zap className="h-6 w-6 text-vibeflow-emerald" />
                Featured Resources
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredResources.map((resource, index) => (
                  <Card key={index} className="glass-effect border-white/20 hover:border-vibeflow-blue/30 transition-all duration-300 group">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <ExternalLink className="h-5 w-5" />
                          {resource.name}
                        </span>
                        <Badge variant="secondary" className="bg-vibeflow-emerald/20 text-vibeflow-emerald border-vibeflow-emerald/30">
                          Featured
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-white/20 text-white/60">
                          {resource.category}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-effect border-white/20 hover:border-vibeflow-blue/50 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(resource.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Search Results or Categories */}
          {searchQuery ? (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Search Results ({filteredResources.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                  <Card key={index} className="glass-effect border-white/20 hover:border-vibeflow-blue/30 transition-all duration-300 group">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <ExternalLink className="h-5 w-5" />
                          {resource.name}
                        </span>
                        {resource.featured && (
                          <Badge variant="secondary" className="bg-vibeflow-emerald/20 text-vibeflow-emerald border-vibeflow-emerald/30">
                            Featured
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="border-white/20 text-white/60">
                            {resource.category}
                          </Badge>
                          <Badge variant="outline" className="border-white/20 text-white/40 text-xs">
                            {resource.categoryTitle}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-effect border-white/20 hover:border-vibeflow-blue/50 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(resource.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Tabs defaultValue="development" className="w-full">
              <TabsList className="glass-effect border-white/20 mb-8">
                {Object.entries(resourceCategories).map(([key, category]) => {
                  const IconComponent = category.icon;
                  return (
                    <TabsTrigger 
                      key={key} 
                      value={key}
                      className="flex items-center gap-2 data-[state=active]:bg-white/20"
                    >
                      <IconComponent className={`h-4 w-4 ${category.color}`} />
                      {category.title}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.entries(resourceCategories).map(([key, category]) => (
                <TabsContent key={key} value={key}>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.resources.map((resource, index) => (
                      <Card key={index} className="glass-effect border-white/20 hover:border-vibeflow-blue/30 transition-all duration-300 group">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <ExternalLink className="h-5 w-5" />
                              {resource.name}
                            </span>
                            {resource.featured && (
                              <Badge variant="secondary" className="bg-vibeflow-emerald/20 text-vibeflow-emerald border-vibeflow-emerald/30">
                                Featured
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-white/70">
                            {resource.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="border-white/20 text-white/60">
                              {resource.category}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="glass-effect border-white/20 hover:border-vibeflow-blue/50 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => window.open(resource.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Visit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default Resources;
