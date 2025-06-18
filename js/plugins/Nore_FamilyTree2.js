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
 *
 * @param rightTreeOffset
 * @desc 右側のツリーは、この値だけずれます
 * @default 15
 * 
 * @param closeRelativeX
 * @desc 近親マークのx座標
 * @default 0
 * 
 * @param closeRelativeY
 * @desc 近親マークのy座標
 * @default 0
 * 
 * @param closeRelativeNameY
 * @desc 近親マークつきの家系図の名前のy座標
 * @default 0
 * 
 */
var Nore;
(function (Nore) {
    var Parameters = PluginManager.parameters('Nore_FamilyTree2');
    Nore.RIGHT_TREE_OFFSET = Parameters['rightTreeOffset'] ? Math.trunc(Parameters['rightTreeOffset']) : 15;
    Nore.CLOSE_RELATIVE_X = Parameters['closeRelativeX'] ? Math.trunc(Parameters['closeRelativeX']) : 0;
    Nore.CLOSE_RELATIVE_Y = Parameters['closeRelativeY'] ? Math.trunc(Parameters['closeRelativeY']) : 0;
    Nore.CLOSE_RELATIVE_NAME_Y = Parameters['closeRelativeNameY'] ? Math.trunc(Parameters['closeRelativeNameY']) : 0;
    // 設定
    var FONT_NAME = '游ゴシック';
    var FONT_SIZE = 18;
    var COLOR = 0x2A1713;
    Nore.CHILD_TEXT_JA = 'の子供';
    Nore.CHILD_TEXT_EN = 'Child of';
    var loader;
    var _Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
    Scene_Boot.loadSystemImages = function () {
        _Scene_Boot_loadSystemImages.call(this);
        loader = new PIXI.loaders.Loader();
        loader.add('HeaderFont', './fonts/bgfont.fnt')
            .load(function () {
        });
    };
    var Scene_Map_prototype_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        Scene_Map_prototype_update.call(this);
        if ($gameSwitches.value(601)) {
            this.showFamilyTree();
        }
        else {
            this.hideFamilyTree();
        }
    };
    Scene_Map.prototype.showFamilyTree = function () {
        if (!this._familyTreeWindow) {
            this.createFamilyTreeBg();
            this._familyTreeWindow = new Nore.Window_FamilyTree(0, 0, Graphics.boxWidth, Graphics.boxHeight);
            this._spriteset.addChild(this._familyTreeWindow);
        }
        this._familyTreeBg.visible = true;
        this._familyTreeWindow.visible = true;
        this._familyTreeWindow.update();
    };
    Scene_Map.prototype.hideFamilyTree = function () {
        if (this._familyTreeWindow && this._familyTreeWindow.visible) {
            this._familyTreeWindow.visible = false;
            this._familyTreeBg.visible = false;
        }
    };
    Scene_Map.prototype.createFamilyTreeBg = function () {
        if (this._familyTreeBg) {
            return;
        }
        var g = new PIXI.Graphics();
        g.beginFill(0x976d64, 1);
        g.drawRect(0, 0, Graphics.boxWidth + 10, Graphics.boxHeight + 10);
        g.endFill();
        this._familyTreeBg = g;
        this._spriteset.addChild(g);
    };
})(Nore || (Nore = {}));
var Game_FamilyTree = /** @class */ (function () {
    function Game_FamilyTree() {
        this._children = [];
    }
    Game_FamilyTree.prototype.addChild = function (taneoyaId, childCount) {
        var newChild = new Game_Child(taneoyaId);
        newChild.plusBrother(childCount - 1);
        this._children.push(newChild);
        this._lastChild = newChild;
        return newChild.id();
    };
    Game_FamilyTree.prototype.addGrandchild = function (childCount, id) {
        if (id) {
            var parent_1 = this.findChild(id);
            if (!parent_1) {
                console.error('孫を追加しようとしましたが、' + id + 'のIDの子供が存在しません');
                return;
            }
            var newChild = new Game_Child(parent_1.taneoyaId(), parent_1.generation() + 1);
            newChild.plusBrother(childCount - 1);
            parent_1.addChild(newChild);
            return newChild.id();
        }
        else {
            if (!this._lastChild) {
                console.error('孫を追加しようとしましたが、直前に産まれた子供が存在しません');
                return;
            }
            var newChild = new Game_Child(this._lastChild.taneoyaId(), this._lastChild.generation() + 1);
            newChild.plusBrother(childCount - 1);
            this._lastChild.addChild(newChild);
            this._lastChild = newChild;
            return newChild.id();
        }
    };
    Game_FamilyTree.prototype.addBrother = function (taneoyaId) {
        if (!taneoyaId) {
            console.error('兄弟を追加しようとしましたが、種親IDが指定されていません');
            return;
        }
        var child = this.findLastChild(taneoyaId);
        if (!child) {
            console.error('兄弟を追加しようとしましたが、' + taneoyaId + 'の種親IDが見つからないため新規に追加しました');
            this.addChild(taneoyaId);
            return;
        }
        child.plusBrother(1);
    };
    Game_FamilyTree.prototype.findLastChild = function (taneoyaId) {
        for (var i = this._children.length - 1; i >= 0; i--) {
            var child = this._children[i];
            if (child.taneoyaId() == taneoyaId) {
                return child;
            }
        }
        return null;
    };
    Game_FamilyTree.prototype.children = function () {
        return this._children;
    };
    Game_FamilyTree.prototype.countChild = function (taneoyaId) {
        var total = 0;
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var c = _a[_i];
            total += c.countChild(taneoyaId);
        }
        return total;
    };
    Game_FamilyTree.prototype.findChild = function (id) {
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.id() == id) {
                return c;
            }
            var found = c.findChild(id);
            if (found) {
                return found;
            }
        }
        return null;
    };
    return Game_FamilyTree;
}());
var Game_Child = /** @class */ (function () {
    function Game_Child(taneoyaId, generation) {
        if (generation === void 0) { generation = 1; }
        this._brotherCount = 1;
        this._children = [];
        this._id = $gameSystem.nextChildId();
        this._taneoyaId = taneoyaId;
        this._generation = generation;
    }
    Game_Child.prototype.id = function () {
        return this._id;
    };
    Game_Child.prototype.taneoyaId = function () {
        return this._taneoyaId;
    };
    Game_Child.prototype.addChild = function (child) {
        this._children.push(child);
    };
    Game_Child.prototype.plusBrother = function (n) {
        this._brotherCount += n;
    };
    Game_Child.prototype.brotherCount = function () {
        return this._brotherCount;
    };
    Game_Child.prototype.hasGrandchild = function () {
        return this._children.length > 0;
    };
    Game_Child.prototype.child = function () {
        return this._children[0];
    };
    Game_Child.prototype.generation = function () {
        return this._generation;
    };
    Game_Child.prototype.countChild = function (taneoyaId) {
        if (this._taneoyaId != taneoyaId) {
            return 0;
        }
        var total = this._brotherCount;
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var c = _a[_i];
            total += c.countChild(taneoyaId);
        }
        return total;
    };
    Game_Child.prototype.findChild = function (id) {
        var c = this.child();
        if (c) {
            if (c.id() == id) {
                return c;
            }
            return c.findChild(id);
        }
        return null;
    };
    return Game_Child;
}());
Game_System.prototype.addChild = function (taneoyaId, childCount) {
    if (childCount === void 0) { childCount = 1; }
    this._familyTree = this._familyTree || new Game_FamilyTree();
    return this._familyTree.addChild(taneoyaId, childCount);
};
Game_System.prototype.addBrother = function (taneoyaId) {
    this._familyTree = this._familyTree || new Game_FamilyTree();
    this._familyTree.addBrother(taneoyaId);
};
Game_System.prototype.addGrandchild = function (childCount, parentId) {
    if (childCount === void 0) { childCount = 1; }
    this._familyTree = this._familyTree || new Game_FamilyTree();
    return this._familyTree.addGrandchild(childCount, parentId);
};
Game_System.prototype.nextChildId = function () {
    this._nextChildId = this._nextChildId || 0;
    this._nextChildId++;
    return this._nextChildId;
};
Game_System.prototype.familyTree = function () {
    this._familyTree = this._familyTree || new Game_FamilyTree();
    return this._familyTree;
};
Game_System.prototype.countChild = function (taneoyaId) {
    this._familyTree = this._familyTree || new Game_FamilyTree();
    return this._familyTree.countChild(taneoyaId);
};
(function (Nore) {
    var Scene_FamilyTree = /** @class */ (function (_super) {
        __extends(Scene_FamilyTree, _super);
        function Scene_FamilyTree() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Scene_FamilyTree.prototype.create = function () {
            _super.prototype.create.call(this);
            this.createFamilyTreeWindow();
        };
        Scene_FamilyTree.prototype.createBackground = function () {
            var g = new PIXI.Graphics();
            g.beginFill(0x976d64, 1);
            g.drawRect(0, 0, Graphics.boxWidth + 10, Graphics.boxHeight + 10);
            g.endFill();
            this.addChild(g);
        };
        Scene_FamilyTree.prototype.createFamilyTreeWindow = function () {
            this._familyTreeWindow = new Window_FamilyTree(0, 0, Graphics.boxWidth, Graphics.boxHeight);
            this._familyTreeWindow.refresh();
            this.addWindow(this._familyTreeWindow);
        };
        Scene_FamilyTree.prototype.update = function () {
            _super.prototype.update.call(this);
            if (Input.isTriggered('cancel')) {
                SoundManager.playCancel();
                SceneManager.pop();
            }
        };
        return Scene_FamilyTree;
    }(Scene_MenuBase));
    Nore.Scene_FamilyTree = Scene_FamilyTree;
    var Sprite_Pic = /** @class */ (function (_super) {
        __extends(Sprite_Pic, _super);
        function Sprite_Pic(name) {
            var _this = _super.call(this) || this;
            _this._name = name;
            _this.bitmap = ImageManager.loadPicture('エロステータス/' + name);
            return _this;
        }
        Sprite_Pic.prototype.update = function () {
            _super.prototype.update.call(this);
        };
        return Sprite_Pic;
    }(Sprite));
    var BG_COLOR = '#976d64';
    var LINE_COLOR = '#2a1713';
    var BLOCK_COLOR = '#ffe9c3';
    var INTERBAL_X = 120;
    var MARGIN_BETWEEN_FATHER_AND_CHILD = 50;
    var MARGIN_BETWEEN_FATHER_AND_CHILDREN = 80;
    var GRAND_CHILD_X = 76;
    var GRAND_CHILD_Y = 30;
    var INTERVAL_GRANDCHILD_Y = 120;
    var MAX_CHILDREN = 4; // 最大の表示子供。これより多い子供は省略
    var CenterLineInfo = /** @class */ (function () {
        function CenterLineInfo(initialY) {
            this._leftYList = [];
            this._rightYList = [];
            this._initialY = initialY;
        }
        CenterLineInfo.prototype.addLeft = function (y) {
            this._leftYList.push(y);
        };
        CenterLineInfo.prototype.addRight = function (y) {
            this._rightYList.push(y);
        };
        CenterLineInfo.prototype.maxY = function () {
            return Math.max(this.maxLeft(), this.maxRight());
        };
        CenterLineInfo.prototype.maxLeft = function () {
            var max = this._initialY;
            for (var _i = 0, _a = this._leftYList; _i < _a.length; _i++) {
                var n = _a[_i];
                if (max < n) {
                    max = n;
                }
            }
            return max - this._initialY;
        };
        CenterLineInfo.prototype.maxRight = function () {
            var max = this._initialY;
            for (var _i = 0, _a = this._rightYList; _i < _a.length; _i++) {
                var n = _a[_i];
                if (max < n) {
                    max = n;
                }
            }
            return max - this._initialY;
        };
        CenterLineInfo.prototype.initialY = function () {
            return this._initialY;
        };
        CenterLineInfo.prototype.leftYList = function () {
            return this._leftYList;
        };
        CenterLineInfo.prototype.rightYList = function () {
            return this._rightYList;
        };
        return CenterLineInfo;
    }());
    var FONT_NAME = '游ゴシック';
    var FONT_SIZE = 18;
    var COLOR = 0x2A1713;
    var Sprite_Name = /** @class */ (function (_super) {
        __extends(Sprite_Name, _super);
        function Sprite_Name(taneoyaId, isChild) {
            var _this = _super.call(this) || this;
            //this.bitmap.drawText('ゴブリン', 0, 0, 100, 30, 'center');
            var name;
            if (isChild) {
                name = getBabyName(taneoyaId);
            }
            else {
                name = getTaneoyaName(taneoyaId);
            }
            var bmtext2 = new PIXI.extras.BitmapText(name, {
                font: {
                    name: FONT_NAME,
                    size: FONT_SIZE,
                },
                align: 'left',
                tint: COLOR,
            });
            bmtext2.x = Math.floor((102 - bmtext2.width) / 2);
            bmtext2.y = 8;
            _this.addChild(bmtext2);
            return _this;
        }
        return Sprite_Name;
    }(Sprite));
    var Sprite_Child = /** @class */ (function (_super) {
        __extends(Sprite_Child, _super);
        function Sprite_Child() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._maxHeight = 0;
            return _this;
        }
        Sprite_Child.prototype.createNameSprite = function (taneoyaId, x, y, isChild, isCloseRelative) {
            if (isChild) {
                var type = getBabyPic(taneoyaId);
                var babyPic = new Sprite_Pic('menu_P04 PC001 子孫-' + type);
                babyPic.x = x;
                babyPic.y = y - 82;
                this.addChild(babyPic);

                if (isCloseRelative) {
                    var closePic = new Sprite_Pic('menu_P04 PC001 家系図_子_近親マーク');
                    closePic.x = x + Nore.CLOSE_RELATIVE_X;
                    closePic.y = y - 26 + Nore.CLOSE_RELATIVE_Y;
                    this.addChild(closePic);
                }

                var sprite = new Sprite_Name(taneoyaId, true);
                sprite.x = x;
                if (isCloseRelative) {
                    sprite.y = y + 6 + Nore.CLOSE_RELATIVE_NAME_Y;
                } else {
                    sprite.y = y;
                }
                this.addChild(sprite);

            }
            else {
                var sprite = new Sprite_Name(taneoyaId, false);
                sprite.x = x;
                sprite.y = y;
                this.addChild(sprite);
            }

        };
        Sprite_Child.prototype.calcGrandChildCount = function () {
            var n = 0;
            var child = this._child;
            while (child.hasGrandchild()) {
                n++;
                child = child.child();
            }
            return n;
        };
        Sprite_Child.prototype.calcHeight = function () {
            if (this._maxHeight > 0) {
                return this._maxHeight;
            }
            if (this._child.brotherCount() === 1) {
                // 兄弟がいない場合
                return 150;
            }
            return 190;
        };
        Sprite_Child.prototype.createBitmap = function () {
            var height = 200 + this.calcGrandChildCount() * INTERVAL_GRANDCHILD_Y;
            this.bitmap = new Bitmap(600, height);
        };
        Sprite_Child.prototype.drawLineVertial = function (x, y, height) {
            this.bitmap.fillRect(x, y, 3, height, LINE_COLOR);
            this.bitmap.fillRect(x + 1, y, 1, height, BLOCK_COLOR);
        };
        Sprite_Child.prototype.drawLineHorizontal = function (x, y, width) {
            this.bitmap.fillRect(x, y, width, 3, LINE_COLOR);
            this.bitmap.fillRect(x, y + 1, width, 1, BLOCK_COLOR);
        };
        Sprite_Child.prototype.drawLineHorizontalDouble = function (x, y, width) {
            this.drawLineHorizontal(x, y, width);
            this.drawLineHorizontal(x, y + 4, width);
        };
        Sprite_Child.prototype.putDot = function (x, y, color) {
            this.bitmap.fillRect(x, y, 1, 1, color);
        };
        Sprite_Child.prototype.drawPlus = function (plus, x, y) {
            var bmtext2 = new PIXI.extras.BitmapText('+' + plus, {
                font: {
                    name: FONT_NAME,
                    size: FONT_SIZE,
                },
                align: 'center',
                tint: COLOR,
            });
            bmtext2.x = x;
            bmtext2.y = y;
            this.addChild(bmtext2);
            return bmtext2;
        };
        Sprite_Child.prototype.maxChildren = function () {
            return MAX_CHILDREN;
        };
        return Sprite_Child;
    }(Sprite));
    var Sprite_ChildLeft = /** @class */ (function (_super) {
        __extends(Sprite_ChildLeft, _super);
        function Sprite_ChildLeft(child, y, centerLineInfo) {
            var _this = _super.call(this) || this;
            _this.y = y;
            _this._centerLineInfo = centerLineInfo;
            _this._child = child;
            _this.updatePosition();
            _this.createBitmap();
            _this.addFatherPic();
            _this.addChildPic(child, 0);
            _this._centerLineInfo.addLeft(_this.y);
            return _this;
        }
        Sprite_ChildLeft.prototype.addFatherPic = function () {
            var fatherPic = new Sprite_Pic('menu_P04 PC001 家系図_親_left');
            fatherPic.x = INTERBAL_X * 3;
            this.addChild(fatherPic);
            this.createNameSprite(this._child.taneoyaId(), fatherPic.x, fatherPic.y, false);
        };
        Sprite_ChildLeft.prototype.addChildPic = function (child, y) {
            if (child.hasGrandchild()) {
                this.addGrandChild(y, child);
            }
            else {
                this.drawBgLines(child, y);
                var maxChild = Math.min(child.brotherCount(), MAX_CHILDREN);
                var xx = (MAX_CHILDREN - maxChild) * INTERBAL_X;
                var yy = y;
                for (var i = 0; i < maxChild; i++) {
                    var childPic = new Sprite_Pic('menu_P04 PC001 家系図_子');
                    childPic.x = 77 + INTERBAL_X * i + xx;
                    if (child.brotherCount() == 1) {
                        childPic.y = MARGIN_BETWEEN_FATHER_AND_CHILD + yy;
                    }
                    else {
                        childPic.y = MARGIN_BETWEEN_FATHER_AND_CHILDREN + yy;
                    }
                    this.addChild(childPic);

                    this.createNameSprite(child.taneoyaId(), childPic.x, childPic.y + 26, true, child.generation() > 1);
                }
                if (child.brotherCount() > this.maxChildren()) {
                    this.addOmitPic(child.brotherCount() - this.maxChildren(), y);
                }
            }
        };
        Sprite_ChildLeft.prototype.addOmitPic = function (num, y) {
            var bro1 = (MAX_CHILDREN);
            var childPic = new Sprite_Pic('menu_P04 PC001 家系図_省略');
            childPic.x = 21 + INTERBAL_X * bro1;
            childPic.y = MARGIN_BETWEEN_FATHER_AND_CHILD + 8 + y;
            this.drawLineHorizontal(childPic.x - 10, childPic.y + 2, 10);
            this.addChild(childPic);
            this.drawPlus(num, childPic.x + 15, childPic.y - 7);
        };
        Sprite_ChildLeft.prototype.addGrandChild = function (y, child) {
            this._centerLineInfo.addLeft(this.y + y + INTERVAL_GRANDCHILD_Y);
            var hh = 70;
            var xx = 129 + 3 * INTERBAL_X;
            this.drawLineHorizontal(xx - GRAND_CHILD_X, y + 0 + hh - 1, GRAND_CHILD_X + 2);
            this.drawLineVertial(xx, y + 20, 50);
            this.drawLineVertial(xx - GRAND_CHILD_X, y + 0 + hh + 1, 50);
            var childPic = new Sprite_Pic('menu_P04 PC001 家系図_親_left');
            childPic.x = 3 * INTERBAL_X;
            childPic.y = y + 20 + hh + GRAND_CHILD_Y;
            this.addChild(childPic);
            this.createNameSprite(child.taneoyaId(), childPic.x, childPic.y, true, child.generation() > 1);
            if (!this._maxHeight) {
                this._maxHeight = 190;
            }
            this._maxHeight += INTERVAL_GRANDCHILD_Y;
            if (child.brotherCount() > 1) {
                var maxChild = Math.min(child.brotherCount(), MAX_CHILDREN - 1) - 1;
                this.drawLineHorizontal(409 - INTERBAL_X * maxChild, y + hh - 1, INTERBAL_X * maxChild + 5);
                var xx_1 = 0;
                var yy = y + 12;
                for (var i = 0; i < maxChild; i++) {
                    this.drawLineVertial(289 - INTERBAL_X * i, y + MARGIN_BETWEEN_FATHER_AND_CHILDREN - 9, 50);
                    var childPic_1 = new Sprite_Pic('menu_P04 PC001 家系図_子');
                    childPic_1.x = 237 - INTERBAL_X * i + xx_1;
                    childPic_1.y = MARGIN_BETWEEN_FATHER_AND_CHILDREN + yy;
                    this.addChild(childPic_1);
                    this.createNameSprite(child.taneoyaId(), childPic_1.x, childPic_1.y + 26, true, child.generation() > 1);
                }
                this.putDot(409 - INTERBAL_X * maxChild, y + 70, LINE_COLOR);
            }
            else {
                this.putDot(xx - GRAND_CHILD_X, y + 70, LINE_COLOR);
            }
            if (child.brotherCount() > MAX_CHILDREN - 1) {
                this.addOmitPic(child.brotherCount() - (MAX_CHILDREN - 1), y + 9);
            }
            else {
                this.putDot(491, y + 70, LINE_COLOR);
            }
            this.addChildPic(child.child(), y + INTERVAL_GRANDCHILD_Y);
        };
        Sprite_ChildLeft.prototype.updatePosition = function () {
            this.x = 306 - INTERBAL_X * 3;
        };
        Sprite_ChildLeft.prototype.drawBgLines = function (child, y) {
            var bro1 = Math.min((child.brotherCount() - 1), 3);
            if (child.brotherCount() == 1) {
                this.drawLineVertial(129 + INTERBAL_X * 3, 20 + y, 30);
                return;
            }
            var xx = (3 - bro1) * INTERBAL_X;
            var maxChild = Math.min(bro1, MAX_CHILDREN);
            this.drawLineVertial(129 + INTERBAL_X * maxChild + xx, 23 + y, 60);
            this.drawLineHorizontal(129 + xx, 60 + y, INTERBAL_X * Math.min(bro1, MAX_CHILDREN - 1) + 1);
            this.putDot(129 + xx, 61 + y, LINE_COLOR);
            for (var i = 0; i < Math.min(bro1, MAX_CHILDREN); i++) {
                this.drawLineVertial(129 + INTERBAL_X * i + xx, 62 + y, 29);
            }
        };
        return Sprite_ChildLeft;
    }(Sprite_Child));
    var Sprite_ChildRight = /** @class */ (function (_super) {
        __extends(Sprite_ChildRight, _super);
        function Sprite_ChildRight(child, y, centerLineInfo) {
            var _this = _super.call(this) || this;
            _this.y = y;
            _this._centerLineInfo = centerLineInfo;
            _this._child = child;
            _this.updatePosition();
            _this.createBitmap();
            _this.addFatherPic();
            _this.addChildPic(child, 0);
            _this._centerLineInfo.addRight(_this.y);
            return _this;
        }
        Sprite_ChildRight.prototype.addFatherPic = function () {
            var fatherPic = new Sprite_Pic('menu_P04 PC001 家系図_親_right');
            fatherPic.x = 0;
            this.addChild(fatherPic);
            this.createNameSprite(this._child.taneoyaId(), fatherPic.x + 45, fatherPic.y, false);
        };
        Sprite_ChildRight.prototype.addChildPic = function (child, y) {
            if (child.hasGrandchild()) {
                this.addGrandChild(y, child);
            }
            else {
                this.drawBgLines(child, y);
                var maxChild = Math.min(child.brotherCount(), MAX_CHILDREN);
                var xx = -33;
                var yy = y;
                for (var i = 0; i < maxChild; i++) {
                    var childPic = new Sprite_Pic('menu_P04 PC001 家系図_子');
                    childPic.x = INTERBAL_X * i + xx;
                    if (child.brotherCount() == 1) {
                        childPic.y = MARGIN_BETWEEN_FATHER_AND_CHILD + yy;
                    }
                    else {
                        childPic.y = MARGIN_BETWEEN_FATHER_AND_CHILDREN + yy;
                    }
                    this.addChild(childPic);
                    this.createNameSprite(child.taneoyaId(), childPic.x, childPic.y + 26, true, child.generation() > 1);
                }
                if (child.brotherCount() > this.maxChildren()) {
                    this.addOmitPic(child.brotherCount() - this.maxChildren(), y);
                }
            }
        };
        Sprite_ChildRight.prototype.addOmitPic = function (num, y) {
            var childPic = new Sprite_Pic('menu_P04 PC001 家系図_省略');
            childPic.x = 0;
            childPic.y = MARGIN_BETWEEN_FATHER_AND_CHILD + 8 + y;
            this.drawLineHorizontal(childPic.x + 10, childPic.y + 2, 10);
            this.addChild(childPic);
            var sprite = this.drawPlus(num, childPic.x - 6, childPic.y - 7);
            sprite.x -= sprite.width;
        };
        Sprite_ChildRight.prototype.addGrandChild = function (y, child) {
            this._centerLineInfo.addRight(this.y + y + INTERVAL_GRANDCHILD_Y);
            var hh = 70;
            var xx = 19;
            this.drawLineHorizontal(20, y + 0 + hh - 1, GRAND_CHILD_X + 2);
            this.drawLineVertial(xx, y + 20, 50);
            this.drawLineVertial(xx + GRAND_CHILD_X, y + 0 + hh + 1, 50);
            var childPic = new Sprite_Pic('menu_P04 PC001 家系図_親_right');
            childPic.x = 0;
            childPic.y = y + 20 + hh + GRAND_CHILD_Y;
            this.addChild(childPic);

            this.createNameSprite(child.taneoyaId(), childPic.x + 45, childPic.y, true, child.generation() > 1);
            if (!this._maxHeight) {
                this._maxHeight = 190;
            }
            this._maxHeight += INTERVAL_GRANDCHILD_Y;
            if (child.brotherCount() > 1) {
                var maxChild = Math.min(child.brotherCount(), MAX_CHILDREN - 1) - 1;
                this.drawLineHorizontal(98, y + hh - 1, INTERBAL_X * maxChild + 4);
                var xx_2 = 0;
                var yy = y + 12;
                this.putDot(98 + INTERBAL_X * maxChild + 3, y + hh, LINE_COLOR);
                for (var i = 0; i < maxChild; i++) {
                    this.drawLineVertial(219 + INTERBAL_X * i, y + MARGIN_BETWEEN_FATHER_AND_CHILDREN - 9, 50);
                    var childPic_2 = new Sprite_Pic('menu_P04 PC001 家系図_子');
                    childPic_2.x = 167 + INTERBAL_X * i + xx_2;
                    childPic_2.y = MARGIN_BETWEEN_FATHER_AND_CHILDREN + yy;
                    this.addChild(childPic_2);
                    this.createNameSprite(child.taneoyaId(), childPic_2.x, childPic_2.y + 26, true, child.generation() > 1);
                }
            }
            else {
                this.putDot(97, y + 70, LINE_COLOR);
            }
            if (child.brotherCount() > MAX_CHILDREN - 1) {
                this.addOmitPic(child.brotherCount() - (MAX_CHILDREN - 1), y + 9);
            }
            else {
                this.putDot(491, y + 70, LINE_COLOR);
            }
            this.addChildPic(child.child(), y + INTERVAL_GRANDCHILD_Y);
        };
        Sprite_ChildRight.prototype.updatePosition = function () {
            this.x = 566;
        };
        Sprite_ChildRight.prototype.drawBgLines = function (child, y) {
            var bro1 = Math.min((child.brotherCount() - 1), 4);
            if (child.brotherCount() == 1) {
                this.drawLineVertial(19, 20 + y, 30);
                return;
            }
            var xx = 10;
            var maxChild = Math.min(bro1, MAX_CHILDREN - 1);
            this.drawLineVertial(19, 23 + y, 60);
            this.drawLineHorizontal(21, 60 + y, INTERBAL_X * Math.min(bro1, MAX_CHILDREN - 1) + 1);
            this.putDot(21 + INTERBAL_X * Math.min(bro1, MAX_CHILDREN - 1), 60 + y + 1, LINE_COLOR);
            for (var i = 0; i < Math.min(bro1, MAX_CHILDREN - 1); i++) {
                this.drawLineVertial(129 + INTERBAL_X * i + xx, 62 + y, 29);
            }
        };
        return Sprite_ChildRight;
    }(Sprite_Child));
    var Sprite_VerticalLine = /** @class */ (function (_super) {
        __extends(Sprite_VerticalLine, _super);
        function Sprite_VerticalLine(centerLineInfo) {
            var _this = _super.call(this) || this;
            var offsetX = 60;
            var max = centerLineInfo.maxY() + 6;

            // bitmapの最大サイズ超え
            let margin = 20;
            max = Math.min(max, 16384 - margin);

            _this.bitmap = new Bitmap(120, max + margin);
            _this.drawLineVertial(offsetX + 0, 0, max);
            _this.drawLineVertial(offsetX + 3, 0, max);
            var yList = centerLineInfo.leftYList();
            for (var i = 0; i < yList.length; i++) {
                var y = yList[i];
                _this.drawLineHorizontal(0, y - centerLineInfo.initialY(), offsetX + 1);
                _this.drawLineHorizontal(0, y - centerLineInfo.initialY() + 4, offsetX + 1);
            }
            var yList2 = centerLineInfo.rightYList();
            for (var i = 0; i < yList2.length; i++) {
                var y = yList2[i];
                _this.drawLineHorizontal(offsetX + 5, y - centerLineInfo.initialY(), offsetX + 1);
                _this.drawLineHorizontal(offsetX + 5, y - centerLineInfo.initialY() + 4, offsetX + 1);
            }
            if (centerLineInfo.maxLeft() > centerLineInfo.maxRight()) {
                _this.bitmap.fillRect(offsetX + 1, centerLineInfo.maxLeft() + 2, 3, 1, LINE_COLOR);
                _this.bitmap.fillRect(offsetX, centerLineInfo.maxLeft() + 3, 3, 1, BG_COLOR);
                _this.bitmap.fillRect(offsetX + 1, centerLineInfo.maxLeft() + 4, 3, 1, LINE_COLOR);
                _this.bitmap.fillRect(offsetX + 1, centerLineInfo.maxLeft() + 5, 4, 1, BLOCK_COLOR);
                _this.bitmap.fillRect(offsetX + 1, centerLineInfo.maxLeft() + 6, 4, 1, LINE_COLOR);
            }
            else if (centerLineInfo.maxLeft() < centerLineInfo.maxRight()) {
                _this.bitmap.fillRect(offsetX + 2, centerLineInfo.maxRight() + 2, 3, 1, LINE_COLOR);
                _this.bitmap.fillRect(offsetX + 4, centerLineInfo.maxRight() + 3, 3, 1, BG_COLOR);
                _this.bitmap.fillRect(offsetX + 2, centerLineInfo.maxRight() + 4, 3, 1, LINE_COLOR);
                _this.bitmap.fillRect(offsetX + 2, centerLineInfo.maxRight() + 5, 4, 1, BLOCK_COLOR);
                _this.bitmap.fillRect(offsetX + 1, centerLineInfo.maxRight() + 6, 4, 1, LINE_COLOR);
            }
            else {
            }
            return _this;
        }
        Sprite_VerticalLine.prototype.drawLineVertial = function (x, y, height) {
            this.bitmap.fillRect(x, y, 3, height, LINE_COLOR);
            this.bitmap.fillRect(x + 1, y, 1, height, BLOCK_COLOR);
        };
        Sprite_VerticalLine.prototype.drawLineHorizontal = function (x, y, width) {
            this.bitmap.fillRect(x, y, width, 3, LINE_COLOR);
            this.bitmap.fillRect(x, y + 1, width, 1, BLOCK_COLOR);
        };
        return Sprite_VerticalLine;
    }(Sprite));
    var Window_FamilyTree = /** @class */ (function (_super) {
        __extends(Window_FamilyTree, _super);
        function Window_FamilyTree() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Window_FamilyTree.prototype.initialize = function (x, y, w, h) {
            _super.prototype.initialize.call(this, x, y, w, h);
            this.backOpacity = 0;
            this._windowBackSprite.alpha = 0;
            this._windowFrameSprite.visible = false;
            //this.contentsOpacity = 0;
            this._maxHeight = 1100;
            this.createBaseSprite();
            this.addPicture();
            this.createChildSprites();
            this.createFadeSprite();
            this.y = -1000;
        };
        Window_FamilyTree.prototype.createFadeSprite = function () {
            this._fadeSprite = new ScreenSprite();
            this.addChild(this._fadeSprite);
        };
        ;
        Window_FamilyTree.prototype.createBaseSprite = function () {
            this._baseSprite = new Sprite();
            this.addChild(this._baseSprite);
        };
        Window_FamilyTree.prototype.addPicture = function () {
            this._pic1 = new Sprite_Pic('menu_P04 PC001 家系図_A');
            this._baseSprite.addChild(this._pic1);
            this._pic2 = new Sprite_Pic('menu_P04 PC001 家系図_B');
            this._pic2.y = Graphics.boxHeight;
            this._baseSprite.addChild(this._pic2);
        };
        Window_FamilyTree.prototype.createChildSprites = function () {
            var familyTree = $gameSystem.familyTree();
            if (familyTree.children().length === 0) {
                return;
            }
            this.addSerenaBack();
            var initialY = 1420;
            var centerLineInfo = new CenterLineInfo(initialY);
            var leftY = initialY;
            var rightY = initialY;
            var plusRightHeight = false;
            for (var _i = 0, _a = familyTree.children(); _i < _a.length; _i++) {
                var child = _a[_i];
                var isLeft = leftY <= rightY;
                if (isLeft) {
                    /*if (lastLeftHeight > 0) {
                        this.addVertialLine(leftY, lastLeftHeight);
                    }*/
                    leftY += this.addLeft(child, leftY, centerLineInfo);
                }
                else {
                    rightY += this.addRight(child, rightY, centerLineInfo);
                    if (!plusRightHeight) {
                        plusRightHeight = true;
                        rightY += Nore.RIGHT_TREE_OFFSET;
                    }
                }
            }
            this.drawCenterLine(centerLineInfo);
            this.addSerenaSprite();
            this._maxHeight = Math.max(leftY, rightY) - 550;
        };
        Window_FamilyTree.prototype.drawCenterLine = function (centerLineInfo) {
            var height = centerLineInfo.maxY();
            var sprite = new Sprite_VerticalLine(centerLineInfo);
            sprite.x = 450;
            sprite.y = centerLineInfo.initialY() + 16;
            this._baseSprite.addChild(sprite);
        };
        Window_FamilyTree.prototype.addSerenaBack = function () {
            var g = new PIXI.Graphics();
            g.beginFill(0x976d64, 1);
            g.drawRect(0, 0, 140, 160);
            g.endFill();
            g.x = 440;
            g.y = Graphics.boxHeight * 2 - 204;
            this._baseSprite.addChild(g);
        };
        Window_FamilyTree.prototype.addSerenaSprite = function () {
            this._pic3 = new Sprite_Pic('menu_P04 PC001 家系図_C');
            this._pic3.x = 424;
            this._pic3.y = 1332;
            this._baseSprite.addChild(this._pic3);
        };
        Window_FamilyTree.prototype.addLeft = function (child, y, centerLineInfo) {
            var sprite = new Sprite_ChildLeft(child, y, centerLineInfo);
            this._baseSprite.addChild(sprite);
            return sprite.calcHeight();
        };
        Window_FamilyTree.prototype.addRight = function (child, y, centerLineInfo) {
            var sprite = new Sprite_ChildRight(child, y, centerLineInfo);
            this._baseSprite.addChild(sprite);
            return sprite.calcHeight();
        };
        Window_FamilyTree.prototype.refresh = function () {
        };
        Object.defineProperty(Window_FamilyTree.prototype, "backOpacity", {
            set: function (n) {
            },
            enumerable: true,
            configurable: true
        });
        Window_FamilyTree.prototype.update = function () {
            _super.prototype.update.call(this);
            if (this._fadeSprite) {
                this._fadeSprite.opacity = 255 - $gameScreen.brightness();
            }
            if (Input.isPressed('up')) {
                this.y += this.interval();
                if (this.y > 0) {
                    this.y = 0;
                }
            }
            else if (Input.isPressed('down')) {
                this.y -= this.interval();
                if (this.y < -this.maxY()) {
                    this.y = -this.maxY();
                }
            }
        };
        Window_FamilyTree.prototype.interval = function () {
            return 10;
        };
        Window_FamilyTree.prototype.maxY = function () {
            return this._maxHeight;
        };
        return Window_FamilyTree;
    }(Window_Base));
    Nore.Window_FamilyTree = Window_FamilyTree;
})(Nore || (Nore = {}));
/*
(function() {

    function p(arg) {
        console.log(arg);
    }

    (window as any).p = p;

})();
*/

