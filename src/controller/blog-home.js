/**
 * @description 首页
 * @author JackLiLi
 */

const { createBlog } = require('../service/blog')
const { SuccessModel, ErrorModel } = require("../model/ResModel");
const {createBlogFailInfo} = require("../model/ErrorInfo");

/**
 *
 * @param userId
 * @param content
 * @param image
 * @returns {Promise<void>}
 */
async function create({ userId, content, image }) {
    // service
    // 创建要使用try catch
    try {
        // 创建微博
        const blog = await createBlog({
            userId,
            content,
            image
        })
        return new SuccessModel(blog)
    } catch (ex) {
        console.error(ex.message, ex.stack)
        return new ErrorModel(createBlogFailInfo)
    }

}

module.exports = {
    create
}