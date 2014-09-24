var express = require('express');
var router = express.Router();

var redis = require('redis');
var client = redis.createClient();

 var _ = require('lodash');

router.get('/', function(req, res){
  client.get('cartItems',function(err,data){
    res.send(data);
  });
});

router.post('/:id', function(req, res){

  client.get('allProducts',function(err,data){


    var products = JSON.parse(data);

    var result = _.find(products,{'id': parseInt(req.params.id)});

    var cartItems = [];
    var cartItem = {'item':result,'count' : 1 };

    cartItems.push(cartItem);

    client.set('cartItems',JSON.stringify(cartItems),function(err, data){
     res.send(data);
   });
  });
});


module.exports = router;
