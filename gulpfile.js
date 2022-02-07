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
  return gulp.src(
      [
        'src/**/*.js',
        'node_modules/blockly/package.json',
        'node_modules/blockly/**/*.js',
        'node_modules/js-interpreter/package.json',
        'node_modules/js-interpreter/**/*.js',
        'node_modules/file-saver/package.json',
        'node_modules/file-saver/**/*.js',
        'node_modules/buffer/package.json',
        'node_modules/buffer/**/*.js',
      ],
      {base: './'})
      .pipe(
          closureCompiler({
            compilation_level: 'SIMPLE',
            js_output_file: 'blast.min.js',
            language_in: 'ECMASCRIPT_2020',
            language_out: 'ES6_STRICT',
            module_resolution: 'NODE',
          }))
      .pipe(gulp.dest('dist'));
});

gulp.task('compileWeb', function() {
  return gulp.src(['src/**/*.js', 'examples/web/src/**/*.js'],
      {base: './'})
      .pipe(
          closureCompiler({
            compilation_level: 'ADVANCED',
            dependency_mode: 'PRUNE',
            entry_point: 'examples/web/src/index.js',
            js_output_file: 'blast-web.min.js',
            language_in: 'ECMASCRIPT_2020',
            language_out: 'ES6_STRICT',
            module_resolution: 'NODE',
          }))
      .pipe(rev())
      .pipe(gulp.src(['examples/web/src/index.html']))
      .pipe(revRewrite())
      .pipe(gulp.dest('examples/web/'));
});

gulp.task('compileMobile', function() {
  return gulp.src(['src/**/*.js', 'examples/web/mobile/src/**/*.js', 'examples/web/src/web.js'],
      {base: './'})
      .pipe(
          closureCompiler({
            compilation_level: 'ADVANCED',
            dependency_mode: 'PRUNE',
            entry_point: 'examples/web/mobile/src/mobile.js',
            js_output_file: 'blast-mobile.min.js',
            language_in: 'ECMASCRIPT_2020',
            language_out: 'ES6_STRICT',
            module_resolution: 'NODE',
          }))
      .pipe(rev())
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
