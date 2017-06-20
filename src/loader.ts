import { IBinder, IInjector } from './api';
import fs = require('fs');
import path = require('path');
import log4js = require('log4js');
import { Module } from './module';

const logger = log4js.getLogger('guice');


export function load(binder: IBinder, injector: IInjector, name?: string) {

    if (!name) {
        name = 'guice.json';
    }

    const configpath = path.join(process.cwd(), 'config', name);

    if (!fs.existsSync(configpath) || !fs.statSync(configpath).isFile) {
        logger.warn(`can't find guice config in: ${configpath}`);
        return;
    }

    logger.debug(`found guice config file: ${configpath}`);

    let config: any;

    try {
        config = JSON.parse(fs.readFileSync(configpath).toString('UTF-8'));
    } catch (error) {
        logger.error(`load guice config file error`, error);
        return;
    }

    if (!config.root) {
        config.root = path.join(process.cwd(), 'dist');
    }

    if ((config.root as string).startsWith('.')) {
        config.root = path.join(process.cwd(), config.root);
    }

    logger.debug(`guice source root: ${config.root}`);

    for (const key in config.modules) {
        if (config.modules[key]) {
            logger.debug(`try bind module: ${key}`);
            const moduleConfig = config.modules[key];
            moduleConfig.name = key;
            binder.bind(key, new Module(injector, config.root, moduleConfig).factory());
        }
    }
}
