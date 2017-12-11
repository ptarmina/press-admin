'use strict';

function GlobalCtrl($scope, $location, $http,$rootScope) {

	$scope.logged = false;

	var env = window.location.hostname;	
	$scope.goLogIn = function() {
	 	$location.url('/login');
	};
	$scope.goLogOut = function() {
		var myUrl = "/api/v1/services/logout";
		$http({
			method: 'GET',
			url: myUrl,
		}).
		success(function(data, status, headers, config) {

		}).
		error(function(data, status, headers, config) {

		});
		$scope.logged = false;

	 	$location.url('/');

	};	

	$scope.getLoginPath = function(){
		
	 	if(env == "localhost"){	 	
			return	"/login";		
	 	}else{
			return	"/";
		}
	}
	$scope.setCookie = function(k,v){	
	    if (typeof(localStorage) != 'undefined') {
		localStorage.setItem(k, v);
	    } else {
		$cookieStore.put(k, v);
	    }	
	}	
	$scope.getCookie = function(k){
	    var v; 
	    if (typeof(localStorage) != 'undefined') {
		v = localStorage.getItem(k);
	    } else {
		v = $cookieStore.get(k); 
	    }
	
	    return v;
	}
	$scope.clearCookie = function(k){
	    if (typeof(localStorage) != 'undefined') {
		localStorage.removeItem(k);
	    } else {
		$cookieStore.remove(k);
	    }	
	}

	$scope.loadConfig = function(){

		var myUrl = "config/app.json";

		$http({
			method: 'GET',
			url: myUrl,
		}).
			success(function(data, status, headers, config) {

				$rootScope.isProto = data.isProto;
				$rootScope.e=data.email;
				$rootScope.p=data.pw;
				$rootScope.logInServicePath=data.logInPath;
				$rootScope.forgotServicePath=data.forgotPath;	
				$rootScope.signUpServicePath=data.signUpPath;
				
			}).
			error(function(data, status, headers, config) {

			});		
			
	};
	$scope.loadConfig();

	$scope.location = $location.url();
	$scope.ll = $scope.location.split('/').length;
	$scope.token = $scope.location.split('/')[$scope.ll-1];
	
};
