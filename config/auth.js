// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '', // your App ID
        'clientSecret'    : '', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : '',
        'consumerSecret'     : '',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '',
        'clientSecret'     : '',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    },
    'sesAuth' : {
        user: '',
        pass: ''
        //'user'  : 'AKIAIT6AC2TF72FOVIAQ',
        //'pass'  : 'AtUGrPpoBBUiitWZUMKPc9yLwEjzkat5U9SdLbqiDQyU'
    },


    'nodemailerAuth': {
      service: 'Gmail',
      auth: {
        user: '',
        pass: ''
        
      }

    }

};
