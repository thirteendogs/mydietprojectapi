require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

const Meal = require('./models/meal')
const ingredients = require('./models/ingredient')

app.use(express.json())
app.use(cors())


// MEALS
app.get('/api/meals', (request, response) => {
   Meal.find({})
      .then(meals => {
         response.json(meals)
      })
})

app.post('/api/meals', (request, response) => {
   const body = request.body

   if(!body.ingredients) {
      return response.status(400).json({  error: 'ingredients are missing' })
   }

   const meal = new Meal({
      ingredients: body.ingredients,
      proteins: body.proteins,
      carbohydrates: body.carbohydrates,
      fats: body.fats,
      calories: body.calories
   })

   meal
      .save()
      .then(savedMeal => {
         response.json(savedMeal)
      })
})


// INGREDIENTS
const generateId = () => {
      const maxId = ingredients.length > 0
   ? Math.max(...ingredients.map(n => n.id))
   : 0

   return maxId + 1
}

app.get('/api/ingredients', (request, response) => {
   response.json(ingredients)
})

app.get('/api/ingredients/:id', (request, response) => {
   const id = Number(request.params.id) 
   const ingredient = ingredients.find(ingredient => ingredient.id === id)

   if(ingredient) {
      response.json(ingredient)
   } else {
      response.status(404).end()
   }
})

app.delete('/api/ingredients/:id', (request, response) => {
   const id = Number(request.params.id)
   ingredients = ingredients.filter(ingredient => ingredient.id !== id)
   response.status(204).end()
})

app.post('/api/ingredients', (request, response) => {
   const body = request.body

   if(!body.name) {
      return response.status(400).json({
         error: 'name missing'
      })
   }

   const ingredient = {
      name: body.name,
      calories: body.calories,
      proteins: body.proteins,
      carbohydrates: body.carbohydrates,
      fats: body.fats,
      id: generateId()
   }

   ingredients = [...ingredients, ingredient]

   response.json(ingredient)
})



const PORT = process.env.PORT
app.listen(PORT , () => {
   console.log(`Server running on port ${PORT}`)
   })