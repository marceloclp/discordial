type NonNullableFields<T> = { [K in keyof T]-?: NonNullable<T[K]> };

type Promisify<T> = T | Promise<T>;