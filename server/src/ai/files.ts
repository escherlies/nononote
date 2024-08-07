// To use the File API, add the following import path for GoogleAIFileManager.
// Note that this is a different import path than used for generating content.
// For versions lower than @google/generative-ai@0.13.0
// use "@google/generative-ai/files"
import { GoogleAIFileManager } from "@google/generative-ai/server"
import { GOOGLE_GENERATIVE_AI_API_KEY } from "../config"

// Upload the file.
export const fileManager = new GoogleAIFileManager(GOOGLE_GENERATIVE_AI_API_KEY)

export const uploadFileToAIFileManager = async (filepath: string, mimeType: string) => {
  return fileManager.uploadFile(filepath, { mimeType: mimeType })
}
