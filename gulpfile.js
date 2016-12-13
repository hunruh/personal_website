var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cache');
var cssnano = require('gulp-cssnano');
var del = require('del');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

// Active development functions

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'src'
    	},
	})
})

gulp.task('sass', function(){
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({
    		stream: true
		}))
});

gulp.task('watch', ['browserSync', 'sass'], function(){
	gulp.watch('src/scss/**/*.scss', ['sass']); 
	gulp.watch('src/*.html', browserSync.reload); 
	gulp.watch('src/scripts/**/*.js', browserSync.reload); 
})

gulp.task('default', function (callback) {
	runSequence(['sass','browserSync', 'watch'],
		callback
	)
})

// Build functions

// gulp.task('fonts', function() {
// 	return gulp.src('src/fonts/*')
// 	.pipe(gulp.dest('dist/fonts'))
// })

gulp.task('resources', function() {
	return gulp.src('src/resources/*')
	.pipe(gulp.dest('dist/resources'))
})

gulp.task('images', function(){
	return gulp.src('src/imgs/**/*.+(png|jpg|gif|svg)')
	.pipe(cache(imagemin({
    	interlaced: true
	})))
	.pipe(gulp.dest('dist/imgs'))
});

gulp.task('useref', function(){
	return gulp.src('src/*.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});

gulp.task('clear:cache', function (callback) {
	return cache.clearAll(callback)
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

gulp.task('build', function (callback) {
	runSequence('clean:dist', 
		['sass', 'useref', 'images', 'resources'],
		callback
	)
})