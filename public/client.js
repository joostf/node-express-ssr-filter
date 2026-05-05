// variables
const form = document.querySelector('form')
const selects = form.querySelectorAll('select')
const button = form.querySelector('input[type="submit"]')
const loader = document.querySelector('.loader')
const main = document.querySelector('main')

// logic
button.hidden = true

form.addEventListener('submit', event => event.preventDefault())

selects.forEach(select => {
  select.addEventListener('change', () => fetchPizzas({ pushState: true }))
})

window.addEventListener('popstate', () => {
  syncFilterState()
  fetchPizzas({ pushState: false })
})

// function declarations
async function fetchPizzas({ pushState = false } = {}) {
  const formData = new FormData(form) // formdata object
  const params = new URLSearchParams(formData) // parameters object

  params.set('enhanced', 'true')

  loader.classList.add('loading')

  const response = await fetch('/pizzas?' + params.toString())
  const filteredPizzas = await response.text()

  // Mimic network delay for demonstration purposes
  await new Promise(resolve => setTimeout(resolve, 1500))

  loader.classList.remove('loading')

  renderPizzas(filteredPizzas)

  if (pushState) {
    params.delete('enhanced')
    history.pushState(null, '', '/pizzas?' + params.toString())
  }
}

function renderPizzas(filteredPizzas) {
  main.innerHTML = filteredPizzas
}

function syncFilterState() {
  const params = new URLSearchParams(window.location.search)

  if (params.has('type')) {
    typeSelect.value = params.get('type')
  }

  if (params.has('price')) {
    priceSelect.value = params.get('price')
  }
}
































// variables
// const form = document.querySelector('form')
// const selects = form.querySelectorAll('select')
// const button = form.querySelector('input[type="submit"]')
// const loader = document.querySelector('.loader')

// logic
// button.hidden = true

// form.addEventListener('submit', e => e.preventDefault())

// selects.forEach(select => {
//   select.addEventListener('change', () => fetchPizzas({ pushState: true }))
// })

// window.addEventListener('popstate', () => {
//   syncFilterState()
//   fetchPizzas({ pushState: false })
// })

// function declarations
// async function fetchPizzas({ pushState = false } = {}) {
//   const formData = new FormData(form)
//   const params = new URLSearchParams(formData)

//   params.set('enhanced', 'true')

//   loader.classList.add('loading')

//   const response = await fetch('/pizzas?' + params.toString())
//   const filteredPizzas = await response.text()

//   // Mimic network delay for demonstration purposes
//   await new Promise(resolve => setTimeout(resolve, 1500))

//   renderPizzas(filteredPizzas)

//   loader.classList.remove('loading')

//   if (pushState) {
//     params.delete('enhanced')
//     history.pushState(null, '', '/pizzas?' + params.toString())
//   }
// }

// function renderPizzas(filteredPizzas) {
//   document.querySelector('main').innerHTML = filteredPizzas
// }

// function syncFilterState() {
//   const params = new URLSearchParams(window.location.search)

//   if (params.has('type')) {
//     typeSelect.value = params.get('type')
//   }

//   if (params.has('price')) {
//     priceSelect.value = params.get('price')
//   }
// }