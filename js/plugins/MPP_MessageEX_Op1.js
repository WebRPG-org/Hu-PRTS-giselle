//=============================================================================
// MPP_MessageEX_Op1.js
//=============================================================================
// Copyright (c) 2021 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MV MZ
 * @plugindesc Add functions related to the name window and face graphic window to the text display.
 * @author Mokusei Penguin
 * @url 
 * 
 * @base MPP_MessageEX
 * @orderAfter MPP_MessageEX
 *
 * @help [version 1.1.0]
 * This plugin is for RPG Maker MV and MZ.
 * 
 * ▼ [Display text] control characters
 *  - The following applies if it is included in the text
 *   \NW[S]        # Display string S in name window
 *   \NC[n]        # Change the text color of the name window to n
 *   \FL           # Face graphic on the left(※1)
 *   \FR           # Face graphic on the right(※1)
 *   \FM           # Flip face graphic left and right(※1)
 *   \FW           # Display face graphic in a separate window(※1)
 * 
 *  - All control characters can be in either case
 * 
 * ▼ Control character details
 *  ※1: \FL, \FR, \FM, \FW (Face graphic related)
 *   - These control characters can be used in combination.
 *   - If the head is F, the order after that is appropriate and OK.
 *       Example: \FRM
 *                  => Face graphic is displayed flipped to the right
 *                \FWR
 *                  => Show face graphic window on the right
 *  
 * ▼ Plugin command details
 *  - In MV, the variable N is referred to by writing v [N] in the item for
 *    inputting a numerical value.
 *  - In MZ, in the item to enter a numerical value, select the text and
 *    write v [N] to refer to the variable N.
 *    
 *  〇 MV / MZ
 *  
 *  〇 SetSpeakerName name  / speakerName
 *       name : Not set and hidden
 *   - Change the name displayed in the Name window.
 *   - Differences from \NW[s] apply from using this command until a different
 *     name is set for this command or \NW[s].
 *   - You can also use control commands such as \RB[S,R], display icons and
 *     item names.
 *   - Due to the specifications of the plug-in command, spaces cannot be used.
 *     (MV only)
 *   - If you want to use whitespace, use the \SET[n] command.
 *   - We do not recommend using this command with RPG Maker MZ.
 * 
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠ is half-width)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 * 
 * @command speakerName
 * @desc 
 *
 * @arg name
 * @desc 
 * @default 
 * 
 *
 * @param Name Window
 * @desc 
 * @type struct<NameWindow>
 * @default {"Offset X":"0","Offset Y":"0","Padding":"12","Offset Line Spacing":"0","Windowskin":"Window","Default Color":"0","Font Size":"","Ruby Color":"255,255,255","Always Leave Ruby Height":"false"}
 * 
 * @param Face Window
 * @desc 
 * @type struct<FaceWindow>
 * @default {"Offset X":"0","Offset Y":"0","Padding":"12","Windowskin":"Window"}
 * 
 */

/*~struct~NameWindow:
 * @param Offset X
 * @desc 
 * @type number
 * @min -3000
 * @default 0
 *
 * @param Offset Y
 * @desc 
 * @type number
 * @min -3000
 * @default -56
 *
 * @param Padding
 * @desc 
 * @type number
 * @default 12
 *
 * @param Offset Line Spacing
 * @desc 
 * @type number
 * @min -999
 * @default 0
 *
 * @param Windowskin
 * @desc 
 * @type file
 * @require 1
 * @dir img/system
 * @default Window
 *
 * @param Default Color
 * @desc Specified by color number
 * @type number
 * @default 0
 *
 * @param Font Size
 * @desc Default value if not set
 * (Default: MV=28, MZ=26)
 * @type number
 * @min 4
 * @default 
 * 
 * @param Ruby Color
 * @desc Not set and always the same as the text color
 * @default 255,255,255
 *
 * @param Always Leave Ruby Height
 * @desc 
 * @type boolean
 * @default false
 *
 */

/*~struct~FaceWindow:
 * @param Offset X
 * @desc 
 * @type number
 * @default 0
 *
 * @param Offset Y
 * @desc 
 * @type number
 * @default 0
 *
 * @param Padding
 * @desc 
 * @type number
 * @default 12
 *
 * @param Windowskin
 * @desc 
 * @type file
 * @require 1
 * @dir img/system
 * @default Window
 */

