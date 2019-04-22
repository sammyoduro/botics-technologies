$(document).ready(function () {

var socket = io();
socket.on('props', function (data) {
 $('.p').html(data.PROPS);
});
socket.on('msg', function (data) {
  $('.m').html(data.msg);
 });
 socket.on('notify', function (data) {
   if (data.msg > 0 || data.props > 0) {
     $('.newnotify .text-wrap').html('<span class="small badge badge-danger"> new </span>');
   }else{
     $('.newnotify .text-wrap').html('');
   }
 })

setInterval(function() {
// $("#MyOrder").load(location.href+" #MyOrder>*","");
},5000)

})
