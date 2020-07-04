class Controller{
    constructor(){};
    log(){
        console.log('打log专用', '父类Controller')
    }
}
module.exports = Controller;

//功能：初始化路由，Controller是路由的父类