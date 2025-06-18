//=============================================================================
// RecollectionMode.js
// Copyright (c) 2015 rinne_grid
// This plugin is released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//
// Version
// 1.0.0 2015/12/26 公開
// 1.1.0 2016/04/19 回想一覧にサムネイルを指定できるように対応
// 1.1.1 2016/05/03 セーブデータ20番目のスイッチが反映されない不具合を修正
//                  セーブデータ間のスイッチ共有オプション
//                  (share_recollection_switches)を追加
// 1.1.2 2016/05/09 回想用のCGリストのキーを数字から文字列に変更
// 1.1.3 2016/11/23 セーブデータが増えた場合にロード時間が長くなる問題を解消
// 1.1.4 2016/12/23 CG閲覧時にクリック・タップで画像送りができるよう対応
// 1.1.5 2017/01/26 CG・シーンで一部サムネイルが表示されない問題を解消
//=============================================================================

/*:ja
 * @plugindesc 回想モード機能を追加します。
 * @author rinne_grid
 *
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 */

//-----------------------------------------------------------------------------
// ◆ プラグイン設定
//-----------------------------------------------------------------------------
var rngd_recollection_mode_settings = {
    //---------------------------------------------------------------------
    // ★ 回想モードで再生するBGMの設定をします
    //---------------------------------------------------------------------
    "rec_mode_bgm": {
        "bgm": {
            "name": "M06_Bathhouse ",
            "pan": 0,
            "pitch": 100,
            "volume": 90
        }
    },
    //---------------------------------------------------------------------
    // ★ 回想CG選択ウィンドウの設定を指定します
    //---------------------------------------------------------------------
    "rec_mode_window": {
        "x": 260,
        "y": 180,
        "recollection_title": "Recall",
        "str_select_recollection": "View Recollection",
        "str_select_cg": "View CG",
        "str_select_back_title": "Title"
    },
    //---------------------------------------------------------------------
    // ★ 回想リストウィンドウの設定を指定します
    //---------------------------------------------------------------------
    "rec_list_window": {
        // 1画面に表示する縦の数
        "item_height": 4,
        // 1画面に表示する横の数
        "item_width": 4,
        // 1枚のCGに説明テキストを表示するかどうか
        "show_title_text": true,
        // タイトルテキストの表示位置(left:左寄せ、center:中央、right:右寄せ）
        "title_text_align": "center",
        // 閲覧したことのないCGの場合に表示するピクチャファイル名
        "never_watch_picture_name": "回想/never_watch_picture",
        // 閲覧したことのないCGのタイトルテキスト
        "never_watch_title_text": "？？？"
    },
    //---------------------------------------------------------------------
    // ★ 回想用のCGを指定します
    //---------------------------------------------------------------------
    "rec_cg_set": {
        "1": {
            "title": "第一部ゴブリン敗北",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1201,
            "switch_id": 1301,
            "thumbnail": "回想/第一部ゴブリン"
        },
        "2": {
            "title": "第一部オーク敗北",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1202,
            "switch_id": 1302,
            "thumbnail": "回想/第一部オーク"
        },
        "3": {
            "title": "第一部チンピラ敗北",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1203,
            "switch_id": 1303,
            "thumbnail": "回想/第一部チンピラ"
        },
        "4": {
            "title": "エリカ輪姦",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1204,
            "switch_id": 1304,
            "thumbnail": "回想/エリカ輪姦"
        },
        "5": {
            "title": "ドッヂ敗北",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1205,
            "switch_id": 1305,
            "thumbnail": "回想/ドッヂ敗北"
        },
        "6": {
            "title": "相続薬取引敗北",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1206,
            "switch_id": 1306,
            "thumbnail": "回想/相続薬取引敗北"
        },
        "7": {
            "title": "通り魔ジョン敗北",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1207,
            "switch_id": 1307,
            "thumbnail": "回想/通り魔ジョン敗北"
        },
        "8": {
            "title": "ゴブリン敗北凌辱",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1208,
            "switch_id": 1308,
            "thumbnail": "回想/ゴブリン敗北凌辱"
        },
        "9": {
            "title": "マリルーと凌辱",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1209,
            "switch_id": 1309,
            "thumbnail": "回想/マリルーと凌辱"
        },
        "10": {
            "title": "ゴブリン苗床レイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1210,
            "switch_id": 1310,
            "thumbnail": "回想/ゴブリン苗床レイプ"
        },
        "11": {
            "title": "ゴブリン苗床出産",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1211,
            "switch_id": 1311,
            "thumbnail": "回想/ゴブリン苗床出産"
        },
        "12": {
            "title": "浴場強姦１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1212,
            "switch_id": 1312,
            "thumbnail": "回想/浴場強姦１"
        },
        "13": {
            "title": "浴場強姦２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1213,
            "switch_id": 1313,
            "thumbnail": "回想/浴場強姦２"
        },
        "14": {
            "title": "浴場売春１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1214,
            "switch_id": 1314,
            "thumbnail": "回想/浴場売春１"
        },
        "15": {
            "title": "浴場売春２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1215,
            "switch_id": 1315,
            "thumbnail": "回想/浴場売春２"
        },
        "16": {
            "title": "浴場売春３",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1216,
            "switch_id": 1316,
            "thumbnail": "回想/浴場売春３"
        },
        "17": {
            "title": "トイレスタリオン",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1217,
            "switch_id": 1317,
            "thumbnail": "回想/トイレスタリオン"
        },
        "18": {
            "title": "ギー敗北",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1218,
            "switch_id": 1318,
            "thumbnail": "回想/ギー敗北"
        },
        "19": {
            "title": "ロドリグ診察",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1219,
            "switch_id": 1319,
            "thumbnail": "回想/ロドリグ診察"
        },
        "20": {
            "title": "ロドリグと出産",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1220,
            "switch_id": 1320,
            "thumbnail": "回想/ロドリグと出産"
        },
        "21": {
            "title": "睡眠アナル姦",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1221,
            "switch_id": 1321,
            "thumbnail": "回想/睡眠アナル姦"
        },
        "22": {
            "title": "娼館で初売春",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1222,
            "switch_id": 1322,
            "thumbnail": "回想/娼館で初売春"
        },
        "23": {
            "title": "媚薬漬けの夜",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1223,
            "switch_id": 1323,
            "thumbnail": "回想/媚薬漬けの夜"
        },
        "24": {
            "title": "ロドリグのマッサージ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1224,
            "switch_id": 1324,
            "thumbnail": "回想/ロドリグのマッサージ"
        },
        "25": {
            "title": "ディーコンの調教１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1225,
            "switch_id": 1325,
            "thumbnail": "回想/ディーコンの調教１"
        },
        "26": {
            "title": "ディーコンの調教２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1226,
            "switch_id": 1326,
            "thumbnail": "回想/ディーコンの調教２"
        },
        "27": {
            "title": "ディーコンの調教３",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1227,
            "switch_id": 1327,
            "thumbnail": "回想/ディーコンの調教３"
        },
        "28": {
            "title": "ディーコンの調教４",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1228,
            "switch_id": 1328,
            "thumbnail": "回想/ディーコンの調教４"
        },
        "29": {
            "title": "ディーコンの調教５",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1229,
            "switch_id": 1329,
            "thumbnail": "回想/ディーコンの調教５"
        },
        "30": {
            "title": "ディーコンの調教６",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1230,
            "switch_id": 1330,
            "thumbnail": "回想/ディーコンの調教６"
        },
        "31": {
            "title": "ディーコンの調教７",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1231,
            "switch_id": 1331,
            "thumbnail": "回想/ディーコンの調教７"
        },
        "32": {
            "title": "宿で出産",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1232,
            "switch_id": 1332,
            "thumbnail": "回想/宿で出産"
        },
        "33": {
            "title": "モンスターと近親相姦",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1233,
            "switch_id": 1333,
            "thumbnail": "回想/モンスターと近親相姦"
        },
        "34": {
            "title": "スラムチンピラレイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1234,
            "switch_id": 1334,
            "thumbnail": "回想/スラムチンピラレイプ"
        },
        "35": {
            "title": "浮浪者敗北１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1235,
            "switch_id": 1335,
            "thumbnail": "回想/浮浪者敗北１"
        },
        "36": {
            "title": "浮浪者敗北２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1236,
            "switch_id": 1336,
            "thumbnail": "回想/浮浪者敗北２"
        },
        "37": {
            "title": "浮浪者敗北３",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1237,
            "switch_id": 1337,
            "thumbnail": "回想/浮浪者敗北３"
        },
        "38": {
            "title": "浮浪者敗北４",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1238,
            "switch_id": 1338,
            "thumbnail": "回想/浮浪者敗北４"
        },
        "39": {
            "title": "ごろつき敗北レイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1239,
            "switch_id": 1339,
            "thumbnail": "回想/ごろつき敗北レイプ"
        },
        "40": {
            "title": "ごろつき監禁レイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1240,
            "switch_id": 1340,
            "thumbnail": "回想/ごろつき監禁レイプ"
        },
        "41": {
            "title": "ごろつき監禁出産",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1241,
            "switch_id": 1341,
            "thumbnail": "回想/ごろつき監禁出産"
        },
        "42": {
            "title": "ワーグ敗北レイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1242,
            "switch_id": 1342,
            "thumbnail": "回想/ワーグ敗北レイプ"
        },
        "43": {
            "title": "ワーグ苗床レイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1243,
            "switch_id": 1343,
            "thumbnail": "回想/ワーグ苗床レイプ"
        },
        "44": {
            "title": "ワーグ野外公開レイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1244,
            "switch_id": 1344,
            "thumbnail": "回想/ワーグ野外公開レイプ"
        },
        "45": {
            "title": "ワーグ苗床出産",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1245,
            "switch_id": 1345,
            "thumbnail": "回想/ワーグ苗床出産"
        },
        "46": {
            "title": "ピッグマン敗北",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1246,
            "switch_id": 1346,
            "thumbnail": "回想/ピッグマン敗北"
        },
        "47": {
            "title": "ピッグマン苗床出産",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1247,
            "switch_id": 1347,
            "thumbnail": "回想/ピッグマン苗床出産"
        },
        "48": {
            "title": "バーダン敗北レイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1248,
            "switch_id": 1348,
            "thumbnail": "回想/バーダン敗北レイプ"
        },
        "49": {
            "title": "バーダンと対面座位",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1249,
            "switch_id": 1349,
            "thumbnail": "回想/バーダンと対面座位"
        },
        "50": {
            "title": "ティムの脳破壊",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1250,
            "switch_id": 1350,
            "thumbnail": "回想/ティムの脳破壊"
        },
        "51": {
            "title": "バーダンに奉仕",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1251,
            "switch_id": 1351,
            "thumbnail": "回想/バーダンに奉仕"
        },
        "52": {
            "title": "バーダンと正常位",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1252,
            "switch_id": 1352,
            "thumbnail": "回想/バーダンと正常位"
        },
        "53": {
            "title": "バーダンと子供と",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1253,
            "switch_id": 1353,
            "thumbnail": "回想/バーダンと子供と"
        },
        "54": {
            "title": "バーダンとシシリア",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1254,
            "switch_id": 1354,
            "thumbnail": "回想/バーダンとシシリア"
        },
        "55": {
            "title": "カトリーヌと出産",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1255,
            "switch_id": 1355,
            "thumbnail": "回想/カトリーヌと出産"
        },
        "56": {
            "title": "カトリーヌ敗北レイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1256,
            "switch_id": 1356,
            "thumbnail": "回想/カトリーヌ敗北レイプ"
        },
        "57": {
            "title": "オーク敗北レイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1257,
            "switch_id": 1357,
            "thumbnail": "回想/オーク敗北レイプ"
        },
        "58": {
            "title": "オーク公開レイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1258,
            "switch_id": 1358,
            "thumbnail": "回想/オーク公開レイプ"
        },
        "59": {
            "title": "オークバッドエンド",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1259,
            "switch_id": 1359,
            "thumbnail": "回想/オークバッドエンド"
        },
        "60": {
            "title": "スライム敗北",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1260,
            "switch_id": 1360,
            "thumbnail": "回想/スライム敗北"
        },
        "61": {
            "title": "スライム排泄凌辱",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1261,
            "switch_id": 1361,
            "thumbnail": "回想/スライム排泄凌辱"
        },
        "62": {
            "title": "ビッグスライム敗北１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1262,
            "switch_id": 1362,
            "thumbnail": "回想/ビッグスライム敗北１"
        },
        "63": {
            "title": "ビッグスライム敗北２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1263,
            "switch_id": 1363,
            "thumbnail": "回想/ビッグスライム敗北２"
        },
        "64": {
            "title": "ローパー敗北",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1264,
            "switch_id": 1364,
            "thumbnail": "回想/ローパー敗北"
        },
        "65": {
            "title": "ローパーの苗床レイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1265,
            "switch_id": 1365,
            "thumbnail": "回想/ローパーの苗床レイプ"
        },
        "66": {
            "title": "ローパーの苗床出産",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1266,
            "switch_id": 1366,
            "thumbnail": "回想/ローパーの苗床出産"
        },
        "67": {
            "title": "ローパーバッドエンド",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1267,
            "switch_id": 1367,
            "thumbnail": "回想/ローパーバッドエンド"
        },
        "68": {
            "title": "魔物スタリオン敗北１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1268,
            "switch_id": 1368,
            "thumbnail": "回想/魔物スタリオン敗北１"
        },
        "69": {
            "title": "魔物スタリオン敗北２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1269,
            "switch_id": 1369,
            "thumbnail": "回想/魔物スタリオン敗北２"
        },
        "70": {
            "title": "ゲクラン催眠１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1270,
            "switch_id": 1370,
            "thumbnail": "回想/ゲクラン催眠１"
        },
        "71": {
            "title": "ゲクラン催眠２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1271,
            "switch_id": 1371,
            "thumbnail": "回想/ゲクラン催眠２"
        },
        "72": {
            "title": "ゲクラン催眠３",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1272,
            "switch_id": 1372,
            "thumbnail": "回想/ゲクラン催眠３"
        },
        "73": {
            "title": "ゲクラン催眠４",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1273,
            "switch_id": 1373,
            "thumbnail": "回想/ゲクラン催眠４"
        },
        "74": {
            "title": "ゲクラン催眠５",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1274,
            "switch_id": 1374,
            "thumbnail": "回想/ゲクラン催眠５"
        },
        "75": {
            "title": "ゲクラン催眠６",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1275,
            "switch_id": 1375,
            "thumbnail": "回想/ゲクラン催眠６"
        },
        "76": {
            "title": "ゲクランと出産",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1276,
            "switch_id": 1376,
            "thumbnail": "回想/ゲクランと出産"
        },
        "77": {
            "title": "ゲクランバッドエンド",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1277,
            "switch_id": 1377,
            "thumbnail": "回想/ゲクランバッドエンド"
        },
        "78": {
            "title": "武器屋でアルバイト１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1278,
            "switch_id": 1378,
            "thumbnail": "回想/武器屋でアルバイト１"
        },
        "79": {
            "title": "武器屋でアルバイト２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1279,
            "switch_id": 1421,
            "thumbnail": "回想/武器屋でアルバイト２"
        },
        "80": {
            "title": "酒場でアルバイト１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1280,
            "switch_id": 1379,
            "thumbnail": "回想/酒場でアルバイト１"
        },
        "81": {
            "title": "酒場でアルバイト２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1281,
            "switch_id": 1380,
            "thumbnail": "回想/酒場でアルバイト２"
        },
        "82": {
            "title": "酒場でアルバイト３",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1282,
            "switch_id": 1381,
            "thumbnail": "回想/酒場でアルバイト３"
        },
        "83": {
            "title": "酒場でアルバイト４",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1283,
            "switch_id": 1382,
            "thumbnail": "回想/酒場でアルバイト４"
        },
        "84": {
            "title": "酒場でアルバイト５",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1284,
            "switch_id": 1383,
            "thumbnail": "回想/酒場でアルバイト５"
        },
        "85": {
            "title": "路上売春",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1285,
            "switch_id": 1384,
            "thumbnail": "回想/路上売春"
        },
        "86": {
            "title": "スラム宿屋睡眠姦１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1286,
            "switch_id": 1385,
            "thumbnail": "回想/スラム宿屋睡眠姦１"
        },
        "87": {
            "title": "スラム宿屋睡眠姦２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1287,
            "switch_id": 1386,
            "thumbnail": "回想/スラム宿屋睡眠姦２"
        },
        "88": {
            "title": "壁尻レイプA",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1288,
            "switch_id": 1387,
            "thumbnail": "回想/壁尻レイプA"
        },
        "89": {
            "title": "壁尻レイプB",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1289,
            "switch_id": 1388,
            "thumbnail": "回想/壁尻レイプB"
        },
        "90": {
            "title": "ガヌロン敗北１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1290,
            "switch_id": 1389,
            "thumbnail": "回想/ガヌロン敗北１"
        },
        "91": {
            "title": "ガヌロン敗北２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1291,
            "switch_id": 1390,
            "thumbnail": "回想/ガヌロン敗北２"
        },
        "92": {
            "title": "ガヌロンの呼出１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1292,
            "switch_id": 1391,
            "thumbnail": "回想/ガヌロンの呼出１"
        },
        "93": {
            "title": "ガヌロンの呼出２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1293,
            "switch_id": 1392,
            "thumbnail": "回想/ガヌロンの呼出２"
        },
        "94": {
            "title": "ガヌロンの呼出３",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1294,
            "switch_id": 1393,
            "thumbnail": "回想/ガヌロンの呼出３"
        },
        "95": {
            "title": "ガヌロンの呼出４",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1295,
            "switch_id": 1394,
            "thumbnail": "回想/ガヌロンの呼出４"
        },
        "96": {
            "title": "ガヌロンの呼出５",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1296,
            "switch_id": 1395,
            "thumbnail": "回想/ガヌロンの呼出５"
        },
        "97": {
            "title": "ボテ重ね",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1297,
            "switch_id": 1396,
            "thumbnail": "回想/ボテ重ね"
        },
        "98": {
            "title": "ガヌロンへの懇願",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1298,
            "switch_id": 1421,
            "thumbnail": "回想/ガヌロンへの懇願"
        },
        "99": {
            "title": "ガヌロンの子とセックス１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1299,
            "switch_id": 1397,
            "thumbnail": "回想/ガヌロンの子とセックス１"
        },
        "100": {
            "title": "ガヌロンの子とセックス２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1300,
            "switch_id": 1398,
            "thumbnail": "回想/ガヌロンの子とセックス２"
        },
        "101": {
            "title": "ガヌロンの子とセックス３",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1301,
            "switch_id": 1399,
            "thumbnail": "回想/ガヌロンの子とセックス３"
        },
        "102": {
            "title": "スラム娼館売春",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1302,
            "switch_id": 1400,
            "thumbnail": "回想/スラム娼館売春"
        },
        "103": {
            "title": "スラム娼館耐久ショー",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1303,
            "switch_id": 1401,
            "thumbnail": "回想/スラム娼館耐久ショー"
        },
        "104": {
            "title": "スラム娼館で出産",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1304,
            "switch_id": 1402,
            "thumbnail": "回想/スラム娼館で出産"
        },
        "105": {
            "title": "ティムとセックス１",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1305,
            "switch_id": 1403,
            "thumbnail": "回想/ティムとセックス１"
        },
        "106": {
            "title": "ティムとセックス２",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1306,
            "switch_id": 1404,
            "thumbnail": "回想/ティムとセックス２"
        },
        "107": {
            "title": "ティムとセックス３",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1307,
            "switch_id": 1405,
            "thumbnail": "回想/ティムとセックス３"
        },
        "108": {
            "title": "異教徒敗北バッドエンド",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1308,
            "switch_id": 1406,
            "thumbnail": "回想/異教徒敗北バッドエンド"
        },
        "109": {
            "title": "見せしめ磔",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1309,
            "switch_id": 1407,
            "thumbnail": "回想/見せしめ磔"
        },
        "110": {
            "title": "市警隊の気晴らし",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1310,
            "switch_id": 1408,
            "thumbnail": "回想/市警隊の気晴らし"
        },
        "111": {
            "title": "市警隊敗北",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1311,
            "switch_id": 1409,
            "thumbnail": "回想/市警隊敗北"
        },
        "112": {
            "title": "市警長とセックス",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1312,
            "switch_id": 1410,
            "thumbnail": "回想/市警長とセックス"
        },
        "113": {
            "title": "市警隊と橋の上で",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1313,
            "switch_id": 1411,
            "thumbnail": "回想/市警隊と橋の上で"
        },
        "114": {
            "title": "監獄輪姦",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1314,
            "switch_id": 1412,
            "thumbnail": "回想/監獄輪姦"
        },
        "115": {
            "title": "監獄日常レイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1315,
            "switch_id": 1413,
            "thumbnail": "回想/監獄日常レイプ"
        },
        "116": {
            "title": "監獄出産レイプ",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1316,
            "switch_id": 1414,
            "thumbnail": "回想/監獄出産レイプ"
        },
        "117": {
            "title": "ニコラと一緒に",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1317,
            "switch_id": 1415,
            "thumbnail": "回想/ニコラと一緒に"
        },
        "118": {
            "title": "ニコラと市警隊長",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1318,
            "switch_id": 1416,
            "thumbnail": "回想/ニコラと市警隊長"
        },
        "119": {
            "title": "ニコラと出産",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1319,
            "switch_id": 1417,
            "thumbnail": "回想/ニコラと出産"
        },
        "120": {
            "title": "門前の辱め",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1320,
            "switch_id": 1423,
            "thumbnail": "回想/門前の辱め"
        },
        "121": {
            "title": "オークション",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1321,
            "switch_id": 1418,
            "thumbnail": "回想/オークション"
        },
        "122": {
            "title": "第一部バッドエンド",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1322,
            "switch_id": 1419,
            "thumbnail": "回想/第一部バッドエンド"
        },
        "123": {
            "title": "第二部バッドエンド",
            "pictures": ["回想/a", "回想/b"],
            "common_event_id": 1323,
            "switch_id": 1420,
            "thumbnail": "回想/第二部バッドエンド"

        }
    },
    //---------------------------------------------------------------------
    // ★ 回想時に一時的に利用するマップIDを指定します
    //---------------------------------------------------------------------
    // 通常は何もないマップを指定します
    //---------------------------------------------------------------------
    "sandbox_map_id": 50,
    //---------------------------------------------------------------------
    // ★ 回想用スイッチをセーブデータ間で共有するかどうかを指定します
    //---------------------------------------------------------------------
    // パラメータの説明
    // true:
    //      回想用スイッチを共有します。
    //
    //      例1：セーブ1で回想スイッチ1, 2, 3がONとする
    //          ニューゲームで開始し、セーブ1を上書きする
    //          →セーブ1の回想スイッチ1, 2, 3はONのままとなる。
    //
    //      例2: セーブ1で回想スイッチ1, 2, 3がONとする
    //          セーブ1をロードし、セーブ2を保存する
    //          セーブ2で回想スイッチ1, 2, 3, 7がONとする
    //          セーブ1, セーブ2それぞれで、回想スイッチ1, 2, 3, 7がONとなる
    //
    // false:
    //      回想用スイッチを共有しません
    //
    // すべてのセーブデータを削除した場合にのみ、スイッチがリセットされます
    //---------------------------------------------------------------------
    "share_recollection_switches": false
};

