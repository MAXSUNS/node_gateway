/**
 * Created by sund on 2018/1/16.
 */

const Wechat = require('co-wechat');

const Router = require('koa-router');

const router = new Router();

const wechatService = require('../services/wechatService');

const crypto = require('crypto')

const QR_CODE_EXPIRED_IN = 1800;

const handler = new Wechat(config.wechat).middleware(async (message, ctx) => {
    return {
        content: 'text object'+message.Content,
        type: 'text'
    };
});



router.get('/', function (ctx, next) {
    const token = config.wechat.token, // 自定义，与公众号设置的一致
        signature = ctx.query.signature,
        timestamp = ctx.query.timestamp,
        nonce = ctx.query.nonce

    // 字典排序
    const arr = [token, timestamp, nonce].sort()

    const sha1 = crypto.createHash('sha1')
    sha1.update(arr.join(''))
    const result = sha1.digest('hex')

    if (result === signature) {
        ctx.body = ctx.query.echostr
    } else {
        ctx.body = { code: -1, msg: "fail"}
    }
});

router.post('/', handler);
router.post('/register', async (ctx, next) => {
    console.log(ctx.request.body);
    let reqBody = ctx.request.body;
    ctx.body = "234234";
});

router.post('/js/config', function*() {

    const body = this.request.body;
    const param = {
        debug: false,
        jsApiList: ['getLocation'],
        url: body.url
    };

    let config = yield wechatService.api.getJsConfig(param);

    this.body = config;
});


exports = module.exports = router;
