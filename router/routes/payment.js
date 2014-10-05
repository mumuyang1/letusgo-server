var express = require('express');
var router = express.Router();

var redis = require('redis');
var client = redis.createClient();


router.post('/', function(req, res) {
    client.DEL('cartItems',function(){
      res.sendStatus(200);
    });
 });
 
module.exports = router;
