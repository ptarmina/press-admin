
//var User = require('../models/user');		//model for application information
var pApp = require('../models/application');
var formidable = require('formidable');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var async = require('async');

module.exports.routes = function(app,passport) {

	app.post('/api/v1/app/contact', function(req, res, next) {
	   if (req.user) {

			var a = new pApp ({
				_user_id : req.user.id,
				contact: req.body
			});

			a.save(function (err) {if (err) console.log ('Error saving application.')});
		}
	   	else {
	   		res.json({ result: 'error' , message: 'Session has expired. Login again.', info: 'login'});
	   	}
	});

	app.post('/api/v1/app/complete', function(req, res, next) {

	   if (req.user) {
		async.waterfall(
			[
			   function(callback) {
						console.log('complete application data for: ' + req.user.local.email + ' for ' + req.body.f_name);
						pApp.findOne({ "_user_id": req.user.id }, function(err, an_app) {
							if (err) return res.json({ result: 'error' , message: err});

							if (an_app) {
								console.log('An application has already be created for this user. Overwrite');
								an_app.details = req.body;
								an_app.save(function(err) {
									callback(err,an_app);
								});
							}
							else {
								callback(err,null);
							}
						});
				},
				function(an_app, callback) {
					if (an_app == null) {
						var a = new pApp ({
							_user_id : req.user.id,
							details: req.body
						});
						a.save(function (err) {
							  callback(err,'created.');
						});
					}
					else {
						callback(null,'overwritten.');
					}
				}
			],
			function(err,result) {
				if (err) {
					console.log('err in callback' + err.toString());
					res.status(200).json({ result: 'error' , message: err.toString()});
				}
				else {
					console.log('success an app was ' + result);
					res.status(200).json({result: 'success', message: 'You have successfully submitted your application'})
				}
            });
		}
	   	else {
	   		return res.json({ result: 'error' , message: 'Session has expired. Login again.', info: 'login'});
	   	}
	});

app.get('/api/v1/app/detail', function(req, res, next) {
		
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

	app.get('/api/v1/app/all', function(req, res, next) {

		if (req.user) {

			pApp.find({}, function(err, all_apps) {
				var appMap = [];

				all_apps.forEach(function(an_app) {
					console.log(an_app)
					appMap.push({"id": an_app._id, "f_name" : an_app.details.f_name,"l_name" : an_app.details.l_name});
				});

				res.json(appMap);
			});


		}
		else {
			return res.json({ result: 'error' , message: 'Session has expired. Login again.', info: 'login'});
		}
	});
	app.get('/api/v1/app/tall', function(req, res, next) {

		if (1) {
 			console.log(req.query.q);

			pApp.find({}).populate('_user_id').populate('_admin_id').exec(function(err, apps){
				console.log(err);
				return res.json({result: 'success', details : apps});
			})


		}
		else {
			return res.json({ result: 'error' , message: 'Session has expired. Login again.', info: 'login'});
		}
	});
	
	app.get('/api/v1/app/grid', function(req, res, next) {

		if (req.user) {
			pApp.find({}).populate('_user_id').populate('_admin_id').exec(function(err, apps){
				if (apps) {
					var gridOut = [];
					apps.forEach(function(appa) {
						
						gridOut.push({
							id: appa._id,
							user_id: appa._user_id,
							fmContactID: appa.details.fmContactID,
							f_name: appa.details.f_name,
							l_name: appa.details.l_name,
							address: appa.details.address,							
							city: appa.details.city,
							state:	appa.details.state,					
							coverage: appa.details.coverage,
							coverage17: appa.details.coverage17,
							postal: appa.details.postal,
							country: appa.details.country,
							outlet: appa.details.outlet,
							email:  appa.details.email,
							stage:  (appa._admin_id.length > 0) ? appa._admin_id[0].stage : null,
							status: (appa._admin_id.length > 0) ? appa._admin_id[0].status : null,
							badge: (appa._admin_id.length > 0) ? appa._admin_id[0].badge : null,
							opt_out: appa.details.opt_out,
					        phone_mobile: appa.details.phone_mobile,
					        phone_work: appa.details.phone_work,
					        phone_other: appa.details.phone_other,
					        photoPath: appa.details.photoPath,
					        assignmentPath: appa.details.assignmentPath,
					        coveragePath: appa.details.coveragePath,
					        assignmentPath17: appa.details.assignmentPath17,
					        coveragePath17: appa.details.coveragePath17,					        
					        title: appa.details.title,			        
					        date: appa.details.date,
					        attending: appa.details.attending,
					        attending17: appa.details.attending17,					        
					        twitter: appa.details.twitter,
					        admin_notes: appa.details.admin_notes
					                  					
						});

					});
					return res.json({result: 'success', details: gridOut});
				}
			})

		}
		else {
			return res.json({ result: 'error' , message: 'Session has expired. Login again.', info: 'login'});
		}

	});

};
