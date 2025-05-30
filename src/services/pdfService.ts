
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for Vite environment
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

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
      
      let extractedText = '';
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        try {
          console.log(`📖 Processing page ${pageNum}/${pdfDoc.numPages}`);
          
          const page = await pdfDoc.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Combine all text items from the page
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          
          if (pageText.trim()) {
            extractedText += `\n\n--- Page ${pageNum} ---\n${pageText.trim()}`;
          }
          
        } catch (pageError) {
          console.warn(`⚠️ Error processing page ${pageNum}:`, pageError);
          extractedText += `\n\n--- Page ${pageNum} ---\n[Error extracting text from this page]`;
        }
      }
      
      // Clean up the extracted text
      extractedText = extractedText.trim();
      
      if (!extractedText || extractedText.length < 10) {
        extractedText = `PDF Document: ${title}
Author: ${author}
Subject: ${subject}
Keywords: ${keywords}
Pages: ${pdfDoc.numPages}

⚠️ Warning: Limited text extraction. This PDF may contain images, scanned content, or complex formatting.
Please provide the project requirements manually or upload a text version for better AI processing.`;
      }
      
      console.log('✅ PDF text extraction completed, extracted:', extractedText.length, 'characters');
      
      return {
        text: extractedText,
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
