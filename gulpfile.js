/**
 * @fileoverview Gulp script to compile Blast with the closure compiler.
 * Run this script by calling "npm run build" in this directory.
 */

const closureCompiler = require('google-closure-compiler').gulp();
const del = require('del');
const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const workboxBuild = require('workbox-build');

gulp.task('jsdoc', function(cb) {
  gulp.src(['README.md', 'src/**/*.js'], {read: false})
      .pipe(jsdoc(cb));
});

gulp.task('clean', () => {
  return del([
    'dist/blast-*.min.js', 'examples/web/blast-*.min.js', 'examples/web/mobile/blast-*.min.js',
  ]);
});

gulp.task('compileBlast', function() {
  return gulp.src(['src/**/*.js'],
      {base: './'})
      .pipe(
          closureCompiler({
            compilation_level: 'SIMPLE',
            js_output_file: 'blast.min.js',
            language_in: 'ECMASCRIPT_2020',
            language_out: 'ES6_STRICT',
            module_resolution: 'BROWSER',
          }))
      .pipe(gulp.dest('dist'));
});

gulp.task('compileWebExample', function() {
  return gulp.src(['src/**/*.js', 'examples/web/src/**/*.js'],
      {base: './'})
      .pipe(
          closureCompiler({
            compilation_level: 'SIMPLE',
            dependency_mode: 'PRUNE',
            entry_point: 'examples/web/src/index.js',
            js_output_file: 'blast-web.min.js',
            language_in: 'ECMASCRIPT_2020',
            language_out: 'ES6_STRICT',
            module_resolution: 'BROWSER',
          }))
      .pipe(rev())
      .pipe(gulp.src(['examples/web/src/index.html']))
      .pipe(revRewrite())
      .pipe(gulp.dest('examples/web/'))
      .pipe(gulp.src(['examples/web/mobile/src/index.html']))
      .pipe(revRewrite())
      .pipe(gulp.dest('examples/web/mobile/'));
});

gulp.task('workbox', function() {
  return workboxBuild.injectManifest({
    globDirectory: './',
    globPatterns: [
      'examples/web/**',
    ],
    swSrc: 'examples/web/sw-pre-workbox.js',
    swDest: 'examples/web/sw.js',
  });
});
