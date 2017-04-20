# ml-flow-deploy-tool
A BigObject machine learning template flow deployment tool

requirement:

Internet connection : since webix 

npm package :express, body-parser, faye, consolidate

The demo is consisted of a node.js web server(express), a node.js websocket server(for faye), a python system monitor tool.

working functions:

1. dynamic chart for cpu, ram usage 
2. deploy template node-red flows
3. receive messages from template node-red flows 
4. show device status
5. remote node-red / bigobject 

incompleted functions:

1. dynamic disk monitor
2. switch devices
3. add threshold in cpu/ram usage



start web server, websocket server:

    sh start_servers.sh

stop web server, websocket server:

    sh stop_servers.sh

sample monitor tool: in monitor_test path

    python monitor_json.py 
    
    
