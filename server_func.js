var fs = require('fs');

module.exports = {
// generate template flows from user's selection
makeflow: function (req, res) 
{

	var result = JSON.parse(req.body);
	console.log(result.selected_model);

	console.log(result.model_prop);
	var model_prop= JSON.parse(result.model_prop);

	console.log(result.selected_flow);


	console.log("opt select: " + result.selected_opt);

	console.log(result.opt_prop);
	var opt_prop= JSON.parse(result.opt_prop);

	console.log(result.target_server);

	//write to a tmp flow file
	fs.writeFile('./gen_tmp_flow.json', '[', function(){});

	// load basic flow template
	var data = fs.readFileSync('./basic_flow.txt', "utf8");
	fs.appendFile('./gen_tmp_flow.json',data, function(){console.log('write basic flow')});

	//modify training template flow by gui information
	if(result.selected_flow.indexOf('1') > -1 && result.selected_model != "") 
	{	
		//load train template flow
		var data = fs.readFileSync('./train_flow.txt', "utf8");
		console.log("from file : " + data);
		var train_obj = JSON.parse(data);
		switch (result.selected_model) {
			case 'tensorflow DNN':
				train_obj[1].method="tfDNN";
				train_obj[1].modelname=model_prop["Model name"];
				train_obj[1].nclass=model_prop["class number"];
				train_obj[1].hiddenlayer=model_prop["hidden layer"];
				break;
			case 'SGD non-linear':
				train_obj[1].method="SGDNL";
				train_obj[1].modelname=model_prop["Model name"];
				train_obj[1].nclass='';
				train_obj[1].hiddenlayer='';
				break;
			case 'SGD linear':
				train_obj[1].method="SGD";
				train_obj[1].modelname=model_prop["Model name"];
				train_obj[1].nclass='';
				train_obj[1].hiddenlayer='';
				break;
			}

			// modify parameters from gui
			console.log(train_obj[1])
			fs.appendFile('./gen_tmp_flow.json', "," + (JSON.stringify(train_obj)).slice(1,-1), function(){console.log('write train flow')});

	}

	//modify prediction template flow by gui information
	if(result.selected_flow.indexOf('2') > -1 && result.selected_model != "") 
	{
		// load prediction template flow
		var data = fs.readFileSync('./prediction_flow.txt', "utf8");
		console.log("from file : " + data);
		var prediction_obj = JSON.parse(data);
		switch (result.selected_model) {
			case 'tensorflow DNN':
				prediction_obj[1].method="tfDNN";
				prediction_obj[1].modelname=model_prop["Model name"];
				prediction_obj[1].nclass=model_prop["class number"];
				prediction_obj[1].hiddenlayer=model_prop["hidden layer"];
				break;
			case 'SGD non-linear':
				prediction_obj[1].method="SGDNL";
				prediction_obj[1].modelname=model_prop["Model name"];
				prediction_obj[1].nclass='';
				prediction_obj[1].hiddenlayer='';
				break;
			case 'SGD linear':
				prediction_obj[1].method="SGD";
				prediction_obj[1].modelname=model_prop["Model name"];
				prediction_obj[1].nclass='';
				prediction_obj[1].hiddenlayer='';
				break;
			}

			// modify parameters from gui
			console.log(prediction_obj[1])
			fs.appendFile('./gen_tmp_flow.json', "," + (JSON.stringify(prediction_obj)).slice(1,-1), function(){console.log('write prediction flow')});

	}// prediction template flow


	//modify normalization template flow by gui information
	if(result.selected_flow.indexOf('3') > -1 && result.selected_model != "") 
	{

		var data = fs.readFileSync('./normalize_flow.txt', "utf8");
		console.log("from file : " + data);
		var normalize_obj = JSON.parse(data);
		switch (result.selected_model) {
			case 'tensorflow DNN':
				normalize_obj[1].method="tfDNN";
				normalize_obj[1].modelname=model_prop["Model name"];
				break;
			case 'SGD non-linear':
				normalize_obj[1].method="SGDNL";
				normalize_obj[1].modelname=model_prop["Model name"];
				break;
			case 'SGD linear':
				normalize_obj[1].method="SGD";
				normalize_obj[1].modelname=model_prop["Model name"];
				break;
			}

			// modify parameters from gui
			console.log(normalize_obj[1])
			fs.appendFile('./gen_tmp_flow.json', "," + (JSON.stringify(normalize_obj)).slice(1,-1), function(){console.log('write normalization flow')});

	}// normalization template flow

	//modify remove template flow by gui information
	if(result.selected_flow.indexOf('4') > -1 && result.selected_model != "") 
	{

		var data = fs.readFileSync('./remove_flow.txt', "utf8");
		console.log("from file : " + data);
		var remove_obj = JSON.parse(data);
		switch (result.selected_model) {
			case 'tensorflow DNN':
				remove_obj[1].method="tfDNN";
				remove_obj[1].modelname=model_prop["Model name"];
				break;
			case 'SGD non-linear':
				remove_obj[1].method="SGDNL";
				remove_obj[1].modelname=model_prop["Model name"];
				break;
			case 'SGD linear':
				remove_obj[1].method="SGD";
				remove_obj[1].modelname=model_prop["Model name"];
				break;
			}

			// modify parameters from gui
			console.log(remove_obj[1])
			fs.appendFile('./gen_tmp_flow.json', "," + (JSON.stringify(remove_obj)).slice(1,-1), function(){console.log('write remove flow')});

	}// remove template flow

	if(result.selected_opt != "")
	{
		var data = fs.readFileSync('./optimize_flow.txt', "utf8");
		console.log("from file : " + data);
		var opt_obj = JSON.parse(data);
		if(opt_prop.method == "brute force")
		{
			opt_obj[1].method="brute force";
			opt_obj[1].boundmin=opt_prop["bound min"];
			opt_obj[1].boundmax=opt_prop["bound max"];
			opt_obj[1].minimizer="";
			opt_obj[1].initvalue="";
			opt_obj[1].tolerance="";
			opt_obj[1].iteration="";
		}
		else if(opt_prop.method == "basin hopping")
		{
			opt_obj[1].method="basin hopping";
			opt_obj[1].boundmin=opt_prop["bound min"];
			opt_obj[1].boundmax=opt_prop["bound max"];
			opt_obj[1].minimizer=opt_prop.minimizer;
			opt_obj[1].initvalue=opt_prop["init value"];
			opt_obj[1].tolerance=opt_prop["tolerance value"];
			opt_obj[1].iteration=opt_prop["iteration"];
		}

		//set target method
		switch (result.selected_model) {
		case 'tensorflow DNN':
			opt_obj[1].target="tfDNN";
			opt_obj[1].targetarg = model_prop["Model name"] + ' ' + model_prop["class number"] + ' ' + model_prop["hidden layer"];

			break;
		case 'SGD non-linear':
			opt_obj[1].target="SGDNL";
			var tar_arg = model_prop["Model name"] + ' ';
			if(model_prop["Normalization"] == true)
			{
				tar_arg += "True []";
			}
			else
			{
				tar_arg += "False []";
			}
			opt_obj[1].targetarg = tar_arg;
			break;
		case 'SGD linear':
			opt_obj[1].target="SGD";
			var tar_arg = model_prop["Model name"] + ' ';
			if(model_prop["Normalization"] == true)
			{
				tar_arg += "True []";
			}
			else
			{
				tar_arg += "False []";
			}
			opt_obj[1].targetarg = tar_arg;
			break;
		}
		fs.appendFile('./gen_tmp_flow.json', "," + (JSON.stringify(opt_obj)).slice(1,-1), function(){console.log('write optimization flow')});
	}

	fs.appendFile('./gen_tmp_flow.json', "]", function(){});

	////////////////////////////////////////////
	// deploy to node-red server by post (curl)
	////////////////////////////////////////////
	var exec = require('child_process').exec;
	var ls = exec('curl -v -X POST http://' + result.target_server + ':1880/flows -H "Content-Type: application/json"  --data "@gen_tmp_flow.json"', function (error, stdout, stderr) {
	if (error) {
		console.log(error.stack);
		console.log('Error code: ' + error.code);
		}
	console.log('run : ' +'curl -v -X POST http://' + result.target_server + ':1880/flows -H "Content-Type: application/json"  --data "@gen_tmp_flow.json"');
	console.log('Child Process STDOUT: ' + stdout);
	});

	////////////////////////////////////////////
	res.send("ok")

},

getserverlist: function (req, res) 
{
	if (!fs.existsSync('./serverlist.dat')) 
	{
		fs.writeFile('./serverlist.dat', '{"server":[]}', function(){console.log('server list not found')});
		console.log('server list file created.')
	}

	fs.readFile('./serverlist.dat', (err, data) => {
		if (err) throw err;
		var server_list = JSON.parse(data);
		res.send(server_list.server);	
	});

},
addserverlist: function (req, res) 
{
	if (!fs.existsSync('./serverlist.dat')) 
	{
		fs.writeFile('./serverlist.dat', '{"server":[]}', function(){console.log('server list not found')});
		console.log('server list file created.')
	}

	//receive '{"addserver":"<ip>"}' based on text/plain content type.
	//
	//	ex. curl -X POST -H "Content-Type: text/plain" -d '{"addserver":"10.0.3.15"}' localhost:8888/regist
	//

	fs.readFile('./serverlist.dat', (err, data) => {
		if (err) throw err;
		var server_list = JSON.parse(data);
		var server = server_list.server;
		var addserver = JSON.parse(req.body);
		if(server.indexOf(addserver.addserver) == -1)
		{
			server.push(addserver.addserver)
		}
		server_list.server = server;
		console.log("server list:" + server);
		fs.writeFile('./serverlist.dat', JSON.stringify(server_list), function(){console.log('server list updated.')});
		res.send("server list : " + server_list.server + "\n");		
	});

},

status: function (req, res) 
{

	console.log(req.query.ip);
	var request = require('request');
	
	// get data of the ml status table by http restful
	request({
		url: 'http://' + req.query.ip + ':9090/cmd',
		method: "POST",
		json: true,   
		body: {"Stmt":"select rank(), * from ml_status_table"}
	}, function (error, response, body){
		
		if(body!= undefined && body.Content != undefined && body.Content.content != undefined)
		{
			console.log(JSON.stringify(body.Content.content));
			// pass the query result to the status page
			res.render("status", { jsdata:JSON.stringify(body.Content.content)});
		}
		else
		{
			res.render("status",{jsdata:''});
		}

	});



}
,

client_status: function (req, res) 
{
	//console.log(req.params.ip);
//	console.log("+++++" + req.query.ip);
	var request = require('request');
	

	request({
		url: 'http://' + req.query.ip + ':9090/cmd',
		method: "POST",
		json: true,   // <--Very important!!!
		body: {"Stmt":"select * from d_tmp last 1"}
//		body: {"Stmt":"select rank(),cpu_usage, bosrvd_usage, node_red_usage,ml_usage from d_tmp last 30"}
//		body:{"Stmt":"select rank(),mem_usage,bosrvd_mem_rrs, bosrvd_mem_vms,node_red_mem_rrs , node_red_mem_vms, ml_mem_rrs, ml_mem_vms from d_tmp"}
	}, function (error, response, body){
		
		if(body!= undefined && body.Content != undefined && body.Content.content != undefined)
		{
			console.log(JSON.stringify(body.Content.content));
			res.render("device_info", { jsdata:JSON.stringify(body.Content.content)});
		}
		else
		{
			res.render("device_info",{jsdata:''});
		}
//		res.render("status", { jsdata:body.Content.content});
	});
}

};
