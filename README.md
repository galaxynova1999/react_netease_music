#网易云音乐Web客户端

## 使用方法

本项目同时支持Web浏览器和Electron模式，切换方式为修改`main.js`文件，调整`mainWindow.loadURL`方法
要启动浏览器模式允许命令`yarn start`或`npm run start`

注意启动Electron之前必须先启动浏览器模式，之后再运行`npm run electron-start`

项目打包请运行npm run package

项目将会运行在[http://localhost:3002](http://localhost:3000)

## 后端服务的使用请参考[这里](https://github.com/Binaryify/NeteaseCloudMusicApi)
最后非常感谢@Binaryify大佬的提供的服务


