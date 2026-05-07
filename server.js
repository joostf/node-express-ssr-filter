import express from 'express'
import { Liquid } from 'liquidjs'

const app = express()
const engine = new Liquid()

app.use(express.static('public'))
app.engine('liquid', engine.express()) 
app.set('views', './views')

app.get('/', async function (request, response) {
  const pizzasResponse = await fetch('https://fdnd-agency.directus.app/items/demo_pizzas?sort[]=-ordered&limit=4')
  const pizzasJSON = await pizzasResponse.json()

  response.render('index.liquid', { pizzas: pizzasJSON.data, selectedType: '', selectedSort: '', meta: { filter_count: pizzasJSON.data.length, total_count: pizzasJSON.data.length }})
})

app.get('/pizzas', async function (request, response) {
  const params = new URLSearchParams()

  if (request.query.price === 'low-high') {
    params.set('sort', 'price')
  } else if (price === 'high-low') {
    params.set('sort', '-price') 
  } else {
    params.set('sort', 'name') 
  }

  if (request.query.type) {
    params.set('filter[type][_eq]', request.query.type)
  }
    
  params.set('meta', 'total_count,filter_count')

  const url = 'https://fdnd-agency.directus.app/items/demo_pizzas?' + params.toString()
  const pizzasResponse = await fetch(url)
  const pizzasJSON = await pizzasResponse.json()

  if (request.query.enhanced) {
    response.render('partials/pizza_list.liquid', { pizzas: pizzasJSON.data, selectedType: request.query.type, selectedSort: request.query.type, meta: pizzasJSON.meta})
  } else {
    response.render('pizzas.liquid', { pizzas: pizzasJSON.data, selectedType: request.query.type, selectedSort: request.query.type, meta: pizzasJSON.meta})
  }
})

app.get('/pizzas/:slug', async function (request, response) { 
  const pizzaResponse = await fetch('https://fdnd-agency.directus.app/items/demo_pizzas?filter[slug][_eq]=' + request.params.slug)
  const pizzaJSON = await pizzaResponse.json()

  response.render('pizza.liquid', { pizza: pizzaJSON.data[0] })
})

app.set('port', process.env.PORT || 8001)

app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
