/**
 * @description 微博 service
 * @author JackLiLi
 */

const { Blog, User, UserRelation } = require('../db/model/index')
const { formatUser, formatBlog } = require('./_format')

/**
 * 创建微博
 * @param userId
 * @param context
 * @param image
 * @returns {Promise<void>}
 */
async function createBlog({ userId, content, image }) {
    const result = await Blog.create({
        userId,
        content,
        image
    })
    return result.dataValues
}

/**
 * 根据用户获取微博列表
 * @param userName
 * @param pageIndex
 * @param pageSize
 * @returns {Promise<void>}
 */
async function getBlogListByUser({ userName, pageIndex = 0, pageSize = 10 }) {
    // 拼接查询条件
    const userWhereOpts = {}
    if (userName) {
        userWhereOpts.userName = userName
    }

   // 执行查询
   const result = await Blog.findAndCountAll({
       limit: pageSize,  // 每一页的条数
       // 跳过多少条
       offset: pageSize * pageIndex, // 如果pageIndex为0，那么就是跳过0跳条，跳过0条就是查询第一页，如果pageIndex为1，那么就是跳过10条，跳过10条就是查询第二页
       order: [
           ['id', 'desc']  // 根据id倒序排列
       ],
       // 连表查询
       include: [
           {
               model: User,  // 连哪张表
               attributes: ['userName', 'nickName', 'picture'],  // 要查询的字段
               where: userWhereOpts
           }
       ]
   })

    // result.count 是查询的总数，和分页无关
    // result.rows 查询结果，是数组

    // 获取dataValues
    let blogList = result.rows.map(row => row.dataValues)
    // 格式化
    blogList =formatBlog(blogList)
    blogList = blogList.map(blogItem => {
        const user = blogItem.user.dataValues
        blogItem.user = formatUser(user)
        return blogItem
    })

    return {
        count: result.count,
        blogList
    }
}

/**
 * 获取关注者的微博(首页)
 * @param userId
 * @param pageIndex
 * @param pageSize
 * @returns {Promise<{count, blogList: T[]}>}
 */
async function getFollowersBlogList({ userId, pageIndex = 0, pageSize = 10 }) {
    const result = await Blog.findAndCountAll({
        limit: pageSize, // 每页多少条
        offset: pageSize * pageIndex, // 跳过多少条
        order: [
            ['id', 'desc']
        ],
        include: [
            {
                model: User,
                attributes: ['userName', 'nickName', 'picture']
            },
            {
                model: UserRelation,
                attributes: ['userId', 'followerId'],
                where: { userId }
            }
        ]
    })

    // 格式化数据
    let blogList = result.rows.map(row => row.dataValues)
    blogList = formatBlog(blogList)
    blogList = blogList.map(blogItem => {
        blogItem.user = formatUser(blogItem.user.dataValues)
        return blogItem
    })

    return {
        count: result.count,
        blogList
    }
}


module.exports = {
    createBlog,
    getBlogListByUser,
    getFollowersBlogList
}