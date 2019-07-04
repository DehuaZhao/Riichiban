# Riichiban

立直麻将得点练习器

**Highlight**
- 牌张处理基于普遍认同的字符表示方法, 如[天鳳牌理](http://tenhou.net/2). m=萬子, p=筒子, s=索子, z=字牌, 0=赤.

## 1 立直麻将计分方法

### 1.1 一局的总得分

一局的总得分 = 手牌得点 + 立直棒 + 本场棒

其中，手牌得点为场上所有玩家需要支付点数P的和.

本应用以[天鳳规则](http://tenhou.net/man)计算.

### 1.2 支付点数

支付点数P为**基础点数α**与**和牌系数𝛽**的乘积向上取整百:

<img src="https://latex.codecogs.com/gif.latex?P=100\times\left&space;\lceil&space;\frac{\alpha&space;\times&space;\beta}{100}&space;\right&space;\rceil" title="P=100\times\left\lceil\frac{\alpha\times\beta}{100}\right\rceil"/>

**基础点数α**为: <img src="https://latex.codecogs.com/gif.latex?\alpha=f_u\times2^{f_a&plus;2}" title="\alpha=f_u\times2^{f_a+2}"/>

即以符为基础进行翻番, 最低翻两番, 达成多少翻数则再加多少番. 具体将在[1.3](#13-符)和[1.4](#14-翻)中介绍.

**和牌系数𝛽**根据和牌情况分别为:
- 𝛽 = 6, 亲家荣和时放铳者支付
- 𝛽 = 4, 子家荣和时放铳者支付
- 𝛽 = 2, 亲家自摸时各自家支付, 或子家自摸时亲加支付
- 𝛽 = 1, 子家自摸时自家支付

满贯以上的基础点数不按照以上算法进行计算, 为直接给出:

满贯以上 | 翻 符 | 基础点数
-- | -- | --
満貫 | 3飜70符及以上 \ 4飜40符及以上 \ 5飜 | 2000
跳満 | 6 \ 7飜 | 3000
倍満 | 8 \ 9 \ 10飜 | 4000
三倍満 | 11 \ 12飜 | 6000
(累计)役満 | 13飜及以上 \ 役満| 8000

### 1.3 符

<img src="https://latex.codecogs.com/gif.latex?f_u" title="f_u"/>为一副手牌的符数, 指一副牌手牌的构成和和牌的方式, 计算方式为:

<table>
   <tr>
      <td>符底</td>
      <td colspan="3" >20</td>
      <td rowspan="8">累<br>加<br>后<br>十<br>位<br>进<br>位</td>
   </tr>
   <tr>
      <td>役牌雀頭</td>
      <td>2</td>
      <td>連風</td>
      <td>x2</td>
   </tr>
   <tr>
      <td rowspan="3">槓刻子</td>
      <td rowspan="3">2</td>
      <td>么九</td>
      <td>x2</td>
   </tr>
   <tr>
      <td>暗手</td>
      <td>x2</td>
   </tr>
   <tr>
      <td>槓</td>
      <td>x4</td>
   </tr>
   <tr>
      <td>边、嵌、骑和牌</td>
      <td colspan="3">2</td>
   </tr>
   <tr>
      <td>非平和自摸</td>
      <td colspan="3">2</td>
   </tr>
   <tr>
      <td>门前荣和</td>
      <td colspan="3">10</td>
   </tr>
   <tr>
      <td>自摸平和</td>
      <td colspan="4">一律20</td>
   </tr>
   <tr>
      <td>七対子</td>
      <td colspan="4">一律25</td>
   </tr>
   <tr>
      <td>副露平和 </td>
      <td colspan="4">一律30</td>
   </tr>
</table>

手牌达到5翻及以上时, 无需数符数.

### 1.4 翻

<img src="https://latex.codecogs.com/gif.latex?f_a_" title="f_a_"/>为一副手牌的翻数, 指牌面达成的整体结构以及和牌位置, 翻种和翻数完全列举如以下:

翻数 | 翻种
-- | --
1飜 | 門前清自摸和, 立直, 平和★, 一盃口★, 断幺九, 役牌:門風牌, 役牌:場風牌, 役牌:三元牌, 槍槓〇, 嶺上開花〇, 海底摸月〇, 河底撈魚〇
2飜 | 混全帯幺九▼, 一気通貫▼, 三色同順▼, 三色同刻, 三槓子, 対々和, 三暗刻, 小三元, 混老頭, 七対子, 両立直〇
3飜 | 純全帯幺九▼, 混一色▼, 二盃口★
6飜 | 清一色▼
役満 | 天和〇, 地和〇, 大三元, 四暗刻, 四暗刻単騎, 字一色, 緑一色, 清老頭, 国士無双, 国士無双13面, 大四喜, 小四喜, 四槓子, 九蓮宝燈, 純正九蓮宝燈
懸賞 | 各1飜: ドラ, 赤ドラ, 裏ドラ, 一発〇

▼ = 副露减1翻 (食い下がりあり) / ★ = 门清限定 (門前のみ) / 〇 = 与和牌位置有关的翻种本应用不作考察.

## 2 术语及对应的变量名

主要以日文罗马字命变量名, 少量以英文翻译命名.

日文 | 中文 | 日文罗马字 | 英文翻译
-- | -- | -- | --
麻将 | 麻将 | mahjong
手牌 | 手牌 | tehai
一飜縛り | 一翻束 | iifanshibari
リーチ | 立直 | riichi
飜 | 翻 | han
役 | 役 | yaku
符 | 符 | fu
符底 | 符底 | fuutei
チー | 吃 | chii
ポン | 碰 | pon
カン | 杠 | kan
刻 | 刻 | kou
ドラ | 悬赏 / 朵拉 | dora
赤ドラ | 赤牌 | akadora | red rora
満貫 | 满贯 | mangan
二盃口 | 两杯口 | ryanpeikou
七対子| 七对子 | chiitoitsu
ツモ | 自摸 | tsumo | self-draw win
ロン | 荣 | ron | discard win
副露 | 副露 | fuuro | opened hand / call
門前 | 门清 | menzen | concealed hand
面子 | 面子 | mentsu
明刻 | 明刻 | minkou | open triplet
暗刻 | 暗刻 | ankou | closed triplet
明槓 | 明槓 | minkan | open set
暗槓 | 暗槓 | ankan | closed set
順子 | 順子 | shuntsu | run
対子 | 对子 | toitsu | pair
両面 | 两面 | ryanmen
嵌張 | 嵌张 | kanchan
辺張 | 边张 | penchan
単騎 | 单骑 | kanki
双碰 | 双碰 | shanpon
親 | 亲 | oya | parent | dealer
子 | 子 | ko | child | non-dealer
場風 | 场风 | bakaze | round wind
自風 | 自风 | jikaze | seat wind
客風 | 客风 | otakaze
本場 | 本场 | honba
点棒 | 点棒 | tenbou | point stick
雀頭 | 雀头 | jantou
数牌 | 数牌 | suupai | suit tile
萬子 | 万 | manzu | crak tile
筒子 | 筒| pinzu | dot tile
索子 | 条(索) | souzu | bamboo tile
風牌 | 风牌 | kazehai | wind tile
東 | 东 | ton | east
南 | 南 | nan | south
西 | 西 | shaa | west
北 | 北 | pei | north
三元牌 | 三元牌 | sangenpai | dragon tile
發 | 发 | hatsu | green dragon
中 | 中 | chun | red dragon
白 | 白 | haku | white dragon
 | | |
門前清自摸和 | 门清自摸和 | menzenchintsumo | Self-pick
断幺九 | 断幺九 | tanyaochuu | all simples
役牌 | 役牌 | yakuhai | value triplet set
清老头 | 清老头 | chinroutou | all termainals
混老头 | 混老头 | honroutou | all terminals and honors
純全帯么九 | 纯全带幺九 | junchan | terminal in each set
混全帯么九 | 混全带么九 | chantai | terminal or honor in each set
小三元 | 小三元 | shousangen | little three dragons
大三元 | 大三元 | daisangen | big three dragons
小四喜 | 小四喜 | shousuushii | little four winds
大四喜 | 大四喜 | daisuushii | big four winds
平和 | 平和 | pinfu | flat hand
一盃口 | 一杯口 | iipeikou | double sequence
二盃口 | 二杯口 | ryanpeikou | twice double sequence
三色同順 | 三色同顺 | sanshokudoujun | triple sequence
一気通貫 | 一气通贯 | ikkitsuukan | straight
清一色 | 清一色 | chinitsu | pure flush
混一色 | 混一色 | honitsu | mixed flush
字一色 | 字一色 | tsuuiisou | all honor
緑一色 | 绿一色 | ryuuiisou | all green
九蓮宝燈 | 九莲宝灯 | chuurenpoutou | nine gates
対々和 | 对对和 | toitoi | all triplet
四暗刻 | 四暗刻 | suuankou | four concealed triplets
三色同刻 | 三色同刻 | sanshokudoukou | three colour triplets
三暗刻 | 四暗刻 | sanankou | three concealed triplets
