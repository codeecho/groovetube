module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ["dist"],
    haven: {
      ci: {
        cache: "./haven_cache"
      }
    },
    jade: {
      html: {
        src: ['src/*.jade'],
        dest: 'dist/',
        options: {
          client: false
        }
      }
    },
    concat: {
      dist: {
        files: {
          'dist/js/libraries.js': ['haven_artifacts/main/jquery/*.js', 'haven_artifacts/main/angularjs/*.js', 'haven_artifacts/main/**/*.js'],
          'dist/js/app.js': ['src/js/**/*.js'],
          'dist/css/libraries.css': ['haven_artifacts/main/**/*.css'],
          'dist/css/app.css': ['src/css/**/*.css']
        }
      },
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'haven_artifacts/main/bootstrap/',
          src: ['glyphicons*'],
          dest: 'dist/fonts/'
        }]
      }
    },
    compress: {
      main: {
        options: {
          mode: "tgz",
          archive: 'dist/grrovetube.tar.gz'
        },
        files: [{
            expand: true,
            src: ['**'],
            cwd: "dist",
            dest: '.',
          }
        ]
      }
    }
  });

  // Plugins
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-haven');

  // Tasks
  grunt.registerTask('update', ['haven:update']);
  grunt.registerTask('build', ['clean', 'jade', 'concat', 'copy']);
  grunt.registerTask('dist', ['clean', 'jade', 'concat', 'copy', 'compress']);
  grunt.registerTask('deploy', ['update', 'dist', 'haven:deploy']);

  // Special task just for travis which skips install the artifact
  grunt.registerTask('travis', ['haven:update:ci', 'dist', 'haven:deployOnly']);

  // Default task(s).
  grunt.registerTask('default', ['build']);

};