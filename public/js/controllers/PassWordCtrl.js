'use strict';

function PassWordCtrl($scope, $location,$rootScope,$http) {
	//--set logged state for log btn
	var c = angular.element('[ng-controller=GlobalCtrl]').scope();
	c.logged = false;
	c.nolog = false;
	$scope.posting = false;

	$("#login-error").css({"opacity":"0","max-height":"0"});		
	$("#password-success").css({"opacity":"0","max-height":"0"});

	$scope.cancel = function() {
	 	$location.url('/login');
	};

	$scope.update = function(user) {
		$scope.posting = true;

		resetMessaging();	
		var e = $scope.user.email;

		var myUrl = $scope.forgotServicePath;			
		var myObj = {email:e};

		$http({
			method: 'POST',
			url: myUrl,
			data:myObj
		}).
		success(function(data, status, headers, config) {
			$scope.posting = false;
			if(data.result=="success"){
				$scope.successs = [data];
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
		e = undefined;		
};
function resetMessaging(){		
	$("#login-error").css({"opacity":"0","max-height":"0"});		
	$("#password-success").css({"opacity":"0","max-height":"0"});
}

$scope.master= {};

$scope.reset = function() {
	$scope.user = angular.copy($scope.master);
};

$scope.isUnchanged = function(user) {
	return angular.equals(user, $scope.master);
};
};