module.exports = function (config) {
  config.set({

    basePath: '../',

    files: [
      'https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/timeline/**/*.js',
      'app/demo/*.js',
      'test/**/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: [
      'PhantomJS'
    ],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
