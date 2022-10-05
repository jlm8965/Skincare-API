//////////////////////////////////////////////
/// Our schme and model for the skincare resource
///////////////////////////////////////////////

//import mongoose again
const mongoose = require('./connection') 

//we're going to pull the Schema and model from mongoose
//we'll use a syntax called "destructuring"
//pulling Schema (which is a class) and a model (which is a function) out of mongoose
//you can use a class like a function

const {Schema, model} = mongoose

//view = the information you're getting back from a request to the server
//sometimes it's going to be JSON, sometimes HTML in a browser. 


//skincare products schema 
//making a new instance of the class Schema
//passing in an object as an argument
//our database is going to hold a collection of skincare products documents
//SCHEMA SETS THE RULES 
const skincareSchema = new Schema({
    name: String, 
    formulation: String, 
    whitecast: Boolean

}) 

//make the skincare model
//MODEL MAKES IT HAPPEN 
//turning schema into a model
//calling the model method
//the model method takes two arguments: the first is what we wil call our model
//the second is what we will use to build the model 
const Skincare = model("Skincare", skincareSchema)


//////////////////////////////////////////////
/// Export the model
///////////////////////////////////////////////
module.exports = Skincare