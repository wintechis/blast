import gulp from 'gulp';
import workboxBuild from 'workbox-build';
import git from 'git-rev-sync';
import replace from 'gulp-replace';

gulp.task('workbox', () => {
  return workboxBuild.injectManifest({
    globDirectory: './',
    globPatterns: ['src/**'],
    swSrc: 'sw-pre-workbox.js',
    swDest: 'sw.js',
  });
});

gulp.task('update-version', () => {
  const version = git.short('../../');
  return gulp
    .src('./dist/app.js')
    .pipe(replace(/\{\{commit_hash\}\}/g, version))
    .pipe(gulp.dest('./dist/'));
});
