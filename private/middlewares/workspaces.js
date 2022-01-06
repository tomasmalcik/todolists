const mongoose = require("mongoose")
const validate = require("../js/logic/validate")
const Workspace = require("../../models/Workspace")


const validateWorkspace = (req, res, next) => {
    //Validate workspace
    const {error} = validate.workspaceValidation({title: req.body.title})
    if(error) {
        return res.json({
            status: 'error',
            error: error.details[0].message
        })
    }
    //Check if ID is of objectID type
    if(!mongoose.isValidObjectId(req.body.author))
        return res.json({
            status: 'error',
            error: 'Ran into error, try relogging..'
        })
    next()
}

const checkPermission = async (req, res, next) => {
    //find Workspace
    const workspace = await Workspace.findById(req.params.id)
    if(!workspace) { //Couldnt find workspace
        return res.json({
            status: "error",
            error: "This workspace does not exist"
        })
    }

    //Check if user is owner of workspace
    if( workspace.author.equals(req.user.sub) ) {
        req.workspace = workspace
        next()
    }else { //Not the owner
        return res.json({
            status: "error",
            error: "You do not have permission for this action"
        })
    }
}

const validateLists = async (req, res, next) => {
    if(req.body.lists.length == 0) {  //No list present in workspace
        next()
    }

    for(element of req.body.lists) {
        let {error} = validate.listValidation(element)
        if(error) {
            return res.json({
                status: 'error',
                error: error.details[0].message
            })
        }
    }
    next()
}

module.exports.validateWorkspace = validateWorkspace
module.exports.checkPermission = checkPermission
module.exports.validateLists = validateLists