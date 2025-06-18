/*:
 * @plugindesc 画像で文字を描画するよ
 * @author ル
 * @version 1.01
 *
 *
 * @param numOffsetX
 * @text 画像数字のx座標の調整
 * @desc この値だけ、数字のx座標がずれます
 * @default 0
 *
 * @param numOffsetY
 * @text 画像数字のy座標の調整
 * @desc この値だけ、数字のy座標がずれます
 * @default 0
 *
 * @param width1
 * @text 画像数字の幅1
 * @desc １文字につきこれだけ幅がとられます
 * @default 12
 *
 * @param width2
 * @text 画像数字の幅2
 * @desc １文字につきこれだけ幅がとられます
 * @default 8
 *
 * @param textOffsetX
 * @text 画像文字のx座標の調整
 * @desc この値だけ、x座標がずれます
 * @default 0
 *
 * @param textOffsetY
 * @text 画像文字のy座標の調整
 * @desc この値だけ、y座標がずれます
 * @default 4
 */
var Nore;
(function (Nore) {
    // 設定
    var FONT_NAME = '游ゴシック';
    var FONT_SIZE = 18;
    var TEXT_COLOR = 0xffffff;
    var OUTLINE_COLOR = 0x2A1713;
    var HANKAKU_SPACE_WIDTH = 8;
    var ZENKAKU_SPACE_WIDTH = 16;
    var parameters = PluginManager.parameters('Nore_ImageFont');
    var numOffsetX = parseInt(parameters['numOffsetX']);
    var numOffsetY = parseInt(parameters['numOffsetY']);
    var textOffsetX = parseInt(parameters['textOffsetX']);
    var textOffsetY = parseInt(parameters['textOffsetY']);
    var width1 = parseInt(parameters['width1']);
    var width2 = parseInt(parameters['width2']);
    var _Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
    Scene_Boot.loadSystemImages = function () {
        _Scene_Boot_loadSystemImages.call(this);
        ImageManager.reserveSystem('Number');
    };
    function getBaseTexture() {
        var baseTexture = PIXI.utils.BaseTextureCache['system/Number'];
        if (!baseTexture) {
            var bitmap = ImageManager.loadSystem('Number');
            if (!bitmap.isReady()) {
                return;
            }
            baseTexture = new PIXI.BaseTexture(bitmap._image);
            //baseTexture.resource.url = 'system/Number';
            PIXI.utils.BaseTextureCache['system/Number'] = baseTexture;
        }
        return baseTexture;
    }
    Nore.getBaseTexture = getBaseTexture;
    var Sprite_Picture_prototype_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function () {
        Sprite_Picture_prototype_loadBitmap.call(this);
        if (!this.dTextInfo) {
            this.removeBitmapText();
        }
    };
    Sprite_Picture.prototype.removeBitmapText = function () {
        if (this.bitmapTextList) {
            for (var _i = 0, _a = this.bitmapTextList; _i < _a.length; _i++) {
                var b = _a[_i];
                b.destroy();
                this.removeChild(b);
            }
        }
    };
    var _Sprite_Picture_prototype_makeDynamicBitmap = Sprite_Picture.prototype.makeDynamicBitmap;
    Sprite_Picture.prototype.makeDynamicBitmap = function () {
        this.removeBitmapText();
        this.bitmapTextList = [];
        _Sprite_Picture_prototype_makeDynamicBitmap.call(this);
    };
    var _Sprite_Picture_prototype_processText = Sprite_Picture.prototype._processText;
    Sprite_Picture.prototype._processText = function (bitmap) {
        var text = this.dTextInfo.value.substr(0, this.dTextInfo.value.length - 1);
        var right = isRight(text);
        if (right) {
            text = text.substr(0, text.length - ' right'.length);
        }
        var re = /([0-9]*)( *)(　*)(.*)/g;
        var match = re.exec(text);
        //console.log(text)
        //console.log(match)
        if (!match) {
            console.error('テキストが不正です。' + text);
            return;
        }
        if (!match[1] && !isEroStatusScene()) {
            // エロステページでも数字描画でもない場合
            _Sprite_Picture_prototype_processText.call(this, bitmap);
            return;
        }
        var xx = 0;
        if (match[1]) {
            var fontType = choiceFontType(this.dTextInfo.size);
            if (right) {
                xx -= (match[1].length - 1) * fontWidth(fontType);
            }
            xx += this.drawNumber(parseInt(match[1]), numOffsetX + xx, numOffsetY, 100, fontType);
        }
        if (match[2]) {
            xx += HANKAKU_SPACE_WIDTH;
        }
        if (match[3]) {
            xx += ZENKAKU_SPACE_WIDTH;
        }
        if (match[4]) {
            this.addBitmapTexts(xx, match[4], FONT_SIZE);
        }
    };
    /**
     * 右詰めか？
     * @param text
     * @returns
     */
    function isRight(text) {
        var re = / right/g;
        var match = re.exec(text);
        return match;
    }
    function choiceFontType(size) {
        switch (size) {
            case 22: return 0;
            default: return 1;
        }
    }
    function isEroStatusScene() {
        /*if ($gameVariables.value(2000) > 0) {
            return true;
        }*/
        if ($gameSwitches.value(81)) {
            return true;
        }
        return false;
    }
    Sprite_Picture.prototype.addBitmapTexts = function (xx, text, size) {
        this.addBitmapText(text, size, OUTLINE_COLOR, xx + -1, -1);
        this.addBitmapText(text, size, OUTLINE_COLOR, xx + 1, -1);
        this.addBitmapText(text, size, OUTLINE_COLOR, xx + -1, 1);
        this.addBitmapText(text, size, OUTLINE_COLOR, xx + 1, 1);
        this.addBitmapText(text, size, TEXT_COLOR, xx + 0, 0);
    };
    Sprite_Picture.prototype.addBitmapText = function (text, size, color, x, y) {
        var bmtext = new PIXI.extras.BitmapText(text, {
            font: {
                name: FONT_NAME,
                size: size,
            },
            tint: color,
        });
        bmtext.x = textOffsetX + x;
        bmtext.y = textOffsetY + y;
        this.addChild(bmtext);
        this.bitmapTextList.push(bmtext);
    };
    function fontWidth(fontType) {
        switch (fontType) {
            case 0:
                return width1;
            case 1:
                return width2;
            default:
                return width2;
        }
    }
    Sprite_Picture.prototype.drawNumber = function drawNumber(num, x, y, w, type) {
        var baseTexture = getBaseTexture();
        if (!baseTexture) {
            return;
        }
        var xx = 0;
        var yy = type * 32;
        var pw = 32;
        var ph = 32;
        var ww = fontWidth(type);
        var str = num + '';
        if (num < 0) {
            str = Math.abs(num) + '';
        }
        var dx;
        for (var i = 0; i < str.length; i++) {
            var s = parseInt(str[i]);
            var sx = s * pw + xx;
            var sy = yy;
            var dy = y;
            dx = x + i * ww;
            var texture = new PIXI.Texture(baseTexture);
            texture.frame = new PIXI.Rectangle(sx, sy, pw, ph);
            var sprite = new PIXI.Sprite(texture);
            sprite.x = dx;
            sprite.y = dy;
            this.addChild(sprite);
            this.bitmapTextList.push(sprite);
        }
        return dx + ww - x;
    };
})(Nore || (Nore = {}));
