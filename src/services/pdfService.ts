
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for Vite environment - use CDN to avoid bundling issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
    [key: string]: any;
  };
}

const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Convert the File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Iterate through each page to extract text
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map((item: any) => item.str).join(' ');
      
      fullText += textItems + '\n\n';
    }
    
    console.log("Extracted PDF text:", fullText.substring(0, 100) + "...");
    return fullText;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

export class PDFService {
  static async extractTextFromPDF(file: File): Promise<PDFExtractionResult> {
    try {
      console.log('🔄 Starting PDF text extraction for:', file.name);
      
      const arrayBuffer = await file.arrayBuffer();
      console.log('📄 File loaded, size:', arrayBuffer.byteLength, 'bytes');
      
      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      
      console.log('📚 PDF loaded successfully, pages:', pdfDoc.numPages);
      
      // Extract metadata with proper typing
      const metadata = await pdfDoc.getMetadata() as PDFMetadata;
      const title = metadata?.info?.Title || 'Untitled Document';
      const author = metadata?.info?.Author || 'Unknown Author';
      const subject = metadata?.info?.Subject || '';
      const keywords = metadata?.info?.Keywords || '';
      
      // Use the improved text extraction logic
      const extractedText = await extractTextFromPDF(file);
      
      console.log('✅ PDF text extraction completed, extracted:', extractedText.length, 'characters');
      
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
      return {
        text: '',
        metadata: {
          pageCount: 0,
          fileSize: file.size,
          fileName: file.name,
        },
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract text from PDF',
      };
    }
  }

  static async extractTextFromFile(file: File): Promise<PDFExtractionResult> {
    if (file.type === 'application/pdf') {
      return this.extractTextFromPDF(file);
    }
    
    // Handle text files
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      try {
        const text = await file.text();
        return {
          text,
          metadata: {
            pageCount: 1,
            fileSize: file.size,
            fileName: file.name,
          },
          success: true,
        };
      } catch (error) {
        return {
          text: '',
          metadata: {
            pageCount: 0,
            fileSize: file.size,
            fileName: file.name,
          },
          success: false,
          error: 'Failed to read text file',
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
      error: 'Unsupported file type. Please upload PDF or TXT files.',
    };
  }
}
