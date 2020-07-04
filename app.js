const Koa = require('koa');  //koa

const co = require('co');            // koa render  需要的组件，node自带
const render = require('koa-swig')   // koa render
const serve = require('koa-static')  // koa 静态资源

const { historyApiFallback } = require('koa2-connect-history-api-fallback'); // 真假路由的关键 history

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

app.use(historyApiFallback({ index: '/', whiteList: ['/api'] }));   //要写在路由逻辑的前边

require('./controllers')(app);  // 路由逻辑

app.listen(port,()=>{
    console.log('node server is running', port)
});