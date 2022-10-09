/////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Skincare = require("../models/skincare")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// GET request
// index route -> shows all instances of a document in the db
router.get("/", (req, res) => {
    // console.log("this is the request", req)
    // in our index route, we want to use mongoose model methods to get our data
    Skincare.find({})
        .populate("comments.author", "username")
        .then(skincareProducts => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // console.log(skincareProducts)
            // this is fine for initial testing
            // res.send(skincareProducts)
            // this the preferred method for APIs
            // res.json({ skincareProducts: skincareProducts })
            // here, we're going to render a page, but we can also send data that we got from the database to that liquid page for rendering
            res.render('skincareProducts/index', { skincareProducts, username, loggedIn, userId })
        })
        .catch(err => console.log(err))
})

// GET for new skincare product
// renders the form to create a skincare product
router.get('/new', (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId

    res.render('skincareProducts/new', { username, loggedIn, userId })
})

// POST request
// create route -> gives the ability to create new skincare products
router.post("/", (req, res) => {
    // bc our checkboxes dont send true or false(which they totally should but whatev)
    // we need to do some js magic to change the value
    // first side of the equals sign says "set this key to be the value"
    // the value comes from the ternary operator, checking the req.body field
    req.body.readyToUse = req.body.readyToUse === 'on' ? true : false
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // this is going to add ownership, via a foreign key reference, to our skincare products
    // basically, all we have to do, is append our request body, with the `owner` field, and set the value to the logged in user's id
    req.body.owner = req.session.userId
    console.log('the skincare product from the form', req.body)
    // we'll use the mongoose model method `create` to make a new skincare product
    Skincare.create(req.body)
        .then(skincare => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // send the user a '201 created' response, along with the new skincare product
            // res.status(201).json({ fruit: fruit.toObject() })
            // res.redirect('/skincareProducts')
            res.render('skincareProducts/show', { skincare, username, loggedIn, userId })
        })
        .catch(error => console.log(error))
})

// GET request
// only skincare products owned by logged in user
// we're going to build another route, that is owner specific, to list all the skincare products owned by a certain(logged in) user
router.get('/mine', (req, res) => {
    // find the skincare products, by ownership
    Skincare.find({ owner: req.session.userId })
    // then display the skincare products
        .then(skincareProducts => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId

            // res.status(200).json({ skincareProducts: skincareProducts})
            res.render('skincareProducts/index', { skincareProducts, username, loggedIn, userId })
        })
    // or throw an error if there is one
        .catch(error => res.json(error))
})

// GET request to show the update page
router.get("/edit/:id", (req, res) => {
    // const username = req.session.username
    // const loggedIn = req.session.loggedIn
    // const userId = req.session.userId
    res.send('edit page')
})

// PUT request
// update route -> updates a specific skincare product
router.put("/:id", (req, res) => {
    // console.log("I hit the update route", req.params.id)
    const id = req.params.id
    Skincare.findById(id)
        .then(skincare => {
            if (skincare.owner == req.session.userId) {
                res.sendStatus(204)
                return skincare.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .catch(error => res.json(error))
})

// DELETE request
// destroy route -> finds and deletes a single resource(skincare product)
// here lies our old API delete route
// router.delete("/:id", (req, res) => {
//     // grab the id from the request
//     const id = req.params.id
//     // find and delete the skincareproduct
//     // Skincare.findByIdAndRemove(id)
//     Skincare.findById(id)
//         .then(skincare => {
//             // we check for ownership against the logged in user's id
//             if (skincare.owner == req.session.userId) {
//                 // if successful, send a status and delete the skincare
//                 res.sendStatus(204)
//                 return skincare.deleteOne()
//             } else {
//                 // if they are not the user, send the unauthorized status
//                 res.sendStatus(401)
//             }
//         })
//         // send the error if not
//         .catch(err => res.json(err))
// })
router.delete('/:id', (req, res) => {
    // get the skincare id
    const skincareId = req.params.id

    // delete and REDIRECT
    Skincare.findByIdAndRemove(skincareId)
        .then(skincare => {
            // if the delete is successful, send the user back to the index page
            res.redirect('/skincareProducts')
        })
        .catch(error => {
            res.json({ error })
        })
})

// SHOW request
// read route -> finds and displays a single resource
router.get("/:id", (req, res) => {
    const id = req.params.id

    Skincare.findById(id)
        // populate will provide more data about the document that is in the specified collection
        // the first arg is the field to populate
        // the second can specify which parts to keep or which to remove
        // .populate("owner", "username")
        // we can also populate fields of our subdocuments
        .populate("comments.author", "username")
        .then(skincare => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // res.json({ skincare: skincare })
            res.render('skincareProducts/show', { skincare, username, loggedIn, userId })
        })
        .catch(err => console.log(err))
})


//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router