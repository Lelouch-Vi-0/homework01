// Replace with your Google Sheets ID (從網址取得)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'

function doGet(e){
  return ContentService.createTextOutput(JSON.stringify({success:true, message:'GAS endpoint ready'})).setMimeType(ContentService.MimeType.JSON)
}

function doPost(e){
  try{
    var body = e.postData.contents
    var data = JSON.parse(body)
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID)
    var sheet = ss.getSheetByName('Sheet1') || ss.getSheets()[0]
    sheet.appendRow([new Date(), data.user||'', data.atomicNumber||'', data.symbol||'', data.name||'', data.timestamp||''])
    return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON)
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({success:false,error:err.toString()})).setMimeType(ContentService.MimeType.JSON)
  }
}
