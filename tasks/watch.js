module.exports = function (grunt) {
    grunt.config('watch', {
        js: {
            files: ['Gruntfile.js', './source/js/**/*'],
            tasks: ['js'],
            options: {
                spawn: false,
                livereload: true
            }
        },
        css: {
            files: ['Gruntfile.js', './source/scss/**/*'],
            tasks: ['css'],
            options: {
                spawn: false,
                livereload: true
            }
        },
        html: {
            files: ['Gruntfile.js', './source/tmpl/**/*'],
            tasks: ['multi_lang_site_generator--default'],
            options: {
                spawn: false,
                livereload: true
            }
        },
        img: {
            files: ['./source/img/**/*'],
            tasks: ['images'],
            options: {
                spawn: false,
                livereload: true
            }
        }
    });
};