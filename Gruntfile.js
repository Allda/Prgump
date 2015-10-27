module.exports = function(grunt) {

    // Project configuration.
grunt.initConfig({
  concat: {
    jsfiles: {
      src: ['js/player.js', 
            'js/collectibles.js',
            'js/main.js',
            'js/block.js',
            'js/map.js',
            'js/textureTool.js'],
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

  grunt.registerTask('default', ['concat', 'watch'])

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

};
