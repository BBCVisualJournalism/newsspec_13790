define(['vocab', 'quizdata'], function (vocab, quizData){

    var Model = function (){
        this.init();
    };

    Model.prototype = {
        init: function(){
            this.age = 0;
            this.activityLevel = 0;
            this.scoresArray = [];
            this.kidsResultAmended = false;
        },
        getQuizDataLength: function(){
            var length = Object.keys(quizData).length;
            return length;
        },
        getQuizData: function(){
            return quizData;
        },
        convertObjectToArray: function (obj){
            var arr = Object.keys(obj).map(function (key) {
                return obj[key];
            });
            return arr;
        },
        setScore: function (questionNumber, scoreValue){
            quizData[questionNumber].score = scoreValue;
        },
        getQuestionScore: function (qNumber){
            var questionNumber = 'question' + qNumber;
            var questionScore = quizData[questionNumber].score;
            return questionScore;
        },
        getScoresArray: function() {
            return this.scoresArray;
        },
        getAge: function() {
            return parseInt(this.age, 10);
        },
        setAge: function(age) {
            this.age = parseInt(age, 10);
        },
        setActivityLevel: function(activityLevel) {
            this.activityLevel = activityLevel;
        },
        userIsNotVeryActive: function () {
            if (this.activityLevel === '1'){
                return true;
            }
            return false;
        },
        userIsUnder18: function () {
            if (this.age < 18){
                return true;
            }
            return false;
        },
        userHasTopResult: function (){
            var total = this.calculateTotal();
            return ( total >= vocab.results_category_1_total );
        },
        userHasBottomResult: function (){
            var total = this.calculateTotal();
            return ( total <= vocab.results_category_5_total );
        },
        fiveOrMoreScoresAreTheSame: function(){
            if (this.scoresArray.length === 14){
                this.scoresArray.splice(-2, 2); // last 2 questions always score zero, so remove them from list
            }
            var counts = {};
            this.scoresArray.forEach(function(x) {
                counts[x] = (counts[x] || 0)+1;
            });
            for (var key in counts) {
              if (counts.hasOwnProperty(key)) {
                if (counts[key] > 4){
                    return true;
                }
              }
            }
            return false;
        },
        calculateTotal: function(){
            var total = 0;
            this.scoresArray = [];
            for (var key in quizData) {
                if (quizData.hasOwnProperty(key)) {
                    for (var val in quizData[key]) {
                        if (quizData[key].hasOwnProperty(val)) {
                            if (val === 'score'){
                                total += parseInt(quizData[key][val], 10);
                                this.scoresArray.push( parseInt(quizData[key][val], 10));
                            }
                        }
                    }
                }
            }

            return parseInt(total, 10);
        },
        calculateCategory: function (total){
            var category = { 'title': '', 'text' : '', 'icon': '', 'reaction': '', 'number': ''};

            var cat1_total = parseInt(vocab.results_category_1_total, 10),
                cat2_total = parseInt(vocab.results_category_2_total, 10),
                cat3_total = parseInt(vocab.results_category_3_total, 10),
                cat4_total = parseInt(vocab.results_category_4_total, 10),
                cat5_total = parseInt(vocab.results_category_5_total, 10);

            if (total <= cat5_total) {
                category.title    = vocab.results_category_5;
                category.text     = vocab.results_category_5_text;
                category.icon     = vocab.results_category_5_icon;
                category.reaction = vocab.results_reaction_5;
                category.number   = 5;

            }
            else if (total > cat5_total && total <= cat4_total) {
                category.title    = vocab.results_category_4;
                category.text     = vocab.results_category_4_text;
                category.icon     = vocab.results_category_4_icon;
                category.reaction = vocab.results_reaction_4;
                category.number   = 4;

            }
            else if (total > cat4_total && total <= cat3_total) {
                category.title    = vocab.results_category_3;
                category.text     = vocab.results_category_3_text;
                category.icon     = vocab.results_category_3_icon;
                category.reaction = vocab.results_reaction_3;
                category.number   = 3;

            }
            else if (total > cat3_total && total <= cat2_total) {
                category.title    = vocab.results_category_2;
                category.text     = vocab.results_category_2_text;
                category.icon     = vocab.results_category_2_icon;
                category.reaction = vocab.results_reaction_2;
                category.number   = 2;

            }
            else if (total >= cat1_total) {
                category.title    = vocab.results_category_1;
                category.text     = vocab.results_category_1_text;
                category.icon     = vocab.results_category_1_icon;
                category.reaction = vocab.results_reaction_1;
                category.number   = 1;

            } else {
                category.title    = vocab.results_category_1;
                category.text     = vocab.results_category_1_text;
                category.icon     = vocab.results_category_1_icon;
                category.reaction = vocab.results_reaction_1;
                category.number   = 1;
            }


            if (this.amendKidsResult(category, vocab) === true){
                category.title    = vocab.results_category_3;
                category.text     = vocab.results_category_3_text;
                category.icon     = vocab.results_category_3_icon;
                category.reaction = vocab.results_reaction_3;
                category.number   = 3;
            }

            return category;
        },
        amendKidsResult: function (category, vocab){
            if ( this.age < 17 && (category.title === vocab.results_category_5 || category.title === vocab.results_category_4) ) {
                this.kidsResultAmended = true;
                return true;
            }
            this.kidsResultAmended = false;
            return false;
        },
        calculateStrengths: function (){
            var strengths = this.convertObjectToArray(quizData);
            strengths.splice(-2, 2); // last 2 questions score differently, so we remove them

            strengths.sort(function(a, b) {
                // Sort by score (highest scores first)
                var currentItem = parseInt(b.score, 10) - parseInt(a.score, 10);
                if(currentItem) { return currentItem; }
                // If there is a tie, sort by result_priority (lowest numbr is highest priority)
                var priority = parseInt(a.result_priority, 10) - parseInt(b.result_priority, 10);
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
                var priority = parseInt(a.result_priority, 10) - parseInt(b.result_priority, 10);
                return priority;
            }).splice(0, 3);

            weaknesses.sort(function(a, b) {
                // Sort by score (lowest scores first)
                var currentItem = parseInt(a.score, 10) - parseInt(b.score, 10);
                if(currentItem) { return currentItem; }
                // If there is a tie, sort by result priority (lowest numbr is highest priority)
                var priority = parseInt(a.result_priority, 10) - parseInt(b.result_priority, 10);
                return priority;
            }).splice(3, 14);

            return [
                weaknesses[0].result_noun,
                weaknesses[1].result_noun,
                weaknesses[2].result_noun
            ];
        },
        calculateResult: function(){
            var total            = this.calculateTotal(),
                category         = this.calculateCategory(total),
                strengths        = this.calculateStrengths(),
                weaknesses       = this.calculateWeaknesses(),
                activityText     = vocab.activity_1_text,
                activityUrl      = vocab.activity_1_url,
                activityUrlTitle = vocab.activity_1_url_title,
                categoryTitle    = category.title,
                categoryText     = category.text,
                categoryIcon     = category.icon,
                categoryNumber   = category.number,
                categoryReaction = category.reaction,
                quizResults      = {};

            if (this.userIsNotVeryActive() === true){
                activityText     = vocab.activity_2_text;
                activityUrl      = vocab.activity_2_url;
                activityUrlTitle = vocab.activity_2_url_title;
            }

            if (this.fiveOrMoreScoresAreTheSame(this.scoresArray)){
                strengths  = '';
                weaknesses = '';
            }

            quizResults = {
                'categoryTitle'   : categoryTitle,
                'categoryText'    : categoryText,
                'categoryIcon'    : categoryIcon,
                'categoryReaction': categoryReaction,
                'categoryNumber'  : categoryNumber,
                'total'           : total,
                'age'             : this.age,
                'activityLevel'   : this.activityLevel,
                'activityText'    : activityText,
                'activityUrl'     : activityUrl,
                'activityUrlTitle': activityUrlTitle,
                'strengths'       : strengths,
                'weaknesses'      : weaknesses
            };
            // console.log('quizData:', quizData, 'quizResults:', quizResults);
            return quizResults;
        },
        resetQuizData: function (){
            for (var key in quizData) {
                if (quizData.hasOwnProperty(key)) {
                    for (var val in quizData[key]) {
                        if (quizData[key].hasOwnProperty(val)) {
                            if (val === 'score'){
                                quizData[key][val] = '';
                            }
                        }
                    }
                }
            }
        }
    };

    return Model;
});