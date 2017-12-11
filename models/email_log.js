var mongoose = require('mongoose');

var emailLogSchema = mongoose.Schema({
  _user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  template_name: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
