/**
 * Created by nick on 2017/7/7.
 * 1. 检查并读取配置文件
 * 2. 设置日志
 */

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const winston = require('winston');
require('winston-daily-rotate-file');

/**
 * 检查node运行环境
 */
if (!global) {
  console.error('非node环境，请检查运行环境');
}

/**
 * 读取默认配置文件
 */
const content = fs.readFileSync(path.join(__dirname, 'config', 'config.json'));
const defaultConfig = JSON.parse(content);
let envConfig;

/**
 * 检查当前环境
 * @type {string}
 */
let environment = 'dev';

if (process.env.NODE_ENV) {
  environment = process.env.NODE_ENV;
}

/**
 * 设置环境为全局变量
 */
global.ENV || (global.ENV = environment);

console.log('current env: ' + environment);

/**
 * 读取环境相关配置
 */
let envConfigPath = path.join(__dirname, 'config', 'config-' + environment + '.json');

if (fs.existsSync(envConfigPath)) {
  let content = fs.readFileSync(envConfigPath);
  envConfig = JSON.parse(content);
} else {
  console.warn('environment [' + environment + '] set, but no specified config file');
}

/**
 * 合并配置项
 * 设置配置为全局变量
 */
global.config || ( global.config = (envConfig ? _.merge({}, defaultConfig, envConfig) : defaultConfig ));

/**
 * 检查log文件夹
 */
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

/**
 * 配置logger
 */
const defaultLogger = new (winston.Logger)();

let transports = [];
// transports.push(new (winston.transports.File)({
//   filename: 'logs/app.log',
//   json: false,
//   timestamp: logTimestamp,
//   level: 'info',
//   label: 'logger',
//   options: {name: 'test'}
// }));

/**
 * 配置滚动日志文件记录
 */
transports.push(new winston.transports.DailyRotateFile({
  filename: 'logs/app.log',
  datePattern: '.yyyy-MM-dd',
  prepend: false,
  json: false,
  timestamp: new Date(),
  level: 'info',
  label: 'logger'
}));

/**
 * 配置控制台输出日志
 */
if (config.logger && config.logger.console) {
  transports.push(
    new (winston.transports.Console)({
      json: false,
      timestamp: new Date(),
      colorize: true,
      level: 'info'
    }));
}

defaultLogger.configure({transports: transports});




