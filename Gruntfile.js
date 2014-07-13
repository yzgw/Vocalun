module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'src/*.js']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'app/vocalun.js',
        dest: 'app/vocalun.min.js'
      }
    },
    browserify : {
        dist : {
            src : 'src/vocalun.js',
            dest : 'app/vocalun.js'
        },
        test: {
            src: ['spec/src/vocalun_spec.js'],
            dest: 'spec/target/vocalun_spec.browserify.js'
        }
    },
    watch : {
        scripts : {
            files : ['src/*.js'],  // 監視対象のファイル
            tasks : ['default']  // 変更があったら呼ばれるタスク
        }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['browserify', 'uglify']);
};