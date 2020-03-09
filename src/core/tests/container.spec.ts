import "reflect-metadata";
import "jest";
import { Plugin } from "../../common/decorators/plugin";
import { Controller } from "../../common/decorators/controller";
import { Container } from "../container/container";
import { PluginWrapper } from "../interfaces/plugin-wrapper";
import { Logger } from "../logger/logger";

@Controller()
class MyController {}

@Plugin({ controllers: [MyController] })
class MyPlugin {
    static register(): PluginWrapper {
        return {
            usePlugin: MyPlugin,
            useConfig: {}
        }
    }
}

describe('Container', () => {
    let container: Container;

    beforeEach(() => {
        container = new Container(new Logger());
    });

    describe('startPlugins()', () => {
        test('with constructable', async () => {
            await container.startPlugins([MyPlugin]);
            const controller = container.getControllers().get(MyController);
            expect(controller).toBeInstanceOf(MyController);
        });

        test('with plugin wrapper', async () => {
            await container.startPlugins([MyPlugin.register()]);
            const controller = container.getControllers().get(MyController);
            expect(controller).toBeInstanceOf(MyController);
        });

        test('with invalid input', async () => {
            expect(
                (container as any).startPlugins([{ invalid: true }])
            ).rejects.toThrowError();
        });
    });
});