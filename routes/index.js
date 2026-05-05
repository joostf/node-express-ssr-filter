import express from 'express'
import { fetchData } from '../lib/fetchData.js'

const router = express.Router()

router.get('/', async (request, response) => {
  const params = new URLSearchParams()
  params.set('limit', 4)
  params.set('sort', '-ordered')

  const data = await fetchData('demo_pizzas', params)

  response.render('index.liquid', {
    pizzas: data?.data || []
  })
})

export default router