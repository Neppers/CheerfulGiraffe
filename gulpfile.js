const path = require('path');

const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');

gulp.task('styles', () => {
  return gulp.src(path.join(__dirname, 'public/src/css/*.scss'))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
      browsers: [
        'last 2 versions',
        'IE >= 8'
      ]
    }))
    .pipe(gulp.dest(path.join(__dirname, 'public/dist/css')))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCss({ debug: true }))
    .pipe(gulp.dest(path.join(__dirname, 'public/dist/css')));
});

gulp.task('scripts', () => {
  return gulp.src(path.join(__dirname, 'public/src/js/main.js'))
    .pipe(babel({
      "presets": [
        [
          "env",
          {
            "targets": {
              "browsers": ["last 2 versions", "ie >= 7"]
            }
          }
        ]
      ]
    }))
    .pipe(gulp.dest(path.join(__dirname, 'public/dist/js')))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(path.join(__dirname, 'public/dist/js')));
});

gulp.task('default', [ 'styles', 'scripts' ]);
