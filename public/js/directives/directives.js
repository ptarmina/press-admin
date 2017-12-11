'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

myApp.directive('resize', function ($window) {
	return function (scope, element) {
		var w = angular.element($window);
		scope.getWindowDimensions = function () {
			return { 'h': w.height(), 'w': w.width() };
		};
		scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
			scope.windowHeight = newValue.h;

            scope.style = function () {
				return { 
                    'height': (newValue.h - 90) + 'px',
                };
			};
            
		}, true);
	
		w.bind('resize', function () {
			scope.$apply();
		});
	}
});

myApp.directive('myDownload', function ($compile) {
    return {
        restrict:'E',
        scope:{ getUrlData:'&getData'},
        link:function (scope, elm, attrs) {
            var url = URL.createObjectURL(scope.getUrlData());
            elm.append($compile(
                '<a class="btn" download="backup.json"' +
                    'href="' + url + '">' +
                    'Download' +
                    '</a>'
            )(scope));
        }
    };
});