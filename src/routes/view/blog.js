/**
 * @description 微博 view 路由
 * @author JackLiLi
 * @type {*|module:koa-router|Router|undefined}
 */
const router = require('koa-router')()
const { loginRedirect } = require('../../middlewares/loginChecks')

/**
 * 首页
 */
router.get('/', loginRedirect, async (ctx, next) => {
    await ctx.render('index', {})
})

module.exports = router