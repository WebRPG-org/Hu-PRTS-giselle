/*:
 * @plugindesc 回想拡張プラグイン
 * @author ノレ
 *
 * @param 回想スイッチ
 * @desc 回想時に自動的にONになるスイッチ番号
 * @default 1997
 * 
 * @help
 * プラグインコマンド
 * EndRecollection
 * →回想シーンに戻ります。
 * Scene_Recollection.prototype.rngd_exit_scene() をスクリプトで書くのと同じ。
 * 
 */
(function () {

    const pluginName = 'Nore_RecollectionMode';
    const parameters = PluginManager.parameters(pluginName);
    const RECO_SW = parseInt(parameters['回想スイッチ']);
    const LOAD_SAVE_FILES = 12 * 10; // 12個入りのセーブ画面が１０枚。保管セーブを除いたもの


    let globalVariableCache = null;

    const _DataManager_saveGameWithoutRescue = DataManager.saveGameWithoutRescue;
    DataManager.saveGameWithoutRescue = function (savefileId) {
        // セーブが入るとキャッシュ削除
        globalVariableCache = null;
        return _DataManager_saveGameWithoutRescue.call(this, savefileId);
    }

    Window_RecList.prototype.get_global_variables = function () {
        if (globalVariableCache) {
            this._global_variables = globalVariableCache;
            return;
        }
        this._global_variables = {
            "switches": {}
        };
        globalVariableCache = this._global_variables;
        var maxSaveFiles = LOAD_SAVE_FILES;
        let t = new Date().getTime();
        for (var i = 1; i <= maxSaveFiles; i++) {
            if (DataManager.loadGameSwitch(i)) {

                var rec_cg_max = rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set);

                for (var j = 0; j < rec_cg_max; j++) {
                    var cg = rngd_recollection_mode_settings.rec_cg_set[j + 1];
                    if ($gameSwitches._data[cg.switch_id]) {
                        this._global_variables["switches"][cg.switch_id] = true;
                    }
                }
            }
        }
        //console.log('time:' + (new Date().getTime() - t));

    };

    var _nore_recollection_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _nore_recollection_pluginCommand.call(this, command, args);
        if (command === 'EndRecollection') {
            Scene_Recollection.reload_rec_list = true;
            SceneManager.push(Scene_Recollection);
        }
    };

    Scene_Recollection.prototype.commandDoRecMode = function () {
        var target_index = this._rec_list.index() + 1;
        Scene_Recollection.rec_list_index = target_index - 1;

        if (this._rec_list.is_valid_picture(this._rec_list.index() + 1)) {
            // 回想モードの場合
            if (this._mode == "recollection") {
                Scene_Recollection._rngd_recollection_doing = true;

                DataManager.setupNewGame();
                $gamePlayer.setTransparent(255);
                this.fadeOutAll();
                // TODO: パーティを透明状態にする

                //$dataSystem.optTransparent = false;
                $gameSwitches.setValue(RECO_SW, true);

                $gameTemp.reserveCommonEvent(rngd_recollection_mode_settings.rec_cg_set[target_index]["common_event_id"]);
                $gamePlayer.reserveTransfer(rngd_recollection_mode_settings.sandbox_map_id, 0, 0, 0);
                SceneManager.push(Scene_Map);

                // CGモードの場合
            } else if (this._mode == "cg") {
                this._cg_sprites = [];
                this._cg_sprites_index = 0;

                // シーン画像をロードする
                rngd_recollection_mode_settings.rec_cg_set[target_index].pictures.forEach(function (name) {
                    // CGクリックを可能とする
                    var sp = new Sprite_Button();
                    sp.setClickHandler(this.commandDummyOk.bind(this));
                    sp.processTouch = function () {
                        Sprite_Button.prototype.processTouch.call(this);

                    };
                    sp.bitmap = ImageManager.loadPicture(name);
                    // 最初のSprite以外は見えないようにする
                    if (this._cg_sprites.length > 0) {
                        sp.visible = false;
                    }

                    // TODO: 画面サイズにあわせて、拡大・縮小すべき
                    this._cg_sprites.push(sp);
                    this.addChild(sp);

                }, this);

                this.do_exchange_status_window(this._rec_list, this._dummy_window);
                this._dummy_window.visible = false;
            }
        } else {
            this._rec_list.activate();
        }
    };


})();
