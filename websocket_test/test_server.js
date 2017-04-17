/*
var http = require('http'),
    faye = require('faye');

var server = http.createServer(),
    bayeux = new faye.NodeAdapter({mount: '/'});

bayeux.attach(server);
server.listen(8000);
*/
var bodyParser = require('body-parser')
var express = require('express'),
    faye = require('faye'),http = require('http');

var app = express(),
    server = http.createServer(app),
    bayeux = new faye.NodeAdapter({mount: '/faye'});

bayeux.on('publish', function(clientId, channel, data) {
	console.log(channel + " " + JSON.stringify(data));
})


app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.static(__dirname + '/public'));


app.post('/pub', function(req, res) {
  var ts = Date.now();
//	console.log("post body: " + JSON.stringify(req.body));
	var tmp_v = req.body;
	tmp_v.id=ts;
//	console.log(tmp_v);
//  var test_json= {"id":ts,"data":{"user":req.body.user,"value":req.body.value,"id":ts},"operation":"insert","Hr":true,"clientId":9999}
/*
	var c_id = 0;
	if(tmp_v.channel == "/data")
	{c_id = 9999}
	else if(tmp_v.channel == "/msg")
	{c_id = 99999}
*/
  var test_json= {"id":ts,"data":tmp_v,"operation":"insert","Hr":true,"clientId":9999};
  bayeux.getClient().publish(tmp_v.channel, test_json );
//  console.log(req.body.user , req.body.value)
  res.send(200);
});

/*
app.post('/pub2', function(req, res) {
  var ts = Date.now();
	var tmp_v = req.body;
	tmp_v.id=ts;
  var test_json= {"id":ts,"data":tmp_v,"operation":"insert","Hr":true,"clientId":1111};
  bayeux.getClient().publish("/data", test_json );
//  console.log(req.body.user , req.body.value)
  res.send(200);
});
*/


bayeux.attach(app.listen(8000, function() {}));
//bayeux.attach(app);
//app.listen(8000);
