const mongoose = require('mongoose')

const Schema = mongoose.Schema

const dataSchema = new Schema({

    name: {
        type: String,
    },
    email:{
           type:String
    },
    phone_number:{
        type:String
    },
    requirements:{
         type:String
    }
},
{
    timestamps: true
})

const dataModel = mongoose.model('dataModel', dataSchema)
module.exports = dataModel