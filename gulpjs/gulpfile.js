var gulp = require('gulp')
  ,imagemin = require('gulp-imagemin')
  ,clean = require('gulp-clean')
  ,concat = require('gulp-concat')
  ,htmlReplace = require('gulp-html-replace')
  ,uglify = require('gulp-uglify')
  ,usemin = require('gulp-usemin')
  ,cssmin = require('gulp-cssmin')
  ,browserSync = require('browser-sync')
  ,jshint = require('gulp-jshint')
  ,jshintStylish = require('jshint-stylish')
  ,csslint = require('gulp-csslint')
  ,autoprefixer = require('gulp-autoprefixer')
  ,less = require('gulp-less')




gulp.task('copy', ['clean'], function() {
    return gulp.src('src/**/*')
        .pipe(gulp.dest('dist'))
})


gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(clean())
})


gulp.task('build-img', function() {
  gulp.src('dist/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
})


gulp.task('usemin', function(){
  return  gulp.src('dist/**/*.html')
    .pipe(usemin({
      js:[uglify],
      css:[autoprefixer ,cssmin]
    }))
    .pipe(gulp.dest('dist'))
})





gulp.task('default',['copy'], function(){
  gulp.start('build-img','usemin')
})


gulp.task('server', function(){
  browserSync.init({
    server:{
      baseDir:"src",
      
    }
  })

  gulp.watch('src/**/*').on('change', browserSync.reload)

  gulp.watch('src/js/**/*.js').on('change', function(event){
    console.log('Linting '+event.path)
      gulp.src(event.path)
        .pipe(jshint())
        .pipe(jshint.reporter(jshintStylish))
  })

  gulp.watch('src/css/**/*.css').on('change', function(event){
    console.log('Linting '+event.path)
      gulp.src(event.path)
        .pipe(csslint())
        .pipe(csslint.reporter())
  })

    gulp.watch('src/less/**/*.less').on('change', function(event) {
       var stream = gulp.src(event.path)
            .pipe(less().on('error', function(erro) {
              console.log('LESS, erro compilação: ' + erro.filename);
              console.log(erro.message)
            }))
            .pipe(gulp.dest('src/css'))
    })

})

