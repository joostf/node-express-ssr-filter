const BASE_URL = 'https://fdnd-agency.directus.app/items'

export async function fetchData(endpoint, params = {}) {
  try {
    const searchParams = new URLSearchParams(params)
    const url = `${BASE_URL}/${endpoint}?${searchParams}`

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      throw new Error(`API error: ${response.status}`)
    }

    const json = await response.json()
    return json

  } catch (error) {
    console.error('Fetch error:', error)
    return null
  }
}