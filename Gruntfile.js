'use strict';
module.exports = function(grunt) {
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
            reload: {
                files: [
                    'index.html'
                ]
            },
            js: {
                files: "*.js",
                tasks: "js"
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
        },
        jshint: {
            options: {
                '-W083': true
            },
            dist: "chatscript.js"

        },
        concat: {
            options: {
                sourceMap: true
            },
            user: {
                src: ['node_modules/socket.io-client/socket.io.js', 'chatscript.js'],
                dest: 'public/script.js'
            }
        },
        uglify: {
            options: {
                sourceMap: true
                // mangle: {
                //     except: ['_paq']
                // },
            },
            dist: {
                files: {
                    'public/script.min.js': 'public/script.js'
                }
            }
        }
    });

    grunt.registerTask('default', ['css', 'js', 'develop', 'watch']);
    grunt.registerTask('css', ['sass', 'postcss']);
    grunt.registerTask('js', ['jshint', 'concat', 'uglify']);
};
