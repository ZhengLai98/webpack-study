# webpack-study
webpack学习
###### 以下学习笔记来自于《Webpack实战：入门、进阶与调优》

创建项目目录
npm init初始化项目
产生package.json
本地安装
npn install webpack webpack-cli--save-dev

###### 打包命令
###### npx webpack --entry=./index.js --output-filename=bundle.js --mode=development
//入口：index.js
//出口：bundle.js
//模式：开发者模式
###### 其他js

```
export  default  function () {
    document.write('hello world');
}
```
###### index.js

```
import addContent from './add-content.js';
document.write('My first Webpack app.');
addContent();
```
##### 简化命令
在package.json“script”中添加**build**,script是npm 提供测脚本命令功能

```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build":"webpack --entry=./index.js --output-filename=bundle.js --mode=development"
  },
```
#### 使用默认目录配置
webpack默认源码入口就是**src/index**
将index.js等文件加入src 文件夹
修改命令为
> webpack --output-filename=bundle.js --mode=development
#### 使用配置文件
webpack拥有非常多的配置项以及对应的命令行参数
> 查看 npx webpack -h
配置越多脚本越多，维护困难
###### 解决方案：
把参数改为对象专门存放在配置文件中
在webpack打包时，读取该文件配置
webpack**默认配置文件**webpack.config.js
###### webpack.config.js
```
module.exports={
    entry:'./src/index.js',//资源入口
    output:{
    //参数--output -filename和--output-path都成文了output对象
    //的属性
        filename:'bundle.js'
        //webpack要求output.path使用绝对路径
        //调用node.js的路径拼装函数【path.join】，__dirname与输出连接起来
    },
    mode:'development'
}
```
通过module.exports导出一个对象，打包时候被webpack接受的配置对象
#### webpack-dev-server
> npm install webpack-dev-server --save-dev

--save-dev作为工程的依赖记录在package.json中
这个在本地开发中能够用到生产环境中不需要
所以放在devDependencies中
###### 功能
- 进行模块打包并处理结果的资源请求
- 作为普通的【web server】处理静态请求
- live-reloading功能可以监听文件变化
## 模块打包
模块于程序，就如同细胞于生物体
- 不同模块的标准以及区别
- 如何编写模块
- 模块打包管理
## commonJS
nodejs采用了common标准的一部分
最初只为服务端设计
- 规定每个文件是一个模块
> index.js
```
var name='index.js';
require('./calculator.js');
console.log(name);
```
###### calcilator.js中的变量声明不会影响index.js各个模块拥有各个模块的作用域

### 导出
导出一个模块是向外暴露自身的唯一方式
##### module.exprots导出内容

```
module.exprts={
    name:'lailai'
}
```

CommonJS模块内部自身有一个module模块
###### 简单理解为commonJS每个模块首部默认以下代码

```
var module={
    exports:{}
}
var export=module.exports
```

###### 不要把exports.add和module.exports混用以下代码exports.add会被覆盖

```
exports.add=function(a,b){
    return a+b;
}
module.exports={
    name:'lailai'
};
```
###### 直接给exports赋值是失效的,要通过.方法添加属性

```
exports={
    name:'calculater'
}
//exports.[prototype]是简易用法，原本还是modile.exports={}
```
###### 导出语句不代表模块的末尾 以下代码console.log依然执行

```

module.exports={
    name:'lailai'
};
console.log('end');
```
### 导入
> 在CommonJS中使用require进行模块导入
###### index.js

```
const calculator=require('./calculator.js');
const sum=calculator.add(2,3);
document.write(`来自calculator的add方法的值为${sum}`);

```

###### require一个模块时候会有两种情况
- require的模块是第一次加载
> 执行该模块导出内容
- require的模块曾经被加载过
> 此时该模块代码不会再次执行，直接导出上次执行后得到结果，模块有一个module对象用来存放其信息，这个对象中有一个属性loaded用于记录模块是否被贾在国
###### require函数可以接收表达式借助这个特性我们可以动态指定模块加载路径

