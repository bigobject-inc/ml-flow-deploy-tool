#!/bin/bash

node websocket_test/test_server.js &
sleep 1
node test_server.js &

