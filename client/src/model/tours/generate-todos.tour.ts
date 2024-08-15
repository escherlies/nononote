import "@sjmc11/tourguidejs/src/scss/tour.scss" // Styles
import { TourGuideStep } from "@sjmc11/tourguidejs/src/types/TourGuideStep"
import { tourGuide } from "./tour"
import { publish } from "../api"

const steps: TourGuideStep[] = [
  {
    title: "Generate a To-Do List",
    content:
      "This feature allows you to generate a to-do list from your notes. Simply click the “Generate To-Do List” button to begin. Please note that when generating multiple to-do lists, only the notes up to the point of the last generated list will be included. Happy ticking! 😊",
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
    publish({ type: "smart-notes:create-todo-list" })
  })
}
