/**
 * @description user controller
 * @author JackLiLi
 */

const { getUserInfo, createUser, deleteUser, updateUser } = require('../service/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const doCrypto = require('../utils/cryp')
const {
    registerUserNameNotExistInfo,
    registerUserNameExistInfo,
    registerFailInfo,
    deleteUserFailInfo,
    loginFailInfo,
    changeInfoFailInfo
} = require('../model/ErrorInfo')

/**
 * 用户名是否存在
 * @param userName
 * @returns {Promise}
 */
async function isExist(userName) {
    const userInfo = await getUserInfo(userName)
    console.log('userInfo:', userInfo)
    if (userInfo) {
        // 已存在
        return new SuccessModel(userInfo)
        // { errno: 0, data: {...} }
    } else {
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
 * @returns {Promise}
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
 * @param ctx koa2 ctx
 * @param userName 用户名
 * @param password 密码
 * @returns {Promise}
 */
async function login(ctx, userName, password) {
    // 登录成功 ctx.session.userInfo = xxx

    // 获取用户信息
    const userInfo = await getUserInfo(userName, doCrypto(password))
    if (!userInfo) {
        // 登录失败
        return ErrorModel(loginFailInfo)
    }

    // 登录成功
    if (ctx.session.userInfo == null) {
        ctx.session.userInfo = userInfo
    }
    return new SuccessModel()

}

/**
 * 删除当前用户
 * @param userName
 * @returns {Promise}
 */
async function deleteCurUser(userName) {
    // 调用service
    const result = deleteUser(userName)
    if (result) {
        // 成功
        return new SuccessModel()
    } else {
        // 失败
        return new ErrorModel(deleteUserFailInfo)
    }
}

/**
 * 修改个人信息
 * @param ctx
 * @param nickName
 * @param city
 * @param picture
 * @returns {Promise<void>}
 */
async function changeInfo(ctx, { nickName, city, picture }) {  // 使用ctx是为了改session
    const { userName } = ctx.session.userInfo
    if (!nickName) {
        nickName = userName
    }
    // 调用service
    const result = await updateUser(
        {
            newNickName: nickName,
            newCity: city,
            newPicture: picture
        },
        { userName }
    )
    if (result) {
        // 执行成功
        Object.assign(ctx.session.userInfo, {  // 更新session
            nickName,
            city,
            picture
        })
        // 返回
        return new SuccessModel()
    }
    // 失败
    return new ErrorModel(changeInfoFailInfo)
}

module.exports = {
    isExist,
    register,
    login,
    deleteCurUser,
    changeInfo
}