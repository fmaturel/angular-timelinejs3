angular.module('ngTimeline')

  .directive('timelineTimemarker', ['$compile',
    function ($compile) {
      return {
        restrict: 'A',
        link: function (scope, element) {
          var firstChild = angular.element(element.children()[1]);
          $compile(firstChild)(scope);
        }
      };
    }]);