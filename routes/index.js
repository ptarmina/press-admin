var fs = require('fs');

module.exports.routes = function(app,passport){
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file == "index.js") return;
        var name = file.substr(0, file.indexOf('.'));
        require('./' + name).routes(app,passport);
    });

    //======================================================================================================================
    // EVERYTHING ELSE GOES TO ANGULAR-ROUTE
    //======================================================================================================================

    app.get('*', function(req, res) {
       if (req.user) {
            console.log('User logged in.');
            res.sendfile('./public/press.html'); // load the single view file (angular will handle the page changes on the front-end)
        }
        else {
            console.log('User not logged in.');
             //res.redirect('/'); this does not work.
             res.sendfile('./public/press.html'); //needs to be login only app
        }
    });
}
