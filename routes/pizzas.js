import express from 'express'
import { fetchData } from '../lib/fetchData.js'

const router = express.Router()

router.get('/', async (request, response) => {
  const { type, price, enhanced } = request.query
  const params = new URLSearchParams()

  if (price === 'low-high') {
    params.set('sort', 'price')
  } else if (price === 'high-low') {
    params.set('sort', '-price') 
  } else {
    params.set('sort', 'name') 
  }

  if (type) {
    params.set('filter[type][_eq]', type)
  }
    
  params.set('meta', 'total_count,filter_count')

  const data = await fetchData('demo_pizzas', params)
  
  const pizzas = {
    pizzas: data?.data || [],
    selectedType: type || '',
    selectedSort: price || '',
    meta: data?.meta || {},
  }

  if (enhanced) {
    response.render('partials/pizza_list.liquid', pizzas)
  } else {
    response.render('pizzas.liquid', pizzas)
  }
})

router.get('/:slug', async (request, response) => {
  const { slug } = request.params

  const data = await fetchData('demo_pizzas', {
    'filter[slug][_eq]': slug
  })

  if (!data?.data?.length) {
    return response.status(404).render('error.liquid')
  }

  response.render('pizza.liquid', {
    pizza: data?.data[0] || [],
    showDetail: true
  })
})

export default router