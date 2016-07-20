define(['wrapper', 'istats', 'jquery', 'view'],
    function (wrapper, istats, $, View) {

    $('.bbc-news-vj-wrapper').addClass('bbc-news-vj-wrapper-js-enabled');

    //show activity links, and credits section only for english page
    if( $('.bbc-news-vj-wrapper').hasClass('bbc-news-vj-language--news') ){
        $('.ns_creditsHolder').removeClass('hidden');
        $('.result__activity-text').removeClass('hidden');
    } else {
        $('.ns_creditsHolder').addClass('hidden');
        $('.result__activity-text').addClass('hidden');
    }

    // create the view - to handle inputs, UI changes, etc
    var view = new View();

    istats.init();


    wrapper.markPageAsLoaded();


    console.log('current wrapper: ' + wrapper.wrapper);

});
