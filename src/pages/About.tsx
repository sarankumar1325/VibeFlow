import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Brain, 
  Zap, 
  Shield, 
  Users,
  CheckCircle2,
  Star,
  Globe,
  Code,
  Target,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TextHoverEffect from '@/components/TextHoverEffect';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced AI algorithms analyze documents and generate intelligent task breakdowns with smart prioritization.",
      color: "text-vibeflow-blue"
    },
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Process complex documents in seconds and transform them into actionable workflows.",
      color: "text-vibeflow-emerald"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption and secure data handling protocols.",
      color: "text-orange-400"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration features with real-time updates and shared project insights.",
      color: "text-vibeflow-violet"
    }
  ];

  const stats = [
    { label: "Projects Processed", value: "10,000+", icon: Target },
    { label: "Teams Served", value: "500+", icon: Users },
    { label: "Time Saved", value: "2,000hrs", icon: Zap },
    { label: "Accuracy Rate", value: "99.2%", icon: Award }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "AI Research Lead",
      specialty: "Machine Learning & NLP",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Director",
      specialty: "Project Management & Strategy",
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "UX Designer",
      specialty: "User Experience & Interface",
      avatar: "EW"
    },
    {
      name: "David Kim",
      role: "Engineering Manager",
      specialty: "Full-Stack Development",
      avatar: "DK"
    }
  ];

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
                <Button variant="outline" size="sm" className="glass-effect border-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-vibeflow-gradient rounded-xl flex items-center justify-center glow-effect">
                  <Brain className="w-6 h-6 text-white" />
                </div>                <div>
                  <h1 className="text-2xl font-display font-bold text-white">
                    <TextHoverEffect text="About VibeFlow" />
                  </h1>
                  <p className="text-sm text-white/60">The future of intelligent project management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <h2 className="text-4xl md:text-6xl font-display font-bold gradient-text leading-tight">
            Transforming Ideas into 
            <br />
            Intelligent Workflows
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            VibeFlow harnesses the power of advanced AI to revolutionize how teams process documents, 
            manage projects, and collaborate on complex initiatives. We're building the future of 
            work where artificial intelligence amplifies human creativity and productivity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-effect text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-vibeflow-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="space-y-8 mb-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-display font-bold text-white">
              Why Choose VibeFlow?
            </h3>
            <p className="text-white/70 max-w-2xl mx-auto">
              Built for modern teams who demand intelligence, speed, and reliability in their workflow tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <Card className="glass-effect mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/80 text-lg leading-relaxed">
              We believe that artificial intelligence should enhance human capabilities, not replace them. 
              Our mission is to create tools that understand the nuances of complex projects and help teams 
              work more intelligently, efficiently, and collaboratively.
            </p>
            <p className="text-white/70">
              VibeFlow was born from the frustration of managing complex project documents manually. 
              We've experienced firsthand how valuable time gets lost in translation between planning documents 
              and executable tasks. Our AI-powered platform bridges this gap, transforming abstract concepts 
              into clear, actionable workflows.
            </p>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="space-y-8 mb-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-display font-bold text-white">
              Meet Our Team
            </h3>
            <p className="text-white/70 max-w-2xl mx-auto">
              A diverse group of AI researchers, product experts, and engineers united by a vision 
              of intelligent collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="glass-effect text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-vibeflow-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-white">{member.avatar}</span>
                  </div>
                  <h4 className="font-semibold text-white mb-1">{member.name}</h4>
                  <p className="text-sm text-vibeflow-blue mb-2">{member.role}</p>
                  <p className="text-xs text-white/60">{member.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <Card className="glass-effect mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-3">
              <Code className="w-6 h-6 text-vibeflow-emerald" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">AI & Machine Learning</h4>
                <div className="space-y-2">
                  <Badge className="bg-vibeflow-blue/20 text-vibeflow-blue border-vibeflow-blue/30">Google Gemini</Badge>
                  <Badge className="bg-vibeflow-emerald/20 text-vibeflow-emerald border-vibeflow-emerald/30">Natural Language Processing</Badge>
                  <Badge className="bg-vibeflow-violet/20 text-vibeflow-violet border-vibeflow-violet/30">Document Intelligence</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Frontend</h4>
                <div className="space-y-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">React</Badge>
                  <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">TypeScript</Badge>
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Tailwind CSS</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Infrastructure</h4>
                <div className="space-y-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Cloud Computing</Badge>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Microservices</Badge>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Real-time Sync</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-3">
              <Globe className="w-6 h-6 text-vibeflow-blue" />
              Get in Touch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-white/70">
              Ready to transform your project management workflow? We'd love to hear from you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Sales & Partnerships</h4>
                <p className="text-white/60 text-sm">hello@vibeflow.ai</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Technical Support</h4>
                <p className="text-white/60 text-sm">support@vibeflow.ai</p>
              </div>
            </div>
            <Separator className="bg-white/10" />
            <div className="flex flex-wrap gap-4">
              <Button className="bg-vibeflow-gradient hover:opacity-90">
                Schedule a Demo
              </Button>
              <Button variant="outline" className="glass-effect border-white/20 text-white">
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default About;
