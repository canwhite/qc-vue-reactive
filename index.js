//依赖收集发生在getter阶段，setter部分是notify
function defineReactive(obj,key,val){
    /*
        obj: 目标对象
        prop: 需要操作的目标对象的属性名
        descriptor: 描述符

        return value 传入对象
    */
    const dep = new Dep();
    Object.defineProperty(obj,key,{
        enumerable:true,//可枚举
        configurable:true,//可更改
        //依赖收集
        get:function reactiveGetter(){
            // return val;//实际上在这里会收集依赖
            /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
            dep.addSub(Dep.target);
            return val;
        },
        //更新
        set:function reactiveSetter(newVal){
            if(newVal == val) return
            /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
            dep.notify();
        }
    })
}

//我们在defineReactive其上再封装一层
function observer(value){
    if(!value || (typeof value !== "object")){
        return;
    }
    Object.keys(value).forEach((key)=>{
        defineReactive(value,key,value[key])
    })
}


//首先我们来实现一个订阅者|发布者 Dep，
//---如果是从add的层面来说它是订阅者，目的是收集行为，
//---但它还有触发功能notify，所以一定程度上它还是一个发布者

class Dep{
    /* 一个Dep类对象 */
    constructor(){
        /* 用来存储watcher对象的数组 */
        this.subs = [];
    }
    /* 在subs里添加Watcher对象 */
    addSub(sub){
        this.subs.push(sub);
    }
    /* 通知所有watcher对象更新视图 */
    notify(){
        this.subs.forEach((sub)=>{
            sub.update();
        })
    }
}

//观察者
class Watcher{
    constructor(){
        /* 在new一个watcher随想时将该对象赋值给Dep.target,
        在get中会用到 */
        Dep.target = this; 
        //这种挂载方式很奇特呀
        //在new的时候将自己挂载为另一个类的外键
        
    }
    //更新视图
    update(){
        console.log("视图更新了");
    }

}



//在 Vue 的构造函数中，对options的data进行处理，
//这里的 data 想必大家很熟悉，
//就是平时我们在写 Vue 项目时组件中的 data 属性
class Vue{
    /* Vue构造类 */
    constructor(options){
        this._data = options.data;
        observer(this._data);
        /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
        new Watcher();
        /* 在这里模拟render的过程，为了触发test属性的get函数 */
        console.log('render~', this._data.test);
    }
}


let o = new Vue({
    data:{
        test:"I am test."
    }
})
o._data.test = "hello,world";




