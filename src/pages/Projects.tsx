import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Folder, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  Users,
  Star,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Archive,
  Edit3,
  Trash2,
  Eye,
  ExternalLink,
  Target,
  TrendingUp,
  BookOpen,
  Settings,
  Copy,
  Download,
  Share,
  Grid3X3,
  List,
  SortAsc,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import TextHoverEffect from '@/components/TextHoverEffect';
import { useProjects, Project } from '@/contexts/ProjectContext';

const Projects = () => {
  const { toast } = useToast();
  const { projects, addProject, updateProject, deleteProject, getProjectStats } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    deadline: '',
    team: '',
    tasks: { total: 0, completed: 0 }
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    deadline: '',
    team: '',
    progress: 0,
    status: 'active' as 'active' | 'completed' | 'review' | 'paused',
    tasks: { total: 0, completed: 0 }
  });

  // Get project statistics
  const stats = getProjectStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-vibeflow-blue text-white';
      case 'completed': return 'bg-vibeflow-emerald text-white';
      case 'review': return 'bg-vibeflow-violet text-white';
      case 'paused': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 text-red-400 bg-red-500/10';
      case 'medium': return 'border-yellow-500 text-yellow-400 bg-yellow-500/10';
      case 'low': return 'border-green-500 text-green-400 bg-green-500/10';
      default: return 'border-gray-500 text-gray-400 bg-gray-500/10';
    }
  };

  // Filter and sort projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.team.some(member => member.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'progress':
        return b.progress - a.progress;
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required.",
        variant: "destructive",
      });
      return;
    }

    const project = {
      name: newProject.name,
      description: newProject.description,
      status: "active" as const,
      priority: newProject.priority,
      progress: 0,
      deadline: newProject.deadline,
      team: newProject.team ? newProject.team.split(',').map(s => s.trim()) : [],
      tasks: newProject.tasks,
      createdAt: new Date().toISOString().split('T')[0],
      starred: false
    };

    addProject(project);
    setNewProject({ 
      name: '', 
      description: '', 
      priority: 'medium', 
      deadline: '', 
      team: '',
      tasks: { total: 0, completed: 0 }
    });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Project Created",
      description: `${project.name} has been added to your projects.`,
    });
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setEditForm({
      name: project.name,
      description: project.description,
      priority: project.priority,
      deadline: project.deadline,
      team: project.team.join(', '),
      progress: project.progress,
      status: project.status,
      tasks: project.tasks
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProject = () => {
    if (!editingProject || !editForm.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required.",
        variant: "destructive",
      });
      return;
    }

    const updates = {
      name: editForm.name,
      description: editForm.description,
      priority: editForm.priority,
      deadline: editForm.deadline,
      team: editForm.team ? editForm.team.split(',').map(s => s.trim()) : [],
      progress: editForm.progress,
      status: editForm.status,
      tasks: editForm.tasks
    };

    updateProject(editingProject.id, updates);
    setIsEditDialogOpen(false);
    setEditingProject(null);
    
    toast({
      title: "Project Updated",
      description: `${updates.name} has been updated successfully.`,
    });
  };

  const handleDeleteProject = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      deleteProject(projectId);
      toast({
        title: "Project Deleted",
        description: `${project.name} has been removed from your projects.`,
      });
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedProjects.length === 0) {
      toast({
        title: "No projects selected",
        description: "Please select projects to perform bulk actions.",
        variant: "destructive",
      });
      return;
    }

    selectedProjects.forEach(projectId => {
      switch (action) {
        case 'delete':
          deleteProject(projectId);
          break;
        case 'complete':
          updateProject(projectId, { status: 'completed', progress: 100 });
          break;
        case 'pause':
          updateProject(projectId, { status: 'paused' });
          break;
        case 'activate':
          updateProject(projectId, { status: 'active' });
          break;
      }
    });

    setSelectedProjects([]);
    toast({
      title: "Bulk Action Complete",
      description: `Applied ${action} to ${selectedProjects.length} projects.`,
    });
  };

  const toggleProjectSelection = (projectId: number) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const selectAllProjects = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(p => p.id));
    }
  };

  const toggleStar = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      updateProject(projectId, { starred: !project.starred });
    }
  };

  const updateProjectStatus = (projectId: number, newStatus: string) => {
    updateProject(projectId, { status: newStatus as 'active' | 'completed' | 'review' | 'paused' });
    
    toast({
      title: "Status Updated",
      description: `Project status changed to ${newStatus}.`,
    });
  };

  const isOverdue = (deadline: string, status: string) => {
    return status !== 'completed' && new Date(deadline) < new Date();
  };

  return (
    <div className="min-h-screen bg-vibeflow-dark relative overflow-hidden">      {/* Enhanced Background Orbs with Advanced Floating Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-96 h-96 -top-48 -left-48 opacity-30 animate-bounce"></div>
        <div className="floating-orb w-80 h-80 -bottom-40 -right-40 opacity-20 animate-pulse"></div>
        <div className="floating-orb w-64 h-64 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 animate-spin"></div>
        {/* Additional floating particles */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-vibeflow-violet rounded-full opacity-40 animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-vibeflow-blue rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-vibeflow-emerald rounded-full opacity-30 animate-bounce"></div>
      </div>{/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm animate-in slide-in-from-top-4 duration-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">              <Link to="/">
                <Button variant="outline" size="sm" className="glass-effect border-white/20 hover:border-vibeflow-blue/50 hover:bg-vibeflow-blue/10 hover:scale-105 hover:-translate-x-1 transition-all duration-300 group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:scale-110 group-hover:-translate-x-0.5 transition-all duration-300" />
                  <span className="group-hover:translate-x-0.5 transition-all duration-300">Back</span>
                </Button>
              </Link>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-vibeflow-gradient rounded-xl flex items-center justify-center glow-effect hover:scale-110 hover:rotate-3 transition-all duration-300 group">
                  <Folder className="w-6 h-6 text-white group-hover:scale-110 transition-all duration-300" />
                </div>
                <div className="group">
                  <h1 className="text-2xl font-display font-bold text-white group-hover:text-vibeflow-violet transition-colors duration-300">
                    <TextHoverEffect text="Project Hub" />
                  </h1>
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">Manage and organize your projects</p>
                </div>
              </div>
            </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-vibeflow-gradient hover:opacity-90 hover:scale-105 hover:shadow-lg hover:shadow-vibeflow-violet/30 transition-all duration-300 group">
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 group-hover:scale-110 transition-all duration-300" />
                  <span className="group-hover:translate-x-0.5 transition-all duration-300">New Project</span>
                </Button>
              </DialogTrigger><DialogContent className="bg-vibeflow-dark/95 backdrop-blur-sm border-white/20 fixed-dialog">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Project Name</Label>
                    <Input 
                      id="name"
                      value={newProject.name}
                      onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-vibeflow-violet focus:ring-vibeflow-violet/20"
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea 
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-vibeflow-violet focus:ring-vibeflow-violet/20"
                      placeholder="Describe your project"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">                    <div>
                      <Label htmlFor="priority" className="text-white">Priority</Label>                      <Select value={newProject.priority} onValueChange={(value) => setNewProject(prev => ({ ...prev, priority: value as 'high' | 'medium' | 'low' }))}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-vibeflow-violet focus:ring-vibeflow-violet/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>                    <div>
                      <Label htmlFor="deadline" className="text-white">Deadline</Label>
                      <Input 
                        id="deadline"
                        type="date"
                        value={newProject.deadline}
                        onChange={(e) => setNewProject(prev => ({ ...prev, deadline: e.target.value }))}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-vibeflow-violet focus:ring-vibeflow-violet/20"
                      />
                    </div>
                  </div>                  <div>
                    <Label htmlFor="team" className="text-white">Team Members</Label>
                    <Input 
                      id="team"
                      value={newProject.team}
                      onChange={(e) => setNewProject(prev => ({ ...prev, team: e.target.value }))}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-vibeflow-violet focus:ring-vibeflow-violet/20"
                      placeholder="Enter names separated by commas"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateProject} className="bg-vibeflow-gradient hover:opacity-90 flex-1">
                      Create Project
                    </Button>                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>              </DialogContent>
            </Dialog>
            
            {/* Edit Project Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="bg-vibeflow-dark/95 backdrop-blur-sm border-white/20 fixed-dialog max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Edit Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name" className="text-white">Project Name</Label>
                    <Input 
                      id="edit-name"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-vibeflow-violet focus:ring-vibeflow-violet/20"
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description" className="text-white">Description</Label>
                    <Textarea 
                      id="edit-description"
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-vibeflow-violet focus:ring-vibeflow-violet/20"
                      placeholder="Describe your project"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-status" className="text-white">Status</Label>
                      <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value as 'active' | 'completed' | 'review' | 'paused' }))}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-vibeflow-violet focus:ring-vibeflow-violet/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="review">In Review</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-priority" className="text-white">Priority</Label>
                      <Select value={editForm.priority} onValueChange={(value) => setEditForm(prev => ({ ...prev, priority: value as 'high' | 'medium' | 'low' }))}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-vibeflow-violet focus:ring-vibeflow-violet/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-progress" className="text-white">Progress (%)</Label>
                      <Input 
                        id="edit-progress"
                        type="number"
                        min="0"
                        max="100"
                        value={editForm.progress}
                        onChange={(e) => setEditForm(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-vibeflow-violet focus:ring-vibeflow-violet/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-deadline" className="text-white">Deadline</Label>
                      <Input 
                        id="edit-deadline"
                        type="date"
                        value={editForm.deadline}
                        onChange={(e) => setEditForm(prev => ({ ...prev, deadline: e.target.value }))}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-vibeflow-violet focus:ring-vibeflow-violet/20"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-team" className="text-white">Team Members</Label>
                    <Input 
                      id="edit-team"
                      value={editForm.team}
                      onChange={(e) => setEditForm(prev => ({ ...prev, team: e.target.value }))}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-vibeflow-violet focus:ring-vibeflow-violet/20"
                      placeholder="Enter names separated by commas"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-total-tasks" className="text-white">Total Tasks</Label>
                      <Input 
                        id="edit-total-tasks"
                        type="number"
                        min="0"
                        value={editForm.tasks.total}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          tasks: { ...prev.tasks, total: parseInt(e.target.value) || 0 }
                        }))}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-vibeflow-violet focus:ring-vibeflow-violet/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-completed-tasks" className="text-white">Completed Tasks</Label>
                      <Input 
                        id="edit-completed-tasks"
                        type="number"
                        min="0"
                        max={editForm.tasks.total}
                        value={editForm.tasks.completed}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          tasks: { ...prev.tasks, completed: parseInt(e.target.value) || 0 }
                        }))}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-vibeflow-violet focus:ring-vibeflow-violet/20"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleUpdateProject} className="bg-vibeflow-gradient hover:opacity-90 flex-1">
                      Update Project
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditDialogOpen(false)}
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 animate-in fade-in duration-700 delay-200">        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-300">
          <Card className="glass-effect border-white/20 group hover:border-vibeflow-blue/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-vibeflow-blue/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">Total Projects</p>
                  <p className="text-2xl font-bold text-white group-hover:text-vibeflow-blue transition-colors duration-300">{stats.totalProjects}</p>
                </div>
                <div className="w-12 h-12 bg-vibeflow-blue/20 rounded-lg flex items-center justify-center group-hover:bg-vibeflow-blue/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Folder className="w-6 h-6 text-vibeflow-blue group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              {/* Animated underline */}
              <div className="w-0 h-0.5 bg-vibeflow-blue group-hover:w-full transition-all duration-300 mt-4"></div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/20 group hover:border-vibeflow-emerald/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-vibeflow-emerald/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">Active</p>
                  <p className="text-2xl font-bold text-white group-hover:text-vibeflow-emerald transition-colors duration-300">{stats.activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-vibeflow-emerald/20 rounded-lg flex items-center justify-center group-hover:bg-vibeflow-emerald/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Play className="w-6 h-6 text-vibeflow-emerald group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              {/* Animated underline */}
              <div className="w-0 h-0.5 bg-vibeflow-emerald group-hover:w-full transition-all duration-300 mt-4"></div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/20 group hover:border-vibeflow-violet/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-vibeflow-violet/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">Completed</p>
                  <p className="text-2xl font-bold text-white group-hover:text-vibeflow-violet transition-colors duration-300">{stats.completedProjects}</p>
                </div>
                <div className="w-12 h-12 bg-vibeflow-violet/20 rounded-lg flex items-center justify-center group-hover:bg-vibeflow-violet/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <CheckCircle2 className="w-6 h-6 text-vibeflow-violet group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              {/* Animated underline */}
              <div className="w-0 h-0.5 bg-vibeflow-violet group-hover:w-full transition-all duration-300 mt-4"></div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/20 group hover:border-red-400/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">Overdue</p>
                  <p className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">{stats.overdueTasks}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <AlertTriangle className="w-6 h-6 text-red-400 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              {/* Animated underline */}
              <div className="w-0 h-0.5 bg-red-400 group-hover:w-full transition-all duration-300 mt-4"></div>
            </CardContent>
          </Card>
        </div>        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 animate-in slide-in-from-bottom-4 duration-500 delay-500">
          <div className="relative flex-1 group animate-in slide-in-from-left-4 duration-300 delay-700">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-vibeflow-violet group-focus-within:scale-110 transition-all duration-300" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="glass-effect border-white/20 text-white pl-10 focus:border-vibeflow-violet focus:ring-vibeflow-violet/20 focus:scale-105 transition-all duration-300"
            />
            {/* Search input glow effect */}
            <div className="absolute inset-0 rounded-lg bg-vibeflow-violet/0 group-focus-within:bg-vibeflow-violet/5 transition-all duration-300 pointer-events-none"></div>
          </div>
          
          <div className="flex gap-2 animate-in slide-in-from-right-4 duration-300 delay-800">
            {/* Bulk Actions */}
            {selectedProjects.length > 0 && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="glass-effect border-white/20 text-white hover:border-vibeflow-violet/50 hover:bg-vibeflow-violet/10 hover:scale-105 transition-all duration-300 group">
                      <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                      Actions ({selectedProjects.length})
                      <div className="absolute inset-0 rounded-lg bg-vibeflow-violet/0 group-hover:bg-vibeflow-violet/5 transition-all duration-300"></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-effect border-white/20 animate-in slide-in-from-top-2 duration-200">
                    <DropdownMenuItem onClick={() => handleBulkAction('activate')} className="group">
                      <Play className="w-4 h-4 mr-2 group-hover:scale-110 group-hover:text-vibeflow-emerald transition-all duration-300" />
                      Activate Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('pause')} className="group">
                      <Pause className="w-4 h-4 mr-2 group-hover:scale-110 group-hover:text-orange-400 transition-all duration-300" />
                      Pause Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('complete')} className="group">
                      <CheckCircle2 className="w-4 h-4 mr-2 group-hover:scale-110 group-hover:text-vibeflow-violet transition-all duration-300" />
                      Mark Complete
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleBulkAction('delete')}
                      className="text-red-400 focus:text-red-400 group"
                    >
                      <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            
            {/* View Toggle */}
            <div className="flex rounded-lg bg-white/10 p-1 group hover:bg-white/20 transition-all duration-300">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3 hover:scale-110 transition-all duration-300 group"
              >
                <Grid3X3 className="w-4 h-4 group-hover:rotate-6 transition-all duration-300" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3 hover:scale-110 transition-all duration-300 group"
              >
                <List className="w-4 h-4 group-hover:translate-x-0.5 transition-all duration-300" />
              </Button>
            </div>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 glass-effect border-white/20 text-white hover:border-vibeflow-blue/50 hover:bg-vibeflow-blue/10 hover:scale-105 transition-all duration-300 group">
                <SortAsc className="w-4 h-4 mr-2 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-effect border-white/20 animate-in slide-in-from-top-2 duration-200">
                <SelectItem value="name" className="hover:bg-white/10 transition-colors duration-200">Name</SelectItem>
                <SelectItem value="deadline" className="hover:bg-white/10 transition-colors duration-200">Deadline</SelectItem>
                <SelectItem value="progress" className="hover:bg-white/10 transition-colors duration-200">Progress</SelectItem>
                <SelectItem value="priority" className="hover:bg-white/10 transition-colors duration-200">Priority</SelectItem>
                <SelectItem value="created" className="hover:bg-white/10 transition-colors duration-200">Created Date</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 glass-effect border-white/20 text-white hover:border-vibeflow-purple/50 hover:bg-vibeflow-purple/10 hover:scale-105 transition-all duration-300 group">
                <Filter className="w-4 h-4 mr-2 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-effect border-white/20 animate-in slide-in-from-top-2 duration-200">
                <SelectItem value="all" className="hover:bg-white/10 transition-colors duration-200">All Status</SelectItem>
                <SelectItem value="active" className="hover:bg-white/10 transition-colors duration-200">Active</SelectItem>
                <SelectItem value="completed" className="hover:bg-white/10 transition-colors duration-200">Completed</SelectItem>
                <SelectItem value="review" className="hover:bg-white/10 transition-colors duration-200">In Review</SelectItem>
                <SelectItem value="paused" className="hover:bg-white/10 transition-colors duration-200">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>        {/* Projects Grid/List */}
        {filteredProjects.length > 0 && (
          <div className="mb-4 flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllProjects}
              className="glass-effect border-white/20 text-white hover:border-vibeflow-violet/50 hover:bg-vibeflow-violet/10 hover:scale-105 transition-all duration-300 group"
            >
              <Checkbox 
                checked={selectedProjects.length === filteredProjects.length}
                className="mr-2 group-hover:scale-110 transition-all duration-300"
              />
              {selectedProjects.length === filteredProjects.length ? 'Deselect All' : 'Select All'}
            </Button>
            <span className="text-sm text-white/60 animate-in fade-in duration-500 delay-200">
              {selectedProjects.length} of {filteredProjects.length} selected
            </span>
          </div>
        )}

        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProjects.map((project, index) => (            <Card 
              key={project.id} 
              className={`glass-effect border-white/20 hover:border-vibeflow-violet/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-vibeflow-violet/20 hover:-translate-y-1 group animate-in slide-in-from-bottom-4 duration-300 cursor-pointer relative overflow-hidden ${
                selectedProjects.includes(project.id) ? 'ring-2 ring-vibeflow-violet/50 scale-105' : ''
              } ${viewMode === 'list' ? 'flex items-center p-4' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {viewMode === 'grid' ? (
                <>                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={() => toggleProjectSelection(project.id)}
                          className="mt-1 hover:scale-110 transition-all duration-300"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-white text-lg truncate group-hover:text-vibeflow-violet transition-colors duration-300">{project.name}</CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleStar(project.id)}
                              className="p-1 h-auto hover:scale-125 transition-all duration-300 group/star"
                            >
                              <Star 
                                className={`w-4 h-4 transition-all duration-300 group-hover/star:scale-110 ${
                                  project.starred 
                                    ? 'fill-yellow-400 text-yellow-400 group-hover/star:animate-pulse' 
                                    : 'text-white/50 group-hover/star:text-yellow-400'
                                }`} 
                              />
                            </Button>
                            {isOverdue(project.deadline, project.status) && (
                              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                            )}
                          </div>
                          <p className="text-sm text-white/60 line-clamp-2 group-hover:text-white/80 transition-colors duration-300">{project.description}</p>
                        </div>
                      </div>                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:scale-110 hover:rotate-3 transition-all duration-300 group/menu">
                            <MoreVertical className="w-4 h-4 group-hover/menu:scale-110 transition-all duration-300" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass-effect border-white/20 animate-in slide-in-from-top-2 duration-200">
                          <DropdownMenuItem onClick={() => handleEditProject(project)} className="group/item">
                            <Edit3 className="w-4 h-4 mr-2 group-hover/item:scale-110 group-hover/item:text-vibeflow-blue transition-all duration-300" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateProjectStatus(project.id, 'active')} className="group/item">
                            <Play className="w-4 h-4 mr-2 group-hover/item:scale-110 group-hover/item:text-vibeflow-emerald transition-all duration-300" />
                            Set Active
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateProjectStatus(project.id, 'paused')} className="group/item">
                            <Pause className="w-4 h-4 mr-2 group-hover/item:scale-110 group-hover/item:text-orange-400 transition-all duration-300" />
                            Pause Project
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateProjectStatus(project.id, 'completed')} className="group/item">
                            <CheckCircle2 className="w-4 h-4 mr-2 group-hover/item:scale-110 group-hover/item:text-vibeflow-violet transition-all duration-300" />
                            Mark Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateProjectStatus(project.id, 'review')} className="group/item">
                            <Eye className="w-4 h-4 mr-2 group-hover/item:scale-110 group-hover/item:text-vibeflow-blue transition-all duration-300" />
                            Set for Review
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleStar(project.id)} className="group/item">
                            <Star className="w-4 h-4 mr-2 group-hover/item:scale-110 group-hover/item:text-yellow-400 transition-all duration-300" />
                            {project.starred ? 'Remove Star' : 'Add Star'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="group/item">
                            <Copy className="w-4 h-4 mr-2 group-hover/item:scale-110 group-hover/item:text-vibeflow-purple transition-all duration-300" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="group/item">
                            <Download className="w-4 h-4 mr-2 group-hover/item:scale-110 group-hover/item:text-vibeflow-emerald transition-all duration-300" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()}
                                className="text-red-400 focus:text-red-400"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Project
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass-effect border-white/20">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Delete Project</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/60">
                                  Are you sure you want to delete "{project.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="glass-effect border-white/20 text-white">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                    <CardContent className="space-y-4">                    {/* Enhanced Status and Priority with Floating Effects */}
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(project.status)} hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 animate-pulse`}>
                        {project.status}
                      </Badge>
                      <Badge variant="outline" className={`${getPriorityColor(project.priority)} hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-lg`}>
                        {project.priority}
                      </Badge>
                      {project.starred && (
                        <div className="animate-bounce">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        </div>
                      )}
                    </div>{/* Enhanced Progress with Liquid Fill Effect */}
                    <div className="group/progress">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/60 group-hover/progress:text-white/80 transition-colors duration-300">Progress</span>
                        <span className="text-sm text-white group-hover/progress:text-vibeflow-violet transition-colors duration-300">{project.progress}%</span>
                      </div>
                      <div className="relative overflow-hidden">
                        <Progress value={project.progress} className="h-2 group-hover/progress:h-3 transition-all duration-300" />
                        {/* Liquid fill effect */}
                        <div 
                          className={`absolute top-0 left-0 h-full bg-gradient-to-r from-vibeflow-violet/20 to-vibeflow-blue/20 rounded-full transition-all duration-500 group-hover/progress:from-vibeflow-violet/40 group-hover/progress:to-vibeflow-blue/40`}
                          data-progress={project.progress}
                        ></div>
                        {/* Animated shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/progress:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-vibeflow-violet/0 group-hover/progress:bg-vibeflow-violet/10 rounded-full transition-all duration-300 group-hover/progress:shadow-lg group-hover/progress:shadow-vibeflow-violet/20"></div>
                      </div>
                    </div>

                    {/* Tasks and Deadline */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="group/tasks hover:scale-105 transition-all duration-300 p-2 rounded-lg hover:bg-white/5">
                        <p className="text-white/60 group-hover/tasks:text-white/80 transition-colors duration-300">Tasks</p>
                        <p className="text-white font-medium group-hover/tasks:text-vibeflow-emerald transition-colors duration-300">
                          {project.tasks.completed}/{project.tasks.total}
                        </p>
                      </div>
                      <div className="group/deadline hover:scale-105 transition-all duration-300 p-2 rounded-lg hover:bg-white/5">
                        <p className="text-white/60 group-hover/deadline:text-white/80 transition-colors duration-300">Deadline</p>
                        <p className={`font-medium transition-colors duration-300 ${
                          isOverdue(project.deadline, project.status) 
                            ? 'text-red-400 group-hover/deadline:animate-pulse' 
                            : 'text-white group-hover/deadline:text-vibeflow-blue'
                        }`}>
                          {new Date(project.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Team */}
                    <div className="group/team">
                      <p className="text-sm text-white/60 mb-2 group-hover/team:text-white/80 transition-colors duration-300">Team</p>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">                          {project.team.slice(0, 3).map((member, index) => (
                            <div 
                              key={index}
                              className={`w-8 h-8 bg-vibeflow-gradient rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 border-gray-800 hover:scale-110 hover:z-10 transition-all duration-300 hover:shadow-lg hover:shadow-vibeflow-violet/30 ${
                                index === 0 ? 'animate-in slide-in-from-left-2' : 
                                index === 1 ? 'animate-in slide-in-from-left-2 duration-300 delay-75' :
                                'animate-in slide-in-from-left-2 duration-300 delay-150'
                              }`}
                              title={member}
                            >
                              {member.split(' ').map(n => n[0]).join('')}
                            </div>
                          ))}
                          {project.team.length > 3 && (
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs text-white border-2 border-gray-800 hover:scale-110 hover:bg-white/30 transition-all duration-300">
                              +{project.team.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-white/60 group-hover/team:text-white/80 transition-colors duration-300">
                          {project.team.length} member{project.team.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>                    {/* Enhanced Action Buttons with Ripple Effects */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 glass-effect border-white/20 text-white hover:border-vibeflow-violet/50 hover:bg-vibeflow-violet/10 hover:scale-105 hover:shadow-lg hover:shadow-vibeflow-violet/20 transition-all duration-300 group/btn relative overflow-hidden"
                        onClick={() => handleEditProject(project)}
                      >
                        <span className="group-hover/btn:translate-x-0.5 transition-all duration-300 relative z-10">View Details</span>
                        {/* Ripple effect background */}
                        <div className="absolute inset-0 bg-vibeflow-violet/0 group-hover/btn:bg-vibeflow-violet/5 transition-all duration-300"></div>
                      </Button>
                      <Button variant="outline" size="sm" className="glass-effect border-white/20 text-white hover:border-vibeflow-blue/50 hover:bg-vibeflow-blue/10 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-vibeflow-blue/20 transition-all duration-300 group/cal relative overflow-hidden">
                        <Calendar className="w-4 h-4 group-hover/cal:scale-110 transition-all duration-300" />
                        <div className="absolute inset-0 bg-vibeflow-blue/0 group-hover/cal:bg-vibeflow-blue/10 transition-all duration-300"></div>
                      </Button>
                      <Button variant="outline" size="sm" className="glass-effect border-white/20 text-white hover:border-vibeflow-emerald/50 hover:bg-vibeflow-emerald/10 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-vibeflow-emerald/20 transition-all duration-300 group/users relative overflow-hidden">
                        <Users className="w-4 h-4 group-hover/users:scale-110 transition-all duration-300" />
                        <div className="absolute inset-0 bg-vibeflow-emerald/0 group-hover/users:bg-vibeflow-emerald/10 transition-all duration-300"></div>
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (                // Enhanced List View with Better Animations
                <>
                  <div className="flex items-center gap-4 flex-1 group-hover:translate-x-1 transition-all duration-300">
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => toggleProjectSelection(project.id)}
                      className="hover:scale-110 transition-all duration-300"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-vibeflow-gradient rounded-lg flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-vibeflow-violet/20">
                        <Folder className="w-6 h-6 text-white group-hover:scale-110 transition-all duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white truncate hover:text-vibeflow-violet transition-colors duration-300">{project.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStar(project.id)}
                            className="p-1 h-auto hover:scale-125 transition-all duration-300"
                          >
                            <Star 
                              className={`w-4 h-4 transition-all duration-300 ${project.starred ? 'fill-yellow-400 text-yellow-400 animate-pulse' : 'text-white/50 hover:text-yellow-400'}`} 
                            />
                          </Button>
                          {isOverdue(project.deadline, project.status) && (
                            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-white/60 truncate hover:text-white/80 transition-colors duration-300">{project.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center group/status">
                        <p className="text-xs text-white/60 group-hover/status:text-white/80 transition-colors duration-300">Status</p>
                        <Badge className={`${getStatusColor(project.status)} text-xs hover:scale-105 hover:-translate-y-0.5 transition-all duration-300`}>
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div className="text-center group/priority">
                        <p className="text-xs text-white/60 group-hover/priority:text-white/80 transition-colors duration-300">Priority</p>
                        <Badge variant="outline" className={`${getPriorityColor(project.priority)} text-xs hover:scale-105 hover:-translate-y-0.5 transition-all duration-300`}>
                          {project.priority}
                        </Badge>
                      </div>
                        <div className="text-center group/progress">
                        <p className="text-xs text-white/60 group-hover/progress:text-white/80 transition-colors duration-300">Progress</p>
                        <div className="w-20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-white group-hover/progress:text-vibeflow-violet transition-colors duration-300">{project.progress}%</span>
                          </div>
                          <div className="relative">
                            <Progress value={project.progress} className="h-1 hover:h-2 transition-all duration-300" />
                            <div className="absolute inset-0 bg-vibeflow-violet/0 group-hover/progress:bg-vibeflow-violet/10 rounded-full transition-all duration-300"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center group/team">
                        <p className="text-xs text-white/60 group-hover/team:text-white/80 transition-colors duration-300">Team</p>                        <div className="flex -space-x-1">
                          {project.team.slice(0, 2).map((member, index) => (
                            <div 
                              key={index}
                              className="w-6 h-6 bg-vibeflow-gradient rounded-full flex items-center justify-center text-xs font-semibold text-white border border-gray-800 hover:scale-110 hover:z-10 transition-all duration-300 hover:shadow-lg hover:shadow-vibeflow-violet/30"
                              title={member}
                            >
                              {member.split(' ').map(n => n[0]).join('')}
                            </div>
                          ))}
                          {project.team.length > 2 && (
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs text-white border border-gray-800 hover:scale-110 hover:bg-white/30 transition-all duration-300">
                              +{project.team.length - 2}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center group/deadline">
                        <p className="text-xs text-white/60 group-hover/deadline:text-white/80 transition-colors duration-300">Deadline</p>
                        <p className={`text-xs font-medium transition-colors duration-300 ${isOverdue(project.deadline, project.status) ? 'text-red-400 group-hover/deadline:animate-pulse' : 'text-white group-hover/deadline:text-vibeflow-blue'}`}>
                          {new Date(project.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                      <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:scale-110 hover:rotate-3 transition-all duration-300 group/menu">
                          <MoreVertical className="w-4 h-4 group-hover/menu:scale-110 transition-all duration-300" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass-effect border-white/20 animate-in slide-in-from-top-2 duration-200">
                        <DropdownMenuItem onClick={() => handleEditProject(project)} className="group/item hover:bg-white/10 transition-colors duration-200">
                          <Edit3 className="w-4 h-4 mr-2 group-hover/item:scale-110 group-hover/item:text-vibeflow-blue transition-all duration-300" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateProjectStatus(project.id, 'active')} className="group/item hover:bg-white/10 transition-colors duration-200">
                          <Play className="w-4 h-4 mr-2 group-hover/item:scale-110 group-hover/item:text-vibeflow-emerald transition-all duration-300" />
                          Set Active
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateProjectStatus(project.id, 'paused')} className="group/item hover:bg-white/10 transition-colors duration-200">
                          <Pause className="w-4 h-4 mr-2 group-hover/item:scale-110 group-hover/item:text-orange-400 transition-all duration-300" />
                          Pause Project
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateProjectStatus(project.id, 'completed')} className="group/item hover:bg-white/10 transition-colors duration-200">
                          <CheckCircle2 className="w-4 h-4 mr-2 group-hover/item:scale-110 group-hover/item:text-vibeflow-violet transition-all duration-300" />
                          Mark Complete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-400 focus:text-red-400"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Project
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-effect border-white/20">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Delete Project</AlertDialogTitle>
                              <AlertDialogDescription className="text-white/60">
                                Are you sure you want to delete "{project.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="glass-effect border-white/20 text-white">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteProject(project.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>        {filteredProjects.length === 0 && (
          <div className="text-center py-12 animate-in fade-in duration-500 relative">
            {/* Floating particle effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-1/4 w-1 h-1 bg-vibeflow-violet rounded-full animate-ping opacity-60"></div>
              <div className="absolute top-20 right-1/3 w-2 h-2 bg-vibeflow-blue rounded-full animate-pulse opacity-40"></div>
              <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-vibeflow-emerald rounded-full animate-bounce opacity-50"></div>
              <div className="absolute top-32 right-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-30"></div>
            </div>
            
            <div className="animate-in zoom-in duration-300 delay-100 relative">
              <div className="relative group">
                <Folder className="w-16 h-16 text-white/30 mx-auto mb-4 hover:text-white/50 hover:scale-110 transition-all duration-300 group-hover:rotate-6" />
                {/* Floating ring effect */}
                <div className="absolute inset-0 w-16 h-16 mx-auto border-2 border-vibeflow-violet/20 rounded-full group-hover:border-vibeflow-violet/40 group-hover:scale-125 transition-all duration-500"></div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2 animate-in slide-in-from-bottom-2 duration-300 delay-200 hover:text-vibeflow-violet transition-colors duration-300">No projects found</h3>            <p className="text-white/60 mb-6 animate-in slide-in-from-bottom-2 duration-300 delay-300 hover:text-white/80 transition-colors">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first project to get started.'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <div className="animate-in slide-in-from-bottom-2 duration-300 delay-500">
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)} 
                  className="bg-vibeflow-gradient hover:opacity-90 hover:scale-105 hover:shadow-lg hover:shadow-vibeflow-violet/30 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden"
                >
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 group-hover:scale-110 transition-all duration-300" />
                  <span className="group-hover:translate-x-0.5 transition-all duration-300">Create Project</span>
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-vibeflow-violet/0 group-hover:bg-vibeflow-violet/10 transition-all duration-300"></div>
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
