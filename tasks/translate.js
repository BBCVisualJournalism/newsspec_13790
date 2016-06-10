module.exports = function (grunt) {

    grunt.registerTask("translate", "This task assumes you've already run `grunt default` and `grunt images`.", [
        "beforeGrunt",
        "create_vocab_module:others",
        "multi_lang_site_generator--others",
        "afterGrunt"
    ]);

};