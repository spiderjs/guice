import { IBinder, IInjector } from './api';
import fs = require('fs');
import path = require('path');
import process = require('process');
import log4js = require('log4js');
import vm = require('vm');
import util = require('util');
import cs = require('typescript-collections');
const logger = log4js.getLogger('guice');

// tslint:disable-next-line:interface-name
export interface ModuleConfig {
    name: string;
    singleton?: boolean;
    module: string;
    inject?: string[];
};


const checker = new cs.Stack<string>();

export class Module {
    private singleton: any;
    private creator: any;
    constructor(private injector: IInjector, private root: string, private moduleConfig: ModuleConfig) {
        if (moduleConfig.module.startsWith('.')) {
            moduleConfig.module = path.join(root, moduleConfig.module);

            if (fs.existsSync(moduleConfig.module)) {
                moduleConfig.module = path.join(moduleConfig.module, 'index');
            }

            // moduleConfig.module = moduleConfig.module + '.js';

            // logger.debug(`module path: ${moduleConfig.module}`);

            // const code = require('module').wrap(fs.readFileSync(moduleConfig.module).toString());

            // const context: any[] = [
            //     {}, require, module, moduleConfig.module, path.dirname(moduleConfig.module),
            // ];



            // vm.runInThisContext(code)(...context);
        }

        logger.debug(`module path: ${moduleConfig.module}`);

        this.creator = require(moduleConfig.module).default;
    }

    public factory(): () => any {
        return () => {
            logger.debug(`injector obj[${this.moduleConfig.name}] ...`);
            if (this.moduleConfig.singleton && this.singleton) {
                logger.debug(`injector obj[${this.moduleConfig.name}]: ${this.singleton}`);
                return this.singleton;
            }

            let obj: any;

            if (checker.contains(this.moduleConfig.name)) {
                let check = '*' + this.moduleConfig.name;

                checker.forEach((n) => {
                    if (this.moduleConfig.name === n) {
                        check = check + '->*' + n;
                    } else {
                        check = check + '->' + n;
                    }

                });

                throw new Error(`guice DAG check -- failed\n\t${check}`);
            }

            checker.push(this.moduleConfig.name);

            if (this.moduleConfig.inject) {
                const params = [] as any[];

                for (const key of this.moduleConfig.inject) {
                    params.push(this.injector.get(key));
                }

                obj = new this.creator(...params);
            } else {
                obj = new this.creator();
            }

            if (this.moduleConfig.singleton) {
                this.singleton = obj;
            }

            checker.pop();

            logger.debug(`injector obj[${this.moduleConfig.name}]: ${obj}`);

            return obj;
        };
    }
}