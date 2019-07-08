function start() {
    let handInfo = {
        bakaze: genKaze("Ba"), // 场风
        jikaze: genKaze("Ji"), // 自风
        honba: genRan(0, 5),   // 几本场
        riichibou: genRan(0, 2), // 立直棒个数
        //winHand: genWinHand(), // 赢牌手牌
        winHand: ["3s3s3s","4m5m6m","5p5p5p","6z6z6z","3m3m"],
        winTile: genWinTile(), // 和张 pending:暂未和副露关联
        menzen: true, // 门清, 先假设门清为true, 检查一番束和门清nomi
        tsumo: false,
        riichi: false,
        yaku: [],
        yakuman: [],
        // doras:
    };

    let totalPoint = calPoint(handInfo); // 计算目前手牌翻
    console.log("总分", totalPoint)
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

    handInfo.totalPoint = totalPoint;
    handInfo.winHandJson = winHandJson;
    return handInfo;
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
    let preYaku = handInfo.yaku;
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
    handInfo.riichibou += handInfo.riichi; // 有立直的话立直棒至少为1

    // let doraNum = countDora(handInfo.winHand);
    handInfo.yaku = []; //清空预算役
    runYaku(handInfo);
    console.log("真实役:"+JSON.stringify(handInfo.yaku));
    console.log("*********")

    handInfo.fu = calFu(handInfo);

    let totalPoint = calTotalPoint(handInfo);

    return totalPoint;
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

function calFu(handInfo) {
    let yakuhai = sangen.concat(handInfo.bakaze, handInfo.jikaze);
    let re_yaku = new RegExp(yakuhai.join('|'), "g");

    // 检查平和形
    let pinfu = false;
    if (handInfo.winHand.join('').match(re_yaku) == null) {
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
        // 平和形的符
        if (handInfo.menzen == true && handInfo.tsumo == true) {
            return 20; // 自摸平和 一律30符
        } else {
            return 30; // 平和荣和\平和形副露和 一律30符
        }
    }
    else {
        // 非平和形的符
        let fuutei = 20; // 符底
        let tsumoFu = handInfo.tsumo ? 2 : 0; // 自摸符
        let menzenronFu = handInfo.menzen ? 10 : 0; // 门前加符

        let jantouFu = 2 * yakuhai.reduce(
            (acc, cur) => (handInfo.winHand[4].substr(0,2) == cur) ? (acc + 1) : (acc + 0)
            , 0
        ); // 雀头符

        let koutsuFu = handInfo.winHand.reduce(function (acc, cur, ind) {
            let digit = cur.match(/\d/g);
            if (digit[0] == digit[2]) {
                acc += 2 * (cur.match(/[19z]/g) !== null ? 2 : 1)
                        * (handInfo.fuuroAt.indexOf(ind) < 0 ? 2 : 1);
            }
            return acc;
        }, 0); // 杠刻符, 未考虑杠

        // 边嵌骑符
        let kanki = handInfo.winTile[0] == 4; // 单骑
        let winMentsu = handInfo.winHand[handInfo.winTile[0]];
        let digit = winMentsu.match(/\d/g);
        let kanchan = false; // 嵌张
        let penchan = false; // 边张
        if (digit[0] !== digit[2]) {
            kanchan = handInfo.winTile[1] == 1;
            penchan = handInfo.winTile[1] == 2 && (digit[2] == 3 || 7);
        }
        let penkankiFu = (kanki || kanchan || penchan) ? 2 : 0;

        return 10 * Math.ceil((fuutei + tsumoFu + menzenronFu + jantouFu + koutsuFu + penkankiFu) / 10);
    }
};

function calTotalPoint(handInfo) {
    let fu = handInfo.fu;
    let han = 0;
    let alpha = 0;
    let beta = 0;
    let point = 0;

    if (handInfo.yakuman.length > 0) { // 役满
        point = handInfo.jikaze == '1z' ?
                48000 * handInfo.yakuman.length : 32000 * handInfo.yakuman.length;
    } else { // 非役满
        han = handInfo.yaku.reduce(function (acc, cur) {
            acc += parseInt(Object.values(cur), 10);
            return acc;
        }, 0)

        console.log(han, fu)

        if (han >= 13) { // 累积役满
            point = handInfo.jikaze == '1z' ? 48000 : 32000;
        } else if (han >= 11) { // 三倍满
            point = handInfo.jikaze == '1z' ? 36000 : 24000;
        } else if (han >= 8) { // 倍满
            point = handInfo.jikaze == '1z' ? 24000 : 16000;
        } else if (han >= 6) { // 跳满
            point = handInfo.jikaze == '1z' ? 18000 : 12000;
        } else if (han == 5 ||
                   han == 4 && fu >= 40 ||
                   han == 3 && fu >= 70) { // 满贯
            point = handInfo.jikaze == '1z' ? 12000 : 8000;
        } else {
            alpha = fu * Math.pow(2, han + 2);
            if (handInfo.jikaze == '1z') {
                if (handInfo.tsumo) {
                    beta = 2;
                    point = 3 * 100 * Math.ceil(alpha * beta / 100)
                } else {
                    beta = 6;
                    point = 100 * Math.ceil(alpha * beta / 100)
                } // 亲家自摸2*3家, 荣和6
            } else {
                if (handInfo.tsumo) {
                    beta = 1;
                    point = 2 * 100 * Math.ceil(alpha * beta / 100)
                            + 100 * Math.ceil(alpha * 2 * beta / 100)
                } else {
                    beta = 4;
                    point = 100 * Math.ceil(alpha * beta / 100)
                } // 子家自摸1*2子家+2*1亲家, 荣和4
            }
        }
    } // end non-yakuman

    console.log("得点" + point)
    return point + handInfo.honba * 300 + handInfo.riichibou * 1000;
}
