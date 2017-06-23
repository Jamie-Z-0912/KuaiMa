var gulp = require('gulp'),
	connect = require('gulp-connect'); 

gulp.task('connect', function () {
    connect.server({
        // host : '192.168.1.172', //地址，可不写，不写的话，默认localhost
        port : 8082, //端口号，可不写，默认8000
        root: './', //当前项目主目录
        livereload: true //自动刷新
    });
});

gulp.task('server', ['connect']);