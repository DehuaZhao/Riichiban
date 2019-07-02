function start() {
    let handInfo = {
        bakaze: genKaze("Ba"), // 场风
        jikaze: genKaze("Ji"), // 自风
        honba: genRan(0, 5),   // 几本场
        riichibou: genRan(0, 2), // 立直棒个数
        winHand: genWinHand(), // 赢牌手牌
        winTile: genWinTile(), // 和张
        // doras:
    };

    console.log(handInfo)

    //let point = calPoint(handInfo); // 计算目前手牌翻

    // 只传递了手牌编码过去, 其他都未包含
    let winHandTiles = handInfo.winHand; // e.g. ["4s4s4s", "3m3m3m", "0m6m7m", "6p7p8p", "9p9p"]
    let winHandJson = [];
    for (let j=0; j < 2*14; j = j+2) {
        winHandJson.push(JSON.parse('{"tileCode": ' + '"' + winHandTiles.join('').substr(j, 2) + '"}'));
    }

    return winHandJson;
}

function genKaze(kazeType) {
    let maxKaze = kazeType == "Ba" ? 1 : kaze.length -1;

    return kaze[genRan(0, maxKaze)];
}

function genWinHand() {
    do {
        var hand = [];
        for (let i=0; i<4; i++) {
            hand.push(mentsu[genRan(0, mentsu.length - 1)]);
        }
        hand.push(toitsu[genRan(0, toitsu.length - 1)]);
    }
    while (authHand(hand) === "FAIL");

    return hand;
}

function genWinTile() {
    let winOn = genRan(0, 4); // 在哪一组面子或雀头上赢牌
    let winAt = winOn != 4 ? genRan(0, 2) : genRan(0, 1); //赢哪张牌

    return [winOn, winAt];
}

function genDora() {
    let dora = genRan()
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

function calPoint(handInfo) {
    let fuuro;
    let menzen;
    let riichi;
    let tsumo;
    let whichFuuro;

    let preYaku = calPreYaku(handInfo);

    if (checkIifanshibari(preYaku)) {
        if (checkPinfuPeikou(preYaku)) {
            fuuro = false;
            riichi = ran;
            tsumo = ran;
        }
        else {
            fuuro = ran;
            riichi = fuuro ? false : ran;
            tsumo = ran;
            if (fuuro) {
                genFuuro();
            }
        }
    }
    else {
        fuuro = false;
        riichi = ran;
        tsumo = riichi ? ran : true
    }

    menzen = !fuuro;

    let doraNum = countDora(handInfo.winHand);
    let yaku = countTotalYaku(preYaku, riichi, menzen, tsumo);
    let fu = calFu(handInfo.winHand, handInfo.winTile, fuuro, whichFuuro, yaku);
    return calPoint(yaku, fu, handInfo);
}

// 检查tile是否合法，0s不能重复，5s不能同时出现超过3个，其余不能同时出现超过4个.
function authHand(hand) {
    let handStr = hand.join("");
    let tileStat = countNumberOfTile(handStr);

    // pending: 检查包含朵拉提示牌数量.

    // check num of akadora,
    if (tileStat["0m"] > 1 || tileStat["0p"] > 1 || tileStat["0s"] > 1 ) {
        return "FAIL";
    }

    // check num of 5m/5p/5s
    if (tileStat["5m"] > 3 || tileStat["5p"] > 3 || tileStat["5s"] > 3 ) {
        return "FAIL";
    }

    // check num of others
    for (let e in tileStat) {
        if (tileStat[e] > 4) {
        return "FAIL";
       }
    }

    return "SUCCESS";
}

// 基础翻
function calPreYaku() {

};

// 符
function calFu() {

};

function countNumberOfTile(tileStr) {
    var json = {};
    for (var i=0; i<2*14; i=i+2) {
        json[tileStr.substr(i, 2)]  = (json[tileStr.substr(i, 2)] + 1) || 1;
    };
    return json;
};

// 随机整数, 闭区间[min, max]
function genRan(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min, 10);
};

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

