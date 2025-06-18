//=============================================================================
// SNH_MsgNameLabel.js
//=============================================================================

/*:
 * @plugindesc Change something.
 * @author Gabacho
 *
 * @help OMG! Sory. I can not write a English. Because I am Japanese! 
 *
 * This plugin is released under the MIT License.
 */
 
/*:ja
 * @plugindesc メッセージ名前ラベルプラグイン
 * @author ガバチョ（溟犬一六）(https:/star-write-dream.com)
 * @help プラグインコマンドはありません。
 * このプラグインはMITライセンスです。
 * ----------------------------------------------------------------------------
 * 
 * 文章の表示をする時、指定した名前を表示します。
 * 文字と背景（ネームプレート）の色、サイズ、位置を設定できます。
 * 
 * また飾りつけ用に四角形・円を複数描画できます。
 * 画像ファイルも追加可能です。
 * 
 * ----------------------------------------------------------------------------
 *
 * ■使い方
 * メッセージ内に「\nl<名前>」と入れると「名前」が表示されます。
 *
 * ----------------------------------------------------------------------------
 * ☆パラメーター設定の前に
 *
 * ○位置調整
 * デフォルト値は、顔グラフィックの下側に表示する設定になっています。
 * 名前文字の0位置はメッセージウィンドウの左上、
 * 追加部品の0位置は名前文字の左上です。
 *
 * ○ネームプレート
 * 名前文字の背景として使う四角形です。
 * 表示したくない場合は以下の設定で透明にできます。
 * ・gradationMode：false
 * ・color1のopacity：0
 *
 *
 * ○必須項目
 * 「文字サイズ」から「ネームプレート」までが必須です。
 * 「追加四角部品」から下はデータなしでかまいません。
 * ※「ネームプレート」は初期データが入っていませんので、
 *   手動で登録してください。
 *
 *
 * ○入力方法
 * 「ネームプレート」「追加四角部品」「追加円部品」
 * 「追加ネームプレート画像」「追加画像部品」は、ダブルクリックすると子画面が出てきます。
 * 子画面で「行」をダブルクリックすると、中身を登録できます。
 * 「行」は何件も登録できます。
 * ただし、「ネームプレート」と「追加ネームプレート画像」は１行目だけ使用されます。
 *
 * ----------------------------------------------------------------------------
 *
 * ☆パラメータ説明
 *   入力画面の下側に表示される説明を読んでください。
 *   補足が必要なものだけ記載します。
 * 
 * ■文字サイズ自動調整（初期値:ON）
 * ネームプレートのwidthが0の場合、OFFで動作します。
 * 
 * 【ネームプレート】
 * 一番奥に表示されます。
 * 表示順を設定できる文字・部品より手前には表示できません。
 * 見せたくない場合は以下の設定で透明にしてください。
 * ・color1のopasity:0
 * ・gradationMode:OFF（false）
 * 
 * ■width（初期値:144）
 * 0だと文字の長さに合わせて伸び縮みします。
 * 
 * ■文字の寄せ方（縦）
 * 中央寄せ、下寄せにしたい時は、
 * ネームプレートの高さに余裕をもたせてください。
 * 
 * 【追加ネームプレート画像】
 * ネームプレートのすぐ手前に表示されます。
 * 表示順を設定できる文字・部品より手前には表示できません。
 * 
 * ■autoScaleMode
 * ONにすると、文字の長さに合わせて横方向に伸び縮みします。
 * （scaleXが、名前の長さに合わせて自動設定されるイメージです）
 * 
 * ----------------------------------------------------------------------------
 * 
 * ☆こんな時はどうする？
 *
 * ■名前とネームプレートの位置をずらしたい
 *  ネームプレートを透明にして、四角部品を使ってください。
 *  ただし、四角部品は文字の長さによる伸び縮みはできません。
 *
 *
 * ■ネームプレート画像を使う時、文字の「寄せ方」がずれる気がする
 *  文字の寄せ方は、「ネームプレート」の幅、高さを相手にしています。
 *  まずは「ネームプレート画像」の幅・高さを調べて、
 *  「ネームプレート」のwidth・heightに設定してください。
 *  その後は目視確認をしながら、
 *  「ネームプレート画像」のpositionXとposionYの値を使って調整してください。
 *
 * 
 * ■名前ラベルをメッセージウィンドウの上にはみ出させると、
 *  ウィンドウ位置「上」の時画面外に出てしまう。
 * 「SNH_MessageWindowPosition.js」を使うと、
 * メッセージウィンドウの上下位置を調整できるようになります。
 *
 * ----------------------------------------------------------------------------
 * 
 * @param 文字サイズ
 * @type number
 * @desc 名前ラベルのフォントサイズを指定。（初期値：24）
 * @default 24
 *
 * @param 文字サイズ自動調整
 * @type boolean
 * @desc ON:ネームプレートに収まるように文字サイズを自動調整します。 OFF:設定した文字サイズのままで表示します。
 * @default true
 *
 * @param 文字色
 * @type number
 * @desc 名前ラベルの文字色を指定。数値と色の対応は、メッセージの文字色指定と同じ。（初期値：17）
 * @default 17
 * @min 0
 * @max 31
 *
 * @param 文字フチ色
 * @type number
 * @desc 名前ラベルの文字色を指定。数値と色の対応は、メッセージの文字色指定と同じ。（初期値：19）
 * @default 19
 * @min 0
 * @max 31
 *
 * @param 文字の寄せ方（縦）
 * @type select
 * @desc 名前ラベルの縦位置の寄せ方を指定。（初期値：中央寄せ）
 * @option 上寄せ
 * @value up
 * @option 中央寄せ
 * @value center
 * @option 下寄せ
 * @value down
 * @default center
 *
 * @param 文字の寄せ方（横）
 * @type select
 * @desc 名前ラベルの横位置の寄せ方を指定。（初期値：中央寄せ）
 * @option 左寄せ
 * @value left
 * @option 中央寄せ
 * @value center
 * @option 右寄せ
 * @value right
 * @default center
 *
 *
 * @param 左右位置調整
 * @type number
 * @desc 左右位置を調整する値をピクセルで指定。プラスで右、マイナスで左に調整。（初期値：18）
 * @default 18
 * @min -9999
 *
 * @param 上下位置調整
 * @type number
 * @desc 上下位置を調整する値をピクセルで指定。プラスで下、マイナスで上に調整。（初期値：134）
 * @default 134
 * @min -9999
 *
 * 
 * @param 文字の表示順
 * @type number
 * @desc 部品と重なった時、どちらを手前にするかの値を指定します。この値が大きいほど手前になります。
 * @default 99
 * @max 99
 * 
 * @param ネームプレート
 * @type struct<NamePlate>[]
 * @desc ネームプレートの設定。１件目のデータしか使われません。表示しない場合は透明にしてください。
 *
 * @param 追加四角部品
 * @type struct<AttachmentRect>[]
 * @desc 追加する四角部品の設定。複数登録可能ですが、処理が重くなるかもしれません。
 * 
 * @param 追加円部品
 * @type struct<AttachmentCircle>[]
 * @desc 追加する円部品の設定。複数登録可能ですが、処理が重くなるかもしれません。
 *
 * @param 追加ネームプレート画像
 * @type struct<PlatePicture>[]
 * @desc 追加する画像ファイルの設定。１件目のデータしか使われません。ネームプレートのように配置されます。
 * @dir img/pictures/
 *
 * @param 追加画像部品
 * @type struct<Picture>[]
 * @desc 追加する画像ファイルの設定。
 * @dir img/pictures/
 *
*/
/*~struct~NamePlate:
 * 
 * @param width
 * @type number
 * @desc 幅をピクセルで指定。（初期値：144） 0だと文字数に合わせて伸び縮みします。
 * @default 144
 * 
 * @param height
 * @type number
 * @desc 高さをピクセルで指定 。（初期値：34）文字サイズ＋paddingY×2でぴったりサイズです。
 * @default 34
 * 
 * @param paddingX
 * @type number
 * @desc 左右の内側余白をピクセルで指定。（初期値：5）値を大きくするとネームプレートと文字のスキマが増えます。
 * @default 5
 * 
 * @param paddingY
 * @type number
 * @desc 上下の内側余白をピクセルで指定。（初期値：5）値を大きくするとネームプレートと文字のスキマが増えます。
 * @default 5
 * 
 * @param color1
 * @type struct<Color>
 * @desc ネームプレートの色
 * @default {"red":"240","green":"248","blue":"255", "opacity":"0.3"}
 * 
 * @param gradationMode
 * @type boolean
 * @desc true:color1からcolor2へグラデーションします。 false:color1単色です。
 * @default false
 * 
 * @param gradationVertical
 * @type boolean
 * @desc true:縦にグラデーションします。 false:横にグラデーションします。
 * @default false
 *
 *
 * @param color2
 * @type struct<Color>
 * @desc グラデーションカラー
 * @default {"red":"0","green":"0","blue":"0", "opacity":"1"}
 * 
 */
