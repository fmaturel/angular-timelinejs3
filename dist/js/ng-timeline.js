;(function( window, undefined ){ 
 'use strict';

angular
  .module('ngTimeline', [
    'ng'
  ]);
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
            angular.element(media._el.caption).empty().append($compile(media.data.caption)($scope));
          });
        }]
      };
    }]);
/* jshint +W106 */
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
angular.module('ngTimeline')

  /* jshint -W106 */
  .directive('timeline', ['$rootScope', '$compile', 'timelineMediaTypeService', '$log',
    function ($rootScope, $compile, timelineMediaTypeService, $log) {
      function angularize(element, className, directiveName, scope, isTitleSlideMatching) {
        var children = angular.element(element[0].querySelectorAll(className));
        children.attr(directiveName, true);

        angular.forEach(children, function (slide, index) {
          // create a new child scope
          var childScope = $rootScope.$new();
          childScope.data = scope.data.events[index - (isTitleSlideMatching ? 1 : 0)];
          $compile(slide)(childScope);
        });
      }

      return {
        template: '<div id="ng-timeline" style="height: {{height || 700}}px;"></div>',
        restrict: 'E',
        scope: {
          id: '@',
          height: '@',
          data: '=',
          index: '=',
          config: '='
        },
        replace: true,
        controller: ['$scope', function ($scope) {
          var timeline;

          //########################################################################## TIMELINE CONFIGURATION

          //@formatter:off
          var conf = angular.extend({
            script_path: '',
            // width: will be 100%,
            height: $scope.height,
            scale_factor: 1,                    // How many screen widths wide should the timeline be
            layout: 'landscape',                // portrait or landscape
            timenav_position: 'bottom',         // timeline on top or bottom
            optimal_tick_width: 100,            // optimal distance (in pixels) between ticks on axis
            base_class: '',
            //timenav_height: 150,
            timenav_height_percentage: 50,      // Overrides timenav height as a percentage of the screen
            timenav_height_min: 150,            // Minimum timenav height
            marker_height_min: 30,              // Minimum Marker Height
            marker_width_min: 150,              // Minimum Marker Width
            marker_padding: 5,                  // Top Bottom Marker Padding
            start_at_slide: 0,
            //menubar_height: 200,
            skinny_size: 650,
            relative_date: false,               // Use momentjs to show a relative date from the slide.text.date.created_time field
            use_bc: false,                      // Use declared suffix on dates earlier than 0
            duration: 1000,                     // Slider animation duration
            ease: TL.Ease.easeInOutQuint,       // Slider animation type
            dragging: true,
            trackResize: true,
            map_type: 'stamen:toner-lite',
            slide_padding_lr: 100,              // padding on slide of slide
            slide_default_fade: '50%',          // landscape fade
            language: 'en'
          }, $scope.config);
          //@formatter:on

          //########################################################################## TIMELINE RENDERING

          var render = function (data) {
            if (data && !timeline) {
              $log.debug('Initializing timeline with configuration: ', conf);

              // Create the timeline
              timeline = new TL.Timeline('ng-timeline', new TL.TimelineConfig(data), conf);

              // Keep track on current data
              timeline.data = data;

              $log.debug('TL.Timeline object: ', timeline);
            } else if (data && timeline) {
              $log.debug('Using new data for timeline');
              timeline.data = data;
              timeline.initialize('ng-timeline', new TL.TimelineConfig(data), conf);
            } else if (!data && timeline) {
              $log.debug('Rendering timeline with new configuration');
              timeline.initialize('ng-timeline', new TL.TimelineConfig(timeline.data), conf);
            }
          };

          // Async cases (when source data coming from services or other async call)
          $scope.$watch('data', function (newData) {
            // Data not ready (maybe waiting on service or other async call)
            if (!newData) {
              $log.debug('Waiting for data');
              return;
            } else if (newData.events.length === 0) {
              $log.debug('Data defined but no event in it');
              return;
            }
            render(newData);
          });

          //########################################################################## TIMELINE EVENTS

          /**
           * We can change current slide from controller
           */
          $scope.$watch('index', function (newIndex) {
            $log.debug('Detected state change: ', newIndex);
            if (timeline && newIndex) {
              timeline.goTo(newIndex);
            }
          });

          /**
           * We watch a configuration change
           */
          $scope.$watch('config', function (newConfig) {
            $log.debug('Detected configuration change: ', newConfig);
            if (timeline && newConfig) {
              angular.extend(conf, newConfig);
              render();
            }
          }, true);

          /**
           * Key down events do change current Slide
           */
          angular.element(document.body).on('keydown', function (e) {
            var keys = {
              37: 'goToPrev', // Left
              39: 'goToNext',     // Right
              36: 'goToStart',    // Home
              35: 'goToEnd'       // End
            };
            var keysProps = Object.getOwnPropertyNames(keys),
              keyCodeAsString = e.keyCode + '';
            if (keysProps.indexOf(keyCodeAsString) !== -1) {
              timeline[keys[keyCodeAsString]]();
            }
          });

          //########################################################################## TIMELINE OBJECTS

          /**
           * Overrides common TL.MediaType with custom types provided by the timelineMediaTypeService
           * @see TL.MediaType
           * @type {timelineMediaTypeService.getMediaType|Function}
           */
          TL.MediaType = timelineMediaTypeService.getMediaType;

          /**
           * Overrides common TL.Timeline.prototype.initialize with custom scope events
           * @returns {*}
           */
          var initPrototype = TL.Timeline.prototype.initialize;
          TL.Timeline.prototype.initialize = function () {
            this.on('loaded', function (e) {
              $scope.$emit('timelineLoaded');
            });
            return initPrototype.apply(this, arguments);
          };
        }],
        link: function (scope, element, attr) {

          // When data is loaded
          scope.$on('timelineLoaded', function () {
            angularize(element, '.tl-slide-content', 'timeline-slide', scope, true);
            angularize(element, '.tl-timemarker-content', 'timeline-timemarker', scope);
          });
        }
      };
    }]);
/* jshint +W106 */
angular.module('ngTimeline')

  /* jshint -W106 */
  .provider('timelineMediaTypeService', function () {

    var tlMediaType = TL.MediaType, mediaTypes = [];

    this.addMediaType = function (mediaType) {
      mediaTypes.push({
        type: mediaType.type,
        name: mediaType.name,
        match_str: mediaType.urlRegex,
        cls: mediaType.cls
      });
    };

    function mediaMatch(m, testUrl) {
      return angular.isObject(m) && angular.isString(m.url) && m.url.match(testUrl);
    }

    this.$get = function () {
      return {
        getMediaType: function (m) {
          for (var i = 0; i < mediaTypes.length; i++) {
            if (mediaMatch(m, mediaTypes[i].match_str)) {
              mediaTypes[i].url = m.url;
              return mediaTypes[i];
            }
          }

          return tlMediaType(m);
        }
      };
    };
  });
/* jshint +W106 */}( window ));