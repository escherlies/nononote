import { Note } from "../../../server/src/data/note"

export const generateSmartTodoListFromNotes = (notes: Note[]): string => {
  const todos = notes
    .filter((note) => !note.deleted)
    .map(extractTodosFromNote)
    .flat()
    .join("\n")

  return todos
}

function extractTodosFromNote(note: Note): string[] {
  if (note.categories.includes("todo")) {
    // If the note is classified as a todo, extract the todos with a lax regex
    return extractTodosFromNoteContent(note.text, true)
  } else {
    // If the note is not classified as a todo, extract the todos with a strict regex
    return extractTodosFromNoteContent(note.text, false)
  }

  // TODO: Implement ai to extract todos from note
}

function extractTodosFromNoteContent(noteContent: string, lax: boolean): string[] {
  // Define a regular expression to match both TODO items and normal dashes
  const todoRegexNormal = /^\s*-\s\[[\sx]\]\s.*$/gm
  const todoRegexLax = /^\s*-\s(\[[\sx]\]\s.*|.*)$/gm // Allow for missing checkboxes

  const todoRegex = lax ? todoRegexLax : todoRegexNormal

  // Use the match method to find all lines that match the TODO or dash format
  const todos = noteContent.match(todoRegex)

  // If there are no matches, return an empty array
  if (!todos) {
    return []
  }

  // Return the matched items
  return todos
}
