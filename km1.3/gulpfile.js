var gulp = require('gulp'),
 	yargs = require('yargs').argv,//获取运行gulp命令时附加的命令行参数
 	imagemin = require('gulp-imagemin'),		//图片压缩
	less = require('gulp-less'),
	minifyCss = require('gulp-minify-css'),
	sourcemaps = require('gulp-sourcemaps'),
	jshint = require('gulp-jshint'),			//js检查
	transport = require('gulp-seajs-transport'), //合并seajs用
	concat = require('gulp-seajs-concat'), 		//合并seajs用
	uglify = require('gulp-uglify'),			//js压缩
	merge = require('merge-stream'),			//合并多个流
    replace = require('gulp-replace-task'),//对文件中的字符串进行替换
    htmlmin = require('gulp-htmlmin'),
    rename = require('gulp-rename'),
	clean = require('gulp-clean');
	var rev = require('gulp-rev');
	var revCollector = require('gulp-rev-collector');

gulp.task('allLess', function(){ 
	return gulp.src(['./assets/less/*.less','!./assets/less/reset.less'])
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(gulp.dest('./assets/css'))
		.pipe(minifyCss())
		.pipe(rev())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/css/'))
		.pipe(rev.manifest())
        .pipe(gulp.dest('./dist/rev/css'));
});

gulp.task('image', function(){
	var imgSrc = './assets/image/**/*',
		imgDst = './dist/image';
	gulp.src(imgSrc)
		.pipe(imagemin())
		.pipe(gulp.dest(imgDst));
});

gulp.task('seajs', function(){
	return merge(
		gulp.src('./assets/scripts/!(lib)/**/*.js', {base: './assets/scripts'})
			.pipe(transport())
			.pipe(concat({
				base: './assets/scripts'
			}))
			.pipe(gulp.dest('./dist/js_tmp'))
	);
})
gulp.task('scripts_uglify', ['seajs'], function(cb){
	return gulp.src([
			'./dist/js_tmp/app/**/*.js'
		], {base : './dist/js_tmp'})
			.pipe(uglify({
				mangle:{
					except: ['require', 'exports', 'module', '$', 'Zepto', 'jQuery'] //这几个变量不压缩
				}
			}))
			.pipe(rev())
			.pipe(gulp.dest('./dist/scripts'))
			.pipe(rev.manifest())
	        .pipe(gulp.dest('./dist/rev/js'))
});

//html 压缩
gulp.task('html', ['allLess', 'scripts_uglify'], function () {
    var options = {
        removeComments: true,  //清除HTML注释
        collapseWhitespace: true,  //压缩HTML
        collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
        minifyJS: true,  //压缩页面JS
        minifyCSS: true  //压缩页面CSS
    };
    gulp.src(['./dist/rev/**/*.json', './assets/*.html'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css/': 'css/',
                'scripts/': 'scripts/'
            }
        }))
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist'));    
});

gulp.task('watch', function(){
	gulp.watch('./assets/*.html',['html']);
	gulp.watch('./assets/less/*.less',['allLess']);
	gulp.watch('./assets/scripts/**/*.js',['scripts_uglify']);
	gulp.watch('./assets/image/**',['image']);
});

//清空图片、样式、js
gulp.task('clean', function(){
	gulp.src([
		'./dist/css/!(font)', 
		'./dist/scripts/!(lib)', 
		'./dist/*.html', 
		'./dist/js_tmp',
		'./dist/image', 
		'./dist/rev', 
		'./assets/css/!(font)'
		], {read: false})
		.pipe(clean());
});

gulp.task('default', ['clean'], function(){
	gulp.start('allLess', 'scripts_uglify', 'image', 'html');
});