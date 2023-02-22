// const { set } = require('./_redis');
//
// set();

/**
 * @description 微博缓存层
 * @author JackLiLi
 */

const { get, set } = require('./_redis')
const { getBlogListByUser } = require('../service/blog')

// redis key 前缀
const KEY_PREFIX = 'weibo:square:'

/**
 * 获取广场列表的缓存
 * @param {number} pageIndex pageIndex
 * @param {number} pageSize pageSize
 */
async function getSquareCacheList(pageIndex, pageSize) {
    const key = `${KEY_PREFIX}${pageIndex}_${pageSize}`

    // 尝试获取缓存
    const cacheResult = await get(key)
    if (cacheResult != null) {
        // 获取缓存成功
        return cacheResult
    }

    // 没有缓存，则读取数据库(第一次访问还没有缓存，或者缓存已经过期)
    const result = await getBlogListByUser({ pageIndex, pageSize })  // 由于是广场，这里的userName就不传入

    // 存入缓存，过期时间 1min
    set(key, result, 60)  // timeout单位为s

    return result
}

module.exports = {
    getSquareCacheList
}
