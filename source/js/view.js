define(['jquery', 'sharetools', 'ShareToolsTemplate', 'model', 'wrapper', 'vocab', 'lib/d3.v3.min'],
    function ($, ShareToolsWrapper, ShareTemplate, Model, wrapper, vocab, d3){

    var model = new Model();

    var View = function () {
        this.init();
    };

    View.prototype = {
        init: function () {
            this.quizResults = {};
            this.setEvents();
            this.hideResults();
            this.d3 = d3;
            this.maximumGraphSize = 228;
            this.updateUrlsForSportApp();
        },
        istatsUpdate: function (elem) {
            if (elem === 'question13'){
                elem = 'age_button';
            } else if (elem === 'question14') {
                elem = 'question13';
            }
            var istatsInfo = {
                actionName: 'newsspec-interaction',
                actionType: elem + '-clicked',
                viewLabel: true
            };
            console.log(istatsInfo);
            wrapper.callIstats(istatsInfo);
        },
        updateUrlsForSportApp: function() {
            if (wrapper.meta().product === 'sport-app'){
                $('a').each(function() {
                    if ($(this).hasClass('share--url')){
                        return true;
                    }
                    this.href += (/\.app/.test(this.href) ? '' : '.app');
                });
            }
        },
        setEvents: function () {
            var self = this;
            $('.age-input').change(function (e){
                if (this.value < 5)   { this.value = 5;   }
                if (this.value > 110) { this.value = 110; }
            });
            $('button.age-button').click(function () {
                var age = parseInt($('input.age-input').val(), 10);
                model.setAge(age);
                self.istatsUpdate('take_quiz');
                self.scrollToQuiz();
            });
            $('.button--answer').click(function () {
                var $btn = $(this);
                var questionNumber = $btn.parents('.question').data('question');
                var questionNotAlreadyAnswered = (model.getQuestionScore(questionNumber) === '');
                self.setChosenAnswer(this);
                if ($btn.hasClass('age-button')){
                    return false;
                }
                if (questionNotAlreadyAnswered){
                    self.istatsUpdate('question' + questionNumber);
                }
                self.scrollToNextQuestion(this);
            });
            $('.see-results').on('click', function(e){
                self.calculateResult();
                self.showResult();
                self.scrollToResults();
            });
            $('.button--reset-quiz').click(function () {
                self.hideResults();
                self.resetQuiz();
                self.istatsUpdate('retake_quiz');
            });
            $('button.activity-level--answer').click(function () {
                var activityLevel = $(this).attr('data-activity-level');
                model.setActivityLevel(activityLevel);
            });
            $('.result__activity-url').click(function(){
                self.istatsUpdate('page_link_to_get_moving');
            });
            $('.footer_share__link--email').click(function(){
                self.istatsUpdate('page_share_email');
            });
            $('.footer_share__link--facebook').click(function(){
                self.istatsUpdate('page_share_facebook');
            });
            $('.footer_share__link--twitter').click(function(){
                self.istatsUpdate('page_share_twitter');
            });
        },
        mouseIsSupported: function(){
            return !('ontouchstart' in document.documentElement);
        },
        scrollToQuiz: function(){
            $('.questions').removeClass('hidden');
            var $scrollElem = $('.questions');

            if ($scrollElem.length){
                var scrollToPosition = $scrollElem.offset().top;
                wrapper.scrollTo({ position: scrollToPosition, duration: 400 });
                $('.question1 .button--answer')[0].focus();
            }
        },
        scrollToNextQuestion: function (chosenButton){
            var $scrollElem = $(chosenButton).parents('.question').find('.feedback__title');

            if ($scrollElem.length === 0){
                $scrollElem = $('.question14__icon');
            }

            if ($scrollElem.length){
                var scrollToPosition = ($scrollElem.offset().top)-25;
                wrapper.delay(function () {
                    wrapper.scrollTo({ position: scrollToPosition, duration: 500 });
                }, 350);
            }
        },
        scrollToResults: function(){
            var $scrollElem = $('.hero__chevron__bottom');

            if ($scrollElem.length){
                var scrollToPosition = $scrollElem.offset().top;
                wrapper.scrollTo({ position: scrollToPosition, duration: 1 });
            }
        },
        scrollToTop: function(){
            var scrollToPosition = $('.section--hero').offset().top;
            wrapper.scrollTo({ position: scrollToPosition, duration: 400 });
        },
        hideResults: function() {
            $('.see-results').addClass('hidden');
            $('.result__title').addClass('hidden');
            $('.result').addClass('hidden');
        },
        resetQuiz: function() {
            var $answerButtons = $('div.question').find('button'),
                $feedbackContainers = $('.question__feedback');

            this.scrollToTop();
            $answerButtons.each(function(){
                $(this).prop('disabled', false)
                .removeClass('answer--chosen');
            });
            $('.age-button').removeClass('hidden');
            $('.age-button').prop('disabled', false);
            $feedbackContainers.each(function(){
                $(this).addClass('hidden');
            });
            $('.result__graph__header__text').text(' ');
            $('.result__banner__categories__icon').each(function(){
                $(this).removeClass('result__banner__categories__icon--selected');
            });
            $('.questions').addClass('hidden');
            $('input.age-input').val('35');

            model.resetQuizData();
        },
        highlightCurrentQuestion: function (questionNumber){
            var nextQuestionNumber;
            if (questionNumber === 13){
                nextQuestionNumber = 1;
                $('.hero__chevron__bottom').addClass('hero__chevron__bottom--selected');
            } else {
                nextQuestionNumber = questionNumber + 1;
                $('.hero__chevron__bottom').removeClass('hero__chevron__bottom--selected');
            }
            $('.question' + questionNumber).removeClass('question--current');
            $('.question' + nextQuestionNumber).addClass('question--current');
        },
        setChosenAnswer: function (chosenButton){
            var questionNumber  = parseInt($(chosenButton).parents('.question').attr('data-question'), 10),
                currentQuestion = 'question' + questionNumber,
                questionScore   = $(chosenButton).attr('data-score');

            this.resetAnswers(currentQuestion);
            $(chosenButton).addClass('answer--chosen');
            this.setScore(currentQuestion, questionScore);
            this.showAnswerFeedback(currentQuestion);
            this.highlightCurrentQuestion(questionNumber);

            if (this.quizIsComplete()){
                this.enableShowResultButton();
            }
        },
        showAnswerFeedback: function(questionNumber){
            $('.' + questionNumber + '__feedback').removeClass('hidden');
        },
        setScore: function (questionNumber, score){
            model.setScore(questionNumber, score);
        },
        resetAnswers: function (currentQuestion) {
            var $answerButtons = $('div.' + currentQuestion).find('button');
            $answerButtons.each(function(){
                $(this).removeClass('answer--chosen');
            });
        },
        quizIsComplete: function() {
            var answeredQuestions = $('.answer--chosen').length;
            if (answeredQuestions === model.getQuizDataLength()){
                return true;
            } else {
                return false;
            }
        },
        enableShowResultButton: function() {
            $('.see-results').removeClass('hidden');
            $('.button--see-results').prop('disabled', false);
        },
        calculateResult: function (){
            this.quizResults = model.calculateResult();
        },
        showStrengthsAndWeaknesses: function() {
            if (model.fiveOrMoreScoresAreTheSame()){
                $('.weaknesses').addClass('hidden');
                $('.strengths' ).addClass('hidden');
                $('.result__strengths-weaknesses').addClass('hidden');
            } else {
                $('.result__strengths-weaknesses').removeClass('hidden');
                if ( model.userHasBottomResult() === false){
                    $('#strength_1').text(this.quizResults['strengths'][0]);
                    $('#strength_2').text(this.quizResults['strengths'][1]);
                    $('#strength_3').text(this.quizResults['strengths'][2]);
                    $('.strengths' ).removeClass('hidden');
                }
                if (model.getAge() < 17){
                    $('.weaknesses').addClass('hidden');
                } else {
                    if ( model.userHasTopResult() === false){
                        $('#weakness_1').text(this.quizResults['weaknesses'][0]);
                        $('#weakness_2').text(this.quizResults['weaknesses'][1]);
                        $('#weakness_3').text(this.quizResults['weaknesses'][2]);
                        $('.weaknesses').removeClass('hidden');
                    }
                }
            }
        },
        addResultsToShareInfo: function (resultCategoryNumber, icon){
            var result_share = new ShareToolsWrapper('.result__share', resultCategoryNumber, icon);
        },
        showResult: function(){
            var resultTitle             = this.quizResults.categoryTitle,
                resultText              = this.quizResults.categoryText,
                resultIcon              = this.quizResults.categoryIcon,
                resultReaction          = this.quizResults.categoryReaction,
                resultCategoryNumber    = this.quizResults.categoryNumber,
                resultCategorySelected  = '.result__banner__categories__icon--' + resultCategoryNumber,
                resultActivityText      = this.quizResults.activityText,
                resultActivityUrl       = this.quizResults.activityUrl,
                resultActivityUrlTitle  = this.quizResults.activityUrlTitle,
                graphData               = this.getGraphData();

            this.addResultsToShareInfo(resultCategoryNumber, resultIcon);

            $('.result__title__text').text(resultTitle);
            $('.result__banner__icon').html('<img border="0" src="../common/img/' + resultIcon + '" alt="" />');
            $('.result__banner__reaction').text(resultReaction);
            $('.result__banner__text').text(resultText);

            $(resultCategorySelected).addClass('result__banner__categories__icon--selected');

            $('.result__activity-text').html(resultActivityText + ' <a class="result__activity-url" href="' + resultActivityUrl + '" target="_top">' + resultActivityUrlTitle + '</a>');
            this.showStrengthsAndWeaknesses();
            $('.age-button').addClass('hidden');
            $('.questions').addClass('hidden');
            $('.result__title').removeClass('hidden');
            $('.result').removeClass('hidden');

            if(model.kidsResultAmended){
                $('.result__graph').addClass('hidden');
            } else {
                $('.result__graph').removeClass('hidden');
                this.updateGraph(graphData);
            }

            this.updateUrlsForSportApp();

            $('.see-results').addClass('hidden');
            this.istatsUpdate('see_results');
        },
        getGraphContainerSize: function () {
            var size = $('.result__graph__body').width();

            if (size > this.maximumGraphSize) {
                size = this.maximumGraphSize;
            }
            return size;
        },
        getGraphData: function (){
            var quizData = model.getQuizData(),
                graphData = [
                    { title: vocab.question_1_result_noun,   property: 'conscientiousness',  value: (quizData.question1.score * 2)   },
                    { title: vocab.question_2_result_noun,   property: 'perfectionism',      value: (quizData.question2.score * 2)   },
                    { title: vocab.question_3_result_noun,   property: 'mental toughness',   value: (quizData.question3.score * 2)   },
                    { title: vocab.question_4_result_noun,   property: 'ego',                value: (quizData.question4.score * 2)   },
                    { title: vocab.question_5_result_noun,   property: 'competitiveness',    value: (quizData.question5.score * 2)   },
                    { title: vocab.question_6_result_noun,   property: 'proactive approach', value: (quizData.question6.score * 2)   },
                    { title: vocab.question_7_result_noun,   property: 'motivation',         value: (quizData.question7.score * 2)   },
                    { title: vocab.question_8_result_noun,   property: 'task orientation',   value: (quizData.question8.score * 2)   },
                    { title: vocab.question_9_result_noun,   property: 'self confidence',    value: (quizData.question9.score * 2)   },
                    { title: vocab.question_10_result_noun,  property: 'focus',              value: (quizData.question10.score * 2)  },
                    { title: vocab.question_11_result_noun,  property: 'social support',     value: (quizData.question11.score * 2)  },
                    { title: vocab.question_12_result_noun,  property: 'goal-setting',       value: (quizData.question12.score * 2)  }
                ];
            return graphData;
        },
        getGraphDataValues: function(elem){
            var title = $(elem).parent().data('title');
            var value = $(elem).parent().data('value');
            value = vocab['number_' + value];
            return {
                'title': title,
                'value': value
            };
        },
        setGraphDataValues: function(graphData){
            var i=0;
            $('.graph__slice').each(function (){
                $(this).data('value', (graphData[i].value / 2));
                i++;
            });
        },
        setGraphEventsOn: function (insertInThisElement) {
            var self = this;
            if (this.mouseIsSupported()){
                var isFirefox = (typeof InstallTrigger !== 'undefined');
                $(insertInThisElement).on('mousemove', function (e) {
                    self.updateGraphTooltip(this);
                    self.moveGraphTooltip(e, isFirefox);
                });
                $(insertInThisElement).on('mouseout', function (e) {
                    self.hideGraphTooltip(e);
                });
                $('.result__graph__header__text').addClass('hidden');
                $('.result__graph__header__text--tap').addClass('hidden');
                $('.result__graph__header__text--hover').removeClass('hidden');
                $('.graph__status').addClass('graph__status--tooltip_view');
                $('.graph__status').removeClass('hidden');
            }
            else {
                $(insertInThisElement).on('mousedown', function (e) {
                    self.updateGraphHeader(this);
                    $('.graph__slice').removeClass('graph__slice--selected');
                    $(this).parent().addClass('graph__slice--selected');
                });
                $('.result__graph__header__text').removeClass('hidden');
                $('.result__graph__header__text--tap').removeClass('hidden');
                $('.result__graph__header__text--hover').addClass('hidden');
                $('.graph__status').addClass('hidden');
            }
        },
        moveGraphTooltip: function (e, isFirefox) {
            var tooltip = $('.graph__status--tooltip_view'),
                cursorOffset = 10,
                graphSize,
                tooltipX,
                tooltipY;

            graphSize = $('.graph__dial').width();

            tooltipY = e.offsetY;
            tooltipX = (e.offsetX + cursorOffset);

            //firefox fix
            if (isFirefox){
                tooltipY = (e.offsetY - cursorOffset)-20;
                tooltipX = (e.offsetX + (graphSize/2)+15);
            }

            tooltip
                .removeClass('hidden')
                .css('display', 'block')
                .css('left', tooltipX + 'px')
                .css('top',  tooltipY + 'px');
        },
        hideGraphTooltip: function (e) {
            setTimeout(function() {
                $('.graph__status--tooltip_view')
                    .css('display', 'none')
                    .addClass('hidden');
            }, 5);
        },
        updateGraph: function (graphData){

            var d3               = this.d3,
                slices           = d3.selectAll('.graph__slice-path'),
                size             = this.maximumGraphSize,
                radius           = size / 2,
                centralGap       = 36,
                quizLength       = model.getQuizDataLength()-2;

            function startAngle(d, i) {
                return 2 * (Math.PI / quizLength) * (i);
            }

            function endAngle(d, i) {
                var properEndAngle = 2 * (Math.PI / quizLength) * (i + 1),
                    endAngleWithPixelGap = properEndAngle - 0.025;
                return endAngleWithPixelGap;
            }

            var pie =
                    d3.layout.pie()
                        .value(function (d) { return d.value; }),
                arc =
                    d3.svg.arc()
                        .outerRadius(function (d) {
                            var maxHeight = radius - centralGap,
                                distanceFromTop = maxHeight - (d.value * (maxHeight / 10)),
                                height = maxHeight - distanceFromTop + centralGap;
                            return height;
                        })
                        .innerRadius(centralGap)
                        .startAngle(startAngle)
                        .endAngle(endAngle);

            slices
                .data(pie(graphData))
                .transition()
                .duration(700)
                .attr('d', arc);

            this.setGraphDataValues(graphData);
            this.setGraphEventsOn('.graph__slice-path');
            // this.setGraphEventsOn('.graph__dial__background');
        },
        updateGraphHeader: function (elem){
            this.updateGraphDetails(elem, '.result__graph__header__text');
        },
        updateGraphTooltip: function (elem) {
            this.updateGraphDetails(elem, '.graph__status');
        },
        updateGraphDetails: function (graphElem, graphInfoElem){
            var graphDataValues = this.getGraphDataValues(graphElem),
                graphHeaderText = graphDataValues.title + ' (' + graphDataValues.value + ')',
                rightToLeftLanguage = ( $('.bbc-news-vj-wrapper').hasClass('bbc-news-vj-direction--rtl') );

            if (rightToLeftLanguage) {
                graphHeaderText = graphDataValues.value + ' - ' + graphDataValues.title;
            }
            $(graphInfoElem).text(graphHeaderText);
        }
    };

    return View;
});