/*~struct~AttachmentRect:
 * 
 * @param orderNo
 * @type number
 * @desc この値が大きいほど手前に表示されます。同じ値だと後に定義された部品ほど手前に表示されます。
 * @default 0
 * @max 99
 * @min 0
 * 
 * @param width
 * @type number
 * @desc 四角形の幅をピクセルで指定。
 * @default 0
 * 
 * @param height
 * @type number
 * @desc 四角形の高さをピクセルで指定。
 * @default 0
 * 
 * @param positionX
 * @type number
 * @desc 横方向の表示位置を調整する値をピクセルで指定。
 * @min -999
 * @default 0
 * 
 * @param positionY
 * @type number
 * @desc 縦方向の表示位置を調整する値をピクセルで指定。
 * @min -999
 * @default 0
 * 
 * @param color1
 * @type struct<Color>
 * @desc 四角形の色
 * @default {"red":"0","green":"0","blue":"0", "opacity":"1"}
 * 
 * @param gradationMode
 * @type boolean
 * @desc true:color1からcolor2へグラデーションします。 false:color1単色です。
 * @default false
 * 
 * @param gradationVertical
 * @type boolean
 * @desc true:縦にグラデーションします。 false:横にグラデーションします。
 * @default false
 *
 * @param color2
 * @type struct<Color>
 * @desc グラデーションカラー
 * @default {"red":"0","green":"0","blue":"0", "opacity":"1"}
 * 
 * @param rotation
 * @type number
 * @desc 何度かたむけるかを指定。（0～360）
 * @max 360
 * @default 0
 * 
 */
