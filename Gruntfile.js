/*global module,require*/
(function () {
  // Generated on 2015-05-21 using generator-angular 0.11.1
  'use strict';

  // # Globbing
  // for performance reasons we're only matching one level down:
  // 'test/spec/{,*/}*.js'
  // use this if you want to recursively match all subfolders:
  // 'test/spec/**/*.js'
  module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var serveStatic = require('serve-static');

    // Configurable paths for the application
    var appConfig = {
      app: 'app',
      dist: 'dist',
      test: 'test'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

      // Project settings
      yeoman: appConfig,

      // Watches files for changes and runs tasks based on the changed files
      watch: {
        js: {
          files: ['<%= yeoman.app %>/*/{,*/}*.js'],
          tasks: ['newer:concat:js', 'newer:jshint:all'],
          options: {
            livereload: '<%= connect.options.livereload %>'
          }
        },
        jsTest: {
          files: ['<%= yeoman.test %>/spec/{,*/}*.js'],
          tasks: ['newer:jshint:test', 'karma']
        },
        gruntfile: {
          files: ['Gruntfile.js']
        },
        livereload: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          files: [
            '<%= yeoman.app %>/**/*.html',
            '<%= yeoman.app %>/*/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }
      },

      concat: {
        js: {
          src: [
            '<%= yeoman.app %>/timeline/**/*.js'
          ],
          dest: 'dist/js/ng-timeline.js',
          options: {
            banner: ';(function( window, undefined ){ \n \'use strict\';\n\n',
            footer: '}( window ));'
          }
        }
      },

      // The actual grunt server settings
      connect: {
        options: {
          port: 9030,
          // Change this to '0.0.0.0' to access the server from outside.
          hostname: 'localhost',
          livereload: 35030
        },
        livereload: {
          options: {
            open: {
              target: 'http://localhost:9030/demo'
            },
            middleware: function (connect) {
              return [
                connect().use('/vendor', serveStatic('./node_modules')),
                serveStatic(appConfig.app),
                serveStatic(appConfig.dist)
              ];
            }
          }
        },
        test: {
          options: {
            port: 9031,
            middleware: function () {
              return [
                serveStatic(appConfig.test),
                serveStatic(appConfig.app),
                serveStatic(appConfig.dist)
              ];
            }
          }
        },
        dist: {
          options: {
            open: {
              target: 'http://localhost:9030/demo'
            },
            base: '<%= yeoman.dist %>'
          }
        }
      },

      // Make sure code styles are up to par and there are no obvious mistakes
      jshint: {
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        },
        all: {
          src: [
            'Gruntfile.js',
            '<%= yeoman.app %>/**/*.js'
          ]
        },
        test: {
          options: {
            jshintrc: '.jshintrc'
          },
          src: ['<%= yeoman.test %>/{,*/}*.js']
        }
      },

      // Empties folders to start fresh
      clean: {
        dist: {
          files: [{
            dot: true,
            src: [
              '<%= yeoman.dist %>/{,*/}*'
            ]
          }]
        }
      },

      // Copies remaining files to places other tasks can use
      copy: {
        dist: {
          files: [{
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              '*.html',
              'images/**',
              'demo/**'
            ]
          }, {
            expand: true,
            cwd: 'node_modules',
            src: ['angular/angular*.js', 'angular-route/angular-route*.js'],
            dest: '<%= yeoman.dist %>/vendor'
          }]
        }
      },

      // Test settings
      karma: {
        unit: {
          configFile: 'test/karma.conf.js',
          singleRun: true
        }
      }
    });

    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
      if (target === 'dist') {
        return grunt.task.run(['build', 'connect:dist:keepalive']);
      }

      grunt.task.run([
        'clean:dist',
        'jshint:all',
        'concat:js',
        'connect:livereload',
        'watch'
      ]);
    });

    grunt.registerTask('test', [
      'jshint',
      'connect:test',
      'karma'
    ]);

    grunt.registerTask('build', [
      'clean:dist',
      'concat',
      'copy:dist'
    ]);

    grunt.registerTask('default', [
      'newer:jshint',
      'test',
      'build'
    ]);
  };
}());