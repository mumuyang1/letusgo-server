var express = require('express');
var router = express.Router();

var redis = require('redis');
var client = redis.createClient();

var _ = require('lodash');

router.get('/', function(req, res) {

  client.get('allProducts',function(err,data){
    res.send(data);
  });
});


router.post('/', function(req, res){

    var allProductsArray = [
                    {barcode:'ITEM000001',categoryId:1,name:'苹果',price:'3.00',unit:'斤'},
                    {barcode:'ITEM000002',categoryId:1,name:'香蕉',price:'3.50',unit:'斤'},
                    {barcode:'ITEM000003',categoryId:1,name:'菠萝',price:'4.00',unit:'个'},
                    {barcode:'ITEM000004',categoryId:2,name:'雪碧',price:'3.00',unit:'瓶'},
                    {barcode:'ITEM000005',categoryId:2,name:'可口可乐',price:'3.00',unit:'瓶'},
                    {barcode:'ITEM000006',categoryId:3,name:'公牛插座',price:'10.00',unit:'个'},
                    {barcode:'ITEM000007',categoryId:3,name:'水杯',price:'16.00',unit:'个'},
                    {barcode:'ITEM000008',categoryId:4,name:'钻石项链',price:'160000.00',unit:'个'},
                    {barcode:'ITEM000009',categoryId:4,name:'翡翠手镯',price:'200.00',unit:'个'}
                  ];

     var allProducts = req.param('allProducts')|| allProductsArray;

     client.set('allProducts',JSON.stringify(allProducts),function(err, data){
      res.send(data);
    });
  });

  router.delete('/:id', function(req, res) {


      var id = req.params.id;
      client.get('allProducts',function(err,data){

        var allProducts = JSON.parse(data);
        _.forEach(allProducts,function(product){
          if(product.barcode === id){

              allProducts = _.without(allProducts,product);

              client.set('allProducts',JSON.stringify(allProducts),function(err, allProducts){
                res.send(allProducts);
              });
           }

        });
     });
  });

  router.post('/name', function(req, res) {

          var name = req.params.name;

          client.get('categories',function(err,data){

          var categories = JSON.parse(data);
          var newCategory =
                  {
                      barcode : barcode,
                      name : name,
                      categoryId : categoryId,
                      price : price,
                      unit : unit        
                  };
          newCategory.id = categories[categories.length-1].id + 1;

          categories.push(newCategory);

          client.set('categories',JSON.stringify(categories),function(err, data){
          res.send(data);
          });
      });
    });

module.exports = router;
