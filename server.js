// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var bodyParser = require('body-parser');
//var https = require('https');

var port  	 = process.env.PORT || 3000; 				// set the port

var passport = require('passport');
var cookieParser = require('cookie-parser');
var session      = require('express-session');


var database = require('./config/database'); 			// load the database config

// configuration ===============================================================

mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the root location static files this is important for mime types
	app.use(express.logger('dev')); 						// log every request to the console
	//app.use( bodyParser.json() );       // to support JSON-encoded bodies
	app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  		extended: true
	}));

	app.use(cookieParser()); // read cookies (needed for auth)
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
	app.use(session({ secret: 'sundance_sundance_sundance' ,saveUninitialized: true, resave: true})); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb'}));
});

require('./config/passport')(passport); // pass passport for configuration

// routes ======================================================================
require('./routes').routes(app, passport);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
