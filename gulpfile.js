/**
 * @fileoverview Gulp script to compile Blast with the closure compiler.
 * Run this script by calling "npm run build" in this directory.
 */

const gulp = require('gulp');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const del = require('del');
const closureCompiler = require('google-closure-compiler').gulp();
const jsdoc = require('gulp-jsdoc3');
const workboxBuild = require('workbox-build');

gulp.task('jsdoc', function(cb) {
  gulp.src(['README.md', 'src/**/*.js'], {read: false})
      .pipe(jsdoc(cb));
});

gulp.task('clean', () => {
  return del([
    './blast-*.min.js',
  ]);
});

gulp.task('closureCompiler', function() {
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
      .pipe(rev())
      .pipe(gulp.src(['src/index.html']))
      .pipe(revRewrite())
      .pipe(gulp.dest('./'));
});

gulp.task('workbox', function() {
  return workboxBuild.injectManifest({
    globDirectory: './',
    globPatterns: [
      '.',
      'index.html',
      'style.css',
      'js/**/*.js',
      'media/**',
      'mobile/**',
    ],
    swSrc: 'sw-pre-workbox.js',
    swDest: 'sw.js',
  });
});
