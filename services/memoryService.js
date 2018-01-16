/**
 * Created by nick on 2017/7/14.
 * 内存缓存
 */

const memoryService = {};

/**
 * 内存缓存
 * @type {{}}
 * @private
 */
const _cache = {};

/**
 * 过期检查的周期
 * @type {number}
 */
const EXPIRATION_CHECK_INTERVAL = 5000;

/**
 * 设置key
 * @param key
 * @param value
 * @return {Function}
 */
memoryService.set = function (key, value) {
  return function (callback) {
    _cache[key] = value;
    callback(null, 'OK');
  }
}

/**
 * 设置带时效的key
 * @param key
 * @param value
 * @param expiration
 * @return {Function}
 */
memoryService.setEx = function (key, value, expiration) {
  return function (callback) {
    let now = Date.now();
    _cache[key] = value;
    _cache[key]._expireAt = now + expiration;
    callback(null, 'OK');
  }
}

/**
 * 获取key
 * @param key
 * @return {Function}
 */
memoryService.get = function (key) {
  return function (callback) {
    let result = _cache[key];
    callback(null, result);
  }
}

/**
 * 设置key的过期检查
 */
setInterval(function () {
  let keys = Object.keys(_cache);
  let now = Date.now();
  for(let key of keys) {
    if(_cache[key]._expireAt && _cache[key]._expireAt < now) {
      delete _cache[key];
    }
  }

}, EXPIRATION_CHECK_INTERVAL)

exports = module.exports = memoryService;