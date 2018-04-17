module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist : {
                src : [
                    'bower_components/skippr/js/jquery.skippr.js',
                    'bower_components/nanobar/nanobar.js',
                    'js/main.js',
                    'bower_components/angular-cookie/angular-cookie.js',
                    'bower_components/angular-animate/angular-animate.js',
                    'bower_components/angular-stripe/release/angular-stripe.js',
                    'bower_components/angular-touch/angular-touch.js',
                    'bower_components/angular-credit-cards/release/angular-credit-cards.js',
                    'bower_components/fancybox-plus/dist/jquery.fancybox-plus.js',
                    'bower_components/angular-fancybox-plus/js/angular-fancybox-plus.js',
                    'bower_components/angularUtils-pagination/dirPagination.js',
                    'js/config.js',
                    'js/directives.js',
                    'js/services/*.js',
                    'js/factories.js',
                    'js/checklist-model.js',
                    'js/controllers/*.js'
                ],
                dest: 'production/app.js'
            }
        },

        uglify: {
            build: {
                src: 'production/app.js',
                dest: 'production/app.min.js'
            }
        },
        sass: {
            dist: {
                options: {
                    style:'compressed'
                },
                files: {
                    'css/style.css' : 'css/style.scss'
                }
            }
        },
        cssmin : {
            combine : {
                files : {
                    'production/app.css' : [
                        'css/bootstrap/*.min.css',
                        'css/font-awesome.min.css',
                        'css/reset.css',
                        'css/MyFontsWebfontsKit.css',
                        'bower_components/skippr/css/jquery.skippr.css',
                        'bower_components/rollerblade/rollerblade.css',
                        'bower_components/fancybox-plus/css/jquery.fancybox-plus.css',
                        'css/style.css'
                    ]
                }
            }
        },
        watch: {

            scripts: {
                files: [
                    'js/*.js',
                    'js/controllers/*.js',
                    'js/services/*.js'
                ],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false
                }
            },
            css : {
                files : ['css/*.scss'],
                tasks : ['sass', 'cssmin'],
                options : {
                    spawn : false
                }
            }
        }


    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['concat', 'uglify', 'sass', 'cssmin', 'watch']);

};