const express = require("express")
const morgan = require("morgan")
const path = require("path")
const bodyParser = require("body-parser")

const ReCaptcha = require("./lib/ReCaptcha")


const app = express()

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || "0.0.0.0"
const ENV = process.env.NODE_ENV || "development"

if (ENV == "development") {
    require("./config")
    var MORGAN_ENV = "dev"
}
else if (ENV == "production") {
    var MORGAN_ENV = "combined"
}

app.use(morgan(MORGAN_ENV))
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use("/assets", express.static(path.join(__dirname, "assets")))

app.use(bodyParser.urlencoded({
    extended: true
}))


captcha = new ReCaptcha(process.env["RECAPTCHA_SECRET_KEY"])



app.get("/", (req, res, next) => {
    res.render("index", {})
})

app.get("/verify", (req, res, next) => {
    res.redirect("/")
})

app.post("/verify", (req, res, next) => {
   captcha.verify(req.body["g-recaptcha-response"], req.ip, function (error, response) {
       if (error) {
           next(error)
       }
       else {
           if (response.success) {
                res.render("success", {
                    response: response,
                    ip: req.ip,
                    gCaptchaResponse: req.body["g-recaptcha-response"]
                })
           }
           else if (response.error) {
               res.render("error", {
                   response: response,
                   ip: req.ip,
                   gCaptchaResponse: req.body["g-captcha-response"]
               })
           }
           else {
               next(new Error("Unknown error occured!"))
           }
       }
   }) 
})

app.listen(PORT, HOST, (error) => {
    if (error) {
        console.log("Error occured while listening to")
        console.log(`PORT ${PORt}`)
        console.log(`HOST ${HOST}`)
    }
    else {
        console.log(`Server is listening on HOST: ${HOST} PORT: ${PORT}`)
    }
})

