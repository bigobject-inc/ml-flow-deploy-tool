var express = require("express");
var app     = express();
var path    = require("path");
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(express.static(__dirname + '/resources'));

app.listen(8888);

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/test2.html'));

});

app.get('/test', function(req, res){
	var tmp = '[{"id":"6987566.07ee428","type":"tab","label":"testing"},{"id":"6dd879d0.0ccd38","type":"boserver","z":"","host":"localhost","port":"9090"},{"id":"2191d4c.26ffbac","type":"inject","z":"6987566.07ee428","name":"Start training","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":271.23333740234375,"y":97.23332977294922,"wires":[["4a2e3d9a.e7a81c"]]}]';
	var result = JSON.parse(tmp);
	console.log(result[0].type);
	res.send("ok")
});

app.post('/cmd', function(req, res){
//	console.log(req.body); 
	var result = JSON.parse(req.body);
	console.log(result.selected_model);

	console.log(result.model_prop);
	var model_prop= JSON.parse(result.model_prop);

	console.log(result.selected_flow);
	console.log(result.selected_opt);

	console.log(result.opt_prop);
	var opt_prop= JSON.parse(result.opt_prop);

	console.log(result.target_server);

	var fs = require('fs');
	fs.writeFile('./gen_tmp_flow.json', '', function(){console.log('truncate tmp flow done')});

	fs.readFile('./train_flow.txt', (err, data) => {
		if (err) throw err;
		  //console.log("from file : " + data);
			var train_obj = JSON.parse(data);
			// modify parameters from gui
			// train_obj[1].method="SGD";
			console.log(train_obj[1])
	});

	fs.writeFile('./gen_tmp_flow.json', req.body, function(){console.log('generate tmp flow done')});

	res.send("ok")
});


console.log("Running at Port 8888");
