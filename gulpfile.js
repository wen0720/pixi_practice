// 編譯 sass ， minify css
// babel 、 browserify 、 uglify
// 編譯 pug

const gulp = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const uglify = require('gulp-uglify')
const buffer = require('vinyl-buffer')
const pug = require('gulp-pug')
const image = require('gulp-image');
const connect = require('gulp-connect')
const merge = require('gulp-merge');

// function defaultTask (cb) {
//   console.log('Let\'s, start')
//   cb()
// }

function sassToCss () {
  return gulp.src('./sass/main.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      postcss(
        [autoprefixer({ overrideBrowserslist: ['last 5 version'] })]
      )
    )
    .pipe(rename('m.css'))
    .pipe(gulp.dest('./docs/css'))
}

function bundleJS (cb) {
  // 使用 broserify 非 gulp-broserify，因為 gulp-broserify 已不在維護（這牽涉到 gulp 的原理 stram)
  // babelify 為 babel 為 broserify 提供的 babel 工具
  const tasks = ['./js/index.js', './js/container.js'].map((path) => {
    const filename = path.split('/').pop();
    return browserify(path)
      .transform('babelify', { presets: ["@babel/preset-env"] }) // babel
      .bundle() // 編譯 require
      .pipe(source(filename)) // 用 vinyl-source-stream 將 node stream 轉為 vinyl stream
      .pipe(buffer())  // uglify 只支援 buffer，所以先作轉換
      .pipe(uglify())
      .pipe(rename({
        suffix: '.bundle'
      })) // 重命名
      .pipe(gulp.dest('./docs'))
  });
  return merge(tasks, cb());
}

function pugToHtml () {
  return gulp.src('html/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('./docs'))
}

function moveImg () {
  return gulp.src(['./images/*', 'favicon.png'])
    .pipe(image({
      jpegRecompress: false,
      mozjpeg:false
    }))
    .pipe(gulp.dest('./docs/images'))
}

function livereload (cb) {
  connect.server({
    host: '0.0.0.0',
    port: 8001,
  })
  cb()
}

function watch (cb) {
  gulp.watch('sass/*.scss', sassToCss)
  gulp.watch('js/*.js', bundleJS)
  gulp.watch('html/*.pug', pugToHtml)
  cb()
}

exports.default = gulp.series(moveImg, pugToHtml, sassToCss, bundleJS, livereload, watch)
