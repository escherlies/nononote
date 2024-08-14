import "@sjmc11/tourguidejs/src/scss/tour.scss" // Styles
import { TourGuideClient } from "@sjmc11/tourguidejs/src/Tour" // JS
import { TourGuideStep } from "@sjmc11/tourguidejs/src/types/TourGuideStep"
import { saveNewNote, setNoteInput } from "./store"
import { navigateTo } from "./router"

const steps: TourGuideStep[] = [
  {
    title: "Welcome to nononote 👋",
    content: "This is a short guide to get you set up and show you where things are",
    beforeEnter: () => {
      navigateTo({ tag: "Home" })
    },
  },
  // Focus on the note input
  {
    title: "Note Input",
    content:
      "This is where you can write your notes. Just jot down whatever and the ai will take care of the rest",
    target: "#note-input",
    foo: "bar",
    beforeEnter: () => {
      setNoteInput("")
    },
  } as TourGuideStep,
  // Auto input some text into the input field
  {
    title: "Todo List",
    content: "To create a todo list, just write down your tasks like this...",
    target: "#note-input",
    beforeEnter: () => {
      setNoteInput(`buy groceries
pick up laundry
call mom
finish tour guide
        `)
    },
  } as TourGuideStep,
  // Auto input some text into the input field
  {
    title: "Todo List",
    content: "or like this... However you like it, the ai will take care of the rest",
    target: "#note-input",
    beforeEnter: () => {
      setNoteInput("buy groceries, pick up laundry, call mom, finish tour guide")
    },
  } as TourGuideStep,
  // Save note
  {
    title: "Save Note",
    content: "Let's save this note",
    target: "#save-new-note",
    beforeLeave: () => {
      saveNewNote()
    },
  },
  // Focus on the last note
  {
    title: "Last Note",
    content: "Aaaaaaaaaaand there's your last note containing your todo list",
    target: "#last-note-container",
  },
  // voice-and-file-container
  {
    title: "Voice Recorder and File Upload",
    content:
      "Click here to record your voice or upload a file. The content will be added to your note",
    target: "#voice-and-file-container",
  },

  // notes-button
  {
    title: "Notes",
    content: "Click here to see all your notes",
    target: "#notes-button",
  },
  // End
  {
    title: "That's it!",
    content: "You're all set. Enjoy your note taking experience!",
  },
].reverse()

const tg = new TourGuideClient({
  steps: steps,
  allowDialogOverlap: true,
  rememberStep: true,
})

export const startTour = () => {
  tg.start()
}
