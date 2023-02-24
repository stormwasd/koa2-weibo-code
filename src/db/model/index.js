/**
 * @description 数据模型入口文件
 * @author JackLiLi
 */

const User = require('./User')
const Blog = require('./Blog')
const UserRelation = require('./UserRelation')

Blog.belongsTo(User, {  // 查询到Blog可以查询到该Blog对应的User
    foreignKey: 'userId'
})

// User.hasMany(Blog)  // 查询到User可以查询到该User下的所有Blog，暂时用不到

UserRelation.belongsTo(User, {  // 通过followerId这个外键使得UserRelation关联到User
    foreignKey: 'followerId'
})
User.hasMany(UserRelation, {
    foreignKey: 'userId'
})
// UserRelation.belongsTo(User, {
//     foreignKey: 'userId'
// })

Blog.belongsTo(UserRelation, {
    foreignKey: 'userId',
    targetKey: 'followerId'  // Blogs表中外键userId关联到userRelations表，那么肯定不能默认关联到seq自动生成的主键id，而是关联到followerId，这样拿到userid对应的多个followerId后也就能查询到该followerId对应的blog
})


module.exports = {
    User,
    Blog,
    UserRelation
}