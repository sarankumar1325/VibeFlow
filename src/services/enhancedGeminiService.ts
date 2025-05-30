
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export interface TaskMetadata {
  priority: 'low' | 'medium' | 'high' | 'critical';
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  estimatedHours: number;
  assigneeType: 'human' | 'ai' | 'either';
  skills: string[];
  dependencies: string[];
  riskLevel: 'low' | 'medium' | 'high';
  phase: string;
}

export interface AITask {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  metadata: TaskMetadata;
  markdown: string;
}

export interface AIProcessingResult {
  tasks: AITask[];
  summary: string;
  totalEstimatedHours: number;
  riskAssessment: string;
  recommendations: string[];
  success: boolean;
  error?: string;
}

export class EnhancedGeminiService {
  private model: ChatGoogleGenerativeAI;
  
  constructor(apiKey: string) {
    this.model = new ChatGoogleGenerativeAI({
      apiKey,
      modelName: 'gemini-1.5-pro',
      temperature: 0.7,
      maxOutputTokens: 8192,
    });
  }

  private generateSystemPrompt(): string {
    return `You are VibeFlow, an elite AI project intelligence platform designed to transform complex project documents into structured, actionable tasks. You possess deep understanding of software development, project management, and technical architecture.

CORE CAPABILITIES:
- Analyze project documents with sophisticated context awareness
- Generate high-quality, executable tasks with rich metadata
- Understand technical requirements, dependencies, and risk factors
- Optimize task assignments between human and AI capabilities
- Provide strategic project insights and recommendations

TASK GENERATION REQUIREMENTS:
1. Create detailed, actionable tasks with clear titles and descriptions
2. Include comprehensive acceptance criteria (3-5 criteria per task)
3. Assign realistic priority levels (low/medium/high/critical)
4. Estimate complexity (simple/moderate/complex/expert) and hours accurately
5. Identify required skills and technical dependencies
6. Assess risk levels and suggest mitigation strategies
7. Organize tasks into logical execution phases
8. Determine optimal assignee type (human/ai/either)

METADATA STRUCTURE:
- Priority: Based on business impact and blocking dependencies
- Complexity: Technical difficulty and skill requirements
- EstimatedHours: Realistic time estimates for completion
- AssigneeType: Human for creative/strategic work, AI for routine/technical tasks
- Skills: Required technical and domain expertise
- Dependencies: Other tasks or external requirements
- RiskLevel: Potential blockers and complexity factors
- Phase: Logical grouping for execution planning

OUTPUT FORMAT:
Generate tasks in structured markdown format with embedded metadata:

## Task: [Clear, Action-Oriented Title]
**Priority:** [low/medium/high/critical] | **Complexity:** [simple/moderate/complex/expert] | **Hours:** [number] | **Assignee:** [human/ai/either]

### Description
[Detailed task description with context and requirements]

### Acceptance Criteria
- [ ] [Specific, measurable criteria]
- [ ] [Testing requirements]
- [ ] [Quality standards]

### Skills Required
- [Technical skill 1]
- [Domain expertise 2]

### Dependencies
- [Dependent task or requirement]

### Risk Assessment
[Potential challenges and mitigation strategies]

---

STRATEGIC ANALYSIS:
Provide project-level insights including:
- Overall complexity assessment
- Critical path identification
- Resource allocation recommendations
- Risk mitigation strategies
- Success metrics and milestones

Be precise, actionable, and optimized for both human understanding and AI agent execution.`;
  }

  async processDocument(
    documentText: string,
    fileName: string,
    projectContext?: string
  ): Promise<AIProcessingResult> {
    try {
      console.log('🤖 Starting AI processing with Gemini...');
      console.log('📄 Document length:', documentText.length, 'characters');
      
      const systemPrompt = this.generateSystemPrompt();
      const userPrompt = this.generateUserPrompt(documentText, fileName, projectContext);
      
      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt)
      ];
      
      console.log('🔄 Sending request to Gemini AI...');
      const response = await this.model.invoke(messages);
      
      console.log('✅ Received AI response');
      const aiOutput = response.content as string;
      
      // Parse the AI response and extract tasks
      const result = this.parseAIResponse(aiOutput);
      
      console.log('🎉 AI processing completed successfully');
      console.log('📊 Generated', result.tasks.length, 'tasks');
      
