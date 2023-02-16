/**
 * @description user controller
 * @author JackLiLi
 */

const { getUserInfo, createUser } = require('../service/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const doCrypto = require('../utils/cryp')
const {
    registerUserNameNotExistInfo,
    registerUserNameExistInfo,
    registerFailInfo,
} = require('../model/ErrorInfo')

/**
 * 用户名是否存在
 * @param userName
 * @returns {Promise<void>}
 */
async function isExist(userName) {
    const userInfo = await getUserInfo(userName)
    console.log('userInfo:', userInfo)
    if (userInfo) {
        console.log('1')
        // 已存在
        return new SuccessModel(userInfo)
        // { errno: 0, data: {...} }
    } else {
        console.log('2')
        // 不存在
        return new ErrorModel(registerUserNameNotExistInfo)
        // { errno: 10003, message: '用户名未存在' }
    }
}

/**
 * 注册
 * @param userName 用户名
 * @param password 密码
 * @param gender 性别(1.男 2.女 3.保密)
 * @returns {Promise<void>}
 */
async function register({ userName, password, gender }) {
    const userInfo = await getUserInfo(userName)
    if (userInfo) {
        // 用户名已存在
        return new ErrorModel(registerUserNameExistInfo)
    }
    // 注册 调用service层
    try {
        await createUser({
            userName,
            password: doCrypto(password),
            gender
        })
        return new SuccessModel()
    } catch (ex) {
        console.error(ex.message, ex.stack)
        return new ErrorModel(registerFailInfo)
    }
}

/**
 * 登录
 * @param ctx
 * @param userName
 * @param password
 * @returns {Promise<void>}
 */
async function login(ctx, userName, password) {
    // 登录成功 ctx.session.userInfo = xxx

    // 获取用户信息
    const userInfo = await getUserInfo(userName, password)
    if (!userInfo) {
        // 登录失败
        return ErrorModel(loginFailInfo)
    }

}

module.exports = {
    isExist,
    register,
    login
}