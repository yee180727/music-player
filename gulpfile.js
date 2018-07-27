const gulp = require('gulp');
const htmlclean = require('gulp-htmlclean');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const stripdebug = require('gulp-strip-debug');
const concat = require('gulp-concat');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const connect = require('gulp-connect');

const isDev = process.env.node_env === `development`;

const folder = {
    src: 'src/',
    dist: 'dist/'
}

gulp.task('html', function () {
    let stream = gulp.src(folder.src + 'html/*').pipe(connect.reload());
    if (!isDev) {
        stream.pipe(htmlclean());
    }
    stream.pipe(gulp.dest(folder.dist + 'html/'));
})

gulp.task('css', function () {
    let stream = gulp.src(folder.src + 'css/*').pipe(connect.reload()).pipe(less());
    if (!isDev) {
        stream.pipe(postcss([autoprefixer(), cssnano()]));
    }
    stream.pipe(gulp.dest(folder.dist + 'css/'));
})

gulp.task('js', function () {
    let stream = gulp.src(folder.src + 'js/*').pipe(connect.reload());
    if (!isDev) {
        stream.pipe(stripdebug())
            .pipe(uglify());
    }
    //.pipe(stripdebug())
    //.pipe(concat('main.js'))
    stream.pipe(gulp.dest(folder.dist + 'js/'));
})

gulp.task('images', function () {
    gulp.src(folder.src + 'images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(folder.dist + 'images/'));
    gulp.src(folder.src + 'images/song_img/*')
        .pipe(imagemin())
        .pipe(gulp.dest(folder.dist + 'images/song_img/'));
})

gulp.task('audio', function () {
    gulp.src(folder.src + 'audio/*')
        .pipe(gulp.dest(folder.dist + 'audio/'));
})

gulp.task('json', function () {
    gulp.src(folder.src + 'json/*')
        .pipe(gulp.dest(folder.dist + 'json/'));
})

gulp.task('watch', function () {
    gulp.watch(folder.src + 'html/*', ['html']);
    gulp.watch(folder.src + 'css/*', ['css']);
    gulp.watch(folder.src + 'js/*', ['js']);
    gulp.watch(folder.src + 'images/*' ['images']);
})

gulp.task('server', function () {
    connect.server({
        root: 'dist',
        port: '3000',
        livereload: true
    });
})

gulp.task('default', ['html', 'css', 'js', 'images', 'audio', 'json', 'watch', 'server'], function () {});