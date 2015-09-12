var gulp = require('gulp'), 
    sass = require('gulp-ruby-sass') ,
    notify = require("gulp-notify") ,
    filesize = require('gulp-size'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jade = require('gulp-jade');

var config = {
     sassPath: './resources/sass',
    bowerDir: './bower_components' 
};

var scripts = [
    config.bowerDir + '/jquery/dist/jquery.js',
    config.bowerDir + '/bowser/bowser.js',
    config.bowerDir + '/jquery.easing/js/jquery.easing.js',
    config.bowerDir + '/bootstrap-sass-official/assets/javascripts/bootstrap.js',
    './resources/js/*.js'
];

var locals = {
    title: 'GloablHack V Project'
};

gulp.task('icons', function() { 
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
        .pipe(gulp.dest('./public/fonts')); 
});

gulp.task('css', function() { 
    return sass(config.sassPath + '/style.scss', {
        style: 'compressed',
         loadPath: [
             config.sassPath + '/partials',
             config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
            config.bowerDir + '/bootstrap-material-design/sass',
            config.bowerDir,
         ],
        sourcemap: true
         }) 
        .on("error", notify.onError(function (error) {
            return "Error: " + error.message;
        }))
        .pipe(gulp.dest('./public/css'))
        .pipe(notify({ message: 'Page styles compiled.' }));
});

gulp.task('scripts', function() {
    return gulp.src(scripts)
        .pipe(concat('all.js'))
        .pipe(uglify())
        .on('error', function(err){
            console.log(err);
        })
        .pipe(gulp.dest('public/js/'))
        .pipe(notify({ message: 'all.js concated' }))
        .pipe(filesize({ showFiles: true }));
});

// Rerun the task when a file changes
 gulp.task('watch', function() {
    // Watch .scss files
     gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
    gulp.watch(config.sassPath + '/partials/*.scss', ['css']); 
    // Watch .js files
    gulp.watch('resources/js/*.js', ['scripts']);
    // Watch gulpfile
    gulp.watch('gulpfile.js', ['default']);
});

  gulp.task('default', ['icons', 'css', 'scripts']);
