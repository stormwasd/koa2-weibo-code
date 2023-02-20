const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginChecks')

router.prefix('/api/blog')

// 创建路由
router.post('/create', loginCheck, async (ctx, next) => {
    const { content, image } = ctx.request.body
    const { id: userId } = ctx.session.userInfo  // 给id取别名为userId，因为session中存储的是id
    // controller
})

module.exports = router