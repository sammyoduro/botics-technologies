
$(document).ready(function() {

addToCart();
shopping_Cart_Detail();
shopping_Cart();
// checkout();

  $(document).on('click', '.dropdown-menu', function (e) {
    e.stopPropagation();
  });

    ///////////////// fixed menu on scroll for desctop
  if ($(window).width() > 768) {

      $(window).scroll(function(){
          if ($(this).scrollTop() > 125) {
               $('.navbar-landing').addClass("fixed-top");
          }else{
              $('.navbar-landing').removeClass("fixed-top");
          }
      });
  } // end if

  //////////////////////// Fancybox. /plugins/fancybox/
  if($("[data-fancybox]").length>0) {  // check if element exists
    $("[data-fancybox]").fancybox();
  } // end if

  //////////////////////// Bootstrap tooltip
  if($('[data-toggle="tooltip"]').length>0) {  // check if element exists
    $('[data-toggle="tooltip"]').tooltip()
  } // end if

    /////////////////////// Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a.page-scroll').click(function() {
        $('.navbar-toggler:visible').click();
    });

    //////////////////////// Menu scroll to section for landing
    $('a.page-scroll').click(function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({ scrollTop: $($anchor.attr('href')).offset().top - 50  }, 1000);
        event.preventDefault();
    });

    /////////////////  items slider. /plugins/slickslider/
    if ($('.slick-slider').length > 0) { // check if element exists
        $('.slick-slider').slick();
    } // end if

  /////////////////  items carousel. /plugins/owlcarousel/
    if ($('.owl-init').length > 0) { // check if element exists

       $(".owl-init").each(function(){

            var myOwl = $(this);
            var data_items = myOwl.data('items');
            var data_nav = myOwl.data('nav');
            var data_dots = myOwl.data('dots');
            var data_margin = myOwl.data('margin');
            var data_custom_nav = myOwl.data('custom-nav');
            var id_owl = myOwl.attr('id');

            myOwl.owlCarousel({
                loop: true,
                margin: data_margin,
                nav: eval(data_nav),
                dots: eval(data_dots),
                autoplay: false,
                items: data_items,
                navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
                 //items: 4,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: data_items
                    },
                    1000: {
                        items: data_items
                    }
                }
            });

            // for custom navigation. See example page: example-sliders.html
            $('.'+data_custom_nav+'.owl-custom-next').click(function(){
                $('#'+id_owl).trigger('next.owl.carousel');
            });

            $('.'+data_custom_nav+'.owl-custom-prev').click(function(){
                $('#'+id_owl).trigger('prev.owl.carousel');
            });

        }); // each end.//
    } // end if

// CUSTOM search engine

let input$ = Rx.Observable
  .fromEvent(document.getElementById('searchbox'), 'keyup')
  .map(x => x.currentTarget.value)
  .debounceTime(1000);
input$.subscribe(x => searchTip(x));

  function searchTip(searchItem) {
    var SearchFilter = $("#SearchFilter").val();
    var data = {searchItem:searchItem,SearchFilter:SearchFilter};
    $.ajax({
       type        : 'post',
       data        : data,
       dataType    : 'json',
       url         : '/Search',
       success     : function(data){
          $('#searchbox').autocomplete({
            source: data,
            autoFocus: true
          })
       }
     });
  }


