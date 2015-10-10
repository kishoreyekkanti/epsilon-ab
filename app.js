var cluster = require('cluster');
var uuid = require('node-uuid');
var cookie = require('cookie');
var cookieParser = require('restify-cookies');
var fs = require('fs'),
    nconf = require('nconf');
if (cluster.isMaster && 'production' === process.env.NODE_ENV) {
    var cpuCount = require('os').cpus().length;
    for (var i = 0; i < cpuCount / 4; i += 1) {
        cluster.fork();
    }
} else {
    global._ROOT = process.env.PWD;
    global._ROOT = "/Users/yekkanti/personalProjects/node_learning/epsilon-ab";
    nconf.argv()
        .env()
        .file({file: global._ROOT + '/config/config.json'});
    var nconfENV = nconf.get('NODE_ENV') || 'dev';
    global.DB_CONFIG = nconf.get(nconfENV + ":db");
    var restify = require('restify');
    var epsOptions = require('./controllers/eps_options/options');
    var reward = require('./controllers/eps_options/reward');
    var epsTest = require('./controllers/eps_options/eps_test');
    var logger = require('./log/logger');
    var server = restify.createServer({
        name: 'epsilon-ab-service',
        log: logger,
        versions: ['1.0.0']
    });
    server.use(restify.bodyParser());
    server.use(restify.queryParser());
    server.use(cookieParser.parse);
    server.use(restify.requestLogger());
    server.use(function (req, res, next) {
        req.connection.setTimeout(10000);
        next();
    });
    //Delete any timers added to logger
    server.use(function (req, res, next) {
        res.on("header", function () {
            delete logger._times[req.log.fields.req_id];
        });
        next();
    });
    //Set unique id for each request, if the request have a cookie by name unique_id
    //use it else generate a unique request id
//    server.use(function(req, res, next){
//        var uniqueId;
//        if(req.headers.cookie){
//            var cookies = cookie.parse(req.headers.cookie);
//            var uniqueId = cookies.unique_id;        
//        }
//        req.req_id = uniqueId || req.req_id;
//        res.setHeader('X-Request-Id', req.req_id);
//        next();
//    });    
    //Accept only json content types
//    server.pre(function(req, res, next){
//        res.setHeader('content-type', 'application/json');
//        if(!req.is('application/json')){
//            res.send(400, {"ERROR":'Invalid content-type'});
//            return;
//        }
//        if(!req.accepts('application/json')){
//            res.send(400, {"ERROR":'Invalid accept-type'});
//            return;
//        }
//        next();
//    });
    var port = process.env.PORT || '5000';
    server.use(function (req, res, next) {
        res.on("header", function () {
            delete logger._times[req.log.fields.req_id];
        });
        next();
    });
    server.get('/epsOption', epsOptions.get);
    server.put('/epsOption/reward', reward.put);
    server.put('/epsTest/conversion', epsTest.userConverted);

    server.listen(port, function () {
        logger.info('epsilon ab server listening on port ' + port);
    });
}
