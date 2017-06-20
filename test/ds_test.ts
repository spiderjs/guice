import {
    only, skip, slow, suite, test, timeout
} from 'mocha-typescript';

import assert = require('assert');
import guice = require('../src');


@suite('datasource test')
class DataSourceTest {
    @test('bind test')
    public bindTest() {
        guice.binder
            .bind('test', this)
            .bind<any>('test2', () => {
                return {};
            });
    }

    @test('injector test')
    public injectTest() {
        assert(guice.injector.get('test'));
        assert(guice.injector.get('test') === guice.injector.get('test'));
        assert(guice.injector.get('test2'));
        assert(guice.injector.get('test2') !== guice.injector.get('test2'));
    }

    @test('test loader')
    public loadTest() {
        guice.load(guice.binder, guice.injector);

        assert(guice.injector.get('testB'));
    }
};

