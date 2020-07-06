//使用的是underscore.js类库  http://underscorejs.org/#
// 原型链上的map
_([546]).map(function(){
    console.log(456)
});
// 静态方法的map
// _.map("京城一等奖", function(){

// })
const { throttle } = _;
const btn = document.getElementById('js-btn');
btn.addEventListener("click", throttle(()=>{
    console.log(Math.random())
}))