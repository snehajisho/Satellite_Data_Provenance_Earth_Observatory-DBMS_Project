const DEFAULT_API_BASE_URL = 'http://localhost:3001/api'
const TOKEN_KEY = 'earth_observatory_token'
const USER_KEY = 'earth_observatory_user'
export const AUTH_EXPIRED_EVENT = 'earth-observatory-auth-expired'

function resolveApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim()
  if (!configuredUrl) return DEFAULT_API_BASE_URL

  try {
    const url = new URL(configuredUrl)
    const basePath = url.pathname.replace(/\/+$/, '')
    url.pathname = basePath.endsWith('/api') ? basePath : `${basePath}/api`
    url.search = ''
    url.hash = ''
    return url.toString().replace(/\/$/, '')
  } catch {
    console.warn(`[api] Ignoring invalid VITE_API_URL "${configuredUrl}". Using ${DEFAULT_API_BASE_URL}.`)
    return DEFAULT_API_BASE_URL
  }
}

export const API_BASE_URL = resolveApiBaseUrl()

export function getSession() {
  try {
    return {
      token: localStorage.getItem(TOKEN_KEY),
      user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
    }
  } catch {
    return { token: null, user: null }
  }
}

export function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`
  const session = getSession()
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }
  if (session.token) headers.Authorization = `Bearer ${session.token}`

  try {
    const response = await fetch(url, { ...options, headers })
    const body = await response.json().catch(() => ({}))
    if (!response.ok || body.success === false) {
      const error = new Error(body.message || body.error || `Request failed with status ${response.status}`)
      error.status = response.status
      error.url = url
      if (response.status === 401) {
        clearSession()
        window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT, { detail: { message: error.message } }))
      }
      throw error
    }
    return body
  } catch (error) {
    if (import.meta.env.DEV) console.error(`[api] ${path} failed`, error)
    throw error
  }
}

const json = (method, body) => ({ method, body: JSON.stringify(body) })

export const api = {
  login: (email, password) => request('/auth/login', json('POST', { email, password })),
  register: (username, email, password) => request('/auth/register', json('POST', { username, email, password })),
  satellites: () => request('/satellites'),
  satellite: (id) => request(`/satellites/${id}`),
  updateSatellite: (id, body) => request(`/satellites/${id}`, json('PUT', body)),
  deleteSatellite: (id) => request(`/satellites/${id}`, { method: 'DELETE' }),
  observations: () => request('/observations'),
  observation: (id) => request(`/observations/${id}`),
  updateObservation: (id, body) => request(`/observations/${id}`, json('PUT', body)),
  deleteObservation: (id) => request(`/observations/${id}`, { method: 'DELETE' }),
  metadata: () => request('/metadata'),
  metadataById: (id) => request(`/metadata/${id}`),
  searchMetadata: (location) => request(`/metadata/search/location?location=${encodeURIComponent(location)}`),
  metadataBySatellite: (id) => request(`/metadata/satellite/${id}`),
  provenance: (productId) => request(`/provenance/${productId}`),
}
