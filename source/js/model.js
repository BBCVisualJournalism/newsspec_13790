define(['jquery'], function ($){

    var quizData =
        {
        'question1' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'conscientiousness',   // vocab.question_1_result_noun
            'result_priority'   : '1'
        },
        'question2' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'perfectionism',       // vocab.question_2_result_noun
            'result_priority'   : '1'
        },
        'question3' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'mental toughness',    // etc
            'result_priority'   : '1'
        },
        'question4' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'ego',
            'result_priority'   : '0'
        },
        'question5' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'competitiveness',
            'result_priority'   : '0'
        },
        'question6' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'proactive approach',
            'result_priority'   : '0'
        },
        'question7' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'motivation',
            'result_priority'   : '0'
        },
        'question8' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'task orientation',
            'result_priority'   : '0'
        },
        'question9' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'self confidence',
            'result_priority'   : '0'
        },
        'question10' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'focus',
            'result_priority'   : '0'
        },
        'question11' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'social support',
            'result_priority'   : '0'
        },
        'question12' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'goal-setting',
            'result_priority'   : '0'
        },
        'question13' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'age',
            'result_priority'   : '0'
        },
        'question14' : {
            'score'             : '',
            'answer_text'       : '',
            'result_noun'       : 'fitness',
            'result_priority'   : '0'
        }
    };

    var vocab = {
        'results_category_1': 'Olympian',
        'results_category_2': 'Athlete',
        'results_category_3': 'Sporty',
        'results_category_4': 'Lacks focus',
        'results_category_5': 'On standby',

        'results_category_1_text': 'Congratulations! You have the mindset needed to compete right at the top level of competitive sport.',
        'results_category_2_text': 'You have most of the strengths needed to be a good athlete, but you may struggle to make it on to the medals podium.',
        'results_category_3_text': 'You don\'t have the mentality to compete in Olympic sport, but you would be a great asset to any local sports team.',
        'results_category_4_text': 'It seems that you\'re don\'t have the mentality of an Olympian, but you could still enjoy sport at a recreational level.',
        'results_category_5_text': 'It may come as no surprise that you don\'t seem to have the mental habits of an Olympian but you can still enjoy sport and exercise as a way of keeping active.',

        'activity_1_text': 'Find more information on getting involved in sport at BBC Get Inspired',                  // if active
        'activity_1_url':  'http://www.bbc.co.uk/sport/get-inspired',
        'activity_2_text': 'Find more information on getting started with sport and exercise at BBC Make your Move',  // if not active
        'activity_2_url':  'http://www.bbc.co.uk/programmes/p03m53p1'

    };

    var Model = function (){
        this.init();
    };

    Model.prototype = {
        init: function(){
            this.age = 0;
            this.activityLevel = 0;
            return quizData;
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

            // dont give under 18s the worst results
            if (this.age === '1' && category.title === vocab.results_category_5 ){ // 1 is the youngest group, 5 is lowest total
                category.title = vocab.results_category_4;
                category.text  = vocab.results_category_4_text;
            }

            return category;
        },
        calculateStrengths: function (){
            var strengths = this.convertObjectToArray(quizData);
            strengths.splice(-2, 2); // remove last 2 questions, they score differently

            strengths.sort(function(a, b) {
                // Sort by count
                var currentItem = parseInt(b.score, 10) - parseInt(a.score, 10);
                if(currentItem) { return currentItem; }
                // If there is a tie, sort by year
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
            weaknesses.splice(-2, 2); // remove last 2 questions, they score differently

            //remove the 3 strengths
            weaknesses.sort(function(a, b) {
                return parseInt(b.score, 10) - parseInt(a.score, 10);
            }).splice(0, 3);

            weaknesses.sort(function(a, b) {
                return parseInt(a.score, 10) - parseInt(b.score, 10);
            }).splice(3, 14);

            return [
                weaknesses[0].result_noun,
                weaknesses[1].result_noun,
                weaknesses[2].result_noun
            ];
        },
        calculateResult: function(){
            // get total score
            var total        = this.calculateTotal(),
                category     = this.calculateCategory(total),
                strengths    = this.calculateStrengths(),
                weaknesses   = this.calculateWeaknesses(),
                activityText = vocab.activity_1_text,
                activityUrl  = vocab.activity_1_url,
                quizResults  = {};

            var categoryTitle = category.title;
            var categoryText = category.text;

            if (this.activityLevel === '3'){ // if not very active
                activityText = vocab.activity_2_text;
                activityUrl  = vocab.activity_2_url;
            }

            if (this.age === '1' && this.activityLevel === '3'){ //if user is under 18, and scores low, make the resuls a little nicer
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
            // console.log(quizResults, quizData);
            return quizResults;
        }
    };

    return Model;
});