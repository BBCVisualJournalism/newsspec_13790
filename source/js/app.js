define(['wrapper', 'istats', 'jquery', 'view'],
    function (wrapper, istats, $, View) {

    $('.bbc-news-vj-wrapper').addClass('bbc-news-vj-wrapper-js-enabled');

    // create the view - to handle inputs, UI changes, etc
    var view = new View();

    istats.init();

    wrapper.markPageAsLoaded();

});
