'use strict';
module.exports = function(grunt) {

  // Dynamically loads all required grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var autoprefixer = require('autoprefixer-core');

  // Configures the tasks that can be run
  grunt.initConfig({
    postcss: {
        options: {
            processors: [
              autoprefixer({ browsers: ['last 2 version'] }).postcss
            ]
        },
        // dist: {
        //  src: 'src/css/*.css',
        //  dest:'dest/css/*.css'
        // }
        multiple_files: {
          expand: true,
          flatten: true,
          src: 'src/css/*.css', // -> src/css/file1.css, src/css/file2.css
          dest: 'dest/css/' // -> dest/css/file1.css, dest/css/file2.css
        },
    },
  });

  grunt.loadNpmTasks('grunt-postcss');

  grunt.registerTask('default', ['postcss']);

};