var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*============================================================================
 Nore_AutoSave.js
----------------------------------------------------------------------------
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
============================================================================*/
/*:ja
 * @plugindesc オートセーブができるスクリプト
 * @author ル
 * @version 0.02
 *
 * @help
 * オートセーブのプラグインコマンド
 * Nore_AutoSave autoSave XXXX
 * XXXX にオートセーブのタイトルを設定できます
 *
 *
 * @param autosaveJp
 * @text オートセーブの日本語名
 * @default オートセーブ
 *
 * @param autosaveEn
 * @text オートセーブの英語名
 * @default Autosave
 *
 * @param autosaveCh
 * @text オートセーブの中国語名
 * @default オートセーブ
 *
 */
var Nore;
(function (Nore) {
    var parameters = PluginManager.parameters('Nore_AutoSave');
    var AUTO_SAVE_TITLE_JP = parameters['autosaveJp'];
    var AUTO_SAVE_TITLE_EN = parameters['autosaveEn'];
    var AUTO_SAVE_TITLE_CH = parameters['autosaveCh'];
    var AUTO_SAVE_DUMMY_ID = 999;
    Nore.AUTO_SAVE_DUMMY_ID = AUTO_SAVE_DUMMY_ID;
    var AUTO_SAVE_ID = 0;
    var pluginName = 'Nore_AutoSave';
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (command === pluginName) {
            switch (args[0]) {
                case 'autoSave':
                    $autoSaveManager.autoSave(args[1]);
                    return;
                default:
                    console.error('不正なプラグインコマンドです。' + args[0]);
            }
        }
    };
    var $autoSaveManager;
    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function () {
        _DataManager_createGameObjects.call(this);
        $autoSaveManager = new AutoSaveManager();
    };
    var AutoSaveManager = /** @class */ (function () {
        function AutoSaveManager() {
        }
        AutoSaveManager.prototype.autoSave = function (autoSaveName) {
            if (!autoSaveName) {
                //console.log('オートセーブ名が指定されていません');
            }
            var info = DataManager.loadGlobalInfo()[AUTO_SAVE_ID];
            if (info && info.playtime == $gameSystem.playtimeText()) {
                return;
            }
            SceneManager.snapForThumbnail();
            $gameSystem.onBeforeSave();
            var lastAccessId = DataManager._lastAccessedId;
            var saveId = AUTO_SAVE_DUMMY_ID;
            //console.log('オートセーブ実行:' + saveId + ' ' + autoSaveName);
            this._autoSaveName = autoSaveName;
            if (DataManager.saveGame(saveId)) {
                StorageManager.cleanBackup(saveId);
            }
            DataManager._lastAccessedId = lastAccessId;
            this._autoSaveName = null;
        };
        return AutoSaveManager;
    }());
    Nore.AutoSaveManager = AutoSaveManager;


    var _Window_SavefileList_prototype_drawFileId = Window_SavefileList.prototype.drawFileId;
    Window_SavefileList.prototype.drawFileId = function (id, x, y) {
        if (id == 0) {
            var text = AUTO_SAVE_TITLE_JP;
            switch ($gameVariables.value(1999)) {
                case 2:
                    text = AUTO_SAVE_TITLE_EN;
                    break;
                case 3:
                    text = AUTO_SAVE_TITLE_CH;
                    break;
            }
            this.drawText(text.format(id - AUTO_SAVE_ID + 1), x, y, 180);
            return;
        }
        _Window_SavefileList_prototype_drawFileId.call(this, id, x, y);
    };
    Scene_File.prototype.savefileId = function () {
        var fileId = this._listWindow.selectedId();
        if (fileId == AUTO_SAVE_ID) {
            return AUTO_SAVE_DUMMY_ID;
        }
        return fileId;
    };

    var Scene_File_prototype_update = Scene_File.prototype.update;
    Scene_File.prototype.update = function () {
        Scene_File_prototype_update.call(this);
        if (this._interpreter) {
            this._interpreter.update();
            if (TouchInput.rightButton) {
                $gameSwitches.setValue(50, true);
                return;
            }
            if (!this._interpreter.isRunning()) {
                var label = $gameVariables.value(renameVar2);
                this._interpreter = null;
                this._listWindow.activate();
                var id = this._listWindow.selectedId();
                var info = DataManager.loadGlobalInfo();
                if (!info[id]) {
                    return;
                }
                if (info[id].label == label) {
                    SoundManager.playCancel();
                    return;
                }
                SoundManager.playOk();
                info[id].label = label;
                this._listWindow.refresh();
                DataManager.saveGlobalInfo(info);
            }
        }
    };
    const _Scene_Save_prototype_onSavefileOk = Scene_Save.prototype.onSavefileOk;
    Scene_Save.prototype.onSavefileOk = function() {
        const fileId = this.savefileId();
        if (fileId == undefined || fileId == AUTO_SAVE_DUMMY_ID) {
            this.onSaveFailure();
            return;
        }
        _Scene_Save_prototype_onSavefileOk.call(this);
    };
    var StorageManager_localFilePath = StorageManager.localFilePath;
    StorageManager.localFilePath = function (savefileId) {
        if (savefileId === AUTO_SAVE_DUMMY_ID) {
            return this.localFileDirectoryPath() + 'file%1.rpgsave'.format(AUTO_SAVE_ID);
        }
        return StorageManager_localFilePath.call(this, savefileId);
    };
    DataManager.saveGameWithoutRescue = function (savefileId) {
        if (savefileId == undefined) {
            console.error('save file id が指定されていません');
            return false;
        }
        var json = JsonEx.stringify(this.makeSaveContents());
        if (json.length >= 200000) {
            console.warn('Save data too big!');
        }
        StorageManager.save(savefileId, json);
        if (savefileId == AUTO_SAVE_DUMMY_ID) {
            savefileId = AUTO_SAVE_ID;
        }
        this._lastAccessedId = savefileId;
        var globalInfo = this.loadGlobalInfo() || [];
        globalInfo[savefileId] = this.makeSavefileInfo();
        this.saveGlobalInfo(globalInfo);
        return true;
    };
    var _DataManager_isThisGameFile = DataManager.isThisGameFile;
    DataManager.isThisGameFile = function (savefileId) {
        if (savefileId == AUTO_SAVE_DUMMY_ID) {
            return true;
        }
        else {
            return _DataManager_isThisGameFile.apply(this, arguments);
        }
    };
    var _DataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue = function(savefileId) {
        const lastAccessId = this._lastAccessedId;
        const result = _DataManager_loadGameWithoutRescue.apply(this, arguments);
        if (this._lastAccessedId == AUTO_SAVE_DUMMY_ID) {
            this._lastAccessedId = lastAccessId;
        }
        return result;
    };

    DataManager.selectSavefileForNewGame = function() {
        var globalInfo = this.loadGlobalInfo();
        this._lastAccessedId = 1;
        if (globalInfo) {
            var numSavefiles = Math.max(0, getGlobalLength(globalInfo));
            if (numSavefiles < this.maxSavefiles()) {
                this._lastAccessedId = numSavefiles + 1;
            } else {
                var timestamp = Number.MAX_VALUE;
                for (var i = 1; i < globalInfo.length; i++) {
                    if (!globalInfo[i]) {
                        this._lastAccessedId = i;
                        break;
                    }
                    if (globalInfo[i].timestamp < timestamp) {
                        timestamp = globalInfo[i].timestamp;
                        this._lastAccessedId = i;
                    }
                }
            }
        }
    };

    function getGlobalLength(globalInfo) {
        let max = 0;
        for (let i = 0; i < 95; i++) {
            if (globalInfo[i]) {
                max = i;
            }
        }
        return max;
    }

})(Nore || (Nore = {}));
