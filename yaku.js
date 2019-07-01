let handInfo = {
    bakaze: "1z",
    honba: 2,
    jikaze: "2z",
    riichibou: 2,
    winHand: ["1s2s3s", "5z5z5z", "4p4p4p", "1z1z1z", "4s4s"],
    winTile: [3, 2],
    yaku: [],
}

const sangen = ['5z', '6z', '7z'];

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
function menzentsumo(handInfo) {
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
    for (let val in yaku_sangen) {
        let sangenName = "yakuhai: " + yaku_sangen[val];
        handInfo.yaku.push({[sangenName]: 1});
    }

    let re2 = new RegExp("(" + handInfo.bakaze + "){3}", "g");
    let yaku_bakaze = handInfo.winHand.join('').match(re2);
    for (let val in yaku_bakaze) {
        let bakazeName = "yakuhai: " + yakuhai[val];
        handInfo.yaku.push({[bakazeName]: 1});
    }

    let re3 = new RegExp("(" + handInfo.jikaze + "){3}", "g");
    let yaku_jikaze = handInfo.winHand.join('').match(re3);
    for (let val in yaku_jikaze) {
        let jikazeName = "yakuhai: " + yakuhai[val];
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
    if (handInfo.winHand.join('').match(re).length == 14 ) {
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
    if (handInfo.winHand.join('').match(re_wo) == null
        && handInfo.winHand.join('').match(re_w) !== null) {
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
        handInfo.yaku.push({junchan: 3}); //fuuru -1
    }
}

/**
 * 混全带幺九, (hon) chantai (yaochu), Terminal or honor in each set
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
    if (handInfo.winHand.join('').match(rez) !== null
        && handInfo.winHand.join('').match(re_shuntsu) !== null) {
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
        handInfo.yaku.push({chantai: 2}); //fuuru -1
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
    let re = /(5z)|(6z)|(7z)/g;
    if (handInfo.winHand.join('').match(re).length == 8 ) {
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
function daisangen(handinfo) {
    let re = /(5z)|(6z)|(7z)/g;
    if (handinfo.winhand.join('').match(re).length == 9 ) {
        handinfo.yaku.push({daisangen: "yakuman"});
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
    let re = /(1z)|(2z)|(3z)|(4z)/g
    if (handInfo.winHand.join('').match(re).length == 11 ) {
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
    let re = /(1z)|(2z)|(3z)|(4z)/g
    if (handInfo.winHand.join('').match(re).length == 12 ) {
        handInfo.yaku.push({daisuushii: "yakuman"});
    }
}
