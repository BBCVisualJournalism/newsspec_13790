define(['jquery'], function ($) {

    var isElementInViewport = function ($element, fully) {
        var $window = $(window);

        var elementTop = $element.offset().top;
        var elementBottom = elementTop + $element.outerHeight();

        var windowTop = $window.scrollTop();
        var windowBottom = windowTop + $window.height();

        if (fully) {
            return ((elementBottom <= windowBottom) && (elementTop >= windowTop));
        } else {
            return ((elementTop <= windowBottom) && (elementBottom >= windowTop));
        }
    };

    //detect IE8, from https://gist.github.com/paulirish/357741
    var checkIfUsingIE = function (version, comparison) {
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
    };

    return {
        isElementInViewport : isElementInViewport,
        checkIfUsingIE : checkIfUsingIE
    };
});