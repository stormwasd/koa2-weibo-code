/**
 * @description res 的数据模型
 * @author JackLiLi
 */

/**
 * 基础模块
 */
class BaseModel {
    constructor({errno, data, message}) {
        this.errno = errno
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message
        }
    }
}

/**
 * 成功的数据模型
 */
class SuccessModel extends BaseModel {
    constructor(data = {}) {
        super({
            errno: 0,
            data
        });
    }
}

/**
 * 失败的数据模型
 */
class ErrorModel extends BaseModel {
    constructor({ errno, message }) {
        super({  // 调用父类的构造函数
            errno,
            message
        });
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}
