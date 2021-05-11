//Gulp:
const gulp = require('gulp');

//
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const concatCss = require('gulp-concat-css');
const del = require('del');

const targetDir = 'production';
const sassToCss = '/sass_to_css';

const config = {
    js: {
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
        dest: 'app.js'
    },
    sass: {
        src:  'css/style.scss',
        dest: 'style.css'
    },
    css: {
        src: [
                // 'bower_components/bootstrap/dist/css/bootstrap.min.css',
                'css/font-awesome.min.css',
                'css/reset.css',
                'css/MyFontsWebfontsKit.css',
                'bower_components/skippr/css/jquery.skippr.css',
                'bower_components/rollerblade/rollerblade.css',
                'bower_components/fancybox-plus/css/jquery.fancybox-plus.css',
                'bower_components/jquery-ui/themes/base/jquery-ui.min.css',
                'production' + sassToCss + '/style.css',
        ],
        dest: 'app.css'
    }
};

gulp.task('js', function() {
    return gulp.src(config.js.src)
        .pipe(concat(config.js.dest))
        //.pipe(gulpIf(shouldUglify, uglify()))
        .pipe(gulp.dest(targetDir));
});

gulp.task('sass', function () {
    return gulp.src(config.sass.src)
      //.pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(targetDir + sassToCss));
});

gulp.task('css', function () {
    return gulp.src(config.css.src)
      .pipe(concatCss(config.css.dest))
      .pipe(gulp.dest(targetDir));
});


// =========================================================
// Standard 'all', 'clean', and 'watch' tasks
// =========================================================
gulp.task('clean', function() {
    return del([targetDir]);
});

gulp.task('all', gulp.series('clean', 'js', 'sass', 'css'));

//gulp.task('all', gulp.series('clean'));

//gulp.parallel('js', function(done) { done(); })

