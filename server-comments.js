import express from 'express'
import { Liquid } from 'liquidjs'

// Maak een Express applicatie aan
const app = express()

// Initialiseer de Liquid template engine
const engine = new Liquid()

// Zorg dat bestanden uit de public map direct toegankelijk zijn in de browser
app.use(express.static('public'))

// Registreer Liquid als template engine voor .liquid bestanden
app.engine('liquid', engine.express())

// Stel de map in waar de views (templates) staan
app.set('views', './views')

/* --------------------------------------------------
   ROUTE: HOME PAGINA
-------------------------------------------------- */

app.get('/', async function (request, response) {

  // Haal 4 pizza's op, gesorteerd op nieuwste eerst (ordered aflopend)
  const pizzasResponse = await fetch(
    'https://fdnd-agency.directus.app/items/demo_pizzas?sort[]=-ordered&limit=4'
  )

  // Zet de API response om naar JSON
  const pizzasJSON = await pizzasResponse.json()

  // Render de index pagina en geef data door aan Liquid
  response.render('index.liquid', {
    pizzas: pizzasJSON.data, // lijst met pizza's

    selectedType: '', // geen filter actief op home
    selectedSort: '', // geen sortering actief op home

    meta: {
      filter_count: pizzasJSON.data.length, // aantal getoonde items
      total_count: pizzasJSON.data.length   // totaal aantal items (hier gelijk)
    }
  })
})

/* --------------------------------------------------
   ROUTE: PIZZA OVERZICHT MET FILTERS
-------------------------------------------------- */

app.get('/pizzas', async function (request, response) {

  // Maak een nieuwe URLSearchParams instantie voor query parameters
  const params = new URLSearchParams()

  // Haal query parameters uit de URL
  const type = request.query.type || ''
  const price = request.query.price || ''
  const enhanced = request.query.enhanced || ''

  // Bepaal sortering op basis van prijs filter
  if (price === 'low-high') {
    params.set('sort', 'price')
  } else if (price === 'high-low') {
    params.set('sort', '-price')
  } else {
    params.set('sort', 'name')
  }

  // Voeg filter toe als er een type is gekozen
  if (type) {
    params.set('filter[type][_eq]', type)
  }

  // Vraag meta data op van Directus (total en filter count)
  params.set('meta', 'total_count,filter_count')

  // Bouw de volledige API URL op
  const url =
    'https://fdnd-agency.directus.app/items/demo_pizzas?' +
    params.toString()

  // Haal data op van de API
  const pizzasResponse = await fetch(url)
  const pizzasJSON = await pizzasResponse.json()

  // Structuur data voor gebruik in de template
  const pizzas = {
    pizzas: pizzasJSON.data, // lijst met pizza's
    selectedType: type, // huidige filter
    selectedSort: price, // huidige sortering
    meta: pizzasJSON.meta // metadata van API
  }

  // Render alleen een partial als enhanced is ingeschakeld
  if (enhanced) {
    response.render('partials/pizza_list.liquid', pizzas)
  } else {
    // Anders render volledige pagina
    response.render('pizzas.liquid', pizzas)
  }
})

/* --------------------------------------------------
   ROUTE: DETAILPAGINA VAN ÉÉN PIZZA
-------------------------------------------------- */

app.get('/pizzas/:slug', async function (request, response) {

  // Haal één pizza op op basis van slug
  const pizzaResponse = await fetch(
    'https://fdnd-agency.directus.app/items/demo_pizzas?filter[slug][_eq]=' +
      request.params.slug
  )

  // Zet response om naar JSON
  const pizzaJSON = await pizzaResponse.json()

  // Render detailpagina met eerste resultaat uit array
  response.render('pizza.liquid', {
    pizza: pizzaJSON.data[0]
  })
})

/* --------------------------------------------------
   SERVER START
-------------------------------------------------- */

// Stel poort in (of gebruik environment variable)
app.set('port', process.env.PORT || 8001)

// Start server
app.listen(app.get('port'), function () {

  // Log URL naar console
  console.log(
    `Application started on http://localhost:${app.get('port')}`
  )
})