//=============================================================================
// SwitchOnWithLevelUp.js
//=============================================================================

/*:
 * @plugindesc レベルアップ時に、指定したスイッチをONにします。
 * @author 奏ねこま（おとぶきねこま）
 *
 * @param Switch ID
 * @desc レベルアップ時にONにするスイッチのIDを指定してください。
 * @default 0
 *
 * @param Variable ID for Actor ID
 * @desc レベルアップしたアクターのIDを格納する変数のIDを指定してください。
 * @default 0
 *
 * @help
 * レベルアップ時に、指定したスイッチをONにしますが、自動でOFFにはしません。
 * 同スイッチをトリガーにしたコモンイベント等でOFFにしてください。
 *
 * バトル終了時のリザルトでのレベルアップではスイッチはONになりません。
 *
 * レベルアップしたアクターのIDを変数に格納する機能を有していますが、そのアクターID
 * を使って何ができるかという説明はここでは割愛します。
 * ざっくり言うと、スクリプトを使っていろいろなアクター情報を取得できたりします。
 * 複数のアクターが同時にレベルアップした場合に、どのアクターのIDが格納されるかは
 * 保証できませんので、予めご了承ください。
 *
 * *このプラグインには、プラグインコマンドはありません。
 *
 * [ 利用規約 ] ...................................................................
 *  本プラグインの利用者は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  商用、非商用、ゲームの内容（年齢制限など）を問わず利用可能です。
 *  ゲームへの利用の際、報告や出典元の記載等は必須ではありません。
 *  二次配布や転載、ソースコードURLやダウンロードURLへの直接リンクは禁止します。
 *  （プラグインを利用したゲームに同梱する形での結果的な配布はOKです）
 *  不具合対応以外のサポートやリクエストは受け付けておりません。
 *  本プラグインにより生じたいかなる問題においても、一切の責任を負いかねます。
 * [ 改訂履歴 ] ...................................................................
 *   Version 1.00  2016/07/06  初版
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  Web Site: http://i.gmobb.jp/nekoma/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 */

(function(){
    'use strict';
    
    const _PNAME = 'SwitchOnWithLevelUp';
    const _PARAMETERS = PluginManager.parameters(_PNAME);

    const _SWITCH_ID = +_PARAMETERS['Switch ID'] || 0;
    const _VARIABLE_ID = +_PARAMETERS['Variable ID for Actor ID'] || 0;
    
    var _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function() {
        _Game_Actor_levelUp.call(this);
        if (!$gameParty.inBattle() && _SWITCH_ID) {
            $gameSwitches.setValue(_SWITCH_ID, true);
        }
        if (_VARIABLE_ID) {
            $gameVariables.setValue(_VARIABLE_ID, this.actorId());
        }
    };
}());
