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

/**
 * 创建用户
 * @param userName
 * @param password
 * @param gender
 * @param nickName
 * @returns {Promise<void>}
 */
async function createUser({userName, password, gender = 3, nickName, }) {
    const result = await User.create({
        userName,
        password,
        nickName: nickName ? nickName : userName,
        gender
    })
    return result.dataValues
}

/**
 * 删除用户
 * @param userName
 * @returns {Promise<void>}
 */
async function deleteUser(userName) {
    const result = await User.destroy({
        where: {
            userName
        }
    })
    // result返回删除的行数
    return result > 0
}

/**
 * 更新用户信息
 * @param newPassword  要修改的内容
 * @param newNickName
 * @param newPicture
 * @param newCity
 * @param userName  查询条件
 * @param password
 */
async function updateUser(
    { newPassword, newNickName, newPicture, newCity },
    { userName, password }
) {
    // 拼接修改内容
    const updateData = {}
    if (newPassword) {
        updateData.password = newPassword
    }
    if (newNickName) {
        updateData.nickName = newNickName
    }
    if (newPicture) {
        updateData.picture = newPicture
    }
    if (newCity) {
        updateData.city = newCity
    }

    // 拼接查询条件
    const whereData = {
        userName
    }
    if (password) {
        whereData.password = password
    }

    // 执行修改
    const result = await User.update(updateData, {
        where: whereData
    })
    return result[0] > 0 // 修改的行数

}

module.exports = {
    getUserInfo,
    createUser,
    deleteUser,
    updateUser
}