function rngd_hash_size(obj) {
    var cnt = 0;
    for (var o in obj) {
        cnt++;
    }
    return cnt;
}

//-----------------------------------------------------------------------------
// ◆ Scene関数
//-----------------------------------------------------------------------------

//=========================================================================
// ■ Scene_Recollection
//=========================================================================
// 回想用のシーン関数です
//=========================================================================
function Scene_Recollection() {
    this.initialize.apply(this, arguments);
}

Scene_Recollection.prototype = Object.create(Scene_Base.prototype);
Scene_Recollection.prototype.constructor = Scene_Recollection;

Scene_Recollection.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Recollection.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this.createWindowLayer();
    this.createCommandWindow();
};

// 回想モードのカーソル
Scene_Recollection.rec_list_index = 0;

// 回想モードの再読み込み判定用 true: コマンドウィンドウを表示せず回想リストを表示 false:コマンドウィンドウを表示
Scene_Recollection.reload_rec_list = false;

Scene_Recollection.prototype.createCommandWindow = function () {

    if (Scene_Recollection.reload_rec_list) {
        // 回想モード選択ウィンドウ
        this._rec_window = new Window_RecollectionCommand();
        this._rec_window.setHandler('select_recollection', this.commandShowRecollection.bind(this));
        this._rec_window.setHandler('select_cg', this.commandShowCg.bind(this));
        this._rec_window.setHandler('select_back_title', this.commandBackTitle.bind(this));

        // リロードの場合：選択ウィンドウを非表示にする
        this._rec_window.visible = false;
        this._rec_window.deactivate();
        this.addWindow(this._rec_window);

        // 回想リスト
        this._rec_list = new Window_RecList(0, 0, Graphics.width, Graphics.height);

        // リロードの場合：回想リストを表示にする
        this._rec_list.visible = true;
        this._rec_list.setHandler('ok', this.commandDoRecMode.bind(this));
        this._rec_list.setHandler('cancel', this.commandBackSelectMode.bind(this));
        this._mode = "recollection";
        this._rec_list.activate();
        this._rec_list.select(Scene_Recollection.rec_list_index);

        this.addWindow(this._rec_list);

        // CG参照用ダミーコマンド
        this._dummy_window = new Window_Command(0, 0);
        this._dummy_window.deactivate();
        this._dummy_window.visible = false;
        this._dummy_window.setHandler('ok', this.commandDummyOk.bind(this));
        this._dummy_window.setHandler('cancel', this.commandDummyCancel.bind(this));
        this._dummy_window.addCommand('next', 'ok');
        this.addWindow(this._dummy_window);

        Scene_Recollection.reload_rec_list = false;

    } else {
        // 回想モード選択ウィンドウ
        this._rec_window = new Window_RecollectionCommand();
        this._rec_window.setHandler('select_recollection', this.commandShowRecollection.bind(this));
        this._rec_window.setHandler('select_cg', this.commandShowCg.bind(this));
        this._rec_window.setHandler('select_back_title', this.commandBackTitle.bind(this));
        this.addWindow(this._rec_window);

        // 回想リスト
        this._rec_list = new Window_RecList(0, 0, Graphics.width, Graphics.height);
        this._rec_list.visible = false;
        this._rec_list.setHandler('ok', this.commandDoRecMode.bind(this));
        this._rec_list.setHandler('cancel', this.commandBackSelectMode.bind(this));
        this._rec_list.select(Scene_Recollection.rec_list_index);
        this.addWindow(this._rec_list);

        // CG参照用ダミーコマンド
        this._dummy_window = new Window_Command(0, 0);
        this._dummy_window.deactivate();
        this._dummy_window.playOkSound = function () { }; // CGﾓｰﾄﾞの場合、OK音を鳴らさない
        this._dummy_window.visible = false;
        this._dummy_window.setHandler('ok', this.commandDummyOk.bind(this));
        this._dummy_window.setHandler('cancel', this.commandDummyCancel.bind(this));
        this._dummy_window.addCommand('next', 'ok');
        this.addWindow(this._dummy_window);
    }

};

