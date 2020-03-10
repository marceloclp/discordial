/** Union of T and Promise<T>. */
type Promisify<T = any> = T | Promise<T>;

/** Type util to remove undefined from a type. */
type NonUndefined<A> = A extends undefined ? never : A;

/** Type util to remove undefined from an object. */
type NonNullableFields<T> = { [K in keyof T]-?: NonNullable<T[K]> };