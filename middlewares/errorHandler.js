class errorHandler{
    static error(app, logger){
        app.use(async (ctx, next)=>{
           try{
                await next()
           }catch(e){
                logger.error(e);
                ctx.body="500请求了-恢复了"
           }
        })
        app.use(async (ctx, next)=>{
            await next();
            if(404 !== ctx.status){
                return;
            }
            ctx.status = 200;
            ctx.body = '<script type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js" charset="utf-8"></script>'
        })
    }
}
module.exports = errorHandler