angular.module('ngTimeline')

  .directive('timelineSlide', ['$compile', '$log',
    function ($compile, $log) {
      return {
        restrict: 'A',
        link: function (scope, element) {
          $log.debug(scope.data);

          // Add directive 'timeline-media' to .tl-media div
          var media = angular.element(element[0].querySelector('.tl-media'));
          media.attr('timeline-media', true);

          // Recompile slide with angular to start directives
          $compile(media)(scope);
        }
      };
    }]);
