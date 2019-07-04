function start() {
    let handInfo = {
        bakaze: genKaze("Ba"), // 场风
        jikaze: genKaze("Ji"), // 自风
        honba: genRan(0, 5),   // 几本场
        riichibou: genRan(0, 2), // 立直棒个数
        winHand: genWinHand(), // 赢牌手牌
        // winHand: ["3p4p5p","1p1p1p","4m5m6m","6m7m8m","5p5p"],
        winTile: genWinTile(), // 和张
        menzen: true, // 门清, 先假设门清为true, 检查一番束和门清nomi
        tsumo: false,
        riichi: false,
        yaku: [],
        yakuman: [],
        // doras:
    };

    let prePoint = calPoint(handInfo); // 计算目前手牌翻
    console.log(JSON.stringify(handInfo));
    console.log("*********")

    // 只传递了手牌编码过去, 其他都未包含
    let winHandTiles = handInfo.winHand; // e.g. ["4s4s4s", "3m3m3m", "0m6m7m", "6p7p8p", "9p9p"]
    let winHandJson = [];
    for (let j=0; j < 2*14; j = j+2) {
        winHandJson.push(JSON.parse(
            '{"tileCode": ' + '"' + winHandTiles.join('').substr(j, 2) + '"}'
        ));
    }

    return winHandJson;
}

// 随机场\自风
function genKaze(kazeType) {
    let maxKaze = kazeType == "Ba" ? 1 : kaze.length -1;
    return kaze[genRan(0, maxKaze)];
}

// 生成手牌
function genWinHand() {
    do {
        var hand = [];
        for (let i=0; i<4; i++) {
            hand.push(mentsu[genRan(0, mentsu.length - 1)]);
        }
        hand.push(toitsu[genRan(0, toitsu.length - 1)]);
    }
    while (authHand(hand) == "FAIL");

    return hand;
}

// 生成和张
function genWinTile() {
    let winOn = genRan(0, 4); // 在哪一组面子或雀头上赢牌
    let winAt = (winOn != 4) ? genRan(0, 2) : 0; //赢哪张牌

    return [winOn, winAt];
}

// 生成朵拉
function genDora() {
    //let dora = genRan()
    //return
};

// 生成副露数位置
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

// 计算手牌点数
function calPoint(handInfo) {
    runYaku(handInfo);
    let preYaku = handInfo.yaku
    console.log("预算:"+JSON.stringify(preYaku));
    console.log("*********")

    if (preYaku.length > 0) {
        if (menzennomi(preYaku)) {
            handInfo.fuuro = false;
            handInfo.fuuroAt = [];
            handInfo.riichi = genRan(0, 1);
            handInfo.tsumo = genRan(0, 1);
        }
        else {
            handInfo.fuuro = genRan(0, 1);
            handInfo.riichi = handInfo.fuuro ? false : genRan(0, 1);
            handInfo.tsumo = genRan(0, 1);
            if (handInfo.fuuro) {
                handInfo.fuuroAt = genFuuro();
            } else {
                handInfo.fuuroAt = [];
            }
        }
    }
    else {
        handInfo.fuuro = false;
        handInfo.fuuroAt = [];
        handInfo.riichi = genRan(0,1);
        handInfo.tsumo = handInfo.riichi ? genRan(0,1) : true;
    }

    handInfo.menzen = !handInfo.fuuro;

    // let doraNum = countDora(handInfo.winHand);
    runYaku(handInfo);
    console.log("真实役:"+JSON.stringify(handInfo.yaku));
    console.log("*********")

    handInfo.fu = calFu(handInfo);

    return calTotalPoint(handInfo);
}

// 检查tile是否合法
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

// 遍历役钟
function runYaku(handInfo) {
    menzentsumo(handInfo);
    riichi(handInfo);
    tanyaochuu(handInfo);
    yakuhai(handInfo);
    chinroutou(handInfo);
    honroutou(handInfo);
    junchan(handInfo);
    chantai(handInfo);
    shousangen(handInfo);
    daisangen(handInfo);
    shousuushii(handInfo);
    daisuushii(handInfo);
    pinfu(handInfo);
    sanshokudoujun(handInfo);
    peikou(handInfo);
    ikki(handInfo);
    chinitsu(handInfo);
    honitsu(handInfo);
    tsuuiisou(handInfo);
    ryuuiisou(handInfo);
    chuurenpoutou(handInfo);
    toitoi(handInfo);
    suuankou(handInfo);
    sanshokudoukou(handInfo);
    // sanankou(handInfo);
};

// 是否有门清限定 ture/false
function menzennomi(preYaku) {
    // 只有一翻 而且该翻是门清nomi的
    let menzennomi = ["pinfu", "iipeikou", "ryanpeikou"];
    if (preYaku.length == 1) {
        let yakuName = Object.keys(preYaku[0]);
        if (menzennomi.indexOf(yakuName[0]) >= 0) {
            console.log("menzennomi " + true)
            return true;
        }
    }
    console.log("menzennomi " + false)
    return false;
}

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