//-------------------------------------------------------------------------
// ● 開始処理
//-------------------------------------------------------------------------
Scene_Recollection.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    this._rec_window.refresh();
    this._rec_list.refresh();
    AudioManager.playBgm(rngd_recollection_mode_settings.rec_mode_bgm.bgm);
    Scene_Recollection._rngd_recollection_doing = false;
};

//-------------------------------------------------------------------------
// ● 更新処理
//-------------------------------------------------------------------------
Scene_Recollection.prototype.update = function () {
    Scene_Base.prototype.update.call(this);

};

//-------------------------------------------------------------------------
// ● 「回想を見る」を選択した際のコマンド
//-------------------------------------------------------------------------
Scene_Recollection.prototype.commandShowRecollection = function () {
    // モードウィンドウの無効化とリストウィンドウの有効化
    this.do_exchange_status_window(this._rec_window, this._rec_list);
    this._mode = "recollection";
};

//-------------------------------------------------------------------------
// ● 「CGを見る」を選択した際のコマンド
//-------------------------------------------------------------------------
Scene_Recollection.prototype.commandShowCg = function () {
    this.do_exchange_status_window(this._rec_window, this._rec_list);
    this._mode = "cg";
};

//-------------------------------------------------------------------------
// ● 「タイトルに戻る」を選択した際のコマンド
//-------------------------------------------------------------------------
Scene_Recollection.prototype.commandBackTitle = function () {
    Scene_Recollection.rec_list_index = 0;
    SceneManager.goto(Scene_Title);
};