/*~struct~AttachmentCircle:
 * 
 * @param orderNo
 * @type number
 * @desc この値が大きいほど手前に表示されます。同じ値だと後に定義された部品ほど手前に表示されます。
 * @default 0
 * @max 99
 * @min 0
 * 
 * @param radius
 * @type number
 * @desc 円の半径をピクセルで指定。
 * @default 0
 * 
 * @param positionX
 * @type number
 * @desc 横方向の表示位置を調整する値をピクセルで指定。
 * @default 0
 * @min -9999
 * 
 * @param positionY
 * @type number
 * @desc 縦方向の表示位置を調整する値をピクセルで指定。
 * @default 0
 * @min -9999
 * 
 * @param color
 * @type struct<Color>
 * @desc 円の色
 * @default {"red":"0","green":"0","blue":"0", "opacity":"1"}
 * 
 */
/*~struct~Color:
 * 
 * @param red
 * @type number
 * @max 255
 * @desc 赤(R)。0～255で指定してください。
 * @default 0
 * 
 * @param green
 * @type number
 * @max 255
 * @desc 緑(G)。0～255で指定してください。
 * @default 0
 * 
 * @param blue
 * @type number
 * @max 255
 * @desc 青(B)。0～255で指定してください。
 * @default 0
 * 
 * @param opacity
 * @type number
 * @max 1
 * @desc 不透明度を0～1で指定してください。0で透明です。
 * @default 1
 * @decimals 1
 * 
 */
