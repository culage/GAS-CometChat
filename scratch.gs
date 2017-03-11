// てすと
// ==========================================================================================
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