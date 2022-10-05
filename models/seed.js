///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Fruit = require('./skincare')


///////////////////////////////////////
// Seed Script code
///////////////////////////////////////
// first we need our connection saved to a variable for easy reference
const db = mongoose.connection

db.on('open', () => {
    // bring in the array of skincare products
    const startSkincares = [
        { name: "Shiseido Clear Sunscreen Stick", formulation: "chemical", whiteCast: false },
        { name: "Skin Aqua Super Moisture Gel ", formulation: "chemical", whiteCast: false },
        { name: "Biore Aqua Rich Watery Essense", formulation: "chemical", whiteCast: false },
        { name: "Etude House Surprise Mild Airy Finish Sun Milk", formulation: "physical", whiteCast: true },
        { name: "Missha Waterproof Sun Milk", formulation: "physical", whiteCast: true},
      ]

    // delete all the existing skincare products
    Skincare.remove({})
        .then(deletedSkincares => {
            console.log('this is what .remove returns', deletedSkincares)

            // create a bunch of new skincare products from startSkincares
            Skincare.create(startSkincares)
                .then(data => {
                    console.log('here are the newly created skincare products', data)
                    // always close connection to the db
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    // always close connection to the db
                    db.close()
                })
        })
        .catch(error => {
            console.log(error)
            // always close connection to the db
            db.close()
        })
})