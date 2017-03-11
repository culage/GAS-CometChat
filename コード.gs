var SPREAD_ID = "1NtBNa5bcD_dpXpnBKKrHhwiRK8G0NTSVTfWukLATEdA";
var IDX_ID   = 0;
var IDX_TIME = 1;
var IDX_NAME = 2;
var IDX_MSG  = 3;

var TIMEOUT_TIME = 4 * 60 * 1000;  // 読み込みタイムアウト：4分 * 60秒 * 1000ミリ秒
var FAST_SCAN_TIME = 30 * 1000;  // 最初のn秒以降は読み込み間隔を長くする：30秒 * 1000ミリ秒
var MESSAGE_FORMAT = "<p id='{id}'>{time} {name}：{msg}</p>\n";

function doGet() {
  return HtmlService.createHtmlOutputFromFile("chat");
}

//★てすと
function test() {
  var ss = SpreadsheetApp.openById(SPREAD_ID);
  var sheet = ss.getSheets()[0];
  var datas = sheet.getRange("A24").getValue();
Logger.log(datas);

  Utilities.sleep(10000);
//SpreadsheetApp.flush();  
  
  var ss = SpreadsheetApp.openById(SPREAD_ID);
  var sheet = ss.getSheets()[0];
  var datas = sheet.getRange("A24").getValue();
Logger.log(datas);
return;
  
  var blob = Utilities.newBlob("", "text/plain", "test.text").setDataFromString("かきく", "utf-8")
  Drive.Files.update
  
  // 
  var folder = DriveApp.getFolderById("0BynJ-hFeEG0NQ2dJZFM1OFBsOTg");
  var file = folder.getFilesByName("test.txt").next();
  var str = file.getBlob().getDataAsString("utf-8");
  Logger.log(str);
  return;

  // https://intheweb.io/write-out-with-gas/amp/
  var blob = Utilities.newBlob("", "text/plain", "test.text").setDataFromString("あいうえお", "utf-8")
  var file = DriveApp.createFile(blob);
  var folder = DriveApp.getFolderById("0BynJ-hFeEG0NQ2dJZFM1OFBsOTg");
  folder.addFile(file);
  return;

  
  var ss = SpreadsheetApp.openById(SPREAD_ID);
  var sheet = ss.getSheets()[0];
  var datas = sheet.getRange("A24").getValue();
Logger.log(datas);

  Utilities.sleep(10000);
SpreadsheetApp.flush();  
  
  var ss = SpreadsheetApp.openById(SPREAD_ID);
  var sheet = ss.getSheets()[0];
  var datas = sheet.getRange("A24").getValue();
Logger.log(datas);

  return;
  var now = new Date();
  var formatedNow = Utilities.formatDate(now, "Asia/Tokyo", "[HH:mm:ss]");
  Logger.log(formatedNow);
}

// 書込み
function writeChat(name, msg) {
  var sheet = getMainSheet();

  var now = new Date();
  var formatedNow = Utilities.formatDate(now, "Asia/Tokyo", "[HH:mm:ss]");
  var id = getTimeId(now);

  name = name || "ななしさん";
  
  sheet.appendRow([id, formatedNow, name, msg]);
}

// 読み込み
function fetchNewMessage(lastId) {
  var sheet = getMainSheet();
  var datas = sheet.getDataRange().getValues();

  if (lastId != "") {
    var tsLimitTiemout = (new Date()).getTime() + TIMEOUT_TIME;
    var tsLimitFastScan = (new Date()).getTime() + FAST_SCAN_TIME;
    while (true) {
      datas = datas.filter(function(data) { return String(data[IDX_ID]) > String(lastId); });
      if (datas.length > 0) { break; }
      if ((new Date()).getTime() > tsLimitTiemout) { break; }
      Utilities.sleep((new Date()).getTime() > tsLimitFastScan ? 10000 : 1000);
      SpreadsheetApp.flush(); // これが無いと、更新した内容が取得できない
      datas = sheet.getDataRange().getValues();
    }
  }
  
  var result = "";
  datas.forEach(function(data) {
    var dataElement = MESAGE_FORMAT
      .replace("{id}"  , data[IDX_ID])
      .replace("{time}", data[IDX_TIME])
      .replace("{name}", escape_html(data[IDX_NAME]))
      .replace("{msg}" , escape_html(data[IDX_MSG]));
    
    result += dataElement;
  });
  return result;
}

function getMainSheet() {
  if (!getMainSheet.memoSheet) {
    var ss = SpreadsheetApp.openById(SPREAD_ID);
    var sheet = ss.getSheets()[0];
    getMainSheet.memoSheet = sheet;
  }
  return getMainSheet.memoSheet;
}

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

function getTimeId(dateTime) {
  var id = "";
  id += Utilities.formatDate(dateTime, 'Asia/Tokyo', 'yyyyMMddHHmmss');
  id += ("000" + String(dateTime.getMilliseconds())).slice(-3);
  return id;
}
