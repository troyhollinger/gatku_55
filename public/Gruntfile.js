module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist : {
                src : [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/jquery-ui/jquery-ui.min.js',
                    'bower_components/skippr/js/jquery.skippr.js',
                    'bower_components/fancybox-plus/dist/jquery.fancybox-plus.js',
                    'bower_components/nanobar/nanobar.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-resource/angular-resource.min.js',
                    'bower_components/angular-cookie/angular-cookie.js',
                    'bower_components/angular-animate/angular-animate.js',
                    'bower_components/angular-stripe/release/angular-stripe.js',
                    'bower_components/angular-touch/angular-touch.js',
                    'bower_components/angular-credit-cards/release/angular-credit-cards.js',
                    'bower_components/angular-route/angular-route.js',
                    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    'bower_components/angular-fancybox-plus/js/angular-fancybox-plus.js',
                    'bower_components/angularUtils-pagination/dirPagination.js',
                    'bower_components/ng-file-upload/angular-file-upload.js',
                    'bower_components/rollerblade/rollerblade.min.js',
                    'js/config.js',
                    'js/resources/*.js',
                    'js/directives.js',
                    'js/services/*.js',
                    'js/factories.js',
                    'js/checklist-model.js',
                    'js/configs/*.js',
                    'js/controllers/*.js',
                    'js/app/**/*.js',
                    'js/main.js',
                    'js/product_template_2_image_flipper.js'
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
                        'bower_components/bootstrap/dist/css/bootstrap.min.css',
                        'css/font-awesome.min.css',
                        'css/reset.css',
                        'css/MyFontsWebfontsKit.css',
                        'bower_components/skippr/css/jquery.skippr.css',
                        'bower_components/rollerblade/rollerblade.css',
                        'bower_components/fancybox-plus/css/jquery.fancybox-plus.css',
                        'bower_components/jquery-ui/themes/base/jquery-ui.min.css',
                        'css/style.css'
                    ]
                }
            }
        },
        watch: {
            scripts: {
                files: [
                    'js/*.js',
                    'js/configs/*.js',
                    'js/resources/*.js',
                    'js/controllers/*.js',
                    'js/services/*.js',
                    'js/app/**/*.js'
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

    //grunt.registerTask('default', ['concat', 'uglify', 'sass', 'cssmin', 'watch']);
    grunt.registerTask('default', ['concat', 'sass', 'cssmin', 'watch']);

};