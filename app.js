const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();


let goods = { 1: {} };
router.get('/', (ctx, next) => {
  // ctx.router available
  ctx.response.body = 'Hello World';
});
router.delete('/:id', (ctx, next) => {
    console.log(ctx.request.params.id);// ctx.router available
    ctx.response.body = 'Delete ' + ctx.request.params.id;
  });
  router.patch('/:goods/:id', (ctx, next) => {
    console.log(ctx.request.body);// ctx.router available
    const data = ctx.request.body;
    if(!goods[data.id]){
      return;
    }
    goods[data.id] = data;
    ctx.response.body = JSON.stringify({status:'success'});
   });

app
  .use(koaBody({multipart: true}))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(cors());

  module.exports = app;