```
const moduleNames=["foo.js","bar.js"];
moduleName.forEach(name=>{
    require('./'+name)
})
```
## ES6 Module（自动采用严格模式）
### 导出
    
```
export default {
    name:'calculator',
    add:(a,b)=>{
        return  (a+b);
    }
}
```
###### 两种形式
- 命名导出

```
//命名导出一
export const name='caculator';
export const add=function (a,b) {
    return a+b;
}
//命名导出2
const name='caculator';
const add=function (a,b) {
    return a+b;
}
export {name,add};
```
- 默认导出

```
export default {
    name:'calculator',
    add:(a,b)=>{
        return  (a+b);
    }
```

### 导入

- 加载默认导出
```
import calcu from './calculator.js';
const sum=calcu.add(2,3);
document.write(`es6 get by import,sum=${sum}`);
```
两者都可以通过as重新命名
- 加载命名导出

```
import {name,add} from './calculator.js';
import * as cal from './calculator.js';
```
默认导出和命名导出可以同时使用
#### 复合写法
//在工程中有时候需要把一个模块导入后立即导出
//专门集合所有页面或组件的入口文件

```
//命名导出
export {name,add} from './calculate.js
//默认导出只能分开写
import cal from './calculate.js'
export default cal;
```
### CommonJs和ES6两种形式的区别

Null|CommonJs |ES6
---|---|---
对于模块依赖的解决|动态的（建立在代码运行阶段 |静态的（建立在代码编译阶段
优势|row 2 col 1 | 死代码加测和排除。/模块变量类型检查/编译器优化（减少引用层级，直接导入变量
#### 值拷贝与动态映射
> 在导入一个模块时候，CommentJS获取的是值拷贝，ES6导入模块获取的是动态映射
##### 可以对Comment导入的变量进行更改不可以对ES6导入变量进行更改
#### 循环依赖：模块A依赖于B同时模块B依赖于模块A

```
//foo.js
const  bar=require('./bar.js');
console.log('value of bar :',bar);
module.exports="this is foo.js";
//bar.js
const foo=require('./foo.js');
console.log('value of foo',foo);
module.exports="this is bar.js"
//index.js
require('./foo.js')
```
###### 期望输出
value of bar :his is bar.js
value of foo：this is foo.js
###### 实际输出
 value of foo Object//es6模块规范是undefine
value of bar : this is bar.js
###### 原因
1. index.js导入foo.js开始执行
2. foo.js导入bar.js不会继续执行进入bar.js内部
3. bar.js对foo进行请求，执行权不会再交回foo.js而是直接取出其(foo)导出值module.export
4. 但由于Foo.js为执行完毕此时module是默认空对象
5. bar执行完毕执行权交回foo，继续正常执行
###### ES6解决动态循环
### 非模块化文件
指的是不遵循任何一种标准的文件
例如在script中引入JQ及各种插件
webpack中直接引入使用
这类库一般将接口绑定到全局
```
import './jquery.min.js'
```

以隐式全局变量声明的方式暴露其接口，

```
var calculator={}
```
由于webpack在打包时候会为每个文件包一层函数作用域来避免全局污染，上面代码无法把Calculator对象挂在全局
## AMD(异步模块定义)
专注于支持浏览器端模块化的标准
异步调用不清晰容产生回调地狱
```
1. 第一个参数：当前模块ID,相当于模块名
2.第二个参数箱单能够与当前模块依赖
3.描述模块导出值
```
###### 导出使用require异步形式

```

define('getSum',['calculator'],function (math) {
    return function (a,b) {
        console.log('sum:'+calculator.add(a,b));
    }
})
require(['getSum'],function (getSum) {
    getSum(2,3)
})
```
## UMD(模块形式集合)
通用标准模块：目标使用一个模块能够运行在各种环境下

