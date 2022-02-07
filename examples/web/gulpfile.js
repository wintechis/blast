import gulp from 'gulp';
import workboxBuild from 'workbox-build';


gulp.task('workbox', function() {
  return workboxBuild.injectManifest({
    globDirectory: './',
    globPatterns: [
      'src/**',
    ],
    swSrc: 'sw-pre-workbox.js',
    swDest: 'sw.js',
  });
});
  
