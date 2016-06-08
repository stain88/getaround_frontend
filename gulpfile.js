var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var replace = require('gulp-replace');
var jshint = require('gulp-jshint');

// jshint
gulp.task('jshint', function() {
  return gulp.src(['src/js/**/*.js'])
    .pipe(jshint())
});

// concat js into one min file javascript.min.js
gulp.task('js-min', function() {
  return gulp.src(['src/js/app.js', 'src/js/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('js'))
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('js'));
});

// Only Concat files javascript.js
gulp.task('js-concat', function() {
  return gulp.src(['src/js/app.js', 'src/js/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('js'))
});

gulp.task('uglify', function() {
  return gulp.src('js/app.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('js'));
});

// This will change all references of app.css and app.js
// to app.min.css and app.min.js in the index.html file
gulp.task('replace:production', function() {
  return gulp.src('index.html')
    .pipe(replace(/styles\.css/, 'styles.min.css'))
    .pipe(replace(/app\.js/, 'app.min.js'))
    .pipe(gulp.dest(''));
});

// This will change all references of app.min.css and app.min.js
// to app.css and app.js in the index.html file
gulp.task('replace:development', function() {
  return gulp.src('index.html')
    .pipe(replace(/styles\.min\.css/, 'styles.css'))
    .pipe(replace(/app\.min\.js/, 'app.js'))
    .pipe(gulp.dest(''));
});



// the default task
// checks all files and reloads index
gulp.task('default', function() {
  livereload.listen();
  gulp.watch(['src/**/*', 'index.html'],
    [
      'jshint',
      'js-concat',
      'uglify',
      function() { livereload.reload('index.html'); }
    ]
  );
});

gulp.task('build', ['jshint', 'js-concat'])