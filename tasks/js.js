module.exports = function (grunt) {

    var jsTasks = ['jshint', 'requirejs'];

    if (grunt.config.get('config').debug === 'true') {
        jsTasks.push('vj_copy');
    }

    grunt.registerTask('js', jsTasks);

    grunt.config('jshint', {
        options: {
            es3:      true,
            indent:   4,
            curly:    true,
            eqeqeq:   true,
            immed:    true,
            latedef:  true,
            newcap:   true,
            noarg:    true,
            quotmark: true,
            sub:      true,
            boss:     true,
            eqnull:   true,
            trailing: true,
            white:    true,
            force:    true,
            multistr: true
        },
        all: ['Gruntfile.js', 'tasks/*.js', 'source/**/*.js']
    });

};
