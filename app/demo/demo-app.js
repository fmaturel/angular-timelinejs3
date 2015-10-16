// Declare app level module which depends on views, and components
angular.module('ngTimelineDemoApp', [
  'ng',
  'ngRoute',
  'ngTimeline'
]).

  config(['$routeProvider', '$sceDelegateProvider', 'timelineMediaTypeServiceProvider', function ($routeProvider, $sceDelegateProvider, timelineMediaTypeServiceProvider) {
    $routeProvider
      .when('/demo', {
        templateUrl: 'demo.html',
        controller: 'DemoController'
      })
      .otherwise({redirectTo: '/demo'});

    /*- TRUST URL FROM THOSE SOURCES ---------------------------------------------------------------------------- */
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://www.w3schools.com/**']);

    /*- TIMELINE MEDIA TYPE ---------------------------------------------------------------------------------------- */
    timelineMediaTypeServiceProvider.addMediaType({type: 'media-demo', name: 'DemoMedia', urlRegex: /^<demo[^>]*>.*<\/demo>$/, cls: TL.Media.DemoMedia});
  }]);
