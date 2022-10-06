////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Skincare = require("../models/skincare")
const Fruit = require("../models/skincare")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// Here, we're going to set up a seed route
// this will seed our database for us, so we have some starting resources
// there are two ways we're going to talk about seeding a db
// routes -> they work, but they're not best practices
// seed scripts -> they work, and they are best practices
router.get("/seed", (req, res) => {
    // array of starter skincare products
    const startSkincare = [
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
         Skincare.create(startSkincare)
             .then(data => {
                 res.json(data)
             })

     })
})

//GET REQUEST FROM EXPRESS APP OBJECT
//index route -> shows all instances of a document in the db
router.get("/", (req, res) => {
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

// create -> POST
router.post('/', (req, res) => {

    // we're ready for mongoose to do its thing
    // now that we have user specific fruits, 
    // we'll add the owner to the fruit from the request body.
    // Since we've stored the id of the user in the session object, we can use it to set the owner property of the fruit upon creation.
    req.body.owner = req.session.userId
    console.log('this is req.body before adding owner', req.body)
    Skincare.create(req.body)
      .then((skincare) => {
        console.log('this was returned from create', skincare)
        res.status(201).json({ skincare: skincare.toObject() })
      })
      .catch((err) => {
        console.log(err)
        res.json({ err })
      })
  })

///PUT request
//update route -> updates a specific skincare product
router.put("/:id", (req, res) => {
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
            console.log('the skincare product from update', skincare)
            //update success is called '204 - no content'
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

// DELETE request
// destroy route -> finds and deletes a single resource(fruit)
router.delete("/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    // find and delete the skincare product
    Skincare.findByIdAndRemove(id)
        // send a 204 if successful
        .then(() => {
            res.sendStatus(204)
        })
        // send the error if not
        .catch(err => res.json(err))
})

//SHOW request
//read route -> finds and displays a single resource
router.get("/:id", (req, res) => {
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

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router