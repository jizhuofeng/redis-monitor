# redis-monitor
koa+react+antd写的一个简单redis状态监控工具. 目前主要监控内存使用情况、命令处理情况及实例中keys的分布情况 


## 技术栈

### 前端
    打包工具： webpack
    前端框架： react
    ui库： antd
    
### 后端
    node版本： >=7.6.0
    web框架： koa2
    
## 部署

### 前端

    client目录下
    前端部分为页面展示（已打包在server/public/js/build目录下）
    打包发布：
      cd client/
      npm install .
      npm run dev （此命令会将项目打包到server/public/js/build目录下)
  
  
### 后端
    后端启动分两部分（定时任务和服务接口）
 
    开发环境下：
      npm installl .
      定时任务启动收集数据：
        npm run dev 
      启动服务
        npm run dev-schedule
 
      
