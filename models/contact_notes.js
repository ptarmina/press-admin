var mongoose = require('mongoose');

/*
 * This data for this model is imported from a filemaker export csv
 *
 */
var contactnotesSchema = mongoose.Schema({

    _app_id      : mongoose.Schema.Types.ObjectId,
    fmContactID         : Number,
    Notes     		    : String,
    field3              : String,
    field4              : String
    //timestamp
    //time         : { type : Date, default: Date.now }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('ContactNote', contactnotesSchema);