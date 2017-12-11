'use strict';

function AdminCtrl($scope, $location, $http,$rootScope,uiGridConstants,$modal,$timeout, $interval, GridService) {
$scope.groups = []
//--set logged state for log btn
$scope.c = angular.element('[ng-controller=GlobalCtrl]').scope();

$scope.c.nolog = false;
$scope.posting = false;
$scope.inSession = false;

$scope.userDetails={};

$scope.rowsSelcted = 0;
$scope.adminElementChanged = "";

$scope.hasImages = false;

$scope.gridOptions = {
    enableFiltering: true,     
    enableSorting: true,
    enableColumnResizing: true,    
    enableGridMenu: true,
    exporterMenuPdf: false,
	multiSelect: true,
	showGridFooter: true,

	//--settings for save and restore state
	saveWidths: true,
	saveOrder: true,
	saveScroll: false,
	saveFocus: true,
	saveVisible: true,
	saveSort: false,
	saveFilter: false,
	savePinning: true,
	saveGrouping: true,
	saveGroupingExpandedStates: false,
	saveTreeView: false,
	saveSelection: false,

    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;

		gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
    		$scope.checkBadges();
      	});
    	gridApi.selection.on.rowSelectionChanged($scope,function(data){
    		$scope.checkBadges();		
	      	});
	      	$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
    	},       
    	columnDefs: [
     		{
  			field: 'Edit',

  			enableCellEdit: false,
			enableSorting: false,
			enableFiltering: false,
			enableColumnMenu: false,
 			width: 42, 
			displayName: '',
  			cellTemplate: '<button type="button" class="btn btn-edit" ng-click="grid.appScope.editFromGrid(this.row.entity)"> <span  class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>'
			},
      		{ name:'ID', field: 'id', visible:false},
      		{ name:'User Id', field: 'id', visible:false},
          	{ name:'First Name', field: 'f_name'},
          	{ name:'Last Name', field: 'l_name' },
          	{ name:'Image', field: 'photoPath', visible:false },
          	{ name:'Assignment Path 17', field: 'assignmentPath17', visible:false },
          	{ name:'Coverage Path 17', field: 'coveragePath17', visible:false }, 
          	{ name:'Coverage Path', field: 'coveragePath', visible:false },
          	{ name:'Title', field: 'title.name', visible:false },           	         	
          	{ name:'Coverage 17', field: 'coverage17', visible:false },
          	{ name:'Outlet', field: 'outlet'},
		  	{ name:'Email', field: 'email'},
		  	{ name:'Address', field: 'address',visible:false},
		  	{ name:'City', field: 'city',visible:false},
		  	{ name:'State', field: 'state.id',visible:false},
		  	{ name:'Postal Code', field: 'postal',visible:false},
		  	{ name:'Country', field: 'country',visible:false},
		  	{ name:'FM ID', field: 'fmContactID',width:120},
		  	{ name:'Opt Out', field: 'opt_out', visible:false, width:120, filter:{
		  		type: uiGridConstants.filter.SELECT,
	          	selectOptions: [ {label:"True",value:"true"},{label:"False",value:"false"}]
		  	}},
		  	
		  	{ name:'Stage',field: 'stage.name', width:120,filter: {
	          	type: uiGridConstants.filter.SELECT,
	          	selectOptions: [ {label:"Imported",value:"imported"},
	          					{label:"Invited",value:"invited"},
	          					{label:"Reminded",value:"reminded"},
	          					{label:"Final Reminder",value:"final reminder"},
	          					{label:"Late Reminder",value:"late reminder"},		
	          					{label:"Submitted",value:"submitted"},
	          					{label:"Review",value:"review"},
	          					{label:"Credentialed",value:"credentialed"},
	          					{label:"Notified",value:"notified"},
	          					{label:"Exported",value:"exported"}]
          	},},
		  	{ name:'Status',field: 'status.name', width:120, filter: {
	          	//term: '0',
	          	type: uiGridConstants.filter.SELECT,
	          	selectOptions: [ { value: 'vip', label: 'VIP' }, { value: 'returning', label: 'Returning' }, { value: 'new', label: 'New'} ]
          	},},
		  	{ name:'Badge', field: 'badge.name', width:120, filter: {
	          	//term: '0',
	          	type: uiGridConstants.filter.SELECT,
	          	selectOptions: [{label:"Express",value:"express"},
				{label:"Express_B",value:"express_b"},
				{label:"SLC_Express",value:"slc_express"},
				{label:"General_A",value:"general_a"},
				{label:"General",value:"general"},
				{label:"Working",value:"working"},
				{label:"Photographer_Line",value:"photographer_line"},
				{label:"Photographer_Venue",value:"photographer_venue"},				
				{label:"Denied",value:"denied"},
				{label:"None",value:"none"}]
          	},},
      	],
    };
