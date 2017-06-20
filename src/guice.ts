import { IBinder, IInjector } from './api';

type Bind = () => any;

export class Guice implements IBinder, IInjector {

    private binders = new Map<string, Bind>();

    public get<T>(name: string): T {
        if (!this.binders.has(name)) {
            throw new Error(`can't find module:${name}`);
        }

        return (this.binders.get(name) as Bind)();
    }

    public bind(name: string, factory: any): this {
        if (typeof factory === 'function') {
            this.binders.set(name, factory);
        } else {
            this.binders.set(name, () => {
                return factory;
            });
        }

        return this;
    }
}