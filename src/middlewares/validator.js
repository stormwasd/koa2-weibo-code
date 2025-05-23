/**
 * @description json schema 验证中间件
 * @author JackLiLi
 */

const { ErrorModel } = require('../model/ResModel')
const { jsonSchemaFileInfo } = require('../model/ErrorInfo')

/**
 * 生成 json schema 验证中间件
 * @param validateFn
 * @returns {(function(*, *): Promise<void>)|*}
 */
// 定义中间件函数
function genValidator(validateFn) {
    async function validator(ctx, next) {
        const data = ctx.request.body
        const error = validateFn(data)
        if (error) {
            // 验证失败
            ctx.body = new ErrorModel(jsonSchemaFileInfo)
            return
        }
        // 验证成功，继续
        await next()
    }
    // 返回中间件
    return validator
}

module.exports = {
    genValidator
}