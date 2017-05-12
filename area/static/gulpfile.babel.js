import gulp from "gulp";
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';
import browserify from "browserify";
import browserifyCss from "browserify-css";
import browserifyInc from "browserify-incremental";
import watchify from "watchify";
import babelify from 'babelify';
import source from "vinyl-source-stream";
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';
import sass from 'gulp-sass';

import assign from 'lodash.assign';
//import uglify from "gulp-uglify";
//import buffer from "vinyl-buffer";


var baseDir = './'
var dirs = {
  sources: baseDir + 'js/src/',
  build: baseDir + 'build/'
}


gulp.task('build-css', () => {
    return gulp.src('css/**/*.css')
    //.pipe(cleanCSS())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(dirs.build))
});

gulp.task('build-sass', () => {
  return gulp.src('css/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dirs.build));
});

gulp.task('watch', ['build-js', 'build-css'], () => {
  gulp.log("*** Watch ***");
  gulp.watch('js/**/*.js', { interval: 2000 }, ['build-js']);
  //gulp.watch('css/**/*.scss', { interval: 2000 }, ['build-sass']);
  gulp.watch('css/**/*.css', { interval: 2000 }, ['build-css']);
});

gulp.task('dev-watch', [], () => {
    gulp.watch('js/**/*.js', { interval: 1000 }, ['build-js']);
});


var props = {
  entries: dirs['sources'] + 'app.js',
  pathes: [baseDir + 'js/src/**'],
  extensions: ['.js'],
  debug: true, // apply source maps
  sourceMapsAbsolute: true,
  cache: {},
  packageCache: {},
};


gulp.task('build-js', function () {
  gulp.watch('./js/src/**/*.js', function () {
    gutil.log(gutil.colors.green('Bundle Started'));

    var b = browserify(Object.assign({}, browserifyInc.args, props));
    browserifyInc(b, {cacheFile: './browserify-cache.json'});
    b.on('time', function (time) {
      //console.log('Bundle finished in ' + time/1000 + ' ms');
    });
    b.on('log', gutil.log);

    return b
      .transform('browserify-css', {
        global: true,
      })
      .transform("babelify", {
        presets: ["es2015", "react"],
        plugins: [
          // the spread feature plugin
          //"transform-es2015-parameters",
          ["transform-object-rest-spread", { "useBuiltIns": true }],
        ],
        compact: false,
        only: ['**/src/**'],
        retainLines: true
      })
      .bundle()
      .on('error', err => {
        gutil.log(gutil.colors.red('Error: '), err);
      })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(dirs.build));
  });
});


//gulp.task('default', ['dev-watch']);
gulp.task('default', ['build-js']);