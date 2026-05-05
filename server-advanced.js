import express from 'express'
import { Liquid } from 'liquidjs'

import indexRoutes from './routes/index.js'
import pizzasRoutes from './routes/pizzas.js'

const app = express()
const engine = new Liquid()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.engine('liquid', engine.express())
app.set('views', './views')
app.set('view engine', 'liquid')

app.use('/', indexRoutes)
app.use('/pizzas', pizzasRoutes)

app.use((request, response) => {
  response.status(404).render('error.liquid')
})

const PORT = process.env.PORT || 8001

app.listen(PORT, () => {
  console.log(`Application started on http://localhost:${PORT}`)
})