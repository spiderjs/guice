export interface IInjector {
    /**
     * @param  {string} name the class name
     * @returns T
     */
    get<T>(name: string): T;
}

export type Factory<T> = () => T;

export interface IBinder {
    bind<T>(name: string, factory: T | Factory<T>): this;
}
