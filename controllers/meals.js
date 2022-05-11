require('dotenv').config()
const mealsRouter = require('express').Router()
const Meal = require('../models/meal')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

mealsRouter.get('/', async (request, response) => {
  const meals = await Meal
    .find({})
    .populate('user', { username: 1 })

  response.json(meals)
})

mealsRouter.get('/:id', async (request, response) => {
  const meal = await Meal.findById(request.params.id)

  if (meal) {
    response.json(meal.toJSON())
  } else {
    response.status(404).end()
  }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

mealsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const meal = new Meal({
    ingredients: body.ingredients,
    proteins: body.proteins,
    carbohydrates: body.carbohydrates,
    fats: body.fats,
    calories: body.calories,
    user: user._id
  })

  const savedMeal = await meal.save()
  user.meals = user.meals.concat(savedMeal._id)
  await user.save()

  response.status(201).json(savedMeal)
})

mealsRouter.delete('/:id', async (request, response) => {
  await Meal.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

mealsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const meal = {
    ingredients: body.ingredients,
    proteins: body.proteins,
    carbohydrates: body.carbohydrates,
    fats: body.fats,
    calories: body.calories,
  }

  Meal.findByIdAndUpdate(request.params.id, meal, { new: true })
    .then(updatedMeal => {
      response.json(updatedMeal)
    })
    .catch(error => next(error))
})

module.exports = mealsRouter