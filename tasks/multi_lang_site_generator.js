module.exports = function (grunt) {


    var _            = require('lodash-node'),
        path         = require('path'),
        config       = grunt.config.get('config'),
        translations = grunt.file.readJSON('bower_components/news-vj-ws-config/config.json'),
        projectFiles = config.projectFiles,
        debug        = config.debug === 'true',
        amdModulePaths = {};

    for (var key in config.amdModulePaths) {
        if (config.amdModulePaths[key] !== 'empty:') {
            amdModulePaths[key] = config.amdModulePaths[key];
        }
    }

    var templateData = _.merge({
            version:        '<%= pkg.version %>',
            path:           '<%= env.local.domain %>/news/special/<%= config.year %>/newsspec_<%= config.project_number %>/content/' + config.wrapper,
            pathStatic:     '<%= env.local.domainStatic %>/news/special/<%= config.year %>/newsspec_<%= config.project_number %>/content/' + config.wrapper,
            projectNumber:  '<%= config.project_number %>',
            amdModulePaths: JSON.stringify(amdModulePaths),
            translations:   translations,
            debug:          debug,
            wrapperPrefix:  '../../' + config.wrapperPrefix + 'tmpl/',
            // set the default main app, we can override later.
            // needed for app.html in iframe scaffold wrapper
            mainApp:        '../../source/tmpl/index.inc',
            mainAppName:    'index'
        }, grunt.config.get('wrapper').templateData);

    var defaultConfig = {
        options: {
            vocabs:             ['<%= config.services.default %>'],
            vocab_directory:    'source/vocabs',
            template_directory: 'source/tmpl/',
            output_directory:   'content/' + config.wrapper,
            data:               templateData
        },
        files: projectFiles
    };

    var translatedConfig = JSON.parse(JSON.stringify(defaultConfig));
    translatedConfig.options.vocabs = ['<%= config.services.others %>'];

    grunt.config('multi_lang_site_generator', {
        default: defaultConfig, // jshint ignore:line
        build_all_other_sites: translatedConfig
    });

    function getInlineCssFilepath(service) {
        var fontstackStr = translations[service].font;
        if (fontstackStr) {
            return '../../bower_components/news-vj-ws-config/css/' + fontstackStr + '_fonts.css';
        }
        return false;
    }

    function flatten(arrays) {
        // concatenate nested arrays -> http://stackoverflow.com/a/10865042/5841356
        return [].concat.apply([], arrays);
    }

    function createMultiLangTask(service) {
        var incFiles  = grunt.file.expand('source/tmpl/*.inc');
        var templates = [];
        for (var i = 0; i < incFiles.length; i++) {
            var templateName = incFiles[i].match(/^source\/tmpl\/(.+).inc$/)[1]; // 'source/tmpl/index.inc' => 'index'
            var taskName = 'template--' + templateName + '--' + service;

            var customData         = JSON.parse(JSON.stringify(templateData));
            customData.mainApp     = '../../' + incFiles[i];
            customData.mainAppName = templateName;
            customData.inlineCssFilepath = getInlineCssFilepath(service);

            var mergeConfig = {multi_lang_site_generator: {}};

            mergeConfig.multi_lang_site_generator[taskName] = {
                options: {
                    vocabs:             [service],
                    vocab_directory:    'source/vocabs',
                    template_directory: 'source/tmpl/',
                    output_directory:   'content/' + config.wrapper,
                    data:               customData
                },
                files: {}
            };

            mergeConfig.multi_lang_site_generator[taskName].files[templateName + '.inc']  = '../../' + config.wrapperPrefix + '/tmpl/index.inc.tmpl';
            mergeConfig.multi_lang_site_generator[taskName].files[templateName + '.html'] = '../../' + config.wrapperPrefix + '/tmpl/index.html.tmpl';
            mergeConfig.multi_lang_site_generator[taskName].files['test--' + templateName + '.html'] = '../../' + config.wrapperPrefix + '/tmpl/test.html.tmpl';

            // horrible hard-coded hack
            if (config.wrapper === 'iframe') {
                mergeConfig.multi_lang_site_generator[taskName].files[templateName + '.inc.app.html']  = '../../' + config.wrapperPrefix + '/tmpl/app.html.tmpl';
            }

            grunt.config.merge(mergeConfig);

            templates.push('multi_lang_site_generator:' + taskName);
        }
        return templates;
    }

    function getServices() {
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

    function defineMultiLangTaskForMultipleIncFilesTranslated() {
        var templates = ['multi_lang_site_generator:build_all_other_sites'];
        var services = getServices();

        for (var i = 0; i < services.length; i++) {
            if (services[i] !== config.services['default']) {
                templates.push(createMultiLangTask(services[i]));
            }
        }

        templates = flatten(templates);

        return templates;
    }

    grunt.registerTask('multi_lang_site_generator--default', flatten(['multi_lang_site_generator:default', createMultiLangTask(config.services['default'])]) );
    grunt.registerTask('multi_lang_site_generator--others', defineMultiLangTaskForMultipleIncFilesTranslated());

};