//---------------------------------------------------------
//Original
/*
var TANEOYA_MAP = {
    1: ["不明", "不明"],
    2: ["ジャック", "ジャック"],
    3: ["ヘンリー", "ヘンリー"],
    4: ["ゴードン", "ゴードン"],
    5: ["ドッヂ", "ドッヂ"],
    6: ["通り魔ジョン（賞金首）", "ジョン"],
    7: ["異教徒ブライ（賞金首）", "ブライ"],
    8: ["強姦魔トム（賞金首）", "トム"],
    9: ["強盗ゴブログ（賞金首）", "ゴブログ"],
    10: ["ゴミ漁りギー（賞金首）", "ギー"],
    11: ["人攫いビョーン（賞金首）", "ビョーン"],
    12: ["博愛者ギニュー（賞金首）", "ギニュー"],
    13: ["ヴァンサン（スラム）", "ヴァンサン"],
    14: ["アルベール（市民）", "アルベール"],
    15: ["サミュエル（市民）", "サミュエル"],
    16: ["ドニ（市民）", "ドニ"],
    17: ["マチアス（市民）", "マチアス"],
    18: ["マルセル（市民）", "マルセル"],
    19: ["店主ディーコン（市民）", "ディーコン"],
    20: ["富豪グービル（市民）", "グーピル"],
    21: ["市警長デムーラン（市民）", "デムーラン"],
    22: ["町医者ロドリグ（市民）", "ロドリグ"],
    23: ["オリバー（冒険者）", "オリバー"],
    24: ["ガエタン（冒険者）", "ガエタン"],
    25: ["ジョエル（冒険者）", "ジョエル"],
    26: ["トリスタン（冒険者）", "トリスタン"],
    27: ["豚のゲクラン（市民）", "ゲクラン"],
    28: ["本屋のティム（市民）", "ティム"],
    29: ["ギャングリーダーガヌロン（スラム）", "ガヌロン"],
    30: ["ギャングのバーダン（スラム）", "バーダン"],
    31: ["人間（個人", ""],
    32: ["人間（個人", ""],
    33: ["人間（個人", ""],
    34: ["人間（個人", ""],
    35: ["人間（個人", ""],
    36: ["人間（個人", ""],
    37: ["人間（個人", ""],
    38: ["人間（個人", ""],
    39: ["人間（個人", ""],
    40: ["人間（個人", ""],
    41: ["人間（個人", ""],
    42: ["人間（個人", ""],
    43: ["人間（個人", ""],
    44: ["人間（個人", ""],
    45: ["人間（個人", ""],
    46: ["人間（個人", ""],
    47: ["人間（個人", ""],
    48: ["人間（個人", ""],
    49: ["人間（個人", ""],
    50: ["人間（個人", ""],
    51: ["温泉屋ヘンリー（第三部）", "ヘンリー"],
    52: ["鬼狩りマクシス（第三部）", "マクシス"],
    53: ["宿屋モリス（第三部）", "モリス"],
    54: ["武器屋ピエール（第三部）", "ピエール"],
    55: ["乱暴者ブリュノ（第三部）", "ブリュノ"],
    56: ["マセガキマセル（第三部）", "マセル"],
    57: ["種馬スタリオン（第三部）", "スタリオン"],
    58: ["農夫ボンド（第三部）", "ボンド"],
    59: ["人間（個人", ""],
    60: ["人間（個人", ""],
    61: ["人間（個人", ""],
    62: ["人間（個人", ""],
    63: ["人間（個人", ""],
    64: ["人間（個人", ""],
    65: ["人間（個人", ""],
    66: ["人間（個人", ""],
    67: ["人間（個人", ""],
    68: ["人間（個人", ""],
    69: ["人間（個人", ""],
    70: ["人間（個人", ""],
    71: ["人間（個人", ""],
    72: ["人間（個人", ""],
    73: ["人間（個人", ""],
    74: ["人間（個人", ""],
    75: ["人間（個人", ""],
    76: ["人間（個人", ""],
    77: ["人間（個人", ""],
    78: ["人間（個人", ""],
    79: ["人間（個人", ""],
    80: ["人間（個人", ""],
    81: ["人間（個人", ""],
    82: ["人間（個人", ""],
    83: ["人間（個人", ""],
    84: ["人間（個人", ""],
    85: ["人間（個人", ""],
    86: ["人間（個人", ""],
    87: ["人間（個人", ""],
    88: ["人間（個人", ""],
    89: ["人間（個人", ""],
    90: ["人間（個人", ""],
    91: ["人間（個人", ""],
    92: ["人間（個人", ""],
    93: ["人間（個人", ""],
    94: ["人間（個人", ""],
    95: ["人間（個人", ""],
    96: ["人間（個人", ""],
    97: ["人間（個人", ""],
    98: ["人間（個人", ""],
    99: ["人間（個人", ""],
    100: ["分からない（輪姦）", "父親不明"],
    101: ["名も知らぬ男", "名も知らぬ男"],
    102: ["孤児", "孤児"],
    103: ["市警隊員", "市警隊員"],
    104: ["冒険者", "冒険者"],
    105: ["ごろつき", "ごろつき"],
    106: ["市民悪漢（ちんぴら）", "チンピラ"],
    107: ["異教徒", "異教徒"],
    108: ["浮浪者", "浮浪者"],
    109: ["ガヌロンの息子", "ガヌロンの息子", "ガヌロンの孫"],
    110: ["人間（職業", ""],
    111: ["人間（職業", ""],
    112: ["人間（職業", ""],
    113: ["人間（職業", ""],
    114: ["人間（職業", ""],
    115: ["売春客", "売春客"],
    116: ["異人", "異人"],
    117: ["囚人", "囚人"],
    118: ["人間（職業", ""],
    119: ["人間（職業", ""],
    120: ["人間（職業", ""],
    121: ["人間（職業", ""],
    122: ["人間（職業", ""],
    123: ["人間（職業", ""],
    124: ["人間（職業", ""],
    125: ["人間（職業", ""],
    126: ["人間（職業", ""],
    127: ["人間（職業", ""],
    128: ["人間（職業", ""],
    129: ["人間（職業", ""],
    130: ["人間（職業", ""],
    131: ["人間（職業", ""],
    132: ["人間（職業", ""],
    133: ["人間（職業", ""],
    134: ["人間（職業", ""],
    135: ["人間（職業", ""],
    136: ["人間（職業", ""],
    137: ["人間（職業", ""],
    138: ["人間（職業", ""],
    139: ["人間（職業", ""],
    140: ["人間（職業", ""],
    141: ["人間（職業", ""],
    142: ["人間（職業", ""],
    143: ["人間（職業", ""],
    144: ["人間（職業", ""],
    145: ["人間（職業", ""],
    146: ["人間（職業", ""],
    147: ["人間（職業", ""],
    148: ["人間（職業", ""],
    149: ["人間（職業", ""],
    150: ["人間（職業", ""],
    151: ["モンスター（個体", ""],
    152: ["モンスター（個体", ""],
    153: ["モンスター（個体", ""],
    154: ["モンスター（個体", ""],
    155: ["モンスター（個体", ""],
    156: ["モンスター（個体", ""],
    157: ["モンスター（個体", ""],
    158: ["モンスター（個体", ""],
    159: ["モンスター（個体", ""],
    160: ["モンスター（個体", ""],
    161: ["モンスター（個体", ""],
    162: ["モンスター（個体", ""],
    163: ["モンスター（個体", ""],
    164: ["モンスター（個体", ""],
    165: ["モンスター（個体", ""],
    166: ["モンスター（個体", ""],
    167: ["モンスター（個体", ""],
    168: ["モンスター（個体", ""],
    169: ["モンスター（個体", ""],
    170: ["モンスター（個体", ""],
    171: ["モンスター（個体", ""],
    172: ["モンスター（個体", ""],
    173: ["モンスター（個体", ""],
    174: ["モンスター（個体", ""],
    175: ["モンスター（個体", ""],
    176: ["モンスター（個体", ""],
    177: ["モンスター（個体", ""],
    178: ["モンスター（個体", ""],
    179: ["モンスター（個体", ""],
    180: ["モンスター（個体", ""],
    181: ["モンスター（個体", ""],
    182: ["モンスター（個体", ""],
    183: ["モンスター（個体", ""],
    184: ["モンスター（個体", ""],
    185: ["モンスター（個体", ""],
    186: ["モンスター（個体", ""],
    187: ["モンスター（個体", ""],
    188: ["モンスター（個体", ""],
    189: ["モンスター（個体", ""],
    190: ["モンスター（個体", ""],
    191: ["モンスター（個体", ""],
    192: ["モンスター（個体", ""],
    193: ["モンスター（個体", ""],
    194: ["モンスター（個体", ""],
    195: ["モンスター（個体", ""],
    196: ["モンスター（個体", ""],
    197: ["モンスター（個体", ""],
    198: ["モンスター（個体", ""],
    199: ["モンスター（個体", ""],
    200: ["モンスター（個体", ""],
    201: ["ゴブリン", "ゴブリン"],
    202: ["ゴブリンの仔", "ゴブリンの仔"],
    203: ["モンスター（種族", ""],
    204: ["モンスター（種族", ""],
    205: ["モンスター（種族", ""],
    206: ["オーク", "オーク"],
    207: ["オークの仔", "オークの仔"],
    208: ["モンスター（種族", ""],
    209: ["モンスター（種族", ""],
    210: ["モンスター（種族", ""],
    211: ["スライム", "スライム"],
    212: ["モンスター（種族", ""],
    213: ["ビッグスライム", "スライム"],
    214: ["ビッグスライム", "スライム", "セレナの子"],
    215: ["モンスターの仔", ""],
    216: ["スタリオン", "スタリオン"],
    217: ["スタリオンの仔", "スタリオンの仔"],
    218: ["モンスター（種族", ""],
    219: ["モンスター（種族", ""],
    220: ["モンスター（種族", ""],
    221: ["ローパー", "ローパー", "ローパーの幼体"],
    222: ["ローパーの仔", "ローパーの幼体"],
    223: ["モンスター（種族", ""],
    224: ["モンスター（種族", ""],
    225: ["モンスター（種族", ""],
    226: ["ピッグマン", "ピッグマン"],
    227: ["ピッグマンの仔", "ピッグマンの仔"],
    228: ["モンスター（種族", ""],
    229: ["モンスター（種族", ""],
    230: ["モンスター（種族", ""],
    231: ["ワーグ", "ワーグ", "ワーグの仔"],
    232: ["ワーグの仔", "ワーグの仔"],
    233: ["モンスター（種族", ""],
    234: ["モンスター（種族", ""],
    235: ["モンスター（種族", ""],
    236: ["モンスター（個体", ""],
    237: ["モンスター（個体", ""],
    238: ["モンスター（種族", ""],
    239: ["モンスター（種族", ""],
    240: ["モンスター（種族", ""],
    241: ["モンスター（種族", ""],
    242: ["モンスター（種族", ""],
    243: ["モンスター（種族", ""],
    244: ["モンスター（種族", ""],
    245: ["モンスター（種族", ""],
    246: ["モンスター（種族", ""],
    247: ["モンスター（種族", ""],
    248: ["モンスター（種族", ""],
    249: ["モンスター（種族", ""],
    250: ["モンスター（種族", ""],
    251: ["その他", ""],
    252: ["その他", ""],
    253: ["その他", ""],
    254: ["その他", ""],
    255: ["その他", ""],
    256: ["その他", ""],
    257: ["その他", ""],
    258: ["その他", ""],
    259: ["その他", ""],
    260: ["その他", ""],
    261: ["その他", ""],
    262: ["その他", ""],
    263: ["その他", ""],
    264: ["その他", ""],
    265: ["その他", ""],
    266: ["その他", ""],
    267: ["その他", ""],
    268: ["その他", ""],
    269: ["その他", ""],
    270: ["その他", ""],
    271: ["その他", ""],
    272: ["その他", ""],
    273: ["その他", ""],
    274: ["その他", ""],
    275: ["その他", ""],
    276: ["その他", ""],
    277: ["その他", ""],
    278: ["その他", ""],
    279: ["その他", ""],
    280: ["その他", ""],
    281: ["その他", ""],
    282: ["その他", ""],
    283: ["その他", ""],
    284: ["その他", ""],
    285: ["その他", ""],
    286: ["その他", ""],
    287: ["その他", ""],
    288: ["その他", ""],
    289: ["その他", ""],
    290: ["その他", ""],
    291: ["その他", ""],
    292: ["その他", ""],
    293: ["その他", ""],
    294: ["その他", ""],
    295: ["その他", ""],
    296: ["その他", ""],
    297: ["その他", ""],
    298: ["その他", ""],
    299: ["その他", ""],
    300: ["その他", ""],
};
*/

