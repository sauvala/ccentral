#!/bin/bash
docker run --rm -v $PWD:/go/src/github.com/Applifier/ccentral -w /go/src/github.com/Applifier/ccentral golang:latest /bin/bash -c "make get; make static_linux && ! ldd ccentral"
docker build -t ${image} .
