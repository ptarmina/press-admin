var mongoose = require('mongoose');

/*
 * This data for this model is imported from a filemaker export csv
 *
 */
var historySchema = mongoose.Schema({

    _app_id      : mongoose.Schema.Types.ObjectId,
    FestivalYear        : Number,
    fmContactID         : Number,
    BadgeLevel          : String
    //timestamp
    //time         : { type : Date, default: Date.now }
}, { collection: "historys" });

// create the model for users and expose it to our app
module.exports = mongoose.model('History', historySchema);
