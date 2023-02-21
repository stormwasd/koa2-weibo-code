/**
 * @description 微博 service
 * @author JackLiLi
 */

const { Blog } = require('../db/model/index')

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

module.exports = {
    createBlog
}