/**
 * @fileoverview Gulp script to compile Blast with the closure compiler.
 * Run this script by calling "npm install" in this directory.
 */

const gulp = require('gulp');
const closureCompiler = require('google-closure-compiler').gulp();
const shell = require('gulp-shell');

gulp.task('build', function() {
  return gulp.src(['src/bluetooth_apis/bluetooth.js',
    'src/*.js', 'src/blocks/*.js',
    'src/generators/*.js'],
  {base: './'})
      .pipe(
          closureCompiler({
            js_output_file: 'blast.min.js',
          }))
      .pipe(gulp.dest('./js'));
});

gulp.task('jsdoc', shell.task(['./node_modules/.bin/jsdoc src -d docs/jsdoc']));
