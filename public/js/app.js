'use strict';

// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', ['myApp.directives','ngRoute','ngCookies','ui.bootstrap','ui.bootstrap.tpls','ui.utils','ui.grid','ui.grid.edit','ui.grid.exporter', 'ui.grid.selection','ui.grid.resizeColumns', 'ui.grid.autoResize', 'ui.grid.saveState','ngSanitize', 'ui.grid.cellNav'])//])

.config(function($routeProvider,$httpProvider,$locationProvider,$rootScopeProvider) {

    $routeProvider.when('/login', {
    	templateUrl: 'views/partials/login.html',
    	controller: 'LoginCtrl'
    })      
	.when('/forgot-password', {
		templateUrl: 'views/partials/forgot-password.html',
		controller: 'PassWordCtrl'
	})
	.when('/sign-up', {
		templateUrl: 'views/partials/sign-up.html',
		controller: 'SignUpCtrl'
	})
	.when('/form', {
		templateUrl: 'views/partials/form.html',
		controller: 'FormCtrl'
	})
	.when('/reset/:token', {
		templateUrl: 'views/partials/reset.html',
		controller: 'SignUpCtrl'
	})
	.when('/confirmation', {
		templateUrl: 'views/partials/confirmation.html',
		controller: 'ConfirmCtrl'
	}).when('/admin', {
		templateUrl: 'views/partials/admin.html',
		controller: 'AdminCtrl'
	})
	.when('/', {
		templateUrl: 'views/partials/welcome.html',
	}).otherwise({ redirect: '/' });

});

myApp.factory('GridService', function($http, $q) {

    //    Create a class that represents our name service.
    function GridService() {
    
        var self = this;
        
        //    Initially the name is unknown....
        //self = null;
          
        //    getName returns a promise which when fulfilled returns the name.
        this.getGrid = function() {
            
            //    Create a deferred operation.
            var deferred = $q.defer();
            
            //If we already have the name, we can resolve the promise.
           
                //    Get the name from the server.
                $http.get('/api/v1/app/grid')
                .success(function(response) {
                    console.log('GridService')
                     return deferred.resolve(response);
                })
      
                .error(function(data) {
                    deferred.reject(response);
                });
            
            //    Now return the promise.
            return deferred.promise;
        };
    }
    
    return new GridService();
});

