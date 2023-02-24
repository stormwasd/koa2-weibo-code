/**
 * @description 首页
 * @author JackLiLi
 */

const { createBlog, getFollowersBlogList } = require('../service/blog')
const { SuccessModel, ErrorModel } = require("../model/ResModel");
const {createBlogFailInfo} = require("../model/ErrorInfo");
const xss = require('xss')
const { PAGE_SIZE } = require('../conf/constant')

/**
 * 创建微博
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
            content: xss(content),  // 对内容进行xss过滤
            image
        })
        return new SuccessModel(blog)
    } catch (ex) {
        console.error(ex.message, ex.stack)
        return new ErrorModel(createBlogFailInfo)
    }
}

/**
 * 获取首页微博列表
 * @param userId
 * @param pageIndex
 * @returns {Promise<void>}
 */
async function getHomeBlogList(userId, pageIndex = 0) {
    // service
    const result = await getFollowersBlogList({ userId, pageIndex, pageSize: PAGE_SIZE })
    console.log('result:', result)
    const { count, blogList } = result
    // 返回
    return new SuccessModel({
        isEmpty: blogList.length === 0,
        blogList,
        pageSize: PAGE_SIZE,
        pageIndex,
        count
    })
}


module.exports = {
    create,
    getHomeBlogList
}