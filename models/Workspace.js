const mongoose = require("mongoose")

const workspaceSchema = mongoose.Schema({
    title: {
        type: String,
        min: 3,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: {
        type: String,
        required: false
    },
    lists: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ToDoList'
        }],
        required: false,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Workspace', workspaceSchema)