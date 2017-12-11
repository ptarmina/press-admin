'use strict';

function LoginCtrl($scope, $location, $http,$rootScope,$routeParams) {

	//--set logged state for log btn
	var c = angular.element('[ng-controller=GlobalCtrl]').scope();
	c.logged = false;
	c.nolog = true;
	$scope.posting = false;

	$("#login-error").css({"opacity":"0","max-height":"0"});		
	$("#password-success").css({"opacity":"0","max-height":"0"});
	
	$scope.forgot = function() {
	 	$location.url('/forgot-password');
	};

	$scope.signUp = function() {
	 	$location.url('/sign-up');
	};
	
	$scope.update = function(user) {  
		$scope.posting = true;

		var p = $scope.user.password;
		var e = $scope.user.email;
		var myUrl = $scope.logInServicePath;
		var myObj = {email:e,password:p};

		$http({
			method: 'POST',
			url: myUrl,
			data:myObj
		}).
		success(function(data, status, headers, config) {
			$scope.posting = false;
			if(data.result=="success"){
				$location.url('/admin');
				$scope.clearErrors();
				$scope.setLogged();
			}else{
				$scope.errors = [data];
			};
		}).
			error(function(data, status, headers, config) {
			$scope.posting = false;	
			$scope.errors =	
				[
					{
					"result": "error", 
					"message": "SERVER ERROR: PLEASE TRY AGAIN"         
					}
				];	
		});
		p = undefined;
		e = undefined;

	};
	$scope.master= {};

	$scope.isUnchanged = function(user) {
		return angular.equals(user, $scope.master);
	};
	$scope.reset = function() {
		$scope.user = angular.copy($scope.master);
	};
	$scope.clearErrors = function() {
		$scope.errors =	[];
	};
	$scope.setLogged = function(){
		var c = angular.element('[ng-controller=GlobalCtrl]').scope();
		c.logged = true;
	}
	
	$scope.reset();

};
