/**
 * @description jest server
 * @author JackLiLi
 */

const request = require('supertest')
const server = require('../src/app').callback()

module.exports = request(server)