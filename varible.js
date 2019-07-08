const shuntsu = ['1m2m3m', '2m3m4m', '3m4m5m', '4m5m6m', '5m6m7m',
                '6m7m8m', '7m8m9m', '3m4m0m', '4m0m6m', '0m6m7m',

                '1p2p3p', '2p3p4p', '3p4p5p', '4p5p6p', '5p6p7p',
                '6p7p8p', '7p8p9p', '3p4p0p', '4p0p6p', '0p6p7p',

                '1s2s3s', '2s3s4s', '3s4s5s', '4s5s6s', '5s6s7s',
                '6s7s8s', '7s8s9s', '3s4s0s', '4s0s6s', '0s6s7s'];

const koutsu = ['1m1m1m', '2m2m2m', '3m3m3m', '4m4m4m', '5m5m5m',
                '6m6m6m', '7m7m7m', '8m8m8m', '9m9m9m', '5m0m5m',

                '1p1p1p', '2p2p2p', '3p3p3p', '4p4p4p', '5p5p5p',
                '6p6p6p', '7p7p7p', '8p8p8p', '9p9p9p', '5p0p5p',

                '1s1s1s', '2s2s2s', '3s3s3s', '4s4s4s', '5s5s5s',
                '6s6s6s', '7s7s7s', '8s8s8s', '9s9s9s', '5s0s5s',

                '1z1z1z', '2z2z2z', '3z3z3z', '4z4z4z', '5z5z5z',
                '6z6z6z', '7z7z7z'];

const mentsu = shuntsu.concat(koutsu);

const toitsu = ['1m1m', '2m2m', '3m3m', '4m4m', '5m5m',
                '6m6m', '7m7m', '8m8m', '9m9m', '5m0m',

                '1p1p', '2p2p', '3p3p', '4p4p', '5p5p',
                '6p6p', '7p7p', '8p8p', '9p9p', '5p0p',

                '1s1s', '2s2s', '3s3s', '4s4s', '5s5s',
                '6s6s', '7s7s', '8s8s', '9s9s', '5s0s',

                '1z1z', '2z2z', '3z3z', '4z4z', '5z5z',
                '6z6z', '7z7z'];

const man    = ['1m', '2m', '3m', '4m' ,'5m', '6m', '7m', '8m', '9m', '0m'];
const pin    = ['1p', '2p', '3p', '4p' ,'5p', '6p', '7p', '8p', '9p', '0p'];
const suo    = ['1s', '2s', '3s', '4s' ,'5s', '6s', '7s', '8s', '9s', '0s'];
const kaze   = ['1z', '2z', '3z', '4z'];
const sangen = ['5z', '6z', '7z'];

const allTiles = man.concat(pin, suo, kaze, sangen);

const kazekanji = ["東", "南", "西", "北"];