//-------------------------------------------------------------------------
// ● 回想orCGモードから「キャンセル」して前の画面に戻った場合のコマンド
//-------------------------------------------------------------------------
Scene_Recollection.prototype.commandBackSelectMode = function () {
    this.do_exchange_status_window(this._rec_list, this._rec_window);
};

//-------------------------------------------------------------------------
// ● 回想orCGモードにおいて、実際の回想orCGを選択した場合のコマンド
//-------------------------------------------------------------------------
Scene_Recollection.prototype.commandDoRecMode = function () {
    var target_index = this._rec_list.index() + 1;
    Scene_Recollection.rec_list_index = target_index - 1;

    if (this._rec_list.is_valid_picture(this._rec_list.index() + 1)) {
        // 回想モードの場合
        if (this._mode == "recollection") {
            Scene_Recollection._rngd_recollection_doing = true;

            DataManager.setupNewGame();
            $gamePlayer.setTransparent(255);
            this.fadeOutAll();
            // TODO: パーティを透明状態にする

            //$dataSystem.optTransparent = false;
            $gameTemp.reserveCommonEvent(rngd_recollection_mode_settings.rec_cg_set[target_index]["common_event_id"]);
            $gamePlayer.reserveTransfer(rngd_recollection_mode_settings.sandbox_map_id, 0, 0, 0);
            SceneManager.push(Scene_Map);

            // CGモードの場合
        } else if (this._mode == "cg") {
            this._cg_sprites = [];
            this._cg_sprites_index = 0;

            // シーン画像をロードする
            rngd_recollection_mode_settings.rec_cg_set[target_index].pictures.forEach(function (name) {
                // CGクリックを可能とする
                var sp = new Sprite_Button();
                sp.setClickHandler(this.commandDummyOk.bind(this));
                sp.processTouch = function () {
                    Sprite_Button.prototype.processTouch.call(this);

                };
                sp.bitmap = ImageManager.loadPicture(name);
                // 最初のSprite以外は見えないようにする
                if (this._cg_sprites.length > 0) {
                    sp.visible = false;
                }

                // TODO: 画面サイズにあわせて、拡大・縮小すべき
                this._cg_sprites.push(sp);
                this.addChild(sp);

            }, this);

            this.do_exchange_status_window(this._rec_list, this._dummy_window);
            this._dummy_window.visible = false;
        }
    } else {
        this._rec_list.activate();
    }
};

