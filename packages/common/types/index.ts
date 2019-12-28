export type Constructable<T> = Function & { new (...args: any[]): T };

export type SpreadFunction = (...args: any[]) => any;

export type Instance = Function & { [key: string]: SpreadFunction };

export type SyntheticWrapper = Record<string, Instance>;

export type InstanceMap = Map<string, Instance>;

export type InstanceRecord = Record<string, Instance>;