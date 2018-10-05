GO ?= go

all: test build

get:
	$(GO) get -u github.com/gorilla/mux
	$(GO) get -u github.com/coreos/etcd/client
	$(GO) get -u golang.org/x/net/context
	$(GO) get -u github.com/stretchr/testify/assert
	
test:
	$(GO) test

build:
	$(GO) build

static_linux:
	GOPATH := ${PWD}/_vendor:$(GOPATH)
	export GOPATH
	GOPATH=${PWD}/_vendor go get -d -u -v \
		github.com/gorilla/mux \
		github.com/coreos/etcd/client \
		golang.org/x/net/context
	find . -type f | xargs sed -i 's/slvwolf/Applifier/g'
	env GOOS=linux GOARCH=amd64 $(GO) build -a -ldflags '-s' -tags netgo -installsuffix netgo -v -o ccentral
