

const WechatAPI = require('co-wechat-api');
const WechatOAuth = require('co-wechat-oauth');
const cacaheService = require('./cacheService');

const wechatConfig = config.wechat;

const KEY_ACCESS_TOKEN = 'S_TOKEN';
const EXPIRE_IN_ACCESS_TOKEN = 7200;

if(ENV !== 'dev') {
  checkWechatConfig(wechatConfig);
}

/**
 * 微信api客户端实例
 * 将access token存到cache service
 * cache service可以配置为内存或redis
 * @type {*}
 */
const api = new WechatAPI(wechatConfig.appid, wechatConfig.secret, function* () {
  let tokenStr = yield cacaheService.get(KEY_ACCESS_TOKEN);
  console.log(tokenStr);
  return tokenStr ? JSON.parse(tokenStr) : tokenStr;
}, function* (token) {
  console.log(token);
  yield cacaheService.setEx(KEY_ACCESS_TOKEN, JSON.stringify(token), EXPIRE_IN_ACCESS_TOKEN);
});

/**
 * 微信oauth客户端实例
 * 将用户的oauth token存到cache service
 * @type {OAuth}
 */
const oauth = new WechatOAuth(wechatConfig.appid, wechatConfig.secret, function *(openId) {
  let tokenStr = yield cacaheService.get(openId);
  return JSON.parse(tokenStr);
}, function *(openId, token) {
  yield cacaheService.setEx(openId, JSON.stringify(token), EXPIRE_IN_ACCESS_TOKEN);
});

/**
 * 非dev模式下检查微信配置
 * @param config
 */
function checkWechatConfig(config) {
  if (!config.appid || !config.secret) {
    throw new Error("appid or secret not config")
  }
}

exports = module.exports = {
  api: api,
  oauth: oauth
}
