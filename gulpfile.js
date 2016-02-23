var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

gulp.task('dev:scripts', () => {
  return gulp.src(['./src/js/**/*.js'])
    .pipe($.babel())
    .pipe(gulp.dest('./app/js'));
});

gulp.task('dev:styles', () => {
  return gulp.src(['./src/styles/**/*.{less, css}'])
    .pipe($.less())
    .pipe(gulp.dest('./app/styles'));
});

gulp.task('dev', gulp.parallel('dev:scripts', 'dev:styles'));

gulp.task('watch', gulp.series(
  'dev',
  gulp.parallel(
    () => gulp.watch('./src/js/**/*.js', gulp.series('dev:scripts')),
    () => gulp.watch('./src/styles/**/*.{less, css}', gulp.series('dev:styles'))
  )

));