Scene_Recollection.prototype.commandDummyOk = function () {

    if (this._cg_sprites_index < this._cg_sprites.length - 1) {
        this._cg_sprites[this._cg_sprites_index].visible = false;
        this._cg_sprites_index++;
        this._cg_sprites[this._cg_sprites_index].visible = true;
        SoundManager.playOk();

        this._dummy_window.activate();
    } else {
        SoundManager.playOk();
        this.commandDummyCancel();
    }
};

Scene_Recollection.prototype.commandDummyCancel = function () {
    this._cg_sprites.forEach(function (obj) {
        obj.visible = false;
        obj = null;
    });
    this.do_exchange_status_window(this._dummy_window, this._rec_list);
};

// コモンイベントから呼び出す関数
Scene_Recollection.prototype.rngd_exit_scene = function () {
    if (Scene_Recollection._rngd_recollection_doing) {
        // Window_RecListを表示する
        Scene_Recollection.reload_rec_list = true;
        SceneManager.push(Scene_Recollection);
    }
};

//-------------------------------------------------------------------------
// ● ウィンドウの無効化と有効化
//-------------------------------------------------------------------------
// win1: 無効化するウィンドウ
// win2: 有効化するウィンドウ
//-------------------------------------------------------------------------
Scene_Recollection.prototype.do_exchange_status_window = function (win1, win2) {
    win1.deactivate();
    win1.visible = false;
    win2.activate();
    win2.visible = true;
};
//-------------------------------------------------------------------------
// ● セーブ・ロード・ニューゲーム時に必要なスイッチをONにする
//-------------------------------------------------------------------------
Scene_Recollection.setRecollectionSwitches = function () {
    // 各セーブデータを参照し、RecollectionMode用のスイッチを検索する
    // スイッチが一つでもONになっている場合は回想をONにする
    for (var i = 1; i <= DataManager.maxSavefiles(); i++) {
        var data = null;
        try {
            data = StorageManager.loadFromLocalFile(i);
        } catch (e) {
            data = StorageManager.loadFromWebStorage(i);
        }
        if (data) {
            var save_data_obj = JsonEx.parse(data);
            var rec_cg_max = rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set);

            for (var j = 0; j < rec_cg_max; j++) {
                var cg = rngd_recollection_mode_settings.rec_cg_set[j + 1];
                if (save_data_obj["switches"]._data[cg.switch_id] &&
                    save_data_obj["switches"]._data[cg.switch_id] == true) {
                    $gameSwitches.setValue(cg.switch_id, true);
                }
            }
        }
    }
};

