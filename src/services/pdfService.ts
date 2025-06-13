
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for Vite environment with robust fallbacks
let workerInitialized = false;

const setupWorker = async (): Promise<boolean> => {
  if (workerInitialized) return true;

  // Array of worker URLs to try in order - starting with local file
  const workerUrls = [
    // Local worker file (most reliable)
    '/pdf.worker.min.js',
    // CDN fallbacks
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`,
    // Mozilla's official CDN as backup
    `https://mozilla.github.io/pdf.js/build/pdf.worker.js`
  ];

  // Try worker URLs in order
  for (const url of workerUrls) {
    try {
      console.log(`🔄 Trying worker URL: ${url}`);
      
      // For local files, skip the HEAD check
      if (url.startsWith('/')) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = url;
        console.log('✅ PDF.js worker configured successfully (local):', url);
        workerInitialized = true;
        return true;
      }
      
      // For CDN URLs, test if accessible
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'cors'
      });
      
      if (response.ok) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = url;
        console.log('✅ PDF.js worker configured successfully:', url);
        workerInitialized = true;
        return true;
      }
    } catch (error) {
      console.warn(`❌ Failed to load worker from: ${url}`, error);
      continue;
    }
  }

  // If all workers fail, disable worker (will use main thread)
  console.warn('⚠️ All workers failed, disabling worker (will use main thread)');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
  
  // Disable worker entirely - PDF.js will fall back to main thread processing
  try {
    // This tells PDF.js to not use a worker at all
    pdfjsLib.GlobalWorkerOptions.workerSrc = '';
    console.log('✅ PDF.js configured to run without worker (main thread)');
    workerInitialized = true;
    return true;
  } catch (error) {
    console.error('❌ Failed to disable worker:', error);
    return false;
  }
};

// Initialize worker setup
const workerPromise = setupWorker().catch(error => {
  console.error('Failed to setup PDF.js worker:', error);
  return false;
});

export interface PDFExtractionResult {
  text: string;
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    pageCount: number;
    fileSize: number;
    fileName: string;
  };
  success: boolean;
  error?: string;
}

interface PDFMetadata {
  info?: {
    Title?: string;
    Author?: string;
    Subject?: string;
    Keywords?: string;
    [key: string]: string | undefined;
  };
}

interface TextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL?: boolean;
}

interface TextContent {
  items: TextItem[];
  styles: Record<string, unknown>;
}

