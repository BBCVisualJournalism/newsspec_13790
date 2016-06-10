define(['jquery', 'model'], function ($, Model){

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
            $('button.answer').click(function () {
                self.setChosenAnswer(this);
            });
            $('.button--see-results').click(function(){
                self.calculateResult();
                self.showResult();
            });
            $('.button--reset-quiz').click(function () {
                self.hideResults();
                self.resetQuiz();
            });
            $('button.age--answer').click(function () {
                var age = $(this).attr('data-age-group');
                model.setAge(age);
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
            $feedbackContainers.each(function(){
                $(this).addClass('hidden');
            });

        },
        setChosenAnswer: function (chosenButton){
            var currentQuestion = 'question' + $(chosenButton).parent().parent().attr('data-question'),
                questionScore   = $(chosenButton).attr('data-score');

            $(chosenButton).addClass('answer--chosen');
            this.updateScore(currentQuestion, questionScore);
            this.disableAnswers(currentQuestion);
            this.showAnswerFeedback(currentQuestion);

            this.questionsAnswered++;
            if (this.quizIsComplete()){
                this.enableShowResultButton();
            }
        },
        showAnswerFeedback: function(questionNumber){
            $('.' + questionNumber + '__feedback').removeClass('hidden');
        },
        updateScore: function (questionNumber, score){
            model.updateScore(questionNumber, score);
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
        showResult: function(){
            //*********************************
            var resultTitle        = this.quizResults.categoryTitle,
                resultText         = this.quizResults.categoryText,
                resultActivityText = this.quizResults.activityText,
                resultActivityUrl  = this.quizResults.activityUrl;
            //*********************************
            $('.result--title').text(resultTitle);
            $('.result--text' ).text(resultText);
            $('.result--activity-text').html('<a href="' + resultActivityUrl + '" target="_top">' + resultActivityText + '</a>');

            $('#strength_1').text(this.quizResults['strengths'][0]);
            $('#strength_2').text(this.quizResults['strengths'][1]);
            $('#strength_3').text(this.quizResults['strengths'][2]);

            if (model.getAge() === '1'){
                $('.weaknesses').addClass('hidden');
            } else {
                $('#weakness_1').text(this.quizResults['weaknesses'][0]);
                $('#weakness_2').text(this.quizResults['weaknesses'][1]);
                $('#weakness_3').text(this.quizResults['weaknesses'][2]);
                $('.weaknesses').removeClass('hidden');
            }

            $('.button--see-results').addClass('hidden');
            $('.results').removeClass('hidden');
        }
    };

    return View;
});