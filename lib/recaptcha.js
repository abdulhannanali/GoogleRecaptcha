const request = require("request")

const SERVER_ENDPOINT = "https://www.google.com/recaptcha/api/siteverify"

function ReCaptcha (secret) {
    if (!secret) {
        throw new Error("Secret is required for the ReCaptcha to work")
    }
    else {
        this.secret = secret
    }
    
    this.verify = (response, remoteip, cb) => {
        if (!response) {
            cb(new Error("Complete list of arguments not provided"))
        }
        else {
            request.post({
                url: SERVER_ENDPOINT,
                form: {
                    secret: this.secret,
                    response: response,
                    remoteip: remoteip || undefined
                }
            }, (error, res, body) => {
             console.log(res.body)
             if (error) {
                cb(error)   
             }
            else {
                cb(undefined, JSON.parse(res.body))
             }
            })    
        }
        
        
    }
}

module.exports = ReCaptcha