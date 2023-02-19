/**
 * @description user API 路由
 * @author JackLiLi
 * @type {*|module:koa-router|Router|undefined}
 */

const router = require('koa-router')()
const { isExist, register, login, deleteCurUser} = require('../../controller/user')
const userValidate = require('../../validator/user')
const { genValidator } = require('../../middlewares/validator')
const { isTest } = require('../../utils/env')
const { loginCheck } = require('../../middlewares/loginChecks')

router.prefix('/api/user')

// 注册路由
router.post('/register', genValidator(userValidate), async (ctx, next) => {
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

// 登录
router.post('/login', async (ctx, next) => {
    const { userName, password } = ctx.request.body
    // controller
    ctx.body = await login(ctx, userName, password)  // ctx是中间件的上下文参数
})

// 删除
router.post('/delete', loginCheck, async (ctx, next) => {  // 删除用户必须当且只当该用户登录后
    if ( isTest ) {  // 为保证安全，必须是测试环境才能删除用户
        // 测试环境下，测试账号登录之后，删除自己
        const { userName } = ctx.session.userInfo
        // 调用controller删除
        ctx.body = await deleteCurUser(userName)
    }
})

module.exports = router