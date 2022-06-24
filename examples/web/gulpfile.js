import gulp from 'gulp';
import git from 'git-rev-sync';
import replace from 'gulp-replace';

gulp.task('update-version', () => {
  const version = git.short('../../');
  gulp
    .src('./dist/app.js')
    .pipe(replace(/\{\{commit_hash\}\}/g, version))
    .pipe(gulp.dest('./dist/'));
  gulp
    .src('index.html')
    // regular expression to match the commit hash in dist/app.js?v=#b096213
    .pipe(replace(/dist\/app\.js\?v=#\w+/g, `dist/app.js?v=${version}`))
    .pipe(gulp.dest('.'));
  return;
});
