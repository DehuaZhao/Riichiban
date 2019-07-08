Vue.component('hand-img', {
    props: ['tile'],
    template: '<img v-bind:src="\'tile/\' + tile.tileCode + \'.gif\'" />'
});


var init = new Vue({
    data: {
        winHand: handInfo = start(),
    }
})

var winHand = new Vue({
    el: '#winHand',
    data: {
        tileList: init.winHand.winHandJson
    },
});

var changkuang = new Vue({
    el: '#changkuang',
    data: {
        roundwind: kazekanji[+init.winHand.bakaze.substr(0,1) - 1] + "局",
        selfwind: kazekanji[+init.winHand.jikaze.substr(0,1) - 1] + "家",
        tsumoron: init.winHand.tsumo ? "自摸" : "荣和",
        richibang: "立直棒x" + init.winHand.riichibou,
        honba: "本场棒x" + init.winHand.honba,
    }
});

var pointsInput = new Vue({
    el: '#pointsInput',
    data: {

    },
    methods: {
        checkAnswer: function () {

        }
    }
});

var nextQuestion = new Vue({
    el: '#nextQuestion',
    methods: {
        nextQuestion: function getNewQuestion() {
            init.winHand = start();
        }
    }
});


