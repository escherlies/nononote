import React, { useEffect, useState } from "react"
import { marked } from "marked"
import DOMPurify from "dompurify"

interface MarkdownProps {
  content: string
  className?: string
}

const Markdown: React.FC<MarkdownProps> = ({ content, className }) => {
  const [sanitizedContent, setSanitizedContent] = useState<string>("")

  useEffect(() => {
    if (content) {
      const html = marked(content.trim(), { async: false }) as string
      const sanitizedHtml = DOMPurify.sanitize(html)
      setSanitizedContent(sanitizedHtml)
    }
  }, [content])

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
}

export default Markdown
