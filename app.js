var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
var recordFilter = require('./app/servers/chat/filter/recordFilter');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatofpomelo');

//var path = require('path');
//app.loadConfig('record', path.resolve('./config/record.json'));
// app configure
app.configure('production|development', function() {
	// route configures
	app.route('chat', routeUtil.chat);
	// load record.json
	app.loadConfig('record', app.getBase() + '/config/record.json');
	// filter configures
	app.filter(pomelo.timeout());
	app.filter(recordFilter(app));
    app.set('connectorConfig', {
        connector : pomelo.connectors.hybridconnector,
        heartbeat : 30,
        disconnectOnTimeout : false,
        useDict : true,
        useProtobuf : true
    });

    app.set('errorHandler', function (err, msg, resp, session, next) {
        console.log(err, msg, resp, session);
        next();
    });
});


// start app
app.start();

process.on('uncaughtException', function(err) {
	console.error(' Caught exception: ' + err.stack);
});
