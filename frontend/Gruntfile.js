/*global module:false*/
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
  });

  var grunt_tasks = [
    "grunt-bower",
    "grunt-contrib-clean",
    "grunt-compass",
    "grunt-contrib-watch",
    "grunt-contrib-copy",
    "grunt-jade"
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
                     'watch'
  ]);

  grunt.registerTask('build:prod', [
                     'clean',
                     'bower',
                     'copy',
                     'jade',
                     'compass:prod'
  ]);
};

