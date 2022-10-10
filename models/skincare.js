///////////////////////////////////////////////////////////
// Our schema and model for the fruit resource
///////////////////////////////////////////////////////////
// this is the old mongoose import
// const mongoose = require("mongoose") // import mongoose
const mongoose = require('./connection')
const User = require('./user')

// here we'll import our commentSchema
const commentSchema = require('./comment')

// we're going to pull the Schema and model from mongoose
// we'll use a syntax called "destructuring"
const { Schema, model } = mongoose

// fruits schema
const skincareSchema = new Schema({
    name: String,
    formulation: String,
    whiteCast: Boolean,
    owner: {
        // here we can refer to an objectId
        // by declaring that as the type
        type: Schema.Types.ObjectId,
        // this line, tells us to refer to the User model
        ref: 'User'
    },
    comments: [commentSchema]
}, { timestamps: true })

// make the SP model
// the model method takes two args
// the first is what we will call our model
// the second is what we will use to build the model
const Skincare = model("Skincare", skincareSchema)

//////////////////////////////////////////////////
// Export our model
//////////////////////////////////////////////////
module.exports = Skincare