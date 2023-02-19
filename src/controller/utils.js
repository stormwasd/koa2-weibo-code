/**
 * @description utils controller
 * @author JackLiLi
 */
const path = require('path')
const {ErrorModel, SuccessModel} = require("../model/ResModel");
const { uploadFileSizeFailInfo } = require('../model/ErrorInfo')
const fse = require('fs-extra')
const {exists} = require("fs-extra/lib/fs");

// 文件存储目录
const DIST_FOLDER_PATH = path.join(__dirname, '..', '..', 'uploadFiles')

// 文件最大体积 1M
const MAX_SIZE = 1024 * 1024 * 1024

// 是否需要创建目录
fse.pathExists(DIST_FOLDER_PATH).then(exists => {
    if (!exists) {
        fse.ensureDir(DIST_FOLDER_PATH)
    }
})

/**
 * 保存文件
 * @param name
 * @param type
 * @param size
 * @param filePath
 * @returns {Promise<SuccessModel>}
 */
async function saveFile({ name, type, size, filePath }) {
    if (size > MAX_SIZE) {
        // 由于经过koaForm()这个中间件后，文件已经存在了，所以我们要先删除文件
        await fse.remove(filePath)
        return new ErrorModel(uploadFileSizeFailInfo)
    }

    // 移动文件
    const fileName = Date.now() + '.' + name  // 防止重名
    const disFilePath = path.join(DIST_FOLDER_PATH, fileName)  // 目的地
    await fse.move(filePath, disFilePath)

    // 返回信息，返回图片的链接
    return new SuccessModel({
        url: '/' + fileName
    })

}

module.exports = {
    saveFile
}