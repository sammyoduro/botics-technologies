module.exports = function Cart(oldCart) {

  this.items = oldCart.items || {};
  this.counter = oldCart.counter || 0;
  this.unitPrice = oldCart.unitPrice || 0;
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;


  this.add = function (item, id) {
    var storedItem = this.items[id];
    if(!storedItem){
      storedItem = this.items[id] = {item:item, qty:0, price:0,unitPrice:0};
    }
    storedItem.unitPrice = storedItem.item.price;
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice = +this.totalPrice + +storedItem.item.price;
  }

  this.reduceByOne = function (id) {
    this.items[id].qty--;
    this.items[id].price-= this.items[id].item.price;
    this.totalQty--;
    this.totalPrice = +this.totalPrice - +this.items[id].item.price;
  }
    this.increaseByOne = function (id) {
    this.items[id].qty++;
    this.items[id].price = +this.items[id].price + +this.items[id].item.price;
    this.totalQty++;
    this.totalPrice = +this.totalPrice + +this.items[id].item.price;
  }

  this.generateArray = function () {
    var arr = [];
    for(var id in this.items){
      arr.push(this.items[id]);
    }
    return arr;
  }

  this.removeItem = function (id) {
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  }
  this.IncreaseByInput =function (productId,numOfItems) {

this.parseMidTotalprice = +this.totalPrice - +this.items[productId].price;

  this.totalQty = +this.totalQty - +this.items[productId].qty
  this.totalQty = +this.totalQty + +numOfItems; //total quantity
  this.items[productId].qty = numOfItems; //individual quantity
  this.items[productId].price = +this.items[productId].item.price * numOfItems; //aggregate price of a number of a particular item
  this.totalPrice = +this.parseMidTotalprice + this.items[productId].price;
  }
this.IncreaseBydetailInput = function (item, id,numItem){
  var storedItem = this.items[id];
  if(!storedItem){
    storedItem = this.items[id] = {item:item, qty:0, price:0,unitPrice:0};
  }
  storedItem.unitPrice = storedItem.item.price;
  storedItem.qty = +storedItem.qty + +numItem;
  this.totalQty = +this.totalQty + +numItem;

  if(this.items[id].price == 0){
    this.items[id].price = 0;
    this.items[id].price = +this.items[id].price + (+storedItem.unitPrice * +numItem);
    this.totalPrice = +this.totalPrice + +this.items[id].price;
  }else{

    this.items[id].price =  (+storedItem.unitPrice * +numItem) - this.items[id].price;
    this.items[id].price = storedItem.unitPrice * storedItem.qty;
    this.totalPrice = (+this.totalPrice + +this.items[id].price)-(storedItem.unitPrice*numItem);
  }
}
};
