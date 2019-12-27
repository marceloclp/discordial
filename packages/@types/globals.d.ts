declare type Constructable = Function & { new(...args: any[]): any };

declare type SpreadFunction = (...args: any[]) => any;

declare type Instance = Function & { [key: string]: SpreadFunction };

declare type SyntheticWrapper = Record<string, Instance>;

declare type InstanceMap = Map<string, Instance>;

declare type InstanceRecord = Record<string, Instance>;

declare type DynamicPlugin = { usePlugin: Constructable, config?: any };