const Controller = require('./Controller')

class ApiController extends Controller{
    constructor(){
        super();
    }
    async actionIndex(ctx, next){
        ctx.body = {
            data: xxx
        }
    }
    async actionCreate(ctx, next){
        
    }
}
module.exports = ApiController;
// 功能：向外提供路由