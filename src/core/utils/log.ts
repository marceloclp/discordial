export const log = (msg: Function): void => {
    try {
        console.log(msg());
    } catch (e) {}
}