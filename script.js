function start() {
    let handInfo = {
        bakaze: genKaze("Ba"), // 场风
        jikaze: genKaze("Ji"), // 自风
        honba: genRan(0, 5),   // 几本场
        riichibou: genRan(0, 2), // 立直棒个数
        winHand: genWinHand(), // 赢牌手牌
        winTile: genWinTile(), // 和张
        yaku: [],
        menzen: true,
        tsumo: true,
        fuuro: false,
        riichi: true,
        // doras:
    };

    let prePoint = calPoint(handInfo); // 计算目前手牌翻
    console.log(JSON.stringify(handInfo));
    console.log(JSON.stringify(handInfo.yaku));


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

    // if (checkIifanshibari(preYaku)) {
    //     if (checkPinfuPeikou(preYaku)) {
    //         fuuro = false;
    //         riichi = ran;
    //         tsumo = ran;
    //     }
    //     else {
    //         fuuro = ran;
    //         riichi = fuuro ? false : ran;
    //         tsumo = ran;
    //         if (fuuro) {
    //             genFuuro();
    //         }
    //     }
    // }
    // else {
    //     fuuro = false;
    //     riichi = ran;
    //     tsumo = riichi ? ran : true
    // }

    // menzen = !fuuro;

    // let doraNum = countDora(handInfo.winHand);
    // let yaku = countTotalYaku(preYaku, riichi, menzen, tsumo);
    // let fu = calFu(handInfo.winHand, handInfo.winTile, fuuro, whichFuuro, yaku);
    // return calPoint(yaku, fu, handInfo);
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
function calPreYaku(handInfo) {
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
    // sanshokudoujun(handInfo);
    // peikou(handInfo);
    // ikki(handInfo);
    // chinitsu(handInfo);
    // honitsu(handInfo);
    // tsuuiisou(handInfo);
    // ryuuiisou(handInfo);
    // chuurenpoutou(handInfo);
    // toitoi(handInfo);
    // suuankou(handInfo);
    // sanshokudoukou(handInfo);
    // sanankou(handInfo);
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

/**
 * 门前清自摸和, Menzen(chin) tsumo, All concealed
 *
 *
 * Must be concealed : yes
 * Han : 1
 */
function menzentsumo(handInfo) {
    if (handInfo.menzen && handInfo.tsumo) {
        handInfo.yaku.push({menzentsumo: 1});
    }
}

/**
 * 立直, Riichi, Ready Hand
 *
 *
 * Must be concealed : yes
 * Han : 1
 */
function riichi(handInfo) {
    if (handInfo.riichi) {
        handInfo.yaku.push({riichi: 1});
    }
}

/**
 * 断幺九, Tanyaochuu, All simples
 * Consisting only of suit tiles 2-8 (without terminal or honor tiles)
 *
 * Must be concealed : no (some rules say yes)
 * Han : 1
 */
function tanyaochuu(handInfo) {
    let re_wo = /[19z]/;
    if (handInfo.winHand.join('').match(re_wo) == null) {
        handInfo.yaku.push({tanyaochuu: 1});
    }
}

/**
 * 役牌, Yaku hai, Value triplet set
 * having a pon or kan of round wind/seat wind/dragons
 *
 * Must be concealed : no
 * Han : 1 for each
 */
function yakuhai(handInfo) {
    let re1 = new RegExp("(" + sangen.join('|') + "){3}", "g");
    let yaku_sangen = handInfo.winHand.join('').match(re1);
    for (let e in yaku_sangen) {
        let sangenName = "yakuhai: " + yaku_sangen[e];
        handInfo.yaku.push({[sangenName]: 1});
    }

    let re2 = new RegExp("(" + handInfo.bakaze + "){3}", "g");
    let yaku_bakaze = handInfo.winHand.join('').match(re2);
    for (let e in yaku_bakaze) {
        let bakazeName = "yakuhai: " + yaku_bakaze[e];
        handInfo.yaku.push({[bakazeName]: 1});
    }

    let re3 = new RegExp("(" + handInfo.jikaze + "){3}", "g");
    let yaku_jikaze = handInfo.winHand.join('').match(re3);
    for (let e in yaku_jikaze) {
        let jikazeName = "yakuhai: " + yaku_jikaze[e];
        handInfo.yaku.push({[jikazeName]: 1});
    }
}

/**
 * 清老头, Chinroutou, All termainals
 * Consisting only of terminal tiles (1 and 9)
 *
 * Must be concealed : no
 * Han : yakuman
 */
function chinroutou(handInfo) {
    let re = /[19]/g;
    let digit = handInfo.winHand.join('').match(re);
    if (digit !== null && digit.length >= 14) {
        handInfo.yaku.push({chinroutou: "yakuman"});
    }
}

/**
 * 混老头, Honroutou, All terminals and honors
 * Consisting only of terminal tiles (1 and 9) and honors
 *
 * Must be concealed : no
 * Han : 2
 */
function honroutou(handInfo) {
    let re_wo = /[2-8][mps]/g;
    let re_w  = /z/g;
    if (handInfo.winHand.join('').match(re_wo) == null &&
        handInfo.winHand.join('').match(re_w) !== null) {
        handInfo.yaku.push({honroutou: 2});
    }
}

/**
 * 纯全带幺九, Jun chan(tai yaochu), Terminal in each set
 *
 *
 * Must be concealed : no
 * Han : 3 (concealed) / 2 (open)
 */
function junchan(handInfo) {
    let re1 = /[19]/g;
    let re_shuntsu = /[28]/g;
    let junchan = false;

    for (let i = 0; i < 5; i++) {
        if (handInfo.winHand[i].match(re1) == null) {
            junchan = false;
            break;
        }
        junchan = true;
    }

    if (junchan && handInfo.winHand.join('').match(re_shuntsu) !== null) {
        handInfo.yaku.push({junchan: 3}); //fuuro -1
    }
}

/**
 * 混全带幺九, (Hon) chantai (yaochu), Terminal or honor in each set
 *
 *
 * Must be concealed : no
 * Han : 2 (concealed) / 1 (open)
 */
function chantai(handInfo) {
    let re1 = /[19]/g;
    let rez = /z/g;
    let re_shuntsu = /[28]/g;
    let chantai = false;

    // 手牌数组里必须含有字和一组顺子, 且数组里的每个元素: 不含19就含字
    if (handInfo.winHand.join('').match(rez) !== null &&
        handInfo.winHand.join('').match(re_shuntsu) !== null) {
        for (let i = 0; i < 5; i++) {
            if (handInfo.winHand[i].match(re1) == null) {
                if (handInfo.winHand[i].match(rez) == null) {
                    chantai = false;
                } else {
                    chantai = true;
                }
            } else {
                chantai = true;
            }
        }
    }

    if (chantai) {
        handInfo.yaku.push({chantai: 2}); //fuuro -1
    }
}

/**
 * 小三元, Shousangen, Little three dragons
 * Having two kous/pons/kans of dragons, plus one pair of the third.
 *
 * Must be concealed : no
 * Han : 2
 */
function shousangen(handInfo) {
    let re = /5z|6z|7z/g;
    let digit = handInfo.winHand.join('').match(re);
    if (digit !== null && digit.length == 8 ) { //没考虑杠
        handInfo.yaku.push({shousangen: 2});
    }
}

/**
 * 大三元, Daisangen, Big three dragons
 * Having one kou/pon/kan of each dragon tile.
 *
 * Must be concealed : no
 * Han : yakuman
 */
function daisangen(handInfo) {
    let re = /5z|6z|7z/g;
    let digit = handInfo.winHand.join('').match(re);
    if (digit !== null && digit.length == 9 ) { //没考虑杠
        handInfo.yaku.push({daisangen: "yakuman"});
    }
}

/**
 * 小四喜, Shousuushii, Little four winds
 * Having three kous/pons/kans of winds, plus a pair of the fourth.
 *
 * Must be concealed : no
 * Han : yakuman
 */
function shousuushii(handInfo) {
    let re = /1z|2z|3z|4z/g;
    let digit = handInfo.winHand.join('').match(re);
    if (digit !== null && digit.length == 11 ) { //没考虑杠
        handInfo.yaku.push({shousuushii: "yakuman"});
    }
}

/**
 * 大四喜, Daisuushii, Big four winds
 * Having one kou/pon/kan of each wind tile.
 *
 * Must be concealed : no
 * Han : yakuman
 */
function daisuushii(handInfo) {
    let re = /1z|2z|3z|4z/g;
    let digit = handInfo.winHand.join('').match(re);
    if (digit !== null && digit.length == 12 ) { //没考虑杠
        handInfo.yaku.push({daisuushii: "yakuman"});
    }
}

/**
 * 平和, Pinfu, Flat hand
 *
 * Must be concealed : yes
 * Han : 1
 */
function pinfu(handInfo) {
    let yakuhai = sangen.concat(handInfo.bakaze, handInfo.jikaze);
    let re_wo = new RegExp(yakuhai.join('|'), "g");
    let pinfu = false;

    if (handInfo.winHand.join('').match(re_wo) == null && handInfo.menzen == true) {
        for (let i=0; i<4; i++) {
            let digit = handInfo.winHand[i].match(/\d/g);
            if (digit[0] == digit[2]) {
                pinfu = false;
                break;
            }
            pinfu = true;
        }
    }

    if (pinfu) {
        handInfo.yaku.push({pinfu: 1});
    }
}

// /**
//  * 三色同顺, Sanshoku doujun, Triple sequence
//  *
//  * Must be concealed : no
//  * Han : 2 (concealed) / 1 (open)
//  */
// function sanshokudoujun(handInfo) {
//     let storedShuntsu = [];
//     let numOfDoujun = 0;
//     let winHand = handInfo.winHand;
//     for (let i=0; i<winHand.length; i++) {
//         winHand[i] = winHand[i].replace(/0/g, '5');
//     }

//     for (let i=0; i<4; i++) {
//         let mentsu = winHand[i];
//         let digit = mentsu.match(/\d/g);
//         if (digit[0] !== digit[2]) {
//             for (let j=0; j<storedShuntsu.length; j++) {
//                 if (storedShuntsu[j] !== mentsu &&
//                     storedShuntsu[j].match(/\d/g).join('') == digit.join('')) {
//                     numOfDoujun += 1;
//                 }
//             }
//             if (storedShuntsu.indexOf(mentsu) < 0) {
//                 storedShuntsu.push(mentsu);
//             }
//         }
//     }

//     if (numOfDoujun >= 3) {
//         handInfo.yaku.push({sanshokudoujun: 2}); // fuuro -1
//     }
// }

// /** 一杯口, Iipeikou, Double sequence
//  *
//  * Must be concealed : yes
//  * Han : 1
//  *
//  * 二杯口, ryanpeikou, Twice double sequence
//  *
//  * Must be concealed : yes
//  * Han : 3
//  */
// function peikou(handInfo) {
//     let peikou = 0;
//     let winHand = handInfo.winHand;
//     for (let i=0; i<winHand.length; i++) {
//         winHand[i] = winHand[i].replace(/0/g, '5');
//     }

//     let countedMentsu = winHand.reduce(function (acc, cur) {
//         acc[cur] = (acc[cur] + 1) || 1;
//         return acc;
//     }, {});

//     for (let e in countedMentsu) {
//         if (countedMentsu[e] == 2) {
//             peikou += 1;
//         }
//     }

//     if (peikou == 1) {
//         handInfo.yaku.push({iipeikou: 1}); //menzen
//     }

//     if (peikou == 2) {
//         handInfo.yaku.push({ryanpeikou: 3}); //menzen
//     }
// }

// /**
//  * 一气通贯, Ikkitsuukan (/ Ikki / Ittsuu), Straight
//  *
//  * Must be concealed : no
//  * Han : 2 (concealed) / 1 (open)
//  */
// function ikki(handInfo) {
//     let ikki = false;
//     let winHand = handInfo.winHand.pop();
//     for (let i=0; i<winHand.length; i++) {
//         winHand[i] = winHand[i].replace(/0/g, '5');
//     }

//     let sortedMentsu = winHand.reduce(function (acc, cur) {
//         let digit = cur.match(/\d/g).join('');
//         let type  = cur.match(/[mps]/);
//         if (!acc[type]) {
//             acc[type] = [];
//         }
//         acc[type].push(digit);
//         return acc;
//     }, {});

//     for (let e in sortedMentsu) {
//         if (sortedMentsu[e].indexOf('123') >= 0 &&
//             sortedMentsu[e].indexOf('456') >= 0 &&
//             sortedMentsu[e].indexOf('789') >= 0) {
//             ikki = true;
//         }
//     }

//     if (ikki) {
//         handInfo.yaku.push({ikkitsuukan: 2}); //fuuro -1
//     }
// }

// /**
//  * 清一色, Chinitsu, Pure flush
//  *
//  * Must be concealed : no
//  * Han : 6 (concealed) / 5 (open)
//  */
// function chinitsu(handInfo) {
//     let winHand = handInfo.winHand.join('');
//     if (winHand.match(/[mpz]/g) == null ||
//         winHand.match(/[msz]/g) == null ||
//         winHand.match(/[spz]/g) == null) {
//             handInfo.yaku.push({chinitsu: 6}); //fuuro -1
//     }
// }

// /**
//  * 混一色, Honitsu, Mixed flush
//  *
//  * Must be concealed : no
//  * Han : 3 (concealed) / 2 (open)
//  */
// function honitsu(handInfo) {
//     let winHand = handInfo.winHand.join('');
//     if (winHand.match(/z/g) !== null && (
//         winHand.match(/[mp]/g) == null ||
//         winHand.match(/[ms]/g) == null ||
//         winHand.match(/[sp]/g) == null)) {
//         handInfo.yaku.push({honitsu: 3}); //fuuro -1
//     }
// }

// /**
//  * 字一色, Tsuuiisou, All honor
//  *
//  * Must be concealed : no
//  * Han : yakuman
//  */
// function tsuuiisou(handInfo) {
//     let re = /z/g;
//     if (handInfo.winHand.join('').match(re).length >= 14) {
//         handInfo.yaku.push({tsuuiisou: "yakuman"});
//     }
// }

// /**
//  * 绿一色, Ryuuiisou, All green
//  *
//  * Must be concealed : no
//  * Han : yakuman
//  */
// function ryuuiisou(handInfo) {
//     let re_wo = /[^23468]s|[^6]z/g;
//     if (handInfo.winHand.join('').match(re_wo) == null) {
//         handInfo.yaku.push({ryuuiisou: "yakuman"});
//     }
// }

// /**
//  * 九莲宝灯, Chuuren poutou, Nine gates
//  *
//  * Must be concealed : yes
//  * Han : yakuman
//  */
// function chuurenpoutou(handInfo) {
//     let huurenpoutou = false;
//     let base = "1112345678999";
//     let winHand = handInfo.winHand;
//     for (let i=0; i<winHand.length; i++) {
//         winHand[i] = winHand[i].replace(/0/g, '5');
//     }
//     let digit = winHand.join('').match(/\d/g).sort().join('');

//     if (winHand.join('').match(/[mpz]/g) == null ||
//         winHand.join('').match(/[msz]/g) == null ||
//         winHand.join('').match(/[spz]/g) == null) {
//         for (let i=1; i<10; i++) {
//             if (base.concat(i.toString()).sort() == digit) {
//                 huurenpoutou = true;
//                 break;
//             }
//             huurenpoutou = false;
//         }
//     }

//     if (huurenpoutou) {
//         handInfo.yaku.push({chuurenpoutou: "yakuman"}); // menzen
//     }
// }

// /**
//  * 对对和, Toitoi (hou), All triplet
//  *
//  * Must be concealed : must be open
//  * Han : 2
//  */
// function toitoi(handInfo) {
//     let toitoi = false;

//     for (let i=0; i<4; i++) {
//         let digit = handInfo.winHand[i].match(/\d/g);
//         if (digit[0] !== digit[2]) {
//             toitoi = false;
//             break;
//         }
//         toitoi = true;
//     }

//     if (toitoi && handInfo.fuuro) {
//         handInfo.yaku.push({toitoi: 2});
//     }
// }

// /**
//  * 四暗刻, Suuankou, Four concealed triplets
//  *
//  * Must be concealed : yes
//  * Han : yakuman
//  */
// function suuankou(handInfo) {
//     let toitoi = false;

//     for (let i=0; i<4; i++) {
//         let digit = handInfo.winHand[i].match(/\d/g);
//         if (digit[0] !== digit[2]) {
//             toitoi = false;
//             break;
//         }
//         toitoi = true;
//     }

//     if (toitoi && handInfo.menzen) {
//         handInfo.yaku.push({suuankou: "yakuman"});
//     }
// }

// /**
//  * 三色同刻, Sanshoku doukou, Three colour triplets
//  *
//  * Must be concealed : no
//  * Han : 2
//  */
// function sanshokudoukou(handInfo) {
//     let winHand = handInfo.winHand.pop();
//     for (let i=0; i<winHand.length; i++) {
//         winHand[i] = winHand[i].replace(/0/g, '5');
//     }

//     let storedKoutsu = winHand.reduce(function (acc, cur) {
//         let digit = cur.match(/\d/g);
//         let type  = cur.match(/[mps]/);
//         if (digit[0] == digit[2]) {
//             acc[type] = digit.join('');
//         }
//         return acc;
//     }, {});

//     if (storedKoutsu["m"] == storedKoutsu["p"] &&
//         storedKoutsu["p"] == storedKoutsu["s"]) {
//         handInfo.yaku.push({sanshokudoukou: 2});
//     }

// }

// /**
//  * 三暗刻, Sanankou, Three concealed triplets
//  *
//  * Must be concealed : no
//  * Han : 2
//  */
// function sanankou(handInfo) {
//     let sanankou = false;
//     let winHand = handInfo.winHand.pop();
//     for (let i=0; i<winHand.length; i++) {
//         winHand[i] = winHand[i].replace(/0/g, '5');
//     }

//     if (handInfo.fuuroAt.length < 2) {
//         let storedKoutsu = winHand.reduce(function (acc, cur, ind) {
//             let digit = cur.match(/\d/g);
//             if (digit[0] == digit[2]) {
//                 acc[ind] = cur;
//             }
//             return acc;
//         }, {});

//         for (let e in storedKoutsu) {
//             if ((e in handInfo.fuuroAt)) {
//                 sanankou = false;
//                 break;
//             }
//             sanankou = true;
//         }
//     }

//     if (sanankou) {
//         handInfo.yaku.push({sanankou: 2});
//     }
// }