$scope.updateGrid = function(){
	$scope.openStatusModal();
	$scope.app_status = "Updating Grid";

	var myUrl = '/api/v1/app/grid';
	$http({
		method: 'GET',
		url: myUrl,
		headers: {'Content-Type': 'application/json'}
	})
	.success(function(data,status, headers, config) {

		if(data.result=="success"){

			$scope.gridOptions.data = null;

			/* keep this*/
			var i = 0;
			var myData =  [];
			
	 		data.details.forEach(function(row){
	            row.r_id = i;
	            i++;
	           myData.push(row);
	          });	
				
			$scope.gridOptions.data = myData;
			$scope.setLoggedIn();			
			$scope.closeStatusModal();

		}else{
			console.log(data);
			$scope.closeStatusModal();
			$scope.errors = [data];
			
			if(data.info == "login"){
				$scope.goLogOut();
				$scope.location = '/login';
			}else{
				$scope.errors = [data];
			}			
		};
	}).
		error(function(data, status, headers, config) {
		$scope.errors = [data];
	});
}
$scope.updateRow = function(obj){
	$scope.gridOptions.data[obj.r_id] = obj;
}	
$scope.submitChanges= function(){
	$scope.updateNotes($scope.curr_id);
};
$scope.setLoggedIn = function(){
	$scope.inSession = true;
	$scope.c.logged = true;
}
$scope.export = function(){
      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));

      $scope.export_column_type = 'visible';
      $scope.export_row_type = 'visible';
      $scope.gridApi.exporter.csvExport( $scope.export_row_type, $scope.export_column_type, myElement );
};
$scope.saveState = function() {
  	$scope.state = {};
   	$scope.state = $scope.gridApi.saveState.save();
	$scope.posting = true;

	var myUrl = '/api/v1/admin/state';
	var myObj = $scope.state;

	$http({
		method: 'POST',
		url: myUrl,
		data:myObj,
		headers: {'Content-Type': 'application/json'}

	}).success(function(data,status, headers, config) {
		$scope.posting = false;
		if(data.result=="success"){
		}else{
			$scope.errors = [data];
		};
	}).error(function(data, status, headers, config) {
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
$scope.restoreState = function() {
	$scope.posting = true;

	var myUrl = '/api/v1/admin/state';
	var myObj = $scope.state;

	$http({
		method: 'GET',
		url: myUrl,
		data:myObj,
		headers: {'Content-Type': 'application/json'}

	}).success(function(data,status, headers, config) {
		$scope.posting = false;

		if(data.result=="success"){
			  $scope.gridApi.saveState.restore( $scope, data.state );
		}else{
			$scope.errors = [data];
		};
	}).error(function(data, status, headers, config) {
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

$scope.toggleMultiSelect = function() {
    $scope.gridApi.selection.setMultiSelect(!$scope.gridApi.grid.options.multiSelect);
};
$scope.selectAll = function() {
    $scope.gridApi.selection.selectAllRows();
};
$scope.clearAll = function() {	
    $scope.gridApi.selection.clearSelectedRows();
    $scope.rowsSelcted = 0;
    $scope.stageMulti = null;
    $scope.statusMulti = null;
    $scope.badgeMulti = null;    
};
$scope.setStageMulti = function(str){
	$scope.stageMulti = str;
}
$scope.setStatusMulti = function(str){
	$scope.statusMulti = str;
}
$scope.setBadgeMulti = function(str){
	$scope.badgeMulti = str;
}
$scope.setExported = function(){   	
   	var myObj = [];    	
    myObj = angular.copy($scope.exportMaster);
	
	angular.forEach(myObj, function(value, key) {			
		value.stage = {}
		value.stage.id = 'exported';
		value.stage.name = 'Exported';	
	})
	$scope.selectedUsers = myObj;
	$scope.updateUser(false);
}
$scope.getMulti = function(){   	
   	var myObj = [];    	
    myObj = angular.copy($scope.gridApi.selection.getSelectedRows());
	
	$scope.totalrequests = -1;

	angular.forEach(myObj, function(value, key) {
		
		$scope.totalrequests++;
		
		if($scope.stageMulti){			
			value.stage = {}
			value.stage.id = $scope.stageMulti.id;
			value.stage.name = $scope.stageMulti.name;	
		}
		if($scope.statusMulti){
			value.status = {}
			value.status.id = $scope.statusMulti.id;
			value.status.name = $scope.statusMulti.name;	
		}
		if($scope.badgeMulti){
			value.badge = {}
			value.badge.id = $scope.badgeMulti.id;
			value.badge.name = $scope.badgeMulti.name;	
		}
	})
	$scope.selectedUsers = myObj;
	$scope.updateUser(false);
}

$scope.updateUser= function(isSingle){

	$scope.posting = true;

	var myUrl = '/api/v1/admin/all';
	var myObj;
		
	if(isSingle){
		myObj = [];  
		myObj.push($scope.selectedUser);

		$scope.updateRow($scope.selectedUser);	
	
	}else{
		myObj = $scope.selectedUsers;

		angular.forEach(myObj, function(value, key) {
			$scope.updateRow(value)

		});	
	}
	$scope.clearAll();
	console.log(myObj)
	$http({
		method: 'POST',
		url: myUrl,
		data:myObj,
		headers: {'Content-Type': 'application/json'}

	}).success(function(data,status, headers, config) {
		
		if(data.result=="success"){	
			if(isSingle){
				$scope.modalInstance.close();
			}
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

};

$rootScope.editFromGrid = function(obj){	
	$scope.selectedUser = {}
	$scope.selectedUser= angular.copy(obj);	
	$scope.openModal();
	console.log($scope.selectedUser);
}
/** Modals  **/
$scope.openExport = function(obj){   	

	$scope.exportMaster= angular.copy(obj);
   	var myObj = [];    	
    myObj = $scope.convertData(obj);

	$scope.openExportModal();
	$scope.gridOptions3.data = myObj;
}
$scope.checkBadges = function(){
	var hasFlagged = false;
	var obj = $scope.getSelected();

	if($scope.gridApi.grid.selection.selectedCount <= 0){
		$scope.hasImages = false;
	}else{
		obj.forEach(function(value, key){
			if(value.photoPath == undefined){
				$scope.hasImages = false;
				hasFlagged = true;
			}else{
				if(!hasFlagged){
					$scope.hasImages = true;
				}
			}
		});
	}
}
$scope.convertData = function(obj){

	obj.forEach(function(value, key){
		
		if(value.date){
			var date = new Date(value.date);
			var year = date.getFullYear(), month = (date.getMonth() + 1), day = date.getDate();
			if (month < 10) month = "0" + month;
			if (day < 10) day = "0" + day;

			var properlyFormatted = month+'/'+day+'/'+year ;

			value.date = properlyFormatted; 
		}
		
		if(value.photoPath){
			var output = value.photoPath.split(/[/]+/).pop();			
			var ext = output.split(/[.]+/).pop();

			var name = output.split("-");
			var fname = name[0];
			var lname = name[1];
			var fileName = fname+'-'+lname+'.'+ext;

			value.photoPath = fileName;
		}
		
		if(value.country){

			if(value.country = "US" || "us" || "united states" || "united states of america"){
				value.country = "United States";
			}
		}
		if(!value.type){
			value.type = "Press"
		}

	});
	return obj;
}
$scope.openEmail = function(obj){
   	var myObj = [];    	
    myObj = obj;

	$scope.openEmailModal();
	$scope.gridOptions2.data = myObj;
}
$scope.openDeleteUser = function(obj){
   	var myObj = [];    	
    myObj = obj;

	$scope.openDeleteModal();
	$scope.gridOptions4.data = myObj;
}
$scope.openResetUser = function(obj){
   	var myObj = [];    	
    myObj = obj;

	$scope.openResetModal();
	$scope.gridOptionsReset.data = myObj;
}
$scope.checkEmailStatus = function(obj){
	if(obj != undefined){
		var flag = obj[0].status.id;

		obj.forEach(function(row){		
	        if(row.status.id != flag){
	        	return true;        
	        }	        
	    });	
	}
}
$scope.openResetModal = function () {
    $scope.resetModal = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/partials/resetDetail.html',
      controller: 'ModalCtrl',
      size: 'lg',
      scope: $scope
    });

    $scope.resetModal.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {

    });
};
$scope.openModal = function () {
    $scope.modalInstance = $modal.open({
      	animation: $scope.animationsEnabled,
      	templateUrl: 'views/partials/userDetail.html',
      	controller: 'UserDetailCtrl',
      	size: 'lg',
      	scope: $scope
    });

    $scope.modalInstance.result.then(function (selectedItem) {
      	$scope.selected = selectedItem;
    }, function () {

    });      
};
$scope.openExportModal = function () {
    $scope.exportModal = $modal.open({
      	animation: $scope.animationsEnabled,
      	templateUrl: 'views/partials/exportBadges.html',
      	controller: 'ModalCtrl',
      	size: 'lg',
      	scope: $scope
    });

    $scope.exportModal.result.then(function (selectedItem) {
      	$scope.selected = selectedItem;
    }, function () {
    });
};
$scope.openEmailModal = function () {
    $scope.emailModal = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/partials/emailDetail.html',
      controller: 'ModalCtrl',
      size: 'lg',
      scope: $scope
    });

    $scope.emailModal.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {

    });
};

$scope.openAddAdminModal = function () {
    $scope.addAdminModal = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/partials/addAdminDetail.html',
      controller: 'ModalCtrl',
      size: 'md',
      scope: $scope
    });

    $scope.addAdminModal.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {

    });
};
$scope.openAddUserModal = function () {
    $scope.addUserModal = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/partials/addUserDetail.html',
      controller: 'ModalCtrl',
      size: 'md',
      scope: $scope
    });

    $scope.addUserModal.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {

    });
};
$scope.openStatusModal = function () {

    $scope.statusModal = $modal.open({
      	animation: $scope.animationsEnabled,
      	templateUrl: 'views/partials/statusDetail.html',
      	controller: 'ModalCtrl',
      	size: 'sm',
      	scope: $scope,
      	backdrop: 'static', /*  this prevent user interaction with the background  */
        keyboard: false
    });

    $scope.statusModal.result.then(function (selectedItem) {
      	$scope.selected = selectedItem;
    }, function () {

    });      
};
$scope.openDeleteModal = function () {
    $scope.deleteModal = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/partials/deleteUserDetail.html',
      controller: 'ModalCtrl',
      size: 'lg',
      scope: $scope
    });

    $scope.deleteModal.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {

    });
};


