import { customAlphabet } from "nanoid"

const lowercaseDict = "abcdefghijklmnopqrstuvwxyz"
const uppercaseDict = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const numbersDict = "0123456789"
// const nolookalikesDict = "346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz"
// const nolookalikesSafeDict = "6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz"
// const hecadecimalLowercaseDict = numbersDict + "abcdef"
const alphanumericDict = numbersDict + lowercaseDict + uppercaseDict

export const genMagicCode = customAlphabet(numbersDict, 6) // without 0oOiIlL1

export const safeid = (prefix: string) => prefix + customAlphabet(alphanumericDict, 21)()

export const safeid32 = customAlphabet(alphanumericDict, 32)
