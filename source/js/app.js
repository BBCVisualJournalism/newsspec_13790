define(['wrapper', 'istats', 'jquery', 'view'],
    function (wrapper, istats, $, View) {

    $('.bbc-news-vj-wrapper').addClass('bbc-news-vj-wrapper-js-enabled');

    //show credits only for english page
    if( $('.bbc-news-vj-wrapper').hasClass('bbc-news-vj-language--news') ){
        $('.ns_creditsHolder').removeClass('hidden');
    } else {
        $('.ns_creditsHolder').addClass('hidden');
    }

    // check if in app, if so, append '.app' to all href urls..

    // create the view - to handle inputs, UI changes, etc
    var view = new View();

    istats.init();

    wrapper.markPageAsLoaded();

});
