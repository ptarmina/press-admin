var EmailLog = require('../models/email_log');
var ObjectId = require('mongoose').Types.ObjectId;

var getEmailLogs = function(res, userId) {
  EmailLog.find({"_user_id": [ ObjectId(userId) ]}, function(err, emailLogs){
    if (err) { 
     
      res.send({"result": "error"});
    } else {
      if(emailLogs){  
        res.send(emailLogs);
      }else{
        res.status(200).json({result: 'success', message: 'No Email Logs found for this user'})       
      }
    }
  });
}

module.exports.routes = function(app, passport) {
  app.get('/api/v1/app/email-logs/:userId', function(req, res, next) {
    var userId = req.params.userId;
    console.log("in email route");
    getEmailLogs(res, userId);
  });
}

module.exports.getEmailLogs = getEmailLogs;
