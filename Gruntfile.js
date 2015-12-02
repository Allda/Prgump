module.exports = function(grunt) {

    // Project configuration.
grunt.initConfig({
  concat: {
    jsfiles: {
      src: ['js/define.js',
            'js/player.js',
            'js/collectibles.js',
            'js/main.js',
            'js/block.js',
            'js/map.js',
            'js/textureTool.js',
            'js/modelTool.js'],
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

wget: {

    basic: {
        overwrite: true,
      files: {
        'big_files.zip' : "http://prgump.alesraszka.eu/download/big_files.zip",
      }
    }
},

  unzip: {
        '.': 'big_files.zip'
      }
 });

  grunt.registerTask('default', ['concat', 'watch'])
  grunt.registerTask('build', ['concat'])
  grunt.registerTask('download' ,['wget', 'unzip'])


  grunt.loadNpmTasks('grunt-wget');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

};
