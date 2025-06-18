/*:
 * @plugindesc マウス操作を拡張します
 * @author ル
 * 
 * @help
 * 条件分岐で　ボタン[キャンセル]が押されている　を指定した場合、
 * マウスの右クリックも条件に含めるようにします。
 * 
 * 条件分岐で　ボタン[左]が押されている　を指定した場合、
 * 画面左半分でのマウスの左クリックも条件に含めるようにします。
 * 
 * 条件分岐で　ボタン[右]が押されている　を指定した場合、
 * 画面右半分でのマウスの左クリックも条件に含めるようにします。
 * 
 * 家系図で、マウスホイールでのスクロールができるようにします。
 * 
 * セーブ画面で、マウス操作でページを選択できるようにします。
 * 
 */
var Nore;
(function (Nore) {
const parameters = PluginManager.parameters('Nore_Plugins');


const _Game_Interpreter_prototype_command111 = Game_Interpreter.prototype.command111;
Game_Interpreter.prototype.command111 = function() {
    var result = false;
    //console.log(TouchInput.isCancelled())
    switch (this._params[0]) {
       
        case 11:  // Button
            //console.log(this._params[1])
            if (this._params[1] == 'cancel') {
                //console.log(TouchInput._cancelled2)
                //console.log(TouchInput.rightButton)
                if (TouchInput.rightButton) {
                    result = true;
                    this._branch[this._indent] = result;
                    if (this._branch[this._indent] === false) {
                        this.skipBranch();
                    }
                    return true;
                }
            }
            if (this._params[1] == 'left') {
                if (TouchInput.leftButtonByLeftSide) {
                    result = true;
                    this._branch[this._indent] = result;
                    if (this._branch[this._indent] === false) {
                        this.skipBranch();
                    }
                    return true;
                }
            }
            if (this._params[1] == 'right') {
                if (TouchInput.leftButtonByRightSide) {
                    result = true;
                    this._branch[this._indent] = result;
                    if (this._branch[this._indent] === false) {
                        this.skipBranch();
                    }
                    return true;
                }
            }
       
    }
    return _Game_Interpreter_prototype_command111.call(this);
};


var _TouchInput_clear = TouchInput.clear;
TouchInput.clear = function () {
    _TouchInput_clear.call(this);
    this.rightButton = false;
    this.leftButtonByRightSide = false;
    this.leftButtonByLeftSide = false;
    this.rightButtonCount = 0;
};
TouchInput._onRightButtonDown = function (event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    if (Graphics.isInsideCanvas(x, y)) {
        this._onCancel(x, y);
        this.rightButton = true;
        this.rightButtonCount = 10;
    }
};

TouchInput._onLeftButtonDown = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    if (Graphics.isInsideCanvas(x, y)) {
        this._mousePressed = true;
        this._pressedTime = 0;
        this._onTrigger(x, y);

        if (Graphics._boxWidth / 2 < x) {
            this.leftButtonByRightSide = true;
        } else {
            this.leftButtonByLeftSide = true;
        }
        this.leftButtonCount = 10;
    }
};



var _TouchInput_update = TouchInput.update;
TouchInput.update = function () {
    _TouchInput_update.call(this);
    if (this.rightButtonCount > 0) {
        this.rightButtonCount--;
        if (this.rightButtonCount <= 0) {
            this.rightButton = false;
        }
    }
    if (this.leftButtonCount > 0) {
        this.leftButtonCount--;
        if (this.leftButtonCount <= 0) {
            this.leftButtonByRightSide = false;
            this.leftButtonByLeftSide = false;
        }
    }
};

const Window_FamilyTree_prototype_update = Nore.Window_FamilyTree.prototype.update
Nore.Window_FamilyTree.prototype.update = function () {
    Window_FamilyTree_prototype_update.call(this);
    if (TouchInput.wheelY < 0) {
        this.y += this.interval() * 2;
        if (this.y > 0) {
            this.y = 0;
        }
    }
    else if (TouchInput.wheelY > 0) {
        this.y -= this.interval() * 2;
        if (this.y < -this.maxY()) {
            this.y = -this.maxY();
        }
    }
};


const _Scene_File_update = Scene_File.prototype.update;
Scene_File.prototype.update = function() {
    _Scene_File_update.call(this);
    if (! this._pageWindow) {
        return;
    }
    if (! this._pageWindow.isTouchedInsideFrame()) {
        return;
    }
    if (! TouchInput.isTriggered()) {
        return;
    }
    for (var i = 0; i < 16; i++) {
        const rect = this._pageWindow.itemRect(i);
        if (rect.x <= TouchInput.x && rect.x + rect.width >= TouchInput.x) {
            if (this._pageWindow._index == i) {
                break;
            }
            SoundManager.playCursor();
            var before = this._listWindow.index();

            this._pageWindow._index = i;
            this._pageWindow.refresh();
            this._listWindow.setPageIndex(i);

            if (this._listWindow.maxItems() <= before) {
                this._listWindow.select(0);
            }
            break;
        }
    }
};




})(Nore || (Nore = {}));


/*
(function() {

    function p(arg) {
        console.log(arg);
    }

    (window).p = p;

})();
*/