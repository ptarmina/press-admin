var User = require('../models/user');		//model for application information
var pAdmin = require('../models/administrative');
var pApp = require('../models/application');
var pAdminUser = require('../models/admin_user.js');
var cNote = require('../models/contact_notes');
var async = require('async');

module.exports.routes = function(app,passport) {

	app.post('/api/v1/admin/detail', function(req, res, next) {

		if (req.user) {
			async.waterfall(
				[
					function(callback) {
						
						pAdmin.findOne({ "_app_id": req.body._app_id }, function(err, an_adm) {
							if (err) return res.json({ result: 'error' , message: err});

							if (an_adm) {
								//console.log('An admin has already be created for this user. Overwrite');
								
								an_adm.stage = req.body.stage;
								an_adm.status = req.body.status;
								an_adm.badge = req.body.badge;
								//an_adm.notes = req.body.notes;

								an_adm.save(function(err) {
									callback(err,an_adm);
								});
							}
							else {
								callback(err,null);
							}
						});
					},
					function(an_adm, callback) {

							var a = new pAdmin ( {
								_app_id : req.body._app_id,
								stage : req.body.stage,
								status : req.body.status,
								badge : req.body.badge
							});
							a.save(function (err) {
								callback(err,a);
							});
						}
						else {
							callback(null,an_adm);
						}
					},
					function(an_adm,callback) {

						if (an_adm == null) {
							callback('An admin record could not be created.');

						}
						else {
							console.log("find an application and update its admin id");
							pApp.findOne({ "_id": an_adm._app_id }, function(err, an_app) {
								if (err) callback(err,"failed");

								if (an_app) {

									an_app._admin_id = an_adm._id;
									an_app.save(function(err) {
										callback(err,an_app);
									});
								}
								else {
									callback("err finding app for admin");

								}
							});

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
	app.post('/api/v1/admin/multi', function(req, res, next) {

		if (req.user) {

			var idList = req.body.idList;

			idList.forEach(function(entry) {

				pAdmin.findOne({ "_app_id": entry}, function(err, an_adm) {
					if (err) return res.json({ result: 'error' , message: err});

					mySchema.schema.eachPath(function(path) {
						console.log(path);
					});

					if (an_adm) {

						if (req.body.hasOwnProperty("stage")) {
							an_adm.stage = req.body.stage;
						}
						if (req.body.hasOwnProperty("status")) {
							an_adm.status = req.body.status;
						}
						if (req.body.hasOwnProperty("badge")) {
							an_adm.badge = req.body.badge;
						}
						if (req.body.hasOwnProperty("notes")) {
							an_adm.notes = req.body.notes;
						}


						an_adm.save(function(err) {
							if (err) return res.json({ result: 'error' , message: err});
						});
					}
					else {

						// create a new admin record.
						var a = new pAdmin ({
							_app_id : entry

						});
						if (req.body.hasOwnProperty("stage")) {
							a.stage = req.body.stage;
						}
						if (req.body.hasOwnProperty("status")) {
							a.status = req.body.status;
						}
						if (req.body.hasOwnProperty("badge")) {
							a.badge = req.body.badge;
						}
						if (req.body.hasOwnProperty("notes")) {
							a.notes = req.body.notes;
						}

						//console.log("new admin obj: " + JSON.stringify(a));
						a.save(function (err) {
							if (err) return res.json({ result: 'error' , message: err});
						});
					}
				});

			});

			res.status(200).json({result: 'success', message: 'Administrative information saved.'})

		}
		else {
			return res.json({ result: 'error' , message: 'Session has expired. Login again.', info: 'login'});
		}
	});

	app.post('/api/v1/admin/all', function(req, res, next) {

		if (req.user) {
			/*
			 *	Update the administrative information
			 */
			var allObjs = req.body;
			

			allObjs.forEach( function(obj) {
				
				var idApp = obj.id;

				pAdmin.findOne({ "_app_id": idApp}, function(err, an_adm) {
					
					if (err) return res.json({ result: 'error' , message: err});
					console.log("Now updating administrative information");
					if (an_adm) {

						 lp = "";
						 pAdmin.prototype.schema.eachPath(function(path) {
							 p = path.substr(0, path.indexOf('.'));
							 if (p != lp) {
								 if (obj.hasOwnProperty(p)) {								 	
									 an_adm[p] = obj[p];
									 console.log('Setting: ' + p);
									 lp = p;
								 }
							 }
						 });

						an_adm.save(function(err) {
							if (err) {
								console.log("ERROR SAVING:" + err);
								return res.json({result: 'error', message: err});
							}
						});
					}
					else {
						// create a new admin record.
						var new_adm = new pAdmin ({
							_app_id : idApp
						});
						lp = "";
						pAdmin.prototype.schema.eachPath(function(path) {
							p = path.substr(0, path.indexOf('.'));
							if (p != lp) {
								if (obj.hasOwnProperty(p)) {
									new_adm[p] =  obj[p];
									lp = p;
								}
							}
						});

						console.log("new admin obj: " + JSON.stringify(new_adm));
						new_adm.save(function (err) {

							if (err) {
								console.log("ERROR SAVING:" + err);
								return res.json({result: 'error', message: err});
							}
						});
					}
				});
				/*
				 *	Update the application information
				 */

				pApp.findOne({ "_id": idApp}, function(err, an_app) {
					if (err) return res.json({ result: 'error' , message: err});
					console.log("Now updating application information");
					if (an_app) {
						lp = "";
						pApp.schema.eachPath(function(path) {
							p  = path.split('.')[1]; //just pull out the details
							//console.log('Finding: ' + p);
							if (p != lp) {
								if (obj.hasOwnProperty(p)) {
									an_app.details[p] =  obj[p];
									console.log('Setting - ' + p + " : " +  obj[p]);
									lp = p;
								}
							}
						});

						an_app.save(function(err) {
							if (err) {
								console.log("ERROR SAVING:" + err);
								return res.json({result: 'error', message: err});
							}
						});
					
					}
				});

				cNote.findOne({"_app_id": idApp}, function (err, c_note) {		
					if(c_note){
						console.log("app - contactnotes: " + JSON.stringify(c_note));
						c_note['Notes'] = obj['contact_notes'];
						
						c_note.save(function(err) {
							if (err) {
								console.log("ERROR SAVING:" + err);
								return res.json({result: 'error', message: err});
							}
						});

						console.log("contactnotes: " + JSON.stringify(c_note));
					}
				});	


			});
			res.status(200).json({result: 'success', message: 'Administrative information saved.'})

		}
		else {
			return res.json({ result: 'error' , message: 'Session has expired. Login again.', info: 'login'});
		}
	});
	app.post('/api/v1/admin/delete-users', function(req, res, next) {
		var allObjs = req.body;
		

		allObjs.forEach( function(obj) {

			var idApp = obj.id;
			var an_app;
			var an_adm;
			var c_note;
			var a_user;
			
			pApp.findOne({ "_id": idApp }, function(err, an_app) {
				if (err) return res.json({ result: 'error' , message: 'Error deleting user application.'});
				if(an_app){
					console.log("pApp");
					console.log(an_app);
					an_app.remove();

					User.findOne({ "_id": an_app._user_id}, function(err, a_user) {
					if (err) return res.json({ result: 'error' , message: 'Error deleting user.'});						
						if(a_user){
							console.log("User")
							console.log(a_user);
							a_user.remove();
						}
					});	
				}
			});	
			pAdmin.findOne({ "_app_id": idApp}, function(err, an_adm) {
				if (err) return res.json({ result: 'error' , message: 'Error deleting user administrative.'});					
				if(an_adm){
					console.log("pAdmin");
					console.log(an_adm);
					an_adm.remove();
				}
			});
			cNote.findOne({"_app_id": idApp}, function (err, c_note) {		
				if (err) return res.json({ result: 'error' , message: 'Error deleting user notes.'});				
				if(c_note){
					console.log("cNote");
					console.log(c_note);
					c_note.remove();
				}
			});		


		});	
		return res.json({result: 'success', details : 'Users have been deleted'});
	});

	app.get('/api/v1/admin/detail', function(req, res, next) {

	   if (req.user) {
			pAdmin.findOne({ "_app_id": req.query.q }, function(err, an_admin) {
				
				if (err) return res.json({ result: 'error' , message: err});

				if (an_admin) {
					return res.json({ result: 'success' , details: an_admin  });
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

	app.post('/api/v1/admin/state', function(req, res, next) {

		if (req.user) {

			pAdminUser.findOne({ "_id": req.user._id }, function(err, an_admin) {
				if (err) return res.json({ result: 'error' , message: err});

				if (an_admin) {

					an_admin.state = req.body;
					an_admin.save(function(err) {
						if (err) return res.json({ result: 'error' , message: err});
					});

					return res.json({ result: 'success'});
				}
				else {
					return res.json({result: 'success'});
				}
			});
		}
		else {
			return res.json({ result: 'error' , message: 'Session has expired. Login again.', info: 'login'});
		}
	});

	app.get('/api/v1/admin/state', function(req, res, next) {

		if (req.user) {
			
			pAdminUser.findOne({ "_id": req.user._id }, function(err, an_admin) {
				if (err) return res.json({ result: 'error' , message: err});

				if (an_admin) {
					return res.json({ result: 'success' , state: an_admin.state });
				}
				else {
					return res.json({result: 'success', state : null});
				}
			});
		}
		else {
			return res.json({ result: 'error' , message: 'Session has expired. Login again.', info: 'login'});
		}
	});

	app.post('/api/v1/admin/reset-users', function(req, res, next) {
		var allObjs = req.body;
		

		allObjs.forEach( function(obj) {

			var idApp = obj.id;
			var an_app;

			if(req.user){
				var my_user = req.user;
				console.log(my_user);
			}

			pApp.findOne({ "_id": idApp }, function(err, an_app) {
				if (err) return res.json({ result: 'error' , message: 'Error deleting user application.'});
				if(an_app){
					
					console.log("pApp");						
					
				}
			});	



		});	
		return res.json({result: 'success', details : 'Users have been reset'});
	});
};
