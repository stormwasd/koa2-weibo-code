const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  // console.log('before  debugger')
  // debugger
  // console.log('after  debugger')
  await ctx.render('index-test', {
    title: 'Hello Koa 2!',
    isMe: false,
    blogList: [
      {
        id: 1,
        title: 'aaa'
      },{
        id: 2,
        title: 'bbb'
      },{
        id: 3,
        title: 'ccc'
      },
    ]
  })
})

// router.get('/string', async (ctx, next) => {
//   ctx.body = 'koa2 string'
// })

router.get('/json', async (ctx, next) => {
  // const session = ctx.session  // 获取当前用户进入`/json`的目录的动态的会话
  // if (session.viewNum == null) {
  //   session.viewNum = 0;
  // }
  // session.viewNum++

  throw Error()
  ctx.body = {
    title: 'koa2 json',
    // viewNum: session.viewNum
  }
})

router.get('/profile/:userName', async (ctx, next) => {
  const { userName } = ctx.params
  ctx.body = {
    title: 'this is profile page',
    userName
  }
})

router.get('/loadMore/:userName/:pageIndex', async (ctx, next) => {
  const { userName, pageIndex } = ctx.params
  ctx.bydy = {
    title: 'this is loadMore API',
    userName,
    pageIndex
  }
})

module.exports = router
