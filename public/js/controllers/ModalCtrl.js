'use strict';

function ModalCtrl($scope, $location, $http,$rootScope,$routeParams,$modalInstance,uiGridConstants,GridService) {

$scope.user = {};
$scope.master= {};
$scope.user =angular.copy($scope.selectedUser);

$scope.checkDetailChange = function(){
	return angular.equals($scope.user,$scope.selectedUser);
}

$scope.addUser= function(obj){
	$scope.posting = true;
	var myUrl = '/api/v1/util/create-user';

	$http({
		method: 'POST',
		url: myUrl,
		data:obj,
		headers: {'Content-Type': 'application/json'}

	}).success(function(data,status, headers, config) {
		console.log('success');
		console.log(data);
		
		if(data.result=="success"){	
			$scope.closeAddUserModal();
			$scope.clearAll();		
		}else{
			var code = [data][0].message.code;
			if(code == '11000'){
				$scope.errors =
				[
					{
						"result": "error",
						"message": "This User Already Exists in Our System"
					}
				];
			}else{
				$scope.errors = [data];
			}
		};
		$scope.posting = false;	
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
};
$scope.addAdmin= function(obj){
	console.log(obj)
	$scope.posting = true;

	var myUrl = '/api/v1/util/create-admin';

	$http({
		method: 'POST',
		url: myUrl,
		data:obj,
		headers: {'Content-Type': 'application/json'}

	}).success(function(data,status, headers, config) {

		if(data.result=="success"){	
			$scope.closeAddAdminModal();
			$scope.clearAll();		
		}else{
		$scope.errors =
			[
				{
					"result": "error",
					"message": "THIS ACCOUNT ALREADY EXISITS"
				}
			];
		};
		$scope.posting = false;
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
};
$scope.isUnchanged = function(user) {
	return angular.equals(user, $scope.master);
};
$scope.reset = function() {
	$scope.user = angular.copy($scope.master);
};
$scope.clearErrors = function() {
	$scope.errors =	[];
};
$scope.getPreview = function(type,obj){

 	var usersToEmail = obj;
	$http.post('api/v1/app/preview-template', { "usersToEmail": usersToEmail, "templateId": type })
	.success(function(data,status, headers, config) {
		if(data.result=="success"){
			$scope.previewSuccess(data);
		}else{
			$scope.previewFail();			
		};
	}).
		error(function(data, status, headers, config) {
			$scope.previewFail();
	});
}
$scope.previewSuccess = function(obj){
	$scope.emailTemplateSubject = obj.template.subject;
	$scope.emailTemplateBody = obj.template.body;
}
$scope.previewFail = function(){

}
$scope.reset();
};