/**
 * @fileoverview Gulp script to compile Blast with the closure compiler.
 * Run this script by calling "npm run build" in this directory.
 */

import gulp from 'gulp';
import jsdoc from 'gulp-jsdoc3';

gulp.task('jsdoc', function(cb) {
  gulp.src([
    'README.md',
    'src/**/*.js',
    '!**/joycon-webhid/*.js',
    '!**/urdf/*.js',
    '!**/stream-deck-webhid/*.js',
  ], {read: false})
      .pipe(jsdoc(cb));
});
