angular.module('ngTimeline')

  /* jshint -W106 */
  .directive('timelineMedia', ['$compile',
    function ($compile) {
      return {
        restrict: 'A',
        scope: true,
        controller: ['$scope', function ($scope) {
          // Loads angular media (which could be a directive)
          $scope.$on('onMediaLoaded', function (e, media) {
            media._el.content_item = TL.Dom.create('div', '', media._el.content);
            angular.element(media._el.content_item).append($compile(media.data.url)($scope));
          });

          // Loads caption
          $scope.$on('onCaptionLoaded', function (e, media) {
            if(media._el && media._el.caption) {
              angular.element(media._el.caption).empty().append($compile(media.data.caption)($scope));
            }
          });
        }]
      };
    }]);
/* jshint +W106 */