// const moment = require('moment');
//
//
// var mydate = new Date();
// // moment(mydate).fromNow();
//
// // console.log(moment('2019-03-24T09:26:05.454Z').fromNow());
//
// console.log(mydate);
// console.log(moment(mydate, "MM-DD-YYYY").fromNow());

var excel = require('excel4node');
const randomstring= require('randomstring');

// Create a new instance of a Workbook class
var workbook = new excel.Workbook();

// Add Worksheets to the workbook
var worksheet = workbook.addWorksheet('200,000');
// var worksheet2 = workbook.addWorksheet('500,000');

// Create a reusable style
var style = workbook.createStyle({
  font: {
    // color: '#FF0800',
    size: 16,
  },
  numberFormat: '$#,##0.00; ($#,##0.00); -'
});

worksheet.cell(1,2).string("Ticket Unique Pin").style(style);
worksheet.cell(1,3).string("Ticket Message").style(style);

// worksheet2.cell(1,2).string("Ticket Unique Pin").style(style);
// worksheet2.cell(1,3).string("Ticket Message").style(style);


TicketMsgOne(5);
// TicketMsgTwo(500000);

function TicketMsgOne(Gen_pin_numbers) {

  for (var i = 2; i <= Gen_pin_numbers+1; i++) {
    var GenNumber = randomstring.generate(6);
    worksheet.cell(i,1).number(i);
    worksheet.cell(i,2).string("BTC "+GenNumber+" BTC");
    worksheet.cell(i,3).string("MTN MUSIC FESTIVAL \n E Ticket number: BTC "+GenNumber+" BTC \n Expires on: 2019-05-08 23:59 \n Venue: AICC \n VIP25821494 \n Validate your ticket at the entrance \n Powered By Botics Technologies");
    // console.log(i +" "+ GenRandomRef());
  }
}

// function TicketMsgTwo(Gen_pin_numbers) {
//
//   for (var i = 2; i <= Gen_pin_numbers+1; i++) {
//     var GenNumber = randomstring.generate(6);
//     worksheet2.cell(i,1).number(i);
//     worksheet2.cell(i,2).string("BTC "+GenNumber+" BTC");
//     worksheet2.cell(i,3).string("MTN MUSIC FESTIVAL \n E Ticket number: BTC "+GenNumber+" BTC \n Expires on: 2019-05-08 23:59 \n Venue: AICC \n VIP25821494 \n Validate your ticket at the entrance \n Powered By Botics Technologies");
//     // console.log(i +" "+ GenRandomRef());
//   }
// }

// function GenRandomRef() {
// var text = '';
// var posible = '01234567890123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' ;
//  for (var i = 0; i < 6; i++) {
//   text += posible.charAt(Math.floor(Math.random()* posible.length));
//  }
//  return text;
// }



workbook.write('boticsScanner.xlsx');
