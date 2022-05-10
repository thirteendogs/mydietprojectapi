const ingredientsRouter = require('express').Router()
const ingredients = require('../models/ingredient')


// INGREDIENTS
const generateId = () => {
      const maxId = ingredients.length > 0
   ? Math.max(...ingredients.map(n => n.id))
   : 0

   return maxId + 1
}

ingredientsRouter.get('/', (request, response) => {
   response.json(ingredients)
})

ingredientsRouter.get('/:id', (request, response) => {
   const id = Number(request.params.id) 
   const ingredient = ingredients.find(ingredient => ingredient.id === id)

   if(ingredient) {
      response.json(ingredient)
   } else {
      response.status(404).end()
   }
})

ingredientsRouter.delete('/:id', (request, response) => {
   const id = Number(request.params.id)
   ingredients = ingredients.filter(ingredient => ingredient.id !== id)
   response.status(204).end()
})

ingredientsRouter.post('/', (request, response) => {
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

module.exports = ingredientsRouter