// SUBMIT PROPOSAL
$("form#data").submit(function(e) {
//   $('#submit_proposal').addClass('disabled');
$("#proposalsubmit").modal();

    e.preventDefault();
    var files = $('#proposal_file').get(0).files;
    var file ='';
    var formData = new FormData(this);
    $('#contactusername_err').text('');
    $('#contactusemail_err').text('');
    $('#contactusmsg_err').text('');

    for (var i=0; i < files.length; i++) {
        file = files[i];
    }


    formData.append('proposal_file[]',file);
    formData.append('myfile',file.name);

    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: formData,
        success: function (data) {
            document.getElementById('proposal_topic_errMsg').innerHTML=data.proposal_topic_errMsg;
            document.getElementById('fullname_errMsg').innerHTML=data.fullname_errMsg;
            document.getElementById('email_errMsg').innerHTML=data.email_errMsg;
            document.getElementById('phone_errMsg').innerHTML=data.phone_errMsg;
            document.getElementById('Description_errMsg').innerHTML=data.Description_errMsg;
            document.getElementById('file_errMsg').innerHTML=data.file_errMsg;


            if (data.proposal_topic_errMsg != ''|| data.fullname_errMsg != ''|| data.email_errMsg != ''|| data.phone_errMsg != ''|| data.Description_errMsg != ''|| data.file_errMsg != '') {
              setTimeout(function () {
                              $("#proposalsubmit").modal('hide');
                            },1000);
            }



            if (data.proposal_topic_errMsg == undefined) {
                document.getElementById('proposal_topic_errMsg').innerHTML='';
            }

            if (data.fullname_errMsg == undefined) {
                document.getElementById('fullname_errMsg').innerHTML='';
            }
            if (data.email_errMsg == undefined) {
                document.getElementById('email_errMsg').innerHTML='';
            }
            if (data.phone_errMsg == undefined) {
                document.getElementById('phone_errMsg').innerHTML='';
            }
            if (data.Description_errMsg == undefined) {
                document.getElementById('Description_errMsg').innerHTML='';
            }
            if (data.file_errMsg == undefined) {
                document.getElementById('file_errMsg').innerHTML='';
            }

            if (data.ck > 0 ) {

              $("#proposalsubmit").modal('hide');
              document.getElementById('proposal_topic_errMsg').innerHTML='';
              document.getElementById('proposal_topic').value="";
              document.getElementById('fullname').value="";
              document.getElementById('email').value="";
              document.getElementById('phone_num').value="";
              document.getElementById('descriptopn').value="";
              document.getElementById('proposal_file').value="";

              swal("Document code has been sent to ", data.messages, "success");
            }


        },
        cache: false,
        contentType: false,
        processData: false
    });
  });

  // submit propsal end
  //Contact us
	$('body').on('click','#contactusbtn',function () {

		  var contactusername= $('#contactususername').val();
		  var contactusemail = $('#contactusemail').val();
		  var contactusmsg   = $('#contactusmsg').val();
		  var check = true;

      document.getElementById('email_errMsg').innerHTML='';
      document.getElementById('fullname_errMsg').innerHTML='';
      document.getElementById('email_errMsg').innerHTML='';
      document.getElementById('phone_errMsg').innerHTML='';
      document.getElementById('Description_errMsg').innerHTML='';
      document.getElementById('file_errMsg').innerHTML='';

		var re =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		if(contactusername.length < 1){
		  $('#contactusername_err').text('username required');
		  check = false;
		}else{
		  $('#contactusername_err').text('');
		}

		if(contactusemail.length < 1){
		  $('#contactusemail_err').text('email required');
		  check = false;
		}else if(!(re.test(contactusemail))) {
		  $('#contactusemail_err').text('invalid');
		  check = false;
		}else{
		  $('#contactusemail_err').text('');
		}

		if(contactusmsg.length < 1){
		  $('#contactusmsg_err').text('message required');
		  check = false;
		}else{
		  $('#contactusmsg_err').text('');
		}
    if (check) {
  data = {username:contactusername,email:contactusemail,msg:contactusmsg}
  $.ajax({
      type        : 'post',
      data        : data,
      dataType    : 'json',
      url         : '/contactus',
      success     : function(data){
        if(data.status == 'sent'){
          swal("Message sent successfully!", "Our team will contact you shortly", "success");
        }
      }
      })
      $('#contactususername').val('');
      $('#contactusemail').val('');
      $('#contactusmsg').val('');
      }

	})



});


// ADD TO CART
function addToCart() {
  $(".addtocart").on("click",function($ev){
    var id = $(this).attr('id');
    $.ajax({
      type        : 'get',
      data        : id,
      dataType    : 'json',
      url         : '/pages/store-front/add-to-cart/'+id,
      success     : function(data){
        if(data.status==true){

    swal({
  title: "Item added!",
  text: "Continue shopping!",
  icon: "success",
  buttons: "OK!",
})
.then((willDelete) => {
  if (willDelete) {
    location.reload(true);
  }else{
    location.reload(true);
  }
});
        }
      }
    });
  });
}

