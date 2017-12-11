var ContactNote = require('../models/contact_notes');
var download = require('download-collection');

var getContactNotes = function(res, appId) {
  ContactNote.find({"_app_id": appId}, function(err, contactNotes){
    if (err) { console.log(err) }
    if(contactNotes){
      res.send(contactNotes);
    }else{
      res.status(200).json({result: 'success', message: 'No Notes found for this user'})
    }
  });
}

module.exports.routes = function(app, passport) {
  app.get('/api/v1/app/contact-notes/:appId', function(req, res, next) {

      var appId = req.params.appId;
      getContactNotes(res,appId);
  });


}

var downloadImages = function(){
	console.log('downloadImages');
	download([ 'http://c4.staticflickr.com/8/7585/16171080784_3d3a169714_h.jpg' ]);
}