define(['wrapper', 'ShareTools', 'ShareToolsTemplate', 'buttons'], function (wrapper, ShareTools, ShareTemplate, exampleButtons) {

    console.log(wrapper.url().hostUrl, wrapper.url().onbbcdomain, wrapper.url().parameters);

    exampleButtons.init();

    var shareTitle   = 'Share this content',
        shareMessage = 'This is my share message',
        config = {
            holderEl: '.tmpShareToolsHolder',
            label: 'Share this page',
            shareUrl: wrapper.url().hostUrl,
            messages: {
                twitter: shareMessage,
                facebook: {
                    title:       shareTitle,
                    description: shareMessage,
                    image:       'http://www.stage.bbc.co.uk/news/special/2016/newsspec_13790/content/iframe/common/img/promo.jpg' // optional
                },
                email: {
                    subject: shareTitle,
                    message: shareMessage
                },
                app: {
                    shareEndpoint: 'bbcnewsapp://visualjournalism/share',
                    popup: false,
                    properties: {
                        title: shareTitle,
                        text: shareMessage
                    }
                }
            },
            template: ShareTemplate
        };

    if (wrapper.wrapper === 'app') {
        // we often want to deliver a different share view to the app
        config.template = '\
            <div class="share ns__share ns__share-dropdown ns__share--app">\
                <a class="share__button share__png_icon share__tool--network" data-network="app" href="#"></a>\
            </div>';
    }

    var shareObject = new ShareTools(config);

    wrapper.onOptimizedScroll(function (scrollTop) {
        console.log('Optimized scroll.', scrollTop);
    });

    wrapper.onRawScroll(function (scrollTop) {
        console.log('Raw scroll.', scrollTop);
    });

    setTimeout(function () {
        wrapper.callIstats({
            actionType: 'panel-clicked',
            actionName: 'newsspec-interaction',
            viewLabel:  3
        });
    }, 500);
    setTimeout(function () {
        wrapper.callIstats({
            actionType: 'app loaded',
            actionName: 'newsspec-nonuser',
            viewLabel:  true
        });
    }, 2000);

    wrapper.markPageAsLoaded();

});
