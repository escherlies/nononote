/**
 * A generic type that combines a tag with additional properties.
 *
 * @template Tag - The string literal type for the tag.
 * @template U - An optional type for additional properties (default is an empty object).
 * @typedef {Object} T
 * @property {Tag} tag - The tag property.
 */
export type T<Tag extends string, U = {}> = { tag: Tag } & U;

export const tag = <Tag extends string, U = {}>(
  tag: Tag,
  props: U
): T<Tag, U> => ({ tag, ...props });

export type Maybe<T> = T | null;
