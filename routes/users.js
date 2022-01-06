const router = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/User")
const Role = require("../models/Role")
const issueJWT = require("../private/js/issueJWT")

//Middleware
const {
    validateForm, checkUnique, authUser, generalValidation, 
    validateCurrentPassword,validateNewPassword, validateEmail
    } = require("../private/middlewares/users")


// Routes   ------------------

router.get("/profile", authUser, (req, res) => {
    res.render("users/profile.ejs")
})


// API calls ------------------

//Get user
router.get("/users/:id", authUser, async (req, res) => {
    try{
        if(req.params.id == req.user.sub) {
            const user = await User.findById(req.params.id)
            return res.json({
                status: "success",
                data: {
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    avatar: user.avatarPath,
                    _id: user._id
                }
            })
        }else {
            return res.json({
                status: "error",
                error: "Unauthorized access"
            })
        }
    }catch(err) {
        console.log(err)
        res.json({
            status: "error",
            error: "Ran into error.."
        })
    }
})

//Login
router.post("/users/login", validateForm('login'), async (req, res, next) => {
    try {
        User.findOne({email: req.body.log_email}).then(async (user) => {
            if(!user) {
                return res.status(401).json({
                    status: 'error',
                    error: 'Email or password is invalid'
                })
            }
    
            const validPassword = await bcrypt.compare(req.body.log_password, user.password)
    
            if(validPassword) {
                issueJWT.issueJWT(user).then((data => {
                    res.json({
                        status: 'success',
                        data: {
                            token: data.token,
                            expiresIn: data.expires,
                            user_data: {
                                username: user.name,
                                usersurname: user.surname,
                                email: user.email,
                                avatar: user.avatarPath,
                                _id: user._id
                            }
                        }
                    })
                }))
                
            }else {
                res.json({
                    status: 'error',
                    error: 'Email or password is invalid'
                })
            }
        })
    
    }catch(error) {
        return res.json({
            status: 'error',
            error: `| Fatal | : ${error}`
        })
    }
})


//Register
router.post("/users/register", validateForm('register'), checkUnique , async (req, res, next) => {
    
    //Already validated and unique user
    try {

        const role = await Role.findOne({name: "User"})
        const salt = await bcrypt.genSalt(10)
        const hashedPWD = await bcrypt.hash(req.body.reg_password, salt)
        const avatarType = "image/png"
        const avatarData = process.env.AVATAR_BASE

        const newUser = new User({
            name: req.body.reg_name,
            surname: req.body.reg_surname,
            email: req.body.reg_email,
            role: role._id,
            password: hashedPWD,
            avatarType: avatarType,
            avatar: new Buffer.from(avatarData, "base64")
        })

        newUser.save().then(async (user) => {
            const jwt = await issueJWT.issueJWT(user)
            
            return res.json({
                status: 'success',
                data: {
                    token: jwt.token,
                    expiresIn: jwt.expires,
                    user_data: {
                        username: user.name,
                        usersurname: user.surname,
                        email: user.email,
                        avatar: user.avatarPath,
                        _id: user._id
                    }
                }
            })
        })
    }catch(err) {
        res.json({
            status: 'error',
            error: `Fatal error: ${err}`,
            user: req.body
        })
    } 
})

//Update avatar & credentials
router.put("/users/:id/generalData", generalValidation, authUser, async (req, res) => {
    if(req.params.id != req.user.sub) {
        return res.json({
            status: "error",
            error: "Unauthorized Access"
        })
    }

    //validate avatar
    var imgType = req.body.avatar.split("data:")[1].split(";")[0]
    var imgData = req.body.avatar.split(";base64,")[1]
    
    const allowed = ["image/jpg", "image/jpeg", "image/png", "image/gif"]

    if ( !allowed.includes(imgType) ) {
        return res.json({
            status: "error",
            error: "Upload only images"
        })
    }

    //User is valid
    try{
        const usr = await User.findById(req.params.id)

        usr.name = req.body.name
        usr.surname = req.body.surname
        usr.email = req.body.email
        usr.avatarType = imgType
        usr.avatar = new Buffer.from(imgData, "base64")

        //Try updating
        await usr.save()

        return res.json({
            status: "Success",
            data: {
                username: usr.name,
                usersurname: usr.surname,
                email: usr.email,
                avatar: usr.avatarPath,
                _id: usr._id
            }
        })

    }catch(err) {
        console.log(err)
        res.json({
            status: "error",
            error: "Ran into error while updating.."
        })
    }



})

//Update password
router.put("/users/:id/password", authUser, validateCurrentPassword, validateNewPassword, async (req, res) => {
    try {
        const user = await User.findById(req.user.sub)
        const salt = await bcrypt.genSalt(10)
        const hashedPWD = await bcrypt.hash(req.body.newPassword, salt)
        user.password = hashedPWD

        user.save()
        
        res.json({
            status: "success",
            data: "Successfully updated password"
        })

    }catch(err) {
        console.log(err)
        res.json({
            status: "error",
            error: "Ran into error while updating password.."
        })
    }
})

//Update email
router.put("/users/:id/email", authUser, validateCurrentPassword, validateEmail, async (req, res) => {
    try{
        const user = await User.findById(req.params.id, "-password")

        user.email = req.body.newEmail
        user.save()
        return res.json({
            status: "success",
            data: {
                username: user.name,
                usersurname: user.surname,
                email: user.name,
                avatar: user.avatarPath,
                _id: user._id
            }
        })

    }catch(err) {
        console.log(err)
        return res.json({
            status: "error",
            error: "Ran into error while updating email.."
        })
    }
})

module.exports = router