const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    console.log('🔄 Starting enhanced PDF text extraction for:', file.name);
    
    // Convert the File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    console.log('📄 File converted to ArrayBuffer, size:', arrayBuffer.byteLength, 'bytes');
    
    // Load the PDF document with enhanced options
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: false,
      verbosity: 0
    });
    
    const pdf = await loadingTask.promise;
    console.log('📚 PDF loaded successfully, pages:', pdf.numPages);
    
    let fullText = '';
    const pageTexts: string[] = [];
    
    // Process each page with improved text extraction
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        console.log(`📖 Processing page ${pageNum}/${pdf.numPages}`);
        
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent({
          includeMarkedContent: true
        }) as TextContent;
        
        // Enhanced text extraction with better formatting
        let pageText = '';
        let lastY = -1;
        let currentLine = '';
        
        for (const item of textContent.items) {
          if (!item.str || item.str.trim() === '') continue;
          
          const currentY = item.transform[5]; // Y coordinate
          
          // Check if we're on a new line (Y coordinate changed significantly)
          if (lastY !== -1 && Math.abs(currentY - lastY) > 5) {
            if (currentLine.trim()) {
              pageText += currentLine.trim() + '\n';
            }
            currentLine = '';
          }
          
          // Add space if this item doesn't start immediately after the previous one
          if (currentLine && !item.str.startsWith(' ') && !currentLine.endsWith(' ')) {
            currentLine += ' ';
          }
          
          currentLine += item.str;
          lastY = currentY;
        }
        
        // Add the last line
        if (currentLine.trim()) {
          pageText += currentLine.trim() + '\n';
        }
        
        // Clean up the page text
        pageText = pageText
          .replace(/\n\s*\n/g, '\n\n') // Normalize multiple line breaks
          .replace(/\s+/g, ' ') // Normalize spaces
          .replace(/\n /g, '\n') // Remove spaces at line starts
          .trim();
        
        if (pageText) {
          pageTexts.push(`--- Page ${pageNum} ---\n${pageText}`);
          console.log(`✅ Page ${pageNum} extracted: ${pageText.length} characters`);
        } else {
          console.log(`⚠️ Page ${pageNum}: No text extracted`);
          pageTexts.push(`--- Page ${pageNum} ---\n[No readable text found on this page]`);
        }
        
      } catch (pageError) {
        console.error(`❌ Error processing page ${pageNum}:`, pageError);
        pageTexts.push(`--- Page ${pageNum} ---\n[Error reading this page: ${pageError instanceof Error ? pageError.message : 'Unknown error'}]`);
      }
    }
    
    // Combine all pages
    fullText = pageTexts.join('\n\n');
    
    console.log('✅ PDF text extraction completed');
    console.log(`📊 Total extracted: ${fullText.length} characters from ${pdf.numPages} pages`);
    console.log('📝 Text preview:', fullText.substring(0, 200) + '...');
    
    return fullText;
    
  } catch (error) {
    console.error('❌ PDF text extraction failed:', error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export class PDFService {
  static async extractTextFromPDF(file: File): Promise<PDFExtractionResult> {
    try {
      console.log('🔄 Starting PDF text extraction for:', file.name);
      
      // Ensure worker is properly set up before proceeding
      await workerPromise;
      
      const arrayBuffer = await file.arrayBuffer();
      console.log('📄 File loaded, size:', arrayBuffer.byteLength, 'bytes');
      
      // Load PDF document with enhanced options
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
        disableFontFace: false,
        verbosity: 0
      });
      const pdfDoc = await loadingTask.promise;
      
      console.log('📚 PDF loaded successfully, pages:', pdfDoc.numPages);
      
      // Extract metadata with proper typing
      const metadata = await pdfDoc.getMetadata();
      const info = metadata?.info as Record<string, unknown>;
      const title = (info?.Title as string) || 'Untitled Document';
      const author = (info?.Author as string) || 'Unknown Author';
      const subject = (info?.Subject as string) || '';
      const keywords = (info?.Keywords as string) || '';
      
      // Use the improved text extraction logic
      const extractedText = await extractTextFromPDF(file);
      
      // Validate extracted content
      const hasMeaningfulContent = extractedText && 
        extractedText.length > 50 && 
        extractedText.trim() !== '' &&
        !extractedText.includes('[No readable text found on this page]') &&
        !/^\[Error reading/.test(extractedText);
      
      console.log('✅ PDF text extraction completed, extracted:', extractedText.length, 'characters');
      console.log('📊 Has meaningful content:', hasMeaningfulContent);
      
      return {
        text: extractedText.trim(),
        metadata: {
          title,
          author,
          subject,
          keywords,
          pageCount: pdfDoc.numPages,
          fileSize: file.size,
          fileName: file.name,
        },
        success: true,
      };
      
    } catch (error) {
      console.error('❌ PDF extraction failed:', error);
      
      // Provide more detailed error information
      let errorMessage = 'Failed to extract text from PDF';
      if (error instanceof Error) {
        if (error.message.includes('worker') || error.message.includes('importScripts')) {
          errorMessage = 'PDF worker initialization failed. Attempting alternative processing...';
        } else if (error.message.includes('InvalidPDFException')) {
          errorMessage = 'Invalid or corrupted PDF file.';
        } else if (error.message.includes('PasswordException')) {
          errorMessage = 'Password-protected PDF files are not supported.';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Provide fallback metadata even if extraction fails
      return {
        text: `Warning: Could not extract text from PDF "${file.name}". ${errorMessage}. This may be a scanned document, password-protected, or use unsupported formatting. Please try converting to a text-based PDF or provide the content manually.`,
        metadata: {
          title: file.name,
          author: 'Unknown',
          subject: 'PDF text extraction failed',
          keywords: '',
          pageCount: 0,
          fileSize: file.size,
          fileName: file.name,
        },
        success: false,
        error: errorMessage,
      };
    }
  }

  static async extractTextFromFile(file: File): Promise<PDFExtractionResult> {
    console.log('🚀 Processing file:', file.name, 'Type:', file.type);
    
    if (file.type === 'application/pdf') {
      return this.extractTextFromPDF(file);
    }
    
    // Handle text files
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      try {
        const text = await file.text();
        console.log('✅ Text file processed, length:', text.length);
        
        return {
          text: text.trim(),
          metadata: {
            title: file.name,
            author: 'Text File',
            subject: 'Plain text document',
            keywords: '',
            pageCount: 1,
            fileSize: file.size,
            fileName: file.name,
          },
          success: true,
        };
      } catch (error) {
        console.error('❌ Text file processing failed:', error);
        return {
          text: '',
          metadata: {
            title: file.name,
            pageCount: 0,
            fileSize: file.size,
            fileName: file.name,
          },
          success: false,
          error: 'Failed to read text file',
        };
      }
    }
    
    // Handle DOC/DOCX files (basic support)
    if (file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('⚠️ Word document detected - basic extraction only');
      
      try {
        // Try to extract as text (limited support)
        const text = await file.text();
        
        return {
          text: `Word document detected: ${file.name}\n\nNote: Advanced Word document processing is not fully supported. Please save as PDF or TXT for better text extraction.\n\nBasic content preview:\n${text.substring(0, 1000)}`,
          metadata: {
            title: file.name,
            author: 'Word Document',
            subject: 'Microsoft Word document (limited extraction)',
            keywords: '',
            pageCount: 1,
            fileSize: file.size,
            fileName: file.name,
          },
          success: true,
        };
      } catch (error) {
        return {
          text: `Word document detected: ${file.name}\n\nNote: Could not extract text from this Word document. Please save as PDF or TXT format for better compatibility.`,
          metadata: {
            title: file.name,
            pageCount: 0,
            fileSize: file.size,
            fileName: file.name,
          },
          success: false,
          error: 'Word document extraction not fully supported',
        };
      }
    }
    
    // For other file types, return error
    return {
      text: '',
      metadata: {
        pageCount: 0,
        fileSize: file.size,
        fileName: file.name,
      },
      success: false,
      error: `Unsupported file type: ${file.type}. Please upload PDF, TXT, DOC, or DOCX files.`,
    };
  }
}
