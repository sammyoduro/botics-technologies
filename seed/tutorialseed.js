var Tutorial = require('../models/tutorials');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/boticstechnologiesdb', { useNewUrlParser: true }, (err, res) => {
if (err) throw err;
console.log('Database online');
});
var tutorial = [
  new Tutorial({
    short_desc:'learn how to light an led',
    overview:' This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through ',
    instructions:'This is instruction and its worth to love internet of things, join me as i take you through ',
    materials:'',
    videoImg_url:'http://i3.ytimg.com/vi/kZfvXJ-5v8A/hqdefault.jpg',
    video_url:'https://www.youtube.com/embed/kZfvXJ-5v8A',
    timestamp:'08/11/2018 17:02:48'
  }),
  new Tutorial({
    short_desc:'photo diode ',
    overview:' This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through ',
    instructions:'This is instruction and its worth to love internet of things, join me as i take you through ',
    materials:'',
    videoImg_url:'http://i3.ytimg.com/vi/kZfvXJ-5v8A/hqdefault.jpg',
    video_url:'https://www.youtube.com/embed/kZfvXJ-5v8A',
    timestamp:'08/11/2018 17:02:48'
  }),
  new Tutorial({
    short_desc:'streetlight automation',
    overview:' This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through ',
    instructions:'This is instruction and its worth to love internet of things, join me as i take you through ',
    materials:'',
    videoImg_url:'http://i3.ytimg.com/vi/kZfvXJ-5v8A/hqdefault.jpg',
    video_url:'https://www.youtube.com/embed/kZfvXJ-5v8A',
    timestamp:'08/11/2018 17:02:48'
  }),
  new Tutorial({
    short_desc:'traffic light',
    overview:' This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through ',
    instructions:'This is instruction and its worth to love internet of things, join me as i take you through ',
    materials:'',
    videoImg_url:'http://i3.ytimg.com/vi/kZfvXJ-5v8A/hqdefault.jpg',
    video_url:'https://www.youtube.com/embed/kZfvXJ-5v8A',
    timestamp:'08/11/2018 17:02:48'
  }),
  new Tutorial({
    short_desc:'smart energy meter',
    overview:' This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through ',
    instructions:'This is instruction and its worth to love internet of things, join me as i take you through ',
    materials:'',
    videoImg_url:'http://i3.ytimg.com/vi/kZfvXJ-5v8A/hqdefault.jpg',
    video_url:'https://www.youtube.com/embed/kZfvXJ-5v8A',
    timestamp:'08/11/2018 17:02:48'
  }),
  new Tutorial({
    short_desc:'smart home',
    overview:' This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through ',
    instructions:'This is instruction and its worth to love internet of things, join me as i take you through ',
    materials:'',
    videoImg_url:'http://i3.ytimg.com/vi/kZfvXJ-5v8A/hqdefault.jpg',
    video_url:'https://www.youtube.com/embed/kZfvXJ-5v8A',
    timestamp:'08/11/2018 17:02:48'
  }),
  new Tutorial({
    short_desc:'robotic car',
    overview:' This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through ',
    instructions:'This is instruction and its worth to love internet of things, join me as i take you through ',
    materials:'',
    videoImg_url:'http://i3.ytimg.com/vi/kZfvXJ-5v8A/hqdefault.jpg',
    video_url:'https://www.youtube.com/embed/kZfvXJ-5v8A',
    timestamp:'08/11/2018 17:02:48'
  }),
  new Tutorial({
    short_desc:'google ',
    overview:' This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through ',
    instructions:'This is instruction and its worth to love internet of things, join me as i take you through ',
    materials:'',
    videoImg_url:'http://i3.ytimg.com/vi/kZfvXJ-5v8A/hqdefault.jpg',
    video_url:'https://www.youtube.com/embed/kZfvXJ-5v8A',
    timestamp:'08/11/2018 17:02:48'
  }),
  new Tutorial({
    short_desc:'amazon alexis',
    overview:' This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through ',
    instructions:'This is instruction and its worth to love internet of things, join me as i take you through ',
    materials:'',
    videoImg_url:'http://i3.ytimg.com/vi/kZfvXJ-5v8A/hqdefault.jpg',
    video_url:'https://www.youtube.com/embed/kZfvXJ-5v8A',
    timestamp:'08/11/2018 17:02:48'
  }),
  new Tutorial({
    short_desc:'arduino setup',
    overview:' This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through ',
    instructions:'This is instruction and its worth to love internet of things, join me as i take you through ',
    materials:'',
    videoImg_url:'http://i3.ytimg.com/vi/kZfvXJ-5v8A/hqdefault.jpg',
    video_url:'https://www.youtube.com/embed/kZfvXJ-5v8A',
    timestamp:'08/11/2018 17:02:48'
  }),
  new Tutorial({
    short_desc:'introduction to Raspberrypi ',
    overview:' This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through  This is an overview and its worth to love internet of things, join me as i take you through ',
    instructions:'This is instruction and its worth to love internet of things, join me as i take you through ',
    materials:'',
    videoImg_url:'http://i3.ytimg.com/vi/kZfvXJ-5v8A/hqdefault.jpg',
    video_url:'https://www.youtube.com/embed/kZfvXJ-5v8A',
    timestamp:'08/11/2018 17:02:48'
  })

];

var done=0;

for(var i=0;i<tutorial.length;i++){
   tutorial[i].save(function (err,result) {
     done++;
     if(done === Tutorial.lenth){
       console.log('done');
       exit();
     }
   });
}

function exit() {
  console.log('data saved successfully!');
mongoose.disconnect();
}