/** Modal Data **/
$scope.gridOptions2 = {
    enableSorting: true,
    columnDefs: [
        { name:'First Name', field: 'f_name'},
        { name:'Last Name', field: 'l_name' },
		{ name:'Email', field: 'email'},
		{ name:'Status', field: 'status.name'}
	]
};
$scope.gridOptionsReset = {
    enableSorting: true,
    columnDefs: [
        { name:'Assignment', field: 'assignmentPath17'},
        { name:'Coverage', field: 'coveragePath17' },
		{ name:'Opt Out', field: 'opt_out'}
	]
};
$scope.gridOptions3 = {
    enableSorting: true,
    exporterMenuCsv: true,
    enableGridMenu: true,
    showGridFooter: true,
    columnDefs: [
        { name:'First Name', field: 'f_name'},
          { name:'Last Name', field: 'l_name' },
          { name:'Title', field: 'title.name'},
          { name:'Organization', field: 'outlet'},
          { name:'Mailing Address', field: 'address'},
          { name:'City', field: 'city'},
		  { name:'State', field: 'state.id'},
		  { name:'Zip', field: 'postal'}, 
		  { name:'Country', field: 'country'},
		  { name:'Phone 1', field: 'phone_mobile'}, 
		  { name:'Phone 2', field: 'phone_work'},
		  { name:'E-mail', field: 'email'},
		  { name:'Membership/Badge Type', field: 'badge.name'},
		  { name:'Customer Class', field: ''},
		  { name:'Department Press', field: 'type'},	
		  { name:'Date Submitted', field:'date', cellFilter:'date'},
		  { name:'Title', field: 'title.name'},
		  { name:'jpg', field: 'photoPath'}
	]
};
$scope.gridOptions4 = {
    enableSorting: true,
    exporterMenuCsv: true,
    enableGridMenu: true,
    columnDefs: [
        { name:'First Name', field: 'f_name'},
          { name:'First Name', field: 'f_name'},
          { name:'Last Name', field: 'l_name' },
          { name:'Email', field: 'email'},
          { name:'app id', field: 'id'},
          { name:'user id', field:'user_id[0]._id'}
	]
};
$scope.sendEmail = function(templateId, selectedUsers){
	console.log("templateId > "+templateId)
	$scope.count=0

  do {

    var usersToEmail = _.take(selectedUsers, 100);
    selectedUsers = _.rest(selectedUsers, 100);
    
     $scope.count+=usersToEmail.length;
    
    $http.post('api/v1/app/email', { "usersToEmail": usersToEmail, "templateId": templateId })
    .success(function(data,status, headers, config) {

    }).
    error(function(data, status, headers, config) {
      $scope.emailFail();
    });
		$scope.updateStage(usersToEmail,templateId)

  } while (selectedUsers.length > 1);
  	$scope.emailSuccess();
}
$scope.updateStage = function(obj,type){

	var name = $scope.getNameType(type);
	var id = $scope.getIdType(type);
	console.log("id > "+id)

	if (id == undefined){
		console.log("not");
	}else{
	obj.forEach(function(value, key){
		value.stage = {}
		value.stage.id = id;
		value.stage.name = name;	
		$scope.gridOptions.data[value.r_id] = value;
	});
	}
}
$scope.getNameType = function(str){
	if(str == 'invite_returner' || str == 'invite_vip'){
		return "Invited";
	};
	if(str == 'reminder_returner' || str == 'reminder_vip'){
		return "Reminded";
	};
	if(str == 'final_reminder_returner' || str == 'final_reminder_vip'){
		return "Final Reminder";
	};
	if(str == 'late_reminder_returner' || str == 'late_reminder_vip'){
		return "Late Reminder";
	};			
}
$scope.getIdType = function(str){
	if(str == 'invite_returner' || str == 'invite_vip'){
		return "invited";
	};
	if(str == 'reminder_returner' || str == 'reminder_vip'){
		return "reminded";
	};
	if(str == 'final_reminder_returner' || str == 'final_reminder_vip'){
		return "final reminder";
	};
	if(str == 'late_reminder_returner' || str == 'late_reminder_vip'){
		return "late reminder";
	};			
}
$scope.emailSuccess = function(){
	$scope.emailModal.close();
	$scope.clearAll();
}
$scope.emailFail = function(){
	console.log('emailFail');
}
$scope.closeUserModal = function(){
	$scope.modalInstance.close();
}
$scope.closeMailModal = function(){
	$scope.emailModal.close();
}
$scope.closeExportModal = function(){
	$scope.exportModal.close();
}
$scope.closeResetModal = function(){
	$scope.resetModal.close();
}
$scope.closeAddAdminModal = function(){
	$scope.addAdminModal.close();
}
$scope.closeStatusModal = function(){
	$scope.statusModal.close();
}
$scope.closeStatusModal = function(){
	$scope.statusModal.close();
}
$scope.closeAddUserModal = function(){
	$scope.addUserModal.close();
}
$scope.closeDeleteUserModal = function(){
	$scope.deleteModal.close();
}
$scope.getSelected = function(){
	return angular.copy($scope.gridApi.selection.getSelectedRows());
}
$scope.getMailList = function(){
	return $scope.gridOptions2.data;
}

