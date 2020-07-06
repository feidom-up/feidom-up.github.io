const moduleAlias = require('module-alias')
 
moduleAlias.addAliases({
  '@root'  : __dirname,
  '@models': __dirname + '/models',
  '@controllers': __dirname + '/controllers',
})



const Koa = require('koa');  //koa

const co = require('co');            // koa render  需要的组件，node自带
const render = require('koa-swig')   // koa render
const serve = require('koa-static')  // koa 静态资源
const log4js = require("log4js");   // 日志插件
const errorHandler = require("./middlewares/errorHandler.js")

const { historyApiFallback } = require('koa2-connect-history-api-fallback'); // 真假路由的关键 history

// 配置日志插件log4js
log4js.configure({
    appenders: { cheese: { type: "file", filename: "logs/feidom.log" } },
    categories: { default: { appenders: ["cheese"], level: "error" } }
  });
const logger = log4js.getLogger("cheese");

const { port, viewDir, memoryFlag, staticDir } = require('./config')
const app = new Koa();

app.context.render = co.wrap(render({
    root: viewDir,
    autoescape: true,
    cache: memoryFlag, // disable, set to false
    ext: 'html',
    varControls:['[[',']]'],
    writeBody: false
}));

app.use(serve(staticDir));

errorHandler.error(app, logger)
// app.use(historyApiFallback({ index: '/', whiteList: ['/api'] }));   //要写在路由逻辑的前边

require('./controllers')(app);  // 路由逻辑

app.listen(port,()=>{
    console.log('node server is running', port)
});


// 静态资源
// 业务逻辑
// historyApiFallback