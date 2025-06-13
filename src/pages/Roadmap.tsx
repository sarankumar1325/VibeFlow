import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle2, Clock, Target, Zap, Brain, Users, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextHoverEffect from '@/components/TextHoverEffect';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned' | 'future';
  progress: number;
  quarter: string;
  year: number;
  features: string[];
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

const Roadmap = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'in-progress' | 'planned'>('all');

  const roadmapData: RoadmapItem[] = [
    {
      id: '1',
      title: 'Core AI Document Processing',
      description: 'Foundation of VibeFlow with advanced PDF analysis and task generation capabilities.',
      status: 'completed',
      progress: 100,
      quarter: 'Q1',
      year: 2025,
      features: [
        'PDF document upload and parsing',
        'Google Gemini AI integration',
        'Intelligent task breakdown',
        'Real-time processing feedback',
        'Document metadata extraction'
      ],
      icon: <Brain className="h-5 w-5" />,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Enhanced User Experience',
      description: 'Beautiful UI/UX improvements and additional utility pages for better user engagement.',
      status: 'completed',
      progress: 100,
      quarter: 'Q2',
      year: 2025,
      features: [
        'Developer resources directory',
        'Project templates library',
        'Comprehensive documentation hub',
        'Built-in developer tools suite',
        'Responsive design optimization'
      ],
      icon: <Sparkles className="h-5 w-5" />,
      priority: 'high'
    },
    {
      id: '3',
      title: 'Advanced Analytics & Insights',
      description: 'Deep analytics dashboard with project insights and performance metrics.',
      status: 'in-progress',
      progress: 65,
      quarter: 'Q3',
      year: 2025,
      features: [
        'Project completion analytics',
        'AI processing performance metrics',
        'User behavior insights',
        'Export capabilities (PDF, CSV)',
        'Custom dashboard widgets'
      ],
      icon: <Target className="h-5 w-5" />,
      priority: 'high'
    },
    {
      id: '4',
      title: 'Collaboration Features',
      description: 'Team collaboration tools including shared projects and real-time editing.',
      status: 'planned',
      progress: 0,
      quarter: 'Q4',
      year: 2025,
      features: [
        'Team workspaces',
        'Real-time collaboration',
        'Project sharing and permissions',
        'Comment and review system',
        'Activity feeds and notifications'
      ],
      icon: <Users className="h-5 w-5" />,
      priority: 'medium'
    },
    {
      id: '5',
      title: 'API & Integrations',
      description: 'RESTful API and third-party integrations for enhanced workflow automation.',
      status: 'planned',
      progress: 0,
      quarter: 'Q1',
      year: 2026,
      features: [
        'RESTful API with full CRUD operations',
        'Webhook support',
        'GitHub integration',
        'Slack notifications',
        'Zapier automation support'
      ],
      icon: <Zap className="h-5 w-5" />,
      priority: 'medium'
    },
    {
      id: '6',
      title: 'Enterprise Security',
      description: 'Advanced security features including SSO, audit logs, and compliance tools.',
      status: 'future',
      progress: 0,
      quarter: 'Q2',
      year: 2026,
      features: [
        'Single Sign-On (SSO)',
        'Advanced user permissions',
        'Audit logs and compliance',
        'Data encryption at rest',
        'GDPR compliance tools'
      ],
      icon: <Shield className="h-5 w-5" />,
      priority: 'low'
    },
    {
      id: '7',
      title: 'Mobile Applications',
      description: 'Native mobile apps for iOS and Android with offline capabilities.',
      status: 'future',
      progress: 0,
      quarter: 'Q3',
      year: 2026,
      features: [
        'iOS native application',
        'Android native application',
        'Offline document processing',
        'Push notifications',
        'Mobile-optimized task management'
      ],
      icon: <Sparkles className="h-5 w-5" />,
      priority: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-vibeflow-emerald text-white';
      case 'in-progress': return 'bg-vibeflow-blue text-white';
      case 'planned': return 'bg-vibeflow-violet text-white';
      case 'future': return 'bg-white/10 text-white/70';
      default: return 'bg-white/10 text-white/70';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-white/10 text-white/70';
    }
  };

  const filteredData = selectedFilter === 'all' 
    ? roadmapData 
    : roadmapData.filter(item => item.status === selectedFilter);

  const stats = {
    completed: roadmapData.filter(item => item.status === 'completed').length,
    inProgress: roadmapData.filter(item => item.status === 'in-progress').length,
    planned: roadmapData.filter(item => item.status === 'planned').length,
    future: roadmapData.filter(item => item.status === 'future').length
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
                <TextHoverEffect text="Product Roadmap" />
              </h1>
              <p className="text-white/70 mt-1">Discover what's coming next in VibeFlow</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-effect border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vibeflow-emerald mb-2">{stats.completed}</div>
              <div className="text-sm text-white/70">Completed</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vibeflow-blue mb-2">{stats.inProgress}</div>
              <div className="text-sm text-white/70">In Progress</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-vibeflow-violet mb-2">{stats.planned}</div>
              <div className="text-sm text-white/70">Planned</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-white/50 mb-2">{stats.future}</div>
              <div className="text-sm text-white/70">Future</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as any)} className="mb-8">
          <TabsList className="glass-effect border-white/20">
            <TabsTrigger value="all" className="data-[state=active]:bg-vibeflow-blue">All Items</TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-vibeflow-emerald">Completed</TabsTrigger>
            <TabsTrigger value="in-progress" className="data-[state=active]:bg-vibeflow-blue">In Progress</TabsTrigger>
            <TabsTrigger value="planned" className="data-[state=active]:bg-vibeflow-violet">Planned</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedFilter} className="space-y-6 mt-6">
            {filteredData.map((item) => (
              <Card key={item.id} className="glass-effect border-white/20 hover:border-white/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-vibeflow-blue mt-1">
                        {item.icon}
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">{item.title}</CardTitle>
                        <CardDescription className="text-white/70 mt-2">
                          {item.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status === 'in-progress' ? 'In Progress' : 
                         item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(item.priority)}>
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {item.quarter} {item.year}
                    </div>
                    {item.status === 'in-progress' && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {item.progress}% Complete
                      </div>
                    )}
                  </div>

                  {item.status === 'in-progress' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Progress</span>
                        <span className="text-white">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  )}

                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-vibeflow-emerald" />
                      Key Features
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {item.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-white/70">
                          <div className="w-1.5 h-1.5 bg-vibeflow-blue rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {filteredData.length === 0 && (
          <Card className="glass-effect border-white/20">
            <CardContent className="p-12 text-center">
              <div className="text-white/50 mb-4">
                <Target className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">No items found</h3>
              <p className="text-white/70">Try selecting a different filter to see more roadmap items.</p>
            </CardContent>
          </Card>
        )}

        {/* Future Vision */}
        <Card className="glass-effect border-white/20 mt-12">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-vibeflow-violet" />
              Our Vision for the Future
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/70">
              VibeFlow is committed to revolutionizing how teams approach project documentation and task management. 
              Our roadmap reflects our dedication to continuous innovation and user-centric design.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-3">
                <h4 className="text-white font-medium">🚀 Innovation Focus</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Advanced AI capabilities and machine learning</li>
                  <li>• Seamless integrations with popular tools</li>
                  <li>• Enhanced collaboration features</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-white font-medium">🎯 User Experience</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Intuitive and accessible design</li>
                  <li>• Performance optimization</li>
                  <li>• Mobile-first approach</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Roadmap;
