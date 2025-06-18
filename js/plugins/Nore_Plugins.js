/*:
 * @plugindesc いろいろ気になったところ
 * @author ル
 * 
 * @param choiseLiseWindowMargin
 * @desc 選択肢を表示するウィンドウの右側の隙間を設定します
 * @default 195
 * 
 * @param volumeOffset
 * @desc ボリュームを変更したときに変わる値を設定します
 * @default 5
 * 
 * @param loadSkinScript
 * @desc BB_WindowSelector3 と MessageWindowPopup の競合対策をする場合1 しない場合0
 * @default 1
 */
var Nore;
(function (Nore) {
const parameters = PluginManager.parameters('Nore_Plugins');


let choiseLiseWindowMargin = parseInt(parameters['choiseLiseWindowMargin']);
if (choiseLiseWindowMargin > 0) {
    // 選択肢ウィンドウの位置
    const _Window_ChoiceList_prototype_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function() {
        _Window_ChoiceList_prototype_updatePlacement.call(this);

        var positionType = $gameMessage.choicePositionType();
        console.log(positionType)
        switch (positionType) {
        case 2:
            this.x = Graphics.boxWidth - this.width - choiseLiseWindowMargin;
            return;
        }
      
    };
}

let volumeOffset = parseInt(parameters['volumeOffset']);
if (choiseLiseWindowMargin > 0) {
    Window_Options.prototype.volumeOffset = function() {
        return volumeOffset;
    };
}


let loadSkinScript = parseInt(parameters['loadSkinScript']);
if (loadSkinScript > 0) {
    var _Window_Message_loadWindowskin = Window_Message.prototype.loadWindowskin;
    Window_Message.prototype.loadWindowskin = function() {
        let BBWSvar = 11
        if($gameVariables.value(BBWSvar) == 3){
            this.windowskin = ImageManager.loadSystem('Window3');
        }else if($gameVariables.value(BBWSvar) == 2){
            this.windowskin = ImageManager.loadSystem('Window2');
        }else{
            this.windowskin = ImageManager.loadSystem('Window');
        }
    };

    // 通常文字色は固定（ウィンドウ画像読み込み前に文字色を設定された時用）
    Window_Base.prototype.normalColor = function() {
        return '#ffffff';
    };
}


})(Nore || (Nore = {}));
