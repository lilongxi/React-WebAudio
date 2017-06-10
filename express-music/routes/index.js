var express = require('express');
var router = express.Router();
var path = require('path');
var audio = path.join(__dirname, '../public/images');
var fs = require('fs');

var uuid = require('uuid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/data', function(req, res, next) {
  var src = 'http://localhost:8080/images/';
  var content = [];
  var arr;
  fs.readdir(audio, function(err, names){
  	if(err){
  		console.log(err)
  		arr = {status:"fail",code:"300",content:err};
  		res.json(arr);
  	}else{
  		names.forEach(function(item){
  			var c = {
  				name:item.split('.')[0],
  				url:src+item,
  				id: uuid.v4()
  			}
  			content.push(c);
  		});
  		arr = {status:"success",code:"200",content:content};
  		res.json(arr);
  	}
  })
});

module.exports = router;
