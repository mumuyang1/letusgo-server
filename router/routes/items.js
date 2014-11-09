var express = require('express');
var router = express.Router();

var redis = require('redis');
var client = redis.createClient();

var _ = require('lodash');

function add(allProducts, newProduct) {
  var lastBarcode = allProducts[allProducts.length - 1].barcode;
  var i = +lastBarcode.substring(9, lastBarcode.length) + 1;

  newProduct.barcode = allProducts[allProducts.length - 1].barcode.substring(0, 9) + i;
  allProducts.push(newProduct);
  return allProducts;
}

function modify(allProducts, id, item) {
  _.forEach(allProducts, function (product) {

    if (product.id === id) {
      product.name = item.name;
      product.unit = item.unit;
      product.price = item.price;
      product.categoryId = item.categoryId;
    }
  });
  return allProducts;
}

function initItems() {
  return [
    {id: 1, barcode: 'ITEM000001', categoryId: 1, name: '苹果', price: '3.00', unit: '斤'},
    {id: 2, barcode: 'ITEM000002', categoryId: 1, name: '香蕉', price: '3.50', unit: '斤'},
    {id: 3, barcode: 'ITEM000003', categoryId: 1, name: '菠萝', price: '4.00', unit: '个'},
    {id: 4, barcode: 'ITEM000004', categoryId: 2, name: '雪碧', price: '3.00', unit: '瓶'},
    {id: 5, barcode: 'ITEM000005', categoryId: 2, name: '可口可乐', price: '3.00', unit: '瓶'},
    {id: 6, barcode: 'ITEM000006', categoryId: 3, name: '公牛插座', price: '10.00', unit: '个'},
    {id: 7, barcode: 'ITEM000007', categoryId: 3, name: '水杯', price: '16.00', unit: '个'},
    {id: 8, barcode: 'ITEM000008', categoryId: 4, name: '钻石项链', price: '160000.00', unit: '个'},
    {id: 9, barcode: 'ITEM000009', categoryId: 4, name: '翡翠手镯', price: '200.00', unit: '个'}
  ];
}

function deleteItem(allProducts, id) {
  _.forEach(allProducts, function (product) {

    if (product.barcode === id) {
      allProducts = _.without(allProducts, product);
    }
  });
  return allProducts;
}


router.get('/', function (req, res) {

  client.get('allProducts', function (err, data) {

    res.send(data);
  });
});

client.set('allProducts', JSON.stringify(initItems()));

router.delete('/:id', function (req, res) {

  var id = req.params.id;
  client.get('allProducts', function (err, data) {

    var allProducts = deleteItem(JSON.parse(data), id);
    client.set('allProducts', JSON.stringify(allProducts), function (err, allProducts) {
      res.send(allProducts);
    });

  });
});

router.post('/', function (req, res) {

  client.get('allProducts', function (err, data) {
    var products = JSON.parse(data);
    var newProduct = req.body.item;
    newProduct.id = parseInt(products[products.length - 1].id) + 1;
    var allProducts = add(products, newProduct);

    client.set('allProducts', JSON.stringify(allProducts), function (err, data) {
      res.send(data);
    });
  });
});

router.put('/:id', function (req, res) {

  var id = parseInt(req.params.id);
  var item = req.body.item;

  client.get('allProducts', function (err, data) {

    var allProducts = modify(JSON.parse(data), id, item);

    client.set('allProducts', JSON.stringify(allProducts), function (err, allProducts) {
      res.send(allProducts);
    });

  });
});

module.exports = router;
