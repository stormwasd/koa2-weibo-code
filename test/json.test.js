/**
 * @description json test
 * @author JackLiLi
 */

const server = require('./server')

test('json 接口然后返回的数据格式正确', async () => {
    const res = await server.get('/json')
    // const res = server.post('/login').send({ userName: 'xxx', ...)
    expect(res.body).toEqual({
        title: 'koa2 json'
    })
    expect(res.body.title).toBe('koa2 json')
})
