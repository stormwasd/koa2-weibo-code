/**
 * @description 用户关系 controller
 * @author JackLiLi
 */

const {
    getUsersByFollower,
    addFollower,
    deleteFollower
} = require('../service/user-relation')
const { SuccessModel, ErrorModel } = require('../model/ResModel')

/**
 * 根据 userid 获取粉丝列表
 * @param {number} userId 用户 id
 */
async function getFans(userId) {

    // service
    const { count, userList } = await getUsersByFollower(userId)

    // 返回
    return new SuccessModel({
        count,
        fansList: userList
    })
}

/**
 * 关注
 * @param {number} myUserId 当前登录的用户 id
 * @param {number} curUserId 要被关注的用户 id
 */
async function follow(myUserId, curUserId) {
    // service
    try {
        let res = await addFollower(myUserId, curUserId)
        return new SuccessModel(res)
    } catch (ex) {
        console.error(ex)
        return new ErrorModel(addFollowerFailInfo)
    }
}

/**
 * 取消关注
 * @param {number} myUserId 当前登录的用户 id
 * @param {number} curUserId 要被关注的用户 id
 */
async function unFollow(myUserId, curUserId) {
    // service
    const result = await deleteFollower(myUserId, curUserId)
    if (result) {
        return new SuccessModel()
    }
    return new ErrorModel(deleteFollowerFailInfo)
}

module.exports = {
    getFans,
    follow,
    unFollow
}