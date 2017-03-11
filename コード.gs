// 定数
// ==========================================================================================
var SPREAD_ID = "1NtBNa5bcD_dpXpnBKKrHhwiRK8G0NTSVTfWukLATEdA";
var IDX_ID   = 0;
var IDX_TIME = 1;
var IDX_NAME = 2;
var IDX_MSG  = 3;

var TIMEOUT_TIME = 4 * 60 * 1000;  // 読み込みタイムアウト：4分 * 60秒 * 1000ミリ秒
var FAST_SCAN_TIME = 30 * 1000;  // 負荷軽減のため最初のn秒以降は読み込み間隔を長くする：30秒 * 1000ミリ秒
var MESSAGE_FORMAT = "<p id='{id}'>{time} {name}：{msg}</p>\n";

// コード
// ==========================================================================================

// HTTPアクセス
// ------------------------------------------------------------------------------------------
function doGet() {
  var template = HtmlService.createTemplateFromFile("chat");
  return template.evaluate();
}

// 書込み
// ------------------------------------------------------------------------------------------
function writeChat(id, time, name, msg) {
  var sheet = getMainSheet();
  sheet.appendRow([id, time, name, msg]);
}

// 読み込み
// ------------------------------------------------------------------------------------------
function fetchNewMessage(lastId) {
  var sheet = getMainSheet();
  var datas = sheet.getDataRange().getValues();

  // lastId指定の場合、lastId以降の内容のみ取得
  if (lastId != "") {
    var tsLimitTiemout = (new Date()).getTime() + TIMEOUT_TIME;
    var tsLimitFastScan = (new Date()).getTime() + FAST_SCAN_TIME;
    
    // lastId以降の内容が発生するまでループ待機(Comet)
    while (true) {
      datas = datas.filter(function(data) { return String(data[IDX_ID]) > String(lastId); });
      if (datas.length > 0) { break; }
      if ((new Date()).getTime() > tsLimitTiemout) { break; }
      Utilities.sleep((new Date()).getTime() > tsLimitFastScan ? 10000 : 1000);
      SpreadsheetApp.flush(); // これが無いと、更新した内容が取得できない
      datas = sheet.getDataRange().getValues();
    }
  }
  
  // 読み込みメッセージ生成
  var result = "";
  datas.forEach(function(data) {
    var dataElement = MESSAGE_FORMAT
      .replace("{id}"  , data[IDX_ID])
      .replace("{time}", data[IDX_TIME])
      .replace("{name}", escape_html(data[IDX_NAME]))
      .replace("{msg}" , escape_html(data[IDX_MSG]));
    
    result += dataElement;
  });
  return result;
}

// シートをメモ化して取得
// ------------------------------------------------------------------------------------------
function getMainSheet() {
  if (!getMainSheet.memoSheet) {
    var ss = SpreadsheetApp.openById(SPREAD_ID);
    var sheet = ss.getSheets()[0];
    getMainSheet.memoSheet = sheet;
  }
  return getMainSheet.memoSheet;
}

// HTMLエスケープ(scriptインジェクション対策)
// ------------------------------------------------------------------------------------------
function escape_html (string) {
  if(typeof string !== 'string') {
    return string;
  }
  return string.replace(/[&'`"<>]/g, function(match) {
    return {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;',
    }[match]
  });
}
