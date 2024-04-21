#! /bin/bash

docker build -t webssh -f Dockerfile ../

docker save -o webssh.tar webssh

gzip webssh.tar -f