# encoding=utf8  
import requests
import json
import sys
import time
import json

reload(sys)  
sys.setdefaultencoding('utf8')
status_table_name = "device_monitor"
#table_size_thre = 20
#create_table_stmt = "create SLIDING table " + status_table_name + " (timestamp DATETIME64, cpu_usage float , total_mem int64, mem_usage float, total_disk int64, disk_usage float, bosrvd_usage float, bosrvd_mem_rrs int64, bosrvd_mem_vms int64,node_red_usage float, node_red_mem_rrs int64, node_red_mem_vms int64,ml_usage float, ml_mem_rrs int64, ml_mem_vms int64 TIMEBOUND(600))"

def insert_data(data):
	return_msg = ""
	#res = return_getData("http://localhost:9090/cmd" , "desc " + status_table_name ,True, "" )
	#if res[:22] == "\"Object doesn't exist:":
	#	res = return_getData("http://localhost:9090/cmd" , create_table_stmt, True, "" )

	insert_stmt = "insert into " + status_table_name + " values(" + data + ")"

	res = return_getData("http://localhost:9090/cmd" , insert_stmt , True, ""  )
	## also return status code....?
	#return name, return_msg



def cmd2JSON(cmd , workspace_name=""):
	return json.dumps({'Stmt':cmd,'Workspace':workspace_name,'Opts':{}})

def json_stream(fp):
	for line in fp:
		#print(line)
		yield json.loads(line)



def return_getData(server,cmdStr, no_print , workspace_name , timeout=9999):
	ret_str = ""
	r = requests.post(server,data=cmd2JSON(cmdStr, workspace_name) , stream=True , timeout=timeout)
	for content in json_stream(r.raw):
		if ret_str != "":
			ret_str += ","
		ret_str = ret_str + return_printdata(json.dumps(content) , no_print)
	return ret_str
	
def return_printdata(data_str , no_print=False):
	data = json.loads(data_str)
	#count = 0
	return_str = ""

	if(type(data['Content']) != dict):
		if json.dumps(data['Content']) != "null":
			if data['Content'] != "":
				if no_print == False:
					print(json.dumps(data['Content'],ensure_ascii=False, indent=4))
				return_str = json.dumps(data['Content'])
		else:
			if data['Err']!= "":
				if no_print == False:
					print(json.dumps(data['Err'], indent=4))
				return_str = json.dumps(data['Err'])
		return return_str

	if 'content' in data['Content'].keys():
		for row in data['Content']['content']:
			#print("row :" ,row)
			print_row=""
			for record in row:
				#if print_row != "":
				#	print_row += ","
                    		print_row += str(record).decode('utf-8')
				#print(print_row)
			if no_print == False:
				print(print_row)	
			
			if return_str != "":
				return_str += ","
			#print(return_str)
			return_str = return_str + print_row	
			#print("return_str : " ,return_str , " , print_row : " , print_row)
			#print(row)
			#count+=1
	else:
		if data['Content'] != "":
			if no_print == False:
				print(json.dumps(data['Content'], indent=4))
			return_str = json.dumps(data['Content'])
	#print(return_str)
	return return_str
 


