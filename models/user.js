//////////////////////////////////////////////
// import our dependencies
//////////////////////////////////////////////
const mongoose = require('./connection')

const {Schema, model } = mongoose

//////////////////////////////////////////////
// define our user schema
//////////////////////////////////////////////
const userSchema = new Schema({
    username: {
        type: String, 
        required: true, 
        unique: true
    }, 
    password: {
        type: String, 
        required: true
    }
})

//makes the model from the speficifications outlined in schema
const User = model("User", userSchema)

//////////////////////////////////////////////
// export our model
//////////////////////////////////////////////

module.exports = User