//-----------------------------------------------------------------------------
// ◆ Window関数
//-----------------------------------------------------------------------------

//=========================================================================
// ■ Window_RecollectionCommand
//=========================================================================
// 回想モードかCGモードを選択するウィンドウです
//=========================================================================
function Window_RecollectionCommand() {
    this.initialize.apply(this, arguments);
}

Window_RecollectionCommand.prototype = Object.create(Window_Command.prototype);
Window_RecollectionCommand.prototype.constructor = Window_RecollectionCommand;

Window_RecollectionCommand.prototype.initialize = function () {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.x = rngd_recollection_mode_settings.rec_mode_window.x;
    this.y = rngd_recollection_mode_settings.rec_mode_window.y;

};

Window_RecollectionCommand.prototype.makeCommandList = function () {
    Window_Command.prototype.makeCommandList.call(this);
    this.addCommand(rngd_recollection_mode_settings.rec_mode_window.str_select_recollection, "select_recollection");
    this.addCommand(rngd_recollection_mode_settings.rec_mode_window.str_select_cg, "select_cg");
    this.addCommand(rngd_recollection_mode_settings.rec_mode_window.str_select_back_title, "select_back_title");
};

//=========================================================================
// ■ Window_RecollectionList
//=========================================================================
// 回想またはCGを選択するウィンドウです
//=========================================================================
function Window_RecList() {
    this.initialize.apply(this, arguments);
}

