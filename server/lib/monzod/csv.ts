



/** Some CSV helpers to parse CSV with monzod

Basic considerations:
A CSV parser might bring all values as strings, so we need to convert them to the correct type.

A zod schema definition should therefore parse strings, and then convert them to the correct type.

Notes:
  - z.coerce.number() will convert empty strings to 0, which is not what we want.

*/

export const toNumberOrNull = (str: string) => {
  const n = Number.parseFloat(str)
  return isNaN(n) ? null : n
}

