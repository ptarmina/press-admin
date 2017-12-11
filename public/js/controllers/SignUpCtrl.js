'use strict';

function SignUpCtrl($scope, $location,$http,$rootScope) {
	//--set logged state for log btn
	var c = angular.element('[ng-controller=GlobalCtrl]').scope();
	c.logged = false;
	c.nolog = false;
	$scope.posting = false;
	
	$scope.user={}
	$scope.cancel = function() {
	 	$location.url('/login');
	};
	$scope.rePasswordMatch = function(user){
		if(user.password == undefined || user.re_password == undefined){
			return false;
		}
		return angular.equals(user.password, user.re_password);
	}

	$scope.passwordMatch = function(user){
		return angular.equals(user.password, user.re_password);
	}

	$scope.clearErrors = function() {
		$scope.errors =	[];
	};

	$scope.update = function(user) {
		$scope.posting = true;

		var p = $scope.user.password;
		var e = $scope.user.email;

		var myUrl = $scope.signUpServicePath;
		var myObj = {email:e,password:p};

		$http({
			method: 'POST',
			url: myUrl,
			data:myObj
		}).
		success(function(data, status, headers, config) {
			$scope.posting = false;
			if(data.result=="success"){

				$scope.success = [data];
				$scope.clearErrors();
				$location.url('/admin');
				//$location.url('/form/'+data.token);

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

	$scope.updatePassword = function(user) {

		var p = $scope.user.password;
		var e = $scope.user.email;
		var t = $scope.token;

		var myUrl = '/api/v1/services/reset/' + t ;
		var myObj = {email:e,password:p};

		$http({
			method: 'POST',
			url: myUrl,
			data:myObj
		}).
		success(function(data, status, headers, config) {

			if(data.result=="success"){
				$scope.successs = [data];
			}else{
				$scope.errors = [data];
			};
		}).
		error(function(data, status, headers, config) {
			$scope.errors = [data];
		});
		p = undefined;
		e = undefined;
	};
};



