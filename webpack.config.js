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