/**
 * @description user controller
 * @author JcckLiLi
 */

const { getUserInfo } = require('../service/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {
    registerUserNameNotExistInfo
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

module.exports = {
    isExist
}