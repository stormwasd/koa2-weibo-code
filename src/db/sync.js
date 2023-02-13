/**
 * @description sequelize 同步数据库
 * @author JackLiLi
 */
const seq = require('./seq');

// require('./model');

// 测试连接
seq.authenticate().then(() => {
    console.log('auth ok')
}).catch(() => {
    console.log('auth err')
});

// 执行同步，force: true表示如果数据库中有这个表会覆盖(有这个表的话会删除后重新建)，表示执行同步后会退出进程，这样sequelize就不会一直占用资源
seq.sync({ force: true}).then(() => {
    console.log('sync ok');
    process.exit()
});