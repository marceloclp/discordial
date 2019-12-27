export enum SyntheticObjectKey {
  DEFAULT = 'default',
  OLD = 'old',
  NEW = 'new',
};

export class SyntheticObject<T> {
  constructor(
    private readonly _entity: T,

    private readonly _key?: SyntheticObjectKey,
  ) {}

  get entity(): T {
    return this._entity;
  }

  public is(key: SyntheticObjectKey): boolean {
    return key === this._key;
  }
}