
var User = require('../models/user');
var App = require('../models/application');
var Admin = require('../models/administrative');
var Contact = require('../models/contact');
var AdminUser = require('../models/admin_user.js');
var ContactNote = require('../models/contact_notes');
var History = require('../models/history');

var archiver = require('archiver');
var p = require('path');
var fs = require('fs');

module.exports.routes = function(app,passport) {

	app.get('/api/v1/util/buildapps', function(req, res, next) {


			Contact.find({}, function(err, all_c) {

				all_c.forEach(function(contact) {

					if ((contact.Email.length > 0) && (contact.Email !== "cressandra@me.com")) {

						var new_user = new User({local: {email: contact.Email}});

						var new_adm = new Admin({
							stage: {
								name: "imported" //invited,application,inreview,accepted,rejected
							},
							status: {
								name: "returning" //contact.Status
							},
							badge: {
								name: "none"
							}
						});
						var new_app = new App({
							_user_id: new_user.id,
							_admin_id: new_adm.id,
							details: {
								f_name: contact.FirstName,
								l_name: contact.LastName,
								email: contact.Email,
								address: contact.Street + ' ' + contact.Street2,
								city: contact.City,
								country: contact.Country,
								postal: contact.Zip,
								phone_mobile: contact.Mobile,
								phone_work: contact.Work,
								phone_home: contact.Home,
								phone_other: contact.Phone,
								outlet: contact.Organization,
								state: {
									name: contact.State,
									id: contact.State
								},
								fmContactID: contact.fmContactID
							}
						});

						new_adm._app_id = new_app.id;


						new_app.save(function (err) {
							//console.log();
							if (err) {
								console.log("ERROR SAVING:" + err);
								return res.json({result: 'error', message: err});
							}
						});
						new_adm.save(function (err) {
							//console.log();
							if (err) {
								console.log("ERROR SAVING:" + err);
								return res.json({result: 'error', message: err});
							}
						});

						new_user.save(function (err) {
							//console.log();
							if (err) {
								console.log("ERROR SAVING:" + err);
								return res.json({result: 'error', message: err});
							}
						});
						delete new_user;
						delete new_app;
						delete new_adm;
						console.log("Building App for : " + contact.Email);
					}
				}); 

			});
	});

	app.get('/api/v1/util/buildnotes', function(req, res, next) {

		App.find({}, function (err, all_a) {
			all_a.forEach(function (an_app) {

				if (an_app.details.fmContactID !== "") {
					ContactNote.find({"fmContactID": an_app.details.fmContactID}, function (err, all_c) {
						console.log("app - contactnotes - fmID: " + JSON.stringify(all_c));
						if (all_c.length > 0) {
							all_c[0]._app_id = an_app.id;
							all_c[0].save(function (err) {
								if (err) {
									console.log("ERROR SAVING:" + err);
									return res.json({result: 'error', message: err});
								}
							});
						};
					});
				};
			});
		});
	});
	app.get('/api/v1/util/buildhistory', function(req, res, next) {

		App.find({}, function (err, all_a) {
			all_a.forEach(function (an_app) {

				if (an_app.details.fmContactID !== "") {
					History.find({"fmContactID": an_app.details.fmContactID}, function (err, all_c) {
						console.log("app - history - fmID: " + JSON.stringify(all_c));
						if (all_c.length > 0) {
							all_c[0]._app_id = an_app.id;
							all_c[0].save(function (err) {
								if (err) {
									console.log("ERROR SAVING:" + err);
									return res.json({result: 'error', message: err});
								}
							});
						};
					});
				};
			});
		});
	});
	app.get('/api/v1/util/contact/all', function(req, res, next) {

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
	app.post('/api/v1/util/create-admin', function(req, res, next) {

		var new_admin = new AdminUser({local: {
											email: req.body.email,
											password: req.body.password,
											role: req.body.role

											}});
		new_admin.save(function (err) {

			if (err) {
				console.log("ERROR SAVING:" + err);
				return res.json({result: 'error', message: err});
			}else{

				res.status(200).json({result: 'success', message: 'You have successfully created an admin user'})
			}
		});
		


	});	





	app.post('/api/v1/util/create-user', function(req, res, next) {
		console.log('create-user')
		var new_user = new User({local: {email: req.body.email}},function (err) {
			if (err) {
				console.log("ERRCREATEUSER:" + err);
				return res.json({result: 'error', message: err});
			}
			console.log(new_user);
		});
		new_user.save(function (err) {
			if (err) {
				console.log("ERRSAVINGUSER:" + err);
				return res.json({result: 'error', message: err});
			}
			else {
				 var new_adm = new Admin({stage: {name: "Imported", id:"imported"}, status: {name: "New", id:"new"}, badge: {name: "None", id:"none"}});
				 var new_app = new App({_user_id: new_user.id, _admin_id: new_adm.id, details: {f_name: req.body.f_name, l_name: req.body.l_name, email: req.body.email,}});
				 var new_cnotes = new ContactNote({_app_id: new_app._id});
				 var new_history = new History({_app_id: new_app.id});
				 
				 console.log(new_adm);
				 console.log(new_app);
				 console.log(new_cnotes);
				 console.log(new_history);

				 new_adm._app_id = new_app.id;

				 new_app.save(function (err) {
					 if (err) {
						 console.log("ERROR SAVING:" + err);
					 	return res.json({result: 'error', message: err});
					 }
				 });
				 new_adm.save(function (err) {
					 if (err) {
					 	console.log("ERROR SAVING:" + err);
					 	return res.json({result: 'error', message: err});
					 }
				 });


				 new_cnotes.save(function (err) {
					 if (err) {
					 	console.log("ERROR SAVING:" + err);
						 return res.json({result: 'error', message: err});
					 }
				 });
				 new_history.save(function (err) {
					 if (err) {
						 console.log("ERROR SAVING:" + err);
						 return res.json({result: 'error', message: err});
					 }
				 });

				 console.log('---------- AFTER ---------')

				 console.log(new_adm);
				 console.log(new_app);
				 console.log(new_cnotes);
				 console.log(new_history);

				 res.status(200).json({result: 'success', message: 'created user'})
			}
		});
	});


	app.post('/api/v1/util/downloadImages', function(req, res, next) {

		var imageList =[];

		req.body.forEach(function(obj){		
			imageList.push(obj.photoPath)
	    });

		res.status(200).json({result: 'success', message: 'You have not done anything yet'})



	});
};



