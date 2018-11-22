# webpack-study
webpack学习
webpackdemo
安装
创建文件夹进入文件夹
--npm init -y//-y是默认选项
--npm install webpack webpack-cli --save-dev
创建src\dist文件夹
创建webpack.config.js文件//webpack配置文件还需要安装server插件webpack只支持js打包，打包其他文件也需要相应的插件这里只安装了html插件
在package.json中的script下配置命令
/*webpack.config.js目录结构*/
const path=require('path');
const HtmlWebpackPluplugin=require('html-webpack-plugin');
module.exports={
    entry:{
        "index":"./src/index1.js",
    },
    output:{
        filename:'[name].js',
        path:path.resolve(__dirname,"dist")
    },
    module:{},
    plugins:[
        new HtmlWebpackPluplugin({
            title:'superzheng',
            minify: {
                removeAttributeQuates: true
            },
            hash:true,
            template:'./src/index.html'
        })
    ],
    devServer:{
        contentBase:path.resolve(__dirname,'dist'),
        host:'localhost',
        port:'8081',
        compress:true
    }

}
