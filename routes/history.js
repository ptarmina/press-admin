var History = require('../models/history');

var getHistory = function(res, appId) {
  History.find({"_app_id": appId}, function(err, hist){
    if (err) { console.log(err) }
    if(hist){	
	    res.send(hist);
	}else{
		res.status(200).json({result: 'success', message: 'No history found for this user'})
	} 	
  });
}

module.exports.routes = function(app, passport) {
  app.get('/api/v1/app/history/:appId', function(req, res, next) {

    var appId = req.params.appId;
    getHistory(res,appId);
  });
}
