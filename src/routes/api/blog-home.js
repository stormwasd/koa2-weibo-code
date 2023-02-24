const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginChecks')
const { create, getHomeBlogList} = require('../../controller/blog-home')
const { genValidator } = require('../../middlewares/validator')
const blogValidate = require('../../validator/blog')
const {getProfileBlogList} = require("../../controller/blog-profile");
const {getBlogListStr} = require("../../utils/blog");

router.prefix('/api/blog')

// 创建路由
router.post('/create', loginCheck, genValidator(blogValidate), async (ctx, next) => {
    const { content, image } = ctx.request.body
    const { id: userId } = ctx.session.userInfo  // 给id取别名为userId，因为session中存储的是id
    // controller
    ctx.body = await create({ userId, content, image })
})

// 加载更多
router.get('/loadMore/:pageIndex', loginCheck, async (ctx, next) => {
    let { pageIndex } = ctx.params
    pageIndex = parseInt(pageIndex)  // 转换 number 类型
    const { id: userId } = ctx.session.userInfo
    const result = await getHomeBlogList(userId, pageIndex)
    // 渲染模板
    result.data.blogListTpl = getBlogListStr(result.data.blogList)

    ctx.body = result
})


module.exports = router