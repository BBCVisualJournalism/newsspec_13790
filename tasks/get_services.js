module.exports = function (grunt) {
    function getServices (){
        var fs       = require('fs'),
                config   = grunt.config.get('config'),
                services = config.services.others;

            if (services === 'false') {
                services = [];
            }
            else if (services === '*' || services[0] === '*') {
                var jsonFiles = fs.readdirSync('source/vocabs');

                services = [];
                jsonFiles.forEach(function (languageName) {
                    // source/vocabs/english.json -> english.json
                    languageName = languageName.replace(/^.*[\\\/]/, '');
                    // english.json -> english
                    languageName = languageName.replace(/\.[^/.]+$/, '');
                    services.push(languageName);
                });
            }

            return services;
    }

    return getServices;
};