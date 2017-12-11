// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var validRole = function(role) {
    return ["admin", "reviewer"].indexOf(role) > -1;
};

// define the schema for our user model
var adminSchema = mongoose.Schema({

    local            : {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        level: String,
        role: { type: Object, required: false}
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    state   : mongoose.Schema.Types.Mixed
});

//less work for password reset....
adminSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 8;

  //if (!user.local.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.local.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.local.password = hash;
      next();
    });
  });
})

// generating a hash ONLY DO THIS IF YOU ARE NOT USING THE FUNCTION ABOVE. OTHERWISE YOU WILL BE ENCRYPTING THE ENCRYPTED
adminSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// other method for compararing
adminSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// checking if password is valid
adminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('AdminUser', adminSchema);

