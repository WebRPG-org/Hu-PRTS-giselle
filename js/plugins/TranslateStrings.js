/*============================================================================
 _TranslateStrings.js
----------------------------------------------------------------------------
 (C)2020 kiki
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 [Blog]   : http://sctibacromn.hatenablog.com/
============================================================================*/
/*:
 * @plugindesc 文章をトリガーとして、jsonから対応する文字列を言語別に取得するプラグインです。
 * @author kiki
 * @version 1.00
 *
 * @help
 * 言語を追加するときの手順
 * １．言語文字に追加したい言語を表す二文字を追記します。
 * 　　この二文字は、window.navigator.languageを実行したときに出力される
 * 　　文字のことです。
 * ２．このjsを開いてもらって、強制言語の設定に英語と同様に追記。
 * 　　ただしvalueの値を連番にする。
 * 
 * @param 強制言語の設定
 * @desc テストするときの強制言語の設定
 * @type select
 * @option なし
 * @value 0
 * @option 英語
 * @value 1
 * @default 0
 * 
 * @param データベースを言語別に使用する
 * @desc 日本語ではない場合、対応言語のデータベースをロードするかどうか
 * @type boolean
 * @default false
 * 
 * @param 文章を言語別に取得する
 * @desc 文章を対応する言語で取得するか
 * @type boolean
 * @default false
 * 
 * @param 言語データベース名
 * @type string[]
 * @desc 言語データベースを追加するときに追記する
 * @default ["", "", ""]
 * 
 * @param 言語文字
 * @type string[]
 * @desc 他の言語を追加するときに追記する
 * 例えば中国語ならzh
 * @default ["en"]
 * 
 * @param 言語jsonフォルダ名
 * @desc 言語jsonが入ったフォルダ名
 * @type string
 * @default Translate
 */

var $gameStrings = null; // ゲーム中恒常的に使う文言系。
var $gameMapText = null; // マップのセリフテキスト。
var $gameCommonText = null;// コモンイベントのセリフテキスト。
var $language = "ja"; // 言語設定
function GameStrings() {
    throw new Error("This is a static class");
}

