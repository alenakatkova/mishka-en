"use strict";
import gulp from "gulp";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import posthtml from "gulp-posthtml";
import include from "posthtml-include";
import minify from "gulp-csso";
import rename from "gulp-rename";
import svgstore from "gulp-svgstore";
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import del from "del";
import run from "gulp4-run-sequence";
import server from "browser-sync";
import normalize from "node-normalize-scss";

server.create();

gulp.task("style", function() {
  return gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass({
      includePaths: normalize.includePaths
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("sprite", function () {
  return gulp.src("img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("images", function () {
  return gulp.src("img/**/*.{png,jpg,svg}")
    .pipe(imagemin())
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("img/**/*.{png,jpg}")
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest("build/img/webp"));
});

gulp.task("copy", function () {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**"
  ], {
    base: "."
  })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("js", function() {
  return gulp.src("js/*.js")
    .pipe(gulp.dest("build/js"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
});

gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "html",
    "style",
    "js",
    "sprite",
    "images",
    "webp",
    done);
});
