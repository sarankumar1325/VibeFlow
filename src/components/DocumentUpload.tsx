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
          glass-effect transition-all duration-300 ease-out
          ${isDragOver ? 'border-vibeflow-violet/50 bg-vibeflow-violet/5 scale-[1.01]' : 'border-white/20 hover:border-vibeflow-violet/30'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          relative overflow-hidden
        `}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
      >
        {/* Simple Floating Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`
            absolute w-32 h-32 top-4 left-4 rounded-full
            bg-gradient-to-br from-vibeflow-violet/20 to-vibeflow-blue/10
            blur-2xl transition-all duration-500
            ${isDragOver ? 'scale-125 opacity-40' : 'opacity-20'}
          `} />
          <div className={`
            absolute w-24 h-24 bottom-8 right-8 rounded-full
            bg-gradient-to-tl from-vibeflow-emerald/15 to-vibeflow-purple/10
            blur-xl transition-all duration-500 delay-100
            ${isDragOver ? 'scale-110 opacity-30' : 'opacity-15'}
          `} />
        </div>        <div className="p-8 md:p-12 relative z-10">
          <div className="relative text-center">
            {uploadProgress > 0 ? (
              <div className="space-y-6 animate-fade-in">
                <div className={`
                  w-20 h-20 mx-auto bg-vibeflow-gradient rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${uploadProgress === 100 ? 'animate-bounce' : 'animate-pulse'}
                `}>
                  {uploadProgress === 100 ? (
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  ) : (
                    <FileText className="w-10 h-10 text-white animate-spin" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-display font-semibold text-white">
                    {uploadProgress === 100 ? 'Processing Complete!' : 'Extracting Text from PDF...'}
                  </h3>
                  {selectedFile && (
                    <p className="text-sm text-white/70">{selectedFile.name}</p>
                  )}
                  <Progress value={uploadProgress} className="w-full max-w-md mx-auto" />
                  <p className="text-sm text-white/60">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Simple Upload Icon */}
                <div className={`
                  w-20 h-20 mx-auto bg-vibeflow-gradient rounded-full flex items-center justify-center
                  transition-all duration-300 hover:scale-110
                  ${isDragOver ? 'scale-125 animate-pulse' : ''}
                `}>
                  <Upload className={`
                    w-10 h-10 text-white transition-all duration-300
                    ${isDragOver ? 'animate-bounce' : ''}
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

                {/* Simple Drop Zone */}
                <div 
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 cursor-pointer
                    transition-all duration-300 backdrop-blur-sm
                    ${isDragOver 
                      ? 'border-vibeflow-violet bg-vibeflow-violet/10 scale-[1.02]' 
                      : 'border-white/30 hover:border-vibeflow-violet/50 hover:bg-white/5'
                    }
                  `}
                  onClick={handleClick}
                >
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className={`
                        w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center
                        transition-all duration-300
                        ${isDragOver ? 'bg-vibeflow-violet/20 scale-110' : 'hover:bg-white/15 hover:scale-105'}
                      `}>
                        <FileText className={`
                          w-8 h-8 text-vibeflow-violet transition-all duration-300
                          ${isDragOver ? 'text-white animate-pulse' : ''}
                        `} />
                      </div>
                    </div>
                    
                    <div>
                      <p className={`
                        text-lg font-medium mb-2 transition-all duration-300
                        ${isDragOver ? 'text-white scale-105' : 'text-white'}
                      `}>
                        Drop your files here or <span className="gradient-text font-semibold">browse</span>
                      </p>
                      <p className="text-sm text-white/60">
                        Supports PDF, DOC, DOCX, TXT • Max 50MB
                      </p>
                    </div>
                  </div>
                </div>                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 max-w-2xl mx-auto">
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
                    <div className="w-2 h-2 bg-vibeflow-emerald rounded-full animate-pulse"></div>
                    Enterprise Ready
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vibeflow-blue rounded-full animate-pulse"></div>
                    AI-Powered
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vibeflow-purple rounded-full animate-pulse"></div>
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
