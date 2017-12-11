var mongoose = require('mongoose');

var administrativeSchema = mongoose.Schema({

    _app_id      : mongoose.Schema.Types.ObjectId, // this is set by the route controller the reset are straight json to json from the request body

    //administrative data for applications

    stage: {
        name: String, //invited,application,inreview,accepted,rejected
        id:  String
    },
    status: {
        name: String, //vip,returning,new
        id:  String
    },
    badge: {
        name: String, //Next Credentialed 
        id:  String
    },
    state: {
        name: String, //Next Credentialed 
        id:  String
    },        
    notes   : String,
    time    : { type : Date, default: Date.now }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Administrative', administrativeSchema);



        