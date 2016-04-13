angular.module('ngTimelineDemoApp')

  .directive('demo', ['$log',
    function ($log) {
      return {
        restrict: 'E',
        scope: {
          videoUrl: '='
        },
        template: '<video ng-src="{{videoUrl}}" controls></video>'
      };
    }]);