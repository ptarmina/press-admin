var Application = require('../models/application');
var User = require('../models/user');
var ObjectId = require('mongoose').Types.ObjectId;
var multiparty = require('multiparty');
var AWS = require('aws-sdk');
var bucket = process.env.S3_BUCKET;
var s3Client = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET
}); 

var fileSizeOK = function(part, res) {
  if (part.byteCount / 1000 > 500) {
    res.send({'data': {'result': 'failure'}});
    console.log("Failed to upload " + part.filename + ". File size exceeds 500kb limit.");
    return false;
  } else {
    return true;
  }
}

var extensionOK = function(part, res) {
  var extension = extensionOf(part.filename);
  var permittedExtensions = ['.doc', '.docx', '.pdf'];
  if (permittedExtensions.indexOf(extension) === -1) {
    res.send({'data': {'result': 'failure'}});
    console.log("Failed to upload " + part.filename + ". Filetype is not PDF, DOC, or DOCX.");
    return false;
  } else {
    return true;
  }
}

var extensionOf = function(filename) {
  var extensionRegex = /\..+$/;
  if (filename.match(extensionRegex)) {
    return filename.match(extensionRegex)[0].toLowerCase();
  }
}

var addPathToApplication = function(path, userId) {
  Application.findOne({"_user_id": ObjectId(userId)}, function(err, application) {
    if (err) {
      console.log(err);
    } else {
      application.coverageLetterPath = path;
      application.save();
      console.log("Saved coverage letter path to application.");
    }
  });
}

var uploadToS3 = function(data, user, res) {
  var path = "coverage-letters/" + user.local.email + extensionOf(data.filename);
  s3Client.putObject({
    Bucket: bucket,
    Key: path,
    ACL: 'public-read',
    Body: data,
    ContentLength: data.byteCount,
  }, function(err, data) {
    if (err) {
      console.log(err);
      res.send({"data": {"result": "failure"}})
    } else {
      // addPathToApplication(path, req.user._id);
      console.log("Uploaded to https://s3.amazonaws.com/" + bucket + '/' + path);
      res.send({"data": {"result": "success"}});
    }
  });
}

module.exports.routes = function(app, passport) {
  app.post('/api/v1/app/upload-coverage-letter', function(req, res, next) {
    var form = new multiparty.Form();
    var userId;

    form.on('field', function(name, value) {
      if (name === 'user-id') {
        userId = value;
      }
    });

    form.on('part', function(part) {
      part.on('error', function(err) {
        console.log("Error with " + part.filename + " (from part).");
        res.send({"data": {"result": "failure"}});
      });
      if (fileSizeOK(part, res) && extensionOK(part, res)) {
        User.findOne({"_id": ObjectId(userId)}, function(err, user) {
          uploadToS3(part, user, res);
        });
      }
    });

    form.on('error', function(err) {
      console.log("Error with form (from form).");
      res.send({"data": {"result": "failure"}});
    });

    form.parse(req);
  });
}
