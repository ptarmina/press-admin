'use strict';

function ConfirmCtrl($scope, $location, $http,$rootScope,$routeParams) {
	//--set logged state for log btn
	var c = angular.element('[ng-controller=GlobalCtrl]').scope();
	c.nolog = true;
};
