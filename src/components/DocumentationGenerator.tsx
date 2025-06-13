import React, { useState, useEffect } from 'react';
import { DocumentationService, ApplicationOverview, PRD, ImplementationStatus } from '../services/documentationService';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle,
  BookOpen,
  Target,
  TrendingUp,
  Users,
  Settings,
  FileCode
} from 'lucide-react';

interface DocumentationGeneratorProps {
  geminiApiKey: string;
}

const DocumentationGenerator: React.FC<DocumentationGeneratorProps> = ({ geminiApiKey }) => {
  const [documentationService] = useState(() => new DocumentationService(geminiApiKey));
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Feature 1: Application Overview State
  const [overview, setOverview] = useState<ApplicationOverview | null>(null);
  const [generatingOverview, setGeneratingOverview] = useState(false);

  // Feature 2: PRD Generation State
  const [featureIdea, setFeatureIdea] = useState('');
  const [stakeholders, setStakeholders] = useState('Product Manager, Development Team, End Users');
  const [generatedPRD, setGeneratedPRD] = useState<PRD | null>(null);
  const [generatingPRD, setGeneratingPRD] = useState(false);
  const [prdList, setPRDList] = useState<PRD[]>([]);
  // Feature 3: Implementation Tracking State
  const [selectedPRDId, setSelectedPRDId] = useState('');
  const [implementationStatus, setImplementationStatus] = useState<ImplementationStatus | null>(null);
  const [trackingProgress, setTrackingProgress] = useState(false);
  const loadPRDList = async () => {
    try {
      const prds = await documentationService.exportPRDList();
      setPRDList(prds);
    } catch (error) {
      console.error('Failed to load PRD list:', error);
    }
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  useEffect(() => {
    loadPRDList();
  }, [loadPRDList]);

  // =================== FEATURE 1: APPLICATION OVERVIEW ===================

  const generateApplicationOverview = async () => {
    setGeneratingOverview(true);
    try {
      const result = await documentationService.generateApplicationOverview();
      setOverview(result);
      showMessage('success', 'Application overview generated successfully!');
    } catch (error) {
      console.error('Failed to generate overview:', error);
      showMessage('error', 'Failed to generate application overview. Please try again.');
    } finally {
      setGeneratingOverview(false);
    }
  };

  const downloadOverviewMarkdown = () => {
    if (!overview) return;
    
    const markdown = generateOverviewMarkdown(overview);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${overview.projectName}-overview.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateOverviewMarkdown = (overview: ApplicationOverview): string => {
    return `# ${overview.projectName} - Application Overview

**Generated:** ${overview.generatedAt.toLocaleDateString()}

${overview.summary}

## 🏗️ Architectural Perspective

${overview.architectural.overview}

### Components
${overview.architectural.components.map(c => `- ${c}`).join('\n')}

### Data Flow
${overview.architectural.dataFlow}

### Architecture Diagram
\`\`\`mermaid
${overview.architectural.mermaidDiagram}
\`\`\`

## 👨‍💻 Developer Perspective

${overview.developer.overview}

### Technology Stack
${overview.developer.techStack.map(tech => `- ${tech}`).join('\n')}

### Code Metrics
- **Total Files:** ${overview.developer.codeMetrics.totalFiles}
- **Total Lines:** ${overview.developer.codeMetrics.totalLines}
- **Components:** ${overview.developer.codeMetrics.componentCount}
- **Services:** ${overview.developer.codeMetrics.serviceCount}

### Class Diagram
\`\`\`mermaid
${overview.developer.mermaidDiagram}
\`\`\`

## 📊 Product Perspective

${overview.product.overview}

### Features
${overview.product.features.map(f => `- ${f}`).join('\n')}

### User Journey
${overview.product.userJourney}

### Business Value
${overview.product.businessValue}

### Stakeholders
${overview.product.stakeholders.map(s => `- ${s}`).join('\n')}

### User Journey Diagram
\`\`\`mermaid
${overview.product.mermaidDiagram}
\`\`\`

---
*This document was auto-generated by VibeFlow AI Documentation System*
`;
  };

  // =================== FEATURE 2: PRD GENERATION ===================

  const generatePRD = async () => {
    if (!featureIdea.trim()) {
      showMessage('error', 'Please enter a feature idea');
      return;
    }

    setGeneratingPRD(true);
    try {
      const stakeholderList = stakeholders.split(',').map(s => s.trim());
      const result = await documentationService.generatePRD(featureIdea, overview);
      setGeneratedPRD(result);
      await loadPRDList();
      showMessage('success', 'PRD generated and saved successfully!');
    } catch (error) {
      console.error('Failed to generate PRD:', error);
      showMessage('error', 'Failed to generate PRD. Please try again.');
    } finally {
      setGeneratingPRD(false);
    }
  };

  const downloadPRDMarkdown = (prd: PRD) => {
    const markdown = generatePRDMarkdown(prd);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prd.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePRDMarkdown = (prd: PRD): string => {
    return `# ${prd.title}

**Version:** ${prd.version}  
**Status:** ${prd.status}  
**Created:** ${prd.createdAt.toLocaleDateString()}  
**Last Updated:** ${prd.updatedAt.toLocaleDateString()}

## Description
${prd.description}

## Business Goals
${prd.businessGoals.map(goal => `- ${goal}`).join('\n')}

## User Stories
${prd.userStories.map(story => `
### ${story.title}
**Priority:** ${story.priority} | **Story Points:** ${story.storyPoints}

${story.description}

**Acceptance Criteria:**
${story.acceptanceCriteria.map(criteria => `- [ ] ${criteria}`).join('\n')}
`).join('\n')}

## Functional Requirements
${prd.functionalRequirements.map(req => `
### ${req.title}
**Category:** ${req.category} | **Priority:** ${req.priority}

${req.description}
`).join('\n')}

## Non-Functional Requirements
${prd.nonFunctionalRequirements.map(req => `
### ${req.title} (${req.category})
**Target:** ${req.target}

${req.description}
`).join('\n')}

## Stakeholders
${prd.stakeholders.map(stakeholder => `
### ${stakeholder.name} - ${stakeholder.role}
**Responsibilities:** ${stakeholder.responsibilities.join(', ')}  
**Interests:** ${stakeholder.interests.join(', ')}
`).join('\n')}

## Success Metrics
${prd.successMetrics.map(metric => `- ${metric}`).join('\n')}

## Timeline
${prd.timeline}

${prd.implementationStatus ? `
## Implementation Status
**Overall Progress:** ${prd.implementationStatus.overallProgress}%

**Status Breakdown:**
- ✅ Completed: ${prd.implementationStatus.completedItems}
- 🔄 In Progress: ${prd.implementationStatus.inProgressItems}  
- ⏳ Pending: ${prd.implementationStatus.pendingItems}
- 🚫 Blocked: ${prd.implementationStatus.blockedItems}

### Next Steps
${prd.implementationStatus.nextSteps.map(step => `- ${step}`).join('\n')}

### Recent Changes
${prd.implementationStatus.changelog.slice(0, 5).map(entry => `
**${entry.date.toLocaleDateString()}** - ${entry.title}  
${entry.description}
`).join('\n')}
` : ''}
`;
  };

  // =================== FEATURE 3: IMPLEMENTATION TRACKING ===================

  const trackImplementation = async () => {
    if (!selectedPRDId) {
      showMessage('error', 'Please select a PRD to track');
      return;
    }

    setTrackingProgress(true);
    try {
      const result = await documentationService.trackImplementationProgress(selectedPRDId);
      setImplementationStatus(result);
      await loadPRDList(); // Refresh PRD list to show updated status
      showMessage('success', 'Implementation progress updated successfully!');
    } catch (error) {
      console.error('Failed to track implementation:', error);
      showMessage('error', 'Failed to track implementation progress. Please try again.');
    } finally {
      setTrackingProgress(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case 'blocked': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 VibeFlow AI Documentation System
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Auto-generate application overviews, create structured PRDs, and track implementation progress
          </p>
        </div>

        {message && (
          <Alert className={`mb-6 ${
            message.type === 'error' ? 'border-red-200 bg-red-50' :
            message.type === 'success' ? 'border-green-200 bg-green-50' :
            'border-blue-200 bg-blue-50'
          }`}>
            <AlertDescription className={
              message.type === 'error' ? 'text-red-800' :
              message.type === 'success' ? 'text-green-800' :
              'text-blue-800'
            }>
              {message.text}
            </AlertDescription>
          </Alert>
        )}        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Application Overview
            </TabsTrigger>
            <TabsTrigger value="prd" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PRD Generation
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Implementation Tracking
            </TabsTrigger>
          </TabsList>

          {/* =================== FEATURE 1: APPLICATION OVERVIEW TAB =================== */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Auto-Generated Application Overview
                </CardTitle>
                <CardDescription>
                  Generate a comprehensive architectural overview with multi-perspective analysis and Mermaid diagrams
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={generateApplicationOverview}
                  disabled={generatingOverview}
                  className="w-full"
                  size="lg"
                >
                  {generatingOverview ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Codebase...
                    </>
                  ) : (
                    <>
                      <FileCode className="mr-2 h-4 w-4" />
                      Generate Application Overview
                    </>
                  )}
                </Button>

                {overview && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Generated Overview</h3>
                      <Button onClick={downloadOverviewMarkdown} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Markdown
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            🏗️ Architectural
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-2">{overview.architectural.overview.substring(0, 100)}...</p>
                          <Badge variant="outline">{overview.architectural.components.length} Components</Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            👨‍💻 Developer
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Total Files:</span>
                              <span>{overview.developer.codeMetrics.totalFiles}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Components:</span>
                              <span>{overview.developer.codeMetrics.componentCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Services:</span>
                              <span>{overview.developer.codeMetrics.serviceCount}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            📊 Product
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-2">{overview.product.overview.substring(0, 100)}...</p>
                          <Badge variant="outline">{overview.product.features.length} Features</Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* =================== FEATURE 2: PRD GENERATION TAB =================== */}
          <TabsContent value="prd" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PRD Generation Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Generate New PRD
                  </CardTitle>
                  <CardDescription>
                    Create a structured Product Requirements Document with AI assistance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="feature-idea">Feature Idea</Label>
                    <Textarea
                      id="feature-idea"
                      placeholder="Describe the feature you want to create a PRD for..."
                      value={featureIdea}
                      onChange={(e) => setFeatureIdea(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stakeholders">Stakeholders (comma-separated)</Label>
                    <Input
                      id="stakeholders"
                      placeholder="Product Manager, Development Team, End Users"
                      value={stakeholders}
                      onChange={(e) => setStakeholders(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={generatePRD}
                    disabled={generatingPRD || !featureIdea.trim()}
                    className="w-full"
                    size="lg"
                  >
                    {generatingPRD ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Generating PRD...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate PRD
                      </>
                    )}
                  </Button>

                  {generatedPRD && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Generated PRD</h3>
                        <Button onClick={() => downloadPRDMarkdown(generatedPRD)} variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Title:</strong> {generatedPRD.title}</p>
                        <p className="text-sm"><strong>Status:</strong> 
                          <Badge className="ml-2">{generatedPRD.status}</Badge>
                        </p>
                        <p className="text-sm"><strong>User Stories:</strong> {generatedPRD.userStories.length}</p>
                        <p className="text-sm"><strong>Requirements:</strong> {generatedPRD.functionalRequirements.length} functional, {generatedPRD.nonFunctionalRequirements.length} non-functional</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* PRD List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Existing PRDs
                  </CardTitle>
                  <CardDescription>
                    Previously generated Product Requirements Documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {prdList.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No PRDs generated yet</p>
                  ) : (
                    <div className="space-y-3">
                      {prdList.map((prd) => (
                        <div key={prd.id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{prd.title}</h4>
                              <p className="text-sm text-gray-500">
                                Created: {new Date(prd.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getStatusColor(prd.status)}>
                                {prd.status}
                              </Badge>
                              <Button
                                onClick={() => downloadPRDMarkdown(prd)}
                                variant="outline"
                                size="sm"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {prd.implementationStatus && (
                            <div className="pt-2 border-t">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-600">Implementation Progress</span>
                                <span className="text-xs font-medium">{prd.implementationStatus.overallProgress}%</span>
                              </div>
                              <Progress value={prd.implementationStatus.overallProgress} className="h-2" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* =================== FEATURE 3: IMPLEMENTATION TRACKING TAB =================== */}
          <TabsContent value="tracking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Implementation Progress Tracker
                </CardTitle>
                <CardDescription>
                  Track implementation status against PRD requirements and generate progress reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prd-select">Select PRD to Track</Label>                    <select
                      id="prd-select"
                      className="w-full p-2 border rounded-md"
                      value={selectedPRDId}
                      onChange={(e) => setSelectedPRDId(e.target.value)}
                      title="Select PRD to Track"
                    >
                      <option value="">Choose a PRD...</option>
                      {prdList.map((prd) => (
                        <option key={prd.id} value={prd.id}>
                          {prd.title} ({new Date(prd.createdAt).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button 
                      onClick={trackImplementation}
                      disabled={trackingProgress || !selectedPRDId}
                      className="w-full"
                    >
                      {trackingProgress ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Code...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Track Progress
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {implementationStatus && (
                  <div className="space-y-6 pt-6 border-t">
                    {/* Progress Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {implementationStatus.completedItems}
                          </div>
                          <div className="text-sm text-gray-600">Completed</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {implementationStatus.inProgressItems}
                          </div>
                          <div className="text-sm text-gray-600">In Progress</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-gray-600">
                            {implementationStatus.pendingItems}
                          </div>
                          <div className="text-sm text-gray-600">Pending</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {implementationStatus.blockedItems}
                          </div>
                          <div className="text-sm text-gray-600">Blocked</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {implementationStatus.overallProgress}%
                          </div>
                          <div className="text-sm text-gray-600">Overall</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm text-gray-600">{implementationStatus.overallProgress}%</span>
                      </div>
                      <Progress value={implementationStatus.overallProgress} className="h-3" />
                    </div>

                    {/* Implementation Items */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Implementation Items</h3>
                      <div className="space-y-3">
                        {implementationStatus.items.map((item) => (
                          <Card key={item.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(item.status)}
                                  <h4 className="font-medium">{item.title}</h4>
                                </div>
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Type:</span>
                                  <span className="capitalize">{item.type.replace('-', ' ')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Progress:</span>
                                  <span>{item.completionPercentage}%</span>
                                </div>
                                {item.implementedFiles.length > 0 && (
                                  <div className="text-sm">
                                    <span className="font-medium">Files:</span>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                      {item.implementedFiles.map((file, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {file.split('/').pop()}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {item.implementationNotes && (
                                  <p className="text-sm text-gray-600">{item.implementationNotes}</p>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Next Steps */}
                    {implementationStatus.nextSteps.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                        <Card>
                          <CardContent className="p-4">
                            <ul className="space-y-2">
                              {implementationStatus.nextSteps.map((step, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">{step}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Recent Changes */}
                    {implementationStatus.changelog.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Recent Changes</h3>
                        <div className="space-y-3">
                          {implementationStatus.changelog.slice(0, 5).map((entry) => (
                            <Card key={entry.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium">{entry.title}</h4>
                                  <span className="text-sm text-gray-500">
                                    {new Date(entry.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{entry.description}</p>
                                <Badge variant="outline" className="mt-2 capitalize">
                                  {entry.type}
                                </Badge>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DocumentationGenerator;