//For Translation
var TANEOYA_MAP = {
    1: ["Unknown", "Unknown"],
    2: ["Jack", "Jack"],
    3: ["Henry", "Henry"],
    4: ["Gordon", "Gordon"],
    5: ["Dodge", "Dodge"],
    6: ["John", "John"],
    7: ["Bly", "Bly"],
    8: ["Tom", "Tom"],
    9: ["GobRob", "GobRob"],
    10: ["Guy", "Guy"],
    11: ["Bjorn", "Bjorn"],
    12: ["Ginyu", "Ginyu"],
    13: ["Vincent", "Vincent"],
    14: ["Albel", "Albel"],
    15: ["Samuel", "Samuel"],
    16: ["Denis", "Denis"],
    17: ["Matthias", "Matthias"],
    18: ["Marcel", "Marcel"],
    19: ["Deacon", "Deacon"],
    20: ["Goupil", "Goupil"],
    21: ["Desmoulins ", "Desmoulins "],
    22: ["Rodríguez", "Rodríguez"],
    23: ["Oliver", "Oliver"],
    24: ["Gaetan", "Gaetan"],
    25: ["Joel", "Joel"],
    26: ["Tristan", "Tristan"],
    27: ["Guesclin", "Guesclin"],
    28: ["Tim", "Tim"],
    29: ["Ganelon", "Ganelon"],
    30: ["Bardon", "Bardon"],
    31: ["Human (Individual", ""],
    32: ["Human (Individual", ""],
    33: ["Human (Individual", ""],
    34: ["Human (Individual", ""],
    35: ["Human (Individual", ""],
    36: ["Human (Individual", ""],
    37: ["Human (Individual", ""],
    38: ["Human (Individual", ""],
    39: ["Human (Individual", ""],
    40: ["Human (Individual", ""],
    41: ["Human (Individual", ""],
    42: ["Human (Individual", ""],
    43: ["Human (Individual", ""],
    44: ["Human (Individual", ""],
    45: ["Human (Individual", ""],
    46: ["Human (Individual", ""],
    47: ["Human (Individual", ""],
    48: ["Human (Individual", ""],
    49: ["Human (Individual", ""],
    50: ["Human (Individual", ""],
    51: ["Henry", "Henry"],
    52: ["Maxis", "Maxis"],
    53: ["Morris", "Morris"],
    54: ["Pierre", "Pierre"],
    55: ["Bruno", "Bruno"],
    56: ["Masel", "Masel"],
    57: ["Stallion", "Stallion"],
    58: ["Bond", "Bond"],
    59: ["Human (Individual", ""],
    60: ["Human (Individual", ""],
    61: ["Human (Individual", ""],
    62: ["Human (Individual", ""],
    63: ["Human (Individual", ""],
    64: ["Human (Individual", ""],
    65: ["Human (Individual", ""],
    66: ["Human (Individual", ""],
    67: ["Human (Individual", ""],
    68: ["Human (Individual", ""],
    69: ["Human (Individual", ""],
    70: ["Human (Individual", ""],
    71: ["Human (Individual", ""],
    72: ["Human (Individual", ""],
    73: ["Human (Individual", ""],
    74: ["Human (Individual", ""],
    75: ["Human (Individual", ""],
    76: ["Human (Individual", ""],
    77: ["Human (Individual", ""],
    78: ["Human (Individual", ""],
    79: ["Human (Individual", ""],
    80: ["Human (Individual", ""],
    81: ["Human (Individual", ""],
    82: ["Human (Individual", ""],
    83: ["Human (Individual", ""],
    84: ["Human (Individual", ""],
    85: ["Human (Individual", ""],
    86: ["Human (Individual", ""],
    87: ["Human (Individual", ""],
    88: ["Human (Individual", ""],
    89: ["Human (Individual", ""],
    90: ["Human (Individual", ""],
    91: ["Human (Individual", ""],
    92: ["Human (Individual", ""],
    93: ["Human (Individual", ""],
    94: ["Human (Individual", ""],
    95: ["Human (Individual", ""],
    96: ["Human (Individual", ""],
    97: ["Human (Individual", ""],
    98: ["Human (Individual", ""],
    99: ["Human (Individual", ""],
    100: ["Unknown", "Unknown"],
    101: ["Unknown", "Unknown"],
    102: ["Orphan", "Orphan"],
    103: ["Police", "Police"],
    104: ["Adventurer", "Adventurer"],
    105: ["Rogue", "Rogue"],
    106: ["Thug", "Thug"],
    107: ["Pagan", "Pagan"],
    108: ["Vagrant", "Vagrant"],
    109: ["Ganelon's son", "Ganelon's son", "Ganelon's grandson"],
    110: ["Human (Job", ""],
    111: ["Human (Job", ""],
    112: ["Human (Job", ""],
    113: ["Human (Job", ""],
    114: ["Human (Job", ""],
    115: ["Customer", "Customer"],
    116: ["foreigner", "foreigner"],
    117: ["Prisoner", "Prisoner"],
    118: ["Human (Job", ""],
    119: ["Human (Job", ""],
    120: ["Human (Job", ""],
    121: ["Human (Job", ""],
    122: ["Human (Job", ""],
    123: ["Human (Job", ""],
    124: ["Human (Job", ""],
    125: ["Human (Job", ""],
    126: ["Human (Job", ""],
    127: ["Human (Job", ""],
    128: ["Human (Job", ""],
    129: ["Human (Job", ""],
    130: ["Human (Job", ""],
    131: ["Human (Job", ""],
    132: ["Human (Job", ""],
    133: ["Human (Job", ""],
    134: ["Human (Job", ""],
    135: ["Human (Job", ""],
    136: ["Human (Job", ""],
    137: ["Human (Job", ""],
    138: ["Human (Job", ""],
    139: ["Human (Job", ""],
    140: ["Human (Job", ""],
    141: ["Human (Job", ""],
    142: ["Human (Job", ""],
    143: ["Human (Job", ""],
    144: ["Human (Job", ""],
    145: ["Human (Job", ""],
    146: ["Human (Job", ""],
    147: ["Human (Job", ""],
    148: ["Human (Job", ""],
    149: ["Human (Job", ""],
    150: ["Human (Job", ""],
    151: ["Monster (Individual", ""],
    152: ["Monster (Individual", ""],
    153: ["Monster (Individual", ""],
    154: ["Monster (Individual", ""],
    155: ["Monster (Individual", ""],
    156: ["Monster (Individual", ""],
    157: ["Monster (Individual", ""],
    158: ["Monster (Individual", ""],
    159: ["Monster (Individual", ""],
    160: ["Monster (Individual", ""],
    161: ["Monster (Individual", ""],
    162: ["Monster (Individual", ""],
    163: ["Monster (Individual", ""],
    164: ["Monster (Individual", ""],
    165: ["Monster (Individual", ""],
    166: ["Monster (Individual", ""],
    167: ["Monster (Individual", ""],
    168: ["Monster (Individual", ""],
    169: ["Monster (Individual", ""],
    170: ["Monster (Individual", ""],
    171: ["Monster (Individual", ""],
    172: ["Monster (Individual", ""],
    173: ["Monster (Individual", ""],
    174: ["Monster (Individual", ""],
    175: ["Monster (Individual", ""],
    176: ["Monster (Individual", ""],
    177: ["Monster (Individual", ""],
    178: ["Monster (Individual", ""],
    179: ["Monster (Individual", ""],
    180: ["Monster (Individual", ""],
    181: ["Monster (Individual", ""],
    182: ["Monster (Individual", ""],
    183: ["Monster (Individual", ""],
    184: ["Monster (Individual", ""],
    185: ["Monster (Individual", ""],
    186: ["Monster (Individual", ""],
    187: ["Monster (Individual", ""],
    188: ["Monster (Individual", ""],
    189: ["Monster (Individual", ""],
    190: ["Monster (Individual", ""],
    191: ["Monster (Individual", ""],
    192: ["Monster (Individual", ""],
    193: ["Monster (Individual", ""],
    194: ["Monster (Individual", ""],
    195: ["Monster (Individual", ""],
    196: ["Monster (Individual", ""],
    197: ["Monster (Individual", ""],
    198: ["Monster (Individual", ""],
    199: ["Monster (Individual", ""],
    200: ["Monster (Individual", ""],
    201: ["Goblin", "Goblin"],
    202: ["Goblin's child", "Goblin's child"],
    203: ["Monster (Species", ""],
    204: ["Monster (Species", ""],
    205: ["Monster (Species", ""],
    206: ["Orc", "Orc"],
    207: ["Orc's child", "Orc's child"],
    208: ["Monster (Species", ""],
    209: ["Monster (Species", ""],
    210: ["Monster (Species", ""],
    211: ["Slime", "Slime"],
    212: ["Monster (Species", ""],
    213: ["BigSlime", "Slime"],
    214: ["BigSlime", "Slime", "Serena's child"],
    215: ["Monster's child", ""],
    216: ["Stallion", "Stallion"],
    217: ["Stallion's child", "Stallion's child"],
    218: ["Monster (Species", ""],
    219: ["Monster (Species", ""],
    220: ["Monster (Species", ""],
    221: ["Roper", "Roper", "Roper's fetus"],
    222: ["Roper's child", "Roper's fetus"],
    223: ["Monster (Species", ""],
    224: ["Monster (Species", ""],
    225: ["Monster (Species", ""],
    226: ["Pigman", "Pigman"],
    227: ["Pigman's child", "Pigman's child"],
    228: ["Monster (Species", ""],
    229: ["Monster (Species", ""],
    230: ["Monster (Species", ""],
    231: ["Warg", "Warg", "Warg's child"],
    232: ["Warg's child", "Warg's child"],
    233: ["Monster (Species", ""],
    234: ["Monster (Species", ""],
    235: ["Monster (Species", ""],
    236: ["Monster (Individual", ""],
    237: ["Monster (Individual", ""],
    238: ["Monster (Species", ""],
    239: ["Monster (Species", ""],
    240: ["Monster (Species", ""],
    241: ["Monster (Species", ""],
    242: ["Monster (Species", ""],
    243: ["Monster (Species", ""],
    244: ["Monster (Species", ""],
    245: ["Monster (Species", ""],
    246: ["Monster (Species", ""],
    247: ["Monster (Species", ""],
    248: ["Monster (Species", ""],
    249: ["Monster (Species", ""],
    250: ["Monster (Species", ""],
    251: ["Other", ""],
    252: ["Other", ""],
    253: ["Other", ""],
    254: ["Other", ""],
    255: ["Other", ""],
    256: ["Other", ""],
    257: ["Other", ""],
    258: ["Other", ""],
    259: ["Other", ""],
    260: ["Other", ""],
    261: ["Other", ""],
    262: ["Other", ""],
    263: ["Other", ""],
    264: ["Other", ""],
    265: ["Other", ""],
    266: ["Other", ""],
    267: ["Other", ""],
    268: ["Other", ""],
    269: ["Other", ""],
    270: ["Other", ""],
    271: ["Other", ""],
    272: ["Other", ""],
    273: ["Other", ""],
    274: ["Other", ""],
    275: ["Other", ""],
    276: ["Other", ""],
    277: ["Other", ""],
    278: ["Other", ""],
    279: ["Other", ""],
    280: ["Other", ""],
    281: ["Other", ""],
    282: ["Other", ""],
    283: ["Other", ""],
    284: ["Other", ""],
    285: ["Other", ""],
    286: ["Other", ""],
    287: ["Other", ""],
    288: ["Other", ""],
    289: ["Other", ""],
    290: ["Other", ""],
    291: ["Other", ""],
    292: ["Other", ""],
    293: ["Other", ""],
    294: ["Other", ""],
    295: ["Other", ""],
    296: ["Other", ""],
    297: ["Other", ""],
    298: ["Other", ""],
    299: ["Other", ""],
    300: ["Other", ""],
};
//---------------------------------------------------------

