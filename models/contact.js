var mongoose = require('mongoose');

/*
 * This data for this model is imported from a press office CSV
 * mongoimport -d press_application -c contacts --type csv --file ./fixtures/pressnext.csv --headerline
 */
var contactSchema = mongoose.Schema({

    FirstName           : String,
    LastName            : String,
    Email               : String,
    Organization        : String,
    Phone               : String,
    Mobile              : String,
    Work                : String,
    Home                : String,
    Street              : String,
    Street2             : String,
    City                : String,
    State               : String,
    Zip                 : String,
    Country             : String,
    Status              : String,
    Title               : String,
    fmContactID         : String

    //timestamp
    //time         : { type : Date, default: Date.now }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Contact', contactSchema);