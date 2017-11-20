#!/bin/bash
docker run --rm -v $PWD:/go/src/github.com/Applifier/ccentral -w /go/src/github.com/Applifier/ccentral golang:latest /bin/bash -c "make vendor_get; make static && ! ldd ccentral"
docker build -t ${image} .
