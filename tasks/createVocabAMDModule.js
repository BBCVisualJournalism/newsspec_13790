
module.exports = function (grunt) {

    function createVocabModule(service) {
        var fileMeta       = {encoding: 'utf-8'},
            wrapper        = grunt.config.get('config').wrapper,
            vocabContents  = grunt.file.read('source/vocabs/' + service + '.json', fileMeta),
            amdVocabModule = 'define(' + vocabContents + ');',
            targetFileLocation = 'content/' + wrapper + '/' + service + '/vocab.js';

        grunt.file.write(targetFileLocation, amdVocabModule, fileMeta);
        grunt.log.writeln('Created vocab module for "' + service + '" service');
    }

    grunt.registerTask('create_vocab_module:default', function () {
        var config         = grunt.config.get('config'),
            defaultService = config.services['default'];

        createVocabModule(defaultService);
    });

    var getServices = require('./get_services.js')(grunt);

    grunt.registerTask('create_vocab_module:others', function () {
        var services = getServices();

        for (var i = 0; i < services.length; i++) {
            createVocabModule(services[i]);
        }
    });

};