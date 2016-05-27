module.exports = function (grunt) {

    grunt.config(['copy', 'standardImages'], {
        files: [{
            expand: true,
            cwd: 'source/img',
            src: ['**/*.*', '!responsive/*.*'],
            dest: 'content/<%= config.wrapper %>/common/img'
        }]
    });

    grunt.registerTask('vj_copy', 'Copies assets', function () {

        var path          = require('path'),
            wrench        = require('wrench'),
            config        = grunt.config.get('config'),
            wrapperConfig = grunt.config.get('wrapper'),
            dependencies = [];

        for (var key in wrapperConfig.dependencies) {
            dependencies.push({
                expand: true,
                cwd:    config.wrapperPrefix + '/',
                src:    [wrapperConfig.dependencies[key]],
                dest:   'content/' + config.wrapper + '/common/' + key
            });
        }

        for (var i = 0; i < dependencies.length; i++) {
            var source = path.join(__dirname, '../' + config.wrapperPrefix + dependencies[i].src[0]),
                dest   = dependencies[i].dest;

            grunt.log.writeln('copying', source, 'to', dest);
            if (grunt.file.isFile(source)) {
                grunt.file.copy(source, dest);
            }
            else {
                wrench.mkdirSyncRecursive(dest, 0777);
                wrench.copyDirSyncRecursive(source, dest, {
                    forceDelete: true
                });
            }
        }
    });

};