// ITEM DETAIL
function shopping_Cart_Detail() {

   $(".dtbtn-minus").on("click",function($ev){
     var id = $(this).data('id');
     const inputRef = $('#' + $(this).data('id'));
     if (+inputRef.val() > 1) {
       inputRef.val(+inputRef.val() - 1);
   }
 });

 $(".dtbtn-plus").on("click",function($ev){

    var id = $(this).data('id');
    const inputRef = $('#' + $(this).data('id'));
    inputRef.val(+inputRef.val() + 1);

  });

  $('#buynow').on("click",function () {
    var input = $('.dtcartAlter').val();
    var id = $('.dtcartAlter').attr('id');
    input = Number(input);
    var data = {id: id,numOfItems:input};

    if (input===parseInt(input,10)) {
      if (input == 0) {

          swal("Error!", "please enter quantity", "error");
      }else{

        $.ajax({
            type        : 'post',
            data        : data,
            dataType    : 'json',
            url         : '/pages/store-front/product_detail/cartalter/',
            success     : function(data){
              if(data.status==true){
                $(".catb").load(location.href+" .catb>*","");


            swal({
              title: "Item added successfully!",
              text: "Hope you are enjoying your shopping!",
              icon: "success",
              buttons: ["Continue Shopping", "Go to Cart"],
              dangerMode: true,

            })
            .then((pass) => {
              if (pass) {
                window.location.href = "/pages/store-front/p/shopping-cart";
              } else {
                location.reload(true);
                return true;
              }
            });
              }
            }
          });
      }
    }else{
      swal("Error!", "invalid integer value", "warning");
    }

  });
}
// ON CHECKING OUT
function shopping_Cart() {

   $(".btn-minus").on("click",function($ev){

     var id = $(this).data('id');
     const inputRef = $('#' + $(this).data('id'));
     if (+inputRef.val() > 1) {
       inputRef.val(+inputRef.val() - 1);
       // make ajax call
       $.ajax({
         type        : 'get',
         data        : id,
         dataType    : 'json',
         url         : '/pages/store-front/reduce/'+id,
         success     : function(data){
           if(data.status==true){
             location.reload(true);
           }
         }
       });
     }

 });

 $(".btn-plus").on("click",function($ev){
    var id = $(this).data('id');
    const inputRef = $('#' + $(this).data('id'));
    inputRef.val(+inputRef.val() + 1);
    // make ajax call
    $.ajax({
      type        : 'get',
      data        : id,
      dataType    : 'json',
      url         : '/pages/store-front/increase/'+id,
      success     : function(data){
        if(data.status==true){
          location.reload(true);
        }
      }
    });
  });

  $(".del").on("click",function($ev){
    var id = $(this).attr('id');
    $.ajax({
      type        : 'get',
      data        : id,
      dataType    : 'json',
      url         : '/pages/store-front/remove/'+id,
      success     : function(data){
        if(data.status==true){
          location.reload(true);
        }
      }
    });
  });

  $(".cartAlter").keyup(function(e){
    if(e.keyCode==13){
      var inputVal = $(this).val();
      var id = $(this).attr('id');
      var data = {id: id,numOfItems:inputVal};

      $.ajax({
        type        : 'post',
        data        : data,
        dataType    : 'json',
        url         : '/pages/store-front/cartalter/',
        success     : function(data){
          if(data.status==true){
            location.reload(true);
          }
        }
      });

    }
  });
}
// DELETE PROPOSAL
function delProp(id) {
  var data ={id:id}
  $.ajax({
      type        : 'get',
      data        : data,
      dataType    : 'json',
      url         : '/users/del_order',
      success     : function(data){
        if(data.status == 1){
          $(".ref_dash").load(location.href+" .ref_dash>*","");
        }
      }
      })
}
