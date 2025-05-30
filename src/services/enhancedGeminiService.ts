
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: 'human' | 'ai' | 'team';
  complexity: number;
  timeEstimate: string;
  phase: string;
  risks: string[];
  acceptanceCriteria: string[];
  dependencies: string[];
  status: 'todo' | 'in-progress' | 'done';
}

export interface AIProcessingResult {
  tasks: Task[];
  summary: string;
  metadata: {
    totalTasks: number;
    phases: string[];
    estimatedDuration: string;
    complexityScore: number;
  };
  success: boolean;
  error?: string;
}

export class EnhancedGeminiService {
  private model: ChatGoogleGenerativeAI;

  constructor(apiKey: string) {
    this.model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash-exp",
      apiKey: apiKey,
      temperature: 0.3,
      maxOutputTokens: 8192,
    });
  }

  async processDocument(
    documentText: string, 
    fileName: string, 
    projectContext?: string
  ): Promise<AIProcessingResult> {
    try {
      console.log('🤖 Starting AI processing with Gemini 2.0 Flash...');
      
      const systemPrompt = this.createSystemPrompt(projectContext);
      const userPrompt = this.createUserPrompt(documentText, fileName);

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt)
      ];

      console.log('📤 Sending request to Gemini...');
      const response = await this.model.invoke(messages);
      console.log('📥 Received response from Gemini');

      const result = this.parseAIResponse(response.content as string);
      
      if (result.success) {
        console.log(`✅ Successfully generated ${result.tasks.length} tasks`);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ AI processing failed:', error);
      return {
        tasks: [],
        summary: '',
        metadata: {
          totalTasks: 0,
          phases: [],
          estimatedDuration: '0',
          complexityScore: 0,
        },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private createSystemPrompt(projectContext?: string): string {
    return `You are VibeFlow AI, an expert project intelligence system specializing in transforming complex documents into structured, actionable tasks.

CORE CAPABILITIES:
- Advanced document analysis and interpretation
- Intelligent task breakdown and prioritization
- Resource optimization and risk assessment
- Context-aware project planning

${projectContext ? `PROJECT CONTEXT:\n${projectContext}\n` : ''}

OUTPUT FORMAT: You must respond with a valid JSON object following this exact structure:

{
  "summary": "Brief overview of the document and generated tasks",
  "tasks": [
    {
      "id": "unique-task-id",
      "title": "Clear, actionable task title",
      "description": "Detailed task description with context",
      "priority": "low|medium|high|critical",
      "assignee": "human|ai|team",
      "complexity": 1-10,
      "timeEstimate": "X hours/days/weeks",
      "phase": "Phase name",
      "risks": ["potential risk 1", "potential risk 2"],
      "acceptanceCriteria": ["criteria 1", "criteria 2"],
      "dependencies": ["dependency 1", "dependency 2"],
      "status": "todo"
    }
  ],
  "metadata": {
    "totalTasks": number,
    "phases": ["phase1", "phase2"],
    "estimatedDuration": "total time estimate",
    "complexityScore": 1-10
  }
}

TASK GENERATION RULES:
1. Break down complex requirements into manageable, specific tasks
2. Assign realistic priorities based on business impact and dependencies
3. Estimate complexity (1-10) and time requirements accurately
4. Identify potential risks and mitigation strategies
5. Create clear acceptance criteria for each task
6. Organize tasks into logical phases/milestones
7. Consider both human and AI capabilities for optimal assignment

RESPOND ONLY WITH THE JSON OBJECT. NO ADDITIONAL TEXT.`;
  }

  private createUserPrompt(documentText: string, fileName: string): string {
    return `Analyze the following document and generate intelligent tasks:

DOCUMENT: ${fileName}
CONTENT:
${documentText}

Transform this document into a comprehensive task breakdown following the specified JSON format.`;
  }

  private parseAIResponse(content: string): AIProcessingResult {
    try {
      // Clean the response to ensure it's valid JSON
      const cleanContent = content.trim().replace(/```json\n?|\n?```/g, '');
      
      const parsed = JSON.parse(cleanContent);
      
      // Validate the structure
      if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
        throw new Error('Invalid response structure: missing tasks array');
      }

      // Ensure each task has required fields
      const validatedTasks: Task[] = parsed.tasks.map((task: any, index: number) => ({
        id: task.id || `task-${index + 1}`,
        title: task.title || 'Untitled Task',
        description: task.description || '',
        priority: this.validatePriority(task.priority),
        assignee: this.validateAssignee(task.assignee),
        complexity: Math.max(1, Math.min(10, task.complexity || 5)),
        timeEstimate: task.timeEstimate || '1 day',
        phase: task.phase || 'Implementation',
        risks: Array.isArray(task.risks) ? task.risks : [],
        acceptanceCriteria: Array.isArray(task.acceptanceCriteria) ? task.acceptanceCriteria : [],
        dependencies: Array.isArray(task.dependencies) ? task.dependencies : [],
        status: 'todo' as const,
      }));

      return {
        tasks: validatedTasks,
        summary: parsed.summary || 'Task breakdown generated successfully',
        metadata: {
          totalTasks: validatedTasks.length,
          phases: parsed.metadata?.phases || ['Implementation'],
          estimatedDuration: parsed.metadata?.estimatedDuration || 'TBD',
          complexityScore: parsed.metadata?.complexityScore || 5,
        },
        success: true,
      };
      
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        tasks: [],
        summary: '',
        metadata: {
          totalTasks: 0,
          phases: [],
          estimatedDuration: '0',
          complexityScore: 0,
        },
        success: false,
        error: 'Failed to parse AI response',
      };
    }
  }

  private validatePriority(priority: any): 'low' | 'medium' | 'high' | 'critical' {
    const validPriorities = ['low', 'medium', 'high', 'critical'];
    return validPriorities.includes(priority) ? priority : 'medium';
  }

  private validateAssignee(assignee: any): 'human' | 'ai' | 'team' {
    const validAssignees = ['human', 'ai', 'team'];
    return validAssignees.includes(assignee) ? assignee : 'human';
  }
}
