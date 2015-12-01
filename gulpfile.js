// 引入 gulp
var gulp = require('gulp');

// 引入 Plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');

// 创建 Compass 任务
gulp.task('app', function() {
  gulp.src(['./js/app/init.js','./js/app/config.js','./js/app/state.js','./js/app/filter.js','./js/app/service.js','./js/app/controller.js',])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/dist/'));
});

gulp.task('angular', function() {
  gulp.src(['./plugins/angular/angular.min.js','./plugins/angular-ui-router/release/angular-ui-router.min.js'])
    .pipe(concat('angular.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/dist/'));
});

// 默认任务
gulp.task('default', function() {
    gulp.run('app');
});
