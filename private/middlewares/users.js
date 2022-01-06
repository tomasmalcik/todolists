const validate = require("../js/logic/validate")
const jwt = require("jsonwebtoken")
const User = require("../../models/User")
const bcrypt = require("bcrypt")

const authUser = (req, res, next) => {

    if (req.cookies.token) {
        const token = req.cookies.token
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.redirect("/")
            }

            req.user = user;
            next();
        });
    } else {
        res.redirect("/")
    }

}

const validateForm = form_type => {
    return (req, res, next) => {
        if(form_type == 'register') {
            const {error} = validate.registerValidation(req.body)
            if (error) {
                return res.json({
                    status: 'error',
                    error: error.details[0].message
                })
            }
            next()         
        }else if(form_type == 'login') {
            const {error} = validate.loginValidation(req.body)
            if(error) {
                return res.json({
                    status: 'error',
                    error: error.details[0].message
                })
            }
            next()
        }else {
            next()
        }
    }
}

const checkUnique = async (req, res, next) => {
    try{
        const emailExists = await User.findOne({email: req.body.reg_email})
        if(emailExists) {
            res.json({
                status: 'error',
                error: 'User with that email already exists',
                user: req.body
            })
                      
        }
        next()
    }catch(err) {
        res.json({
            status: 'error',
            error: 'There was a fatal error, try again later',
            user: req.body
        })
    }
}

const generalValidation = (req, res, next) => {
    const {error} = validate.validateGeneral(req.body)
    if(error) {
        return res.json({
            status: "error",
            error: error.details[0].message
        })
    }

    next()
}

const validateCurrentPassword = async (req, res, next) => {
    const user = await User.findById(req.user.sub)
    if(req.params.id != req.user.sub) {
        return res.json({
            status: "error",
            error: "Unauthorized access"
        })
    }
    const validPassword = await bcrypt.compare(req.body.currentPassword, user.password)
    if(!validPassword) {
        return res.json({
            status: "error",
            error: "Current password is invalid"
        })
    }

    next()
}

const validateNewPassword = (req, res, next) => {
    const { error } = validate.newPasswordValidate(req.body)

    if(error) {
        return res.json({
            status: "error",
            error: error.details[0].message
        })
    }

    next()
}

const validateEmail = (req, res, next) => {
    const {error} = validate.emailValidation(req.body)
    if(error) {
        return res.json({
            status: "error",
            error: error.details[0].message
        })
    }

    next()
}

const checkAuth = (req, res, next) => {
    if (req.cookies.token) { //Get token from cookies
        const token = req.cookies.token
        jwt.verify(token, process.env.TOKEN_SECRET, (err) => { //Verify whether the token is valid
            if (!err) { //Logged in
                return res.redirect("/workspaces")
            }
            next(); //Not logged in
        });
    } else { //Token does not exist
        next()
    }
}

module.exports.authUser = authUser
module.exports.validateForm = validateForm
module.exports.checkUnique = checkUnique
module.exports.generalValidation = generalValidation
module.exports.validateCurrentPassword = validateCurrentPassword
module.exports.validateNewPassword = validateNewPassword
module.exports.validateEmail = validateEmail
module.exports.checkAuth = checkAuth