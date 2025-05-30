
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
        if (file.type === 'application/pdf' && result.text.includes('Note: This PDF was successfully loaded')) {
          toast({
            title: "PDF Loaded Successfully",
            description: "PDF metadata extracted. You can manually describe your project or upload a text file for better AI processing.",
          });
        } else {
          toast({
            title: "Document Processed Successfully",
            description: `Extracted ${result.text.length} characters from ${result.metadata.pageCount} page(s).`,
          });
        }
        onFileProcessed(result);
      } else {
        toast({
          title: "Processing Failed",
          description: result.error || "Failed to process document.",
          variant: "destructive",
        });
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
    <div className="w-full max-w-4xl mx-auto">
      <Card 
        className={`
          glass-effect transition-all duration-300 magnetic-hover
          ${isDragOver ? 'border-vibeflow-violet glow-effect' : 'border-white/20'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
      >
        <div className="p-8 md:p-12">
          {/* Floating Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="floating-orb w-32 h-32 top-4 left-4"></div>
            <div className="floating-orb w-24 h-24 bottom-8 right-8"></div>
            <div className="floating-orb w-16 h-16 top-1/2 right-1/4"></div>
          </div>

          <div className="relative z-10 text-center">
            {uploadProgress > 0 ? (
              <div className="space-y-6 animate-scale-in">
                <div className="w-20 h-20 mx-auto bg-vibeflow-gradient rounded-full flex items-center justify-center">
                  {uploadProgress === 100 ? (
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  ) : (
                    <FileText className="w-10 h-10 text-white" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-display font-semibold text-white">
                    {uploadProgress === 100 ? 'Processing Complete!' : 'Processing Document...'}
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
                <div className="w-20 h-20 mx-auto bg-vibeflow-gradient rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-2xl md:text-3xl font-display font-bold gradient-text">
                    Upload Your Project Document
                  </h2>
                  <p className="text-lg text-white/70 max-w-2xl mx-auto">
                    Transform complex project documents into structured, actionable tasks with AI-powered intelligence
                  </p>
                </div>

                <div 
                  className="border-2 border-dashed border-white/30 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:border-vibeflow-violet/50 hover:bg-white/5"
                  onClick={handleClick}
                >
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-vibeflow-violet" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-lg font-medium text-white mb-2">
                        Drop your files here or <span className="gradient-text font-semibold">browse</span>
                      </p>
                      <p className="text-sm text-white/60">
                        Supports PDF, DOC, DOCX, TXT • Max 50MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Updated info section */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-2xl mx-auto">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="text-sm text-blue-200">
                      <p className="font-medium mb-1">Optimal Results:</p>
                      <p>For best AI processing, upload <strong>text files (.txt)</strong> or provide manual project descriptions. PDF text extraction is limited but metadata will be processed.</p>
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
      />
    </div>
  );
};

export default DocumentUpload;
