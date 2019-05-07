var express   = require('express');
var router   = express.Router();
var Product    = require('../models/product');
var tutorials    = require('../models/tutorials');
var Item_Category = require('../models/item_category');
var frequently_search  = require('../models/frequently_search');
var dateFormat          = require('dateformat');


router.post('/',function (req,res) {
  let searchitem = req.body.searchItem;
  let SearchFilter = req.body.SearchFilter;
  var getArray=[];


  if (SearchFilter == 'Videos'){

    tutorials.find({short_desc: {$regex: searchitem, $options: '/^i/'}},function (err,Items_searchResult) {
      for (var i = 0; i < Items_searchResult.length; i++) {

        getArray.push(Items_searchResult[i].short_desc);
      }
      res.send(getArray);

    });
  }else if(SearchFilter == 'Items'){

    Product.find( {$or: [{title:{$regex: searchitem, $options: '/^i/'}},{item_category:{$regex: searchitem, $options: '/^i/'}}] },function (err,Items_searchResult) {
      console.log(searchitem);
      for (var i = 0; i < Items_searchResult.length; i++) {
        getArray.push(Items_searchResult[i].title);
      }
      res.send(getArray);
    }).limit(5);
  }

});

router.get('/q',function (req,res) {
  var SearchFilter = req.query.SearchFilter;
  var searchitem    = req.query.searchbox;
  var perPage = 4;
  var page = 1;
  var offset = (page - 1) * perPage;


  Product.aggregate([{ $sample: { size: 2 } }],function (err,product) {
      if(err){throw err;}
      tutorials.aggregate([{ $sample: { size: 2 } }],function (err,tutorial) {
        if(err){throw err;}

  switch (SearchFilter) {

  case 'Videos':
      Item_Category.find({},function (err,itemcat) {
      tutorials.find({short_desc: {$regex: searchitem, $options: '/^i/'}},function (err,Vid_searchResult) {

      var paginatedVideos  = Vid_searchResult.slice(offset).slice(0, perPage);
      res.render('default/SearchResults', {
        user:req.user,
        itemcat:itemcat,
        product : product,
        videos: tutorial,
        searchitem:searchitem,
        SearchFilter:SearchFilter,
        Vid_searchResult:paginatedVideos,
        current: page,
        pages: Math.ceil(Vid_searchResult.length / perPage)
       });
      });
    });
    break;
  default:
  //auto save searchItem
  var frequent_search = new frequently_search({
    item : searchitem,
    timestamp : dateFormat(new Date(), "dd-mm-yyyy h:MM:ss")
  });
  frequent_search.save();

  Item_Category.find({},function (err,itemcat) {
  Product.find( {$or: [{title:{$regex: searchitem, $options: '/^i/'}},{item_category:{$regex: searchitem, $options: '/^i/'}}] },function (err,Items_searchResult) {
    var paginated  = Items_searchResult.slice(offset).slice(0, perPage);
    res.render('default/SearchResults', {
      user:req.user,
      itemcat:itemcat,
      searchitem:searchitem,
      searchResult:paginated,
      SearchFilter:SearchFilter,
      current: page,
      pages: Math.ceil(Items_searchResult.length / perPage)
     });
    });
  });
  break;

  }

        })
  });

});

router.get('/q/:page',function (req,res) {

  var base          = req.params.page.split('_');
  var SearchFilter  = base[1].split('&')[1];
  var searchitem    = base[1].split('&')[0];
  var perPage       = 4;
  var page          = base[0] || 1;
  var offset        = (page - 1) * perPage;

  Product.aggregate([{ $sample: { size: 2 } }],function (err,product) {
      if(err){throw err;}
      tutorials.aggregate([{ $sample: { size: 2 } }],function (err,tutorial) {
        if(err){throw err;}

switch (SearchFilter) {

  case 'Videos':
      Item_Category.find({},function (err,itemcat) {
      tutorials.find({short_desc: {$regex: searchitem, $options: '/^i/'}},function (err,Vid_searchResult) {

      var paginatedVideos  = Vid_searchResult.slice(offset).slice(0, perPage);
      res.render('default/SearchResults', {
        user:req.user,
        itemcat:itemcat,
        product : product,
        videos: tutorial,
        searchitem:searchitem,
        SearchFilter:SearchFilter,
        Vid_searchResult:paginatedVideos,
        current: page,
        pages: Math.ceil(Vid_searchResult.length / perPage)
       });
     });
    });
    break;
  default:
  Item_Category.find({},function (err,itemcat) {
  Product.find( {$or: [{title:{$regex: searchitem, $options: '/^i/'}},{item_category:{$regex: searchitem, $options: '/^i/'}}] },function (err,Items_searchResult) {

    var paginated  = Items_searchResult.slice(offset).slice(0, perPage);
    res.render('default/SearchResults', {
      user:req.user,
      itemcat:itemcat,
      searchitem:searchitem,
      searchResult:paginated,
      SearchFilter:SearchFilter,
      current: page,
      pages: Math.ceil(Items_searchResult.length / perPage)
     });
    });
  });
  break;

}

        })
  });

});
module.exports = router;
