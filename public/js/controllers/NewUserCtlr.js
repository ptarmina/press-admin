'use strict';

function NewUserCtlr($scope, $location, $http,$rootScope,$routeParams,$modalInstance) {

$scope.user = {}
$scope.newUser = {}
$scope.user =angular.copy($scope.newUser);

$scope.checkDetailChange = function(){
	console.log("checkDetailChange > "+angular.equals($scope.user,$scope.newUser))
	return angular.equals($scope.user,$scope.newUser);
}

};
