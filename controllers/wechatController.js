/**
 * Created by sund on 2018/1/16.
 */

const Wechat = require('co-wechat');

const Router = require('koa-router');

const router = new Router();

const wechatService = require('../services/wechatService');

const crypto = require('crypto')


const handler = new Wechat(config.wechat).middleware(async (message, ctx) => {
    // 微信输入信息就是这个 message
    if (message.Content === 'diaosi') {
        // 回复屌丝(普通回复)
        return 'hehe';
    } else if (message.Content === 'text') {
        //你也可以这样回复text类型的信息
        return {
            content: 'text object',
            type: 'text'
        };
    } else if (message.Content === 'hehe') {
        // 回复一段音乐
        return {
            type: "music",
            content: {
                title: "来段音乐吧",
                description: "一无所有",
                musicUrl: "http://mp3.com/xx.mp3",
                hqMusicUrl: "http://mp3.com/xx.mp3"
            }
        };
    } else if (message.Content === 'kf') {
        // 转发到客服接口
        return {
            type: "customerService",
            kfAccount: "test1@test"
        };
    } else {
        // 回复高富帅(图文回复)
        return [
            {
                title: '你来我家接我吧',
                description: '这是女神与高富帅之间的对话',
                picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
                url: 'http://nodeapi.cloudfoundry.com/'
            }
        ];
    }
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


exports = module.exports = router;
