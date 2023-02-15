/**
 *@description user service
 *@author JackLiLi
 */

const { User } = require('../db/model/index')
const { formatUser } = require('./_format')

/**
 * 获取用户信息，该方法可用于验证用户名是否被占用也可用于登录
 * @param userName 用户名
 * @param password 密码
 * @returns {Promise<void>}
 */
async function getUserInfo(userName, password) {
    // 查询条件
    const whereOpt = {
        userName
    }
    if (password) {
        Object.assign(whereOpt, { password })
    }

    // 查询
    const result = await User.findOne({
        attributes: ['id', 'userName', 'nickName', 'picture', 'city'],
        where: whereOpt
    })
    if (result == null) {
        // 未找到
        return result
    }

    // 格式化
    // const formatRes = formatUser(result.dataValues)

    // 格式化并返回
    return formatUser(result.dataValues)
}

module.exports = {
    getUserInfo
}