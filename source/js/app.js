define(['wrapper', 'istats', 'jquery', 'utils', 'view'],
    function (wrapper, istats, $, utils, View) {

    // we're not using IE8 or worse, so enable the view and JS, and get on with it
    $('.bbc-news-vj-wrapper').addClass('bbc-news-vj-wrapper-js-enabled');
    $('.question--age').css('display', 'inherit');
    $('.section--questions').css('display', 'inherit');
    $('.section--results').css('display', 'inherit');

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

    wrapper.markPageAsLoaded();

    // console.log('wrapper = ' + wrapper.meta().wrapper);
    // console.log('product = ' + wrapper.meta().product);

});
