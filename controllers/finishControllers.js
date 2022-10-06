////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

// we need our Skincare MODEL because comments are ONLY a schema
// so we'll run queries on skincare products, and add in finish info
const Skincare = require('../models/skincare')

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// only need two routes for finish right now
// POST -> to create 
router.post('/:skincareId', (req, res) => {
    const skincareId = req.params.skincareId
    console.log('first space for finish info', req.body)
    
    // we'll adjust req.body to include an author
    // the author's id will be the logged in user's id
    req.body.author = req.session.userId
    console.log('updated body', req.body)
    // we'll find the skincare with the skincareId
    Skincare.findById(skincareId)
        .then(skincare => {
            // then we'll send req.body to the comments array
            skincare.finish.push(req.body)
            // save the skincare product
            return skincare.save()
        })
        .then(skincare => {
            // redirect

            res.status(201).json({ skincare: skincare })
        })
        // or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

// DELETE -> to destroy finish info
// we'll use two params to make our life easier
// first the id of the skincare product, since we need to find it
// then the id of the finish info, since we want to delete it
router.delete('/delete/:skincareId/:finishId', (req, res) => {
    // first we want to parse out our ids
    const skincareId = req.params.skincareId
    const finishId = req.params.finishId
    // then we'll find the skincare product
    Skincare.findById(skincareId)
        .then(skincare => {
            const theComment = skincare.comments.id(finishId)
            // only delete the finish if the user who is logged in is the author
            if ( theFinish.author == req.session.userId) {
                // then we'll delete the comment
                theFinish.remove()
                // return the saved skincare product
                return skincare.save()
            } else {
                return
            }

        })
        .then(skincare => {
            console.log('updated skincare product', skincare)
            res.sendStatus(204)
        })
        .catch(error => {
            // catch any errors
            console.log(error)
            res.send(error)
        })
})


// show route
router.get('/:id', (req, res) => {
    // first, we need to get the id
    const skincareId = req.params.id
    // then we can find a skincare product by its id
    Skincare.findById(skincareId)
      .populate('finish.author')
      // once found, we can render a view with the data
      .then((skincare) => {
        console.log('the skincare product we got\n', skincare)
        const username = req.session.username
        const loggedIn = req.session.loggedIn
        const userId = req.session.userId
        // res.render('skincare/show', { skincare, username, loggedIn, userId })
        res.status(200).json({ skincare: skincare.toObject() })
      })
      // if there is an error, show that instead
      .catch((err) => {
        console.log(err)
        res.json({ err })
      })
  })
////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router