```
(function (global,main) {
    if(typeof  define==='function'&&define.amd){
        //AMD
        define();
    }else if(typeof exports==='object'{
        //commenJS
        module.exports=;
    })else {
        global.add=...;
    }
}(this,function () {
    return {...}
}))

```
###### 注意！！！：一定要先判断AMD环境因为通过AMD定义的模块是无法引用CommonJS或es6正确引用的
## 加载npm模块
js主流包管理器npm 和yarn

从本地工程安装加载一个外部Npm模块
初始化一个npm
###### 项目初始化

```
npm init -y
npm install loadsh
```
使用引入包名

```
impot_from 'lodash'
//webpack在打包解析到这条语句就会自动去寻找名为lodssh的模块
```
实际打包过程中具体加载的是npm 模块中的哪一个js文件
> 每个npm模块都有一个入口当我们加载一个模块的时候实际上是在加载模块的入口文件。
这个入口被维护在模块内部的packag.json文件的main字段中
###### 单独加载模块内部某个js减少打包资源体积


```
<package_name>/<path>
```
###### 模块打包原理
- 最外层立即执行匿名函数包裹整个bundl构成自身作用域
- installedModules对象，每个模块在第一次被加载的时候执行之后的导出值 被存储到这个对象里面，当再次被加载的时候可以从这个直接取值不会重复执行
- __webpack_require__函数。对模块加载的实现
- modules对象所有产生依赖关系都会以key-value形式放在整理
###### bundle如何在浏览器中执行
- 最外层匿名函数初始化浏览器执行环节（包括installed-Modules对象，__webpack_requir__函数等
- 加载入口模块每个bundle只有一个入口模块
递归过程遇见require交出执行权，判断installed、odules用 有没有，有则直接取值不然回到mouleexport
- 执行模块代码，回
## 资源输入输出
存在依赖关系的模块会在打包时候被封装为一个chunk。
### chunk（代码块：被抽象和包装过后的一些模块）
配置不同一个工程打包的时候会产生一个或多个chunck
> Webpack会从入口文件开始减弱并将具有依赖关系的模块生产一颗依赖树最终得到一个chunk由chunk得到的打包产物我们一般称之为bundle.
###### 在工程中可以定义多个入口，每个入口都会产生一个结果资源
###### 特殊情况下一个如果也能纯生多个chunk并最终生成多个bundle
### 资源配置入口
- 确定入口模块位置，告诉webpack从哪里进行打包
- 定义chunk name,
##### Context（只能为字符串）
###### context可以理解为资源入口的路径前缀在配置时要求必须使用绝对路径的形式
目的：让entry编写更加简洁
### entry（可以多种形式：字符串，数组对象函数）
- 字符串类型入口//无法更改该chunk name
- 数组类型入口（作用是将多个资源预先合并，打包时webpack会将数组最后一个元素作为实际的入口路径无法更改该chunk name
- 对象类型如果（如果想定义多入口，必须使用对象的形式，对象的属性名（key是chunk name,属性值value是入口路径
- 函数类型入口，返回以上任何配置形式
有点可疑在含糊试图添加些动态逻辑获取入口
### 实例
对于SPa应用来说，一般定义单一入口即可
###### 在webpack默认设置中，当一个bundle大于250kb压缩连会认为过大，在打包时会发生警告
#### 提取vendor（供应商）
在webpack中一般是指工程所使用的库框架等第三方模块集中打包而产生的bundle
1. 在入口文件中添加
2. 但是没有入口路径webpack如何打包optimization.splitChunks
由于vandor仅包含第三方模块这部分不会经常变得英才可以有效利用客户端缓存，在用户后续请求页面时候会加快整体的渲染算的
### 资源配置出口output对象
- filename不仅是一个文件名还可以是一个相对路径
###### 类似模板语言支持动态生成文件名
```
output:{
    filename:'[name].js'
}
filename:'[name/hash/chunkhash/id/query].js'
```
##### path
用来指定资源输出的位置

