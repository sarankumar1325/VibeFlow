import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Brain, 
  FileText, 
  GitBranch, 
  CheckCircle2, 
  Target, 
  Users, 
  Zap,
  BookOpen,
  Code,
  Settings,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import TextHoverEffect from '@/components/TextHoverEffect';

const BestPractices: React.FC = () => {
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
                VibeFlow AI Documentation Best Practices
              </h1>
              <p className="text-white/60 mt-2">
                Essential workflows and best practices for effective AI-powered documentation management
              </p>
            </div>
          </div>
        </div>
      </header>      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Core Workflow Integration */}
        <div className="glass-effect border border-white/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            <TrendingUp className="h-6 w-6" />
            Core Workflow Integration
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-vibeflow-blue text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">1</div>
              <div>
                <p className="text-xl font-semibold text-white mb-2">
                  <strong>Generate Architecture Overview</strong> = Complete system understanding + workflow explanation
                </p>
                <p className="text-white/70">
                  Start every project with comprehensive codebase analysis and architectural documentation. 
                  This provides the foundation for all subsequent development and ensures everyone understands the system structure.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-vibeflow-blue text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">2</div>
              <div>
                <p className="text-xl font-semibold text-white mb-2">
                  <strong>Create PRDs</strong> = AI-assisted requirements + full system context + workflow integration
                </p>
                <p className="text-white/70">
                  Generate detailed product requirements with stakeholder analysis and system context. 
                  This ensures new features align with existing architecture and business objectives.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-vibeflow-blue text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">3</div>
              <div>
                <p className="text-xl font-semibold text-white mb-2">
                  <strong>Track Progress</strong> = Real-time updates + complete feature awareness + workflow continuity
                </p>
                <p className="text-white/70">
                  Maintain continuous alignment between implementation and requirements. 
                  This provides visibility into development progress and helps maintain project momentum.
                </p>
              </div>
            </div>
          </div>
        </div>        {/* Best Practices Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <BookOpen className="h-6 w-6" />
                Architecture Documentation
              </CardTitle>
              <CardDescription className="text-white/70">
                Guidelines for comprehensive system understanding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-bold text-vibeflow-emerald text-lg">✅ Best Practices:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li>Generate architecture overview before starting new features</li>
                  <li>Re-scan codebase weekly or after major changes</li>
                  <li>Include Mermaid diagrams for visual clarity</li>
                  <li>Export to architecture.md for team reference</li>
                  <li>Integrate with AI conversations for context</li>
                  <li>Document architectural decisions and rationale</li>
                  <li>Keep perspective analysis updated (architectural, developer, product)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-red-400 text-lg">❌ Common Pitfalls:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/60">
                  <li>Working without current architectural understanding</li>
                  <li>Ignoring existing patterns and conventions</li>
                  <li>Skipping perspective analysis</li>
                  <li>Outdated or stale architectural documentation</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <FileText className="h-6 w-6" />
                PRD Creation
              </CardTitle>
              <CardDescription className="text-white/70">
                Creating effective Product Requirements Documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-bold text-vibeflow-emerald text-lg">✅ Best Practices:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li>Create PRDs before implementation begins</li>
                  <li>Include detailed user stories and acceptance criteria</li>
                  <li>Define non-functional requirements clearly</li>
                  <li>Save to /prds folder for team access</li>
                  <li>Review and update PRDs regularly</li>
                  <li>Include stakeholder analysis and personas</li>
                  <li>Link PRDs to architectural context</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-red-400 text-lg">❌ Common Pitfalls:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/60">
                  <li>Starting development without clear requirements</li>
                  <li>Vague or incomplete user stories</li>
                  <li>Missing stakeholder analysis</li>
                  <li>Ignoring non-functional requirements</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <TrendingUp className="h-6 w-6" />
                Progress Tracking
              </CardTitle>
              <CardDescription className="text-white/70">
                Maintaining alignment between code and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-bold text-vibeflow-emerald text-lg">✅ Best Practices:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li>Run progress tracking regularly during development</li>
                  <li>Update implementation status in PRDs</li>
                  <li>Document changes and decisions in changelog</li>
                  <li>Provide clear next actionable steps</li>
                  <li>Maintain continuity for team handoffs</li>
                  <li>Track completion percentages accurately</li>
                  <li>Note blockers and dependencies</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-red-400 text-lg">❌ Common Pitfalls:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/60">
                  <li>Implementing features without tracking progress</li>
                  <li>Outdated or stale documentation</li>
                  <li>Missing implementation notes</li>
                  <li>Poor communication of blockers</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <Users className="h-6 w-6" />
                Team Collaboration
              </CardTitle>
              <CardDescription className="text-white/70">
                Fostering effective team documentation practices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-bold text-vibeflow-emerald text-lg">✅ Best Practices:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li>Share generated documentation with the team</li>
                  <li>Use consistent naming and file organization</li>
                  <li>Keep PRDs accessible in /prds folder</li>
                  <li>Integrate with AI context for conversations</li>
                  <li>Update documentation before major releases</li>
                  <li>Establish regular documentation review cycles</li>
                  <li>Train team members on documentation tools</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-red-400 text-lg">❌ Common Pitfalls:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/60">
                  <li>Keeping documentation in personal silos</li>
                  <li>Inconsistent documentation standards</li>
                  <li>Missing stakeholder communication</li>
                  <li>Poor documentation discoverability</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>        {/* Quick Start Workflow */}
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-2xl">
              <Settings className="h-6 w-6" />
              Quick Start Workflow Guide
            </CardTitle>
            <CardDescription className="text-white/70">
              Step-by-step process for implementing VibeFlow AI Documentation in your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-vibeflow-blue text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">1</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-white">Initialize Project Documentation</h3>
                    <p className="text-white/70 mb-3">Generate architecture overview to understand current system state</p>
                    <ul className="text-sm text-white/50 list-disc list-inside space-y-1">
                      <li>Scan entire codebase for comprehensive analysis</li>
                      <li>Generate multi-perspective documentation</li>
                      <li>Export to architecture.md</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-vibeflow-blue text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">2</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-white">Plan New Features</h3>
                    <p className="text-white/70 mb-3">Create PRDs with AI assistance for all new feature development</p>
                    <ul className="text-sm text-white/50 list-disc list-inside space-y-1">
                      <li>Define clear user stories and acceptance criteria</li>
                      <li>Include stakeholder analysis</li>
                      <li>Save to /prds folder</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-vibeflow-blue text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">3</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-white">Implement & Track</h3>
                    <p className="text-white/70 mb-3">Use progress tracking to maintain alignment between code and requirements</p>
                    <ul className="text-sm text-white/50 list-disc list-inside space-y-1">
                      <li>Regular progress updates</li>
                      <li>Document implementation decisions</li>
                      <li>Track completion percentages</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-vibeflow-blue text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">4</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-white">Iterate & Improve</h3>
                    <p className="text-white/70 mb-3">Regular re-scanning and documentation updates for continuous improvement</p>
                    <ul className="text-sm text-white/50 list-disc list-inside space-y-1">
                      <li>Weekly architecture re-scans</li>
                      <li>PRD updates based on learnings</li>
                      <li>Documentation quality reviews</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>        {/* Success Metrics */}
        <Alert className="glass-effect border-vibeflow-emerald/30 bg-vibeflow-emerald/10">
          <CheckCircle className="h-5 w-5 text-vibeflow-emerald" />
          <AlertDescription className="text-white">
            <strong className="text-vibeflow-emerald">Success Indicators:</strong> Your team will know the VibeFlow AI Documentation System is working when:
            new developers can onboard faster with clear architectural understanding, PRDs are consistently detailed and actionable, 
            implementation stays aligned with requirements throughout development cycles, documentation never becomes stale or outdated,
            and AI conversations have rich context about your system architecture and requirements.
          </AlertDescription>
        </Alert>        {/* Footer */}
        <div className="text-center py-8 border-t border-white/10">
          <p className="text-white/70">
            🤖 <strong className="text-white">VibeFlow AI Documentation System</strong> - Intelligent documentation for modern development teams
          </p>
          <p className="text-sm text-white/50 mt-2">
            Last updated: June 1, 2025 | Version 1.0.0
          </p>
        </div>
      </div>
      </main>
    </div>
  );
};

export default BestPractices;
