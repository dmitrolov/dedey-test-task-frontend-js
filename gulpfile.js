const gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps');
	browserSync = require('browser-sync');


gulp.task('sass', function () {

	gulp.src(['./css/scss/**/*.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write('../css'))
		.pipe(gulp.dest('./css'))
});
gulp.task('default', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            
        }
    });
});