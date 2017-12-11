
var cfenv = require("cfenv");


var appEnv = cfenv.getAppEnv();
db_path = '';

console.log('Running database: ' + db_path);

module.exports = {
        'url' : db_path
};
