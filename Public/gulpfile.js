// 引入 gulp
var gulp = require('gulp');

// 引入 Plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');

// 创建 Compass 任务
gulp.task('app', function() {
  gulp.src(['./js/app/init.js','./js/app/config.js','./js/app/controller.js'])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/dist/'));
});

gulp.task('angular', function() {
  gulp.src(['./plugins/angular/angular.min.js','./plugins/angular-ui-router/release/angular-ui-router.min.js','./plugins/angular-cookie/angular-cookie.min.js'])
    .pipe(concat('angular.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/dist/'));
});
//合并Controller
gulp.task('controller-concat',function(){
	gulp.src(['./js/app/controller/commonController.js','./js/app/controller/loginRegisterController.js',
		'./js/app/controller/billController.js','./js/app/controller/accountController.js',
    './js/app/controller/userController.js','./js/app/controller/routerController.js'])
	.pipe(concat('controller.js'))
	.pipe(gulp.dest('./js/app/'));
});
//合并State
gulp.task('state-concat',function(){
    gulp.src(['./js/app/state/homeState.js','./js/app/state/billState.js',
        './js/app/state/chartsState.js','./js/app/state/accountState.js',
    './js/app/state/userState.js'])
    .pipe(concat('state.js'))
    .pipe(gulp.dest('./js/app/'));
});
//合并Service
gulp.task('service-concat',function(){
    gulp.src(['./js/app/service/validatorService.js','./js/app/service/userService.js','./js/app/service/billService.js',
        './js/app/service/accountService.js'])
    .pipe(concat('service.js'))
    .pipe(gulp.dest('./js/app/'));
});
// 默认任务
gulp.task('default', function() {
    gulp.run('app');
});
