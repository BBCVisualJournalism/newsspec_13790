define(['jquery', 'model', 'wrapper', 'istats'], function ($, Model, wrapper, istats){

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
                $('.questions').removeClass('hidden');
            });
            $('.button--answer').click(function () {
                self.setChosenAnswer(this);
                self.scrollToNext(this);
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
        hideResults: function() {
            $('.results').addClass('hidden');
        },
        resetQuiz: function() {
            this.questionsAnswered = 0;
            var $answerButtons = $('div.question').find('button'),
                $feedbackContainers = $('.question__feedback');

            $answerButtons.each(function(){
                $(this).prop('disabled', false)
                .removeClass('answer--chosen');
            });
            $('.age-button').prop('disabled', false);
            $feedbackContainers.each(function(){
                $(this).addClass('hidden');
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
        scrollToNext: function (chosenButton){
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
                resultActivityText      = this.quizResults.activityText,
                resultActivityUrl       = this.quizResults.activityUrl,
                resultActivityUrlTitle  = this.quizResults.activityUrlTitle;

            $('.result--title').text(resultTitle);
            $('.result--text' ).text(resultText);
            $('.result--activity-text').html(resultActivityText + ' <a href="' + resultActivityUrl + '" target="_top">' + resultActivityUrlTitle + '</a>');
            this.showStrengthsAndWeaknesses();
            $('.button--see-results').addClass('hidden');
            $('.results').removeClass('hidden');
        }
    };

    return View;
});