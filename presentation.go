package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"time"

	"github.com/gorilla/mux"
	"github.com/slvwolf/ccentral/client"
)

func handleMockService(w http.ResponseWriter, r *http.Request) {
	//vars := mux.Vars(r)
	setHeaders(w)
	//serviceID := vars["serviceId"]
	schema := make(map[string]SchemaItem)
	schema["example-str-set"] = *newSchemaItem("default", "string", "Configuration SET (String)", "Configuration with some configuration set")
	schema["example-str-unset"] = *newSchemaItem("default", "string", "Configuration UNSET (String)", "Configuration with default values")
	schema["example-int-set"] = *newSchemaItem("0", "integer", "Configuration SET (Integer)", "Configuration with some configuration set")
	schema["example-int-unset"] = *newSchemaItem("0", "integer", "Configuration UNSET (Integer)", "Configuration with default values")
	schema["example-bool-set"] = *newSchemaItem("0", "boolean", "Configuration SET (Boolean)", "Configuration with some configuration set")
	schema["example-bool-unset"] = *newSchemaItem("0", "boolean", "Configuration UNSET (Boolean)", "Configuration with default values")
	schema["example-float-set"] = *newSchemaItem("0", "float", "Configuration SET (Float)", "Configuration with some configuration set")
	schema["example-float-unset"] = *newSchemaItem("0", "float", "Configuration UNSET (Float)", "Configuration with default values")
	schema["example-password-set"] = *newSchemaItem("none", "password", "Configuration SET (Password)", "Configuration with some configuration set")
	schema["example-password-unset"] = *newSchemaItem("none", "password", "Configuration UNSET (Password)", "Configuration with default values")
	schema["example-list-set"] = *newSchemaItem("[]", "list", "Configuration SET (List)", "Configuration with some configuration set")
	schema["example-list-unset"] = *newSchemaItem("[]", "list", "Configuration UNSET (List)", "Configuration with default values")
	config := make(map[string]ConfigItem)
	config["example-str-set"] = *newConfigItem("Value is set", 0)
	config["example-old-conf"] = *newConfigItem("This config should not be shown", 0)
	config["example-int-set"] = *newConfigItem("1", 0)
	config["example-bool-set"] = *newConfigItem("1", 0)
	config["example-float-set"] = *newConfigItem("1.0", 0)
	config["example-password-set"] = *newConfigItem("1234", 0)
	config["example-list-set"] = *newConfigItem("[\"foo\", \"bar\"]", 0)
	instances := make(map[string]map[string]interface{})
	i := make(map[string]interface{})
	instances["1234"] = i
	i["started"] = fmt.Sprintf("%v", time.Now().Unix())
	i["c_value"] = [1]int{2}
	i["k_key"] = fmt.Sprintf("Single-value")
	i["cv"] = fmt.Sprintf("1.0.0")
	i = make(map[string]interface{})
	instances["1235"] = i
	i["started"] = fmt.Sprintf("%v", time.Now().Unix())
	i["c_value"] = [3]int{2, 3, 5}
	i["k_key"] = fmt.Sprintf("Multi-value")
	i["cv"] = fmt.Sprintf("1.0.0")
	info := make(map[string]string)
	info["str_infoline"] = "info"
	hidePasswordFields(schema, config)
	output, err := json.Marshal(newService(schema, config, instances, info, "example"))
	if err != nil {
		writeInternalError(w, "Could not convert to json", http.StatusInternalServerError)
		return
	}
	fmt.Fprintf(w, string(output))
}

func handleMockServiceList(w http.ResponseWriter, r *http.Request) {
	setHeaders(w)
	response := client.ServiceList{Services: make([]string, 0, 1)}
	response.Services = append(response.Services, "example")
	v, err := json.Marshal(response)
	if err != nil {
		log.Printf(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "{\"error\": \"Error marshalling json\"}")
		return
	}
	fmt.Fprintf(w, string(v))
}

func handleMockItem(w http.ResponseWriter, r *http.Request) {
	setHeaders(w)
	vars := mux.Vars(r)
	serviceID := vars["serviceId"]
	keyID := vars["keyId"]
	if r.Method != http.MethodPut {
		writeInternalError(w, "Allowed methods are: PUT", http.StatusBadRequest)
		return
	}

	value, err := ioutil.ReadAll(r.Body)
	if err != nil {
		writeInternalError(w, "Could not read body", http.StatusInternalServerError)
		return
	}

	log.Printf("Configuration updated: [%v] %v=%v", string(serviceID), string(keyID), string(value))
}
