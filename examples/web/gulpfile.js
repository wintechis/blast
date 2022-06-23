import gulp from 'gulp';
import git from 'git-rev-sync';
import replace from 'gulp-replace';

gulp.task('update-version', () => {
  const version = git.short('../../');
  return gulp
    .src('./dist/app.js')
    .pipe(replace(/\{\{commit_hash\}\}/g, version))
    .pipe(gulp.dest('./dist/'));
});
