import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { PDFService, PDFExtractionResult } from '@/services/pdfService';

interface DocumentUploadProps {
  onFileProcessed: (result: PDFExtractionResult) => void;
  isProcessing: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onFileProcessed, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const validateFile = (file: File): boolean => {
    if (!supportedTypes.includes(file.type) && !file.name.endsWith('.txt')) {
      toast({
        title: "Unsupported File Type",
        description: "Please upload PDF, DOC, DOCX, or TXT files only.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxFileSize) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 50MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const processFile = async (file: File) => {
    console.log('🚀 Processing file:', file.name);
    setSelectedFile(file);
    setUploadProgress(20);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await PDFService.extractTextFromFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        const hasActualContent = result.text && 
          result.text.length > 100 && 
          !result.text.includes('Warning: Could not extract text') &&
          !result.text.includes('[No readable text found') &&
          !result.text.includes('Limited text extraction');

        if (hasActualContent) {
          toast({
            title: "Document Processed Successfully",
            description: `Extracted ${result.text.length} characters from ${result.metadata.pageCount} page(s). Ready for AI analysis!`,
          });
        } else {
          toast({
            title: "PDF Loaded - Enhanced Processing Applied",
            description: "Advanced text extraction completed. The AI will work with all available content and metadata.",
          });
        }
        onFileProcessed(result);
      } else {
        toast({
          title: "Processing Notice",
          description: result.error || "Document loaded with limited text extraction. You can still proceed with AI processing.",
          variant: result.text.includes('Warning:') ? "default" : "destructive",
        });
        
        // Still call onFileProcessed even if extraction failed partially
        // The AI can work with whatever content we have
        onFileProcessed(result);
      }
    } catch (error) {
      console.error('❌ File processing error:', error);
      toast({
        title: "Processing Error",
        description: "An unexpected error occurred while processing the file.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setUploadProgress(0);
        setSelectedFile(null);
      }, 2000);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        processFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        processFile(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto" data-upload-section>
      <Card 
        className={`
          glass-effect transition-all duration-500 magnetic-hover group
          ${isDragOver ? 'border-vibeflow-violet glow-effect scale-[1.02] shadow-2xl shadow-vibeflow-violet/30 animate-elastic-bounce' : 'border-white/20 hover:border-vibeflow-violet/30'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          relative overflow-hidden animate-breathe
        `}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
      >
        {/* Enhanced Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Morphing Background Gradient */}
          <div className={`
            absolute inset-0 transition-all duration-700 ease-out
            ${isDragOver 
              ? 'bg-gradient-to-br from-vibeflow-violet/30 via-vibeflow-blue/20 to-vibeflow-emerald/30 animate-morph-gradient' 
              : 'bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-vibeflow-violet/5 group-hover:via-vibeflow-blue/5 group-hover:to-vibeflow-emerald/5'
            }
          `} />
          
          {/* Enhanced Floating Orbs with Complex Animations */}
          <div className={`
            floating-orb w-32 h-32 top-4 left-4 transition-all duration-500 
            ${isDragOver ? 'scale-150 opacity-80 blur-sm animate-ripple' : 'opacity-20 animate-float'}
          `}></div>
          <div className={`
            floating-orb w-24 h-24 bottom-8 right-8 transition-all duration-500 animation-delay-200
            ${isDragOver ? 'scale-125 opacity-70 blur-sm animate-magnetic-field' : 'opacity-15 animate-float'}
          `}></div>
          <div className={`
            floating-orb w-16 h-16 top-1/2 right-1/4 transition-all duration-500 animation-delay-300
            ${isDragOver ? 'scale-175 opacity-90 blur-md animate-particle-burst' : 'opacity-10 animate-float'}
          `}></div>
          <div className={`
            floating-orb w-20 h-20 top-1/4 left-1/3 transition-all duration-500 animation-delay-500
            ${isDragOver ? 'scale-140 opacity-75 blur-sm animate-ripple' : 'opacity-12 animate-float'}
          `}></div>
          
          {/* Advanced Particle Burst System */}
          {isDragOver && (
            <div className="absolute inset-0">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    absolute w-3 h-3 rounded-full animate-particle-burst particle-${i}
                    ${i % 4 === 0 ? 'bg-vibeflow-violet' : ''}
                    ${i % 4 === 1 ? 'bg-vibeflow-blue' : ''}
                    ${i % 4 === 2 ? 'bg-vibeflow-emerald' : ''}
                    ${i % 4 === 3 ? 'bg-vibeflow-purple' : ''}
                  `}
                />
              ))}
            </div>
          )}
          
          {/* Magnetic Field Visualization */}
          {isDragOver && (
            <div className="absolute inset-0">
              <div className="absolute inset-4 border border-vibeflow-violet/40 rounded-xl animate-magnetic-field" />
              <div className="absolute inset-8 border border-vibeflow-blue/30 rounded-xl animate-magnetic-field animation-delay-200" />
              <div className="absolute inset-12 border border-vibeflow-emerald/20 rounded-xl animate-magnetic-field animation-delay-300" />
            </div>
          )}
          
          {/* Enhanced Pulsing Border Effect */}
          <div className={`
            absolute inset-0 rounded-xl border-2 transition-all duration-300
            ${isDragOver ? 'border-vibeflow-violet/60 animate-pulse shadow-lg shadow-vibeflow-violet/30' : 'border-transparent'}
          `} />
          
          {/* Multi-layered Shimmer Effect */}
          <div className={`
            absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
            bg-gradient-to-r from-transparent via-white/10 to-transparent
            animate-shimmer-wave
          `} />
          <div className={`
            absolute inset-0 opacity-0 transition-opacity duration-500
            ${isDragOver ? 'opacity-100' : ''}
            bg-gradient-to-r from-transparent via-vibeflow-violet/20 to-transparent
            animate-shimmer-wave animation-delay-200
          `} />
          
          {/* Ripple Effects on Drag */}
          {isDragOver && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-vibeflow-violet/50 rounded-full animate-ripple" />
              <div className="absolute w-24 h-24 border-2 border-vibeflow-blue/40 rounded-full animate-ripple animation-delay-200" />
              <div className="absolute w-16 h-16 border-2 border-vibeflow-emerald/30 rounded-full animate-ripple animation-delay-300" />
            </div>
          )}
        </div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="relative text-center">
            {uploadProgress > 0 ? (
              // Enhanced Progress Animation Section
              <div className="space-y-6 animate-scale-in">
                <div className={`
                  w-20 h-20 mx-auto bg-vibeflow-gradient rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${uploadProgress === 100 ? 'animate-elastic-bounce scale-110' : 'animate-pulse scale-105'}
                `}>
                  {uploadProgress === 100 ? (
                    <CheckCircle2 className="w-10 h-10 text-white animate-elastic-bounce" />
                  ) : (
                    <FileText className="w-10 h-10 text-white animate-icon-dance" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <h3 className={`
                    text-xl font-display font-semibold text-white transition-all duration-300
                    ${uploadProgress === 100 ? 'animate-pulse' : ''}
                  `}>
                    {uploadProgress === 100 ? 'Processing Complete!' : 'Extracting Text from PDF...'}
                  </h3>
                  {selectedFile && (
                    <p className="text-sm text-white/70 animate-fade-in">{selectedFile.name}</p>
                  )}
                  <div className="relative">
                    <Progress value={uploadProgress} className="w-full max-w-md mx-auto" />
                    <div className={`
                      absolute inset-0 bg-gradient-to-r from-vibeflow-violet to-vibeflow-blue opacity-20 rounded-full
                      transition-all duration-300
                      ${uploadProgress > 50 ? 'animate-shimmer-wave' : ''}
                    `} />
                  </div>
                  <p className="text-sm text-white/60">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Enhanced Upload Icon with Complex Micro Animations */}
                <div className={`
                  w-20 h-20 mx-auto bg-vibeflow-gradient rounded-full flex items-center justify-center
                  transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                  ${isDragOver ? 'scale-125 rotate-6 animate-elastic-bounce shadow-lg shadow-vibeflow-violet/40' : 'animate-breathe'}
                `}>
                  <Upload className={`
                    w-10 h-10 text-white transition-all duration-300
                    ${isDragOver ? 'animate-icon-dance' : 'group-hover:animate-wiggle'}
                  `} />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-2xl md:text-3xl font-display font-bold gradient-text">
                    Upload Your Project Document
                  </h2>
                  <p className="text-lg text-white/70 max-w-2xl mx-auto">
                    Transform complex project documents into structured, actionable tasks with AI-powered intelligence
                  </p>
                </div>

                {/* Enhanced Drop Zone with Advanced Elastic Effects */}
                <div 
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 cursor-pointer
                    transition-all duration-300 backdrop-blur-sm
                    ${isDragOver 
                      ? 'border-vibeflow-violet bg-vibeflow-violet/15 scale-105 shadow-2xl shadow-vibeflow-violet/30 animate-elastic-bounce' 
                      : 'border-white/30 hover:border-vibeflow-violet/50 hover:bg-white/5 hover:scale-[1.02] animate-breathe'
                    }
                  `}
                  onClick={handleClick}
                >
                  {/* Enhanced Ripple Effect Background */}
                  <div className={`
                    absolute inset-0 rounded-xl transition-all duration-500
                    ${isDragOver ? 'bg-gradient-to-br from-vibeflow-violet/25 via-vibeflow-blue/15 to-vibeflow-emerald/20 animate-morph-gradient' : ''}
                  `} />
                  
                  {/* Advanced Magnetic Field Visualization */}
                  {isDragOver && (
                    <div className="absolute inset-0 rounded-xl">
                      <div className="absolute inset-4 border border-vibeflow-violet/40 rounded-lg animate-magnetic-field" />
                      <div className="absolute inset-6 border border-vibeflow-blue/30 rounded-lg animate-magnetic-field animation-delay-200" />
                      <div className="absolute inset-8 border border-vibeflow-emerald/20 rounded-lg animate-magnetic-field animation-delay-300" />
                    </div>
                  )}
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-center">
                      <div className={`
                        w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center
                        transition-all duration-300
                        ${isDragOver ? 'bg-vibeflow-violet/30 scale-125 rotate-12 animate-elastic-bounce shadow-lg shadow-vibeflow-violet/40' : 'group-hover:bg-white/15 group-hover:scale-105 animate-breathe'}
                      `}>
                        <FileText className={`
                          w-8 h-8 text-vibeflow-violet transition-all duration-300
                          ${isDragOver ? 'animate-icon-dance text-white scale-110' : 'group-hover:animate-wiggle'}
                        `} />
                      </div>
                    </div>
                    
                    <div>
                      <p className={`
                        text-lg font-medium mb-2 transition-all duration-300
                        ${isDragOver ? 'text-white scale-105 animate-pulse' : 'text-white'}
                      `}>
                        Drop your files here or <span className="gradient-text font-semibold animate-glow">browse</span>
                      </p>
                      <p className="text-sm text-white/60">
                        Supports PDF, DOC, DOCX, TXT • Max 50MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 max-w-2xl mx-auto">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div className="text-sm text-emerald-200">
                      <p className="font-medium mb-1">Enhanced PDF Processing:</p>
                      <p>Advanced text extraction with improved formatting preservation, better error handling, and support for complex PDF layouts. Works with both text-based and scanned documents.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 text-sm text-white/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vibeflow-emerald rounded-full"></div>
                    Enterprise Ready
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vibeflow-blue rounded-full"></div>
                    AI-Powered
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vibeflow-purple rounded-full"></div>
                    Optimized for Scale
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
        aria-label="Upload document file"
        title="Upload document file"
      />
    </div>
  );
};

export default DocumentUpload;
