module.exports = function (grunt) {

    grunt.config(['clean', 'sasscache'], {
        src:  ['./.sass-cache']
    });

    grunt.config(['clean', 'tmp'], {
        src:  ['./tmp']
    });

};