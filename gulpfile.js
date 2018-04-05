const gulp = require('gulp');
const babel = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const notify = require('gulp-notify');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');

gulp.task('styles', () => {
    return gulp.src('./dev/styles/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('style.css'))
      .pipe(gulp.dest('./public/styles/'))
      .pipe(reload({stream: true}));
  });

  gulp.task('scripts', () => {
    gulp.src('./dev/scripts/main.js')
      .pipe(babel({
        presets: ['env']
      }))
      .pipe(gulp.dest('./public/scripts'))
  });

  gulp.task('js', () => {
    browserify('dev/scripts/main.js', {debug: true})
        .transform('babelify', {
            sourceMaps: true,
            presets: ['env']
        })
        .bundle()
        .on('error',notify.onError({
            message: "Error: <%= error.message %>",
            title: 'Error in JS 💀'
        }))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest('public/scripts/'))
        .pipe(reload({stream:true}));
});

  gulp.task('watch', () => {
    gulp.watch('./dev/styles/**/*.scss', ['styles']);
    gulp.watch('./dev/scripts/**/*.js', ['js']);
    gulp.watch('*.html', reload);
  });

  gulp.task('bs', () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

  gulp.task('default', ['bs','styles', 'js', 'watch']);