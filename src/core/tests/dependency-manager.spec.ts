import "reflect-metadata";
import "jest";
import { Injectable } from "../../common/decorators/injectable";
import { DependencyManager } from "../container/dependency-manager";
import { InjectablesManager } from "../container/injectables-manager";
import { Inject } from "../../common/decorators/inject";
import { Scope } from "../../common/enums";

@Injectable() class Injectable1 {}

@Injectable() class Injectable2 {
    constructor(
        @Inject(Injectable1) private readonly injectable1: Injectable1
    ) {}
}

@Injectable() class Injectable3 {
    constructor(
        @Inject(Injectable2) private readonly injectable2: Injectable2,
    ) {}
}

@Injectable() class Injectable4 {
    constructor(
        @Inject(Injectable1) private readonly injectable1: Injectable1,
        @Inject(Injectable2) private readonly injectable2: Injectable2,
        @Inject(Injectable3) private readonly injectable3: Injectable2,
    ) {}
}

@Injectable({
    scope: Scope.SINGLETON,
    registerAsync: async (_: typeof Injectable5) => {
        return _.registerAsync();
    }
})
class Injectable5 {
    static async registerAsync() {
        return new Injectable5();
    }
}

@Injectable({
    scope: Scope.SINGLETON,
    registerAsync: async (_: typeof Injectable6, name: string, injectable5: Injectable5) => {
        return _.registerAsync("asdsad", injectable5);
    },
    inject: ["this is the name", { token: Injectable5 }],
})
class Injectable6 {
    constructor(
        private readonly name: string,

        public readonly injectable5: Injectable5,
    ) {}

    static async registerAsync(name: string, injectable5: Injectable5) {
        return new Injectable6(name, injectable5);
    }
}

describe('Dependency Manager', () => {
    
    let injectablesManager: InjectablesManager;
    let dependencyManager: DependencyManager;

    beforeEach(() => {
        injectablesManager = new InjectablesManager();
        dependencyManager = new DependencyManager(injectablesManager);
    });

    describe('resolveInstanceByToken()', () => {
        test('Constructor with height 0', async () => {
            const instance = await dependencyManager
                .resolveToken(Injectable1);
            expect(instance).toBeInstanceOf(Injectable1);
        });

        test('Constructor with height 1', async () => {
            const instance = await dependencyManager
                .resolveToken(Injectable2);
            expect(instance).toBeInstanceOf(Injectable2);
        });

        test('Constructor with height 2', async () => {
            const instance = await dependencyManager
                .resolveToken(Injectable3);
            expect(instance).toBeInstanceOf(Injectable3);
        });

        describe('Constructor with multiple dependencies', () => {
            let instance: Injectable4;
            beforeAll(async () => {
                instance = await dependencyManager
                    .resolveToken(Injectable4);
            })
            test('instance is valid', () => {
                expect(instance).toBeInstanceOf(Injectable4);
            });
            test('to have dependency 1', () => {
                expect(instance).toHaveProperty('injectable1');
            });
            test('to have dependency 2', () => {
                expect(instance).toHaveProperty('injectable2');
            });
            test('to have dependency 3', () => {
                expect(instance).toHaveProperty('injectable3');
            });
        });

        test('Async registering', async () => {
            const instance = await dependencyManager
                .resolveToken(Injectable5);
            expect(instance).toBeInstanceOf(Injectable5);
        });

        describe('Async registering with injection parameters', () => {
            let instance: Injectable6;
            beforeAll(async () => {
                instance = await dependencyManager
                    .resolveToken(Injectable6);
            });
            test('instance is valid', () => {
                expect(instance).toBeInstanceOf(Injectable6);
            });
            test('to have property name', () => {
                expect(instance).toHaveProperty('name');
            });
            test('to have dependency 5', () => {
                expect(instance).toHaveProperty('injectable5');
            });
            test('dependecy 3 to be instance of injectable 5', () => {
                expect(instance.injectable5).toBeInstanceOf(Injectable5);
            });
        });
    });
});