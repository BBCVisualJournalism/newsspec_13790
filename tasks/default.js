module.exports = function (grunt) {

    grunt.config(['jsonlint'], {
        default: { // jshint ignore:line
            src: ['source/vocabs/*.json']
        }
    });

    grunt.registerTask('default', ['beforeGrunt', 'css', 'js', 'jsonlint', 'multi_lang_site_generator--default', 'create_vocab_module:default', 'vj_copy', 'clean', 'afterGrunt']);
};