$scope.stages = [
	{"name":"Imported","id":"imported"},
	{"name":"Invited","id":"invited"},
	{"name":"Reminded","id":"reminded"},
	{"name":"Final Reminder","id":"final reminder"},
	{"name":"Late Reminder","id":"late reminder"},	
	{"name":"Submitted","id":"submitted"},											
	{"name":"Review","id":"underreview"},
	{"name":"Credentialed","id":"credentialed"},
	{"name":"Notified","id":"notified"},				
	{"name":"Exported","id":"exported"}
];
$scope.statuses = [
	{"name":"VIP","id":"vip"},
	{"name":"Returning","id":"returning"},
	{"name":"New","id":"new"}
];
$scope.badges = [
	{"name":"Express","id":"express"},
	{"name":"Express_B","id":"express_b"},
	{"name":"SLC_Express","id":"slc_express"},
	{"name":"General_A","id":"general_a"},
	{"name":"General","id":"general"},
	{"name":"Working","id":"working"},
	{"name":"Photographer_Line","id":"photographer_line"},
	{"name":"Photographer_Venue","id":"photographer_venue"},				
	{"name":"Denied","id":"denied"},
	{"name":"None","id":"none"}
];
$scope.states = [{"name":"Alabama","id":"AL"},{"name":"Alaska","id":"AK"},{"name":"American Samoa","id":"AS"},{"name":"Arizona","id":"AZ"},{"name":"Arkansas","id":"AR"},{"name":"California","id":"CA"},{"name":"Colorado","id":"CO"},{"name":"Connecticut","id":"CT"},{"name":"Delaware","id":"DE"},{"name":"District Of Columbia","id":"DC"},{"name":"Federated States Of Micronesia","id":"FM"},{"name":"Florida","id":"FL"},{"name":"Georgia","id":"GA"},{"name":"Guam","id":"GU"},{"name":"Hawaii","id":"HI"},{"name":"Idaho","id":"ID"},{"name":"Illinois","id":"IL"},{"name":"Indiana","id":"IN"},{"name":"Iowa","id":"IA"},{"name":"Kansas","id":"KS"},{"name":"Kentucky","id":"KY"},{"name":"Louisiana","id":"LA"},{"name":"Maine","id":"ME"},{"name":"Marshall Islands","id":"MH"},{"name":"Maryland","id":"MD"},{"name":"Massachusetts","id":"MA"},{"name":"Michigan","id":"MI"},{"name":"Minnesota","id":"MN"},{"name":"Mississippi","id":"MS"},{"name":"Missouri","id":"MO"},{"name":"Montana","id":"MT"},{"name":"Nebraska","id":"NE"},{"name":"Nevada","id":"NV"},{"name":"New Hampshire","id":"NH"},{"name":"New Jersey","id":"NJ"},{"name":"New Mexico","id":"NM"},{"name":"New York","id":"NY"},{"name":"North Carolina","id":"NC"},{"name":"North Dakota","id":"ND"},{"name":"Northern Mariana Islands","id":"MP"},{"name":"Ohio","id":"OH"},{"name":"Oklahoma","id":"OK"},{"name":"Oregon","id":"OR"},{"name":"Palau","id":"PW"},{"name":"Pennsylvania","id":"PA"},{"name":"Puerto Rico","id":"PR"},{"name":"Rhode Island","id":"RI"},{"name":"South Carolina","id":"SC"},{"name":"South Dakota","id":"SD"},{"name":"Tennessee","id":"TN"},{"name":"Texas","id":"TX"},{"name":"Utah","id":"UT"},{"name":"Vermont","id":"VT"},{"name":"Virgin Islands","id":"VI"},{"name":"Virginia","id":"VA"},{"name":"Washington","id":"WA"},{"name":"West Virginia","id":"WV"},{"name":"Wisconsin","id":"WI"},{"name":"Wyoming","id":"WY"}];
$scope.roles = [
	{"name":"Administrator","id":"admin"},
	{"name":"Reviewer","id":"reviewer"},
];
$scope.emails_vip = [
	{"name":"Invite VIP","id":"invite_vip"},
	{"name":"Reminder VIP","id":"reminder_vip"},
	{"name":"Final_Reminder VIP","id":"final_reminder_vip"},
	{"name":"Late_Reminder VIP","id":"late_reminder_vip"},	
	{"name":"Credential Notification Express","id":"express"},
	{"name":"Credential Notification Express_B","id":"express_b"},
	{"name":"Credential Notification SLC_Express","id":"slc_express"},
	{"name":"Credential Notification General_A","id":"general_a"},
	{"name":"Credential Notification General","id":"general"},
	{"name":"Credential Notification Working","id":"working"},
	{"name":"Credential Notification Photographer_Line","id":"photographer_line"},
	{"name":"Credential Notification Photographer_Venue","id":"photographer_venue"},
	{"name":"Denial - Denied","id":"denial_denied"},
	{"name":"Denial - Incompete","id":"denial_incomplete"}
]
$scope.emails_returning = [
	{"name":"Invite Returner","id":"invite_returner"},
	{"name":"Reminder Returner","id":"reminder_returner"},
	{"name":"Final_Reminder Returner","id":"final_reminder_returner"},
	{"name":"Late_Reminder Returner","id":"late_reminder_returner"},	
	{"name":"Credential Notification Express","id":"express"},
	{"name":"Credential Notification Express_B","id":"express_b"},
	{"name":"Credential Notification SLC_Express","id":"slc_express"},
	{"name":"Credential Notification General_A","id":"general_a"},
	{"name":"Credential Notification General","id":"general"},
	{"name":"Credential Notification Working","id":"working"},
	{"name":"Credential Notification Photographer_Line","id":"photographer_line"},
	{"name":"Credential Notification Photographer_Venue","id":"photographer_venue"},
	{"name":"Denial - Denied","id":"denial_denied"},
	{"name":"Denial - Incompete","id":"denial_incomplete"}
]
$scope.titles = [
	{"name":"Critic","id":"critic"},
	{"name":"Writer/Reporter","id":"writer_reporter"},
	{"name":"Editor","id":"editor"},
	{"name":"Producer","id":"producer"},
	{"name":"On-Air Host","id":"on_air_host"},
	{"name":"Photographer","id":"photographer"}
];
$scope.attending = [
	{"name":"First Weekend: Jan 19 - 22","id":"first_weekend"},
	{"name":"Second Week: Jan 23 - Jan 39","id":"second_week"},
	{"name":"Full Festival: Jan 19 - Jan 29","id":"full_festival"},
	{"name":"Undecided","id":"undecided"}
]					
$scope.toggleSidebar = function(){	
	if($scope.myVar){
		$scope.myVar='' 
	}else{
		$scope.myVar ='my-class';
	}
}
$scope.togglePage = function(){
	if($scope.myNewVar){
		$scope.myNewVar='' 
	}else{
		$scope.myNewVar ='my-new-class';
	}
}
$scope.getRole = function() {
	
	var myUrl = '/api/v1/app/admin-role';

	$http({
		method: 'GET',
		url: myUrl,
		headers: {'Content-Type': 'application/json'}

	}).success(function(data,status,headers,config) {

		if(data.role != undefined){
			$scope.user_role="admin"//data.role.id;
		}
		else{
			$scope.user_role = "admin"//"reviewer"
		}

	}).error(function(data, status, headers, config) {
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
$scope.exportBadges = function(){

	$scope.postingBadges = true;

	var myUrl = 'api/v1/util/downloadImages';
	var myObj= $scope.exportMaster;

	$http({
		method: 'POST',
		url: myUrl,
		data:myObj,
		headers: {'Content-Type': 'application/json'},
		responseType: 'arraybuffer'

	}).success(function(data,status,headers,config) {
		var blob = new Blob([data], {type: "application/zip"});
		var objectUrl = URL.createObjectURL(blob);
		var anchor = document.createElement("a");

		anchor.download = "badgeexport.zip";
		anchor.href = objectUrl;
		anchor.click();

		$scope.postingBadges = false;
		$scope.setExported();

	}).error(function(data, status, headers, config) {
		$scope.postingBadges = false;

		$scope.errors =
			[
				{
					"result": "error",
					"message": "SERVER ERROR: PLEASE TRY AGAIN"
				}
			];
	});
}
$scope.deleteUsers = function(){
	
	var myUrl = 'api/v1/admin/delete-users';
	var myObj= $scope.gridOptions4.data;

	$http({
		method: 'POST',
		url: myUrl,
		data:myObj,
		headers: {'Content-Type': 'application/json'}

	}).success(function(data,status,headers,config) {
		$scope.clearAll();
		$scope.closeDeleteUserModal();
		$scope.updateGrid();
	}).error(function(data, status, headers, config) {

		$scope.errors =
			[
				{
					"result": "error",
					"message": "SERVER ERROR: PLEASE TRY AGAIN"
				}
			];
	});
	
}

$scope.resetData = function(){
	console.log('resetData');

	var myUrl = 'api/v1/admin/reset-users';
	var myObj= $scope.gridOptionsReset.data;

	console.log(myObj);


	
	$http({
		method: 'POST',
		url: myUrl,
		data:myObj,
		headers: {'Content-Type': 'application/json'}

	}).success(function(data,status,headers,config) {

		console.log("reset success")
	}).error(function(data, status, headers, config) {

		$scope.errors =
			[
				{
					"result": "error",
					"message": "SERVER ERROR: PLEASE TRY AGAIN"
				}
			];
	});

}

$scope.user_role="admin"
$scope.updateGrid();
};


