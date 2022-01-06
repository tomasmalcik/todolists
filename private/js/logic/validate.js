const joi = require("joi")

const registerValidation = (data) => {
    const registerSchema = joi.object({
        reg_name: joi.string().min(2).required()
        .messages({
            'string.min': 'Name should be at least 6 characters long',
            'string.empty': 'Name is required'
        }),
        reg_surname: joi.string().min(2).required()
        .messages({
            'string.min': 'Surname should be at least 6 characters long',
            'string.empty': 'Surname is required'
        }),
        reg_email: joi.string().min(15).required().email()
        .messages({
            'string.min': 'Emails should be at least 6 characters long',
            'string.email': 'Email is invalid',
            'string.empty': 'Email is required'
        }),
        reg_password: joi.string().min(6).required().label("Password")
        .messages({
            'string.min': 'Password should be at least 6 characters long',
            'string.empty': 'Password is required'
        }),
        reg_password2: joi.any().equal(joi.ref('reg_password')).required().label("Confirm password").messages({
            'any.only': 'Password dont match'
         })
    })
    return registerSchema.validate(data)
}

const loginValidation = (data) => {
    const registerSchema = joi.object({
        log_email: joi.string().min(6).required().email().messages({
            'string.email': 'Enter email in the correct form (a@b.com)',
            'string.min': 'Email should be at least 6 characters long',
          }),
        log_password: joi.string().min(6).required().messages({
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password is at least 6 characters long'
        })

    })
    return registerSchema.validate(data, {abortEarly: false})
}

const workspaceValidation = (data) => {
    const workSchema = joi.object({
        title: joi.string().min(3).required().messages({
            'string.min': 'Title should be at least 3 characters long',
            'string.empty': 'Title cannot be empty'
        })
    })
    return workSchema.validate(data, {abortEarly: false})
}

const listValidation = (data) => {
    const listSchema = joi.object({
        title: joi.string().min(3).required().messages({
            'string.min': 'Title should be at least 3 characters long',
            'string.empty': 'Title cannot be empty'
        })
    })

    const result = listSchema.validate({title: data.title})

    if (result.error) {  //If there is issue with title
        return result
    }

    if(!data.items) { //If list has no items
        return result
    }

    //Validate items
    const itemSchema = joi.object({
        text: joi.string().min(3).required().messages({
            'string.min': 'Title should be at least 3 characters long',
            'string.empty': 'Title cannot be empty'           
        }),
        checked: joi.alternatives().try(joi.string(), joi.boolean()).required()
    })

    for(element of data.items) {
        res = itemSchema.validate(element)
        if(res.error) {
            return res
        }
    }
    return result
}

const validateGeneral = (data) => {
    const generalSchema = joi.object({
        name: joi.string().min(2).required().messages({
            "string.min": "Name should be at least 2 Characters long",
            "string.empty": "Name cannot be empty"
        }),
        surname: joi.string().min(2).required().messages({
            "string.min": "Surname should be at least 2 Characters long",
            "string.empty": "Surname cannot be empty"
        }),
        email: joi.string().email().min(15).required().messages({
            "string.email": "Email has to be valid",
            "string.min": "Name should be at least 2 Characters long",
            "string.empty": "Name cannot be empty"
        }),
        avatar: joi.allow()
    })

    return generalSchema.validate(data, {abortEarly: false})
}

const newPasswordValidate = (data) => {
    const newPWDSchema = joi.object({
        currentPassword: joi.allow(),
        newPassword: joi.string().min(6).required().label("Password")
        .messages({
            'string.min': 'Password should be at least 6 characters long',
            'string.empty': 'Password is required'
        }),
        newPassword2: joi.any().equal(joi.ref('newPassword')).required().label("Confirm password").messages({
            'any.only': 'Password dont match'
         })
    })

    return newPWDSchema.validate(data, {abortEarly: false})
}

const emailValidation = (data) => {
    emailSchema = joi.object({
        currentPassword: joi.allow(),
        newEmail: joi.string().email().min(15).required().messages({
            "string.min": "Email should be at least 15 characters long",
            "string.empty": "Email cannot be empty",
            "string.email": "Email has to be valid (aa@bb.cc)"
        })
    })

    return emailSchema.validate(data, {abortEarly: false})
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.workspaceValidation = workspaceValidation
module.exports.listValidation = listValidation
module.exports.validateGeneral = validateGeneral
module.exports.newPasswordValidate = newPasswordValidate
module.exports.emailValidation = emailValidation