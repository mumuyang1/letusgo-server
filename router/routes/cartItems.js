var express = require('express');
var router = express.Router();

var redis = require('redis');
var client = redis.createClient();




module.exports = router;
