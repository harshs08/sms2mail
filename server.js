/**
 * Created with JetBrains WebStorm.
 * User: harshsingh
 * Date: 3/8/14
 * Time: 6:14 AM
 * To change this template use File | Settings | File Templates.
 */

// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8080; 				// set the port
//var database = require('./config/database'); 			// load the database config
var passport = require('passport');
var flash 	 = require('connect-flash');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport);

app.configure(function() {
    app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
    app.use(express.logger('dev')); 						// log every request to the console
    app.use(express.bodyParser()); 							// pull information from html in POST
    app.use(express.methodOverride());
    app.use( express.cookieParser() );
    app.use(express.session({ secret: 'yoyohoneysingh' }));// simulate DELETE and PUT
    // required for passport
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

});

// routes ======================================================================

require('./app/routes.js')(app, passport);
//require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);