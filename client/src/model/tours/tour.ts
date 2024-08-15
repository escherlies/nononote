import "@sjmc11/tourguidejs/src/scss/tour.scss" // Styles
import { TourGuideClient } from "@sjmc11/tourguidejs/src/Tour" // JS

// ! Only one instance of the client should be created
// ? The tour guide breaks if we have multiple instances of the client 🥲
export const tourGuide = new TourGuideClient()
