/** A constructable object. */
export type Constructable<R> = { new (...args: any[]): R };

/** Always resolves to T. Provides better readibility. */
export type Instance<T> = InstanceType<Constructable<T>>;

/** Specific target type for advanced type utils. */
export type Target = Constructable<any> | Instance<any>;

/** A function used to transform a dependency after instantiation or before injection. */
export type TransformerFunction<T, R> = (target: T, ...args: DependencyWrapper[]) => R | Promise<R>;

/** A key that is used to access the injectables cache by a secondary name instead of the Class itself. */
export type Token = Symbol | string | Constructable<any>;

/** A transformer function may receive any number of dependencies it requires. */
export type DependencyWrapper = { token: Token } | any;

/** Type util to remove undefined from a type. */
export type NonUndefined<A> = A extends undefined ? never : A;

/** Type util to remove undefined from an object. */
export type NonUndefinedField<T> = { [P in keyof T]-?: NonUndefined<T[P]> };