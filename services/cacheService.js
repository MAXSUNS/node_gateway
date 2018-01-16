

const cacheService = {};

/**
 * 使用redis或内存作为缓存介质
 * 在多机部署并且需要共享session的情况下，使用redis
 */
if (config.app.useCache) {
  if (config.app.cacheType && config.app.cacheType === 'redis') {
    cacheService._client = require('./redisService');
  } else {
    cacheService._client = require('./memoryService');
  }
}

const _client = cacheService._client;

/**
 * 设置键值对
 * @param key
 * @param value
 */
cacheService.set = function *(key, value) {
  let result = yield _client.set(key, JSON.stringify(value));
  return result;
}

/**
 * 根据键获取内容
 * @param key
 * @return {*}
 */
cacheService.get = function *(key) {
  let result = yield _client.get(key);
  return result ? JSON.parse(result) : result;
}

/**
 * 设置有时效的key
 * @param key
 * @param value
 * @param expirationIn
 * @return {*}
 */
cacheService.setEx = function *(key, value, expirationIn) {
  let result = yield _client.setEx(key, JSON.stringify(value), expirationIn);
  return result;
}

exports = module.exports = cacheService;
