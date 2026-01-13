// Simple PDF extraction using pdf-utils
import { extractTextFromPDF } from './pdf-utils'

export async function extractPDFText(fileBuffer: ArrayBuffer): Promise<string> {
  // Use the multi-method PDF extraction that works client-side
  const text = await extractTextFromPDF(fileBuffer)
  
  if (!text || text.trim().length === 0) {
    throw new Error('IMAGE_PDF')
  }

  console.log(`✅ PDF text extracted: ${text.length} characters`)
  return text
}
