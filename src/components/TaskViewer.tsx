
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Users, 
  AlertTriangle, 
  Download, 
  Copy,
  Brain,
  User,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AITask, AIProcessingResult } from '@/services/enhancedGeminiService';

interface TaskViewerProps {
  result: AIProcessingResult;
}

const TaskViewer: React.FC<TaskViewerProps> = ({ result }) => {
  const [tasks, setTasks] = useState<AITask[]>(result.tasks);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { toast } = useToast();

  const completedTasks = tasks.filter(task => task.markdown.includes('- [x]')).length;
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'simple': return '🟢';
      case 'moderate': return '🟡';
      case 'complex': return '🟠';
      case 'expert': return '🔴';
      default: return '⚪';
    }
  };

  const getAssigneeIcon = (assigneeType: string) => {
    switch (assigneeType) {
      case 'human': return <User className="w-4 h-4" />;
      case 'ai': return <Brain className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedMarkdown = task.markdown.includes('- [x]') 
          ? task.markdown.replace(/- \[x\]/g, '- [ ]')
          : task.markdown.replace(/- \[ \]/g, '- [x]');
        return { ...task, markdown: updatedMarkdown };
      }
      return task;
    }));
  };

  const startEditing = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(taskId);
      setEditContent(task.markdown);
    }
  };

  const saveEdit = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, markdown: editContent }
        : task
    ));
    setEditingTask(null);
    setEditContent('');
    toast({
      title: "Task Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const exportTasks = () => {
    const exportContent = tasks.map(task => task.markdown).join('\n\n---\n\n');
    const blob = new Blob([exportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vibeflow-tasks.md';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Tasks Exported",
      description: "Your tasks have been downloaded as a markdown file.",
    });
  };

  const copyToClipboard = () => {
    const exportContent = tasks.map(task => task.markdown).join('\n\n---\n\n');
    navigator.clipboard.writeText(exportContent);
    toast({
      title: "Copied to Clipboard",
      description: "All tasks have been copied to your clipboard.",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <Card className="glass-effect">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold gradient-text">
                AI-Generated Task Breakdown
              </h2>
              <p className="text-white/70">
                {result.summary || 'Intelligent task analysis completed successfully'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={copyToClipboard} variant="outline" className="glass-effect">
                <Copy className="w-4 h-4 mr-2" />
                Copy All
              </Button>
              <Button onClick={exportTasks} className="bg-vibeflow-gradient hover:opacity-90">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-effect p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vibeflow-blue/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-vibeflow-blue" />
            </div>
            <div>
              <p className="text-sm text-white/60">Total Tasks</p>
              <p className="text-xl font-bold text-white">{tasks.length}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vibeflow-emerald/20 rounded-lg flex items-center justify-center">
              <Circle className="w-5 h-5 text-vibeflow-emerald" />
            </div>
            <div>
              <p className="text-sm text-white/60">Completed</p>
              <p className="text-xl font-bold text-white">{completedTasks}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vibeflow-violet/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-vibeflow-violet" />
            </div>
            <div>
              <p className="text-sm text-white/60">Est. Hours</p>
              <p className="text-xl font-bold text-white">{result.totalEstimatedHours}h</p>
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vibeflow-purple/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-vibeflow-purple" />
            </div>
            <div>
              <p className="text-sm text-white/60">Progress</p>
              <p className="text-xl font-bold text-white">{Math.round(progressPercentage)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="glass-effect p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Project Progress</span>
            <span className="text-white">{completedTasks} of {tasks.length} tasks</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <Card key={task.id} className="glass-effect transition-all duration-300 hover:border-vibeflow-violet/30">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="mt-1 transition-colors duration-200"
                >
                  {task.markdown.includes('- [x]') ? (
                    <CheckCircle2 className="w-6 h-6 text-vibeflow-emerald" />
                  ) : (
                    <Circle className="w-6 h-6 text-white/40 hover:text-vibeflow-violet" />
                  )}
                </button>

                <div className="flex-1 space-y-4">
                  {/* Task Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">
                      {task.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={`${getPriorityColor(task.metadata.priority)} text-white text-xs`}>
                        {task.metadata.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                        {getComplexityIcon(task.metadata.complexity)} {task.metadata.complexity}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-white/20 text-white/70 flex items-center gap-1">
                        {getAssigneeIcon(task.metadata.assigneeType)}
                        {task.metadata.assigneeType}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                        {task.metadata.estimatedHours}h
                      </Badge>
                    </div>
                  </div>

                  {/* Task Content */}
                  {editingTask === task.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[200px] bg-white/5 border-white/20 text-white"
                        placeholder="Edit task content..."
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => saveEdit(task.id)}
                          size="sm"
                          className="bg-vibeflow-emerald hover:bg-vibeflow-emerald/80"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingTask(null)}
                          size="sm"
                          variant="outline"
                          className="border-white/20"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-white/80 leading-relaxed">
                        {task.description}
                      </p>
                      
                      {task.acceptanceCriteria.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-white/90 mb-2">Acceptance Criteria:</h4>
                          <ul className="space-y-1 text-sm text-white/70">
                            {task.acceptanceCriteria.map((criteria, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-vibeflow-violet mt-1">•</span>
                                {criteria}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {task.metadata.skills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-white/90 mb-2">Required Skills:</h4>
                          <div className="flex flex-wrap gap-2">
                            {task.metadata.skills.map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-vibeflow-blue/30 text-vibeflow-blue">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <div className="text-xs text-white/50">
                          Phase: {task.metadata.phase} • Risk: {task.metadata.riskLevel}
                        </div>
                        <Button
                          onClick={() => startEditing(task.id)}
                          size="sm"
                          variant="ghost"
                          className="text-vibeflow-violet hover:bg-vibeflow-violet/10"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Risk Assessment */}
      {result.riskAssessment && (
        <Card className="glass-effect border-orange-500/20">
          <div className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Risk Assessment</h3>
                <p className="text-white/70 leading-relaxed">{result.riskAssessment}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <Card className="glass-effect border-vibeflow-emerald/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-vibeflow-emerald" />
              AI Recommendations
            </h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 text-white/70">
                  <span className="text-vibeflow-emerald mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TaskViewer;
