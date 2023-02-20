/**
 * @description 数据模型入口文件
 * @author JackLiLi
 */

const User = require('./User')
const Blog = require('./Blog')

Blog.belongsTo(User, {  // 查询到Blog可以查询到该Blog对应的User
    foreignKey: 'userId'
})

// User.hasMany(Blog)  // 查询到User可以查询到该User下的所有Blog

module.exports = {
    User,
    Blog
}