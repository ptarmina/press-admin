
//req for password reset
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var wellknown = require('nodemailer-wellknown');
var async = require('async');
var crypto = require('crypto');

var User = require('../models/user');
var configAuth = require('../config/auth');

module.exports.routes = function(app,passport) {

	app.post('/api/v1/services/forgot', function(req, res, next) {
	 //console.log('User logged in: ' + req.user);
	  async.waterfall([
		function(done) {
		  crypto.randomBytes(20, function(err, buf) {
			var token = buf.toString('hex');
			done(err, token);
		  });
		},
		function(token, done) {
		  console.log('findone email ' + req.body.email);
		  User.findOne({ "local.email" : req.body.email },
		   function(err, user) {
			if (!user) {
			  console.log('No account with that email address');
			  return res.json({ result: 'error' , message: 'We could not find that email address: Please try again.'});
			  //return res.redirect('/forgot');
			}
			console.log('Generating reset token for: ' + user.local.email);
			user.local.resetPasswordToken = token;
			user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour

			user.save(function(err) {
			  done(err, token, user);
			});
		  });
		},
		function(token, user, done) {
		  console.log('user: ' + configAuth.sesAuth.user);
		  var transport = nodemailer.createTransport(smtpTransport({
			host: 'email-smtp.us-east-1.amazonaws.com',
			port: 587,
			auth: {
			  //user: configAuth.sesAuth.user,
			  //pass: configAuth.sesAuth.pass
			  user: 'AKIAIIBB3TVZKDUFPJAQ',
			  pass: 'ArVLRdXFSCREWfo+0mdM4BGHnajchUAKTz2KbtJ3CXo7'
			}
		  }));

		  var mailOptions = {
			to: user.local.email,
			from: 'sundance_application@sundance.org',
			subject: 'Sundance Institute Login - password reset',
			text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
			  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			  'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
			  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		  };
		  transport.sendMail(mailOptions, function(err) {
		    if (err) {
		    	console.log('sendmail ERRROR' + err.toString());
		    	res.status(200).json({ result: 'error' , message: err.toString()});

		    }
			console.log('An e-mail has been sent to ' + user.local.email + ' with further instructions.');
			res.status(200).json({ result: 'success' , message: 'An e-mail has been sent to ' + user.local.email + ' with further instructions.'});
			//done(err, 'done');
		  });
		}
	  ], function(err) {
		if (err) return next(err);
		res.redirect('/forgot');
	  });
	});

	app.post('/api/v1/services/reset/:token', function(req, res) {
	  console.log('in reset token: ' + req.body.email)
	  async.waterfall([
		function(done) {
		  User.findOne({ "local.resetPasswordToken": req.params.token, "local.resetPasswordExpires": { $gt: Date.now() } }, function(err, user) {
			if (!user) {
			    console.log('cannot find user by password token');
			 	return res.json({ result: 'error' , message: 'Invalid or expired reset link. Please try again.'});
			}

			user.local.password = req.body.password;
			user.local.resetPasswordToken = undefined;
			user.local.resetPasswordExpires = undefined;

			user.save(function(err) {
			  //return res.json({ result: 'success' , message: ' Your password has been changed.'});
			  req.logIn(user, function(err) {
				done(err, user);
			  });

			});
		  });
		},
		function(user, done) {
		  var transport = nodemailer.createTransport(smtpTransport({
			host: 'email-smtp.us-east-1.amazonaws.com',
			port: 25,
			auth: {
			  user: 'AKIAIT6AC2TF72FOVIAQ',
			  pass: 'AtUGrPpoBBUiitWZUMKPc9yLwEjzkat5U9SdLbqiDQyU'
			}
		  }));

		  var mailOptions = {
			to: user.local.email,
			from: 'sundance_application@sundance.org',
			subject: 'Your password has been changed',
			text: 'Hello,\n\n' +
			  'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
		  };
		  transport.sendMail(mailOptions, function(err) {
		    if (err) {
		    	console.log('sendmail ERRROR' + err.toString());
		    	res.status(200).json({ result: 'error' , message: err.toString()});
		    }
		   	res.status(200).json({ result: 'success' , message: 'Your password has been set.'});
		   	//res.status(200).json({ result: 'error' , message: 'This is strange!'});

		  });
		}
	  ], function(err) {
		res.status(200).json({ result: 'error' , message: err.toString()});
	  });
	});

   	app.post('/api/v1/services/login', function(req, res, next) {
   	  passport.authenticate('local-login', function(err, user, info) {
   	    console.log('custom callback for login');
   		if (err) {
   			console.log('there is an error');
   			return next(err);
   		}
   		if (!user) {
   			if (info == 'invalid-user') {
   				return res.json({ result: 'error' , message: 'This email address is not registered.'});
   			}
			if (info == 'invalid-password') {
				return res.json({ result: 'error' , message: 'Invalid email or password.'});
			}
   			return res.status(200).json({ result: 'error' , message: info});
   			//return res.redirect('/#/login');
   		}
   		req.logIn(user, function(err) {
   		  if (err) { return next(err); }
   		  console.log('User logged in: ' + user._id.toString());
   		  //return res.redirect('/#/form');
   		  return res.status(200).json({ result: 'success' , message: 'You have successfully logged in.',token: user._id.toString()});
   		});
   	  })(req, res, next);
   	});

	app.get('/api/v1/services/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

	app.post('/api/v1/services/signup', function(req, res, next) {
	  passport.authenticate('local-signup', function(err, user, info) {
	    console.log('custom callback for signup');
		if (err) {
			console.log('there is an error');
			return next(err);
		}
		if (!user) {
			if (info == 'user-taken') {
				console.log('in use');
				return res.json({ result: 'error' , message: 'This email address is already in use.'});
			}
			//return res.redirect('/#/login');
		}
		req.logIn(user, function(err) {
		  if (err) { return next(err); }
		  console.log('User logged in: ' + user._id.toString());
		  //return res.redirect('/#/form');
		  return res.status(200).json({ result: 'success' , message: 'You have successfully signed up.',token: user._id.toString()});
		});
	  })(req, res, next);
	});
};
