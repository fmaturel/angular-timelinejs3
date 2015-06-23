'use strict';

// Declare app level module which depends on views, and components
angular.module('ngTimelineDemoApp', [
  'ng',
  'ngRoute',
  'ngTimeline'
]).

  config(['$routeProvider', 'TimelineMediaTypeServiceProvider', function ($routeProvider, TimelineMediaTypeServiceProvider) {
    $routeProvider
      .when('/demo', {
        templateUrl: './demo/demo.html',
        controller: 'DemoController'
      })
      .otherwise({redirectTo: '/demo'});

    /*- TIMELINE MEDIA TYPE ---------------------------------------------------------------------------------------- */
    TimelineMediaTypeServiceProvider.addMediaType({type: 'media-demo', name: 'DemoMedia', urlRegex: '\<demo\>', cls: VCO.Media.DemoMedia});
  }]);
