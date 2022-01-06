const router = require("express").Router()
const Workspace = require("../models/Workspace")
const ToDoList = require("../models/ToDoList")
const mongoose = require("mongoose")

//Middleware
const { authUser } = require("../private/middlewares/users")
const { checkExistence, checkPermission, validateList } = require("../private/middlewares/todolists")

//API calls --------------

//Get JSON without unnecessary parameters
router.get("/todolists/:id/json", authUser, checkExistence, checkPermission, async (req, res) => {
    try{
        const list = await ToDoList.findById(req.params.id, '-_id -__v').lean() //Try getting list
        return res.json({
            status: "success",
            data: list
        })

    }catch(err) {
        console.log(err)
        res.json({
            status: "error",
            error: "Ran into error while exporting list"
        })
    }
})

//Add list via import
router.post("/api/todolists/import", validateList, authUser, async (req, res) => {
    try{
        //Save list
        const newList = new ToDoList(req.body)
        const saved = await newList.save()
        
        if(!saved) { //Couldnt save list
            return res.json({
                status: "error",
                error: "Ran into error while saving list"
            })
        }
        //Add to workspace
        const updatedWorkspace = await Workspace.findByIdAndUpdate(req.workspace_id,{
            $push: {
                lists: saved._id //Add reference to created list to workspace
            }
        })

        if(!updatedWorkspace) { //Coulnt update workspace
            return res.json({
                status: "error",
                error: "Ran into error while saving list"
            })
        }

        return res.json({
            status: "success",
            data: "Successfully imported list"
        })

    }catch(err) {
        console.log(err)
    }
})

//Update list items and title
router.put("/api/todolists/:id",validateList, authUser, checkExistence, async (req, res) => {
    try {
        const list = await ToDoList.findById(req.params.id)  //Try finding list
        list.items = req.body.items  //Update items
        list.title = req.body.title  //Update title
        const updated = await list.save()  //Try saving

        return res.json({
            status: "success",
            data: updated
        })
    }catch(err) {
        console.log(err)
        res.json({
            status: "error",
            error: err.message
        })
    }
})

//Delete list
router.delete("/api/todolists/:id", authUser, checkExistence, checkPermission, async (req, res) => {
    try{

        const list = await ToDoList.findOneAndRemove({_id: req.params.id}) //Try finding and removing list

        if(!list) {  //Couldnt remove list
            return res.json({
                status: "error",
                error: "Ran into error while deleting list"
            })
        }

        //Try removing reference from workspace
        await Workspace.findOneAndUpdate({"lists": new mongoose.mongo.ObjectId(req.params.id)},{
            $pullAll: {
                lists: [req.params.id]
            }
        })

        return res.json({
            status: "success",
            data: "Successfully deleted list"
        })

    }catch(err) {
        console.log(err)
        res.json({
            status: "error",
            error: "Ran into error while deleting list"
        })
    }
})

module.exports = router