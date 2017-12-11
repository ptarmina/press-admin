var mongoose = require('mongoose');

var applicationSchema = mongoose.Schema({

    //_user_id      : mongoose.Schema.Types.ObjectId, // this is set by the route controller the reset are straight json to json from the request body
    _user_id        :    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    _admin_id       :    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Administrative' }],
    //application data
    details           : {
        f_name        : String,
        l_name        : String,
        email         : String,
        address       : String,
        city          : String,
        country       : String,
        postal        : String,
        phone_mobile  : String,
        phone_work    : String,
        phone_other   : String,
        outlet        : String,
        coverage      : String,
        coverage17      : String,
        twitter       : String,         
        opt_out       : Boolean,
        state: {
            name: String,
            id:  String
        },
        title: {
            name: String,
            id:  String
        },
        attending: {
            name: String,
            id:  String
        }, 
        attending17: {
            name: String,
            id:  String
        },               
        fmContactID: String,
        photoPath: String,
        assignmentPath: String,
        coveragePath: String,
        assignmentPath17: String,
        coveragePath17: String,        
        admin_notes: String,
        date: Date
    },
    time         : { type : Date, default: Date.now } 
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Application', applicationSchema);
