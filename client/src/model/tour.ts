import "@sjmc11/tourguidejs/src/scss/tour.scss" // Styles
import { TourGuideClient } from "@sjmc11/tourguidejs/src/Tour" // JS
import { TourGuideStep } from "@sjmc11/tourguidejs/src/types/TourGuideStep"
import { saveNewNote, setNoteInput } from "./store"
import { navigateTo } from "./router"

const steps: TourGuideStep[] = [
  {
    title: "Welcome to Nononote 👋",
    content:
      "This quick tour will guide you through the setup and show you where everything is located.",
    beforeEnter: () => {
      navigateTo({ tag: "Home" })
    },
  },
  // Focus on the note input
  {
    title: "Note Input",
    content:
      "This is where you can start writing your notes. Just jot down your thoughts, and the AI will take care of the rest.",
    target: "#note-input",
    beforeEnter: () => {
      setNoteInput("")
    },
  } as TourGuideStep,
  // Auto input some text into the input field
  {
    title: "Creating a To-Do List",
    content: "To create a to-do list, simply write down your tasks like this...",
    target: "#note-input",
    beforeEnter: () => {
      setNoteInput(`buy groceries
pick up laundry
call mom
finish tour guide`)
    },
  } as TourGuideStep,
  // Auto input some text into the input field
  {
    title: "Alternate To-Do List Format",
    content:
      "Or, you can write your tasks like this... No matter the format, the AI will handle the rest.",
    target: "#note-input",
    beforeEnter: () => {
      setNoteInput("buy groceries, pick up laundry, call mom, finish tour guide")
    },
  } as TourGuideStep,
  // Save note
  {
    title: "Saving Your Note",
    content: "Let's save this note to keep your tasks organized.",
    target: "#save-new-note",
    beforeLeave: () => {
      saveNewNote()
    },
  },
  // Focus on the last note
  {
    title: "Viewing Your Last Note",
    content: "Here's your most recent note with your to-do list.",
    target: "#last-note-container",
  },
  // voice-and-file-container
  {
    title: "Voice Recorder and File Upload",
    content:
      "Click here to record a voice note or upload a file. The content will be added directly to your note.",
    target: "#voice-and-file-container",
  },

  // notes-button
  {
    title: "Accessing All Notes",
    content: "Click here to view all of your saved notes.",
    target: "#notes-button",
  },
  // End
  {
    title: "Tour Complete!",
    content: "You're all set. Enjoy taking notes with Nononote!",
  },
].map((step, index) => ({ ...step, order: index } as TourGuideStep))

const tg = new TourGuideClient({
  steps: steps,
  allowDialogOverlap: true,
  rememberStep: true,
})

export const startTour = () => {
  tg.start()
}
