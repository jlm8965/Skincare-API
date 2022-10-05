/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express


//const morgan = require("morgan") // import morgan
//const mongoose = require("mongoose") // import mongoose
const path = require("path") // import path module

const SkincareRouter = require('./controllers/skincareControllers')
const UserRouter = require('./controllers/userControllers')
const middleware = require('./utils/middleware')

/////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////
const app = express()

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
// middleware runs before all the routes, every request is processed through our middleware before mongoose does anything with it.
// our middleware is now being passed through a function in the utils directory
// the middleware function takes one argument, an app, and processes the middleware on that argument(which is our app)
middleware(app)


/////////////////////////////////////////////
// Home Route
/////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("Your server is running, better go out and catch it")
    // you can also send html as a string from res.send
    // res.send("<small style='color: red'>Your server is running, better go out and catch it</small>")
})

/////////////////////////////////////////////
// Register our Routes
/////////////////////////////////////////////
// here is where we register our routes, this is how server.js knows to send the appropriate request to the appropriate route and send the correct response
// app.use, when we register a route, needs two arguments
// the first, is the base url endpoint, the second is the file to use
app.use('/skincare', SkincareRouter)
app.use('/users', UserRouter)

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))

// END //////

/////////////////////////////////////////////
// Import Our Models
/////////////////////////////////////////////

const Skincare = require('./models/skincare')

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// this is where we will set up our inputs for our database connect function
const DATABASE_URL = process.env.DATABASE_URL
// here is our DB config object
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// establish our connection
mongoose.connect(DATABASE_URL, CONFIG)

// tell mongoose what to do with certain events
// opens, disconnects, errors
mongoose.connection
    .on("open", () => console.log("Connected to Mongoose"))
    .on("close", () => console.log("Disconnected from Mongoose"))
    .on("error", (error) => console.log("An error occurred: \n", error))

/////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////
const app = express()

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
// middleware runs before all the routes, every request is processed through our middleware before mongoose does anything with it.
app.use(morgan("tiny")) // This is for request logging, the "tiny" argument declares what size of morgan log to use.
app.use(express.urlencoded({ extended: true })) // this parses urlEncoded request bodies(useful for POST and PUT requests)
app.use(express.static("public")) // serve files from the public folder statically
app.use(express.json()) // parses incoming request payloads with JSON

/////////////////////////////////////////////
// Routes
/////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("Your server is running, better go out and catch it")
})


//Here, we're going to set up a seed route. 
//this will seed our database for us, so we have some starting resources
//there are two ways we're going to talk about seeding a db
//first = routes. They work, but they're not best practices. 
//second = seed scriptS. BEST PRACTICE. 

app.get("/skincare", (req, res) => {
    //array of sunscreens
    const startFruits = [
        { name: "Shiseido Clear Sunscreen Stick", formulation: "chemical", whiteCast: false },
        { name: "Skin Aqua Super Moisture Gel ", formulation: "chemical", whiteCast: false },
        { name: "Biore Aqua Rich Watery Essense", formulation: "chemical", whiteCast: false },
        { name: "Etude House Surprise Mild Airy Finish Sun Milk", formulation: "physical", whiteCast: true },
        { name: "Missha Waterproof Sun Milk", formulation: "physical", whiteCast: true},
      ]

      //Delete every sunscreen in the db
      Skincare.deleteMany({})
        .then(() => {
            //seed with the starter skincare array
            Skincare.create(startSkincares)
                .then(data => {
                    res.json(data)
                })

        })
})

//GET REQUEST FROM EXPRESS APP OBJECT
//index route -> shows all instances of a document in the db
app.get("/skincare", (req, res) => {
    //in our index route, we want to use MONGOOSE model methods to get our data. This interacts with the database. 
    //.find returns an array of the objects
    Skincare.find({}) 
        .then(skincare => {
            //res.send(skincare)
            //this is the preferred method for APIs
            res.json({skincare: skincare})
        })
        .catch(err => console.log(err))
})

//POST request
//create route -> gives the ability to create new skincare products 
app.post("/skincare", (req, res) => {
    //here we'll get something called a request body
    //inside this function, that will be referred to as req.body
    //we'll use the mongoose model method `create` to make a new skincare product
    Skincare.create(req.body)
        .then(skincare => {
            //send the user a '201 created' response, along w/ the new skincare product
            res.status(201).json({skincare: skincare.toObject()})
        })
        .catch(error => console.log(error))
})

///PUT request
//update route -> updates a specific skincare product
app.put("/skincare/:id", (req, res) => {
    console.log("I hit the update route", req.params.id)
    const id = req.params.id

    //for now, we'll use a single mongoose model method, eventually we'll update this (and all) routes and we'll use a different method
    //res.send("nothing yet, but we're getting there")
    //find by ID and update needs three arguments: 
    // 1.) ID
    // 2.) request body
    // 3.) whether the info is new
    Fruit.findByIdAndUpdate(id, req.body, {new:true})
        .then(skincare => {
            console.log('the skincare product from update', fruit)
            //update success is called '204 - no content'
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

////DELETE request
app.delete("/skincare/:id", (req, res) => {
    //grab the id from the request
    const id = req.params.id
    //find and delete the skincare product
    Fruit.findByIdAndRemove(id)
         //send a 204 if successful
        .then(fruit => {
            res.sendStatus(204)
        })
        //send the error if not
        .catch(err => res.json(err))
     
})

//SHOW request
//read route -> finds and displays a single resource
app.get("/skincare/:id", (req, res) => {
    //grab id from the request
    const id = req.params.id
    //find and show the skincare product
    Skincare.findById(id)
    //send a 204 if successful
    .then(skincare => {
        res.json({skincare: skincare})
    })
    //send the error if not
    .catch(err => res.json(err))
})

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))

// END//