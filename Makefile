PKGS = $(shell go list ./... | grep -v /vendor/)
GO ?= go
TMP_PATH ?= /tmp/gopath

all: test build build_ui

get:
	$(GO) get -u github.com/gorilla/mux
	$(GO) get -u github.com/coreos/etcd/client
	$(GO) get -u github.com/pkg/errors
	$(GO) get -u github.com/stretchr/testify/assert
	
test:
	$(GO) test $(PKGS)

build:
	GOPATH=${PWD}/vendor $(GO) build
	
build_ui:
	cd ui && ng build && cd ..

static_linux:
	rm -rf ${TMP_PATH}
	mkdir ${TMP_PATH}
	mkdir -p ${TMP_PATH}/src/github.com/slvwolf/ccentral
	GOPATH=${TMP_PATH} go get -d -u -v \
		github.com/gorilla/mux \
		github.com/coreos/etcd/client \
		github.com/pkg/errors
	cp -r * ${TMP_PATH}/src/github.com/slvwolf/ccentral
	GOPATH=${TMP_PATH} env GOOS=linux GOARCH=amd64 $(GO) build -a -ldflags '-s' -tags netgo -installsuffix netgo -v -o ccentral

static:
	env GOOS=linux GOARCH=amd64 GOPATH=${PWD}/vendor $(GO) build -a -ldflags '-s' -tags netgo -installsuffix netgo -v -o ccentral

vendor_clean:
	rm -dRf ${PWD}/vendor/src

vendor_get: vendor_clean
	GOPATH=${PWD}/vendor go get -d -u -v \
	github.com/gorilla/mux \
	github.com/coreos/etcd/client \
	golang.org/x/net/context
