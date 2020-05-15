export interface Dial {
    readonly dial: Constructable;

    readonly config?: any;

    readonly inject?: any[];

    readonly providers?: any[];

    readonly controllers?: any[];
}