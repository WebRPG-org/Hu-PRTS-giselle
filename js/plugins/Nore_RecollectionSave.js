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
/*:ja
 * @author ル
 * @plugindesc 回想セーブができるスクリプト
 *
 * @help
 * 回想セーブのプラグインコマンド
 * 回想セーブ <回想ファイルID> <テキスト>
 *
 * 例
 * 回想セーブ オーク敗北
 *
 * @param recollectionPage
 * @text このページから回想セーブになります
 * @desc このページから回想セーブになります
 * @type number
 * @default 11
 *
 * @param maxCols
 * @text セーブページの行の数
 * @desc セーブページの行の数
 * @type number
 * @default 4
 *
 * @param alreadySaveExists
 * @text 回想セーブが存在する時のメッセージ
 * @default 既にセーブがあるため回想セーブされませんでした
 *
 * @param recosaveJp
 * @text 回想セーブの日本語名
 * @default 回想%1
 *
 * @param recosaveEn
 * @text 回想セーブの英語名
 * @default reco%1
 *
 * @param recosaveCh
 * @text 回想セーブの中国語名
 * @default 回想%1
 *
 *
 * @param loadJp
 * @text ロードするの日本語名
 * @default ロードする
 *
 * @param loadEn
 * @text ロードするの英語名
 * @default load
 *
 * @param loadCh
 * @text ロードするの中国語名
 * @default ロードする
 *
 *
 * @param confirmloadJp
 * @text ロードしますかの日本語名
 * @default このファイルをロードしますか？
 *
 * @param confirmloadEn
 * @text ロードするの英語名
 * @default Do you want to load this file?
 *
 * @param confirmloadCh
 * @text ロードするの中国語名
 * @default このファイルをロードしますか？
 *
 *
 * @param deleteJp
 * @text 削除するの日本語名
 * @default 削除する
 *
 * @param deleteEn
 * @text 削除するの英語名
 * @default delete
 *
 * @param deleteCh
 * @text 削除するの中国語名
 * @default 削除する
 * 
 * @param copiedJp
 * @text コピーされたファイルの日本語名
 * @default コピーされたファイル
 * 
 * @param copiedEn
 * @text コピーされたファイルの英語名
 * @default Copied file
 * 
 * @param copiedCh
 * @text コピーされたファイルの中国語名
 * @default Copied file
 */
