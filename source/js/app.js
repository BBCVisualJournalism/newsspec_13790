define(['wrapper', 'istats', 'jquery', 'view'],
    function (wrapper, istats, $, View) {

    //detect IE8, from https://gist.github.com/paulirish/357741
    function checkIfUsingIE(version, comparison) {
        var cc      = 'IE',
            b       = document.createElement('B'),
            docElem = document.documentElement,
            isIE;

        if(version){
            cc += ' ' + version;
            if(comparison){ cc = comparison + ' ' + cc; }
        }

        b.innerHTML = '<!--[if '+ cc +']><b id="iecctest"></b><![endif]-->';
        docElem.appendChild(b);
        isIE = !!document.getElementById('iecctest');
        docElem.removeChild(b);
        return isIE;
    }

    function tellUserToUpgradeTheirBrowser(usingIE8){
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

    var usingIE8 = checkIfUsingIE(8, 'lte');
    tellUserToUpgradeTheirBrowser(usingIE8);

    // we're not using IE8 or worse, let's enabled JS an get on with it
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