(function () {
    var Lang = {};
    Lang.Param = PluginManager.parameters('TranslateStrings');
    Lang.forceLangIndex = Number(Lang.Param["強制言語の設定"]);
    Lang.reflectDataBase = Lang.Param["データベースを言語別に使用する"] == "true" ? true : false;
    Lang.reflectSentence = Lang.Param["文章を言語別に取得する"] == "true" ? true : false;
    Lang.dirName = Lang.Param["言語jsonフォルダ名"];
    Lang.nameList = JSON.parse(Lang.Param["言語文字"]);
    Lang.dbNameList = JSON.parse(Lang.Param["言語データベース名"]);
    Lang.useCommonId = 0;
    for (var i = 0; i < Lang.dbNameList.length; i++) {
        Lang.dbNameList[i] = Lang.dbNameList[i] + ".json"; 
    }
    // 言語設定を取得
    let lang = (window.navigator.languages && window.navigator.languages[0]) ||
        window.navigator.language ||
        window.navigator.userLanguage ||
        window.navigator.browserLanguage;
    $language = lang.slice(0, 2);
    if (Lang.forceLangIndex != 0) {
        Lang.forceLangIndex -= 1;
        $language = Lang.nameList[Lang.forceLangIndex];
    }
    console.log("言語：" + $language)

    // GameStrings.jsonロード
    DataManager._databaseFiles.push(
        { name: '$gameStrings', src: Lang.dirName + '/GameStrings.json' }
    );

    //-----------------------------------------------------------------------------
    // 対応言語のデータベースの反映
    //-----------------------------------------------------------------------------
    const _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function () {
        if (!Lang.reflectDataBase) {
            _DataManager_loadDatabase.call(this);
            return;
        }
        var test = this.isBattleTest() || this.isEventTest();
        var prefix = test ? 'Test_' : '';
        for (var i = 0; i < this._databaseFiles.length; i++) {
            var name = this._databaseFiles[i].name;
            var src = this._databaseFiles[i].src;
            // 日本語以外は外国語の該当フォルダ名から出力
            if (Lang.dbNameList.includes(src)) {
                if ($language != "ja") {
                    src = $language + "/" + src;
                }
            }
            this.loadDataFile(name, prefix + src);
        }
        if (this.isEventTest()) {
            this.loadDataFile('$testEvent', prefix + 'Event.json');
        }
    };
    //-----------------------------------------------------------------------------
    // イベントスタート時、マップＩｄ、イベントＩｄの記憶
    //-----------------------------------------------------------------------------
    const _Game_System_prototype_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        _Game_System_prototype_initialize.apply(this, arguments);
        this._serifEventId;
    };
    Game_Event.prototype.start = function () {
        var list = this.list();
        if (list && list.length > 1) {
            this._starting = true;
            // $gameMap._mapIdは場所移動するとその場所のマップＩＤに変更される
            // 場所移動後もセリフを反映させるために記憶する
            // イベントIDを記憶するのも同じ理由
            $gameSystem._mapId = $gameMap._mapId;
            $gameSystem._eventId = this._eventId;
            if (this.isTriggerIn([0, 1, 2])) {
                this.lock();
            }
        }
    };
    //-----------------------------------------------------------------------------
    // 文章の言語表示
    //-----------------------------------------------------------------------------
    Game_Interpreter.prototype.command101 = function () {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setFaceImage(this._params[0], this._params[1]);
            $gameMessage.setBackground(this._params[2]);
            $gameMessage.setPositionType(this._params[3]);
            let messages = "";
            while (this.nextEventCode() === 401) {  // Text data
                this._index++;
                var message = this.currentCommand().parameters[0];
                messages += message + "\n";
            }
            if (messages != "") {
                // 後方改行削除
                messages = messages.replace(/\n$/g,"");
                // 一行ずつではなく、コマンド一つの文章と、言語jsonを比較する
                // 文章そのものをトリガーにすることによって、仕組みをシンプルにする
                // ただし同一イベント内でセリフが被ると、上のセリフが優先される
                let transMessages = GameStrings.GetText(messages, $gameSystem._eventId);
                let messageList = transMessages.split(/\r\n|\n/);
                messageList.forEach(function (message) {
                    $gameMessage.add(message);
                });
            }
            switch (this.nextEventCode()) {
                case 102:  // Show Choices
                    this._index++;
                    this.setupChoices(this.currentCommand().parameters);
                    break;
                case 103:  // Input Number
                    this._index++;
                    this.setupNumInput(this.currentCommand().parameters);
                    break;
                case 104:  // Select Item
                    this._index++;
                    this.setupItemChoice(this.currentCommand().parameters);
                    break;
            }
            this._index++;
            this.setWaitMode('message');
        }
        return false;
    };
    Game_Interpreter.prototype.convertVariables = function (text) {
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function () {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        return text;
    };
    GameStrings.GetText = function (messages, eventId) {
        if ($language != "ja" && Lang.reflectSentence) {
            // マップイベントの文章を出力する（MapSerif.jsonから）
            for (let i = 0; i < $gameMapText.length; i++) {
                let text = $gameMapText[i];
                if (text.mapId != $gameSystem._mapId || text.eventId != eventId) {
                    continue;
                }
                let transMessages = GameStrings.GetTransMessages(text, messages)
                if (transMessages != "") {
                    return transMessages;
                }
            }
            // コモンイベントの文章を出力する（CommonSerif.jsonから)
            if (Lang.useCommonId == 0) {
                return messages;
            }
            for (var i = 0; i < $gameCommonText.length; i++) {
                let text = $gameCommonText[i];
                let commonId = Lang.useCommonId;
                if (text.commonId != commonId) {
                    continue;
                }
                let transMessages = GameStrings.GetTransMessages(text, messages)
                if (transMessages != "") {
                    return transMessages;
                }
            }
        }
        return messages;
    };

    GameStrings.GetTransMessages = function (text, messages) {
        let transMessages = "";
        if (text.ja == messages) {
            transMessages = GameStrings.GetMessage(text);
        }
        return transMessages;
    };
    //-----------------------------------------------------------------------------
    // セリフ以外の単語の言語表示
    //-----------------------------------------------------------------------------
    Window_MapName.prototype.refresh = function () {
        this.contents.clear();
        if ($gameMap.displayName()) {
            var width = this.contentsWidth();
            this.drawBackground(0, 0, width, this.lineHeight());
            this.drawText(GameStrings.GetString($gameMap.displayName()), 0, 0, width, 'center');
        }
    };

    Window_Command.prototype.drawItem = function (index) {
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(GameStrings.GetString(this.commandName(index)), rect.x, rect.y, rect.width, align);
    };
    GameStrings.GetString = function (message) {
        if ($gameStrings == null || $language == "ja") {
            return message;
        }
        let array = message.split(":");
        for (var i = 0; i < array.length; i++) {
            let word = array[i];
            if ($gameStrings[word]) {
                let text = $gameStrings[word];
                let transMessage = GameStrings.GetMessage(text);
                let regexp = new RegExp("(" + word + ")");
                message = message.replace(regexp, transMessage);
            }
        }
        return message;
    };

    GameStrings.GetMessage = function (text) {
        // $languageがenなら"text.en"として、出力する
        // 初めはスイッチ文で分けていたが、こっちのほうが変更容易なため
        return eval("text." + $language);
    };
    //-----------------------------------------------------------------------------
    // コモンイベントＩＤの記録
    //-----------------------------------------------------------------------------
    // ゲームスタート時、コモンイベントを全て調べて文章があるコモンイベントＩＤを抽出
    const _Scene_Boot_prototype_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        _Scene_Boot_prototype_start.call(this);
        if(!Lang.reflectSentence) return;
        $gameCommonText._commonIdsHasSerif = [];
        for (let i = 1; i < $dataCommonEvents.length; i++) {
            let data = $dataCommonEvents[i];
            for (let i = 0; i < data.list.length; i++) {
                let code = data.list[i].code;
                if (code == 401) {
                    $gameCommonText._commonIdsHasSerif.push(data.id);
                    break;
                }
            }
        }
    };
    Game_Interpreter.prototype.command117 = function () {
        let commonId = this._params[0];
        var commonEvent = $dataCommonEvents[commonId];
        if (commonEvent) {
            var eventId = this.isOnCurrentMap() ? this._eventId : 0;
            // セリフを持つコモンイベントIDのみ記憶する
            if ($gameCommonText._commonIdsHasSerif.includes(commonId)) {
                Lang.useCommonId = commonId;
            }
            this.setupChild(commonEvent.list, eventId);
        }
        return true;
    };
    const _Game_Interpreter_prototype_terminate = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function () {
        _Game_Interpreter_prototype_terminate.call(this);
        Lang.useCommonId = 0;
    };
    //-----------------------------------------------------------------------------
    // 言語jsonのロード
    //-----------------------------------------------------------------------------
    const _Scene_Boot_create = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function () {
        if(Lang.reflectSentence){
            DataManager.loadMapText();
            DataManager.loadCommonText();
        }
        _Scene_Boot_create.apply(this, arguments);
    };
    DataManager.loadMapText = function () {
        var filename = Lang.dirName + "/MapSerif.json";
        this.loadDataFile('$gameMapText', filename);
    };
    DataManager.loadCommonText = function () {
        var filename = Lang.dirName + "/CommonSerif.json";
        this.loadDataFile('$gameCommonText', filename);
    };
    DataManager.isMapLoaded = function () {
        this.checkError();
        if(!Lang.reflectSentence){
            return !!$dataMap;
        }
        return !!$dataMap && !!$gameMapText && !!$gameCommonText;
    };
})();