var Nore;
(function (Nore) {
    var parameters = PluginManager.parameters('Nore_RecollectionSave');
    var RECOLLECTION_PAGE = parameters['recollectionPage'];
    var maxCols = parseInt(parameters['maxCols'] || '4');
    var MAX_PAGE_FILES = maxCols * 3;
    var AUTO_SAVE_ID = 0;
    var maxPage = 15;
    var MAX_ROW = 3;
    var ALREADY_SAVE_EXISTS = parameters['alreadySaveExists'];
    var RECO_LABEL_JP = parameters['recosaveJp'];
    var RECO_LABEL_EN = parameters['recosaveEn'];
    var RECO_LABEL_CH = parameters['recosaveCh'];
    var LOAD_LABEL_JP = parameters['loadJp'];
    var LOAD_LABEL_EN = parameters['loadEn'];
    var LOAD_LABEL_CH = parameters['loadCh'];
    var LOAD_CONFIRM_JP = parameters['confirmloadJp'];
    var LOAD_CONFIRM_EN = parameters['confirmloadEn'];
    var LOAD_CONFIRM_CH = parameters['confirmloadCh'];
    var DELETE_LABEL_JP = parameters['deleteJp'];
    var DELETE_LABEL_EN = parameters['deleteEn'];
    var DELETE_LABEL_CH = parameters['deleteCh'];

    var COPIED_LABEL_JP = parameters['copiedJp'];
    var COPIED_LABEL_EN = parameters['copiedEn'];
    var COPIED_LABEL_CH = parameters['copiedCh'];

    var pluginName = 'Nore_RecollectionSave';
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (command === '回想セーブ') {
            //--------Added code--------
            if (typeof args[0] === 'string' && args[0].includes("_")) {
                args[0] = args[0].replace(/_/g, " ");
            }
            //--------------------------
            $recoSaveManager.save(args[0]);
        }
    };
    DataManager.latestSavefileId = function () {
        var globalInfo = this.loadGlobalInfo();
        var savefileId = 1;
        var timestamp = 0;
        var recoId = getRecoStartId();
        if (globalInfo) {
            for (var i = 1; i < this.maxSavefiles(); i++) {
                if (i >= recoId) {
                    break;
                }
                if (this.isThisGameFile(i) && globalInfo[i].timestamp > timestamp) {
                    timestamp = globalInfo[i].timestamp;
                    savefileId = i;
                }
            }
        }
        return savefileId;
    };
    var _Window_SavefileList_prototype_drawFileId = Window_SavefileList.prototype.drawFileId;
    Window_SavefileList.prototype.drawFileId = function (id, x, y) {
        var recoId = getRecoStartId();
        if (id >= recoId) {
            var text = RECO_LABEL_JP;
            switch ($gameVariables.value(1999)) {
                case 2:
                    text = RECO_LABEL_EN;
                    break;
                case 3:
                    text = RECO_LABEL_CH;
                    break;
            }
            this.drawText(text.format(id - recoId + 1), x, y, 180);
            return;
        }
        _Window_SavefileList_prototype_drawFileId.call(this, id, x, y);
    };
    function getRecoStartId() {
        var recoId = (RECOLLECTION_PAGE - 1) * MAX_PAGE_FILES;
        return recoId;
    }
    var $recoSaveManager;
    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function () {
        _DataManager_createGameObjects.call(this);
        $recoSaveManager = new RecoSaveManager();
    };
    var RecoSaveManager = /** @class */ (function () {
        function RecoSaveManager() {
            this._recoSaveName = null;
        }
        RecoSaveManager.prototype.save = function (saveFileName) {
            var slotId = this.findSlotId(saveFileName);
            if (slotId == -1) {
                CommonPopupManager.showInfo({}, ALREADY_SAVE_EXISTS, '');
                return;
            }
            var lastAccessId = DataManager._lastAccessedId;
            var saveId = getRecoStartId() + slotId - 1;
            var info = DataManager.loadGlobalInfo()[saveId];
            if (info && info.playtime == $gameSystem.playtimeText()) {
                return;
            }
            SceneManager.snapForThumbnail();
            $gameSystem.onBeforeSave();
            this._recoSaveName = saveFileName;
            console.log('回想セーブを実行 ' + slotId + ' ' + saveId + ' ' + saveFileName);
            if (DataManager.saveGame(saveId)) {
                StorageManager.cleanBackup(saveId);
            }
            DataManager._lastAccessedId = lastAccessId;
            this._recoSaveName = null;
        };
        RecoSaveManager.prototype.findSlotId = function (saveFileName) {
            var start = getRecoStartId();
            var globalInfo = DataManager.loadGlobalInfo();
            for (var i = 0; i < 100; i++) {
                var info = globalInfo[i + start];
                if (info) {
                    if (info.label == saveFileName) {
                        return -1;
                    }
                }
            }
            for (var i = 0; i < 100; i++) {
                var info = globalInfo[i + start];
                if (!info) {
                    return i + 1;
                }
            }
            return -1;
        };
        RecoSaveManager.prototype.inRecoSave = function () {
            return this._recoSaveName != null;
        };
        RecoSaveManager.prototype.recoSaveName = function () {
            return this._recoSaveName;
        };
        return RecoSaveManager;
    }());
    var _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo = function () {
        var info = _DataManager_makeSavefileInfo.call(this);
        if (!$recoSaveManager.inRecoSave()) {
            return info;
        }
        info.label = $recoSaveManager.recoSaveName();
        return info;
    };
    var _Scene_Save_prototype_onSavefileOk = Scene_Save.prototype.onSavefileOk;
    Scene_Save.prototype.onSavefileOk = function () {
        var fileId = this.savefileId();
        if (fileId == undefined || fileId >= getRecoStartId()) {
            this.onSaveFailure();
            return;
        }
        _Scene_Save_prototype_onSavefileOk.call(this);
    };
    Scene_File.prototype.createListWindow = function () {
        var x = 0;
        var y = this._helpWindow.height;
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight - y;
        this._listWindow = new Window_SavefileList2(x, y, width, height - 60);
        this._listWindow.setHandler('ok', this.onSavefileOk.bind(this));
        this._listWindow.setHandler('cancel', this.popScene.bind(this));
        this._listWindow.setHandler('pageup', this.onPageup.bind(this));
        this._listWindow.setHandler('pagedown', this.onPagedown.bind(this));
        this._listWindow.setHandler('right', this.onRight.bind(this));
        this._listWindow.setHandler('left', this.onLeft.bind(this));
        this._listWindow.setHandler('up', this.onUp.bind(this));
        this._listWindow.setHandler('down', this.onDown.bind(this));
        this._listWindow.setHandler('right', this.onRight.bind(this));
        var index = this.firstSavefileIndex() + 1;
        var page = Math.floor(index / MAX_PAGE_FILES);
        this._listWindow.setPageIndex(page);
        this._listWindow.select(index % MAX_PAGE_FILES);
        this._listWindow.setMode(this.mode());
        this._listWindow.refresh();
        this.addWindow(this._listWindow);
        var yy = this._listWindow.y + this._listWindow.height;
        this._pageWindow = new Window_SavePage(0, yy + 0, width, 60);
        this._pageWindow.setPage(page);
        this.addWindow(this._pageWindow);
    };
    const _Scene_File_prototype_popScene = Scene_File.prototype.popScene;
    Scene_File.prototype.popScene = function () {
          $gameVariables.setValue(11, 0);
          _Scene_File_prototype_popScene.call(this);
    }
    Scene_File.prototype.onRight = function () {
        var page = this._pageWindow.right();
        this._listWindow.setPageIndex(page);
        this._listWindow.select(0);
    };
    Scene_File.prototype.onLeft = function () {
        var page = this._pageWindow.left();
        this._listWindow.setPageIndex(page);
        this._listWindow.select(this._listWindow.maxItems() - 1);
    };
    Scene_File.prototype.onDown = function () {
        var page = this._pageWindow.right();
        var before = this._listWindow.index();
        this._listWindow.setPageIndex(page);
        this._listWindow.select(before % maxCols);
    };
    Scene_File.prototype.onUp = function () {
        var page = this._pageWindow.left();
        var before = this._listWindow.index();
        this._listWindow.setPageIndex(page);
        this._listWindow.select(before % maxCols + this._listWindow.maxItems() - maxCols);
    };
    Scene_File.prototype.onPageup = function () {
        var page = this._pageWindow.left();
        var before = this._listWindow.index();
        this._listWindow.setPageIndex(page);
        if (this._listWindow.maxItems() <= before) {
            this._listWindow.select(0);
        }
    };
    Scene_File.prototype.onPagedown = function () {
        var page = this._pageWindow.right();
        var before = this._listWindow.index();
        this._listWindow.setPageIndex(page);
        if (this._listWindow.maxItems() <= before) {
            this._listWindow.select(0);
        }
    };
    var _Scene_Load_prototype_onSavefileOk = Scene_Load.prototype.onSavefileOk;
    Scene_Load.prototype.onSavefileOk = function () {
        var saveFileId = this.savefileId();
        if (saveFileId < getRecoStartId() || saveFileId == Nore.AUTO_SAVE_DUMMY_ID) {
            _Scene_Load_prototype_onSavefileOk.call(this);
            return;
        }
        if (!DataManager.isThisGameFile(saveFileId)) {
            _Scene_Load_prototype_onSavefileOk.call(this);
            return;
        }
        SoundManager.playOk();
        var confiemWindow;
        if (this._confiemWindow) {
            confiemWindow = this._confiemWindow;
        }
        else {
            confiemWindow = new Window_Confirm();
            confiemWindow.setHandler('ok', this.onConfirmOk.bind(this));
            confiemWindow.setHandler('delete', this.onConfirmDelete.bind(this));
            confiemWindow.setHandler('cancel', this.onConfirmCancel.bind(this));
            this._confiemWindow = confiemWindow;
        }
        var text = LOAD_CONFIRM_JP;
        switch ($gameVariables.value(1999)) {
            case 2:
                text = LOAD_CONFIRM_EN;
                break;
            case 3:
                text = LOAD_CONFIRM_CH;
                break;
        }
        confiemWindow.setText(text);
        confiemWindow.show();
        confiemWindow.activate();
        confiemWindow.select(0);
        this.addWindow(confiemWindow);
        //_Scene_Load_prototype_onSavefileOk.call(this);
    };
    Scene_Load.prototype.onConfirmOk = function () {
        _Scene_Load_prototype_onSavefileOk.call(this);
    };
    Scene_Load.prototype.onConfirmDelete = function () {
        var saveFileId = this.savefileId();
        StorageManager.remove(saveFileId);
        var info = DataManager.loadGlobalInfo();
        delete info[saveFileId];
        this._confiemWindow.deactivate();
        this._confiemWindow.hide();
        this._listWindow.refresh();
        this._listWindow.activate();
    };
    Scene_Load.prototype.onConfirmCancel = function () {
        this._confiemWindow.deactivate();
        this._confiemWindow.hide();
        this._listWindow.activate();
    };
    var Window_SavefileList2 = /** @class */ (function (_super) {
        __extends(Window_SavefileList2, _super);
        function Window_SavefileList2() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Window_SavefileList2.prototype.maxItems = function () {
            return MAX_PAGE_FILES;
        };
        Window_SavefileList2.prototype.update = function () {
            if (!$gameVariables) {
                return;
            }
            if (this._page >= RECOLLECTION_PAGE - 1) {
                $gameVariables.setValue(11, 2);
                //this.windowskin = ImageManager.loadSystem(recoPageWindowFile);
            }
            else {
                $gameVariables.setValue(11, 0);
                //this.windowskin = ImageManager.loadSystem('Window');
            }
            _super.prototype.update.call(this);
        };
        Window_SavefileList2.prototype.drawItem = function (index) {
            var id = index + this.pageTopIndex();
            //console.log(id)
            var valid = DataManager.isThisGameFile(id);
            if (!valid && this._page == -1) {
                return;
            }
            var info = DataManager.loadSavefileInfo(id);
            var rect = this.itemRectForText(index);
            this.resetTextColor();
      

            if (! valid && ! info && id > 0) {
                if (StorageManager.exists(id)) {
                    try {
                        const jsonStr = StorageManager.load(id);
                        const json = JsonEx.parse(jsonStr);
                       
                        info = this.makeDummySaveFile();
                        valid = true;
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
            this.changePaintOpacity(valid);
            this.drawFileId(id, rect.x + 33, rect.y);
            if (valid && info && info.label != null && info.label != 0) {
                this.drawText(info.label, rect.x + 33, rect.y + 30, rect.width - 33);
            }
            if (info) {
                this.changePaintOpacity(valid);
                this.drawContents(info, rect, valid);
                this.changePaintOpacity(true);
            }
        };
        Window_SavefileList2.prototype.makeDummySaveFile = function() {
            var info = {};
            info.globalId   = this._globalId;
            info.title      = $dataSystem.gameTitle;
            info.characters = [];
            info.faces      = [];
            info.timestamp  = Date.now();

            var text = COPIED_LABEL_JP;
            switch ($gameVariables.value(1999)) {
                case 2:
                    text = COPIED_LABEL_EN;
                    break;
                case 3:
                    text = COPIED_LABEL_CH;
                    break;
            }
            info.playtime = text;

            return info;
        };
        Window_SavefileList2.prototype.pageTopIndex = function () {
            return this._page * this.maxItems();
        };
        Window_SavefileList2.prototype.drawThumbnail = function (info, thumbRect, valid) {
            var _this = this;
            var savefileId = DataManager.getSavefileId(info);
            if (savefileId < 0 && info.title != null) {
                savefileId = AUTO_SAVE_ID;
            }
            var listIndex = savefileId - this.pageTopIndex();
            if (savefileId >= 0 && info.thumbnail) {
                var sprite_1 = this._thumbContainer.children[listIndex];
                if (!sprite_1) {
                    console.error(savefileId + 'のサムネイルを表示できません');
                    return;
                }
                sprite_1.visible = true;
                sprite_1.x = thumbRect.x;
                sprite_1.y = thumbRect.y + 65;
                var thunmbBitmap_1 = ImageManager.loadThumbnail(savefileId, info);
                if (!thunmbBitmap_1.isReady()) {
                    // 読み込み終わるまで別のビットマップを表示
                    var empty = ImageManager.loadBusyThumbBitmap(thumbRect.width, thumbRect.height);
                    sprite_1.bitmap = empty;
                }
                thunmbBitmap_1.addLoadListener(function () {
                    // 読み込み終わったときにリスト表示範囲内であれば描画
                    if (_this.topIndex() <= listIndex && _this.bottomIndex() >= listIndex) {
                        sprite_1.visible = true;
                        sprite_1.bitmap = thunmbBitmap_1;
                        sprite_1.bitmap.paintOpacity = valid ? 255 : _this.translucentOpacity();
                    }
                    else {
                        sprite_1.visible = false;
                    }
                });
            }
        };
        Window_SavefileList2.prototype.drawPlaytime = function (info, x, y, width) {
            if (info.playtime) {
                this.contents.fontSize = 22;
                this.drawText(info.playtime, x, y, width, 'right');
            }
        };
        Window_SavefileList2.prototype.selectedId = function () {
            return this.index() + this.pageTopIndex();
        };
        Window_SavefileList2.prototype.maxCols = function () {
            return maxCols;
        };
        Window_SavefileList2.prototype.itemHeight = function () {
            return (this._height / MAX_ROW) - this.spacing();
        };
        Window_SavefileList2.prototype.setPageIndex = function (page) {
            this._page = page;
            this.refresh();
            this.activate();
        };
        Window_SavefileList2.prototype.cursorUp = function (wrap) {
            var index = this.index();
            if (index - this.maxCols() < 0) {
                this.callHandler('up');
                return;
            }
            _super.prototype.cursorUp.call(this, wrap);
        };
        ;
        Window_SavefileList2.prototype.cursorDown = function (wrap) {
            var index = this.index();
            var maxItems = this.maxItems();
            if (index + this.maxCols() >= maxItems) {
                this.callHandler('down');
                return;
            }
            _super.prototype.cursorDown.call(this, wrap);
        };
        ;
        Window_SavefileList2.prototype.cursorRight = function (wrap) {
            var index = this.index();
            var maxItems = this.maxItems();
            if (index + 1 >= maxItems) {
                this.callHandler('right');
                return;
            }
            _super.prototype.cursorRight.call(this, wrap);
        };
        Window_SavefileList2.prototype.cursorLeft = function (wrap) {
            var index = this.index();
            if (index == 0) {
                this.callHandler('left');
                return;
            }
            _super.prototype.cursorLeft.call(this, wrap);
        };
        Window_SavefileList2.prototype.scrollDown = function (wrap) {
            SoundManager.playCursor();
            this.callHandler('pagedown');
        };
        Window_SavefileList2.prototype.scrollUp = function (wrap) {
            SoundManager.playCursor();
            this.callHandler('pageup');
        };
        ;
        return Window_SavefileList2;
    }(Window_SavefileList));
    var Window_SavePage = /** @class */ (function (_super) {
        __extends(Window_SavePage, _super);
        function Window_SavePage() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Window_SavePage.prototype.refresh = function () {
            this.margin = 0;
            this.makeItems();
            _super.prototype.refresh.call(this);
        };
        Window_SavePage.prototype.makeItems = function () {
            this._data = [];
            for (var i = 0; i < maxPage; i++) {
                this._data.push(i);
            }
        };
        Window_SavePage.prototype.maxCols = function () {
            return 99;
        };
        Window_SavePage.prototype.maxItems = function () {
            if (!this._data) {
                return 0;
            }
            return this._data.length;
        };
        Window_SavePage.prototype.itemRect = function (index) {
            var rect = new Rectangle();
            var maxCols = this.maxCols();
            rect.width = this.itemWidth();
            rect.height = this.itemHeight();
            rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX + 40;
            rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
            return rect;
        };
        Window_SavePage.prototype.drawItem = function (index) {
            this.contents.fontSize = 24;
            var rect = this.itemRect(index);
            var data = this._data[index];
            this.resetTextColor();
            this.changePaintOpacity(index == this._index);
            if (data >= RECOLLECTION_PAGE - 1) {
                var text = RECO_LABEL_JP;
                switch ($gameVariables.value(1999)) {
                    case 2:
                        text = RECO_LABEL_EN;
                        break;
                    case 3:
                        text = RECO_LABEL_CH;
                        break;
                }
                this.drawText(text.format(data + 2 - RECOLLECTION_PAGE), rect.x, -5, 40, 30, 'center');
            }
            else {
                this.drawText(data + 1, rect.x, -5, 30, 30, 'center');
            }
        };
        Window_SavePage.prototype.itemWidth = function () {
            return 50;
        };
        Window_SavePage.prototype.setPage = function (page) {
            this._index = page;
            this.refresh();
        };
        Window_SavePage.prototype.left = function () {
            this._index--;
            if (this._index < 0) {
                this._index = this._data.length - 1;
            }
            this.refresh();
            return this.page();
        };
        Window_SavePage.prototype.right = function () {
            this._index++;
            if (this._index == this._data.length) {
                this._index = 0;
            }
            this.refresh();
            return this.page();
        };
        Window_SavePage.prototype.page = function () {
            return this._data[this._index];
        };
        return Window_SavePage;
    }(Window_Selectable));
    var Window_Confirm = /** @class */ (function (_super) {
        __extends(Window_Confirm, _super);
        function Window_Confirm() {
            var _this_1 = this;
            var w = 680;
            var h = 150;
            var y = (Graphics.boxHeight - h) / 2;
            _this_1 = _super.call(this, (Graphics.boxWidth - w) / 2, y, w, h) || this;
            _this_1.update();
            return _this_1;
        }
        Window_Confirm.prototype.setInfo = function (ok) {
            this._ok = ok;
            this.refresh();
        };
        Window_Confirm.prototype.setText = function (text) {
            this._text = text;
            this._texts = null;
            this.height = 140;
            this.refresh();
        };
        Window_Confirm.prototype.setTexts = function (texts) {
            this._texts = texts;
            this.height = 180;
            this.refresh();
        };
        Window_Confirm.prototype.makeCommandList = function () {
            var loadText = LOAD_LABEL_JP;
            switch ($gameVariables.value(1999)) {
                case 2:
                    loadText = LOAD_LABEL_EN;
                    break;
                case 3:
                    loadText = LOAD_LABEL_CH;
                    break;
            }
            var deleteText = DELETE_LABEL_JP;
            switch ($gameVariables.value(1999)) {
                case 2:
                    deleteText = DELETE_LABEL_EN;
                    break;
                case 3:
                    deleteText = DELETE_LABEL_CH;
                    break;
            }
            this.addCommand(loadText, 'ok', this._ok);
            this.addCommand(deleteText, 'delete', true);
            this.addCommand(TextManager.cancel, 'cancel', true);
        };
        Window_Confirm.prototype.windowWidth = function () {
            return 620;
        };
        Window_Confirm.prototype.windowHeight = function () {
            return 140;
        };
        Window_Confirm.prototype.maxCols = function () {
            return 3;
        };
        Window_Confirm.prototype.refresh = function () {
            _super.prototype.refresh.call(this);
            if (this._texts) {
                var yy = 4;
                for (var _i = 0, _a = this._texts; _i < _a.length; _i++) {
                    var t = _a[_i];
                    this.drawText(t, 10, yy, this.windowWidth() - 60, 'center');
                    yy += 35;
                }
            }
            else {
                this.drawText(this._text, 10, 4, this.windowWidth() - 60, 'center');
            }
        };
        Window_Confirm.prototype.itemRect = function (index) {
            var rect = new Rectangle(0, 0, 0, 0);
            var maxCols = this.maxCols();
            rect.width = this.itemWidth();
            rect.height = this.itemHeight();
            rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
            rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY + 64;
            if (this._texts) {
                rect.y += 40;
            }
            return rect;
        };
        Window_Confirm.prototype.spacing = function () {
            return 8;
        };
        return Window_Confirm;
    }(Window_HorzCommand));
    Nore.Window_Confirm = Window_Confirm;
    var _DataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue = function (savefileId) {
        var lastAccessId = this._lastAccessedId;
     

        let result;
        if (this.isThisGameFile2(savefileId)) {
            var json = StorageManager.load(savefileId);
            this.createGameObjects();
            this.extractSaveContents(JsonEx.parse(json));
            this._lastAccessedId = savefileId;
            result = true;
        } else {
            result = false;
        }
        
        $gameTemp.interceptorType = 2;

        if (this._lastAccessedId >= getRecoStartId()) {
            this._lastAccessedId = lastAccessId;
        }
        if (this._lastAccessedId == Nore.AUTO_SAVE_DUMMY_ID) {
            this._lastAccessedId = lastAccessId;
        }
        return result;
    };


    var _Nore_DataManager_isThisGameFile = DataManager.isThisGameFile;
    DataManager.isThisGameFile2 = function(savefileId) {

        const result = _Nore_DataManager_isThisGameFile.apply(this, arguments);
        if (! result) {
            if (StorageManager.exists(savefileId)) {
          
                return true;
            }
            return false;
        }
     
        return true;
    };


})(Nore || (Nore = {}));
/*
(function () {
    function p(arg) {
        console.log(arg);
    }
    window.p = p;
})();
*/