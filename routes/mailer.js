var EventEmitter = require('events').EventEmitter
var nodemailer = require('nodemailer');
var auth = require('../config/auth');
var nodemailerConfig = require('../config/nodemailer');
var configAuth = require('../config/auth');
var emailTemplateCompiler = require('../services/email-template-compiler');
var Application = require('../models/application');
var Administrative = require('../models/administrative');
var ObjectId = require('mongoose').Types.ObjectId;
var EmailLog = require('../models/email_log');
var express = require('express');
var smtpTransport = require('nodemailer-smtp-transport');

var compileEmail = function(user, template) {
  //console.log(user.email)
  return {
    
    from: nodemailerConfig.from,
    to: user.email,
    subject: template.subject,
    html: template.body
  };
}

var createEmailLog = function(user, template) {
  console.log("template > "+template.name);
  var newEmailLog = new EmailLog({
    _user_id: ObjectId(user.id),
    template_name: template.name
  });
  newEmailLog.save(function(err, emailLog){
    if (err) { console.log(err); }
  });
}
var createEmailErrorLog = function(user, template) {
  console.log("template > "+template.name);
  var newEmailLog = new EmailLog({
    _user_id: ObjectId(user.id),
    template_name: 'Error: '+template.name
  });
  newEmailLog.save(function(err, emailLog){
    if (err) { console.log(err); }
  });
}

var updateState = function(user, toState) {
  //console.log("updateState > "+ toState)
  if (toState == "invited") {
    Administrative.findOne({"_app_id": ObjectId(user.id) }, function(err, administrative) {      
      administrative.stage = {
        name: "Invited",
        id: "invited"
      };
      administrative.save();      
    });
  }else if(toState == "reminder") {
    Administrative.findOne({"_app_id": ObjectId(user.id) }, function(err, administrative) {      
      administrative.stage = {
        name: "Reminded",
        id: "reminded"
      };
      administrative.save();      
    });
  }else if(toState == "final_reminder") {
    Administrative.findOne({"_app_id": ObjectId(user.id) }, function(err, administrative) {      
      administrative.stage = {
        name: "Final Reminder",
        id: "final_reminder"
      };
      administrative.save();      
    });
  }
}

var createTransport = function() {
  return nodemailer.createTransport(smtpTransport({
    host: nodemailerConfig.host,
    port: nodemailerConfig.port,
    auth: {
      user: configAuth.sesAuth.user,
      pass: configAuth.sesAuth.pass
    }
  }));
}
var sendMail = function(transporter, mailOptions) {
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });
}

var sendEmails = function(usersToEmail, templateName, errorListener) {

var transporter = createTransport();
  usersToEmail.forEach(function(user, index, users) {
    try {

      var template = emailTemplateCompiler.compileTemplate(user, templateName);
      var mail = compileEmail(user, template);
      
      sendMail(transporter, mail);
      updateState(user, template.toState);
      createEmailLog(user, template);

    } 
    catch(error) {
      console.log(error);

      createEmailErrorLog(user, template);
      errorListener.emit("error");
    }
  });

}

var sendResponse = function(errors, res) {
  if (errors > 0) {
    res.send({"data": {"result": "error"}})
  } else {
    res.send({"data": {"result": "success"}})
  }
}

module.exports.routes = function(app, passport) {
  app.post('/api/v1/app/email', function(req, res, next) {
    var errors = 0;
    var errorListener = new EventEmitter();
    errorListener.on("error", function() { errors++; });

    sendEmails(req.body.usersToEmail, req.body.templateId, errorListener);
    sendResponse(errors, res);
  });
}

module.exports.compileEmail = compileEmail;
module.exports.sendResponse = sendResponse;