Window_RecList.prototype = Object.create(Window_Selectable.prototype);
Window_RecList.prototype.constructor = Window_RecList;

//-------------------------------------------------------------------------
// ● 初期化処理
//-------------------------------------------------------------------------
Window_RecList.prototype.initialize = function (x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.windowWidth = width;
    this.windowHeight = height;
    this.select(0);
    this._formationMode = false;
    this.get_global_variables();
    this.refresh();

};

Window_RecList.prototype.maxItems = function () {
    return rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set);
};

Window_RecList.prototype.itemHeight = function () {
    return (this.height - this.standardPadding()) / rngd_recollection_mode_settings.rec_list_window.item_height;
};

Window_RecList.prototype.maxPageItems = function () {
    return rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set);
};

Window_RecList.prototype.maxCols = function () {
    return rngd_recollection_mode_settings.rec_list_window.item_width;
};

Window_RecList.prototype.maxPageRows = function () {
    var pageHeight = this.height;// - this.padding * 2;
    return Math.floor(pageHeight / this.itemHeight());
};

Window_RecList.prototype.drawItem = function (index) {
    var rec_cg = rngd_recollection_mode_settings.rec_cg_set[index + 1];
    var rect = this.itemRect(index);
    var text_height = 0;
    if (rngd_recollection_mode_settings.rec_list_window.show_title_text) {
        if (this._global_variables["switches"][rec_cg.switch_id]) {
            this.contents.drawText(rec_cg.title, rect.x + 4, rect.y + 4, this.itemWidth(), 32,
                rngd_recollection_mode_settings.rec_list_window.title_text_align);
        } else {
            this.contents.drawText(rngd_recollection_mode_settings.rec_list_window.never_watch_title_text,
                rect.x + 4, rect.y + 4, this.itemWidth(), 32,
                rngd_recollection_mode_settings.rec_list_window.title_text_align);
        }
        text_height = 32;
    }

    // CGセットのスイッチ番号が、全てのセーブデータを走査した後にTrueであればピクチャ表示
    if (this._global_variables["switches"][rec_cg.switch_id]) {

        var thumbnail_file_name = rec_cg.pictures[0];
        if (rec_cg.thumbnail !== undefined && rec_cg.thumbnail !== null) {
            thumbnail_file_name = rec_cg.thumbnail;
        }

        this.drawRecollection(thumbnail_file_name, 0, 0,
            this.itemWidth() - 36, this.itemHeight() - 8 - text_height, rect.x + 16, rect.y + 4 + text_height);


    } else {
        this.drawRecollection(rngd_recollection_mode_settings.rec_list_window.never_watch_picture_name,
            0, 0, this.itemWidth() - 36,
            this.itemHeight() - 8 - text_height, rect.x + 16, rect.y + 4 + text_height);

    }

};

