
var gulp = require('gulp');

gulp.task('copy', function () {
  gulp.src('./**/*.html')
      .pipe(gulp.dest('./dist/'));
});