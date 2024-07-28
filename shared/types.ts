/**
 * A generic type that combines a tag with additional properties.
 *
 * @template Tag - The string literal type for the tag.
 * @template U - An optional type for additional properties (default is an empty object).
 * @typedef {Object} T
 * @property {Tag} tag - The tag property.
 */
export type T<Tag extends string, U = {}> = { tag: Tag } & U;

export type Maybe<T> = T | null;
