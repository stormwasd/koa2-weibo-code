const path = require('path')
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStorage = require('koa-redis')
const {ignoreRoot} = require("nodemon/lib/config/defaults")
const { REDIS_CONF } = require("../src/conf/db")
// const { port, host } = REDIS_CONF;
const { isProd } = require("./utils/env")
const { SESSION_SECRET_KEY } = require('../src/conf/secretKeys')
const koaStatic = require('koa-static')

// 路由
// const index = require('./routes/index')
// const users = require('./routes/users')
const errorViewRouter = require('./routes/view/error')
const userViewRouter = require('./routes/view/user')
const userAPIRouter = require('./routes/api/user')
const utilsAPIRouter = require('./routes/api/utils')
const blogViewRouter = require('./routes/view/blog')

// error handler
let onerrorConf = {}
if (isProd) {
  onerrorConf = {
    redirect: '/error'
  }
}

onerror(app, onerrorConf)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(koaStatic(__dirname + '/public'))
app.use(koaStatic(path.join(__dirname,  '..' , 'uploadFiles')))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// session config
app.keys = [SESSION_SECRET_KEY]  // 这个相当于密钥，可以复杂些
app.use(session({
  key: 'weibo.sid', // cookie name 默认是`koa.sid`
  prefix: 'weibo:sess', // redis key 的前缀，默认是`koa:sess`
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 *1000 // ms，24 * 60 * 60 *1000 代表一天
  },
  ttl: 24 * 60 * 60 *1000, // redis中数据的过期时间，设定的和cookie的maxAge一致
  store: redisStorage({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
    // all: '127.0.0.1:6379'
  })
}))


// 注册路由
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
app.use(userViewRouter.routes(), userViewRouter.allowedMethods())
app.use(userAPIRouter.routes(), userAPIRouter.allowedMethods())
app.use(utilsAPIRouter.routes(), utilsAPIRouter.allowedMethods())
app.use(blogViewRouter.routes(), blogViewRouter.allowedMethods())
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods())  // error/404相关路由一定要放在最下面

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error'
, err, ctx)
});


module.exports = app
