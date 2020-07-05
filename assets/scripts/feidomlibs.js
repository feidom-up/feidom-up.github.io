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
            console.log(name)
          var func = _[name] = obj[name];
          _.prototype[name] = function() {
            var args = [this._wrapped];
            push.apply(args, arguments);
            console.log('args', args)
            // return chainResult(this, func.apply(_, args));
            // func(arguments)
          };
        });

      }

    function map(obj, handler){}
    var allExports = {
        map,
    }

    mixin(allExports);
    root._ = root
})()