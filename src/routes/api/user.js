/**
 * @description user API 路由
 * @author JackLiLi
 * @type {*|module:koa-router|Router|undefined}
 */

const router = require('koa-router')()
const { isExist, register, login, deleteCurUser, changeInfo, changePassword, logout} = require('../../controller/user')
const userValidate = require('../../validator/user')
const { genValidator } = require('../../middlewares/validator')
const { isTest } = require('../../utils/env')
const { loginCheck } = require('../../middlewares/loginChecks')
const { getFollowers } = require('../../controller/user-relation')

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

// 修改个人信息
router.patch('/changeInfo', loginCheck, genValidator(userValidate), async (ctx, next) => {
    const { nickName, city, picture } = ctx.request.body
    console.log({ nickName, city, picture })
    // controller
    ctx.body = await changeInfo(ctx, { nickName, city, picture })
})

// 修改密码
router.patch('/changePassword', loginCheck, genValidator(userValidate), async (ctx, next) => {
    const { password, newPassword } = ctx.request.body  // 获取旧密码和新密码
    const { userName } = ctx.session.userInfo  // 修改谁的密码
    // 调用controller
    ctx.body = await changePassword({ userName, password, newPassword})
})

// 退出登录
router.post('/logout', loginCheck, async (ctx, next) => {
    // 直接调用controller
    ctx.body = await logout(ctx)
})


// 获取at列表，即关注人列表
router.get('/getAtList', loginCheck, async (ctx, next) => {
    const { id: userId } = ctx.session.userInfo
    const result = await getFollowers(userId)
    const { followersList } = result.data
    ctx.body = followersList.map(user => {
        return `${user.nickName} - ${user.userName}`
    })
})


module.exports = router