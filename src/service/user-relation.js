/**
 * @description 用户关系 services
 * @author JackLiLi
 */

const { User, UserRelation } = require('../db/model/index')
const { formatUser } = require('./_format')
const Sequelize = require('sequelize')

/**
 * 获取关注该用户的用户列表，即该用户的粉丝
 * @param {number} followerId 被关注人的 id
 */
async function getUsersByFollower(followerId) {
    // 通过Follower拿到所有的User(粉丝)
    /**
     * 所以首先传入一个followerId，在UserRelation中查询，然后拿到userId关联到User表，并拿到'id', 'userName', 'nickName', 'picture'
     */
    const result = await User.findAndCountAll({
        attributes: ['id', 'userName', 'nickName', 'picture'],
        order: [
            ['id', 'desc']
        ],
        include: [
            {
                model: UserRelation,
                where: {
                    followerId,
                    userId: {
                        [Sequelize.Op.ne]: followerId  // 获取出来的userId不等于followerId，需要引用Sequelize
                    }
                }
            }
        ]
    })
    // result.count 总数
    // result.rows 查询结果，数组

    // 格式化
    let userList = result.rows.map(row => row.dataValues)
    userList = formatUser(userList)

    return {
        count: result.count,
        userList
    }
}

/**
 * 获取关注人列表
 * @param {number} userId userId
 */
async function getFollowersByUser(userId) {
    // 通过User拿到所有的Follower(关注的人)
    /**
     * 所以首先传入一个userId在UserRelation表中查询，查询到该userId对应的所有followerId，然后再通过外键followerId去User表中拿到对 应的用户信息
     */
    const result = await UserRelation.findAndCountAll({  // UserRelation这个模型做查询，首先where这个查询就是对于UserRelation这个模型中把userId等于传入的userId的记录拿出来
        // 续上，通过userId把followerId查询出来，然后我们还要通过followerId找到我关注人的信息，正好include了User这个模型，为什么这个地方就能通过followerId找到用户信息呢？因为我们通过
        // 续上，UserRelation去find，同时include了User的时候，正好就命中了UserRelation.belongsTo(User, { foreignKey: 'followerId' })
        order: [
            ['id', 'desc']
        ],
        include: [
            {
                model: User,
                attributes: ['id', 'userName', 'nickName', 'picture']
            }
        ],
        where: {
            userId,
            followerId: {
                [Sequelize.Op.ne]: userId  // 不等于userId
            }
        }
    })
    // result.count 总数
    // result.rows 查询结果，数组

    let userList = result.rows.map(row => row.dataValues)

    userList = userList.map(item => {
        let user = item.user
        user = user.dataValues
        user = formatUser(user)
        return user
    })

    return {
        count: result.count,
        userList
    }
}

/**
 * 添加关注关系
 * @param {number} userId 用户 id
 * @param {number} followerId 被关注用户 id
 */
async function addFollower(userId, followerId) {
    const result = await UserRelation.create({
        userId,
        followerId
    })
    return result.dataValues
}

/**
 * 删除关注关系
 * @param {number} userId 用户 id
 * @param {number} followerId 被关注用户 id
 */
async function deleteFollower(userId, followerId) {
    const result = await UserRelation.destroy({
        where: {
            userId,
            followerId
        }
    })
    return result > 0
}

module.exports = {
    getUsersByFollower,
    addFollower,
    deleteFollower,
    getFollowersByUser
}

