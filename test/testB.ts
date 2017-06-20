import log4js = require('log4js');
import assert = require('assert');
const logger = log4js.getLogger('guice');

logger.debug('##########', __dirname, __filename);

export default class TestB {
    constructor(testA: any) {
        assert(testA);
    }
}