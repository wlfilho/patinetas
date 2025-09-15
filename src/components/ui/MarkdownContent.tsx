'use client'

import { markdownToHtml } from '@/lib/markdown'

interface MarkdownContentProps {
  content: string
  className?: string
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  if (!content) {
    return null
  }

  const htmlContent = markdownToHtml(content)

  return (
    <div 
      className={`prose prose-gray max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}

// CSS styles for the prose content - add this to your global CSS or Tailwind config
export const markdownStyles = `
.prose {
  color: #374151;
  line-height: 1.75;
}

.prose p {
  margin-bottom: 1.25em;
}

.prose p:last-child {
  margin-bottom: 0;
}

.prose strong,
.prose b {
  font-weight: 600;
  color: #111827;
}

.prose em,
.prose i {
  font-style: italic;
}

.prose u {
  text-decoration: underline;
}

.prose strike,
.prose del {
  text-decoration: line-through;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  font-weight: 600;
  color: #111827;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.25;
}

.prose h1 {
  font-size: 2.25em;
}

.prose h2 {
  font-size: 1.875em;
}

.prose h3 {
  font-size: 1.5em;
}

.prose h4 {
  font-size: 1.25em;
}

.prose h5 {
  font-size: 1.125em;
}

.prose h6 {
  font-size: 1em;
}

.prose ul,
.prose ol {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.prose ul {
  list-style-type: disc;
}

.prose ol {
  list-style-type: decimal;
}

.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose li p {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

.prose blockquote {
  font-style: italic;
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  margin: 1.6em 0;
  color: #6b7280;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
}

.prose a:hover {
  color: #1d4ed8;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125em 0.25em;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  color: #1f2937;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1em;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5em 0;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
  color: inherit;
  font-size: inherit;
}

.prose hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 2em 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .prose h1 {
    font-size: 1.875em;
  }
  
  .prose h2 {
    font-size: 1.5em;
  }
  
  .prose h3 {
    font-size: 1.25em;
  }
}
`
