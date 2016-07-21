define(['wrapper', 'istats', 'jquery', 'utils', 'view'],
    function (wrapper, istats, $, utils, View) {

    var usingIE8 = utils.checkIfUsingIE(8, 'lte');
    function tellUserToUpgradeTheirBrowserIf(usingIE8){
        if(usingIE8){
            console.warn('Using IE8 or lower');
            $('.age-button').addClass('hidden');
            $('.age-input').addClass('hidden');
            $('.question--age').addClass('hidden').css('height', '10px');
            $('.no-js-message').removeClass('hidden').css('display', 'block');
        } else {
            console.log('Not using IE8 or lower');
        }
    }
    tellUserToUpgradeTheirBrowserIf(usingIE8);

    // we're not using IE8 or worse, let's enabled JS an get on with it
    $('.bbc-news-vj-wrapper').addClass('bbc-news-vj-wrapper-js-enabled');

    //show activity links, and credits section only for english page
    var pageIsEnglish = $('.bbc-news-vj-wrapper').hasClass('bbc-news-vj-language--news');
    if( pageIsEnglish ){
        $('.section--credits').removeClass('hidden');
        $('.result__activity-text').removeClass('hidden');
    } else {
        $('.section--credits').addClass('hidden');
        $('.result__activity-text').addClass('hidden');
    }

    // create the view - to handle inputs, UI changes, etc
    var view = new View();

    istats.init();

    wrapper.markPageAsLoaded();

    console.log('current wrapper: ' + wrapper.wrapper);

});