/*:ja
 * @target MV MZ
 * @plugindesc 文章の表示に名前ウィンドウや顔グラフィックウィンドウに関する機能を追加します。
 * @author 木星ペンギン
 * @url 
 * 
 * @base MPP_MessageEX
 * @orderAfter MPP_MessageEX
 *
 * @help [version 1.1.0]
 * このプラグインはRPGツクールMVおよびMZ用です。
 * 
 * ▼ [文章の表示]の制御文字
 *  - 以下は文章内に含まれていた場合に適用
 *   \NW[S]        # 文字列Sを名前ウィンドウに表示
 *   \NC[n]        # 名前ウィンドウの文字色をn番に変更
 *   \FL           # 顔グラフィックを左側に表示(※1)
 *   \FR           # 顔グラフィックを右側に表示(※1)
 *   \FM           # 顔グラフィックを左右反転(※1)
 *   \FW           # 顔グラフィックを別ウィンドウで表示(※1)
 * 
 *  - すべての制御文字は大文字小文字どちらでも可能
 * 
 * ▼ 制御文字詳細
 *  ※1: \FL, \FR, \FM, \FW (顔グラフィック関連)
 *   - これらの制御文字は組み合わせて使用できます。
 *   - 頭がFであれば、そのあとの順番は適当でOKです。
 *       例: \FRM
 *             => 顔グラフィックを右側に左右反転に表示
 *           \FWR
 *             => 顔グラフィックウィンドウを右側に表示
 *  
 * ▼ プラグインコマンド詳細
 *  - MVでは数値を入力する項目で v[N] と記述することで変数N番を参照します。
 *  - MZでは数値を入力する項目で、テキストを選択して v[N] と記述することで
 *    変数N番を参照します。
 *    
 *  〇 MV / MZ
 *  
 *  〇 SetSpeakerName name  / メッセージ名前表示
 *       name : 名前 (未設定で非表示)
 *   - 名前ウィンドウに表示する名前を変更します。
 *   - \NW[s] との違いは、このコマンドを使用してからこのコマンドや\NW[s]で
 *     別の名前が設定されるまで適用されます。
 *   - \RB[S,R],アイコンやアイテム名の表示といった制御コマンドも使用できます。
 *   - プラグインコマンドの仕様上、空白は使用できません。(MVのみ)
 *   - 空白を使用したい場合、\SET[n]コマンドを使用してください。
 *   - RPGツクールMZでこのコマンドを使用することはお勧めしません。
 * 
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠は半角)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 * 
 * @command speakerName
 * @text 名前表示
 * @desc 
 *
 * @arg name
 * @desc 
 * @default 
 * 
 *
 * @param Name Window
 * @text 名前ウィンドウ
 * @desc 
 * @type struct<NameWindow>
 * @default {"Offset X":"0","Offset Y":"0","Padding":"12","Offset Line Spacing":"0","Windowskin":"Window","Default Color":"0","Font Size":"","Ruby Color":"255,255,255","Always Leave Ruby Height":"false"}
 * 
 * @param Face Window
 * @text 顔グラウィンドウ
 * @desc 
 * @type struct<FaceWindow>
 * @default {"Offset X":"0","Offset Y":"0","Padding":"12","Windowskin":"Window"}
 * 
 */

/*~struct~NameWindow:ja
 * @param Offset X
 * @text X軸補正値
 * @desc 
 * @type number
 * @min -3000
 * @default 0
 *
 * @param Offset Y
 * @text Y軸補正値
 * @desc 
 * @type number
 * @min -3000
 * @default -56
 *
 * @param Padding
 * @text 余白
 * @desc 
 * @type number
 * @default 12
 *
 * @param Offset Line Spacing
 * @text 行の高さ補正値
 * @desc 
 * @type number
 * @min -999
 * @default 0
 *
 * @param Windowskin
 * @text ウィンドウスキン
 * @desc 
 * @type file
 * @require 1
 * @dir img/system
 * @default Window
 *
 * @param Default Color
 * @text 文字色のデフォルト値
 * @desc 色番号で指定
 * @type number
 * @default 0
 *
 * @param Font Size
 * @text 文字サイズ
 * @desc 未設定の場合、デフォルト値
 * (デフォルト値: MV=28, MZ=26)
 * @type number
 * @min 4
 * @default 
 * 
 * @param Ruby Color
 * @text 名前のルビの色
 * @desc 未設定で常に文字色と同じ
 * @default 255,255,255
 *
 * @param Always Leave Ruby Height
 * @text 常にルビの高さを空ける
 * @desc 
 * @type boolean
 * @default false
 *
 */

