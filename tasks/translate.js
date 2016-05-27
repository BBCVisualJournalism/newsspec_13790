module.exports = function (grunt) {

    grunt.registerTask("translate", "This task assumes you've already run `grunt default` and `grunt images`.", [
        "beforeGrunt",
        "multi_lang_site_generator--others",
        "afterGrunt"
    ]);

};