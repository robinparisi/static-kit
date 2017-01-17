"use strict";

import gulp from 'gulp';
import browserSync from 'browser-sync';
import cp from 'child_process';
import less from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';

const bs = browserSync.create();

gulp.task('jekyll:build', (cb) => {
    bs.notify('Starting Jekyll build...');
    return cp.exec('jekyll build --incremental', (err) => {
        if (err) return cb(err);
        bs.notify('Build finished');
        bs.reload();
        cb();
    });
});


gulp.task('server', () => {
    bs.init({
        server: {
            baseDir: "./dist",
        },
        open: false
    });
})


gulp.task('css', () => {
    return gulp.src('src/_assets/less/style.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(bs.reload({
            stream: true
        }));
});


gulp.task('images', () => {
    gulp.src('src/_assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/img'));
});


gulp.task('watch', ['server'], () => {
    gulp.watch(['src/**/*', '!src/_assets/**/*'], ['jekyll:build']);
    gulp.watch('src/_assets/less/**/*', ['css']);
    gulp.watch('src/_assets/img/**/*', ['images']);
});

gulp.task('default', ['jekyll:build', 'css', 'images']);
gulp.task('serve', ['server']);
