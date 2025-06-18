/*============================================================================
 _SentenceExtractor.js
----------------------------------------------------------------------------
 (C)2020 kiki
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 [Blog]   : http://sctibacromn.hatenablog.com/
============================================================================*/
/*:ja
 * @plugindesc ツクールｍｖ内の文章と選択肢を全て出力し、csv形式で保存する。
 * @author kiki
 * @version 1.00
 * 
 * @help
 */

function SentenceData() {
    throw new Error("This is a static class");
}
(function () {
    var Sentence = {};
    Sentence.Param = PluginManager.parameters('SentenceExtractor');
    const DIR_NAME = "文章出力";
    const SENTENCE_TYPE_NUM = 0;
    const CHOICE_TYPE_NUM = 1;
    Sentence.saveMapFileNames = ["マップ文章", "マップ選択肢"];
    Sentence.saveComFileNames = ["コモン文章", "コモン選択肢"];
    Sentence.saveMapName = "マップ名"

    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        SentenceData.start();
    };
    SentenceData.start = function () {
        if (!Utils.isNwjs()) {
            return;
        }
        let path = require('path');
        this._fs = require('fs');
        this._projectFilePath = path.dirname(process.mainModule.filename);
        let mapInfo = this._fs.readFileSync(this._projectFilePath + '/data/MapInfos.json');
        this._jsonMapData = JSON.parse(mapInfo);
        this.makeDir();
        this.writeMapSentence(SENTENCE_TYPE_NUM);
        this.writeMapSentence(CHOICE_TYPE_NUM);
        this.writeCommonSentence(SENTENCE_TYPE_NUM);
        this.writeCommonSentence(CHOICE_TYPE_NUM);
        this.writeMapNames();
    };
    SentenceData.makeDir = function () {
        let fs = this._fs;
        let dirPath = this._projectFilePath + "/" + DIR_NAME;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
    };
    SentenceData.writeMapNames = function () {
        let jsonMapData = this._jsonMapData;
        var dataStr = "";
        for (i = 1; i < jsonMapData.length; i++) {
            if (jsonMapData[i] == null) continue;
            dataStr += '"' + jsonMapData[i].name + '"' + ':{"en":""},' + "\n";
        }
        let saveFileName = Sentence.saveMapName;
        this.saveText(dataStr, saveFileName);
    };
    SentenceData.saveText = function (dataStr, saveFileName) {
        // 後方「,改行」削除
        dataStr = dataStr.replace(/\,\n$/g,"");
        let saveFilePath = this._projectFilePath + "/" + DIR_NAME + "/" + saveFileName + ".txt";
        this._fs.writeFileSync(saveFilePath, dataStr);
    };
    SentenceData.writeMapSentence = function (typeNum) {
        let jsonMapData = this._jsonMapData;
        var dataStr = "";
        for (i = 1; i < jsonMapData.length; i++) {
            if (jsonMapData[i] == null) continue;
            var filename = 'Map%1.json'.format(i.padZero(3));
            let dataMapName = '/data/' + filename;
            let data = this._fs.readFileSync(this._projectFilePath + dataMapName);
            let jsonData = JSON.parse(data);
            let mapId = jsonMapData[i].id;
            dataStr += this.extractInMap(typeNum, mapId, jsonData);
        }
        // 空でも表示
        // エラーじゃないことを示すため
        let saveFileName = Sentence.saveMapFileNames[typeNum];
        this.saveCsv(dataStr, saveFileName);
    };
    SentenceData.extractInMap = function (typeNum, mapId, jsonData) {
        var dataStr = "";
        for (n = 1; n < jsonData.events.length; n++) {
            let event = jsonData.events[n];
            if (event == null) continue;
            let extracted = "";
            switch (typeNum) {
                case 0:
                    extracted = this.serifInMap(event, mapId);
                    break;
                case 1:
                    extracted = this.choicesInMap(event);
                    break;
            }
            if (extracted != "") {
                dataStr += extracted;
            }
        }
        return dataStr;
    };
    SentenceData.saveCsv = function (dataStr, saveFileName) {
        let saveFilePath = this._projectFilePath + "/" + DIR_NAME + "/" + saveFileName + ".csv";
        let fs = this._fs;
        if(dataStr == ""){
            fs.writeFileSync(saveFilePath, dataStr);
        }else{
            // bom付きじゃないとエクセル表示で文字化けするため、追加
            fs.writeFileSync(saveFilePath, '\uFEFF');
            fs.appendFile(saveFilePath, dataStr);
        }
    };
    SentenceData.serifInMap = function (event, mapId) {
        var serifInMap = "";
        for (m = 0; m < event.pages.length; m++) {
            let page = event.pages[m];
            let l = 0;
            let list = page.list;
            while(list[l]){
                var oneSerif = "";
                //一イベントコマンドにある文章を抽出
                while (this.nextEventCode(list, l) === 401) {
                    l++;
                    oneSerif += list[l].parameters[0] + "\n";
                }
                if (oneSerif != ""){
                    // 後方改行削除
                    oneSerif = oneSerif.replace(/\r?\n$/g,"");
                    oneSerif = '"' + oneSerif + '"';
                    // マップＩＤ，イベントＩＤを文章の前に接頭文字で入れる
                    let prefix = String(mapId) + "," + String(event.id) + ",";
                    oneSerif = prefix + oneSerif;
                    serifInMap += oneSerif + "\n";
                }
                l++;
            }
        }
        return serifInMap;
    };
    SentenceData.choicesInMap = function (event) {
        var choicesInMap = "";
        for (let i = 0; i < event.pages.length; i++) {
            let page = event.pages[i];
            for (let i = 0; i < page.list.length; i++) {
                let command = page.list[i];
                if (command.code == 402) {
                    choicesInMap += command.parameters[1] + '\n';
                }
            }
        }
        return choicesInMap;
    };
    SentenceData.nextEventCode = function (list, l) {
        var command = list[l + 1];
        if (command) {
            return command.code;
        } else {
            return 0;
        }
    };
    SentenceData.writeCommonSentence = function (typeNum) {
        let fs = this._fs; 
        var data = fs.readFileSync(this._projectFilePath + '/data/CommonEvents.json');
        var jsonData = JSON.parse(data);
        var dataStr = "";
        dataStr += this.extractInCommonEv(typeNum, jsonData);
        let saveFileName = Sentence.saveComFileNames[typeNum];
        this.saveCsv(dataStr, saveFileName);
    };
    SentenceData.extractInCommonEv = function (typeNum, jsonData) {
        var dataStr = "";
        for (i = 1; i < jsonData.length; i++) {
            if (jsonData[i] == null)
                continue;
                commonId = jsonData[i].id;
                let list = jsonData[i].list;
                switch (typeNum) {
                    case 0:
                        dataStr += this.serifInCommonEv(list, commonId);
                        break;
                    case 1:
                        dataStr += this.choicesInCommonEv(list);
                        break;
                }
        }
        return dataStr;
    };
    SentenceData.serifInCommonEv = function (list, commonId) {
        var serIfInCommonEv = "";
        let i = 0;
        while(list[i]){
            var oneSerif = "";
            //一イベントコマンドにある文章を抽出
            while (this.nextEventCode(list, i) === 401) {
                i++;
                oneSerif += list[i].parameters[0] + "\n";
            }
            if (oneSerif != ""){
                // 後方改行削除
                oneSerif = oneSerif.replace(/\r?\n$/g,"");
                oneSerif = '"' + oneSerif + '"';
                // コモンイベントＩＤを文章の前に接頭文字で入れる
                let prefix = String(commonId) + ",";
                oneSerif = prefix + oneSerif;
                serIfInCommonEv += oneSerif + "\n";
            }
            i++;
        }
        return serIfInCommonEv;
    };
    SentenceData.choicesInCommonEv = function (list) {
        var choicesInCommon = "";
        for (let i = 0; i < list.length; i++) {
            let command = list[i];
            if (command.code == 402) {
                choicesInCommon += command.parameters[1] + '\n';
            }
        }
        return choicesInCommon;
    };
})();
