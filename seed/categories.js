var ItemCategory = require('../models/item_category');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/boticstechnologiesdb', { useNewUrlParser: true }, (err, res) => {
if (err) throw err;
console.log('Database online');
});
var item_category = [
  new ItemCategory({
    item_category:'Arduino',
  }),
  new ItemCategory({
    item_category:'Raspberry pi',
  }),
  new ItemCategory({
    item_category:'Kits',
  }),
  new ItemCategory({
    item_category:'Analog Sensors',
  }),
  new ItemCategory({
    item_category:'Digital Sensors',
  }),

  new ItemCategory({
    item_category:'Servos',
  }),
  new ItemCategory({
    item_category:'Cellulars',
  }),
  new ItemCategory({
    item_category:'Integrated circuits',
  }),
  new ItemCategory({
    item_category:'Batteries',
  }),
  new ItemCategory({
    item_category:'Cables',
  }),
  new ItemCategory({
    item_category:'Displays',
  }),
  new ItemCategory({
    item_category:'Wireless modules',
  }),
  new ItemCategory({
    item_category:'Breakout boards',
  }),
  new ItemCategory({
    item_category:'PCB enclosures and Cases',
  }),
  new ItemCategory({
    item_category:'Power Supply',
  })
];

var done=0;

for(var i=0;i<item_category.length;i++){
   item_category[i].save(function (err,result) {
     done++;
     if(done === ItemCategory.lenth){
       exit();
     }
   });
}

function exit() {
  console.log('data saved successfully!');
mongoose.disconnect();
}
