/**
 * Created by sund on 2018/1/16.
 */

const Wechat = require('co-wechat');

const Router = require('koa-router');

const router = new Router();

const wechatService = require('../services/wechatService');


const QR_CODE_EXPIRED_IN = 1800;

const handler = new Wechat(config.wechat).middleware(function *() {

    let message = this.weixin;

    this.body = {
        type: 'text',
        content: '欢迎关注，请通过下方菜单使用功能，谢谢！'
    }
});


router.get('/', handler);
router.post('/', handler);

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
