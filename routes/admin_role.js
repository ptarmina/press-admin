var AdminUser = require('../models/admin_user');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports.routes = function(app, passport) {
  app.get('/api/v1/app/admin-role', function(req, res, next) {
    res.send({"role": req.user.local.role});
  });

}
