import Monzod from "../lib/monzod"
import { MONGO_DB_URI } from "./config"
import { magicCode } from "./data/magicCode"
import { noteDecoder } from "./data/note"
import { user } from "./data/user"

const monzod = new Monzod({
  url: MONGO_DB_URI,
  db: "nononote",
  collections: {
    users: {
      schema: user,
      indexes: ["id", "email"],
    },
    magicCodes: {
      schema: magicCode,
      indexes: ["email", "magicCode"],
    },
    notes: {
      schema: noteDecoder,
      indexes: ["id", "userId"],
    },
  },
})

export default monzod
