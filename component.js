Vue.component('hand-img', {
    props: ['tile'],
    template: '<img v-bind:src="\'tile/\' + tile.tileCode + \'.gif\'" />'
});

var init = new Vue({
    data: {
        handInfo: start(),
    }
})

var winHand = new Vue({
    el: '#winHand',
    data: {
    },
    computed: {
        tileList: function () {
            let json = [];
            for (let j=0; j < 2*14; j = j+2) {
                json.push(JSON.parse(
                    '{"tileCode": ' + '"' + init.handInfo.winHand.join('').substr(j, 2) + '"}'
                ));
            }
            return json;
        },
    }
});

var changkuang = new Vue({
    el: '#changkuang',
    computed: {
        roundwind: function () {
            return kazekanji[+init.handInfo.bakaze.substr(0,1) - 1] + "局";
        },
        selfwind: function () {
            return kazekanji[+init.handInfo.jikaze.substr(0,1) - 1] + "家";
        },
        tsumoron: function () {
            return init.handInfo.tsumo ? "自摸" : "荣和";
        },
        richibang: function () {
            return "立直棒x" + init.handInfo.riichibou;
        },
        honba: function () {
            return "本场棒x" + init.handInfo.honba;
        },
    }
});

var pointsInput = new Vue({
    el: '#pointsInput',
    data: {
        showAnswer: false,
    },
    methods: {
        checkAnswer: function () {
            this.showAnswer = true;
        }
    },
    computed: {
        totalPoint: function () {
            return init.handInfo.totalPoint;
        },
    }
});

var nextQuestion = new Vue({
    el: '#nextQuestion',
    methods: {
        nextQuestion: function getNewQuestion() {
            init.handInfo = start();
            pointsInput.showAnswer = false;
        }
    }
});


