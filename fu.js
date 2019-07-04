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

    return point + handInfo.honba * 300 + handInfo.riichibou * 1000;
}
