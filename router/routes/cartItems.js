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


     function judgeIsExist(cartItems,item){

       for(var i = 0; i < cartItems.length; i++){

         if(item.id === cartItems[i].item.id){
           return cartItems[i];
         }
        }
     }

router.post('/', function(req, res){

  var item = req.body.item;

   var cartItem = {'item' : item, 'count' : 1};

       client.get('cartItems',function(err,data){

           var cartItems = JSON.parse(data);
             if(!cartItems){
                cartItems= [];
               cartItems.push(cartItem);

           } else {

               var result = judgeIsExist(cartItems,item);
               result ? result.count++ : cartItems.push(cartItem);
           }

        client.set('cartItems',JSON.stringify(cartItems),function(err, data){
         res.send(data);
        });
    });
});


router.put('/:id', function(req, res){

    client.get('cartItems',function(err,data){

        var cartItems = JSON.parse(data);

        var operation = req.body.operation;

        _.forEach(cartItems,function(cartItem){
            if (cartItem.item.id  === parseInt(req.params.id)){

                if(operation === 'add'){
                  cartItem.count += 1;
                }
                if(operation === 'reduce'){
                  cartItem.count -= 1;
                }
                if(operation === 'delete'){
                  cartItems = _.without(cartItems,cartItem);
                }
              }
          });

        client.set('cartItems',JSON.stringify(cartItems),function(err, data){
          res.send(data);
        });
    });
});


router.delete('/', function(){

     client.DEL('cartItems');
});


module.exports = router;
