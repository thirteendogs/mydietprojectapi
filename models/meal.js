require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const mealSchema = new mongoose.Schema({
  ingredients: Array,
  proteins: Number,
  carbohydrates: Number,
  fats: Number,
  calories: Number
})

mealSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Meal = mongoose.model('Meal', mealSchema)

module.exports = Meal