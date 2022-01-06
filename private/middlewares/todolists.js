const ToDoList = require("../../models/ToDoList")
const Workspace = require("../../models/Workspace")
const validate = require("../js/logic/validate")
const mongoose = require("mongoose")

const checkExistence = async (req, res, next) => {
    //Check whether ID param is object or not
    if(!mongoose.Types.ObjectId.isValid(req.params.id) ||req.params.id == 'undefined') {
        return res.json({
            status: "error",
            error: "Ran into error while deleting list"
        })
    }
    try {
        //Get list
        const list = await ToDoList.findById(req.params.id)

        if(!list) { //Couldnt find list
            return res.json({
                status: 'error',
                error: 'Ran into error while processing.. try again later'
            })
        }
        req.list = list
        next()
    }catch(err) {
        return res.json({
            status: 'error',
            error: 'Ran into error while processing.. try again later'           
        })
    }
}

const checkPermission = async (req, res, next) => {
    //User already added to req, list already added to req
    try {
        //Get workspaces where user is author
        const userWorkspace = await Workspace.find({"lists": new mongoose.mongo.ObjectId(req.params.id), author: req.user.sub})
        //Try to find if list is present in workspaces and author is logged user
        if(!userWorkspace) {
            return res.json({
                status: 'error',
                error: 'You are not the owner of workspace'
            })
        }
        next()
    }catch(err) {
        return res.json({
            status: 'error',
            error: 'Ran into error.. try again later'
        })
    }
}

const validateList = async (req, res, next) => {
    let error
    if(("workspace_id" in req.body)){
        req.workspace_id = req.body.workspace_id
        delete req.body["workspace_id"]
        error = validate.listValidation(req.body).error
    }else {
        error = validate.listValidation(req.body).error
    }

    if(error) {
        return res.json({
            status: "error",
            error: error.details[0].message
        })
    }
    next()
}

module.exports.checkExistence = checkExistence
module.exports.checkPermission = checkPermission
module.exports.validateList = validateList