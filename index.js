const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

let ingredients = [
   {
      "id": 1,
      "name": "Peas",
      "calories": 81,
      "proteins": 5,
      "carbohydrates": 14,
      "fats": 0.4
    },
    {
      "id": 2,
      "name": "Chicken breast",
      "calories": 165,
      "proteins": 31,
      "carbohydrates": 0,
      "fats": 3.6
    },
    {
      "id": 3,
      "name": "Potatos",
      "calories": 77,
      "proteins": 2,
      "carbohydrates": 17,
      "fats": 0.1
    },
    {
      "name": "Peanuts",
      "calories": 182,
      "proteins": 10,
      "carbohydrates": 14,
      "fats": 88,
      "id": 4
    }
]

const generateId = () => {
      const maxId = ingredients.length > 0
   ? Math.max(...ingredients.map(n => n.id))
   : 0

   return maxId + 1
}

app.get('/', (request, response) => {
   response.send('<h1>Hello World</h1>')
})

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



const PORT = process.env.PORT || 3001
app.listen(PORT , () => {
   console.log(`Server running on port ${PORT}`)
   })