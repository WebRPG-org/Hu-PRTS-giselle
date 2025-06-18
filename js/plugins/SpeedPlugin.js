/*
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function(){

// Insert your custom regex filters here.
// All matches will be removed from clipboard text.

var customRegex = [
    {reg: /\n*\n/g, enabled: true, text: "Remove line breaks"},
    {reg: /(\d+)(?=\s|$)/g, enabled: false, text: "Remove stray numbers"},
    {reg: /\s{2,}/g, enabled: true, text: "Remove long whitespaces"},
    {reg: /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, enabled: true, text: "Remove special symbols"},
    {reg: /\d/g, enabled: false, text: "Remove all numbers"},
    // {reg: /sometext/g, enabled: true, text: "EXAMPLE"},
    // {reg: /some漢字/g, enabled: true, text: "EXAMPLE"},
];

// Do not touch below

var gui = require('nw.gui');
var clipboard = gui.Clipboard.get();

var _settings = {
    BitmapHook : true,
    DrawtextHook : false,
    EscapecharHook : false,
    InstantText : true,
    RewardedSkip : false,
};

var IsHookActive = function(idx) {
    switch (idx) {
        case 1: return _settings.BitmapHook; break;
        case 2: return _settings.DrawtextHook; break;
        case 3: return _settings.EscapecharHook; break;
        default: return false;
    }
};

var _originalInstantDrawFunct = Window_Message.prototype.clearFlags;
var InstantTextDrawFunct = function() {
        _originalInstantDrawFunct.apply(this);
        this._showFast = true;
        this._lineShowFast = true;
        this._pauseSkip = false;
};
Window_Message.prototype.clearFlags = InstantTextDrawFunct;

var _originalDrawText = Bitmap.prototype.drawText;
var BitmapOverrideDraw = function(text, x, y, maxWidth, lineHeight, align){
    BufferedCopyText(text, 1);
    _originalDrawText.call(this, text, x, y, maxWidth, lineHeight, align);
}
Bitmap.prototype.drawText = BitmapOverrideDraw

var _copyAt = 0;
var _textBuffer = "";
var BufferedCopyText = function(text, idx) {
    if (!_settings.BitmapHook) return;
    if (!text || typeof text !== 'string') return;
    _textBuffer += text;
    text = text.trim();
    if (text && text.length != 0 && isNaN(parseInt(text, 10))){
        _copyAt = Date.now() + 50;
    }
    BufferCopy();
};

var copyTimeout = null;
var BufferCopy = function(){
    if (_textBuffer.length > 200) { ___CopyText(_textBuffer, 1); _textBuffer = ""; return; }
    if (copyTimeout == null){
        copyTimeout = setTimeout(CopyBuffer, _copyAt - Date.now());
        return;
    }
};

var CopyBuffer = function() {
    if (Date.now() < _copyAt){
        copyTimeout = setTimeout(CopyBuffer, _copyAt - Date.now());
        return;
    }

    if (_textBuffer.length > 0){
        ___CopyText(_textBuffer, 1);
        _textBuffer = "";
    }
    copyTimeout = null;
};

var _hookedContents = [];
var _previousContentsArr = [];
var _appendTimer = 0;
var _history = [];
var _historyIdx = 0;
var _historyCursor = 0;
var _maxHistory = 100;

var spamCounts = {};
var spamWords = {};
var spamSize = 0;

___CopyText = function(text, hookidx){

    if (!IsHookActive(hookidx)) return;
    var text = Filter(text);
    if (!text) return;
    
    if (_hookedContents.indexOf(text) != -1) return;

    var t = Date.now();

    if (spamWords.hasOwnProperty(text)) {

        if (spamWords[text] < t) {
            spamWords[text] = t + 1000; // Been a while, accept
            spamCounts[text] = 1;
        }
        else { // Seen recently
            spamWords[text] = t + 1000;
            spamCounts[text] += 1;
            if (spamCounts[text] > 2){
                return;
            }
        }
    }
    else { // New line
        spamCounts[text] = 1;
        spamWords[text] = t + 1000;
        spamSize += 1;
    }

    if (spamSize > 1000){
        spamWords = {};
        spamCounts = {};
        spamSize = 0;
    }

    _hookedContents[_hookedContents.length] = text;

    if (t < _appendTimer){
        for (var i = _hookedContents.length; i > -1; i--){
            if (indexOf(_previousContentsArr, _hookedContents[i]) != -1){
                spliceOne(_hookedContents, i);
            }
        }

        if (_hookedContents.length == 0) {
            return;
        }

        _previousContentsArr = _previousContentsArr.concat(_hookedContents);
    }
    else {

        _history[_historyIdx] = CopyArray(_previousContentsArr);
        
        _historyIdx = (_historyIdx + 1) % _maxHistory;
        _historyCursor = _historyIdx;
        
        _previousContentsArr = _hookedContents;
    }

    var result = CopyArray(_previousContentsArr);

    _appendTimer = t + 180 / fpsmult;

    Format(result);
    var str = result.join('');

    str = FixPatterns(str);

    clipboard.set(str, 'text');

    _hookedContents = [];        
};

var ContentsMatch = function(arr, arr2){
    if (arr.length != arr2.length) return false;
    for (var i = 0; i < arr.length; i++){
        if (arr[i] != arr2[i]) return false;
    }
    return true;
};

var Format = function(result) {
//    if (result.length > 1 && result[0].length > 10) result[0] += "\n";
//
//    for (var i = 1; i < result.length; i++) {
//        
//        if (i != result.length - 1 && result[i].length > 10)
//            result[i] += "\n";
//
//        if (result[i - 1].length <= 10 && result[i].length <= 10) {
//            result[i] = " | " + result[i];
//        }
//    }
};

var stringLength = function(arr){
    var cnt = 0;
    for (var i = 0; i < arr.length; i++) { cnt += arr[i].length; }
    return cnt;
};

var spliceOne = function(arr, index) {
    var len = arr.length;
    if (!len) { return; }
    while (index < len) { arr[index] = arr[index + 1]; index++ }
    arr.length--;
};

var indexOf = function(arr, item) {
    for (var i=0, len=arr.length; i!=len ; i++) {
         if (arr[i] === item) { return i }
    }
    return -1;
};

var Filter = function(text){
    if (!text) return null;
    if (typeof text !== 'string') return null;
    var match = text.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff60-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g);
    if (match == null) return null;
    match = match.join('').trim();
    if (match.length > 0) {
        for (var i = 0; i < customRegex.length; i++) {
            if (customRegex[i].enabled)
                text = text.replace(customRegex[i].reg, '');
        }
        return text;
    }
    return null;
};

var HistoryScroll = function(i) {
    _historyCursor += i;
    if (_historyCursor < 0) _historyCursor = _history.length;
    if (_historyCursor > _history.length) _historyCursor = 0;

    if (_historyCursor >= _history.length) var str = CopyArray(_previousContentsArr);
    else var str = CopyArray(_history[_historyCursor]);
    Format(str);
    
    DebugTitle("Text log: -" + HistoryDist().toString());
    clipboard.set(str.join(''), 'text');
};

var CopyArrayOfArrays = function(arr){
    var ret = new Array(arr.length);
    for (var i = 0; i < arr.length; i++){
        ret[i] = CopyArray(arr[i]);
    }
    return ret;
};
var CopyArray = function(arr){
    var ret = new Array(arr.length);
    for (var i = 0; i < arr.length; i++){
        ret[i] = arr[i];
    }
    return ret;
};

var HistoryDist = function(){
    if (_historyCursor > _historyIdx) return _historyIdx + (_maxHistory - _historyCursor);
    else return _historyIdx - _historyCursor;
};


var showTill = 0;
_____originalTitle = undefined;
var _waiting = false;
var DebugTitle = function(msg){
    if (_____originalTitle === undefined) _____originalTitle = document.title;

    showTill = Date.now() + 2000;
    document.title = msg.toString();

    if (_waiting) return;

    _waiting = true;
    RestoreTitle();
};

var RestoreTitle = function() {
    if (Date.now() < showTill) {
        setTimeout(RestoreTitle, 1000);
        return;
    }
    document.title = _____originalTitle;
    _waiting = false;
};


var Quickwin = function(){
    if ($gameParty.inBattle()){

        if (!_settings.RewardedSkip){
            BattleManager.processAbort();
            return;
        }
        else {
            $gameMessage.clear();
            if (BattleManager._phase != 'battleEnd'){
    
                var a = $gameTroop._enemies;
                for (var i = 0; i < a.length; i++){
                    if (a[i]) a[i].setHp(0);
                }
    
                BattleManager.updateTurn();
                SceneManager._scene.endCommandSelection();
                SceneManager._scene.updateBattleProcess();
                BattleManager.update();
    
                for (var i = 0; i < 60; i++){ SceneManager.updateScene(); }
    
                BattleManager.update();
                SceneManager._scene.endCommandSelection();
                SceneManager._scene.updateBattleProcess();
            }
        }
    }
};

var turboActive = false;
var ReadIntervals = function() {
    if (touchOrigWait == -1) touchOrigWait = TouchInput.keyRepeatWait;
    if (touchOrigInterval == -1) touchOrigInterval = TouchInput.keyRepeatInterval;
    if (origWait == -1) origWait = Input.keyRepeatWait;
    if (origInterval == -1) origInterval = Input.keyRepeatInterval;
};

var SetIntervalMult = function(mult){
    TouchInput.keyRepeatWait = touchOrigWait * mult;
    TouchInput.keyRepeatInterval = touchOrigInterval * mult;
    Input.keyRepeatWait = origWait * mult;
    Input.keyRepeatInterval = origInterval * mult;
};

//var SetIntervalMult = function(mult){
//    TouchInput.keyRepeatWait = touchOrigWait * mult * 0.6;
//    TouchInput.keyRepeatInterval = touchOrigInterval * mult * 0.5;
//    Input.keyRepeatWait = origWait * mult * 0.6;
//    Input.keyRepeatInterval = origInterval * mult * 0.5;
//};

var turboButton = null; 
var ____originalTriggered = Input.isTriggered;
var ____originalPressed = Input.isPressed;
var ____originalRepeated = Input.isRepeated;
var CustomTriggered = function(keyName){
    if (keyName === 'ok' && turboButton === keyName) return true;
    return ____originalTriggered.call(Input, keyName);
};
var CustomPressed = function(keyName){
    if (keyName === 'ok' && turboButton === keyName) return true;
    return ____originalPressed.call(Input, keyName);
};
var CustomRepeated = function(keyName){
    if (keyName === 'ok' && turboButton === keyName) return true;
    return ____originalRepeated.call(Input, keyName);
};

/////////////
// Speedup //
/////////////

var fpsmult = 1;

window.addEventListener("keyup", function(event) {
    if (!turboActive || Input.keyMapper[event.keyCode] === turboButton) turboButton = null;
});

window.addEventListener("keydown", function(event) {

    if (event.keyCode === 90 && turboActive) turboButton = Input.keyMapper[event.keyCode];
    //if (!event.altKey && turboButton === null && turboActive) turboButton = Input.keyMapper[event.keyCode];

    // Keys
    if (event.keyCode == 119) { require('nw.gui').Window.get().showDevTools(); return; }

    if (event.keyCode == 9) { Quickwin(); return; }

    if (event.keyCode == 35) { HistoryScroll(1); return; }
    if (event.keyCode == 36) { HistoryScroll(-1); return; }

    if (event.keyCode == 123){
        if (DataManager.isAnySavefileExists()) SceneManager.push(Scene_Load);
        else {
            DebugTitle("No save files exist!");
            SoundManager.playBuzzer();
        }
        return;
    }

    if (event.altKey && event.keyCode == 81){
        turboActive = !turboActive;
        if (turboActive) {
            Input.isTriggered = CustomTriggered;
            Input.isPressed = CustomPressed;
            Input.isRepeated = CustomRepeated;
        }
        else {
            Input.isTriggered = ____originalTriggered;
            Input.isPressed = ____originalPressed;
            Input.isRepeated = ____originalRepeated;
        }
        DebugTitle("Button Z turbo: " + turboActive.toString());
        return;
    }

    // Numbers
    if (event.keyCode < 49 || event.keyCode > 57) return;

    var key = event.keyCode - 48;

    if (event.altKey && event.ctrlKey) {
        if (key < 1 || key > customRegex.length) return;
        customRegex[key - 1].enabled = !customRegex[key - 1].enabled;
        var str = "Custom regex filter: \"" + customRegex[key - 1].text + "\" (" + customRegex[key - 1].enabled + ")";
        DebugTitle(str);
        return;
    }

    if (event.altKey){

        if (key < 1 || key > 6) return;

        switch (key){
            case 1:
                _settings.BitmapHook = !_settings.BitmapHook;
                if (_settings.BitmapHook) Bitmap.prototype.drawText = BitmapOverrideDraw;
                else Bitmap.prototype.drawText = _originalDrawText;
                break;
            case 2:
                _settings.DrawtextHook = !_settings.DrawtextHook; break;
            case 3:
                _settings.EscapecharHook = !_settings.EscapecharHook; break;
            case 4:
                _settings.InstantText = !_settings.InstantText;
                if (_settings.InstantText) Window_Message.prototype.clearFlags = InstantTextDrawFunct;
                else Window_Message.prototype.clearFlags = _originalInstantDrawFunct;
                break;
            case 5:
                _settings.RewardedSkip = !_settings.RewardedSkip; break;
            case 6:
                if ($gameParty.gold() > 499999999) break;
                if ($gameParty.gold() > 1) $gameParty.gainGold($gameParty.gold());
                else $gameParty.gainGold(1);
                DebugTitle("Current gold " + ($gameParty.gold()).toString());
                return;
            default: return;
        }

        var str = "Hooks: " + _settings.BitmapHook + " " + _settings.DrawtextHook + " " + _settings.EscapecharHook;
        str += " | Instant text: " + _settings.InstantText;
        str += " | Skip cheat: " + _settings.RewardedSkip;
        DebugTitle(str);

        return;
    }

    SetSpeed(key, event);
});

var SetSpeed = function(key, event){

    fpsmult = key;
    
    ReadIntervals();
    SetIntervalMult(fpsmult);

    if (key == 1){
        DebugTitle("Speed x" + key);
        SceneManager.requestUpdate = rAF;
        SceneManager.update = __originalUpdate;
        SceneManager.updateMain = __originalUpdateMain;
    }
    else if (event.shiftKey) {
        DebugTitle("Alternative Speed x" + key);
        SceneManager.requestUpdate = sTO2;
        SceneManager.update = OverrideUpdate2;
        SceneManager.updateMain = OverrideUpdateMain2;
    }
    else {
        DebugTitle("Speed x" + key);
        SceneManager.requestUpdate = sTO;
        SceneManager.update = OverrideUpdate;
        SceneManager.updateMain = OverrideUpdateMain;
    }
};

var touchOrigWait = -1;
var touchOrigInterval = -1;
var origWait = -1;
var origInterval = -1;

var __originalUpdate = SceneManager.update;
var __originalUpdateMain = SceneManager.updateMain;

var rAF = function() {
    if (!this._stopped) {
        requestAnimationFrame(this.update.bind(this));
    }
}

var sTO = function() {
    if (!this._stopped) {
        setTimeout(this.update.bind(this));
    }
}

var sTO2 = function() {
    if (!this._stopped) {
        requestAnimationFrame(this.update.bind(this));
    }
}

var OverrideUpdateMain = function() {
    var newTime = performance.now();
    if (typeof this._currentTime === 'undefined') { this._currentTime = performance.now(); }
    if (typeof this._accumulator === 'undefined') { this._accumulator = 0.0; }
    var fTime = (newTime - this._currentTime) / 1000;
    if (fTime > 0.04) fTime = 0.04;
    this._currentTime = newTime;
    this._accumulator += fTime;
    var accum = 1.0 / (60.0 * fpsmult);
    while (this._accumulator >= accum) {
        Input.update();
        TouchInput.update();
        this.changeScene();
        this.updateScene();
        this._accumulator -= accum;
    }
    this.renderScene();
    this.requestUpdate();
};

var OverrideUpdate = function() {
    try {
        this.tickStart();
        this.updateMain();
        this.tickEnd();
    } catch (e) {
        this.catchException(e);
    }
};

// Alternative functions, use these instead of the above ones if having issues
var OverrideUpdateMain2 = function() {
    for (var i = 0; i < fpsmult; i++){
        Input.update();
        TouchInput.update();
        this.changeScene();
        this.updateScene();
    }
    this.renderScene();
    this.requestUpdate();
};

var OverrideUpdate2 = function() {
    try {
        this.tickStart();
        this.updateMain();
        this.tickEnd();
    } catch (e) {
        this.catchException(e);
    }
};

///////////////////
// Pattern fixer //
///////////////////

var FixPatterns = function(text){
    var a = text;
    while (true){
        var b = SlicePatterns(a);
        if (b) a = b;
        else break;
    }
    return a;
};

var SlicePatterns = function(text){
    
    var mid = Math.floor(text.length / 2);
    var lim = Math.floor(text.length * 0.3);
    var i = text.length - lim;
    var found = -1;
    
    while (i >= mid && mid > 2){
        
        found = SearchPattern(text, i, lim);
        
        if (found != -1){
            var ret = DetermineSize(text, found, i, lim);

            if (ret.j - ret.i >= lim){
                text = text.slice(0, ret.i) + text.slice(ret.j, text.length);
                return text;
            }
        }
        i -= 1;
    }
    return null;
};

var DetermineSize = function(text, foundI, pIdx, pLen){
    var ret = { i : pIdx, j : pIdx + pLen };

    var mid = Math.floor(text.length / 2);

    var i = pIdx, j = foundI;
    while (i > mid - 2 && j > -1) {
        if (text[i] == text[j]) { ret.i = i; }
        else break;
        i--; j--;
    }

    i = pIdx + pLen;
    j = foundI + pLen;
    while (i < text.length && j < mid) {
        if (text[i] == text[j]) ret.j = i;
        if (text[i] != text[j]) { ret.j = i; break; }
        i++; j++;
    }

    return ret;
};

var SearchPattern = function(text, pIdx, pLen){

    for (var i = 0; i < pIdx - pLen; i++){
        var found = true;

        for (var j = i; j < i + pLen; j++){
            if (text[j] != text[pIdx + j - i]){
                found = false;
                break;
            }
        }
        
        if (found) return i;
    }
    
    return -1;
};


})();
