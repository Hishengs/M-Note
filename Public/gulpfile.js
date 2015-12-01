// 引入 gulp
var gulp = require('gulp');

// 引入 Plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');

// 创建 Compass 任务
gulp.task('ng-app', function() {
  gulp.src(['./js/app/init.js','./js/app/filter.js','./js/app/config.js','./js/app/state.js','./js/app/service.js','./js/app/controller.js'])
    .pipe(concat('app.js'))
    .pipe(uglify({mangle:false}))
    .pipe(gulp.dest('./js/dist/'));
});
//合并Controller
gulp.task('ng-controller',function(){
	gulp.src(['./js/app/controller/commonController.js','./js/app/controller/loginRegisterController.js',
		'./js/app/controller/billController.js','./js/app/controller/accountController.js','./js/app/controller/chartsController.js',
    './js/app/controller/userController.js'])
	.pipe(concat('controller.js'))
    //.pipe(uglify())
	.pipe(gulp.dest('./js/app/'));
});
//合并State
gulp.task('ng-state',function(){
    gulp.src(['./js/app/state/homeState.js','./js/app/state/billState.js',
        './js/app/state/chartsState.js','./js/app/state/accountState.js',
    './js/app/state/userState.js'])
    .pipe(concat('state.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('./js/app/'));
});
//合并Service
gulp.task('ng-service',function(){
    gulp.src(['./js/app/service/validatorService.js','./js/app/service/userService.js','./js/app/service/billService.js',
        './js/app/service/accountService.js','./js/app/service/chartsService.js'])
    .pipe(concat('service.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('./js/app/'));
});
gulp.task('angular', function() {
  gulp.src(['./plugins/angular/angular.min.js','./plugins/angular-ui-router/release/angular-ui-router.min.js','./plugins/angular-cookie/angular-cookie.min.js'])
    .pipe(concat('angular.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/dist/'));
});
//uk-js
gulp.task('uk-js', function() {
  gulp.src(['./plugins/uikit/js/uikit.min.js',
    './plugins/uikit/js/components/datepicker.js','./plugins/uikit/js/components/form-select.min.js',
    './plugins/uikit/js/components/notify.min.js'])
    .pipe(concat('uk-js.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/dist/'));
});
//uk-css
gulp.task('uk-plugins-css', function() {
  gulp.src(['./plugins/uikit/css/components/datepicker.min.css',
    './plugins/uikit/css/components/form-select.min.css','./plugins/uikit/css/components/progress.min.css',
    './plugins/uikit/css/components/notify.min.css'])
    .pipe(concat('uk-plugins-css.min.css'))
    .pipe(minify())
    .pipe(gulp.dest('./css/dist/'));
});
// 默认任务
gulp.task('default', function() {
    gulp.run('ng-app');
});