//-------------------------------------------------------------------------
// ● 全てのセーブデータを走査し、対象のシーンスイッチ情報を取得する
//-------------------------------------------------------------------------
Window_RecList.prototype.get_global_variables = function () {
    this._global_variables = {
        "switches": {}
    };
    var maxSaveFiles = DataManager.maxSavefiles();
    for (var i = 1; i <= maxSaveFiles; i++) {
        if (DataManager.loadGameSwitch(i)) {
            var rec_cg_max = rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set);

            for (var j = 0; j < rec_cg_max; j++) {
                var cg = rngd_recollection_mode_settings.rec_cg_set[j + 1];
                if ($gameSwitches._data[cg.switch_id]) {
                    this._global_variables["switches"][cg.switch_id] = true;
                }
            }
        }
    }
};
//-------------------------------------------------------------------------
// ● index番目に表示された回想orCGが有効かどうか判断する
//-------------------------------------------------------------------------
Window_RecList.prototype.is_valid_picture = function (index) {
    // CG情報の取得と対象スイッチの取得
    var _rec_cg_obj = rngd_recollection_mode_settings.rec_cg_set[index];
    return (this._global_variables["switches"][_rec_cg_obj.switch_id] == true);

};


(function () {

    //-----------------------------------------------------------------------------
    // ◆ 組み込み関数Fix
    //-----------------------------------------------------------------------------

    Window_Base.prototype.drawRecollection = function (bmp_name, x, y, width, height, dx, dy) {
        var bmp = ImageManager.loadPicture(bmp_name);

        var _width = width;
        var _height = height;
        if (_width > bmp.width) {
            _width = bmp.width - 1;
        }

        if (_height > bmp.height) {
            _height = bmp.height - 1;
        }
        this.contents.blt(bmp, x, y, _width, _height, dx, dy);
    };

    var Window_TitleCommand_makeCommandList =
        Window_TitleCommand.prototype.makeCommandList;

    Window_TitleCommand.prototype.makeCommandList = function () {
        Window_TitleCommand_makeCommandList.call(this);
        this.clearCommandList();
        this.addCommand(TextManager.newGame, 'newGame');
        this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
        this.addCommand(rngd_recollection_mode_settings.rec_mode_window.recollection_title, 'recollection');
        this.addCommand(TextManager.options, 'options');
    };

    Scene_Title.prototype.commandRecollection = function () {
        SceneManager.push(Scene_Recollection);
    };

    var Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function () {
        Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler('recollection', this.commandRecollection.bind(this));
    };

    // セーブデータ共有オプションが指定されている場合のみ、カスタマイズ
    if (rngd_recollection_mode_settings["share_recollection_switches"]) {
        DataManager.makeSaveContents = function () {
            // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.

            Scene_Recollection.setRecollectionSwitches();

            var contents = {};
            contents.system = $gameSystem;
            contents.screen = $gameScreen;
            contents.timer = $gameTimer;
            contents.switches = $gameSwitches;
            contents.variables = $gameVariables;
            contents.selfSwitches = $gameSelfSwitches;
            contents.actors = $gameActors;
            contents.party = $gameParty;
            contents.map = $gameMap;
            contents.player = $gamePlayer;

            return contents;
        };

        DataManager.extractSaveContents = function (contents) {
            $gameSystem = contents.system;
            $gameScreen = contents.screen;
            $gameTimer = contents.timer;
            $gameSwitches = contents.switches;
            $gameVariables = contents.variables;
            $gameSelfSwitches = contents.selfSwitches;
            $gameActors = contents.actors;
            $gameParty = contents.party;
            $gameMap = contents.map;
            $gamePlayer = contents.player;

            Scene_Recollection.setRecollectionSwitches();
        };

        DataManager.setupNewGame = function () {
            this.createGameObjects();
            Scene_Recollection.setRecollectionSwitches();
            this.selectSavefileForNewGame();
            $gameParty.setupStartingMembers();
            $gamePlayer.reserveTransfer($dataSystem.startMapId,
                $dataSystem.startX, $dataSystem.startY);
            Graphics.frameCount = 0;
        };
    }

    //-----------------------------------------------------------------------------
    // ◆ DataManager関数
    //-----------------------------------------------------------------------------

    //-------------------------------------------------------------------------
    // ● スイッチのみロードする
    //-------------------------------------------------------------------------
    DataManager.loadGameSwitch = function (savefileId) {
        try {
            return this.loadGameSwitchWithoutRescue(savefileId);
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    DataManager.loadGameSwitchWithoutRescue = function (savefileId) {
        var globalInfo = this.loadGlobalInfo();
        if (this.isThisGameFile(savefileId)) {
            var json = StorageManager.load(savefileId);
            this.createGameObjectSwitch();
            this.extractSaveContentsSwitches(JsonEx.parse(json));
            //this._lastAccessedId = savefileId;
            return true;
        } else {
            return false;
        }
    };

    DataManager.createGameObjectSwitch = function () {
        $gameSwitches = new Game_Switches();
    };

    DataManager.extractSaveContentsSwitches = function (contents) {
        $gameSwitches = contents.switches;
    };

})();