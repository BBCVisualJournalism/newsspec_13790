define(['jquery', 'ShareTools', 'ShareToolsTemplate', 'model', 'wrapper', 'istats', 'vocab'],
    function ($, ShareTools, ShareTemplate, Model, wrapper, istats, vocab){

    var model = new Model();

    var View = function () {
        this.init();
    };

    View.prototype = {
        init: function () {
            this.quizResults = {};
            this.questionsAnswered = 0;
            this.setEvents();
            this.hideResults();
        },
        setEvents: function () {
            var self = this;
            $('button.age-button').click(function () {
                var age = parseInt($('input.age-input').val(), 10);
                model.setAge(age);
                self.scrollToQuiz();
            });
            $('.button--answer').click(function () {
                self.setChosenAnswer(this);
                self.scrollToNextQuestion(this);
            });
            $('.button--see-results').click(function(){
                self.calculateResult();
                self.showResult();
            });
            $('.button--reset-quiz').click(function () {
                self.hideResults();
                self.resetQuiz();
            });
            $('button.activity-level--answer').click(function () {
                var activityLevel = $(this).attr('data-activity-level');
                model.setActivityLevel(activityLevel);
            });
        },
        scrollToQuiz: function(){
            $('.questions').removeClass('hidden');
            var $scrollElem = $('.questions');

            if ($scrollElem.length){
                var scrollToPosition = $scrollElem.offset().top;
                wrapper.scrollTo({ position: scrollToPosition, duration: 500 });
                $('.question1 .button--answer')[0].focus();
            }
        },
        scrollToTop: function(){
            var scrollToPosition = $('.section--hero').offset().top;
            wrapper.scrollTo({ position: scrollToPosition, duration: 500 });
        },
        hideResults: function() {
            $('.result__title').addClass('hidden');
            $('.result').addClass('hidden');
        },
        resetQuiz: function() {
            this.questionsAnswered = 0;
            var $answerButtons = $('div.question').find('button'),
                $feedbackContainers = $('.question__feedback');

            this.scrollToTop();
            $answerButtons.each(function(){
                $(this).prop('disabled', false)
                .removeClass('answer--chosen');
            });
            $('.age-button').prop('disabled', false);
            $feedbackContainers.each(function(){
                $(this).addClass('hidden');
            });
            $('.result__banner__categories__icon').each(function(){
                $(this).removeClass('result__banner__categories__icon--selected');
            });
            $('.questions').addClass('hidden');
            $('input.age-input').val('35');

            istats.reset();
        },
        setChosenAnswer: function (chosenButton){
            var currentQuestion = 'question' + $(chosenButton).parents('.question').attr('data-question'),
                questionScore   = $(chosenButton).attr('data-score');

            $(chosenButton).addClass('answer--chosen');
            this.setScore(currentQuestion, questionScore);
            this.disableAnswers(currentQuestion);
            this.showAnswerFeedback(currentQuestion);

            this.questionsAnswered++;
            if (this.quizIsComplete()){
                this.enableShowResultButton();
            }
        },
        scrollToNextQuestion: function (chosenButton){
            var $scrollElem = $(chosenButton).parents('.question').find('.question__feedback');

            if ($scrollElem.length){
                var scrollToPosition = $scrollElem.offset().top;
                wrapper.scrollTo({ position: scrollToPosition, duration: 500 });
            }
        },
        showAnswerFeedback: function(questionNumber){
            $('.' + questionNumber + '__feedback').removeClass('hidden');
        },
        setScore: function (questionNumber, score){
            model.setScore(questionNumber, score);
        },
        disableAnswers: function (currentQuestion) {
            var $answerButtons = $('div.' + currentQuestion).find('button');
            $answerButtons.each(function(){
                $(this).prop('disabled', true);
            });
        },
        quizIsComplete: function() {
            return (this.questionsAnswered === model.getQuizDataLength());
        },
        enableShowResultButton: function() {
            $('.button--see-results').prop('disabled', false).removeClass('hidden');
        },
        calculateResult: function (){
            this.quizResults = model.calculateResult();
        },
        showStrengthsAndWeaknesses: function() {
            if (model.fiveOrMoreScoresAreTheSame()){
                $('.weaknesses').addClass('hidden');
                $('.strengths' ).addClass('hidden');
            } else {
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
        showResult: function(){
            var resultTitle             = this.quizResults.categoryTitle,
                resultText              = this.quizResults.categoryText,
                resultIcon              = this.quizResults.categoryIcon,
                resultReaction          = this.quizResults.categoryReaction,
                resultCategoryNumber    = this.quizResults.categoryNumber,
                resultCategorySelected  = '.result__banner__categories__icon--' + resultCategoryNumber,
                resultActivityText      = this.quizResults.activityText,
                resultActivityUrl       = this.quizResults.activityUrl,
                resultActivityUrlTitle  = this.quizResults.activityUrlTitle;

            this.addResultsToShareInfo(resultTitle, resultText, resultIcon, resultReaction);

            $('.result__title__text').text(resultTitle);
            $('.result__banner__icon').html('<img border="0" src="../common/img/' + resultIcon + '" alt="" />');
            $('.result__banner__reaction').text(resultReaction);
            $('.result__banner__text').text(resultText);

            $(resultCategorySelected).addClass('result__banner__categories__icon--selected');

            $('.result__activity-text').html(resultActivityText + ' <a href="' + resultActivityUrl + '" target="_top">' + resultActivityUrlTitle + '</a>');
            this.showStrengthsAndWeaknesses();
            $('.button--see-results').addClass('hidden');
            $('.result__title').removeClass('hidden');
            $('.result').removeClass('hidden');
        },
        addResultsToShareInfo: function (title, text, icon, reaction){
           var shareTitle       = vocab.share_intro + ' ' + title,
                shareMessage    = text,
                shareIcon       = icon;

                config = {
                    holderEl: '.result__share',
                    label: vocab.share_title,
                    shareUrl: wrapper.url().hostUrl,
                    messages: {
                        twitter: shareTitle + '\r\n' + shareMessage,
                        facebook: {
                            title:       shareTitle,
                            description: shareMessage,
                            image:       '../common/img/' + shareIcon // optional
                        },
                        email: {
                            subject: shareTitle,
                            message: shareMessage
                        },
                        app: {
                            shareEndpoint: 'bbcnewsapp://visualjournalism/share',
                            popup: false,
                            properties: {
                                title: shareTitle,
                                text: shareMessage
                            }
                        }
                    },
                    template: ShareTemplate
                };

            if (wrapper.wrapper === 'app') {
                // we often want to deliver a different share view to the app
                config.template = '\
                    <div class="share ns__share ns__share-dropdown ns__share--app">\
                        <a class="share__button share__png_icon share__tool--network" data-network="app" href="#"></a>\
                    </div>';
            }

            var shareObject = new ShareTools(config);
        }
    };

    return View;
});