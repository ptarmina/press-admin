'use strict';


var UPLOADCARE_LOCALE_TRANSLATIONS = {
	// messages for widget
	errors: {
		'fileType': 'This type of files is not allowed.',
		'fileMaximumSize' : 'This file is too large and exceeds 2Mb.',
		'imageOnly' : 'This file is not an image file.'
	},
	// messages for dialog's error page
	dialog: { tabs: { preview: { error: {
		'fileType': {
			title: 'Invalid file type',
			text: 'Only files of type PNG or JPG are allowed.',
			back: 'Please try again'
		},
		'fileMaximumSize': {
			title: 'Maximum file size',
			text: 'The file you have uploaded exceeds 2Mb.',
			back: 'Please try again'
		},
		'imageOnly': {
			title: 'Images only',
			text: 'The file you have uploaded is not an image file.',
			back: 'Please try again'
		}

	} } } }
};
function UserDetailCtrl($scope, $location, $http,$rootScope,$routeParams,$modalInstance,$timeout) {

$scope.user = {}
$scope.user =angular.copy($scope.selectedUser);

$scope.checkDetailChange = function(){
	return angular.equals($scope.user,$scope.selectedUser);
}

/******* COMM LOG *******/
$scope.loadCommLog = function(){	
	var myUrl = '/api/v1/app/email-logs/'+$scope.selectedUser.id;
	$http({
		method: 'GET',
		url: myUrl,
		headers: {'Content-Type': 'application/json'}		
	})
	.success(function(data,status, headers, config) {

		$scope.commLogSuccess(data);

	}).
		error(function(data, status, headers, config) {
		$scope.commLogFail(data)
	});
}
$scope.commLogSuccess = function(obj){
	if(obj.length > 0){
		$scope.gridOptionsLog.data = obj;
	}
}
$scope.commLogFail = function(obj){

}
$scope.gridOptionsLog = {
    enableSorting: true,
    columnDefs: [
        { name:'Email Type', field: 'template_name'},
        { name:'date', cellTemplate: '<div class="ui-grid-cell-contents" >{{ COL_FIELD | date }}</div>', width:140 }
	]
};

/******* HISTORY *******/
$scope.loadHistorytNotes = function(){

	$http.get('api/v1/app/history/'+$scope.selectedUser.id)
	.success(function(data,status, headers, config) {
			$scope.historySuccess(data);
	
	}).
		error(function(data, status, headers, config) {
			$scope.historyFail(data);
	});
}
$scope.historySuccess = function(obj){
	if(obj.length > 0){
		$scope.gridOptionsHistory.data = obj;
	}
}
$scope.historyFail = function(obj){
	
}
$scope.gridOptionsHistory = {
    enableSorting: true,
    columnDefs: [
        { name:'Festival Year', field: 'FestivalYear'},
        { name:'Badge Level', field: 'BadgeLevel' }
	]
};

/******* CONTACT NOTES *******/
$scope.loadContactNotes = function(){
	//console.log('loadContactNotes > '+$scope.selectedUser.id);
	$http.get('/api/v1/app/contact-notes/'+$scope.selectedUser.id)

	.success(function(data,status, headers, config) {
			
			$scope.contactNotesSuccess(data);
	}).
		error(function(data, status, headers, config) {
			$scope.contactNotesFail(data);
	});
}
$scope.contactNotesSuccess = function(obj){
	if(obj.length > 0){
		if(obj[0].Notes){
			$scope.selectedUser.contact_notes = obj[0].Notes;
		}
		if(obj[0].fmContactID){
			console.log(obj[0].fmContactID);
			$scope.selectedUser.fmContactID  = obj[0].fmContactID;
		}
	}
}
$scope.contactNotesFail = function(obj){

}
$scope.gridOptionsContact = {
    enableSorting: true,
    columnDefs: [
        { name:'Email Type', field: 'template_name'},
        { name:'date', field: 'date' }
	]
};

/** START OUTLET GRID**/
$scope.outletGridOptions = {
    enableSorting: false,
    multiSelect: false,
    enableFiltering: true,
    enableFullRowSelection: true,
    enableRowHeaderSelection: true,

    onRegisterApi: function(gridApi){
    	$scope.gridApi = gridApi;
      

      
		$scope.gridApi.selection.on.rowSelectionChanged($scope,function(row){
		 $scope.rowsSelcted = gridApi.grid.selection.selectedCount;
		 	if($scope.rowsSelcted == 1){
		     	$scope.selectedUser.outlet = row.entity.outlet;    	
			}
			if($scope.rowsSelcted == 0){
				$scope.clearOulets();
			}		
		});

	},
    columnDefs: [
        {name:'Media Outlet', field: 'outlet',enableColumnMenu: false}
	]
};

$scope.getOutlets = function(){
	$http.get('config/outlets.json')
	.success(function(data,status, headers, config) {
		
		$scope.outletGridOptions.data = data;
		var i = 0;
		var n;
		var r;

		data.forEach(function(row){
	    	if(row.outlet == $scope.selectedUser.outlet){
	    		n =i;
	    		r = i+4
	    	}
	    	i++
	    });
		    $timeout(function () {
		    	$scope.gridApi.selection.selectRow($scope.outletGridOptions.data[n]);
		    	$scope.gridApi.cellNav.scrollToFocus( $scope.outletGridOptions.data[n]);
	    	},
	    	100)
	}).
		error(function(data, status, headers, config) {
	});
}
$scope.clearOulets = function(){

	$scope.gridApi.selection.clearSelectedRows();
	$scope.selectedUser.outlet = null;
	$scope.selectedUser.outlet_custom = null;
}
/** START UPLOADS**/
function imagesOnly() {
	return function(fileInfo) {
		if (fileInfo.isImage === false) {
			throw new Error('imageOnly');
		}
	};
}
function fileTypeLimit(types) {
	types = types.split(' ');
	return function(fileInfo) {
		if (fileInfo.name === null) {
			return;
		}
		var extension = fileInfo.name.split('.').pop();
		if (types.indexOf(extension) == -1) {
			throw new Error('fileType');
		}
	};
}
function maxFileSize(size) {
	return function(fileInfo) {
		if (fileInfo.size !== null && fileInfo.size > size) {
			throw new Error("fileMaximumSize");
		}
	};
}

$scope.imageUploader = function(){

	var dialog = uploadcare.openDialog(null,{
		publicKey: "aa20a0b13743fce89804", crop: '2:3',imagesOnly: true,validators: [
			fileTypeLimit('png jpg jpeg'),
			maxFileSize(1024 * 1024 * 2)
		]
	}).done(function(file) {
		file.promise().done(function(fileInfo){
		    $timeout(function () {

		    	fileInfo.cdnUrl = fileInfo.cdnUrl+$scope.selectedUser.f_name+"-"+$scope.selectedUser.l_name+"-"+fileInfo.name;

				$scope.selectedUser.photoPath = fileInfo.cdnUrl;
				console.log($scope.selectedUser.photoPath)
				$scope.updateUser(true);
			},
	    	100)
		});
	}).progress(function(uploadInfo) {
  		//$('#progress').progressbar('value', uploadInfo.progress);
  		//console.log('preogress > '+uploadInfo.progress)
	}).fail(function(error, fileInfo) {
  		// Upload failed or something else went wrong.
  		//console.log(error);
	});
}
$scope.assignmentUploader = function(){

	var dialog = uploadcare.openDialog(null,{
		publicKey: "aa20a0b13743fce89804",
		validators: [
			fileTypeLimit('doc docx pdf'),
			maxFileSize(1024 * 1024 * 2)
		]
	}).done(function(file) {
		file.promise().done(function(fileInfo){
			$scope.selectedUser.assignmentPath = fileInfo.cdnUrl;
			$scope.updateUser(true);
		});
	});
}
$scope.coverageUploader = function(){

	var dialog = uploadcare.openDialog(null,{
		publicKey: "aa20a0b13743fce89804",
		multiple: true,
		multipleMax: 3,
		clearable: true,
		validators: [
			fileTypeLimit('doc docx pdf')
		]
	}).done(function(file) {
		file.promise().done(function(fileInfo){
			//console.log("Coverage doc information: " + JSON.stringify(fileInfo));
			var paths = new Array();
			for (var i = 0;i < fileInfo.count;i++) {
			 	paths.push(fileInfo.cdnUrl + "nth/" + i.toString() + "/")
			}
			$scope.selectedUser.coveragePath17 = paths;
			//console.log("saved data: " + JSON.stringify($scope.selectedUser.coveragePath17));
			$scope.updateUser(true);

		});
	});
}

/** START DOWNLOADS**/
$scope.parseCoverage = function(){
	if($scope.selectedUser.coveragePath17){
		var temp = $scope.selectedUser.coveragePath17.split(",");
		$scope.c_list = temp;
	}
}
$scope.getOutlets();
$scope.loadHistorytNotes();
$scope.loadContactNotes();
$scope.loadCommLog();
$scope.parseCoverage();

};
