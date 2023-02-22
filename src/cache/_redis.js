/**
 * @description 连接 redis的方法，get set
 * @author JackLiLi
 */

const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on('error', err => {
    console.error('redis error', err)
});

// set
/**
 * redis set
 * @param key 键
 * @param val 值
 * @param timeout 过期时间 单位 s
 */
function set(key, val, timeout = 60 * 60) {
    console.log('in redis set function')
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val);
    redisClient.expire(key, timeout)
}

// get
/**
 * redis get
 * @param key 键
 */
function get(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err);
                return
            }
            if (val == null) {
                resolve(null);
                return
            }
            try {
                resolve(
                    JSON.parse(val)
                )
            } catch (ex) {
                resolve(val)
            }
        })
    });
    return promise
}

module.exports = {
    set,
    get
};