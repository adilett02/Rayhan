const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
// const webp = require('gulp-webp');
// const webphtml = require('gulp-webp-html');
const del = require('del');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

// function html() {
//     return src('app/**/*.html')
//         .pipe(webphtml())
//         .pipe(dest('app/'))
// }


function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function jsLibs(cb) {

    const libs = [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/aos/dist/aos.js',
        'node_modules/jquery-easing/dist/jquery.easing.1.3.umd.min.js',
    ];

    if (!libs.length) return cb();

    return src(libs)
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
}
function js() {

    return src('app/js/main.js')
        .pipe(browserSync.stream())
}
function images() {
    return src('app/img/**/*')
        // .pipe(
        //     webp({
        //         quality: 70
        //     })
        // )
        .pipe(dest('dist/img'))
        .pipe(src('app/img/**/*'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            interlaced: true,
            optimizationLevel: 5
        }))
        .pipe(dest('dist/img'))
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js'], js);
    watch(['app/*.html']).on('change', browserSync.reload);
}

function build() {
    return src([
        'app/css/style.css',
        'app/fonts/**/*',
        'app/js/main.js',
        'app/js/libs.min.js',
        'app/*.html'
    ], { base: 'app' })
        .pipe(dest('dist'))
}

function cleanDist() {
    return del('dist')
}


// exports.html = html;
exports.styles = styles;
exports.js = js;
exports.jsLibs = jsLibs;
exports.images = images;
exports.watching = watching;
exports.browsersync = browsersync;
exports.cleanDist = cleanDist;

exports.default = parallel(browsersync, watching, jsLibs, styles, js);
exports.build = series(cleanDist, images, build);