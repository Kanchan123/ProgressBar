var gulp = require('gulp'),
    bower = require('bower-files')(),
    mainBowerFiles = require('gulp-main-bower-files'),
    cssmin = require('gulp-clean-css'),
    concatcss = require('gulp-concat-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    cache = require('gulp-cache'),
    htmlmin = require('gulp-htmlmin'),
    copy = require('gulp-copy'),
    os = require('os'),
    open = require('gulp-open'),
    gulpFilter = require('gulp-filter'),
    sass = require('gulp-sass');

var path = {
    "dev":{
        "html": "./app/templates/",
        "css": "./app/css/",
        "js": "./app/js/",
        "image": "./app/images/"
    },
    "build":{
        "main": "./build/app/",
        "html": "./build/app/templates/",
        "css": "./build/app/css/",
        "js": "./build/app/js/",
        "image": "./build/app/images/"
    }
}; 

var browser = os.platform() === 'linux' ? 'google-chrome' : (
  os.platform() === 'darwin' ? 'google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));


gulp.task('connect', function() {
  connect.server({
    root: path.build.main,
    port: 8001,
    livereload: true
  });
  var options = {
    uri: 'http://localhost:8001',
    app: browser
  };
  gulp.src(path.build.main+'index.html')
  .pipe(open(options));
    
});

gulp.task('convert:scss', function () {

    return gulp.src(path.dev.css+'*.scss')
       .pipe(sass())
       .pipe(gulp.dest(path.dev.css))
       .pipe(connect.reload());
});


gulp.task('css:build',['convert:scss'], function(){
    gulp.src(path.dev.css+'*.css')
    .pipe(cssmin())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(path.build.css))
    .pipe(connect.reload());
});
 
gulp.task('js:build', function() {
  return gulp.src([path.dev.js+'*.js', path.dev.js+'**/*.js'])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(connect.reload());
});

gulp.task('images:build', function() {
  return gulp.src([path.dev.image+'*',path.dev.image+'**/*'])
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(path.build.image))
    .pipe(connect.reload());
});

gulp.task('js', function() {
  return gulp.src([path.dev.js+'*.js', path.dev.js+'**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('all.js'))
    .pipe(gulp.dest(path.build.js))
    .pipe(connect.reload());
});
    
gulp.task('html:build', function() {
  return gulp.src([path.dev.html+'**/*.html', path.dev.html+'*.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(path.build.html))
    .pipe(connect.reload());
});
    
gulp.task('bower', function () {
    var filterJS = gulpFilter('**/*.js', { restore: true });
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles({
            overrides: {
                bootstrap: {
                    main: [
                        './dist/js/bootstrap.js',
                        './dist/css/*.min.*',
                        './dist/fonts/*.*'
                    ]
                }
            }
        }))
        .pipe(filterJS)
        .pipe(concat('lib.min.js'))
        .pipe(filterJS.restore)
        .pipe(gulp.dest(path.build.js))
        .pipe(connect.reload());
});

gulp.task('html', function () {
     gulp.src([path.dev.html+'**/*.html', path.dev.html+'*.html'])
      .pipe(gulp.dest(path.build.html))
      .pipe(connect.reload());
});


               
gulp.task('html:root', function () {
     gulp.src('app/index.html')
      .pipe(gulp.dest(path.build.main))
      .pipe(connect.reload());
});


    
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(path.dev.css+'*.scss', ['css:build']);
  gulp.watch([path.dev.html+'*.html', path.dev.html+'**/*.html'], ['html']);
  gulp.watch([path.dev.js+'*.js', path.dev.js+'**/*.js'], ['js']);
  gulp.watch([path.dev.image+'*',path.dev.image+'**/*'], ['images:build']);
  gulp.watch('app/index.html', ['html:root']); 
});

gulp.task('default', ['css:build', 'html:build', 'images:build', 'js:build', 'bower', 'html:root', 'connect']);

gulp.task('dev', ['css:build', 'html', 'images:build', 'js', 'bower', 'html:root', 'connect', 'watch']);