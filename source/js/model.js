define(['jquery', 'vocab'], function ($, vocab){

    var quizData =
        {
        'question1' : {
            'score'             : '',
            'result_noun'       : vocab.question_1_result_noun,
            'result_priority'   : '1'
        },
        'question2' : {
            'score'             : '',
            'result_noun'       : vocab.question_2_result_noun,
            'result_priority'   : '1'
        },
        'question3' : {
            'score'             : '',
            'result_noun'       : vocab.question_3_result_noun,
            'result_priority'   : '1'
        },
        'question4' : {
            'score'             : '',
            'result_noun'       : vocab.question_4_result_noun,
            'result_priority'   : '0'
        },
        'question5' : {
            'score'             : '',
            'result_noun'       : vocab.question_5_result_noun,
            'result_priority'   : '0'
        },
        'question6' : {
            'score'             : '',
            'result_noun'       : vocab.question_6_result_noun,
            'result_priority'   : '0'
        },
        'question7' : {
            'score'             : '',
            'result_noun'       : vocab.question_7_result_noun,
            'result_priority'   : '0'
        },
        'question8' : {
            'score'             : '',
            'result_noun'       : vocab.question_8_result_noun,
            'result_priority'   : '0'
        },
        'question9' : {
            'score'             : '',
            'result_noun'       : vocab.question_9_result_noun,
            'result_priority'   : '0'
        },
        'question10' : {
            'score'             : '',
            'result_noun'       : vocab.question_10_result_noun,
            'result_priority'   : '0'
        },
        'question11' : {
            'score'             : '',
            'result_noun'       : vocab.question_11_result_noun,
            'result_priority'   : '0'
        },
        'question12' : {
            'score'             : '',
            'result_noun'       : vocab.question_12_result_noun,
            'result_priority'   : '0'
        },
        'question13' : {
            'score'             : '',
            'result_noun'       : 'age', //not visible to user
            'result_priority'   : '0'
        },
        'question14' : {
            'score'             : '',
            'result_noun'       : 'fitness', // not visible to user
            'result_priority'   : '0'
        }
    };

    var Model = function (){
        this.init();
    };

    Model.prototype = {
        init: function(){
            this.age = 0;
            this.activityLevel = 0;
        },
        getQuizDataLength: function(){
            var length = Object.keys(quizData).length;
            return length;
        },
        convertObjectToArray: function (obj){
            var arr = Object.keys(obj).map(function (key) {
                return obj[key];
            });
            return arr;
        },
        updateScore: function (questionNumber, scoreValue){
            quizData[questionNumber].score = scoreValue;
        },
        getAge: function() {
            return this.age;
        },
        setAge: function(age) {
            this.age = age;
        },
        setActivityLevel: function(activityLevel) {
            this.activityLevel = activityLevel;
        },
        userIsNotVeryActive: function () {
            if (this.activityLevel === '3'){
                return true;
            }
            return false;
        },
        userIsUnder18: function () {
            if (this.age === '1'){
                return true;
            }
            return false;
        },
        calculateTotal: function(){
            var total = 0;
            for (var key in quizData) {
                if (quizData.hasOwnProperty(key)) {
                    for (var val in quizData[key]) {
                        if (quizData[key].hasOwnProperty(val)) {
                            if (val === 'score'){
                                total += parseInt(quizData[key][val], 10);
                            }
                        }
                    }
                }
            }
            return total;
        },
        calculateCategory: function (total){
            var category = { 'title': '', 'text' : ''};

            if (total <= 18) {
                category.title = vocab.results_category_5;
                category.text  = vocab.results_category_5_text;
            } else if (total >= 19 && total <= 29) {
                category.title = vocab.results_category_4;
                category.text  = vocab.results_category_4_text;
            } else if (total >= 30 && total <= 36) {
                category.title = vocab.results_category_3;
                category.text  = vocab.results_category_3_text;
            } else if (total >= 37 && total <= 48) {
                category.title = vocab.results_category_2;
                category.text  = vocab.results_category_2_text;
            } else if (total >= 49) {
                category.title = vocab.results_category_1;
                category.text  = vocab.results_category_1_text;
            } else {
                category.title = vocab.results_category_1;
                category.text  = vocab.results_category_1_text;
            }

            if (this.amendUnder18Result(category, vocab) === true){
                category.title = vocab.results_category_4;
                category.text  = vocab.results_category_4_text;
            }

            return category;
        },
        amendUnder18Result: function (category, vocab){
            if ( this.age === '1' && category.title === vocab.results_category_5 ) {
                return true;
            }
            return false;
        },
        calculateStrengths: function (){
            var strengths = this.convertObjectToArray(quizData);
            strengths.splice(-2, 2); // last 2 questions score differently, so we remove them

            strengths.sort(function(a, b) {
                // Sort by score (highest scores first)
                var currentItem = parseInt(b.score, 10) - parseInt(a.score, 10);
                if(currentItem) { return currentItem; }
                // If there is a tie, sort by result_priority (highest numbr is highest priority)
                var priority = parseInt(b.result_priority, 10) - parseInt(a.result_priority, 10);
                return priority;
            }).splice(3, 14);

            return [
                strengths[0].result_noun,
                strengths[1].result_noun,
                strengths[2].result_noun
            ];
        },
        calculateWeaknesses: function (){
            var weaknesses = this.convertObjectToArray(quizData);
            weaknesses.splice(-2, 2);

            //remove the strengths, they can't also be weaknesses
            weaknesses.sort(function(a, b) {
                var currentItem = parseInt(b.score, 10) - parseInt(a.score, 10);
                if(currentItem) { return currentItem; }
                var priority = parseInt(b.result_priority, 10) - parseInt(a.result_priority, 10);
                return priority;
            }).splice(0, 3);

            weaknesses.sort(function(a, b) {
                // Sort by score (lowest scores first)
                var currentItem = parseInt(a.score, 10) - parseInt(b.score, 10);
                if(currentItem) { return currentItem; }
                // If there is a tie, sort by result priority (highest numbr is highest priority)
                var priority = parseInt(b.result_priority, 10) - parseInt(a.result_priority, 10);
                return priority;
            }).splice(3, 14);

            return [
                weaknesses[0].result_noun,
                weaknesses[1].result_noun,
                weaknesses[2].result_noun
            ];
        },
        calculateResult: function(){
            var total        = this.calculateTotal(),
                category     = this.calculateCategory(total),
                strengths    = this.calculateStrengths(),
                weaknesses   = this.calculateWeaknesses(),
                activityText = vocab.activity_1_text,
                activityUrl  = vocab.activity_1_url,
                quizResults  = {};

            var categoryTitle = category.title;
            var categoryText = category.text;

            if (this.userIsNotVeryActive()){
                activityText = vocab.activity_2_text;
                activityUrl  = vocab.activity_2_url;
            }

            if (this.userIsUnder18() && this.userIsNotVeryActive()){
                activityText = vocab.activity_1_text;
                activityUrl  = vocab.activity_1_url;
            }

            quizResults = {
                'categoryTitle' : categoryTitle,
                'categoryText'  : categoryText,
                'total'         : total,
                'age'           : this.age,
                'activityLevel' : this.activityLevel,
                'activityText'  : activityText,
                'activityUrl'   : activityUrl,
                'strengths'     : strengths,
                'weaknesses'    : weaknesses
            };
            console.log('quizData: ', quizData, 'quizResults', quizResults);
            return quizResults;
        }
    };

    return Model;
});