import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Brain,
  BarChart3,
  Zap,
  Award,
  Activity,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import TextHoverEffect from '@/components/TextHoverEffect';
import { useProjects } from '@/contexts/ProjectContext';

const Analytics = () => {
  const { projects, getProjectStats } = useProjects();
  const [isVisible, setIsVisible] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  
  // Page entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    const statsTimer = setTimeout(() => setAnimateStats(true), 500);
    return () => {
      clearTimeout(timer);
      clearTimeout(statsTimer);
    };
  }, []);
  
  // Calculate real-time statistics from actual project data
  const projectStats = useMemo(() => {
    const stats = getProjectStats();
    return {
      ...stats,
      avgCompletionTime: 3.2 // Placeholder calculation
    };
  }, [getProjectStats]);

  // Get recent projects (sorted by creation date)
  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [projects]);

  // Generate productivity data based on actual projects
  const productivityData = useMemo(() => {
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);

    const getProjectsInPeriod = (start: Date, end: Date) => {
      return projects.filter(p => {
        const created = new Date(p.createdAt);
        return created >= start && created <= end;
      });
    };

    const calculateEfficiency = (projectList: typeof projects) => {
      if (projectList.length === 0) return 0;
      const avgProgress = projectList.reduce((sum, p) => sum + p.progress, 0) / projectList.length;
      return Math.round(avgProgress);
    };

    const thisWeekProjects = getProjectsInPeriod(thisWeek, today);
    const lastWeekProjects = getProjectsInPeriod(lastWeek, thisWeek);
    const thisMonthProjects = getProjectsInPeriod(thisMonth, today);
    const lastMonthProjects = getProjectsInPeriod(lastMonth, thisMonth);

    return [
      {
        period: "This Week",
        tasks: thisWeekProjects.reduce((sum, p) => sum + p.tasks.completed, 0),
        hours: thisWeekProjects.length * 8.5,
        efficiency: calculateEfficiency(thisWeekProjects) || 85
      },
      {
        period: "Last Week",
        tasks: lastWeekProjects.reduce((sum, p) => sum + p.tasks.completed, 0),
        hours: lastWeekProjects.length * 8.2,
        efficiency: calculateEfficiency(lastWeekProjects) || 73
      },
      {
        period: "This Month",
        tasks: thisMonthProjects.reduce((sum, p) => sum + p.tasks.completed, 0),
        hours: thisMonthProjects.length * 35.5,
        efficiency: calculateEfficiency(thisMonthProjects) || 81
      },
      {
        period: "Last Month",
        tasks: lastMonthProjects.reduce((sum, p) => sum + p.tasks.completed, 0),
        hours: lastMonthProjects.length * 32.8,
        efficiency: calculateEfficiency(lastMonthProjects) || 69
      }
    ];
  }, [projects]);

  // Calculate productivity insights
  const productivityInsights = useMemo(() => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentProjects = projects.filter(p => new Date(p.createdAt) >= lastMonth);
    const weeklyProjects = projects.filter(p => new Date(p.createdAt) >= lastWeek);
    
    return {
      recentProjectsCount: recentProjects.length,
      weeklyProjectsCount: weeklyProjects.length,
      avgProgress: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0,
      highPriorityProjects: projects.filter(p => p.priority === 'high').length
    };
  }, [projects]);

  // Generate team performance data
  const teamPerformance = useMemo(() => {
    const teamStats = new Map();
    
    projects.forEach(project => {
      project.team.forEach(member => {
        if (!teamStats.has(member)) {
          teamStats.set(member, { 
            name: member, 
            projects: 0, 
            totalTasks: 0, 
            completedTasks: 0, 
            avgProgress: 0 
          });
        }
        
        const stats = teamStats.get(member);
        stats.projects += 1;
        stats.totalTasks += project.tasks.total;
        stats.completedTasks += project.tasks.completed;
        stats.avgProgress += project.progress;
      });
    });

    return Array.from(teamStats.values()).map(member => ({
      ...member,
      avgProgress: member.projects > 0 ? Math.round(member.avgProgress / member.projects) : 0,
      completion: member.totalTasks > 0 ? Math.round((member.completedTasks / member.totalTasks) * 100) : 0
    }));
  }, [projects]);
  return (
    <div className="min-h-screen bg-vibeflow-dark relative overflow-hidden">
      {/* Enhanced Background Orbs with Floating Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-96 h-96 -top-48 -left-48 opacity-30 animate-float-slow"></div>
        <div className="floating-orb w-80 h-80 -bottom-40 -right-40 opacity-20 animate-float-delayed"></div>
        <div className="floating-orb w-64 h-64 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 animate-pulse-glow"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-vibeflow-blue rounded-full animate-float-particle opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-vibeflow-emerald rounded-full animate-float-particle-delayed opacity-40"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-vibeflow-violet rounded-full animate-float-particle-slow opacity-50"></div>
      </div>

      {/* Header with entrance animation */}
      <header className={`relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">                <Button 
                  variant="outline" 
                  size="sm" 
                  className="glass-effect border-white/20 hover:scale-102 hover:shadow-xl hover:shadow-vibeflow-blue/20 transition-all duration-200 group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform duration-200" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-vibeflow-gradient rounded-xl flex items-center justify-center glow-effect animate-glow-pulse group-hover:scale-105 transition-transform duration-200">
                  <BarChart3 className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-display font-bold text-white">
                    <TextHoverEffect text="Analytics Dashboard" />
                  </h1>
                  <p className="text-sm text-white/60 animate-fade-in-up animation-delay-300">Project insights and productivity metrics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>      {/* Main Content with staggered entrance animations */}
      <main className={`relative z-10 container mx-auto px-4 py-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Overview Stats with animated counters and enhanced hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">          {/* Active Projects Card */}
          <Card className={`glass-effect group hover:scale-102 hover:shadow-2xl hover:shadow-vibeflow-blue/30 transition-all duration-300 cursor-pointer ${
            animateStats ? 'animate-slide-in-left' : 'opacity-0'
          }`}>
            <CardContent className="p-6 relative overflow-hidden">
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm text-white/60 mb-1">Active Projects</p>
                  <p className="text-2xl font-bold text-white group-hover:text-vibeflow-blue transition-colors duration-200">
                    {animateStats ? projectStats.activeProjects : 0}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-vibeflow-emerald" />
                    <p className="text-xs text-vibeflow-emerald animate-pulse">
                      +{Math.max(0, projectStats.activeProjects - 6)} this month
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-vibeflow-blue/20 rounded-lg flex items-center justify-center group-hover:bg-vibeflow-blue/30 group-hover:scale-105 transition-all duration-200">
                  <Target className="w-6 h-6 text-vibeflow-blue group-hover:rotate-6 transition-transform duration-200" />
                </div>
              </div>
              
              {/* Animated underline */}
              <div className="absolute bottom-0 left-0 h-1 bg-vibeflow-blue w-0 group-hover:w-full transition-all duration-300"></div>
            </CardContent>
          </Card>

          {/* Task Completion Card */}
          <Card className={`glass-effect group hover:scale-102 hover:shadow-2xl hover:shadow-vibeflow-emerald/30 transition-all duration-300 cursor-pointer ${
            animateStats ? 'animate-slide-in-left animation-delay-200' : 'opacity-0'
          }`}>
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-emerald/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm text-white/60 mb-1">Task Completion</p>
                  <p className="text-2xl font-bold text-white group-hover:text-vibeflow-emerald transition-colors duration-200">
                    {animateStats ? (projectStats.totalTasks > 0 ? Math.round((projectStats.completedTasks / projectStats.totalTasks) * 100) : 0) : 0}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3 text-vibeflow-emerald animate-spin-slow" />
                    <p className="text-xs text-vibeflow-emerald">
                      {projectStats.completedTasks}/{projectStats.totalTasks} tasks
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-vibeflow-emerald/20 rounded-lg flex items-center justify-center group-hover:bg-vibeflow-emerald/30 group-hover:scale-105 transition-all duration-200">
                  <CheckCircle2 className="w-6 h-6 text-vibeflow-emerald group-hover:rotate-6 transition-transform duration-200" />
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 h-1 bg-vibeflow-emerald w-0 group-hover:w-full transition-all duration-300"></div>
            </CardContent>
          </Card>

          {/* Team Members Card */}
          <Card className={`glass-effect group hover:scale-102 hover:shadow-2xl hover:shadow-vibeflow-violet/30 transition-all duration-300 cursor-pointer ${
            animateStats ? 'animate-slide-in-left animation-delay-400' : 'opacity-0'
          }`}>
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-violet/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm text-white/60 mb-1">Team Members</p>
                  <p className="text-2xl font-bold text-white group-hover:text-vibeflow-violet transition-colors duration-200">
                    {animateStats ? projectStats.teamMembers : 0}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Activity className="w-3 h-3 text-vibeflow-violet animate-bounce" />
                    <p className="text-xs text-vibeflow-violet">Across all projects</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-vibeflow-violet/20 rounded-lg flex items-center justify-center group-hover:bg-vibeflow-violet/30 group-hover:scale-105 transition-all duration-200">
                  <Users className="w-6 h-6 text-vibeflow-violet group-hover:rotate-6 transition-transform duration-200" />
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 h-1 bg-vibeflow-violet w-0 group-hover:w-full transition-all duration-300"></div>
            </CardContent>
          </Card>

          {/* Average Completion Card */}
          <Card className={`glass-effect group hover:scale-102 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 cursor-pointer ${
            animateStats ? 'animate-slide-in-left animation-delay-600' : 'opacity-0'
          }`}>
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm text-white/60 mb-1">Avg. Completion</p>
                  <p className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
                    {animateStats ? projectStats.avgCompletionTime : 0}d
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3 text-orange-400 animate-pulse" />
                    <p className="text-xs text-orange-400">Per task</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 group-hover:scale-105 transition-all duration-200">
                  <Clock className="w-6 h-6 text-orange-400 group-hover:rotate-6 transition-transform duration-200" />
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 h-1 bg-orange-400 w-0 group-hover:w-full transition-all duration-300"></div>
            </CardContent>
          </Card>
        </div>        {/* Enhanced Tabs with smooth animations */}
        <Tabs defaultValue="projects" className={`space-y-6 ${
          isVisible ? 'animate-fade-in-up animation-delay-800' : 'opacity-0'
        }`}>
          <TabsList className="glass-effect relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-blue/5 via-vibeflow-violet/5 to-vibeflow-emerald/5 animate-gradient-shift"></div>            <TabsTrigger 
              value="projects" 
              className="data-[state=active]:bg-vibeflow-gradient relative z-10 hover:scale-101 transition-all duration-200 group"
            >
              <BarChart3 className="w-4 h-4 mr-2 group-hover:rotate-3 transition-transform duration-200" />
              Project Overview
            </TabsTrigger>
            <TabsTrigger 
              value="productivity" 
              className="data-[state=active]:bg-vibeflow-gradient relative z-10 hover:scale-101 transition-all duration-200 group"
            >
              <TrendingUp className="w-4 h-4 mr-2 group-hover:rotate-3 transition-transform duration-200" />
              Productivity Metrics
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="data-[state=active]:bg-vibeflow-gradient relative z-10 hover:scale-101 transition-all duration-200 group"
            >
              <Users className="w-4 h-4 mr-2 group-hover:rotate-3 transition-transform duration-200" />
              Team Performance
            </TabsTrigger>
          </TabsList>          <TabsContent value="projects" className="space-y-6 animate-fade-in">            <Card className="glass-effect group hover:shadow-xl hover:shadow-vibeflow-blue/10 transition-all duration-300">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardTitle className="text-white flex items-center gap-2 relative z-10">                <div className="w-8 h-8 bg-vibeflow-blue/20 rounded-lg flex items-center justify-center group-hover:scale-102 group-hover:rotate-3 transition-all duration-200">
                    <TrendingUp className="w-4 h-4 text-vibeflow-blue" />
                  </div>
                  <span className="group-hover:text-vibeflow-blue transition-colors duration-200">Recent Projects</span>                <Badge className="bg-vibeflow-gradient text-white ml-auto">
                    {recentProjects.length} Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.length > 0 ? recentProjects.map((project, index) => (                    <div 
                      key={project.id} 
                      className={`flex items-center justify-between p-4 bg-black/20 rounded-lg group hover:bg-black/30 hover:scale-[1.005] transition-all duration-200 cursor-pointer animate-slide-in-up animation-delay-${index * 100}`}
                    >
                      <div className="flex-1 relative">
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-blue/10 via-vibeflow-violet/10 to-vibeflow-emerald/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200"></div>
                        
                        <div className="flex items-center gap-3 mb-2 relative z-10">
                          <h3 className="font-semibold text-white group-hover:text-vibeflow-blue transition-colors duration-200">{project.name}</h3>
                          <Badge 
                            variant={project.status === 'completed' ? 'default' : 'secondary'}
                            className={`transition-all duration-200 hover:scale-102 ${
                              project.status === 'completed' ? 'bg-vibeflow-emerald text-white hover:shadow-vibeflow-emerald/50' :
                              project.status === 'review' ? 'bg-vibeflow-violet text-white hover:shadow-vibeflow-violet/50' :
                              project.status === 'paused' ? 'bg-orange-500 text-white hover:shadow-orange-500/50' :
                              'bg-vibeflow-blue text-white hover:shadow-vibeflow-blue/50'
                            }`}
                          >                            <Activity className="w-3 h-3 mr-1" />
                            {project.status}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={`transition-all duration-200 hover:scale-102 ${
                              project.priority === 'high' ? 'border-red-500 text-red-400 hover:bg-red-500/10' :
                              project.priority === 'medium' ? 'border-yellow-500 text-yellow-400 hover:bg-yellow-500/10' :
                              'border-green-500 text-green-400 hover:bg-green-500/10'
                            }`}
                          >
                            <Target className="w-3 h-3 mr-1" />
                            {project.priority} priority
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-white/60">Progress</span>
                              <span className="text-sm text-white font-semibold">{project.progress}%</span>
                            </div>                            {/* Enhanced progress bar with animations */}
                            <div className="relative">
                              <Progress 
                                value={project.progress} 
                                className={`h-2 transition-all duration-1000 ${
                                  project.progress > 75 ? 'text-vibeflow-emerald' :
                                  project.progress > 50 ? 'text-vibeflow-violet' :
                                  'text-vibeflow-blue'
                                }`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-shine pointer-events-none rounded-full"></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-white/60 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Deadline
                            </p>
                            <p className="text-sm text-white font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 animate-fade-in">
                      <div className="w-16 h-16 bg-vibeflow-gradient rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <BarChart3 className="w-8 h-8 text-white animate-pulse" />
                      </div>
                      <p className="text-white/60 text-lg mb-2">No projects available</p>
                      <p className="text-white/40">Create some projects to see analytics!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>          <TabsContent value="productivity" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Productivity Trends Card */}              <Card className="glass-effect group hover:shadow-xl hover:shadow-vibeflow-emerald/10 transition-all duration-200">
                <CardHeader className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <CardTitle className="text-white flex items-center gap-2 relative z-10">
                    <div className="w-8 h-8 bg-vibeflow-emerald/20 rounded-lg flex items-center justify-center group-hover:scale-102 group-hover:rotate-3 transition-all duration-200">
                      <Calendar className="w-4 h-4 text-vibeflow-emerald" />
                    </div>
                    <span className="group-hover:text-vibeflow-emerald transition-colors duration-200">Productivity Trends</span>                    <div className="ml-auto flex gap-2">
                      <div className="w-2 h-2 bg-vibeflow-emerald rounded-full"></div>
                      <div className="w-2 h-2 bg-vibeflow-blue rounded-full"></div>
                      <div className="w-2 h-2 bg-vibeflow-violet rounded-full"></div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productivityData.map((period, index) => (
                      <div 
                        key={index} 
                        className={`p-4 bg-black/20 rounded-lg group hover:bg-black/30 hover:scale-[1.005] transition-all duration-200 cursor-pointer animate-slide-in-right animation-delay-${index * 150}`}
                      >
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-emerald/10 via-vibeflow-blue/10 to-vibeflow-violet/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200"></div>
                        
                        <div className="flex items-center justify-between mb-3 relative z-10">
                          <h3 className="font-semibold text-white group-hover:text-vibeflow-emerald transition-colors duration-200 flex items-center gap-2">
                            <Clock className="w-4 h-4 animate-spin-slow" />
                            {period.period}
                          </h3>
                          <Badge className={`bg-vibeflow-gradient text-white hover:scale-105 transition-all duration-200 ${
                            period.efficiency > 80 ? 'animate-bounce' : ''
                          }`}>
                            <Award className="w-3 h-3 mr-1" />
                            {period.efficiency}% efficiency
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm relative z-10">
                          <div className="group/item hover:scale-102 transition-transform duration-200">
                            <p className="text-white/60 mb-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Tasks Completed
                            </p>
                            <p className="text-white font-semibold text-lg">{period.tasks}</p>
                          </div>
                          <div className="group/item hover:scale-105 transition-transform duration-300">
                            <p className="text-white/60 mb-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Hours Worked
                            </p>
                            <p className="text-white font-semibold text-lg">{period.hours}h</p>
                          </div>
                        </div>
                        
                        {/* Animated efficiency bar */}
                        <div className="mt-3 relative z-10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-white/60">Efficiency Score</span>
                            <span className="text-xs text-white">{period.efficiency}%</span>
                          </div>
                          <div className="relative">
                            <Progress 
                              value={period.efficiency} 
                              className={`h-2 transition-all duration-1000 ${
                                period.efficiency > 80 ? 'text-vibeflow-emerald' :
                                period.efficiency > 60 ? 'text-vibeflow-blue' :
                                'text-orange-400'
                              }`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-shine pointer-events-none rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Insights Card */}              <Card className="glass-effect group hover:shadow-2xl hover:shadow-vibeflow-violet/20 transition-all duration-300">
                <CardHeader className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <CardTitle className="text-white flex items-center gap-2 relative z-10">
                    <div className="w-8 h-8 bg-vibeflow-violet/20 rounded-lg flex items-center justify-center group-hover:scale-105 group-hover:rotate-6 transition-all duration-200">
                      <Brain className="w-4 h-4 text-vibeflow-violet animate-pulse" />
                    </div>
                    <span className="group-hover:text-vibeflow-violet transition-colors duration-200">AI Insights & Recommendations</span>
                    <Sparkles className="w-4 h-4 text-vibeflow-violet ml-auto animate-spin-slow" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projectStats.overallProgress > 75 && (
                      <div className="p-4 bg-vibeflow-emerald/10 border border-vibeflow-emerald/20 rounded-lg group hover:bg-vibeflow-emerald/20 hover:scale-[1.02] transition-all duration-500 animate-slide-in-left">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-vibeflow-emerald/20 rounded-lg flex items-center justify-center animate-bounce">
                            <CheckCircle2 className="w-4 h-4 text-vibeflow-emerald" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                              Excellent Progress! 
                              <Award className="w-4 h-4 text-vibeflow-emerald animate-pulse" />
                            </h4>
                            <p className="text-sm text-white/70">
                              Your team is performing excellently with {projectStats.overallProgress}% overall progress! 
                              Keep up the momentum.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {projectStats.highPriorityProjects > 0 && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg group hover:bg-yellow-500/20 hover:scale-[1.02] transition-all duration-500 animate-slide-in-left animation-delay-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center animate-pulse">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                              High Priority Focus
                              <Target className="w-4 h-4 text-yellow-400 animate-bounce" />
                            </h4>
                            <p className="text-sm text-white/70">
                              You have {projectStats.highPriorityProjects} high-priority project{projectStats.highPriorityProjects > 1 ? 's' : ''} that need immediate attention.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-vibeflow-blue/10 border border-vibeflow-blue/20 rounded-lg group hover:bg-vibeflow-blue/20 hover:scale-[1.02] transition-all duration-500 animate-slide-in-left animation-delay-400">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-vibeflow-blue/20 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-vibeflow-blue animate-bounce" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                            Team Collaboration
                            <Users className="w-4 h-4 text-vibeflow-blue animate-pulse" />
                          </h4>
                          <p className="text-sm text-white/70">
                            {projectStats.teamMembers} team members are actively collaborating across {projectStats.totalProjects} projects. 
                            Great teamwork!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Performance Score */}
                    <div className="p-4 bg-gradient-to-r from-vibeflow-violet/10 to-vibeflow-blue/10 border border-vibeflow-violet/20 rounded-lg">
                      <div className="text-center">
                        <h4 className="font-semibold text-white mb-2 flex items-center justify-center gap-2">
                          <Zap className="w-4 h-4 text-vibeflow-violet animate-pulse" />
                          Overall Performance Score
                        </h4>
                        <div className="text-3xl font-bold text-white mb-2">
                          {Math.round((projectStats.overallProgress + (projectStats.totalTasks > 0 ? (projectStats.completedTasks / projectStats.totalTasks) * 100 : 0)) / 2)}
                          <span className="text-lg text-vibeflow-violet">/100</span>
                        </div>
                        <Progress 
                          value={Math.round((projectStats.overallProgress + (projectStats.totalTasks > 0 ? (projectStats.completedTasks / projectStats.totalTasks) * 100 : 0)) / 2)} 
                          className="h-3 text-vibeflow-gradient"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>          <TabsContent value="team" className="space-y-6 animate-fade-in">            <Card className="glass-effect group hover:shadow-2xl hover:shadow-vibeflow-violet/20 transition-all duration-300">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <CardTitle className="text-white flex items-center gap-2 relative z-10">
                  <div className="w-8 h-8 bg-vibeflow-violet/20 rounded-lg flex items-center justify-center group-hover:scale-105 group-hover:rotate-6 transition-all duration-200">
                    <Users className="w-4 h-4 text-vibeflow-violet animate-pulse" />
                  </div>
                  <span className="group-hover:text-vibeflow-violet transition-colors duration-200">Team Performance Overview</span>                  <Badge className="bg-vibeflow-gradient text-white ml-auto">
                    {teamPerformance.length} Members
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamPerformance.length > 0 ? teamPerformance.map((member, index) => (
                    <div 
                      key={index} 
                      className={`p-4 bg-black/20 rounded-lg group hover:bg-black/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-slide-in-up animation-delay-${index * 100}`}
                    >                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-violet/10 via-vibeflow-blue/10 to-vibeflow-emerald/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200"></div>
                      
                      <div className="text-center mb-3 relative z-10">
                        <div className="w-12 h-12 bg-vibeflow-gradient rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform duration-200 animate-glow-pulse">
                          <span className="text-white font-semibold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white group-hover:text-vibeflow-violet transition-colors duration-200">{member.name}</h3>
                        <p className="text-sm text-white/60 flex items-center justify-center gap-1">
                          <Award className="w-3 h-3" />
                          Team Member
                        </p>
                      </div>
                      
                      <div className="space-y-3 relative z-10">                        <div className="flex justify-between text-sm group-hover:scale-102 transition-transform duration-200">
                          <span className="text-white/60 flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Projects
                          </span>
                          <span className="text-white font-semibold">{member.projects}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm group-hover:scale-102 transition-transform duration-200">
                          <span className="text-white/60 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Tasks
                          </span>
                          <span className="text-white font-semibold">{member.totalTasks}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm group-hover:scale-102 transition-transform duration-200">
                          <span className="text-white/60 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Completion
                          </span>
                          <span className="text-white font-semibold">{member.completion}%</span>
                        </div>
                        
                        {/* Animated progress bar */}
                        <div className="relative">
                          <Progress 
                            value={member.completion} 
                            className={`h-3 transition-all duration-1000 ${
                              member.completion > 80 ? 'text-vibeflow-emerald' :
                              member.completion > 60 ? 'text-vibeflow-blue' :
                              'text-orange-400'
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-shine pointer-events-none rounded-full"></div>
                        </div>
                        
                        {/* Performance badge */}
                        <div className="flex justify-center mt-3">                          <Badge 
                            className={`transition-all duration-300 hover:scale-110 ${
                              member.completion > 80 ? 'bg-vibeflow-emerald text-white' :
                              member.completion > 60 ? 'bg-vibeflow-blue text-white' :
                              'bg-orange-500 text-white'
                            }`}
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            {member.completion > 80 ? 'Excellent' : member.completion > 60 ? 'Good' : 'Needs Focus'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full text-center py-12 animate-fade-in">
                      <div className="w-16 h-16 bg-vibeflow-gradient rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <Users className="w-8 h-8 text-white animate-pulse" />
                      </div>
                      <p className="text-white/60 text-lg mb-2">No team data available</p>
                      <p className="text-white/40">Create projects with team members to see team performance!</p>
                    </div>
                  )}
                </div>
                
                {/* Team collaboration insights */}
                {teamPerformance.length > 0 && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-vibeflow-violet/10 to-vibeflow-blue/10 border border-vibeflow-violet/20 rounded-lg animate-slide-in-up animation-delay-600">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-vibeflow-violet animate-pulse" />
                      Team Collaboration Insights
                    </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-black/20 rounded-lg group hover:bg-black/30 transition-all duration-200">
                        <div className="w-12 h-12 bg-vibeflow-emerald/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform duration-200">
                          <Award className="w-6 h-6 text-vibeflow-emerald animate-bounce" />
                        </div>
                        <p className="text-white font-semibold text-lg">
                          {Math.round(teamPerformance.reduce((sum, m) => sum + m.completion, 0) / teamPerformance.length)}%
                        </p>
                        <p className="text-white/60 text-sm">Avg Team Performance</p>
                      </div>
                      
                      <div className="text-center p-4 bg-black/20 rounded-lg group hover:bg-black/30 transition-all duration-200">
                        <div className="w-12 h-12 bg-vibeflow-blue/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform duration-200">
                          <Target className="w-6 h-6 text-vibeflow-blue animate-pulse" />
                        </div>
                        <p className="text-white font-semibold text-lg">
                          {teamPerformance.reduce((sum, m) => sum + m.projects, 0)}
                        </p>
                        <p className="text-white/60 text-sm">Total Projects</p>
                      </div>
                      
                      <div className="text-center p-4 bg-black/20 rounded-lg group hover:bg-black/30 transition-all duration-200">
                        <div className="w-12 h-12 bg-vibeflow-violet/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform duration-200">
                          <CheckCircle2 className="w-6 h-6 text-vibeflow-violet animate-spin-slow" />
                        </div>
                        <p className="text-white font-semibold text-lg">
                          {teamPerformance.reduce((sum, m) => sum + m.completedTasks, 0)}
                        </p>
                        <p className="text-white/60 text-sm">Tasks Completed</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Animated Dashboard Visualizations */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 ${
          isVisible ? 'animate-fade-in-up animation-delay-1200' : 'opacity-0'
        }`}>
          {/* Project Status Distribution Chart */}
          <Card className="glass-effect group hover:shadow-2xl hover:shadow-vibeflow-blue/20 transition-all duration-500">
            <CardHeader className="relative overflow-hidden">              <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <CardTitle className="text-white flex items-center gap-2 relative z-10">
                <div className="w-8 h-8 bg-vibeflow-blue/20 rounded-lg flex items-center justify-center group-hover:scale-105 group-hover:rotate-6 transition-all duration-200">
                  <BarChart3 className="w-4 h-4 text-vibeflow-blue animate-pulse" />
                </div>
                <span className="group-hover:text-vibeflow-blue transition-colors duration-200">Project Status Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>              {/* Animated Status Bars */}
              <div className="space-y-4">                  {[
                    { status: 'Active', count: projects.filter(p => p.status === 'active').length, color: 'vibeflow-blue', icon: Activity },
                    { status: 'Completed', count: projects.filter(p => p.status === 'completed').length, color: 'vibeflow-emerald', icon: CheckCircle2 },
                    { status: 'In Review', count: projects.filter(p => p.status === 'review').length, color: 'vibeflow-violet', icon: Brain },
                    { status: 'Paused', count: projects.filter(p => p.status === 'paused').length, color: 'orange-500', icon: AlertTriangle }
                  ].map((item, index) => {
                    const percentage = projects.length > 0 ? (item.count / projects.length) * 100 : 0;
                    const IconComponent = item.icon;
                    
                    return (
                      <div 
                        key={item.status} 
                        className={`group hover:scale-[1.02] transition-all duration-500 animate-slide-in-right animation-delay-${index * 150}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <IconComponent className={`w-4 h-4 text-${item.color}`} />
                            <span className="text-white font-medium">{item.status}</span>
                          </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white/60 text-sm">{item.count} projects</span>
                          <span className={`text-${item.color} font-semibold`}>{Math.round(percentage)}%</span>
                        </div>
                      </div>
                      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r from-${item.color} to-${item.color}/70 rounded-full transition-all duration-1500 ease-out`}
                          style={{ width: `${animateStats ? percentage : 0}%` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-slide-shine"></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Priority Distribution */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-vibeflow-violet animate-bounce" />
                  Priority Distribution
                </h4>                <div className="grid grid-cols-3 gap-4">
                  {[
                    { priority: 'High', count: projects.filter(p => p.priority === 'high').length, color: 'red-500' },
                    { priority: 'Medium', count: projects.filter(p => p.priority === 'medium').length, color: 'yellow-500' },
                    { priority: 'Low', count: projects.filter(p => p.priority === 'low').length, color: 'green-500' }
                  ].map((item, index) => (
                    <div 
                      key={item.priority}
                      className={`text-center p-3 bg-black/20 rounded-lg group hover:bg-black/30 hover:scale-105 transition-all duration-300 animate-slide-in-up animation-delay-${600 + index * 100}`}
                    >                      <div className={`w-8 h-8 bg-${item.color}/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform duration-200`}>
                        <div className={`w-3 h-3 bg-${item.color} rounded-full`}></div>
                      </div>
                      <p className="text-white font-semibold text-lg">{item.count}</p>
                      <p className={`text-${item.color} text-sm`}>{item.priority}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activity Timeline */}
          <Card className="glass-effect group hover:shadow-2xl hover:shadow-vibeflow-violet/20 transition-all duration-300">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>              <CardTitle className="text-white flex items-center gap-2 relative z-10">
                <div className="w-8 h-8 bg-vibeflow-violet/20 rounded-lg flex items-center justify-center group-hover:scale-105 group-hover:rotate-6 transition-all duration-200">
                  <Activity className="w-4 h-4 text-vibeflow-violet" />
                </div>
                <span className="group-hover:text-vibeflow-violet transition-colors duration-200">Recent Activity Timeline</span>
                <div className="ml-auto w-2 h-2 bg-vibeflow-emerald rounded-full"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.slice(0, 5).map((project, index) => (
                  <div 
                    key={project.id}
                    className={`flex items-center gap-4 p-3 bg-black/20 rounded-lg group hover:bg-black/30 hover:scale-[1.01] transition-all duration-300 animate-slide-in-left animation-delay-${index * 100}`}
                  >
                    {/* Timeline dot */}                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full ${
                        project.status === 'completed' ? 'bg-vibeflow-emerald' :
                        project.status === 'review' ? 'bg-vibeflow-violet' :
                        project.status === 'paused' ? 'bg-orange-500' :
                        'bg-vibeflow-blue'
                      }`}></div>
                      {index < recentProjects.slice(0, 5).length - 1 && (
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-px h-6 bg-white/20"></div>
                      )}
                    </div>

                    {/* Activity content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium group-hover:text-vibeflow-violet transition-colors duration-300">
                          {project.name}
                        </h4>
                        <span className="text-white/60 text-xs">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            project.status === 'completed' ? 'border-vibeflow-emerald text-vibeflow-emerald' :
                            project.status === 'review' ? 'border-vibeflow-violet text-vibeflow-violet' :
                            project.status === 'paused' ? 'border-orange-500 text-orange-500' :
                            'border-vibeflow-blue text-vibeflow-blue'
                          }`}
                        >
                          {project.status}
                        </Badge>
                        <div className="flex-1 flex items-center gap-1">
                          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${
                                project.progress > 75 ? 'bg-vibeflow-emerald' :
                                project.progress > 50 ? 'bg-vibeflow-violet' :
                                'bg-vibeflow-blue'
                              }`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-white/60 text-xs">{project.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {recentProjects.length === 0 && (
                  <div className="text-center py-8 animate-fade-in">
                    <div className="w-12 h-12 bg-vibeflow-violet/20 rounded-lg flex items-center justify-center mx-auto mb-3 animate-bounce">
                      <Activity className="w-6 h-6 text-vibeflow-violet" />
                    </div>
                    <p className="text-white/60">No recent activity</p>
                    <p className="text-white/40 text-sm">Start creating projects to see activity!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Animated Productivity Metrics Dashboard */}
        <div className={`mt-8 ${
          isVisible ? 'animate-fade-in-up animation-delay-1400' : 'opacity-0'
        }`}>
          <Card className="glass-effect group hover:shadow-2xl hover:shadow-vibeflow-emerald/20 transition-all duration-500">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardTitle className="text-white flex items-center gap-2 relative z-10">                <div className="w-8 h-8 bg-vibeflow-emerald/20 rounded-lg flex items-center justify-center group-hover:scale-105 group-hover:rotate-6 transition-all duration-200">
                  <TrendingUp className="w-4 h-4 text-vibeflow-emerald animate-bounce" />
                </div>
                <span className="group-hover:text-vibeflow-emerald transition-colors duration-200">Weekly Progress Visualization</span>
                <div className="ml-auto flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-1 bg-vibeflow-emerald rounded-full animate-pulse animation-delay-${i * 100}`}
                      style={{ height: `${Math.random() * 20 + 10}px` }}
                    ></div>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Weekly bars visualization */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const height = Math.random() * 60 + 20; // Random height for demo
                  const isToday = index === new Date().getDay() - 1;
                  
                  return (
                    <div key={day} className="text-center">
                      <div className="h-20 flex items-end justify-center mb-2">
                        <div 
                          className={`w-8 rounded-t-lg transition-all duration-1000 hover:scale-110 cursor-pointer ${
                            isToday ? 'bg-vibeflow-emerald animate-glow-pulse' : 'bg-vibeflow-blue/60 hover:bg-vibeflow-blue'
                          } animate-slide-in-up`}
                          style={{ 
                            height: `${animateStats ? height : 0}%`,
                            animationDelay: `${index * 150}ms`
                          }}
                        ></div>
                      </div>
                      <p className={`text-xs ${isToday ? 'text-vibeflow-emerald font-semibold' : 'text-white/60'}`}>
                        {day}
                      </p>
                    </div>
                  );
                })}
              </div>              {/* Performance indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Tasks/Day Avg', value: '12.4', change: '+8%', color: 'vibeflow-emerald', icon: CheckCircle2 },
                  { label: 'Focus Time', value: '6.2h', change: '+15%', color: 'vibeflow-blue', icon: Clock },
                  { label: 'Team Sync', value: '94%', change: '+5%', color: 'vibeflow-violet', icon: Users },
                  { label: 'Quality Score', value: '9.1', change: '+12%', color: 'orange-400', icon: Award }
                ].map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <div 
                      key={metric.label}
                      className={`p-4 bg-black/20 rounded-lg group hover:bg-black/30 hover:scale-105 transition-all duration-500 cursor-pointer animate-slide-in-up animation-delay-${800 + index * 100}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <IconComponent className={`w-4 h-4 text-${metric.color} animate-pulse`} />
                        <span className={`text-xs text-${metric.color} font-semibold`}>{metric.change}</span>
                      </div>
                      <p className="text-white font-bold text-lg">{metric.value}</p>
                      <p className="text-white/60 text-xs">{metric.label}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics Widgets */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 ${
          isVisible ? 'animate-fade-in-up animation-delay-1600' : 'opacity-0'
        }`}>
          {/* Animated Completion Rate Widget */}
          <Card className="glass-effect group hover:shadow-2xl hover:shadow-vibeflow-emerald/20 transition-all duration-500">
            <CardHeader>              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-vibeflow-emerald/20 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-200">
                  <CheckCircle2 className="w-4 h-4 text-vibeflow-emerald animate-spin-slow" />
                </div>
                <span className="group-hover:text-vibeflow-emerald transition-colors duration-200">Completion Rate</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Animated circular progress */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      stroke="currentColor" 
                      strokeWidth="8"
                      fill="none"
                      className="text-white/10"
                    />
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      stroke="currentColor" 
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className="text-vibeflow-emerald transition-all duration-2000 ease-out"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - (animateStats ? projectStats.overallProgress / 100 : 0))}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-white">{Math.round(projectStats.overallProgress)}%</span>
                      <p className="text-xs text-white/60">Complete</p>
                    </div>
                  </div>
                </div>
                
                {/* Animated stats below */}
                <div className="text-center space-y-2">
                  <div className="flex justify-center items-center gap-2">
                    <Zap className="w-4 h-4 text-vibeflow-emerald animate-pulse" />
                    <span className="text-white text-sm">
                      {projectStats.completedTasks} of {projectStats.totalTasks} tasks done
                    </span>
                  </div>
                  <div className="text-xs text-white/60">
                    {projectStats.completedProjects} projects completed
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Animated Velocity Widget */}
          <Card className="glass-effect group hover:shadow-2xl hover:shadow-vibeflow-blue/20 transition-all duration-500">
            <CardHeader>              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-vibeflow-blue/20 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-200">
                  <TrendingUp className="w-4 h-4 text-vibeflow-blue animate-bounce" />
                </div>
                <span className="group-hover:text-vibeflow-blue transition-colors duration-200">Project Velocity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Velocity meter */}
              <div className="relative mb-6">
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-white">{projectStats.avgCompletionTime.toFixed(1)}</span>
                  <span className="text-sm text-vibeflow-blue ml-1">days avg</span>
                </div>
                
                {/* Animated velocity bars */}
                <div className="space-y-3">
                  {['This Week', 'Last Week', 'This Month'].map((period, index) => {
                    const velocity = Math.random() * 80 + 20; // Random for demo
                    return (
                      <div key={period} className={`animate-slide-in-right animation-delay-${index * 200}`}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/80">{period}</span>
                          <span className="text-vibeflow-blue">{Math.round(velocity)}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-vibeflow-blue to-vibeflow-violet rounded-full transition-all duration-1500 ease-out"
                            style={{ width: `${animateStats ? velocity : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 bg-black/20 rounded-lg group-hover:bg-black/30 transition-all duration-300">
                  <div className="text-lg font-semibold text-white">+{Math.round(Math.random() * 20 + 10)}%</div>
                  <div className="text-xs text-white/60">This Week</div>
                </div>
                <div className="p-2 bg-black/20 rounded-lg group-hover:bg-black/30 transition-all duration-300">
                  <div className="text-lg font-semibold text-white">{Math.round(Math.random() * 30 + 40)}</div>
                  <div className="text-xs text-white/60">Tasks/Week</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Animated Team Health Widget */}
          <Card className="glass-effect group hover:shadow-2xl hover:shadow-vibeflow-violet/20 transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-vibeflow-violet/20 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                  <Users className="w-4 h-4 text-vibeflow-violet animate-pulse" />
                </div>
                <span className="group-hover:text-vibeflow-violet transition-colors duration-300">Team Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Health score with animated ring */}
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <div className="w-24 h-24 bg-gradient-to-r from-vibeflow-violet to-vibeflow-emerald rounded-full animate-pulse opacity-20"></div>
                  <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">92</div>
                      <div className="text-xs text-vibeflow-violet">Health</div>
                    </div>
                  </div>
                </div>
                
                {/* Health indicators */}
                <div className="space-y-3">
                  {[
                    { label: 'Collaboration', value: 94, color: 'vibeflow-emerald' },
                    { label: 'Productivity', value: 87, color: 'vibeflow-blue' },
                    { label: 'Communication', value: 91, color: 'vibeflow-violet' }
                  ].map((metric, index) => (
                    <div key={metric.label} className={`animate-slide-in-left animation-delay-${index * 150}`}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">{metric.label}</span>
                        <span className={`text-${metric.color}`}>{metric.value}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${metric.color} rounded-full transition-all duration-1500 ease-out`}
                          style={{ width: `${animateStats ? metric.value : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team alerts */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-vibeflow-emerald/10 border border-vibeflow-emerald/20 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-vibeflow-emerald animate-pulse" />
                  <span className="text-xs text-white/80">All systems healthy</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-vibeflow-blue/10 border border-vibeflow-blue/20 rounded-lg">
                  <Activity className="w-4 h-4 text-vibeflow-blue animate-bounce" />
                  <span className="text-xs text-white/80">{projectStats.teamMembers} active members</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floating Action Insights */}
        <div className={`fixed bottom-6 right-6 z-10 ${
          isVisible ? 'animate-slide-in-right animation-delay-2000' : 'opacity-0'
        }`}>
          <div className="glass-effect p-4 rounded-lg group hover:shadow-2xl hover:shadow-vibeflow-blue/20 transition-all duration-500 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-vibeflow-gradient rounded-lg flex items-center justify-center animate-pulse">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Quick Insight</h4>
                <p className="text-white/70 text-xs">
                  {projectStats.overallProgress > 80 
                    ? "🎉 Excellent progress! Keep it up!" 
                    : projectStats.overallProgress > 60 
                    ? "📈 Good momentum, stay focused!" 
                    : "🚀 Time to accelerate!"}
                </p>
              </div>
              <Button size="sm" className="bg-vibeflow-gradient hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