/*~struct~FaceWindow:ja
 * @param Offset X
 * @text X軸補正値
 * @desc 
 * @type number
 * @default 0
 *
 * @param Offset Y
 * @text Y軸補正値
 * @desc 
 * @type number
 * @default 0
 *
 * @param Padding
 * @text 余白
 * @desc 
 * @type number
 * @default 12
 *
 * @param Windowskin
 * @text ウィンドウスキン
 * @desc 
 * @type file
 * @require 1
 * @dir img/system
 * @default Window
 */

(() => {
    'use strict';
    
    const pluginName = 'MPP_MessageEX_Op1';
    
    // Plugin Parameters
    const parameters = PluginManager.parameters(pluginName);
    const paramReplace = (key, value) => {
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    };
    const param_NameWindow = JSON.parse(parameters['Name Window'] || '{}', paramReplace);
    const param_FaceWindow = JSON.parse(parameters['Face Window'] || '{}', paramReplace);
    
    // MPP_MessageEX.js
    const baseParameters = PluginManager.parameters('MPP_MessageEX');
    const param_RubyOy = Number(baseParameters['Ruby Oy'] || 0);
    const param_DefaultRubySize = Number(baseParameters['Default Ruby Size'] || 14);
    
    // Dealing with other plugins
    const __base = (obj, prop) => {
        if (obj.hasOwnProperty(prop)) {
            return obj[prop];
        } else {
            const proto = Object.getPrototypeOf(obj);
            return function () { return proto[prop].apply(this, arguments); };
        }
    };
    
    // RPG Maker Param
    const _textColor = function(index) {
        return Utils.RPGMAKER_NAME === 'MV'
                    ? this.textColor(index)
                    : ColorManager.textColor(index);
    };
    const _fontSize = function() {
        return Utils.RPGMAKER_NAME === 'MV'
                    ? this.standardFontSize()
                    : $gameSystem.mainFontSize();
    };
    
    //-------------------------------------------------------------------------
    // PluginManager
    
    PluginManager.registerCommand(pluginName, 'speakerName', args => {
        $gameMessage.setBasicSpeakerName(args.name || '');
    });

    //-------------------------------------------------------------------------
    // Game_Message

    const _Game_Message_initialize = Game_Message.prototype.initialize;
    Game_Message.prototype.initialize = function() {
        _Game_Message_initialize.apply(this, arguments);
        this._basicSpeakerName = '';
    };

    const _Game_Message_clear = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.apply(this, arguments);
        this._nameColorIndex = 0;
    };

    Game_Message.prototype.clearBasicSpeakerName = function() {
        this._basicSpeakerName = '';
    };

    Game_Message.prototype.basicSpeakerName = function() {
        return this._basicSpeakerName;
    };

    Game_Message.prototype.nameColorIndex = function() {
        return this._nameColorIndex;
    };

    Game_Message.prototype.setBasicSpeakerName = function(name) {
        this._basicSpeakerName = name || '';
    };
    
    Game_Message.prototype.setNameColorIndex = function(colorIndex) {
        this._nameColorIndex = colorIndex;
    };

    if (!Game_Message.prototype.isRTL) {
        Game_Message.prototype.isRTL = function() {
            return false;
        };
    }

    //-----------------------------------------------------------------------------
    // Game_Interpreter

    const _mzCommands = {
        SetSpeakerName: { name:'speakerName', keys:['name'] }
    };
    Object.assign(_mzCommands, {
        'メッセージ名前表示': _mzCommands.SetSpeakerName
    });

    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        const params = _mzCommands[command];
        if (params) {
            const args2 = Object.assign(...params.keys.map((k,i) => ({[k]:args[i]})));
            PluginManager.callCommand(this, pluginName, params.name, args2);
        }
    };
    
    //-----------------------------------------------------------------------------
    // Window_Message

    Window_Message.prototype.setFaceBoxWindow = function(faceBoxWindow) {
        this._faceBoxWindow = faceBoxWindow;
    };
    
    Window_Message.prototype.setNameBoxWindow = function(nameBoxWindow) {
        this._nameBoxWindow = nameBoxWindow;
    };

    const _Window_Message_clearFlagsMessageEx = Window_Message.prototype.clearFlagsMessageEx;
    Window_Message.prototype.clearFlagsMessageEx = function() {
        _Window_Message_clearFlagsMessageEx.call(this);
        this._faceParams = { mirror:$gameMessage.isRTL() };
        this._speakerName = '';
        this._nameColorIndex = param_NameWindow['Default Color'] || 0;
    };

    const _Window_Message_convertEscapeCharacters = Window_Message.prototype.convertEscapeCharacters;
    Window_Message.prototype.convertEscapeCharacters = function(text) {
        text = _Window_Message_convertEscapeCharacters.apply(this, arguments);
        text = text.replace(/\x1bF([LRMW]+)/gi, (_, p1) => {
            const code = p1.toUpperCase();
            if (code.includes('L')) this._faceParams.right = false;
            if (code.includes('R')) this._faceParams.right = true;
            if (code.includes('M')) this._faceParams.mirror = true;
            if (code.includes('W')) this._faceParams.onBox = true;
            return '';
        });
        text = text.replace(/\x1bNW\[([^\]]+)\]/gi, (_, p1) => {
            this._speakerName = p1;
            return '';
        });
        text = text.replace(/\x1bNC\[(\d+)\]/gi, (_, p1) => {
            this._nameColorIndex = Number(p1);
            return '';
        });
        return text;
    };

    const _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        _Window_Message_update.apply(this, arguments);
        this.synchronizeNameBoxMV();
    };

    Window_Message.prototype.synchronizeNameBoxMV = function() {
        if (Utils.RPGMAKER_NAME === 'MV') {
            this._nameBoxWindow.openness = this.openness;
        }
    };

    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        this._faceBoxWindow.clear();
        _Window_Message_startMessage.apply(this, arguments);
        this._faceBoxWindow.start();
        this._nameBoxWindow.start();
    };

    const _Window_Message_terminateMessageEx = Window_Message.prototype.terminateMessageEx;
    Window_Message.prototype.terminateMessageEx = function() {
        _Window_Message_terminateMessageEx.call(this);
        this._faceBoxWindow.needClose();
    };

    const _Window_Message_newPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
        _Window_Message_newPage.apply(this, arguments);
        if (Utils.RPGMAKER_NAME === 'MV') this.updateSpeakerNameMv();
        this.updateSpeakerFace();
    };

    const _Window_Message_updateSpeakerName = Window_Message.prototype.updateSpeakerName;
    Window_Message.prototype.updateSpeakerName = function() {
        $gameMessage.setNameColorIndex(this._nameColorIndex);
        _Window_Message_updateSpeakerName.apply(this, arguments);
    };

    Window_Message.prototype.updateSpeakerNameMv = function() {
        $gameMessage.setNameColorIndex(this._nameColorIndex);
        if (this._speakerName !== '') {
            $gameMessage.clearBasicSpeakerName();
        }
        const name = this._speakerName || $gameMessage.basicSpeakerName();
        this._nameBoxWindow.setName(name);
    };

    Window_Message.prototype.updateSpeakerFace = function() {
        const faceName = $gameMessage.faceName();
        const faceIndex = $gameMessage.faceIndex();
        this._faceBoxWindow.setParam(faceName, faceIndex, this._faceParams);
    };

    Window_Message.prototype.drawMessageFace = function() {
        this._faceBoxWindow.refresh();
    };

    const _Window_Message_newLineX = Window_Message.prototype.newLineX;
    Window_Message.prototype.newLineX = function() {
        const { right, onBox = false } = this._faceParams;
        return onBox || right ? 0 : _Window_Message_newLineX.apply(this, arguments);
    };

    //-------------------------------------------------------------------------
    // Window_FaceBox

    function Window_FaceBox() {
        this.initialize.apply(this, arguments);
    }

    Window_FaceBox.prototype = Object.create(Window_Base.prototype);
    Window_FaceBox.prototype.constructor = Window_FaceBox;

    Window_FaceBox.prototype.initialize = function() {
        if (Utils.RPGMAKER_NAME === 'MV') {
            Window_Base.prototype.initialize.call(this, 0, 0, 0, 0);
        } else {
            Window_Base.prototype.initialize.call(this, new Rectangle());
        }
        this.openness = 0;
        this._targetX = 0;
        this._moveDuration = 0;
        this._needClose = false;
        this.clear();
    };

    Window_FaceBox.prototype.setMessageWindow = function(messageWindow) {
        this._messageWindow = messageWindow;
    };
    
    Window_FaceBox.prototype.clear = function() {
        this._faceName = '';
        this._faceIndex = 0;
        this._onBox = false;
        this._mirror = false;
        this._right = false;
    };

    Window_FaceBox.prototype.loadWindowskin = function() {
        const name = param_FaceWindow['Windowskin'] || 'Window';
        this.windowskin = ImageManager.loadSystem(name);
    };

    Window_FaceBox.prototype.needClose = function() {
        this._needClose = true;
    };

    Window_FaceBox.prototype.setParam = function(faceName, faceIndex, params) {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
        this._onBox = !!params.onBox;
        this._right = params.right;
        this._mirror = !!params.mirror;
    };

    Window_FaceBox.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this._needClose) {
            this.close();
            this._needClose = false;
        }
        this.updateMove();
    };

    Window_FaceBox.prototype.updateMove = function() {
        if (this._moveDuration > 0) {
            const d = this._moveDuration;
            this.x = (this.x * (d - 1) + this._targetX) / d;
            this._moveDuration--;
        }
    };

    Window_FaceBox.prototype.start = function() {
        this.updatePlacement();
        this.updateBackground();
        this.updateMirror();
        this.appear();
        this.createContents();
    };

    Window_FaceBox.prototype.appear = function() {
        this._targetX = this.windowX();
        const targetY = this.windowY();
        if (!this._onBox) {
            this.x = this._targetX;
            this._moveDuration = 0;
        } else if (this.isClosed() || this.x !== this._targetX ||
                this.y !== targetY) {
            const boxMarginX = (Graphics.width - Graphics.boxWidth) / 2
            this.x = (this._right ? Graphics.width : -this.width) - boxMarginX;
            this._moveDuration = 8;
        }
        this.y = targetY;
        this.openness = 255;
        this._closing = false;
        this._needClose = false;
    };

    Window_FaceBox.prototype.updatePlacement = function() {
        this.padding = this._onBox
                        ? param_FaceWindow['Padding'] || 12
                        : this._messageWindow.padding;
        this.width = this.windowWidth();
        this.height = this.windowHeight();
    };

    Window_FaceBox.prototype.windowX = function() {
        const messageWindow = this._messageWindow;
        const targetX = messageWindow.x
                + (this._right ? messageWindow.width - this.width : 0);
        if (this._onBox) {
            const offsetX = param_FaceWindow['Offset X'] || 0;
            return targetX + offsetX;
        } else {
            return targetX;
        }
    };

    Window_FaceBox.prototype.windowY = function() {
        const messageWindow = this._messageWindow;
        if (this._onBox) {
            const offsetY = param_FaceWindow['Offset Y'] || 0;
            if (messageWindow.y >= this.height) {
                return messageWindow.y - this.height + offsetY;
            } else {
                return messageWindow.y + messageWindow.height + offsetY;
            }
        } else {
            return messageWindow.y;
        }
    };

    Window_FaceBox.prototype.updateBackground = function() {
        const background = this._onBox ? $gameMessage.background() : 2;
        this.setBackgroundType(background);
        this._isWindow = this._onBox;
    };

    Window_FaceBox.prototype.updateMirror = function() {
        const contentsSprite = this._windowContentsSprite ||
                                this._contentsSprite;
        contentsSprite.anchor.x = this._mirror ? 1 : 0;
        contentsSprite.scale.x = this._mirror ? -1 : 1;
    };

    Window_FaceBox.prototype.windowWidth = function() {
        const faceWidth = Window_Base._faceWidth || ImageManager.faceWidth;
        const padding = this.padding + (this._onBox ? 0 : 4);
        return faceWidth + padding * 2;
    };

    Window_FaceBox.prototype.windowHeight = function() {
        if (this._onBox) {
            const faceHeight = Window_Base._faceHeight || ImageManager.faceHeight;
            return faceHeight + this.padding * 2;
        } else {
            return this._messageWindow.height;
        }
    };

    Window_FaceBox.prototype.refresh = function() {
        this.contents.clear();
        const height = this.height - this.padding * 2;
        const faceHeight = Window_Base._faceHeight || ImageManager.faceHeight;
        const dx = this._onBox ? 0 : 4;
        const dy = Math.floor((height - faceHeight) / 2);
        Window_Base.prototype.drawFace.call(
            this, this._faceName, this._faceIndex, dx, dy
        );
    };

    //-------------------------------------------------------------------------
    // Window_NameBox
    
    if (Utils.RPGMAKER_NAME === 'MZ') {

        Window_NameBox.prototype.loadWindowskin = function() {
            const name = param_NameWindow['Windowskin'] || 'Window';
            this.windowskin = ImageManager.loadSystem(name);
        };

        Window_NameBox.prototype.lineHeight = function() {
            const spacing = param_NameWindow['Offset Line Spacing'] || 0;
            return this.contents.fontSize + 10 + spacing;
        };

        Window_NameBox.prototype.updatePadding = function() {
            this.padding = param_NameWindow['Padding']
                            ||$gameSystem.windowPadding();
        };

        const _Window_NameBox_resetFontSettings = Window_NameBox.prototype.resetFontSettings;
        Window_NameBox.prototype.resetFontSettings = function() {
            _Window_NameBox_resetFontSettings.apply(this, arguments);
            this.contents.fontSize = param_NameWindow['Font Size'] || _fontSize.call(this);
            this.resetTextColor();
        };

        const _Window_NameBox_resetTextColor = __base(Window_NameBox.prototype, 'resetTextColor');
        Window_NameBox.prototype.resetTextColor = function() {
            _Window_NameBox_resetTextColor.apply(this, arguments);
            const color = _textColor.call(this, $gameMessage.nameColorIndex());
            this.changeTextColor(color);
        };

        // overwrite
        Window_NameBox.prototype.windowHeight = function() {
            return this.itemHeight() + this.padding * 2 + this._rubyHeight;
        };

        Window_NameBox.prototype.createTextState = function(text, x, y, width) {
            const textState = Window_Base.prototype.createTextState.apply(this, arguments);
            textState.y += this._rubyHeight;
            return textState;
        };

        const _Window_NameBox_start = Window_NameBox.prototype.start;
        Window_NameBox.prototype.start = function() {
            this.updateRubyHeight();
            _Window_NameBox_start.apply(this, arguments);
        };

        Window_NameBox.prototype.updateRubyHeight = function() {
            Window_NameBoxMV.prototype.updateRubyHeight.call(this);
        };

        const _Window_NameBox_processEscapeCharacter = __base(Window_NameBox.prototype, 'processEscapeCharacter');
        Window_NameBox.prototype.processEscapeCharacter = function(code, textState) {
            if (code === 'RB') {
                this.processRubyCharacter(textState, this.obtainEscapeTexts(textState));
            } else {
                _Window_NameBox_processEscapeCharacter.apply(this, arguments);
            }
        };

        Window_NameBox.prototype.obtainEscapeTexts = function(textState) {
            return Window_Message.prototype.obtainEscapeTexts.call(this, textState);
        };

        Window_NameBox.prototype.processRubyCharacter = function(textState, texts) {
            const c = texts[0];
            const cw = this.textWidth(c);
            const fontSize = this.contents.fontSize;
            const textColor = this.contents.textColor;
            this.contents.fontSize = param_DefaultRubySize;
            const r = texts[1];
            const rw = this.textWidth(r);
            const maxWidth = Math.max(cw, rw);
            if (textState.drawing) {
                if (param_NameWindow['Ruby Color']) {
                    this.changeTextColor('rgb(%1)'.format(param_NameWindow['Ruby Color']));
                }
                const rx = textState.x + (maxWidth - rw) / 2;
                const ry = textState.y - this._rubyHeight + param_RubyOy;
                this.contents.drawText(r, rx, ry, rw * 2, param_DefaultRubySize + 4);

                const cx = textState.x + (maxWidth - cw) / 2;
                this.changeTextColor(textColor);
                this.contents.fontSize = fontSize;
                this.contents.drawText(c, cx, textState.y, cw * 2, textState.height);
            } else {
                this.contents.fontSize = fontSize;
            }
            textState.x += maxWidth;
        };

        const _Window_NameBox_updatePlacement = Window_NameBox.prototype.updatePlacement;
        Window_NameBox.prototype.updatePlacement = function() {
            _Window_NameBox_updatePlacement.apply(this, arguments);
            const offsetX = param_NameWindow['Offset X'] || 0;
            const offsetY = param_NameWindow['Offset Y'] || 0;
            this.x += $gameMessage.isRTL() ? -offsetX : offsetX;
            this.y += this._messageWindow.y > 0 ? offsetY : -offsetY;
        };
        
    }

    //-------------------------------------------------------------------------
    // Window_NameBoxMV
    
    function Window_NameBoxMV() {
        this.initialize(...arguments);
    }

    Window_NameBoxMV.prototype = Object.create(Window_Base.prototype);
    Window_NameBoxMV.prototype.constructor = Window_NameBoxMV;

    Window_NameBoxMV.prototype.initialize = function() {
        Window_Base.prototype.initialize.call(this, 0, 0, 0, 0);
        this.openness = 0;
        this._name = '';
    };

    Window_NameBoxMV.prototype.lineHeight = function() {
        const spacing = param_NameWindow['Offset Line Spacing'] || 0;
        return this.contents.fontSize + 8 + spacing;
    };

    Window_NameBoxMV.prototype.standardPadding = function() {
        return param_NameWindow['Padding']
                || Window_Base.prototype.standardPadding.call(this);
    };

    Window_NameBoxMV.prototype.setMessageWindow = function(messageWindow) {
        this._messageWindow = messageWindow;
    };

    Window_NameBoxMV.prototype.loadWindowskin = function() {
        const name = param_NameWindow['Windowskin'] || 'Window';
        this.windowskin = ImageManager.loadSystem(name);
    };

    Window_NameBoxMV.prototype.setName = function(name) {
        if (this._name !== name) {
            this._name = name;
            this.refresh();
        }
    };

    Window_NameBoxMV.prototype.clear = function() {
        this.setName('');
    };

    Window_NameBoxMV.prototype.start = function() {
        this.updateRubyHeight();
        this.updatePlacement();
        this.updateBackground();
        this.createContents();
        this.refresh();
    };

    Window_NameBoxMV.prototype.updateRubyHeight = function() {
        this._rubyHeight = 0;
        const text = this.convertEscapeCharacters(this._name);
        const regExp = /\x1bRB\[.+?\]/i;
        if (param_NameWindow['Always Leave Ruby Height'] || regExp.test(text)) {
            this._rubyHeight = Math.max(param_DefaultRubySize - param_RubyOy, 4);
        }
    };

    Window_NameBoxMV.prototype.updatePlacement = function() {
        this.width = this.windowWidth();
        this.height = this.windowHeight();
        const messageWindow = this._messageWindow;
        const offsetX = param_NameWindow['Offset X'] || 0;
        const offsetY = param_NameWindow['Offset Y'] || 0;
        this.x = messageWindow.x + offsetX;
        if (messageWindow.y > 0) {
            this.y = messageWindow.y - this.height + offsetY;
        } else {
            this.y = messageWindow.y + messageWindow.height - offsetY;
        }
    };

    Window_NameBoxMV.prototype.updateBackground = function() {
        this.setBackgroundType($gameMessage.background());
    };

    Window_NameBoxMV.prototype.windowWidth = function() {
        if (this._name) {
            const textWidth = this.textWidthEx(this._name);
            const padding = this.padding + this.textPadding();
            const width = Math.ceil(textWidth) + padding * 2;
            return Math.min(width, Graphics.boxWidth);
        } else {
            return 0;
        }
    };

    Window_NameBoxMV.prototype.windowHeight = function() {
        return this.fittingHeight(1) + this._rubyHeight;
    };

    Window_NameBoxMV.prototype.refresh = function() {
        this.contents.clear();
        const pad = this.textPadding();
        const width = this.contents.width - pad * 2;
        this.drawTextEx(this._name, pad, this._rubyHeight, width);
    };

    Window_NameBoxMV.prototype.textWidthEx = function(text) {
        return this.drawTextEx(text, 0, this.contents.height + this._rubyHeight);
    };

    Window_NameBoxMV.prototype.resetFontSettings = function() {
        Window_Base.prototype.resetFontSettings.call(this);
        this.contents.fontSize = param_NameWindow['Font Size'] || _fontSize.call(this);
        this.resetTextColor();
    };

    Window_NameBoxMV.prototype.resetTextColor = function() {
        Window_Base.prototype.resetTextColor.call(this);
        const color = _textColor.call(this, $gameMessage.nameColorIndex());
        this.changeTextColor(color);
    };
    
    Window_NameBoxMV.prototype.processEscapeCharacter = function(code, textState) {
        if (code === 'RB') {
            this.processRubyCharacter(textState, this.obtainEscapeTexts(textState));
        } else {
            Window_Base.prototype.processEscapeCharacter.call(this, code, textState);
        }
    };

    Window_NameBoxMV.prototype.obtainEscapeTexts = function(textState) {
        return Window_Message.prototype.obtainEscapeTexts.call(this, textState);
    };

    Window_NameBoxMV.prototype.processRubyCharacter = function(textState, texts) {
        const c = texts[0];
        const cw = this.textWidth(c);
        const fontSize = this.contents.fontSize;
        const textColor = this.contents.textColor;
        this.contents.fontSize = param_DefaultRubySize;
        const r = texts[1];
        const rw = this.textWidth(r);
        const maxWidth = Math.max(cw, rw);

        if (param_NameWindow['Ruby Color']) {
            this.changeTextColor('rgb(%1)'.format(param_NameWindow['Ruby Color']));
        }
        const rx = textState.x + (maxWidth - rw) / 2;
        const ry = textState.y - this._rubyHeight + param_RubyOy;
        this.contents.drawText(r, rx, ry, rw + 8, param_DefaultRubySize + 4);

        const cx = textState.x + (maxWidth - cw) / 2;
        this.changeTextColor(textColor);
        this.contents.fontSize = fontSize;
        this.contents.drawText(c, cx, textState.y, cw + 8, textState.height);
        textState.x += maxWidth;
    };

    Window_NameBoxMV.prototype.calcTextHeight = function(textState, all) {
        const textHeight = Window_Base.prototype.calcTextHeight.call(this, textState, all);
        const spacing = param_NameWindow['Offset Line Spacing'] || 0;
        return textHeight + spacing;
    };

    //-----------------------------------------------------------------------------
    // Scene_Message
    
    if (Utils.RPGMAKER_NAME === 'MZ') {

        const _Scene_Message_createAllWindows = Scene_Message.prototype.createAllWindows;
        Scene_Message.prototype.createAllWindows = function() {
            _Scene_Message_createAllWindows.apply(this, arguments);
            this.createFaceBoxWindow();
            this._messageWindow.setFaceBoxWindow(this._faceBoxWindow);
            this._faceBoxWindow.setMessageWindow(this._messageWindow);
        };

        Scene_Message.prototype.createFaceBoxWindow = function() {
            this._faceBoxWindow = new Window_FaceBox();
            const index = this._windowLayer.children.indexOf(this._nameBoxWindow);
            this._windowLayer.addChildAt(this._faceBoxWindow, index);
        };
        
    }
    
    //-------------------------------------------------------------------------
    // Scene_Map

    if (Utils.RPGMAKER_NAME === 'MV') {
        
        const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
        Scene_Map.prototype.createAllWindows = function() {
            _Scene_Map_createAllWindows.apply(this, arguments);
            this.createFaceBoxWindowMV();
            this.createNameBoxWindowMV();
            this.associateWindowsMessageEx();
        };

        Scene_Map.prototype.createFaceBoxWindowMV = function() {
            this._faceBoxWindow = new Window_FaceBox();
            this.addWindow(this._faceBoxWindow);
        };

        Scene_Map.prototype.createNameBoxWindowMV = function() {
            this._nameBoxWindow = new Window_NameBoxMV();
            this.addWindow(this._nameBoxWindow);
        };

        Scene_Map.prototype.associateWindowsMessageEx = function() {
            const messageWindow = this._messageWindow;
            messageWindow.setNameBoxWindow(this._nameBoxWindow);
            messageWindow.setFaceBoxWindow(this._faceBoxWindow);
            this._nameBoxWindow.setMessageWindow(messageWindow);
            this._faceBoxWindow.setMessageWindow(messageWindow);
        };
        
    }

    //-------------------------------------------------------------------------
    // Scene_Battle

    if (Utils.RPGMAKER_NAME === 'MV') {
        
        const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
        Scene_Battle.prototype.createAllWindows = function() {
            _Scene_Battle_createAllWindows.apply(this, arguments);
            this.createFaceBoxWindowMV();
            this.createNameBoxWindowMV();
            this.associateWindowsMessageEx();
        };

        Scene_Battle.prototype.createFaceBoxWindowMV = function() {
            this._faceBoxWindow = new Window_FaceBox();
            this.addWindow(this._faceBoxWindow);
        };

        Scene_Battle.prototype.createNameBoxWindowMV = function() {
            this._nameBoxWindow = new Window_NameBoxMV();
            this.addWindow(this._nameBoxWindow);
        };

        Scene_Battle.prototype.associateWindowsMessageEx = function() {
            const messageWindow = this._messageWindow;
            messageWindow.setNameBoxWindow(this._nameBoxWindow);
            messageWindow.setFaceBoxWindow(this._faceBoxWindow);
            this._nameBoxWindow.setMessageWindow(messageWindow);
            this._faceBoxWindow.setMessageWindow(messageWindow);
        };
        
    }
        
})();
