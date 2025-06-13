import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'review' | 'paused';
  priority: 'high' | 'medium' | 'low';
  progress: number;
  deadline: string;
  team: string[];
  tasks: { total: number; completed: number };
  createdAt: string;
  starred: boolean;
}

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  addProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'starred'>) => Promise<boolean>;
  updateProject: (id: number, updates: Partial<Project>) => Promise<boolean>;
  deleteProject: (id: number) => Promise<boolean>;
  getProjectStats: () => {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    overDueProjects: number;
  };
  refreshProjects: () => Promise<void>;
  starProject: (id: number) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Sample mock data
const mockProjects: Project[] = [
  {
    id: 1,
    name: "VibeFlow AI Tasks",
    description: "AI-powered project management system",
    status: 'active',
    priority: 'high',
    progress: 75,
    deadline: '2025-07-01',
    team: ['Alice', 'Bob', 'Charlie'],
    tasks: { total: 12, completed: 9 },
    createdAt: '2025-06-01',
    starred: true
  },
  {
    id: 2,
    name: "React Dashboard",
    description: "Modern React dashboard with analytics",
    status: 'review',
    priority: 'medium',
    progress: 60,
    deadline: '2025-06-30',
    team: ['Diana', 'Eve'],
    tasks: { total: 8, completed: 5 },
    createdAt: '2025-05-15',
    starred: false
  }
];

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    // Try to load from localStorage first
    const stored = localStorage.getItem('vibeflow-projects');
    return stored ? JSON.parse(stored) : mockProjects;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem('vibeflow-projects', JSON.stringify(projects));
  }, [projects]);

  const refreshProjects = async () => {
    // For localStorage implementation, just refresh from storage
    try {
      setIsLoading(true);
      const stored = localStorage.getItem('vibeflow-projects');
      if (stored) {
        setProjects(JSON.parse(stored));
      }
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'starred'>): Promise<boolean> => {
    try {
      const newProject: Project = {
        ...projectData,
        id: Math.max(...projects.map(p => p.id), 0) + 1,
        createdAt: new Date().toISOString().split('T')[0],
        starred: false
      };
      
      setProjects(prev => [...prev, newProject]);
      
      toast({
        title: "Project Created",
        description: `${projectData.name} has been created successfully.`,
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProject = async (id: number, updates: Partial<Project>): Promise<boolean> => {
    try {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      
      const project = projects.find(p => p.id === id);
      toast({
        title: "Project Updated",
        description: `${project?.name || 'Project'} has been updated successfully.`,
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProject = async (id: number): Promise<boolean> => {
    try {
      const project = projects.find(p => p.id === id);
      setProjects(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Project Deleted",
        description: `${project?.name || 'Project'} has been deleted successfully.`,
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const starProject = (id: number) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, starred: !p.starred } : p
    ));
  };
  const getProjectStats = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    
    // Calculate overdue projects
    const today = new Date();
    const overDueProjects = projects.filter(p => 
      p.status === 'active' && new Date(p.deadline) < today
    ).length;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      overDueProjects
    };
  };

  const contextValue: ProjectContextType = {
    projects,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    getProjectStats,
    refreshProjects,
    starProject
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