      return result;
      
    } catch (error) {
      console.error('❌ AI processing failed:', error);
      return {
        tasks: [],
        summary: '',
        totalEstimatedHours: 0,
        riskAssessment: '',
        recommendations: [],
        success: false,
        error: error instanceof Error ? error.message : 'AI processing failed',
      };
    }
  }

  private generateUserPrompt(documentText: string, fileName: string, projectContext?: string): string {
    return `Analyze the following project document and generate a comprehensive task breakdown:

DOCUMENT: ${fileName}
${projectContext ? `PROJECT CONTEXT: ${projectContext}` : ''}

DOCUMENT CONTENT:
${documentText}

INSTRUCTIONS:
1. Analyze the document thoroughly to understand project scope, requirements, and objectives
2. Generate 8-15 detailed, actionable tasks that cover all aspects of the project
3. Ensure tasks are properly prioritized and sequenced
4. Include comprehensive metadata for each task
5. Provide strategic project analysis and recommendations

Focus on creating tasks that are:
- Specific and actionable
- Properly scoped (not too large or too small)
- Technically accurate and realistic
- Optimized for efficient execution
- Risk-aware with mitigation strategies

Generate the complete task breakdown in the specified markdown format.`;
  }

  private parseAIResponse(aiOutput: string): AIProcessingResult {
    console.log('🔍 Parsing AI response...');
    
    const tasks: AITask[] = [];
    let summary = '';
    let totalEstimatedHours = 0;
    let riskAssessment = '';
    let recommendations: string[] = [];
    
    try {
      // Split content into sections
      const sections = aiOutput.split('---');
      
      // Process each task section
      sections.forEach((section, index) => {
        if (section.trim() && section.includes('## Task:')) {
          const task = this.parseTask(section.trim(), index);
          if (task) {
            tasks.push(task);
            totalEstimatedHours += task.metadata.estimatedHours;
          }
        }
      });
      
      // Extract summary and analysis from the end of the response
      const lastSection = sections[sections.length - 1];
      if (lastSection.includes('SUMMARY') || lastSection.includes('ANALYSIS')) {
        summary = this.extractSummary(lastSection);
        riskAssessment = this.extractRiskAssessment(lastSection);
        recommendations = this.extractRecommendations(lastSection);
      }
      
      console.log('✅ Successfully parsed', tasks.length, 'tasks');
      
    } catch (error) {
      console.error('❌ Error parsing AI response:', error);
    }
    
    return {
      tasks,
      summary: summary || 'AI-generated task breakdown completed successfully.',
      totalEstimatedHours,
      riskAssessment: riskAssessment || 'Standard project risks apply.',
      recommendations: recommendations.length > 0 ? recommendations : ['Follow standard project management practices'],
      success: true,
    };
  }

  private parseTask(taskText: string, index: number): AITask | null {
    try {
      // Extract title
      const titleMatch = taskText.match(/## Task: (.+)/);
      const title = titleMatch?.[1]?.trim() || `Task ${index + 1}`;
      
      // Extract metadata from header line
      const metadataMatch = taskText.match(/\*\*Priority:\*\* (\w+).*\*\*Complexity:\*\* (\w+).*\*\*Hours:\*\* (\d+).*\*\*Assignee:\*\* (\w+)/);
      
      const priority = (metadataMatch?.[1] as TaskMetadata['priority']) || 'medium';
      const complexity = (metadataMatch?.[2] as TaskMetadata['complexity']) || 'moderate';
      const estimatedHours = parseInt(metadataMatch?.[3] || '4');
      const assigneeType = (metadataMatch?.[4] as TaskMetadata['assigneeType']) || 'either';
      
      // Extract description
      const descMatch = taskText.match(/### Description\s*\n(.*?)(?=### |$)/s);
      const description = descMatch?.[1]?.trim() || '';
      
      // Extract acceptance criteria
      const criteriaMatch = taskText.match(/### Acceptance Criteria\s*\n(.*?)(?=### |$)/s);
      const criteriaText = criteriaMatch?.[1] || '';
      const acceptanceCriteria = criteriaText
        .split('\n')
        .filter(line => line.includes('- [ ]'))
        .map(line => line.replace(/- \[ \]/, '').trim())
        .filter(Boolean);
      
      // Extract skills
      const skillsMatch = taskText.match(/### Skills Required\s*\n(.*?)(?=### |$)/s);
      const skillsText = skillsMatch?.[1] || '';
      const skills = skillsText
        .split('\n')
        .filter(line => line.includes('-'))
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(Boolean);
      
      // Extract dependencies
      const depsMatch = taskText.match(/### Dependencies\s*\n(.*?)(?=### |$)/s);
      const depsText = depsMatch?.[1] || '';
      const dependencies = depsText
        .split('\n')
        .filter(line => line.includes('-'))
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(Boolean);
      
      const task: AITask = {
        id: `task-${Date.now()}-${index}`,
        title,
        description,
        acceptanceCriteria,
        metadata: {
          priority,
          complexity,
          estimatedHours,
          assigneeType,
          skills,
          dependencies,
          riskLevel: complexity === 'expert' ? 'high' : complexity === 'complex' ? 'medium' : 'low',
          phase: `Phase ${Math.floor(index / 3) + 1}`,
        },
        markdown: taskText,
      };
      
      return task;
      
    } catch (error) {
      console.error('❌ Error parsing task:', error);
      return null;
    }
  }

  private extractSummary(text: string): string {
    const summaryMatch = text.match(/SUMMARY[:\n](.*?)(?=RISK|RECOMMENDATIONS|$)/s);
    return summaryMatch?.[1]?.trim() || '';
  }

  private extractRiskAssessment(text: string): string {
    const riskMatch = text.match(/RISK[:\n](.*?)(?=RECOMMENDATIONS|$)/s);
    return riskMatch?.[1]?.trim() || '';
  }

  private extractRecommendations(text: string): string[] {
    const recsMatch = text.match(/RECOMMENDATIONS[:\n](.*?)$/s);
    const recsText = recsMatch?.[1] || '';
    return recsText
      .split('\n')
      .filter(line => line.includes('-'))
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(Boolean);
  }
}
