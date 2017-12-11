// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email: { type: String, unique: true}, //  email: { type: String, unique: true }, COMMENT BACK IN BEFORE PRODUCTION JJ
        password: { type: String },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        administrative: Boolean
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
    }
});

//less work for password reset....
userSchema.pre('save', function(next) {
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
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// other method for compararing
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

