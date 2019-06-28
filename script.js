function start() {
    let handInfo = {
        bakaze : genKaze("Ba"), // 场风
        jikaze : genKaze("Ji"), // 自风
        honba : genRan(0, 5),   // 几本场
        riichibou : genRan(0, 2), // 立直棒个数
        winHand : genWinHand(), // 赢牌手牌
        winTile : genWinTile(), // 和张
    };

    let point = calPoint(handInfo); // 计算目前手牌翻
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

    let preYaku = calPreYaku(handInfo)

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

    // check num of akadora,
    if (tileStat["0m"] > 1 || tileStat["0p"] > 1 || tileStat["0s"] > 1 ) {
        return "FAIL";
    }

    // check num of 5m/5p/5s
    if (tileStat["5m"] > 3 || tileStat["5p"] > 3 || tileStat["5s"] > 3 ) {
        return "FAIL";
    }

    // check num of others
    for (var val in tileStat) {
        if (tileStat[val] > 4) {
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
        json[tileStr.substr(i, 2)]  = (json[tileStr.substr(i, 2)] +1) || 1;
    };
    return json;
};

// 随机整数, 闭区间[min, max]
function genRan(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min, 10);
};





// before refactor

var winHandTiles = genWinHand(); // e.g. ["4s4s4s", "3m3m3m", "0m6m7m", "6p7p8p", "9p9p"]
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
    let tiles = genWinHand();

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
