'use strict';
module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);


    grunt.initConfig({
        develop: {
            server: {
                file: 'index.js'
            }
        },
        sass: {
            dist: {
                files: {
                    'public/css/style.css': 'public/css/style.scss'
                }
            }
        },
        watch: {
            options: {
                spawn: false,
                livereload: true,
                debounceDelay: 500

            },
            server: {
                files: [
                    'index.js'
                ],
                tasks: ['develop']
            }
            /*
             css: {
             files: [
             'public/css/!*.scss'
             ],
             tasks: ['sass']
             }
             */
        }
    });

    grunt.registerTask('default', [
        'develop',
        'watch'
    ]);
};
