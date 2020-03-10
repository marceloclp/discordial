/** A constructable object. */
type Constructable<R = any> = { new (...args: any[]): R };

/** A function used to transform a dependency after instantiation or before injection. */
type TransformerFunction<T = any, R = any> = (target: T, ...args: DependencyWrapper[]) => R | Promise<R>;

/** A key that is used to access the injectables cache by a secondary name instead of the Class itself. */
type Token = Symbol | string | Constructable;

/** A transformer function may receive any number of dependencies it requires. */
type DependencyWrapper = { token: Token } | any;