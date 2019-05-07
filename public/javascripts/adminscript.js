$(document).ready(function () {

var socket = io();
socket.on('props', function (data) {
 $('.p').html(data.PROPS);
});
socket.on('msg', function (data) {
  $('.m').html(data.msg);
 });
 socket.on('notify', function (data) {
   if (data.msg > 0 || data.props > 0 || data.oos > 0) {
     $('.newnotify .text-wrap').html('<span class="small badge badge-danger"> new </span>');
   }else{
     $('.newnotify .text-wrap').html('');
   }
 })
 socket.on('outofstock', function (data) {
  $('.oos').html(data.msg);
 });
setInterval(function() {
$("#MyOrder").load(location.href+" #MyOrder>*","");
},5000)

})

function Delivered(id) {
  var data ={id:id}
  $.ajax({
      type        : 'post',
      data        : data,
      dataType    : 'json',
      url         : '/areacode97/admin/outofbound/admin/orders',
      success     : function(data){
        if(data.status == 1){
          alert('Order confirmed successfully');
          $(".printout").load(location.href+" .printout>*","");
        }
      }
      })
}
