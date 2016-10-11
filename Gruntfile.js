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
                // atBegin: true,
                spawn: false,
                livereload: true,
                livereloadOnError: false,
                debounceDelay: 500
            },
            server: {
                files: [
                    'index.js'
                ],
                tasks: ['develop']
            },
            html: {
                files: [
                    'index.html'
                ]
            },
            css: {
                files: [
                    'style.scss'
                ],
                tasks: ['css']
            }

        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({
                        browsers: '> 0.5% in AT, last 2 versions'
                    }) // add vendor prefixes
                ]
            },
            dist: {
                src: 'public/style.css'
            }
        }

    });

    grunt.registerTask('default', ['css','','watch']);
    grunt.registerTask('css', ['sass', 'postcss']);
};
