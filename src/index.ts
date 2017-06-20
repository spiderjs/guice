export * from './api';
export * from './loader';
export * from './guice';
export * from './module';
import api = require('./api');
import guice = require('./guice');

const instance = new guice.Guice();

export const injector: api.IInjector = instance;
export const binder: api.IBinder = instance;