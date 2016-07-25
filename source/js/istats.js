define(['wrapper', 'jquery', 'utils'], function (wrapper, $, utils) {

    var resultsReached = false,
        heroReached = false,
        istatsInfo;

    var sectionElements = {
        'quiz_start': {
            element: $('.question1__icon'),
            reached: false
        },
        'question1': {
            element: $('.question2__icon'),
            reached: false
        },
        'question2': {
            element: $('.question3__icon'),
            reached: false
        },
        'question3': {
            element: $('.question4__icon'),
            reached: false
        },
        'question4': {
            element: $('.question5__icon'),
            reached: false
        },
        'question5': {
            element: $('.question6__icon'),
            reached: false
        },
        'question6': {
            element: $('.question7__icon'),
            reached: false
        },
        'question7': {
            element: $('.question8__icon'),
            reached: false
        },
        'question8': {
            element: $('.question9__icon'),
            reached: false
        },
        'question9': {
            element: $('.question10__icon'),
            reached: false
        },
        'question10': {
            element: $('.question11__icon'),
            reached: false
        },
        'question11': {
            element: $('.question12__icon'),
            reached: false
        },
        'question12': {
            element: $('.question14__icon'),
            reached: false
        },
        // final question listed as 14, cos question 13 moved to hero setion at top of page
        'final_question': {
            element: $('.question14 .answers'),
            reached: false
        }
    };

    var handleScroll = function () {

        for (var key in sectionElements) {
            if (utils.isElementInViewport(sectionElements[key].element)) {

                if (heroReached === false){
                    heroReached = true;
                    istatsInfo = {
                        actionName: 'newsspec-interaction',
                        actionType: 'hero-reached',
                        viewLabel: true
                    };
                    wrapper.callIstats(istatsInfo);
                }

                if ($('.questions').hasClass('hidden') === false) {
                    if (!sectionElements[key].reached) {
                        sectionElements[key].reached = true;
                        istatsInfo = {
                            actionName: 'newsspec-interaction',
                            actionType: '' + key + '-reached',
                            viewLabel: true
                        };
                        console.log(istatsInfo);
                        wrapper.callIstats(istatsInfo);
                    }
                }

                if (resultsReached === false && $('.result__title').hasClass('hidden') === false){
                    resultsReached = true;
                    istatsInfo = {
                        actionName: 'newsspec-interaction',
                        actionType: 'results-reached',
                        viewLabel: true
                    };
                    wrapper.callIstats(istatsInfo);
                }

            }
        }
    };

    var reset = function () {
        resultsReached = false;
        heroReached = false;
        for (var key in sectionElements) {
            if (sectionElements[key].reached) {
                sectionElements[key].reached = false;
            }
        }
    };

    var setShareToolsLogging = function () {
        $('.footer_share__link--email').click(function () {
            console.log('share__tool--network clicked...');
            istatsInfo = {
                actionName: 'newsspec-interaction',
                actionType: 'page_share--email-clicked',
                viewLabel: true
            };
            // console.log(istatsInfo);
            wrapper.callIstats(istatsInfo);
        });
        $('.footer_share__link--twitter').click(function () {
            console.log('share__tool--network clicked...');
            istatsInfo = {
                actionName: 'newsspec-interaction',
                actionType: 'page_share--twitter-clicked',
                viewLabel: true
            };
            // console.log(istatsInfo);
            wrapper.callIstats(istatsInfo);
        });
        $('.footer_share__link--facebook').click(function () {
            console.log('share__tool--network clicked...');
            istatsInfo = {
                actionName: 'newsspec-interaction',
                actionType: 'page_share--facebook-clicked',
                viewLabel: true
            };
            // console.log(istatsInfo);
            wrapper.callIstats(istatsInfo);
        });
    };

    var init = function () {
        // wrapper.onOptimizedScroll(handleScroll);
        setShareToolsLogging();
    };

    return {
        init: init,
        reset: reset
    };
});