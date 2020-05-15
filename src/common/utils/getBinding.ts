export const getBinding = (
    Binding: Constructable,
    key: Bindings,
    target: any,
    args: any[],
) => {
    if (!Reflect.has(target, key)) {
        const binding = new Binding(...args);
        Reflect.set(target, key, binding);
    }
    return Reflect.get(target, key);
}