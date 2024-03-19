import gulp from 'gulp';
import git from 'git-rev-sync';
import replace from 'gulp-replace';

gulp.task('update-version', async () => {
  const version = git.short('../../');
  await gulp
    .src('./src/Version.jsx')
    .pipe(replace(/const rev = '#\w+';/g, `const rev = '#${version}';`))
    .pipe(gulp.dest('./src/'));
});