/*~struct~Picture:
 * 
 * @param orderNo
 * @type number
 * @desc この値が大きいほど手前に表示されます。同じ値だと後に定義された画像ほど手前に表示されます。
 * @default 0
 * @max 99
 * 
 * @param fileName
 * @type file
 * @desc img/picturesフォルダの画像ファイルを指定。
 * @dir img/pictures/
 * @default fileName_Nothing
 * 
 * @param positionX
 * @type number
 * @desc 横方向の表示位置を調整する値をピクセルで指定。
 * @min -999
 * @default 0
 * 
 * @param positionY
 * @type number
 * @desc 縦方向の表示位置を調整する値をピクセルで指定。
 * @min -999
 * @default 0
 * 
 * @param scaleX
 * @type number
 * @desc 横方向の拡大倍率を指定。1で等倍。2で2倍。マイナスだと画像が反転します。
 * @default 1
 * @max 10
 * @min -10
 * @decimals 1
 * 
 * @param scaleY
 * @type number
 * @desc 縦方向の拡大倍率を指定。1で等倍。2で2倍。マイナスだと画像が反転します。
 * @default 1
 * @max 10
 * @min -10
 * @decimals 1
 * 
 * @param opacity
 * @type number
 * @max 255
 * @desc 不透明度を0～255で指定してください。0で透明です。
 * @default 255
 * 
 * @param rotation
 * @type number
 * @desc 何度かたむけるかを指定。（0～360）
 * @max 360
 * @default 0
 * 
 */
/*~struct~PlatePicture:
 * 
 * @param fileName
 * @type file
 * @desc img/picturesフォルダの画像ファイルを指定。
 * @dir img/pictures/
 * @default fileName_Nothing
 * 
 * @param positionX
 * @type number
 * @desc 横方向の表示位置を調整する値をピクセルで指定。
 * @min -999
 * @default 0
 * 
 * @param positionY
 * @type number
 * @desc 縦方向の表示位置を調整する値をピクセルで指定。
 * @min -999
 * @default 0
 * 
 * @param autoScaleMode
 * @type boolean
 * @desc true:名前文字が長い時自動で伸びます。 false:伸びません。
 * @default false
 * 
 * @param scaleX
 * @type number
 * @desc 横方向の拡大倍率を指定。1で等倍。2で2倍。マイナスだと画像が反転します。
 * @default 1
 * @max 10
 * @min -10
 * @decimals 1
 * 
 * @param scaleY
 * @type number
 * @desc 縦方向の拡大倍率を指定。1で等倍。2で2倍。マイナスだと画像が反転します。
 * @default 1
 * @max 10
 * @min -10
 * @decimals 1
 * 
 * @param opacity
 * @type number
 * @max 255
 * @desc 不透明度を0～255で指定してください。0で透明です。
 * @default 255
 * 
 */


