import "reflect-metadata";
import "jest";
import { InjectablesManager } from "../container/injectables-manager";
import { Injectable } from "../../common/decorators/injectable";

describe('Injectables Manager', () => {
    @Injectable() class Injectable1 {}
    @Injectable() class Injectable2 {}
    @Injectable() class Injectable3 {}

    let injectablesManager: InjectablesManager;

    beforeEach(() => {
        injectablesManager = new InjectablesManager();
    });

    test('get() returns Injectable1', () => {
        const result = injectablesManager.get(Injectable1);
        expect(result).toBe(Injectable1);
    });

    test('get() returns Injectable2', () => {
        const result = injectablesManager.get(Injectable2);
        expect(result).toBe(Injectable2);
    });

    test('get() returns Injectable3', () => {
        const result = injectablesManager.get(Injectable3);
        expect(result).toBe(Injectable3);
    });

    test('setInstance()', () => {
        const instance = new Injectable1();
        injectablesManager.setInstance(Injectable1, instance);
    });

    test('getInstance()', () => {
        const instance = new Injectable1();
        injectablesManager.setInstance(Injectable1, instance);
        const result = injectablesManager.getInstance(Injectable1);
        expect(result).toBe(instance);
    });

    test('hasInstance()', () => {
        const instance = new Injectable1();
        injectablesManager.setInstance(Injectable1, instance);
        const result = injectablesManager.hasInstance(Injectable1);
        expect(result).toBeTruthy();
    });
});