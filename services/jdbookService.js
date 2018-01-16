const util = require('util');
const request = require('../lib/requestWrapper');

const baseURI = config.service.jdbook.baseURI;

const jdbookService = {};

/**
 * 查询今日预审可用次数
 * @param userId
 */
jdbookService.getRemainTimes = function*(userId) {

    let uri = util.format('%s/jdbook/preCheckTool/remainTimes/%s', baseURI, userId);
    let response = yield request.get(uri);

    return response.body;
}

/**
 * 人证一致查询
 * @param body
 */
jdbookService.checkUserAccordance = function*(body) {

    let uri = util.format('%s/jdbook/preCheckTool/userAuth', baseURI);
    let response = yield request.post(uri, {body: body});

    return response.body;
}

/**
 * 预审接口
 * @param body
 */
jdbookService.preCheck = function*(body) {

    let uri = util.format('%s/jdbook/preCheckTool/preCheck', baseURI);
    let response = yield request.post(uri, {body: body});

    return response.body;
}

exports = module.exports = jdbookService;
