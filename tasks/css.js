module.exports = function (grunt) {

    grunt.registerTask('css', ['clean:sasscache', 'sass:scaffoldCss', 'sass:main', 'combineScaffoldAndAppCss', 'csslint', 'cssmin']);

    var scaffoldCss = grunt.config.get('config').wrapperPrefix + grunt.config.get('wrapper').includeCss;

    grunt.config('sass', {
        scaffoldCss: {
            files: {
                './tmp/scaffold.css' : scaffoldCss
            }
        },
        main: {
            files: {
                './content/<%= config.wrapper %>/common/css/main.css': './source/scss/main.scss'
            }
        }
    });

    grunt.registerTask('combineScaffoldAndAppCss', function () {

        var config          = grunt.config.get('config'),
            scaffoldCssFile = './tmp/scaffold.css',
            appCssFile      = './content/' + config.wrapper + '/common/css/main.css',
            fileMeta        = {encoding: 'utf-8'},
            scaffoldCss     = grunt.file.read(scaffoldCssFile, fileMeta),
            appCss          = grunt.file.read(appCssFile, fileMeta);

        grunt.file.write(appCssFile, scaffoldCss + appCss, fileMeta);
    });

    grunt.config('csslint', {
        options: {
            'known-properties'              : false,
            'box-sizing'                    : false,
            'box-model'                     : false,
            'compatible-vendor-prefixes'    : false,
            'regex-selectors'               : false,
            'duplicate-background-images'   : false,
            'gradients'                     : false,
            'fallback-colors'               : false,
            'font-sizes'                    : false,
            'font-faces'                    : false,
            'floats'                        : false,
            'star-property-hack'            : false,
            'outline-none'                  : false,
            'import'                        : false,
            'underscore-property-hack'      : false,
            'rules-count'                   : false,
            'qualified-headings'            : false,
            'shorthand'                     : false,
            'text-indent'                   : false,
            'unique-headings'               : false,
            'unqualified-attributes'        : false,
            'vendor-prefix'                 : false,
            'universal-selector'            : false,
            'force'                         : true
        },
        src: ['./content/<%= config.wrapper %>/common/css/main.css']
    });

    grunt.config('cssmin', {
        minify: {
            expand: true,
            cwd: 'content/<%= config.wrapper %>/common/css/',
            src: ['*.css'],
            dest: 'content/<%= config.wrapper %>/common/css/'
        }
    });
};