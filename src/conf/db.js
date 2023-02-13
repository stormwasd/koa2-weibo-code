/**
 * @description 存储配置
 * @author JackLiLi
 */

const { isProd } = require('../utils/env');

let REDIS_CONF = {
  port: 6379,
  host: '127.0.0.1'
};

let MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'zx360828htc',
    port: '3306',
    database: 'koa2_weibo_db',
    dialect: 'mysql'  // 指定数据库类型
};

if (isProd) {
    REDIS_CONF = {
        // 线上的redis配置
        port: 6379,
        host: '127.0.0.1'
    };

    MYSQL_CONF = {
        // 线上的mysql配置
        host: 'localhost',
        user: 'root',
        password: 'zx360828htc',
        port: '3306',
        database: 'koa2_weibo_db',
        dialect: 'mysql'  // 指定数据库类型
    };
}

module.exports = {
    REDIS_CONF,
    MYSQL_CONF
};