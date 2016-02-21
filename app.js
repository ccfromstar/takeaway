var express,app,http,path,routeCtrl,controllers,morgan,log4js,logger,bodyParser,cookieParser;
	express= require('express');
	app = express();
	http = require('http');
	path = require('path');
	routeCtrl = require("./routes/ctrl");
	controllers = require('./routes/index');
	morgan = require('morgan');
	log4js = require("log4js");
  bodyParser = require("body-parser");  
  cookieParser = require('cookie-parser');

//前端显示视图魔板的路径views文件夹
app.set('views', path.join(__dirname, 'views'));
//视图采用的模板
app.set('view engine', 'ejs');
//静态html文件的目录
app.use(express.static(path.join(__dirname, 'public')));
//express监听的端口号(默认为环境变量设置的端口号)
app.set('port',process.env.PORT || 4000);
//Express自带的Logger中间件实现终端日志的输出
app.use(morgan('dev'));
//express处理POST请求
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//文件上传路径
app.use(express.bodyParser({uploadDir:'./public/pic'}));
//express session
app.use(cookieParser());
app.use(express.session({ secret: "keyboard cat" }));

//-------------设置服务器端的显示日志BEGIN---------------
log4js.configure({
    appenders: [
      { type: 'console' },
      {
      	type: 'file',
      	filename: 'logs/access.log',
      	maxLogSize:1024*100,
      	backups:4
      }
    ],
    replaceConsole: true
});

logger = log4js.getLogger("normal");

app.use(log4js.connectLogger(logger, {
    level: log4js.levels.TRACE
}));

//index.js文件如果需要调用错误处理日志，则通过​var logger = require('../app').logger('index');来调用​
exports.logger=function(name){
  var logger = log4js.getLogger(name);
  logger.setLevel('TRACE');
  return logger;
}

//当服务器进程异常时记录错误日志
process.on('uncaughtException', function(err){
	logger.info(err.stack);
});
//-------------设置服务器端的显示日志END---------------

//路由里的错误日志
app.use(function(err, req, res, next) {
    logger.info(err.stack);
    return res.status(err.status || 500).end();
});

//设置路由的跳转规则
routeCtrl(app, controllers);

http.createServer(app).listen(app.get('port'),function(){
	logger.info("server start on port " + app.get('port'));
});