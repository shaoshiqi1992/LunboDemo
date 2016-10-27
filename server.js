var express = require('express'), //引入express模块
    app = express(),
    server = require('http').createServer(app);
app.use('/',express.static(__dirname+'/'));
server.listen(process.env.PORT || 3000);