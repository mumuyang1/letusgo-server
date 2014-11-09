var express = require('express');
var router = express.Router();

var redis = require('redis');
var client = redis.createClient();

var _ = require('lodash');

router.get('/', function (req, res) {

  client.get('categories', function (err, data) {

    res.send(data);
  });
});

function initCategories() {
  return  [
    {id: 1, name: '水果'},
    {id: 2, name: '饮料'},
    {id: 3, name: '生活用品'},
    {id: 4, name: '饰品'}
  ];
}

client.set('categories', JSON.stringify(initCategories()));

router.post('/', function (req, res) {

  client.get('categories', function (err, data) {
    var categories = JSON.parse(data);
    var newCategory =
    {
      id:  parseInt(categories[categories.length-1].id) + 1,
      name: req.body.name
    };
    categories.push(newCategory);
    client.set('categories', JSON.stringify(categories), function (err, data) {
      res.send(data);
    });
  });
});

router.delete('/:id', function (req, res) {

  var id = parseInt(req.params.id);

  client.get('categories', function (err, data) {

    var categories = JSON.parse(data);
    _.forEach(categories, function (categoryEach) {
      if (categoryEach.id === id) {

        categories = _.without(categories, categoryEach);

        client.set('categories', JSON.stringify(categories), function (err, categories) {
          res.send(categories);
        });
      }

    });
  });
});


router.put('/:id', function (req, res) {


  var id = parseInt(req.params.id);

  var categoryName = req.body.categoryName;

  client.get('categories', function (err, data) {

    var categories = JSON.parse(data);

    _.forEach(categories, function (categoryEach) {
      if (categoryEach.id === id) {
        categoryEach.name = categoryName;
        client.set('categories', JSON.stringify(categories), function (err, categories) {
          res.send(categories);
        });
      }
    });
  });
});


module.exports = router;