(function() {
    'use strict';
        
    var convertToNumber = function(obj) {
        for(var prop in obj) {
            obj[prop] = Number(obj[prop]);
        }
        return obj;
    }
    
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };
    
    var convertArrayParam = function(param) {
        if (!param) {
            return;
        }
        
        if(param !== undefined){
            try {
                const array = JSON.parse(param);
                for(let i = 0; i < array.length; i++) {
                    array[i] = JSON.parse(array[i]);
                }
                return array;
            }catch(e){
                console.group();
                console.error('%cParameter is invalid ! SNH_MsgNameLableのパラメータ準備に失敗しました。','background-color: #5174FF');
                console.error('Parameter:' + eval(param));
                console.error('Error message :' + e);
                console.groupEnd();
            }
        }
    };
    
    var convertParam = function(param) {
        if(param !== undefined){
            try {
                return JSON.parse(param);
            }catch(e){
                console.group();
                console.error('%cParameter is invalid ! SNH_MsgNameLableのパラメータ準備に失敗しました。','background-color: #5174FF');
                console.error('Parameter:' + eval(param));
                console.error('Error message :' + e);
                console.groupEnd();
            }
        }
    };
    
    var parameters = PluginManager.parameters('SNH_MsgNameLabel');
    var nameLabelFontSize = Number(parameters['文字サイズ'] || 24);
    var nameLabelFontColor = Number(parameters['文字色'] || 0);
    var nameLabelFontOutLineColor = Number(parameters['文字フチ色'] || 15);
    var nameLabelAlignY = String(parameters['文字の寄せ方（縦）'] || 'center');
    var nameLabelAlignX = String(parameters['文字の寄せ方（横）'] || 'center');
    var nameAutoMode = Boolean(parameters['文字サイズ自動調整'] === 'true' || false);
    var nameLabelBackHeight = Number(parameters['背景の高さ調整'] || 10);
    var nameLabelChoseiX = Number(parameters['左右位置調整'] || 0);
    var nameLabelChoseiY = Number(parameters['上下位置調整'] || 0);
    var nameLabelOrderNo = Number(parameters['文字の表示順'] || 99);

    var param = {};
    param.NamePlate = String(parameters['ネームプレート']);
    param.NamePlate = convertArrayParam(param.NamePlate);
    param.AttachmentRect = String(parameters['追加四角部品']);
    param.AttachmentRect = convertArrayParam(param.AttachmentRect);
    param.AttachmentCircle = String(parameters['追加円部品']);
    param.AttachmentCircle = convertArrayParam(param.AttachmentCircle);
    param.NamePlatePictures = String(parameters['追加ネームプレート画像']);
    param.NamePlatePictures = convertArrayParam(param.NamePlatePictures);
    param.AttachmentPictures = String(parameters['追加画像部品']);
    param.AttachmentPictures = convertArrayParam(param.AttachmentPictures);

    let partsList = [];
    let namePlate = [];
    let namePlatePicture = [];
    let namePlatePictureWidth = 0;

    // 矩形bitmap作成
    function createPartsSpriteRect(parts) {
        let bitmap = new Bitmap(0,0);
        bitmap.resize(parts.width, parts.height);

        if (parts.gradationMode){
            bitmap.gradientFillRect(0, 0, parts.width, parts.height
                                             ,'rgba('+parts.color1.red + ',' + parts.color1.green + ',' + parts.color1.blue + ',' + parts.color1.opacity + ')'
                                             ,'rgba('+parts.color2.red + ',' + parts.color2.green + ',' + parts.color2.blue + ',' + parts.color2.opacity + ')'
                                             , parts.gradationVertical);
        } else {
            bitmap.fillRect(0, 0, parts.width, parts.height
                                     ,'rgba('+parts.color1.red + ',' + parts.color1.green + ',' + parts.color1.blue + ',' + parts.color1.opacity + ')');
        }
        return bitmap;
    }

    //円bitmap作成
    function createPartsSpriteCircle(parts) {
        let bitmap = new Bitmap(0,0);
        bitmap.resize(parts.radius * 2, parts.radius * 2);

        bitmap.drawCircle(parts.radius, parts.radius, parts.radius
                                 ,'rgba(' + parts.color.red + ',' + parts.color.green + ',' + parts.color.blue + ',' + parts.color.opacity+')');
        return bitmap;
    }

    //画像bitmap作成
    function createPartsSpritePicture(parts) {
        let bitmap = new Bitmap(0,0);
        bitmap = ImageManager.loadBitmap('img/pictures/',parts.fileName , 0, false);
        return bitmap;
    }
    
    //初期処理：構造体の整形とbitmapの準備
    (function initPartsList() {
        if (param.NamePlate && param.NamePlate.length > 0) {
            let plate = param.NamePlate[0];
            plate.type = 'rect';
            plate.orderNo = -1;
            plate.width = Number(plate.width);
            plate.height = Number(plate.height);
            plate.paddingX = Number(plate.paddingX);
            plate.paddingY = Number(plate.paddingY);
            plate.gradationMode = Boolean(plate.gradationMode === 'true' || false);
            plate.gradationVertical = Boolean(plate.gradationVertical === 'true' || false);
            plate.color1 = convertToNumber(convertParam(plate.color1))
            plate.color2 = convertToNumber(convertParam(plate.color2))
            plate.rotation = 0;
            if (plate.height === 0) {
                plate.height = nameLabelFontSize;
            }

            plate.bitmap = createPartsSpriteRect(plate);
            namePlate.push(plate);
        }

        if (param.AttachmentRect && param.AttachmentRect.length > 0) {
            for(let rect of param.AttachmentRect) {
                rect.type = 'rect';
                rect.orderNo = Number(rect.orderNo);
                rect.width = Number(rect.width);
                rect.heigth = Number(rect.heigth);
                rect.positionX = Number(rect.positionX);
                rect.positionY = Number(rect.positionY);
                rect.gradationMode = Boolean(rect.gradationMode === 'true' || false);
                rect.gradationVertical = Boolean(rect.gradationVertical === 'true' || false);
                rect.color1 = convertToNumber(convertParam(rect.color1))
                rect.color2 = convertToNumber(convertParam(rect.color2))
                rect.rotation = Number(rect.rotation);
                rect.bitmap = createPartsSpriteRect(rect);
                if (rect.width === 0 || rect.height === 0) {
                    continue;
                }
                
                partsList.push(rect);
            }
        }

        if (param.AttachmentCircle && param.AttachmentCircle.length > 0) {
            for(let circle of param.AttachmentCircle) {
                circle.type = 'circle';
                circle.orderNo = Number(circle.orderNo);
                circle.radius = Number(circle.radius);
                circle.positionX = Number(circle.positionX);
                circle.positionY = Number(circle.positionY);
                circle.color = convertToNumber(convertParam(circle.color))
                circle.bitmap = createPartsSpriteCircle(circle);
                if (circle.radius === 0) {
                    continue;
                }
                partsList.push(circle);
            }
        }

        if (param.AttachmentPictures && param.AttachmentPictures.length > 0) {
            let pictureBitmap = new Bitmap(0,0);
            for(let picture of param.AttachmentPictures) {
                picture.type = 'picture';
                picture.orderNo = Number(picture.orderNo);
                picture.fileName = String(picture.fileName);
                picture.positionX = Number(picture.positionX);
                picture.positionY = Number(picture.positionY);
                picture.scaleX = Number(picture.scaleX);
                picture.scaleY = Number(picture.scaleY);
                picture.opacity = Number(picture.opacity);
                picture.rotation = Number(picture.rotation);
                if (picture.fileName === 'fileName_Nothing') {
                    continue;
                }
                picture.bitmap = createPartsSpritePicture(picture);
                partsList.push(picture);
            }
        }
        
        if (param.NamePlatePictures && param.NamePlatePictures.length > 0) {
            let pPictureBitmap = new Bitmap(0,0);
            let pPicture = param.NamePlatePictures[0];
            
            pPicture.type = 'picture';
            pPicture.orderNo = 0;
            pPicture.fileName = String(pPicture.fileName);
            pPicture.positionX = Number(pPicture.positionX);
            pPicture.positionY = Number(pPicture.positionY);
            pPicture.autoScaleMode = Boolean(pPicture.autoScaleMode === 'true' || false);
            pPicture.scaleX = Number(pPicture.scaleX);
            pPicture.scaleY = Number(pPicture.scaleY);
            pPicture.opacity = Number(pPicture.opacity);
            pPicture.rotation = 0;
            if (pPicture.fileName != 'fileName_Nothing') {
                pPicture.bitmap = createPartsSpritePicture(pPicture);
                namePlatePictureWidth = pPicture.bitmap.width;
                namePlatePicture.push(pPicture);
            }
        }
        
        //並び替え
        partsList.sort(function(a,b){
                if(a.orderNo < b.orderNo) return -1;
                if(a.orderNo > b.orderNo) return 1;
                return 0;
        });
        
    })();
    
    //-----------------------------------------------
    // Window_Messageの機能追加
    //-----------------------------------------------
    
    // 名前ラベルのテキストを取得
    let nameLabelText = '';
    var escapeNameLabel = function(nameText) {
        // 名前ラベルの描画
        if (nameText != '') {
            nameLabelText = nameText;
        }
        
        return '';
    };
    
    var _Window_Message_initialize = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function() {
        _Window_Message_initialize.call(this);
        this._snhNameLabelList = [];
    }
    
    var _Window_Message_startMessage=Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.call(this);
        
        //制御文字の除去
        if (this._textState) {
            this._textState.text = this._textState.text.replace(/\x1bNL\<(.*?)\>/gi, function() {
                return escapeNameLabel(arguments[1]);
            }, this);
            
            if (nameLabelText != ''){
                this.snhDrawNameLabel();
            }
        }
    };

    var _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        _Window_Message_terminateMessage.call(this);
        
        //ラベルの除去
        this.snhRemoveNameLabel();
    };
    
    //メイン処理
    Window_Message.prototype.snhDrawNameLabel = function(){
        let spriteBase = new Sprite();
        
        let nameBitmap = new Bitmap(0, 0);
        let nameSprite = new Sprite();

        let cSize = nameBitmap.measureTextWidth('幅');
        let nameWidth = nameBitmap.measureTextWidth(nameLabelText);
        
        let scene = SceneManager._scene;
        
        //位置調整
        let startX = nameLabelChoseiX;
        let startY = nameLabelChoseiY;
        spriteBase.move(startX, startY);
        
        //文字の設定
        nameBitmap.fontSize = nameLabelFontSize;
        nameBitmap.textColor=scene._messageWindow.textColor(nameLabelFontColor);
        nameBitmap.outlineColor=scene._messageWindow.textColor(nameLabelFontOutLineColor);

        //ネームプレートがない時は終わり
        let wNamePlate = namePlate[0];
        if (!wNamePlate) {
            return;
        }
        
        let height = wNamePlate.height;
        let width = wNamePlate.width;
        
        //ネームプレートを設定
        let namePlateSprite = new Sprite();
        if (width > 0) {
            namePlateSprite.bitmap = wNamePlate.bitmap;
            spriteBase.addChild(namePlateSprite);
        } else {
            //描画
            width = nameWidth + wNamePlate.paddingX * 2;
            let namePlateBitmap = new Bitmap(width, wNamePlate.height);
            namePlateSprite.bitmap = namePlateBitmap;
            namePlateSprite.rotation = wNamePlate.rotation * Math.PI / 180;

            if (wNamePlate.gradationMode){
                namePlateBitmap.gradientFillRect(0, 0, width, wNamePlate.height
                                                 ,'rgba(' + wNamePlate.color1.red + ',' + wNamePlate.color1.green + ',' + wNamePlate.color1.blue + ',' + wNamePlate.color1.opacity+')'
                                                 ,'rgba(' + wNamePlate.color2.red + ',' + wNamePlate.color2.green + ',' + wNamePlate.color2.blue + ',' + wNamePlate.color2.opacity+')'
                                                 , wNamePlate.gradationVertical);
            } else {
                namePlateBitmap.fillRect(0, 0, width, wNamePlate.height
                                         ,'rgba('+wNamePlate.color1.red+','+ wNamePlate.color1.green+','+ wNamePlate.color1.blue+','+ wNamePlate.color1.opacity+')');
            }
            
            spriteBase.addChild(namePlateSprite);
        }
        
        //ネームプレート画像
        if (namePlatePicture && namePlatePicture.length > 0) {
            namePlatePicture[0]
            let platePictureSprite = new Sprite();
            platePictureSprite.bitmap = namePlatePicture[0].bitmap;
            if (!nameAutoMode && namePlatePicture[0].autoScaleMode) {
                if (namePlatePictureWidth === 0) {
                    namePlatePictureWidth = namePlatePicture[0].width;
                }
                
                width = nameWidth + wNamePlate.paddingX * 2;
                platePictureSprite.scale.x = width / namePlatePictureWidth;
            }
            platePictureSprite.move(namePlatePicture[0].positionX, namePlatePicture[0].positionY);
            spriteBase.addChild(platePictureSprite);
        }

        //名前の描画の準備
        let yChosei = 0;

        //プレートの高さが十分な時
        if (nameLabelFontSize < wNamePlate.height - wNamePlate.paddingY * 2) {
            let wHeight =  wNamePlate.height - wNamePlate.paddingY;
            if (nameLabelAlignY === 'up') {
                yChosei = wNamePlate.paddingY;
            } else if (nameLabelAlignY === 'center') {
                yChosei = wNamePlate.paddingY + (wHeight - wNamePlate.paddingY - nameLabelFontSize) / 2;
            } else if (nameLabelAlignY === 'down') {
                yChosei = wNamePlate.paddingY+ (wHeight - nameLabelFontSize - wNamePlate.paddingY);
            }
        } else {
            yChosei = wNamePlate.paddingY;
        }
        
        if (nameAutoMode && wNamePlate.width > 0) {
            width -= wNamePlate.paddingX * 2;
        } else {
            width = nameWidth;
        }

        nameBitmap.resize(width, cSize);
        nameSprite.bitmap = nameBitmap;
        
        let drawNameFinish = false;
        nameSprite.move(wNamePlate.paddingX, yChosei);
        
        //パーツと名前の描画
        if (partsList.length > 0) {
            for(let parts of partsList) {
                if (nameLabelOrderNo < parts.orderNo && !drawNameFinish) {
                    spriteBase.addChild(this.snhDrawingName(nameSprite, width, cSize));
                    drawNameFinish = true;
                }
                let sprite = new Sprite(parts.bitmap);
                sprite.move(parts.positionX, parts.positionY);
                
                if (parts.type === 'rect'){
                    sprite.rotation = parts.rotation * Math.PI / 180;
                } else if (parts.type === 'picture') {
                    sprite.opacity = parts.opacity;
                    sprite.rotation = parts.rotation * Math.PI / 180;
                    sprite.scale.x = parts.scaleX;
                    sprite.scale.y = parts.scaleY;
                }
                
                spriteBase.addChild(sprite);
            }
        }
        
        if (!drawNameFinish) {
            spriteBase.addChild(this.snhDrawingName(nameSprite, width, cSize));
        }
        
        this.snhSetNameLabelSprite(spriteBase);
    };

    // 名前を描画して返す
    Window_Message.prototype.snhDrawingName = function(sprite, width, height) {
        sprite.bitmap.drawText(nameLabelText, 0, 0, width, height, nameLabelAlignX);
        return sprite;
    }
    
    // スプライトの登録
    Window_Message.prototype.snhSetNameLabelSprite = function(sprite) {
        this.addChild(sprite);
        //実際に入るスプライトは１件なのでリストに入れる必要はないですが、作る時に紆余曲折あり、その名残です。
        this._snhNameLabelList.push(sprite);
    }
    
    //名前ラベルの除去
    Window_Message.prototype.snhRemoveNameLabel = function() {
        if (this._snhNameLabelList && this._snhNameLabelList.length > 0){
            for (let label of this._snhNameLabelList) {
                this.removeChild(label);
            }
        }

        this._snhNameLabelList = [];
        nameLabelText = '';
    };

    
})();


