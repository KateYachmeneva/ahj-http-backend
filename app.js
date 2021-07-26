const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const idGenerate = require('node-unique-id-generator');

const app = new Koa();
app
  .use(koaBody({multipart: true}))
  .use(cors());


const tickets = [{
    id: idGenerate.generateGUID(),
    name: 'Поменять краску в принтере, ком. 404',
    description: 'Принтер HP LJ-1210, картриджи на складе',
    status: false,
    created: Date.now()
  },
    {
      id: idGenerate.generateGUID(),
      name: 'Переустановить Windows, ПК-Hall24',
      description: '',
      status: false,
      created: Date.now()
    },
    {
      id: idGenerate.generateGUID(),
      name: 'Установить обновление KB-31642dv3875',
      description: 'Вышло критическое обновление для Windows',
      status: false,
      created: Date.now()
    }
  ];
  app.use(async ctx => {
    const { method,id } = ctx.request.query;

    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets;
            return;
        case 'ticketById':
            ctx.response.body = tickets.find(ticket => ticket.id === id)
            return;
        case 'createTicket':
            const createData = JSON.parse(ctx.request.body)
            const newTicket = {
                id: idGenerate.generateGUID(),
                name: createData.name,
                description: createData.description || '',
                status: false,
                created: Date.now()
            }
            tickets.push(newTicket);
            ctx.response.body = [newTicket]
            return;
        case 'deleteById':
            const idxToDel = tickets.findIndex(ticket => ticket.id === id)
            tickets.splice(idxToDel, 1)
            return;
        case 'updateById':
            const idxUpdt = tickets.findIndex(ticket => ticket.id === id);
            const updateData = JSON.parse(ctx.response.body)
            const ticket = {
                ...tickets[idxUpdt],
                ...updateData
            }
            tickets.splice(idxUpdt,1);
            tickets.splice(idxUpdt, 0, ticket);
            ctx.response.body = tickets;
            return;
        // TODO: обработка остальных методов
        default:
            ctx.response.status = 404;
            return;
    }
});
module.exports = app;
// let goods = { 1: {} };
// router.get('/', (ctx, next) => {
//   // ctx.router available
//   ctx.response.body = 'Hello World';
// });
// router.delete('/:id', (ctx, next) => {
//     console.log(ctx.request.params.id);// ctx.router available
//     ctx.response.body = 'Delete ' + ctx.request.params.id;
//   });
//   router.patch('/:goods/:id', (ctx, next) => {
//     console.log(ctx.request.body);// ctx.router available
//     const data = ctx.request.body;
//     if(!goods[data.id]){
//       return;
//     }
//     goods[data.id] = data;
//     ctx.response.body = JSON.stringify({status:'success'});
//    });


