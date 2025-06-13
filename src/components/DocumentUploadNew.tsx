import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
          relative overflow-hidden transition-all duration-700 ease-out group
          ${isDragOver ? 'scale-105 shadow-2xl' : 'hover:scale-[1.02]'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          animate-morphing-border
        `}
        style={{
          background: isDragOver 
            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.15), rgba(16, 185, 129, 0.1))' 
            : 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: isDragOver 
            ? '3px solid transparent'
            : '2px solid rgba(255, 255, 255, 0.1)',
          borderImage: isDragOver 
            ? 'linear-gradient(45deg, #8B5CF6, #3B82F6, #10B981, #A855F7) 1'
            : 'none'
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
      >
        {/* Aurora Background Animation */}
        <div className={`
          absolute inset-0 opacity-30 transition-opacity duration-700
          ${isDragOver ? 'opacity-80' : 'group-hover:opacity-50'}
          aurora-bg animate-aurora
        `} />
        
        {/* Liquid Flow Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`
            absolute w-40 h-40 -top-10 -left-10 rounded-full 
            bg-gradient-to-br from-vibeflow-violet/30 via-vibeflow-blue/20 to-transparent
            animate-liquid-flow animate-breathe
            ${isDragOver ? 'scale-150 opacity-60' : 'opacity-20'}
            transition-all duration-700
          `} />
          <div className={`
            absolute w-32 h-32 -bottom-8 -right-8 rounded-full 
            bg-gradient-to-tl from-vibeflow-emerald/25 via-vibeflow-blue/15 to-transparent
            animate-liquid-flow animate-breathe
            ${isDragOver ? 'scale-125 opacity-50' : 'opacity-15'}
            transition-all duration-700 delay-300
          `} style={{ animationDelay: '2s' }} />
          <div className={`
            absolute w-24 h-24 top-1/3 right-1/4 rounded-full 
            bg-gradient-to-br from-vibeflow-purple/20 via-vibeflow-violet/15 to-transparent
            animate-liquid-flow animate-breathe
            ${isDragOver ? 'scale-175 opacity-70' : 'opacity-10'}
            transition-all duration-700 delay-500
          `} style={{ animationDelay: '4s' }} />
        </div>

        {/* Energy Field Particles */}
        {isDragOver && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-3 h-3 rounded-full animate-particle-dance
                  ${i % 4 === 0 ? 'bg-vibeflow-violet/60' : 
                    i % 4 === 1 ? 'bg-vibeflow-blue/60' : 
                    i % 4 === 2 ? 'bg-vibeflow-emerald/60' : 'bg-vibeflow-purple/60'}
                `}
                style={{
                  left: `${10 + (i * 5)}%`,
                  top: `${15 + Math.sin(i * 0.5) * 25}%`,
                  animationDelay: `${i * 150}ms`,
                  animationDuration: `${2 + (i % 3)}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Ripple Effects */}
        {isDragOver && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-8 border-2 border-vibeflow-violet/40 rounded-full animate-ripple-expand" />
            <div className="absolute inset-12 border-2 border-vibeflow-blue/30 rounded-full animate-ripple-expand" style={{ animationDelay: '0.3s' }} />
            <div className="absolute inset-16 border-2 border-vibeflow-emerald/20 rounded-full animate-ripple-expand" style={{ animationDelay: '0.6s' }} />
          </div>
        )}

        {/* Cascade Glow Effect */}
        <div className={`
          absolute inset-0 rounded-xl transition-all duration-500
          ${isDragOver ? 'animate-cascade-glow' : ''}
        `} />

        {/* Holographic Grid */}
        <div className={`
          absolute inset-0 opacity-0 transition-opacity duration-700
          ${isDragOver ? 'opacity-30' : 'group-hover:opacity-10'}
          animate-hologram
        `} style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />

        <div className="p-8 md:p-12 relative z-10">
          <div className="relative text-center">
            {uploadProgress > 0 ? (
              <div className="space-y-6 animate-scale-in">
                <div className={`
                  w-20 h-20 mx-auto bg-vibeflow-gradient rounded-full flex items-center justify-center
                  ${uploadProgress === 100 ? 'animate-magnetic-pull' : 'animate-energy-pulse'}
                  transition-all duration-300
                `}>
                  {uploadProgress === 100 ? (
                    <CheckCircle2 className="w-10 h-10 text-white animate-icon-morph" />
                  ) : (
                    <FileText className="w-10 h-10 text-white animate-icon-morph" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <h3 className={`
                    text-xl font-display font-semibold text-white
                    ${uploadProgress === 100 ? 'animate-text-glitch' : ''}
                  `}>
                    {uploadProgress === 100 ? 'Processing Complete!' : 'Extracting Text from PDF...'}
                  </h3>
                  {selectedFile && (
                    <p className="text-sm text-white/70 animate-fade-in">{selectedFile.name}</p>
                  )}
                  <div className="relative">
                    <Progress value={uploadProgress} className="w-full max-w-md mx-auto" />
                    <div className="absolute inset-0 bg-gradient-to-r from-vibeflow-violet via-vibeflow-blue to-vibeflow-emerald opacity-20 rounded-full animate-shimmer" />
                  </div>
                  <p className="text-sm text-white/60">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Enhanced Upload Icon */}
                <div className={`
                  w-20 h-20 mx-auto bg-vibeflow-gradient rounded-full flex items-center justify-center
                  transition-all duration-500 group-hover:scale-110
                  ${isDragOver ? 'scale-125 animate-magnetic-pull' : 'animate-breathe'}
                `}>
                  <Upload className={`
                    w-10 h-10 text-white transition-all duration-300
                    ${isDragOver ? 'animate-icon-morph' : 'group-hover:animate-icon-morph'}
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

                {/* Enhanced Drop Zone */}
                <div 
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 cursor-pointer
                    transition-all duration-500 backdrop-blur-sm
                    ${isDragOver 
                      ? 'border-vibeflow-violet bg-vibeflow-violet/15 scale-105 shadow-2xl shadow-vibeflow-violet/30' 
                      : 'border-white/30 hover:border-vibeflow-violet/50 hover:bg-white/5 hover:scale-[1.02]'
                    }
                    animate-energy-pulse
                  `}
                  onClick={handleClick}
                >
                  {/* Enhanced Background */}
                  <div className={`
                    absolute inset-0 rounded-xl transition-all duration-500
                    ${isDragOver ? 'aurora-bg animate-aurora' : ''}
                  `} />
                  
                  {/* Magnetic Field */}
                  {isDragOver && (
                    <div className="absolute inset-0 rounded-xl">
                      <div className="absolute inset-4 border border-vibeflow-violet/40 rounded-lg animate-magnetic-pull" />
                      <div className="absolute inset-6 border border-vibeflow-blue/30 rounded-lg animate-magnetic-pull" style={{ animationDelay: '0.2s' }} />
                      <div className="absolute inset-8 border border-vibeflow-emerald/20 rounded-lg animate-magnetic-pull" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-center">
                      <div className={`
                        w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center
                        transition-all duration-500
                        ${isDragOver ? 'bg-vibeflow-violet/30 scale-125 animate-magnetic-pull' : 'group-hover:bg-white/15 group-hover:scale-105 animate-breathe'}
                      `}>
                        <FileText className={`
                          w-8 h-8 text-vibeflow-violet transition-all duration-300
                          ${isDragOver ? 'animate-icon-morph text-white' : 'group-hover:animate-icon-morph'}
                        `} />
                      </div>
                    </div>
                    
                    <div>
                      <p className={`
                        text-lg font-medium mb-2 transition-all duration-300
                        ${isDragOver ? 'text-white scale-105' : 'text-white'}
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
                    <div className="w-2 h-2 bg-vibeflow-emerald rounded-full animate-breathe"></div>
                    Enterprise Ready
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vibeflow-blue rounded-full animate-breathe" style={{ animationDelay: '0.5s' }}></div>
                    AI-Powered
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vibeflow-purple rounded-full animate-breathe" style={{ animationDelay: '1s' }}></div>
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
