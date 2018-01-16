const router = require('koa-router')()



/**
 * 路由配置
 * 一个path对应一个controller
 * @type {[*]}
 */
const routes = [
    { path: '/api/wechat', controller: require('../controllers/wechatController')},
]

/**
 * 路由添加
 */
routes.forEach((route) => {
    router.use(route.path, route.controller.routes(), route.controller.allowedMethods());
});


module.exports = router
