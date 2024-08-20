import "@sjmc11/tourguidejs/src/scss/tour.scss" // Styles
import { TourGuideStep } from "@sjmc11/tourguidejs/src/types/TourGuideStep"
import { tourGuide } from "./tour"
import { generateTodoList } from "../store"

const steps: TourGuideStep[] = [
  {
    title: "Generate a To-Do List",
    content: `This feature enables you to effortlessly create a to-do list from your notes. Just click the 'Generate To-Do List' button to get started.

When generating multiple to-do lists, only the notes up to the most recently created list will be included. Any open tasks from the last generated list will also be carried over, ensuring that your current to-dos are always in one place.

Happy tasking! 😊`,
  } as TourGuideStep,
].map((step, index) => ({ ...step, order: index } as TourGuideStep))

export const startGenerateTodosTour = () => {
  tourGuide.setOptions({
    steps,
    allowDialogOverlap: true,
    finishLabel: "Got it!",
  })
  tourGuide.start()
  tourGuide.onFinish(() => {
    generateTodoList()
  })
}
