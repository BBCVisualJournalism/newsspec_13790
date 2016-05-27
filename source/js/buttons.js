define(['wrapper', 'jquery'], function (wrapper, $) {

    /**
     * This is an example module showing off what the scaffold can do. You should delete it when you start working on
     * your own bespoke.
     *
     * You should also remove the jQuery dependency if you don't need it for your project - go to bower.json and remove
     * the "jquery" entry, and remove "jquery" from your config.json amdModulePaths property.
     */

    return {
        init: function () {
            $('.bbc-news-vj-wrapper button').first().on('click', function () {
                var content = $('#tmp_text').val();
                content = content.length > 0 ? content : 'Hello, world!';
                $('.bbc-news-vj-grid-wrapper').first().prepend('<div class="dynamic_tmp_element" style="background-color: #737373;display: block;min-height: 60px;width: 100%;color: white;padding-top: 40px;text-align: center;margin-top: 20px;">' + content + '</div>');
            });

            $('.button--next').on('click', function () {
                var offset = $('#results').offset().top;
                wrapper.scrollTo({ position: offset, duration: 1000 });
            });

            $('.button--reset').on('click', function () {
                $('.dynamic_tmp_element').remove();
            });

            $('.button--prev').on('click', function () {
                $('#show-off-redirect').text('Loading...');
                var countdown = 3;
                var redirect = setInterval(function () {
                    var text = 'Redirecting in ' + countdown + 's...';
                    if (countdown <= 0) {
                        text = 'Redirecting now!';
                        clearInterval(redirect);
                        window.top.location = 'http://bbc.co.uk';
                    }
                    $('#show-off-redirect').text(text);
                    countdown--;
                }, 1000);
            });
        }
    };
});