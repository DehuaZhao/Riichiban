var winHandTiles = genTiles(); // e.g. ["4s4s4s", "3m3m3m", "0m6m7m", "6p7p8p", "9p9p"]
var winHandJson = [];
for (var j=0; j < 2*14; j = j+2) {
    winHandJson.push(JSON.parse('{"tileCode": ' + '"' + winHandTiles.join('').substr(j, 2) + '"}'));
}

Vue.component('hand-img', {
    props: ['tile'],
    template: '<img v-bind:src="\'tile/\' + tile.tileCode + \'.gif\'" />'
});

var winHand = new Vue({
    el: '#winHand',
    data: {
        tileList: winHandJson
    }
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

function genHand() {
    let tiles = genTiles();

    // 含有未完成部分
    let hand = {
        "tiles": tiles,
        "tsumoron": genRan(0, 1) == 0 ? 'tsumo' : 'ron',
        "roundwind": kaze[genRan(0, 1)],
        "selfwind": kaze[genRan(0, 3)],
        "richibang": genRan(0, 4),
        "honba": genRan(0, 4),
        "dora": allTiles[genRan(0, allTiles.length)],
        "winingHand": tiles[genRan(0, 4)].charAt(genRan(0, 1)),
        "fuuro": genFuuro()
    };

    return hand;
};

function genTiles() {
    let tiles = [];

    do {
        for (let i=0; i<4; i++) {
            tiles.push(mentsu[genRan(0, mentsu.length - 1)]);
        }
        tiles.push(toitsu[genRan(0, toitsu.length - 1)]);
    }
    while (authTiles(tiles));

    // 未完成部分
    // 满足一番束
    // 不满足一番束，则riichi=true, fuuro=false
    console.log("gentiles:" + tiles);
    return tiles;
};

// 检查tile是否合法，0s不能重复，5s不能同时出现超过3个，其余不能同时出现超过4个.
function authTiles(tiles) {
    let tileStr = tiles.join("");

    // check num of akadora
    if (countNumberOf(tileStr, /0m/) > 1
        || countNumberOf(tileStr, /0p/) > 1
        || countNumberOf(tileStr, /0s/) > 1 ) {
        return true;
    }

    // check num of 5m/5p/5s
    if (countNumberOf(tileStr, /5m/) > 3
        || countNumberOf(tileStr, /5p/) > 3
        || countNumberOf(tileStr, /5s/) > 3 ) {
        return true;
    }

    // check num of others
    for (var val in countNumberOf(tileStr)) {
        if (tileStr[val] > 4) {
            return true;
        }
    }
    return false;
};

function countNumberOf(tileStr) {
    var json = {};
    for (var i=0; i<2*14; i=i+2) {
        json[tileStr.substr(i, 2)]  = (json[tileStr.substr(i, 2)] +1) || 1;
    };
    return json;
};

function genDora() {
    //return
};

function genFuuro() {
    let fuuroAt = [];
    let ran;

    for (let i=0; i<genRan(0,3); i++) {
        do {
            ran = genRan(0,3);
        }
        while (fuuroAt.indexOf(ran) >= 0)

        fuuroAt.push(ran);
    }

    return fuuroAt;
};

// 符
function calFu() {

};

// 翻
function calHan() {

};

// 随机整数, 闭区间[min, max]
function genRan(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min, 10);
};
