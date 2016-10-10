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
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'public/style.css': 'style.scss'
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
            },

            css: {
                files: [
                    'style.scss'
                ],
                tasks: ['sass']
            }

        }
    });

    grunt.registerTask('default', [
        'develop',
        'watch'
    ]);
};
