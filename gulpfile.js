'use strict';

let project_folder = "dist";
let source_folder = "src";

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: [source_folder + "/**/*.html", "!" + source_folder + "/blocks/modules/**/*.html"],
        css: [source_folder + "/styles/style.scss", "!" + source_folder + "/blocks/modules/**/*.scss"],
        js: source_folder + "/js/script.js",
        fonts: source_folder + "/fonts/",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/**/*.scss",
        js: source_folder + "/js/**/*.js",
    },
    clean: "./" + project_folder + "/"
};

let { src, dest } = require('gulp'),
    gulp         = require('gulp'),
    browsersync  = require('browser-sync').create(),
    fileinclude  = require('gulp-file-include'),
    del          = require('del'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    group_media  = require('gulp-group-css-media-queries'),
    clean_css    = require('gulp-clean-css'),
    rename       = require('gulp-rename'),
    uglify       = require('gulp-uglify-es').default,
    imagemin     = require('gulp-imagemin'),
    webp         = require('gulp-webp'),
    webphtml     = require('gulp-webp-html'),
    htmlmin      = require('gulp-htmlmin');

function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    });
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css() {
    return src(path.src.css)
        .pipe(
            sass({
                outputStyle: "expanded"
            })
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(uglify())
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
}

function clean() {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(html, css, js));
let watch = gulp.parallel(build, browserSync, watchFiles);


exports.html = html;
exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.default = watch;