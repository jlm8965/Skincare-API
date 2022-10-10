///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Skincare = require('./skincare')


///////////////////////////////////////
// Seed Script code
///////////////////////////////////////
// first we need our connection saved to a variable for easy reference
const db = mongoose.connection

db.on('open', () => {
    // bring in the array of skincare products
    const startSkincare = [
        { name: "Shiseido Clear Sunscreen Stick", formulation: "chemical", whiteCast: false },
        { name: "Skin Aqua Super Moisture Gel ", formulation: "chemical", whiteCast: false },
        { name: "Biore Aqua Rich Watery Essense", formulation: "chemical", whiteCast: false },
        { name: "Etude House Surprise Mild Airy Finish Sun Milk", formulation: "physical", whiteCast: true },
        { name: "Missha Waterproof Sun Milk", formulation: "physical", whiteCast: true},
      ]

    // delete all the existing skincare products
    Skincare.remove({})
        .then(deletedSkincareProducts => {
            console.log('this is what .remove returns', deletedSkincareProducts)

            // create a bunch of new skincare products from startSkincare
            Skincare.create(startSkincareProducts)
                .then(data => {
                    console.log('here are the newly created skincare products', data)
                    // close that mf
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    // close that mf
                    db.close()
                })
        })
        .catch(error => {
            console.log(error)
            // close that mf
            db.close()
        })
})