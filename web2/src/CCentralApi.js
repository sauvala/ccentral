import axios from "axios"

export default class CCentralApi  {

    constructor() {
        this.errorListener = []
        this.uri = "http://localhost:3000/api"
        axios.defaults.baseURL = this.uri;
    }

    setToken = (token) => {
        axios.defaults.headers.common['X-TOKEN'] = token;
    }

    addErrorListener = (listener) => {
        this.errorListener.push(listener)
    }

    handleError = (error, cb) => {
        this.errorListener.forEach(element => {
            let data = { error: "Yikes", message: "Unknown error" }
            try {
                data['error'] = error.response.data.error
                data['message'] = error.response.data.message
            } catch (err) {
                console.log("Unhandled error type", err)
            }
            element(data)
        });
        console.log(error)
        if (cb !== undefined) {
            cb(null)
        }
    }

    getService = (serviceId, cb) => {
        axios.get("/1/services/" + serviceId).then((response) => {
            cb(response.data)
        }).catch((error) => {
            this.handleError(error, cb)
        })
    }
 
    getServices = (cb) => {
        axios.get("/1/services").then((response) => {
            cb(response.data)
        }).catch((error) => {
            this.handleError(error, cb)
        })
    }
}
