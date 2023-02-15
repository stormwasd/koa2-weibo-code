/**
 * @description user API 路由
 * @author JackLiLi
 * @type {*|module:koa-router|Router|undefined}
 */

const router = require('koa-router')()
const { isExist, register} = require('../../controller/user')

router.prefix('/api/user')

// 注册路由
router.post('/register', async (ctx, next) => {
    const { userName, password, gender } = ctx.request.body
    // 调用controller，返回
    ctx.body = await register({
        userName, password, gender
    })


})

// 用户名是否存在
router.post('/isExist', async (ctx, next) => {
    const { userName } = ctx.request.body
    // controller
    // ctx.body = await xxx()
    ctx.body = await isExist(userName)
})

module.exports = router