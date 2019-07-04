Vue.component('hand-img', {
    props: ['tile'],
    template: '<img v-bind:src="\'tile/\' + tile.tileCode + \'.gif\'" />'
});

var winHand = new Vue({
    el: '#winHand',
    data: {
        tileList: winHandJson = start()
    },
});

var changkuang = new Vue({
    el: '#changkuang',
    data: {
        tsumoron: 'tsumo',
        roundwind: 'dong',
        selfwind: 'xi',
        richibang: '3',
        honba: '3',
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
            winHand.tileList = start();
        }
    }
});


