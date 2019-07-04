function calFu(handInfo) {
    let yakuhai = sangen.concat(handInfo.bakaze, handInfo.jikaze);
    let re_yaku = new RegExp(yakuhai.join('|'), "g");

    // 平和形的符
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
        let fuutei  = 20; // 符底
        let tsumoFu  = handInfo.tsumo ? 2 : 0; // 自摸符
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
        }, 0); // 刻字符, 未考虑杠

        let penkankiFu  = 2; // 边嵌骑符

        return 10 * Math.ceil((fuutei + tsumoFu + menzenronFu + jantouFu + koutsuFu + penkankiFu) / 10);
    }
};
