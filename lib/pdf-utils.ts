import * as pdfjsLib from 'pdfjs-dist'

// Initialize PDF.js worker - Use local worker file
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
  console.log('✅ PDF.js worker configured:', pdfjsLib.GlobalWorkerOptions.workerSrc)
}

// Enhanced text extraction with multiple fallback methods - EXTREMELY PERMISSIVE
export async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  console.log('🔍 Starting PDF extraction...', `Size: ${arrayBuffer.byteLength} bytes`)
  console.log('📦 PDF.js version:', pdfjsLib.version)
  console.log('🔧 Worker source:', pdfjsLib.GlobalWorkerOptions.workerSrc)
  
  let extractedText = ""
  let bestAttempt = { text: "", length: 0 }
  
  // Method 1: Standard PDF.js extraction (most reliable)
  try {
    console.log('📄 Method 1: Standard PDF.js extraction...')
    extractedText = await extractWithPDFJS(arrayBuffer)
    console.log(`Method 1 result: "${extractedText?.substring(0, 100)}..." (${extractedText?.trim().length || 0} total chars)`)
    
    if (extractedText && extractedText.trim().length > 0) {
      console.log(`✅ Method 1 Success! Extracted ${extractedText.length} characters`)
      return extractedText
    }
    
    if (extractedText && extractedText.trim().length > bestAttempt.length) {
      bestAttempt = { text: extractedText, length: extractedText.trim().length }
    }
  } catch (error1: any) {
    console.error('⚠️ Method 1 failed:', error1?.message || error1)
  }
  
  // Method 2: Simple extraction (more permissive)
  try {
    console.log('Method 2: Simple text extraction...')
    const simpleText = await extractSimpleText(arrayBuffer)
    
    if (simpleText && simpleText.trim().length > 0) {
      console.log(`✅ Method 2 Success! Extracted ${simpleText.length} characters`)
      return simpleText
    }
    
    if (simpleText.trim().length > bestAttempt.length) {
      bestAttempt = { text: simpleText, length: simpleText.trim().length }
    }
  } catch (error2) {
    console.warn('Method 2 failed:', error2)
  }

  // Method 3: Raw stream extraction
  try {
    console.log('Method 3: Raw stream extraction...')
    const streamText = await extractFromStream(arrayBuffer)
    
    if (streamText && streamText.trim().length > 0) {
      console.log(`✅ Method 3 Success! Extracted ${streamText.length} characters`)
      return streamText
    }
    
    if (streamText.trim().length > bestAttempt.length) {
      bestAttempt = { text: streamText, length: streamText.trim().length }
    }
  } catch (error3) {
    console.warn('Method 3 failed:', error3)
  }

  // Method 4: Character-by-character extraction
  try {
    console.log('Method 4: Character extraction...')
    const charText = await extractByCharacters(arrayBuffer)
    
    if (charText && charText.trim().length > 0) {
      console.log(`✅ Method 4 Success! Extracted ${charText.length} characters`)
      return charText
    }
    
    if (charText.trim().length > bestAttempt.length) {
      bestAttempt = { text: charText, length: charText.trim().length }
    }
  } catch (error4) {
    console.warn('Method 4 failed:', error4)
  }
  
  // EXTREMELY LENIENT: Accept ANY text we got
  if (bestAttempt.text && bestAttempt.length > 0) {
    console.log(`✅ Returning ${bestAttempt.length} characters from PDF`)
    return bestAttempt.text
  }
  
  // No text found - image-based/scanned PDF
  console.log('❌ No text found in any extraction method')
  throw new Error('IMAGE_PDF')
}

// Standard PDF.js text extraction
async function extractWithPDFJS(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ 
    data: arrayBuffer,
    verbosity: 0,
    useSystemFonts: true,
    standardFontDataUrl: undefined
  }).promise
  
  let fullText = ""
  const numPages = Math.min(pdf.numPages, 100)
  console.log(`📖 PDF has ${pdf.numPages} pages, processing first ${numPages}...`)

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      // Extract all text from items
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .filter((str: string) => str.trim().length > 0)
        .join(' ')
      
      if (pageText.length > 0) {
        fullText += pageText + '\n'
        console.log(`📄 Page ${pageNum}: extracted ${pageText.length} chars`)
      } else {
        console.log(`⚠️ Page ${pageNum}: no text found`)
      }
    } catch (pageError) {
      console.warn(`❌ Page ${pageNum} error:`, pageError)
    }
  }

  console.log(`📊 Total extracted from Method 1: ${fullText.trim().length} characters`)
  return cleanPDFText(fullText)
}

// Simple text extraction (more permissive)
async function extractSimpleText(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  
  let fullText = ""
  const numPages = Math.min(pdf.numPages, 50)

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      // Simple concatenation
      for (const item of textContent.items) {
        const text = (item as any).str
        if (text) {
          fullText += text + ' '
        }
      }
    } catch (e) {
      console.warn(`Simple extraction page ${pageNum} error:`, e)
    }
  }

  return cleanPDFText(fullText)
}

// Helper function to clean extracted text
export function cleanPDFText(text: string): string {
  return text
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "") // Remove control characters
    .trim()
}

export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\w\s@.,\-()\/]/g, "")
    .trim()
}

// Method 3: Extract from raw stream
async function extractFromStream(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ""
  
  for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
    try {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      
      // Extract with different approach
      for (const item of textContent.items) {
        const text = (item as any).str
        if (text && text.trim()) {
          fullText += text + ' '
        }
      }
    } catch (e) {
      continue
    }
  }
  
  return cleanPDFText(fullText)
}

// Method 4: Character-by-character extraction
async function extractByCharacters(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer,
      cMapUrl: undefined,
      cMapPacked: undefined
    }).promise
    
    let fullText = ""
    
    for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
      try {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        
        // Try to get structure
        if (textContent.items && Array.isArray(textContent.items)) {
          for (const item of textContent.items) {
            if ((item as any).str) {
              fullText += (item as any).str
            }
          }
        }
      } catch (e) {
        continue
      }
    }
    
    return cleanPDFText(fullText)
  } catch (e) {
    throw e
  }
}
