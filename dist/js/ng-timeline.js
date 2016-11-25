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
            if(media._el && media._el.caption) {
              angular.element(media._el.caption).empty().append($compile(media.data.caption)($scope));
            }
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

      //@formatter:off
      var defaultOptions = {
        debug: false,                       // Can be set to debug timelinejs
        script_path: '',
        // width: will be 100%,
        // height: will be 100%,
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
      };
      //@formatter:on

      function angularize(element, className, directiveName, scope, isTitleSlideMatching) {
        var children = angular.element(element[0].querySelectorAll(className));
        children.attr(directiveName, true);

        angular.forEach(children, function (slide, index) {
          // create a new child scope
          var childScope = $rootScope.$new();
          childScope.data = scope.timeline.config.events[index - (isTitleSlideMatching ? 1 : 0)];
          $compile(slide)(childScope);
        });
      }

      return {
        template: '<div id="ng-timeline" ng-style="{height: height || \'700px\'};"></div>',
        restrict: 'E',
        scope: {
          height: '@',
          options: '=',
          timeline: '=control'
        },
        controller: ['$scope', function ($scope) {

          // The timeline in this directive
          var tl;

          //########################################################################## TIMELINE OPTIONS
          var options = angular.extend(defaultOptions, $scope.options);

          //########################################################################## TIMELINE OVERRIDES

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
            // Just install listener on first time loaded
            if (!this.hasEventListeners('loaded')) {
              this.on('loaded', function (e) {
                $scope.$emit('timelineLoaded', e);
              });
            }
            // Avoid initialize if container disappeared
            if (document.getElementById('ng-timeline')) {
              return initPrototype.apply(this, arguments);
            }
          };

          /**
           * Overrides common TL.Timeline.prototype._initData with custom method avoiding errors
           * @returns {*}
           */
          var _initData = TL.Timeline.prototype._initData;
          TL.Timeline.prototype._initData = function (data) {
            // TimelineJS does not allow empty data, but async data loading is useful
            if (data) {
              return _initData.apply(this, arguments);
            }
          };

          //########################################################################## TIMELINE DATA
          TL.Timeline.prototype.setData = function (data) {
            if (tl && data) {
              $log.debug('Loading timeline data: ', data);
              $scope.timeline.initialize('ng-timeline', new TL.TimelineConfig(data), options);
            }
          };

          //########################################################################## TIMELINE OPTIONS
          TL.Timeline.prototype.setOptions = function (options) {
            if (tl && options) {
              angular.extend(tl.options, options);
              $log.debug('Change timeline options: ', options);
              $scope.timeline.initialize('ng-timeline', tl.config, tl.options);
            }
          };

          //########################################################################## TIMELINE OBJECT

          /**
           * Creates the TL.Timeline object
           * @type {Timeline}
           */
          tl = $scope.timeline = new TL.Timeline('ng-timeline', undefined, options);

          //########################################################################## TIMELINE EVENTS
          /**
           * Key down events do change current Slide
           */
          angular.element(document.body).on('keydown', function (e) {
            var keys = {
              37: 'goToPrev', // Left
              39: 'goToNext', // Right
              36: 'goToStart',// Home
              35: 'goToEnd'   // End
            };
            var keysProps = Object.getOwnPropertyNames(keys),
              keyCodeAsString = e.keyCode + '';
            if (keysProps.indexOf(keyCodeAsString) !== -1) {
              tl[keys[keyCodeAsString]]();
            }
          });
        }],
        link: function (scope, element) {

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