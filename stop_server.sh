#!/bin/bash
kill $( ps ax|grep node\ websocket_test/test_server.js| sed -e 's/^[[:space:]]*//'| cut -d ' ' -f 1 -s)
kill $( ps ax|grep node\ test_server.js| sed -e 's/^[[:space:]]*//'| cut -d ' ' -f 1 -s)
