const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    }
}, { _id : false })

const listSchema = new mongoose.Schema({
    //Title, items
    title: {
        type: String,
        required: true
    },
    items: [itemSchema] 
})

listSchema.virtual('completion').get(function() {  //Virtual field, generates how many items are checked and how many items does list contain
    obj = {}
    obj.total = this.items.length
    obj.checked = this.items.filter(function(el) {
        return el.checked
    }).length
    return obj
})

listSchema.set('toObject', { virtuals: true });
listSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ToDoList', listSchema)