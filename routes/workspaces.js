const router = require("express").Router()
const Workspace = require("../models/Workspace")
const ToDoList = require("../models/ToDoList")

//Middleware
const { authUser } = require("../private/middlewares/users")
const { validateList } = require("../private/middlewares/todolists")
const { validateWorkspace, checkPermission, validateLists } = require("../private/middlewares/workspaces")


// Routes ------------

//Workspaces
router.get("/workspaces", authUser, (req, res) => {
    res.render("app/workspaces.ejs")
})

//Workspace
router.get("/workspaces/:id", authUser, (req, res) => {
    res.render("app/workspace.ejs")
})


// API Calls ------------

//Get all workspaces of user
router.get("/api/workspaces", authUser, async (req, res) => {
    //get workspaces where user is author
    try {
        const find = await Workspace.find({author: req.user.sub})
        return res.json({
            status: 'success',
            data: find,
            uid: req.user.sub
        })
    }catch(err) {

    }
})

//Get export data - also route
router.get("/workspaces/:id/json", authUser, checkPermission, async (req, res) => {
    try {
        //Get workspace without all unnecessary parameters, insert all list data
        const workspace = await Workspace.findById(req.params.id, '-_id -createdAt -__v -author').populate("lists").lean().exec()
        //Remove unnecessary parameters from lists
        workspace.lists.forEach(el => {
            delete el["_id"]
            delete el["__v"]
        })
        res.json(workspace)
    }catch(err) {
        console.log(err)
        res.send("Error")
    }
})

//Get full workspace
router.get("/api/workspaces/:id", authUser, checkPermission, async (req, res) => {
    try{
        //Get full workspace with all parameters
        const fullWorkspace = await Workspace.findById(req.params.id).populate("lists").exec()
        res.json({
            status: "success",
            data: fullWorkspace
        })

    }catch(err) {
        console.log(err)
        res.json({
            status: "error",
            error: err.message
        })
    }
})

//Add workspace
router.post("/api/workspaces", authUser, validateWorkspace, async (req, res) => {
    await saveWorkspace(res, req.body)
})

//Import JSON
router.post("/api/workspaces/import", authUser, validateWorkspace, validateLists, async (req, res) => {
    try{
        //First add workspace
        const workspace = new Workspace({
            title: req.body.title,
            author: req.user.sub,
            description: req.body.description
        })

        const savedWorkspace = await workspace.save()

        //Now add Lists
        for(let i = 0; i < req.body.lists.length; i++) {
            const err = await updateImportWorkspace(req.body.lists[i], savedWorkspace._id, res)
            if (err)
                return
        }

        return res.json({
            status: 'success',
            data: 'Successfully imported workspace'
        })
    }catch(err) {
        return res.json({
            status: 'error',
            error: 'Ran into error while importing workspace'
        })
    }     
})

//Add list to workspace
router.put("/api/workspaces/:id/addList",authUser, validateList, async (req, res) => {
    await addList(req, req.body, res)
})

//Edit workspace
router.put("/api/workspaces/:id", authUser, validateWorkspace, async (req, res) => {
    let workspace
    try {
        //Find workspace by req.param
        workspace = await Workspace.findById(req.params.id)
        workspace.title = req.body.title //Update title
        workspace.description = req.body.description //Update description
        await workspace.save() //Try saving

        return res.json({
            status: 'success',
            data: 'Successfully updated workspace'
        })
    }catch(err) {
        console.log(err)
        res.json({
            status: 'error',
            error: 'Ran into error while updating workspace..'
        })
    }
})

//Delete workspace @TODO - try catch
router.delete("/api/workspaces/:id", authUser, checkPermission, async (req, res) => {
    //Delete all lists saved in workspace
    for(const list_id of req.workspace.lists) {
        let list = await ToDoList.findById(list_id)
        if(list) {
            await list.remove()
        }
    }
    const result = await req.workspace.remove()
    if(result) {
        return res.json({
            status: "success",
            data: "Workspace successfully deleted"
        })
    }
    res.json({
        status: "error",
        data: "Could not delete workspace"
    })
})



//Utility functions
async function removeList(list) {
    //Check if list is really not present in any workspace
    const workspace = Workspace.find({"lists": list._id})
    if(workspace)
        return //If list is present in some workspace, then return
    
    //Remove list, that is not present in any subarray
    list.remove()
}

async function saveWorkspace(res, workspace) {
    try {

        const newWorkspace = new Workspace(workspace)
        const saved = await newWorkspace.save()

        res.json({
            status: "success",
            data: "Workspace successfully added"
        })

    }catch(err) {
        res.json({
            status: "error",
            error: err.message
        })
    }
}

async function addList(req, list, res) {
      
    try {

        const newList = new ToDoList(list)
        const savedList = await newList.save()  //Try saving list

        if(!savedList) {
            return res.json({
                status: "error",
                error: "Ran into error while saving.. Try again later."
            })
        }

        //Update workspace
        const updatedWorkspace = await Workspace.findByIdAndUpdate({_id: req.params.id},
            {
                $push: {lists: savedList._id}
            })
        if(!updatedWorkspace) {
            removeList(savedList)
            return res.json({
                status: "error",
                error: "Ran into error while saving.. Try again later."
            })
        }

        return res.json({
            status: "success",
            data: savedList
        })

    }catch(err) {
        res.json({
            status: "error",
            error: `Ran into error. Please try again later`
        })
    }
}

async function updateImportWorkspace(list, id, res) {
    try{
        const newList = new ToDoList(list)      //Create list
        const savedList = await newList.save()  //Try saving list

        if(!savedList) {
            return res.json({
                status: "error",
                error: "Ran into error while saving.. Try again later."
            })
        }

        //Update workspace
        const updatedWorkspace = await Workspace.findByIdAndUpdate({_id: id},
            {
                $push: {lists: savedList._id} //Add list to references
            })
        if(!updatedWorkspace) { //Failed updating
            removeList(savedList) //Remove list that was created
            return res.json({
                status: "error",
                error: "Ran into error while saving.. Try again later."
            })
        }      

    }catch(err) {
        return res.json({
            status: 'error',
            error: err.message
        })
    }
}

module.exports = router