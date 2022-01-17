/**
 * @fileoverview Gulp script to compile Blast with the closure compiler.
 * Run this script by calling "npm run build" in this directory.
 */

const gulp = require('gulp');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const del = require('del');
const closureCompiler = require('google-closure-compiler').gulp();
const shell = require('gulp-shell');
const workboxBuild = require('workbox-build');

gulp.task('jsdoc', shell.task(['./node_modules/.bin/jsdoc src -d docs/jsdoc']));

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
            language_out: 'ES6_STRICT',
            js_output_file: 'blast.min.js',
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
