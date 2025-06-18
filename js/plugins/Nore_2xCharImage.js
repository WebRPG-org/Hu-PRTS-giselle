/*:
 * @plugindesc 指定の画像を２倍拡大表示にします
 * @help
 * 指定の画像を２倍拡大表示にします
 * 
 * @param file1
 * @desc ファイルその１
 * @type string
 * 
 * @param file2
 * @desc ファイルその2
 * @type string
 * 
 * @param file3
 * @desc ファイルその3
 * @type string
 * 
 * @param file4
 * @desc ファイルその4
 * @type string
 * 
 * @param file5
 * @desc ファイルその5
 * @type string
 * 
 * @param file6
 * @desc ファイルその6
 * @type string
 * 
 * @param file7
 * @desc ファイルその7
 * @type string
 * 
 * @param file8
 * @desc ファイルその8
 * @type string
 * 
 * @param file9
 * @desc ファイルその9
 * @type string
 * 
 * @param file10
 * @desc ファイルその10
 * @type string
 * 
 * @param file11
 * @desc ファイルその11
 * @type string
 * 
 * @param file12
 * @desc ファイルその12
 * @type string
 * 
 * @param file13
 * @desc ファイルその13
 * @type string
 * 
 * @param file14
 * @desc ファイルその14
 * @type string
 * 
 * @param file15
 * @desc ファイルその15
 * @type string
 * 
 * @param file16
 * @desc ファイルその16
 * @type string
 * 
 * @param file17
 * @desc ファイルその17
 * @type string
 * 
 * @param file18
 * @desc ファイルその18
 * @type string
 * 
 * @param file19
 * @desc ファイルその19
 * @type string
 * 
 * @param file20
 * @desc ファイルその20
 * @type string
 * 
 */
var Nore;
(function (Nore) {

    var fileMap = {};

    var param = PluginManager.parameters('Nore_2xCharImage');
    console.log(param['file1'])
    for (var i = 1; i <= 20; i++) {
        fileMap[param['file' + i]] = true;
    }

    var Sprite_Character_prototype_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        Sprite_Character_prototype_update.call(this);
        this.update2xZoom();
    };

    Sprite_Character.prototype.update2xZoom = function() {
        if (this._characterName == '') {
            return;
        }
        if (fileMap[this._characterName]) {
            this.scale.x = 2;
            this.scale.y = 2;
        } else {
            this.scale.x = 1;
            this.scale.y = 1;
        }
    };
})(Nore || (Nore = {}));
