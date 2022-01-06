if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const striptags = require("striptags")
const cookieParser = require('cookie-parser')


//Routes
const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")
const workspacesRouter = require("./routes/workspaces")
const todolistsRouter = require("./routes/todolists")

//app sets
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", __dirname + "/views/layouts/layout")
app.set('trust proxy', 1);

//app uses
app.use(expressLayouts)
app.use(express.static("private"))
app.use(express.json({limit: "50mb"}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}))

app.use ((req, res, next) => {  //Add url to response (checking in ejs layout where is client located)
    res.locals.url = req.originalUrl;
    res.locals.host = req.get('host');
    res.locals.protocol = req.protocol;
    next();
});

app.use((req, res, next) => { //XSS protection.
    //Iterate through the whole request body using recursion
    function recurse(obj) {
        for (const key in obj) { 
            let value = obj[key];
            if(value != undefined) {
                if (value && typeof value === 'object') { //Another document, start recursion again
                    recurse(value, key);
                }else if(typeof value === 'boolean') { //Ignore boolean values
                    continue
                }else {
                    obj[key] = striptags(obj[key]) //Strip tags from string in req.body
                }
            }
        }
    }
    recurse(req.body);
    next() 
})


//Connect to db
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () => {
    console.log("Connected to DB")
})

//Routes middleware
app.use(indexRouter)
app.use(usersRouter)
app.use(workspacesRouter)
app.use(todolistsRouter)

//Listen on port 3000 on dev or some port in production
app.listen(process.env.PORT || 3000)
