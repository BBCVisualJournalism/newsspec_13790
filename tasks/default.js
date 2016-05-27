module.exports = function (grunt) {

    grunt.config(['jsonlint'], {
        default: { // jshint ignore:line
            src: ['source/vocabs/*.json']
        }
    });

    grunt.registerTask('default', ['beforeGrunt', 'css', 'js', 'jsonlint', 'multi_lang_site_generator--default', 'vj_copy', 'clean', 'afterGrunt']);
};