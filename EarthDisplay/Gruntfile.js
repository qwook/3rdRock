module.exports = function(grunt) {

  grunt.initConfig({
    'pkg': grunt.file.readJSON('package.json'),
    'babel': {
      'options': {
        'sourceMap': true,
        'plugins': ['transform-es2015-modules-amd', 'transform-es2015-classes', 'transform-es2015-arrow-functions', 'transform-es2015-block-scoped-functions', 'transform-es2015-block-scoping']
      },
      'dist': {
        'files': [{
          'expand': true,
          'src': ['src/**/*.js'],
          'dest': 'build/',
          'ext': '.js'
        }]
      }
    },
    'express': {
      'dev': {
        'options': {
          'script': 'test-server.js'
        }
      }
    },
    'watch': {
      'options': {
        'atBegin': true,
      },
      'dev': {
        'files': ['src/**/*.js', 'public/**/*.*', 'bower_components/**/*'],
        'tasks': ['express:dev', 'babel'],
        'options': {
          'livereload': 35729,
          'spawn': false
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch:dev']);

}
