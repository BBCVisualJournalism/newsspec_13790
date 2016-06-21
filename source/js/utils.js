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

    return { isElementInViewport : isElementInViewport };
});