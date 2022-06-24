import gulp from 'gulp';
import git from 'git-rev-sync';
import replace from 'gulp-replace';

gulp.task('update-version', async () => {
  const version = git.short('../../');
  await gulp
    .src('./dist/app.js')
    .pipe(replace(/\{\{commit_hash\}\}/g, version))
    .pipe(gulp.dest('./dist/'));
  await gulp
    .src('index.html')
    .pipe(replace(/dist\/app\.js\?v=#\w+/g, `dist/app.js?v=${version}`))
    .pipe(gulp.dest('.'));
  return;
});
