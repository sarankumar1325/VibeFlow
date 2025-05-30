
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';

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

interface PDFMetadataInfo {
  Title?: string;
  Author?: string;
  Subject?: string;
  Keywords?: string;
  [key: string]: any;
}

export class PDFService {
  static async extractTextFromPDF(file: File): Promise<PDFExtractionResult> {
    try {
      console.log('🔄 Starting PDF extraction for:', file.name);
      
      const arrayBuffer = await file.arrayBuffer();
      console.log('📄 File loaded, size:', arrayBuffer.byteLength, 'bytes');
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log('📚 PDF loaded successfully, pages:', pdf.numPages);
      
      let fullText = '';
      const metadata = await pdf.getMetadata();
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          
          fullText += pageText + '\n\n';
          console.log(`✅ Extracted text from page ${pageNum}/${pdf.numPages}`);
        } catch (pageError) {
          console.warn(`⚠️ Error extracting page ${pageNum}:`, pageError);
          continue;
        }
      }
      
      console.log('🎉 PDF extraction completed successfully');
      console.log('📊 Total text length:', fullText.length, 'characters');
      
      // Properly type the metadata info
      const metadataInfo = metadata.info as PDFMetadataInfo;
      
      return {
        text: fullText.trim(),
        metadata: {
          title: metadataInfo?.Title || 'Untitled Document',
          author: metadataInfo?.Author || 'Unknown Author',
          subject: metadataInfo?.Subject || '',
          keywords: metadataInfo?.Keywords || '',
          pageCount: pdf.numPages,
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
        error: error instanceof Error ? error.message : 'Unknown error occurred',
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
