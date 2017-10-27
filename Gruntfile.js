module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
      
        useref : {
            html : 'TestAngular/index.html',
            
            temp : 'TestAngular'
            
        },
        
        copy : {
           
            wholeAppFolder : {
                files: [
                      {expand : true, cwd:'app', src: '**', dest: 'TestAngular/'}      
            ]
            }
        },
        
        clean: {
            testangular : ["TestAngular"],
            exceptBuild : ['TestAngular/*','!TestAngular/js','!TestAngular/css', '!TestAngular/images','!TestAngular/index.html']
        },
        compress: {
            main: {
                options: {
                  archive: 'TestAngular.zip'
                },
                files: [
                  {src: ['TestAngular/**'], dest: '/'} // includes files in path and its subdirs
                ]
              }
        },
        ngtemplates: {
        	app: {
        		src: 'TestAngular/**/*.html',
        		dest:'TestAngular/views/templates.js'
        	}
        }
      });
    grunt.loadNpmTasks('grunt-useref');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['clean:testangular','copy', 'ngtemplates', 'useref','concat', 'uglify', 'cssmin', 'clean:exceptBuild', 'compress']);
};
