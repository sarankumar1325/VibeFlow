import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectService, BackendProject, CreateProjectData, UpdateProjectData, ProjectFilters } from '@/services/projectService';
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
  // Additional backend fields (mapped from BackendProject)
  _id?: string;
  techStack?: string[];
  repository?: string;
  liveUrl?: string;
  tags?: string[];
}

interface ProjectContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: number, updates: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  getProjectStats: () => {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    pausedProjects: number;
    reviewProjects: number;
    totalTasks: number;
    completedTasks: number;
    overallProgress: number;
    teamMembers: number;
    highPriorityProjects: number;
    overdueTasks: number;
  };
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Initial mock data
const initialProjects: Project[] = [
  {
    id: 1,
    name: "E-commerce Platform Redesign",
    description: "Complete overhaul of the customer shopping experience with modern UI/UX patterns",
    status: "active",
    priority: "high",
    progress: 68,
    deadline: "2024-01-15",
    team: ["Sarah Chen", "Mike Johnson", "Emily Davis"],
    tasks: { total: 24, completed: 16 },
    createdAt: "2023-11-01",
    starred: true
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Native iOS and Android application for customer engagement",
    status: "active",
    priority: "high",
    progress: 43,
    deadline: "2024-02-28",
    team: ["Alex Rodriguez", "Lisa Wang", "David Kim"],
    tasks: { total: 31, completed: 13 },
    createdAt: "2023-10-15",
    starred: false
  },
  {
    id: 3,
    name: "Marketing Automation",
    description: "Implement automated email campaigns and customer segmentation",
    status: "review",
    priority: "medium",
    progress: 89,
    deadline: "2023-12-20",
    team: ["Jessica Brown", "Tom Wilson"],
    tasks: { total: 18, completed: 16 },
    createdAt: "2023-09-20",
    starred: true
  },
  {
    id: 4,
    name: "Data Analytics Dashboard",
    description: "Real-time business intelligence and reporting system",
    status: "completed",
    priority: "medium",
    progress: 100,
    deadline: "2023-11-30",
    team: ["Chris Taylor", "Anna Lee", "Mark Davis"],
    tasks: { total: 22, completed: 22 },
    createdAt: "2023-08-10",
    starred: false
  },
  {
    id: 5,
    name: "Security Audit",
    description: "Comprehensive security assessment and vulnerability testing",
    status: "paused",
    priority: "high",
    progress: 25,
    deadline: "2024-01-31",
    team: ["Security Team"],
    tasks: { total: 12, completed: 3 },
    createdAt: "2023-11-15",
    starred: false
  },
  {
    id: 6,
    name: "Documentation Overhaul",
    description: "Update and modernize all technical documentation",
    status: "active",
    priority: "low",
    progress: 15,
    deadline: "2024-03-15",
    team: ["Technical Writers"],
    tasks: { total: 8, completed: 1 },
    createdAt: "2023-11-20",
    starred: false
  }
];

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    // Try to load from localStorage first
    const stored = localStorage.getItem('vibeflow-projects');
    return stored ? JSON.parse(stored) : initialProjects;
  });

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem('vibeflow-projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: Math.max(...projects.map(p => p.id), 0) + 1,
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: number, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...updates } : project
    ));
  };

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };
  const getProjectStats = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const pausedProjects = projects.filter(p => p.status === 'paused').length;
    const reviewProjects = projects.filter(p => p.status === 'review').length;
    
    const totalTasks = projects.reduce((sum, p) => sum + p.tasks.total, 0);
    const completedTasks = projects.reduce((sum, p) => sum + p.tasks.completed, 0);
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Get unique team members
    const allTeamMembers = projects.flatMap(p => p.team);
    const uniqueTeamMembers = [...new Set(allTeamMembers)];
    const teamMembers = uniqueTeamMembers.length;
    
    const highPriorityProjects = projects.filter(p => p.priority === 'high').length;
    
    // Calculate overdue tasks (simplified - just counting active projects past deadline)
    const today = new Date();
    const overdueTasks = projects.filter(p => 
      p.status === 'active' && new Date(p.deadline) < today
    ).length;

    // Calculate average completion time (simplified estimation)
    const completedProjectsData = projects.filter(p => p.status === 'completed');
    const avgCompletionTime = completedProjectsData.length > 0 ? 
      Math.round(completedProjectsData.reduce((sum, p) => {
        const created = new Date(p.createdAt);
        const deadline = new Date(p.deadline);
        const daysDiff = Math.max(1, Math.ceil((deadline.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
        return sum + daysDiff;
      }, 0) / completedProjectsData.length) : 0;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      pausedProjects,
      reviewProjects,
      totalTasks,
      completedTasks,
      overallProgress,
      teamMembers,
      highPriorityProjects,
      overdueTasks,
      avgCompletionTime
    };
  };

  const contextValue: ProjectContextType = {
    projects,
    setProjects,
    addProject,
    updateProject,
    deleteProject,
    getProjectStats
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