```
output:{
    filename:'[name].js',
    path:path.join(__dirname,dist)
}
```
##### publicePath
用来指定资源请求的位置
- html相关
- Host
- CDN相关
区分webpak dev server中的指定静态资源服务路径

## loader（预处理器）赋予webpack无尽的想象力
loader本质上都是一个函数//噶函数对接受到的内容进行转换然后返回转换后的结果
output=loader(input)
loader可以是链式的
###### webpack本事只认识javascript对于其他类型的资源编写预先定义一个或多个loader对其进行转义，输出为webpack 能接受的形式
### loader的引入
假设预处理css

```
npm install css-loader

```
然后将loader引入工程中

```
module: {
        rules:[{
            test:/\.css$/,//尾巴上匹配css文件
            use:['css-loader'],//use可以接收一个数组数组包含该规则使用的loader
        }]
    }
```

loader相关配置都在module对象中其中module,rules代表了模块的处理规则
1. 按照一切皆模块的思想从js加载一个css文件
2. import './css/style.css'
3.不报错不 生效，因为css-loader的作用仅仅是处理css的各种加载语法
4. 演示如果样式其作用还需要style-loader
###### 链式loader
###### 一个css{先sass-loader处理语法编译为css，接着用css-loader处理css的各类加载语法，最后style-loader}

```
  module: {
        rules:[{
            test:/\.css$/,//尾巴上匹配css文件
            use:['style-loader','css-loader'],
        }]
    }
```
###### style-loader加到css-loader前面webpack打包顺序时按照数组从后往前，所以最后生效的放在最前
### loader options
loader作为于处理器通常会给开发者提供一些配置项，
引入loader是的时候可以通过options将他们传入
#### exclude 和include是用来排除或包含指定目录下模块接收正则或文件路径

```
      module: {
        rules:[{
            test:/\.css$/,//尾巴上匹配css文件
            use:['style-loader','css-loader'],
            options:{
                //css-loader配置项
            },
            //exclued优先级高
            exclude:/node_modules/,//所用被node_modules匹配到的模块都被排除到该模块之外
            include:/src/,//表示只对该匹配模块生效
        }]
    }
```

#### resource和issuer
用于更加精确的确定模块规则作用范围
- 被加载的是resource
- 加载是issuer
> 前面的（test,indclude）本质上属性对被加载者的配置
> 对加载者配置

```
module: {
        rules:[{
            test:/\.css$/,//尾巴上匹配css文件
            use:['style-loader','css-loader'],
            options:{
                //css-loader配置项
            },
            exclude:/node_modules/,//所用被node_modules匹配到的模块都被排除到该模块之外
            include:/src/,//表示只对该匹配模块生效
            issuer:{
                test:/\.js$/,
                include:'/src/pages'
            }//只有该js文件引用css，生效
        }]
    }
```
改写易于观察等价模式

```
 module: {
        rules:[{

            use:['style-loader','css-loader'],
            resource: {
                test:/\.css$/,//尾巴上匹配css文件
                exclude:/node_modules/,//所用被node_modules匹配到的模块都被排除到该模块之外
            },
            issuer:{
                test:/\.js$/,
                include:'/src/pages'
            }//只有该js文件引用css，生效
        }]
    }
```

#### enforce
用来指定loader的种类只接受pre,post
> Webpack中的loader按照执行顺序可以分为pre,inline,normal,post四种直接定的都都属于nomal

```
rules:[
        {
            test:/\.js$/,
            enforce:'pre',
            use:'eslient-loader',
        }
    ]
```
###### 添加一个eslient-loader进行质量检测，pre代表可以在所有loader值钱执行，如果需要之后执行需要设置为post

### 常用loader介绍
1. babel-loader
2. ts-loader
3. html-loader
4. file-loader
5. url-loader
6. vue-loader

