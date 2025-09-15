import { marked } from 'marked'

// Configure marked options for better security and formatting
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true, // Enable GitHub Flavored Markdown
})

// Simple HTML sanitizer for basic security
const sanitizeHtml = (html: string): string => {
  // Allow only safe HTML tags and attributes
  const allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'strike', 'del',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote',
    'a', 'code', 'pre',
    'hr'
  ]

  const allowedAttributes = ['href', 'title', 'target', 'rel']

  // Remove script tags and other dangerous elements
  let sanitized = html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/<form[^>]*>.*?<\/form>/gi, '')
    .replace(/<input[^>]*>/gi, '')
    .replace(/<button[^>]*>.*?<\/button>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: URLs

  // Add target="_blank" and rel="noopener noreferrer" to external links
  sanitized = sanitized.replace(
    /<a\s+href="(https?:\/\/[^"]+)"([^>]*)>/gi,
    '<a href="$1" target="_blank" rel="noopener noreferrer"$2>'
  )

  return sanitized
}

/**
 * Convert markdown text to sanitized HTML
 * @param markdown - The markdown text to convert
 * @returns Sanitized HTML string
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return ''
  }

  try {
    // Convert markdown to HTML
    const rawHtml = marked(markdown) as string

    // Sanitize the HTML
    const cleanHtml = sanitizeHtml(rawHtml)

    return cleanHtml
  } catch (error) {
    console.error('Error converting markdown to HTML:', error)
    // Return the original text as fallback
    return markdown
  }
}

/**
 * Convert markdown to plain text (strip all formatting)
 * @param markdown - The markdown text to convert
 * @param maxLength - Optional maximum length for truncation
 * @returns Plain text string
 */
export function markdownToPlainText(markdown: string, maxLength?: number): string {
  if (!markdown || typeof markdown !== 'string') {
    return ''
  }

  try {
    // Convert to HTML first
    const html = markdownToHtml(markdown)
    
    // Strip HTML tags to get plain text
    const plainText = html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .trim()

    // Truncate if maxLength is specified
    if (maxLength && plainText.length > maxLength) {
      return plainText.substring(0, maxLength).trim() + '...'
    }

    return plainText
  } catch (error) {
    console.error('Error converting markdown to plain text:', error)
    return markdown
  }
}

/**
 * Check if text contains markdown formatting
 * @param text - The text to check
 * @returns Boolean indicating if markdown formatting is detected
 */
export function hasMarkdownFormatting(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false
  }

  // Common markdown patterns
  const markdownPatterns = [
    /\*\*.*?\*\*/, // Bold
    /\*.*?\*/, // Italic
    /_.*?_/, // Italic/Underline
    /`.*?`/, // Inline code
    /^#{1,6}\s/, // Headers
    /^\s*[-*+]\s/, // Unordered lists
    /^\s*\d+\.\s/, // Ordered lists
    /^\s*>\s/, // Blockquotes
    /\[.*?\]\(.*?\)/, // Links
    /^---+$/, // Horizontal rules
    /```/, // Code blocks
  ]

  return markdownPatterns.some(pattern => pattern.test(text))
}

/**
 * Get a preview of markdown content (first paragraph or sentence)
 * @param markdown - The markdown text
 * @param maxLength - Maximum length for the preview
 * @returns Preview text
 */
export function getMarkdownPreview(markdown: string, maxLength: number = 160): string {
  if (!markdown) return ''

  // Convert to plain text first
  const plainText = markdownToPlainText(markdown)
  
  // Get first paragraph or sentence
  const firstParagraph = plainText.split('\n')[0]
  const firstSentence = firstParagraph.split('.')[0]
  
  // Use the shorter of first sentence or first paragraph
  const preview = firstSentence.length < firstParagraph.length && firstSentence.length > 20
    ? firstSentence + '.'
    : firstParagraph

  // Truncate if needed
  if (preview.length > maxLength) {
    return preview.substring(0, maxLength).trim() + '...'
  }

  return preview
}
