#!/usr/bin/python

import psutil
import time
import insert_data
import requests
import json
from time import gmtime, strftime, localtime
import sys

def main():
	bosrvd_id = 0;
	node_red_id = 0;
	ml_id = 0;
	for proc in psutil.process_iter():
		if proc.name() == "bosrvd":
			bosrvd_id = proc.pid

		if proc.name() == "node-red":
			node_red_id = proc.pid

		if proc.name() == "ml":
			ml_id = proc.pid


	print(bosrvd_id , node_red_id , ml_id)

	while(1):

		print_str = ""

		for proc in psutil.process_iter():
			if proc.name() == "ml":
				ml_id = proc.pid

		print_str += "{\"channel\":\"/data\", \"timestamp\":\"" + strftime("%Y-%m-%d<br>%H:%M:%S", localtime()) + "\","
		print_str += "\"cpu_usage\":" + str(psutil.cpu_percent()) + ","
		print_str += "\"total_mem\":" + str(psutil.virtual_memory().total / 1048576) + ", \"mem_usage\":" + str(psutil.virtual_memory().percent) + " , " 
		print_str += "\"total_disk\":" + str(psutil.disk_usage('/').total / 1048576) + ",\"disk_usage\":" + str(psutil.disk_usage('/').percent) + " , " 

		if bosrvd_id != 0:
			bosrvd_p = psutil.Process(bosrvd_id)
			print_str += "\"bosrvd_usage\":" + str(bosrvd_p.cpu_percent(interval=0.1)) + ",\"bosrvd_mem_rrs\":" + str(bosrvd_p.memory_info().rss / 1048576) + ",\"bosrvd_mem_vms\":" + str(bosrvd_p.memory_info().vms / 1048576)+ ', '
		if node_red_id != 0:
			node_red_p = psutil.Process(node_red_id)
			print_str += "\"node_red_usage\":" + str(node_red_p.cpu_percent(interval=0.1)) + ",\"node_red_mem_rrs\":" + str(node_red_p.memory_info().rss / 1048576) + ",\"node_red_mem_vms\":" + str(node_red_p.memory_info().vms / 1048576) + ', '
		if ml_id != 0:
			try:
				ml_p = psutil.Process(ml_id)
				print_str += "\"ml_usage\":" + str(ml_p.cpu_percent(interval=0.1)) + ",\"ml_mem_rrs\":" + str(ml_p.memory_info().rss / 1048576) + ",\"ml_mem_vms\":" + str(ml_p.memory_info().vms / 1048576) + '}'
			except:
				print "Unexpected error 1:", sys.exc_info()[0] 
				sys.exc_clear()
				print_str += "\"ml_usage\":0,\"ml_mem_rrs\":0,\"ml_mem_vms\":0}"
				ml_id = 0
				pass

		else:
			print_str += "\"ml_usage\":0,\"ml_mem_rrs\":0,\"ml_mem_vms\":0}"
#			print(print_str)


		time.sleep(1)

		try:	
		#	insert_data.insert_data(print_str)
			d = json.loads(print_str)
			r = requests.post("http://127.0.0.1:8000/pub", json=d , stream=True , timeout=9999)
		#	print(r)
		except KeyboardInterrupt:
			print("stoping...")
			sys.exit(1)
		except:
			print "Unexpected error   :", sys.exc_info()[0]
			sys.exc_clear()
			raise



if __name__ == "__main__":
    main()
