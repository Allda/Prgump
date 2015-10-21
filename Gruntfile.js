module.exports = function(grunt) {

    // Project configuration.
grunt.initConfig({
  concat: {
    options: {
      separator: ';',
    },
    jsfiles: {
      src: ['js/player.js', 'js/collectibles.js', 'js/main.js', 'js/block.js'],
      dest: 'dist/built.js',
    },
  },
  watch: {
  scripts: {
    files: ['js/*.js'],
    tasks: ['concat'],
    options: {
      spawn: false,
    },
  },
},
});

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

};
