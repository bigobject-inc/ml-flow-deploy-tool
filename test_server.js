var express = require("express");
var app     = express();
var path    = require("path");
var bodyParser = require('body-parser')
var fs = require('fs');
var server_func = require('./server_func');

//app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/resources'));

var engine = require('consolidate');

app.set('views', __dirname + '/views');
app.engine('html', engine.mustache);
app.set('view engine', 'html');


app.listen(8888);

app.get('/test2',function(req,res){
	res.sendFile(path.join(__dirname+'/test2.html'));
});

app.get('/',function(req,res){
	//res.sendFile(path.join(__dirname+'/test2.html'));
	res.sendFile(path.join(__dirname+'/main.html'));

});


app.get('/status', function(req, res){
	server_func.status(req, res);
});


app.post('/regist', function(req, res){
	server_func.addserverlist(req, res);
});

app.get('/regist', function(req, res){
	server_func.getserverlist(req, res);
});

app.post('/cmd', function(req, res){
	server_func.makeflow(req, res);
});


console.log("Running at Port 8888");
