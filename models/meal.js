require('dotenv').config()
const mongoose = require('mongoose')

const mealSchema = new mongoose.Schema({
   ingredients: Array,
   proteins: Number,
   carbohydrates: Number,
   fats: Number,
   calories: Number,
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   }
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