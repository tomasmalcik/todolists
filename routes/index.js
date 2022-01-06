const router = require("express").Router()
const User = require("../models/User")

//Middleware
const { checkAuth } = require("../private/middlewares/users")

//Routes ------

//Root route
router.get("/", checkAuth, (req, res) => {
    res.render("index.ejs", {
        user: new User()
    })
})

module.exports = router