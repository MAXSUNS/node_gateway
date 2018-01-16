

const redis = require('redis');

const redisConfig = config.redis;

checkRedisConfig(redisConfig);

const redisService = {};

const options = {
  detect_buffers: true
};

/**
 * 检查是否需要配置密码
 */
if (redisConfig.password) {
  options.password = redisConfig.password
}

/**
 * 创建redis客户端
 */
const _client = redis.createClient(redisConfig.port, redisConfig.host, options);

redisService._client = _client;

/**
 * 设置key
 * @param key
 * @param value
 * @return {Function}
 */
redisService.set = function (key, value) {
  return function (callback) {
    _client.set(key, value, callback);
  }
}

/**
 * 获取key
 * @param key
 * @return {Function}
 */
redisService.get = function (key) {
  return function (callback) {
    return _client.get(key, callback);
  }
}

/**
 * 设置带时效的key
 * @param key
 * @param value
 * @param expirationIn
 * @return {Function}
 */
redisService.setEx = function (key, value, expirationIn) {
  return function (callback) {
    _client.set(key, value, 'EX', expirationIn, callback)
  }
}

function checkRedisConfig(config) {
  if (!redisConfig.host || !redisConfig.port) {
    throw new Error('please check redis config');
  }
}

exports = module.exports = redisService;