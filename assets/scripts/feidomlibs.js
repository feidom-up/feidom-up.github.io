// 写类库的时候多用函数式编程
(function(){
    var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            Function('return this')() ||
            {};
    var ArrayProto = Array.prototype;
    var push = ArrayProto.push;
    function _(obj) {
        if (!(this instanceof _)) return new _(obj);
        // 初始化的构造函数
        this._wrapped = obj;
    };
    function each(obj, callback){
        if(Array.isArray(obj)){
            for(let item of obj){
                callback && callback.call(_, item)
            }
        }
    }
    function isFunction(obj){
        return typeof  obj == "function" || false
    }
    function functions(obj){
        var names = [];
        for(var key in obj){
            if(isFunction(obj[key])){
                names.push(key)
            }
        }
        return names
    }
    function mixin(obj) {
        each(functions(obj), function(name) {
          var func = (_[name] = obj[name]);  // 方法往静态方法上挂
          _.prototype[name] = function() {   // 静态方法往原型上挂
            var args = [this._wrapped];
            push.apply(args, arguments);
            console.log('args', args)
            return func.apply(_, args)
            // func(arguments)
          };
        });

    }
    // 函数式编程实现节流
    function throttle(fn, wait = 2000){
        let timer;
        return function(...args){
            if(timer == null){
                timer = setTimeout(()=>{
                    timer = null
                }, wait)
                return fn.apply(this, args)
            }
        }
    }
    function map(obj, handler){
        if(isFunction(handler)){
            console.log('obj', obj)
            console.log('handler', handler)
        }else{
            throw new Error('传参错误，不执行')
        }
        
    }
    var allExports = {
        map,
        throttle
    }

    mixin(allExports);
    root._ = _
})()