const Controller = require('./Controller')

class IndexController extends Controller{
    constructor(){
        super();
    }
    async actionIndex(ctx, next){
        ctx.body = await ctx.render("index.html", {
            data: '后端数据'
        })
    }
}

module.exports = IndexController
// actionIndex负责首页的展现