function getTaneoyaName(id) {
    if (!TANEOYA_MAP[id]) {
        console.error('ID が' + id + 'の種親が見つかりません');
        return '';
    }
    return TANEOYA_MAP[id][1];
}
function getBabyName(id) {
    if (!TANEOYA_MAP[id]) {
        console.error('ID が' + id + 'の子供が見つかりません');
        return '';
    }
    if (TANEOYA_MAP[id][2]) {
        return TANEOYA_MAP[id][2];
    }
    //return TANEOYA_MAP[id][1] + 'の子'; //Original
    return TANEOYA_MAP[id][1] + "'s child"; //For Translation
}
function getBabyPic(id) {
    switch (id) {
        case 201: return 'ゴブリンの子供';
        case 202: return 'ゴブリンの子供';
        case 206: return 'オークの子供';
        case 207: return 'オークの子供';
        case 211: return 'スライムの幼体';
        case 213: return 'スライムの幼体';
        case 216: return 'スタリオンの子供';
        case 217: return 'スタリオンの子供';
        case 221: return 'ローパーの子供';
        case 222: return 'ローパーの子供';
        case 226: return 'ピッグマンの子供';
        case 227: return 'ピッグマンの子供';
        case 231: return 'ワーグの子供';
        case 232: return 'ワーグの子供';
        case 6: return '悪人の子供';
        case 7: return '黒人の子供';
        case 29: return '黒人の子供';
        case 30: return '黒人の子供';
        case 109: return '黒人の子供';
        default: return '〇〇の子供';
    }
}
