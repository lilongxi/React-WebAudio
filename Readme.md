### 基于react和WebAudio构建的一个音乐可视化组件
>用到的技术react、WebAudio、mobx、axios、express
#### 先上图吧，看一眼。
![](http://okdlc4nlk.bkt.clouddn.com/audio.gif)
简单的实现了音乐可视化的功能，还有随机、循环、单曲等功能！

#### 准备后台环境
我用的是node和express来构建的后台应用。由于WebAudio需要用XMLHttpRequest来获取数据，但是基于浏览器的同源策略无法从同一个域名和端口来获取音频数据。当然除了用XMLHttpRequest的方式还可以用input[type='file']的fileReader来解析音频格式。具体就不在赘述了，有需要的可以去慕课网观看音乐可视化的教程！

#### 如何使用
express-music是server端所需依赖，npm install后执行supervisor bin/www启动项目，访问localhost:8080/data可以看到返回的数据。然后再根目录下npm install安装client端所需依赖即可！
