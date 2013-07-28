/*global module:false*/
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};
module.exports = function (grunt) {
  grunt.initConfig({
    bower: {
      dev: {
        dest: 'public/js/lib',
        options: {
          stripJsAffix: true
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 1899,
          base: './public',
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, options.base)];
          }
        }
      }
    },
    jade: {
      dev: {
        src: ['app/views/**/*.jade'],
        dest: 'public/',
        wrapper: {
          amd: false
        },
        options: {
          client: false,
          pretty: true,
          basePath: 'app/views/'
        }
      }
    },
    compass: {
      dev: {
        src: 'app/styles',
        dest: 'public/styles'
      },
      prod: {
        src: 'app/styles',
        dest: 'public/styles',
        outputstyle: 'compressed',
        linecomments: false,
        debugsass: false
      }
    },
    copy: {
      scripts: {
        files: [{
          expand: true,
          dest: 'public/js/',
          src: ['**/*.js'],
          cwd: 'app/scripts'
        }]
      },
      assets: {
        files: [{
          expand: true,
          dest: 'public/',
          src: ['**'],
          cwd: 'assets'
        }]
      }
    },
    watch: {
      bower: {
        files: ['bower_components/**/*.js'],
        tasks: ['build'],
        options: {
          livereload: true
        }
      },
      jade: {
        files: ['app/views/**/*.jade'],
        tasks: ['jade'],
        options: {
          livereload: true
        }
      },
      compass: {
        files: ['app/styles/**/*.scss'],
        tasks: ['compass:dev'],
        options: {
          livereload: true
        }
      },
      javascript: {
        files: ['app/scripts/**/*.js'],
        tasks: ['copy:scripts'],
        options: {
          livereload: true
        }
      },
      assets: {
        files: ['assets/**'],
        tasks: ['copy:assets'],
        options: {
          livereload: true
        }
      }
    },
    clean: {
      folders: ['public/*']
    },
    requirejs: {
      compile: {
        options: {
          wrap: false,
          modules: [{name: "app"}],
          mainConfigFile: "public/js/app.js",
          baseUrl: "public/js",
          dir: "tmp",
          inlineText: true,
          preserveLicenseComments: true
        }
      }
    }
  });

  var grunt_tasks = [
    "grunt-bower",
    "grunt-contrib-connect",
    "grunt-contrib-clean",
    "grunt-compass",
    "grunt-contrib-watch",
    "grunt-contrib-copy",
    "grunt-jade",
    "grunt-requirejs"
  ];
  grunt_tasks.forEach(function(grunt_task) {
    grunt.loadNpmTasks(grunt_task);
  });

  grunt.registerTask('build', [
                     'clean',
                     'bower',
                     'copy',
                     'jade',
                     'compass:dev'
  ]);
  grunt.registerTask('default', [
                     'build',
                     'connect',
                     'watch'
  ]);

  grunt.registerTask('build:prod', [
                     'clean',
                     'bower',
                     'copy',
                     'jade',
                     'compass:prod',
                     'requirejs'
  ]);
};

