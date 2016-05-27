module.exports = function (grunt) {

    grunt.config('imagemin', {
        dist: {
            options: {
                optimizationLevel: 3,
                progressive: true
            },
            files: [
                {
                    expand: true,
                    src: ['content/common/img/**/*.*', 'common/css/lib/bbc-branding/**.*'],
                    dest: './'
                }
            ]
        }
    });

    grunt.registerTask('images', ['copy:standardImages', 'imagemin']);

};