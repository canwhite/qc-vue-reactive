# qc-vue-reactive
vue响应式原理和发布订阅的设计模式

## des
```
将defineProperty和发布订阅配合，
get用于依赖收集
set用于更新视图
中间的工具类是Dep
还涉及到一种很有意思的添加外键的方法
```

## run
```
node index.js
```