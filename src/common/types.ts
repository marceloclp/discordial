/** Type utils. */
declare type Require<T> = { [K in keyof T]-?: T[K] };

declare type Ctor<T extends Constructable> = ConstructorParameters<T>;

declare type OptionalCtor<T extends Constructable> = Partial<Ctor<T>>;


/** Types. */
declare type Token = Symbol | string | Constructable;

declare type Promisify<T> = T | Promise<T>;

declare type Constructable<T = any> = new (...args: any[]) => T;

declare type TransformerFn<T = any, R = any> = (target: T, ...args: any[]) => Promisify<R>;