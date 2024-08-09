import React, { useState } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import { checkTodoOfNote } from "../../model/store"

interface MarkdownCheckboxProps {
  noteId: string
  markdown: string
}

export const MarkdownCheckbox: React.FC<MarkdownCheckboxProps> = ({ noteId, markdown }) => {
  const components: Partial<Components> = {
    li: ({ node, ...props }: any) => {
      const item = props.children as string

      const unchecked = item.startsWith("[ ]")
      const checked = item.startsWith("[x]")
      const isCheckbox = checked || unchecked

      const contentFormatted = props.children.replace("[ ] ", "").replace("[x] ", "")

      if (isCheckbox) {
        // Toggle
        return (
          <div className="flex gap-2">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => checkTodoOfNote(noteId, item)}
            />
            <div className={checked ? "line-through" : ""}>{contentFormatted}</div>
          </div>
        )
      }

      return <li {...props}></li>
    },
  }

  return <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
}
