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


router.post('/', function(req, res){

  var cartItems = req.body.cartItems;

    client.set('cartItems',JSON.stringify(cartItems),function(err, data){
     res.send(data);
  });
});


router.post('/:id', function(req, res){

    client.get('cartItems',function(err,data){

        var cartItems = JSON.parse(data);

        _.forEach(cartItems,function(cartItem){
          if (cartItem.item.id  === parseInt(req.params.id)){

              cartItem.count += 1;

              client.set('cartItems',JSON.stringify(cartItems),function(err, data){
                res.send(data);
              });
            }
        });
    });
});


module.exports = router;
