import express from 'express'
import { Liquid } from 'liquidjs'

const app = express()
const engine = new Liquid()

app.use(express.static('public'))
app.engine('liquid', engine.express()) 
app.set('views', './views')

const baseURL = 'https://fdnd-agency.directus.app/items/demo_pizzas'

app.get('/', async function (request, response) {
  const params = new URLSearchParams()
  params.set('limit', 4)
  params.set('sort', '-ordered')

  const pizzasResponse = await fetch(`${baseURL}?${params.toString()}`)
  const pizzas = await pizzasResponse.json()

  response.render('index.liquid', {pizzas: pizzas.data})
})

app.get('/pizzas', async function (request, response) {
  const params = new URLSearchParams()
  params.set('sort', 'name')
  params.set('meta', 'total_count,filter_count')

  const type = request.query.type
  const price = request.query.price
  const enhanced = request.query.enhanced

  if (type) {
    params.set('filter[type][_eq]', type)
  }

  const pizzasResponse = await fetch(`${baseURL}?${params.toString()}`)
  const pizzasJSON = await pizzasResponse.json()

  const pizzas = {
    pizzas: pizzasJSON.data,
    selectedType: type,
    selectedSort: price,
    meta: pizzasJSON.meta
  }

  if (enhanced) {
    response.render('partials/pizza_list.liquid', pizzas)
  } else {
    response.render('pizzas.liquid', pizzas)
  }
})

app.get('/pizzas/:slug', async function (request, response) {
  const params = new URLSearchParams() 
  params.set('filter[slug][_eq]', request.params.slug)

  const pizzaResponse = await fetch(`${baseURL}?${params.toString()}`)
  const pizza = await pizzaResponse.json()

  response.render('pizza.liquid', {pizza: pizza.data[0], showDetail: true})
})

app.set('port', process.env.PORT || 8001)

app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

