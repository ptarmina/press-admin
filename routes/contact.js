
var User = require('../models/user');		//model for application information


var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var async = require('async');

//var util = require('util');

module.exports.routes = function(app,passport) {

	app.get('/api/v1/contact/detail', function(req, res, next) {

	   if (req.user) {
			pApp.findOne({ "_id": req.query.q }, function(err, an_app) {
				if (err) return res.json({ result: 'error' , message: err});

				if (an_app) {
					return res.json({ result: 'success' , details: an_app.details  });
				}
				else {
					return res.json({result: 'success', details : null});

				}
			});
		}
	   	else {
	   		return res.json({ result: 'error' , message: 'Session has expired. Login again.', info: 'login'});
	   	}
	});

	app.get('/api/v1/contact/all', function(req, res, next) {

		if (req.user) {

			Contact.find({}, function(err, all_c) {
				var contactMap = [];

				all_c.forEach(function(contact) {
					contactMap.push(contact
						//{"id": contact._id, "FirstName" : contact.FirstName,"LastName" : contact.LastName}

					);

				});

				res.json(contactMap);
			});
		}
		else {
			return res.json({ result: 'error' , message: 'Session has expired. Login again.', info: 'login'});
		}
	});



};
