import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { API_BASE_URL, AUTH_EXPIRED_EVENT, api, clearSession, getSession, saveSession } from './api'

const LOCATIONS = ['Bengaluru', 'Berlin', 'Madrid', 'Oslo', 'Rome']

function formatDate(value) {
  if (!value) return 'Not available'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}
function value(value) { return value === undefined || value === null || value === '' ? 'Not available' : value }
function imageUrl(path) { return `${API_BASE_URL.replace(/\/api$/, '')}/images/${String(path || '').replace(/^images[\\/]/, '')}` }

function App() {
  const [session, setSession] = useState(getSession())
  const [page, setPage] = useState('home')
  const [location, setLocation] = useState('')
  const [metadata, setMetadata] = useState([])
  const [observations, setObservations] = useState([])
  const [satellites, setSatellites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const requests = [api.metadata()]
      if (session.token) requests.push(api.observations(), api.satellites())
      const results = await Promise.all(requests)
      setMetadata(results[0].data || [])
      if (session.token) {
        setObservations(results[1].data || [])
        setSatellites(results[2].data || [])
      }
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }, [session.token])
  useEffect(() => { loadData() }, [loadData])
  useEffect(() => {
    const handleAuthExpired = (event) => {
      setSession({ token: null, user: null })
      setPage('auth')
      setError(event.detail?.message || 'Your session has expired. Please sign in again.')
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
  }, [])

  const signIn = (result) => { saveSession(result); setSession(result); setPage('home'); setError('') }
  const signOut = () => { clearSession(); setSession({ token: null, user: null }); setPage('auth'); setError('') }
  const locationSearch = async (term) => {
    const clean = term.trim()
    if (!clean) return
    setLoading(true); setError('')
    try {
      const result = await api.searchMetadata(clean)
      setMetadata(result.data || [])
      setLocation(clean); setPage('quality')
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return <div className="app-shell">
    <Header page={page} setPage={setPage} session={session} onSignOut={signOut} />
    {error && <div className="global-error" role="alert">{error}<button onClick={() => setError('')}>Dismiss</button></div>}
    {page === 'home' && <Home location={location} setLocation={setLocation} onSearch={locationSearch} metadata={metadata} observations={observations} setPage={setPage} loading={loading} />}
    {!session.token && page !== 'home' && <Auth onSuccess={signIn} onBack={() => setPage('home')} />}
    {session.token && page === 'satellites' && <SatelliteExplorer satellites={satellites} observations={observations} onRefresh={loadData} onError={setError} user={session.user} />}
    {session.token && page === 'observations' && <ObservationExplorer observations={observations} satellites={satellites} onRefresh={loadData} onError={setError} user={session.user} />}
    {session.token && page === 'analytics' && <Analytics observations={observations} metadata={metadata} />}
    {session.token && page === 'provenance' && <Provenance satellites={satellites} metadata={metadata} onError={setError} />}
    {session.token && page === 'quality' && <Quality metadata={metadata} observations={observations} location={location} onSearch={locationSearch} loading={loading} />}
  </div>
}

function Header({ page, setPage, session, onSignOut }) {
  return <header className="topbar"><button className="brand" onClick={() => setPage('home')}><span className="brand-mark">EO</span><span><strong>Earth Observatory</strong><small>Satellite data provenance</small></span></button>
    <nav>{[['home', 'Home'], ['satellites', 'Satellites'], ['observations', 'Observations'], ['analytics', 'Analytics'], ['provenance', 'Provenance'], ['quality', 'Quality']].map(([id, label]) => <button key={id} className={page === id ? 'nav-active' : ''} onClick={() => setPage(id)}>{label}</button>)}</nav>
    <div className="session">{session.user ? <><span className="role">{session.user.role}</span><button className="text-button" onClick={onSignOut}>Sign out</button></> : <button className="login-button" onClick={() => setPage('auth')}>Sign in</button>}</div>
  </header>
}

function Home({ location, setLocation, onSearch, metadata, observations, setPage, loading }) {
  return <main className="home-page"><section className="hero-section"><div className="hero-copy"><p className="eyebrow">01 / EXPLORE OUR PLANET</p><h1>Trace every pixel<br /><em>back to its source.</em></h1><p className="hero-text">Explore satellite observations, quality metadata, imagery, and processing context through one transparent Earth-observation archive.</p><form className="search-bar" onSubmit={(e) => { e.preventDefault(); onSearch(location) }}><span className="search-icon">⌕</span><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Search a location" /><button>Explore <span>→</span></button></form><div className="suggestions"><span>Try a location</span>{LOCATIONS.map((item) => <button key={item} onClick={() => { setLocation(item); onSearch(item) }}>{item}</button>)}</div></div><div className="orbit-art"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="planet"><span /><span /><span /></div><div className="satellite-dot" /><div className="art-label label-top">LIVE ARCHIVE <b>●</b></div><div className="art-label label-bottom">5 LOCATIONS<br /><b>{metadata.length || 0} METADATA RECORDS</b></div></div></section>
    <section className="intro-grid"><div><p className="eyebrow">02 / OBSERVATORY TOOLS</p><h2>One archive.<br /><em>Every layer of context.</em></h2></div><div className="feature-list"><Feature n="01" title="Observation context" text="Search SQL observations by satellite, location, status, and cloud cover." onClick={() => setPage('observations')} /><Feature n="02" title="Quality intelligence" text="Read MongoDB quality, processing, and sensor metadata for each observation." onClick={() => setPage('quality')} /><Feature n="03" title="Visual evidence" text="Connect product imagery to provenance and its processing history." onClick={() => setPage('provenance')} /></div></section>
    {!loading && metadata.length === 0 && <State title="Metadata is unavailable" text="The homepage is ready, but the MongoDB metadata endpoint returned no records." />}
    {observations.length === 0 && <p className="home-note">Sign in to explore protected SQL observations and satellites.</p>}<footer className="site-footer"><span>Earth Observatory / Data lineage interface</span><span>MySQL + MongoDB</span></footer></main>
}
function Feature({ n, title, text, onClick }) { return <button className="feature" onClick={onClick}><span>{n}</span><span><h3>{title}</h3><p>{text}</p></span><b>↗</b></button> }

function Auth({ onSuccess, onBack }) {
  const [mode, setMode] = useState('login'); const [form, setForm] = useState({ username: '', email: '', password: '' }); const [busy, setBusy] = useState(false); const [error, setError] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    const username = form.username.trim()
    const email = form.email.trim()
    if (mode === 'register' && !username) { setError('Username is required.'); return }
    if (!email || !form.password) { setError('Email and password are required.'); return }
    if (mode === 'register' && form.password.length < 8) { setError('Password must be at least 8 characters long.'); return }
    setBusy(true); setError('')
    try {
      const result = mode === 'login' ? await api.login(email, form.password) : await api.register(username, email, form.password)
      if (mode === 'register') {
        setMode('login')
        setForm({ username: '', email, password: '' })
        setError('Registration successful. Sign in with your new account.')
      } else onSuccess(result)
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  const heading = mode === 'login' ? <>Welcome <em>back.</em></> : <>Join the <em>archive.</em></>
  return <main className="content-page narrow"><button className="back-link" onClick={onBack}>← Back home</button><div className="panel auth-panel"><p className="eyebrow">ACCOUNT ACCESS</p><h1>{heading}</h1>{error && <div className={error.startsWith('Registration successful') ? 'inline-success' : 'inline-error'} role="status">{error}</div>}<form onSubmit={submit}>{mode === 'register' && <label>Username<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label>}<label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label>Password<input required minLength="8" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><button className="primary-button auth-submit" disabled={busy}>{busy ? 'Working…' : mode === 'login' ? 'Sign in' : 'Register'}</button></form><button className="secondary-button auth-register" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Create a regular USER account' : 'Already registered? Sign in'}</button></div></main>
}

function Section({ eyebrow, title, actions, children }) { return <main className="content-page"><div className="results-heading"><div><p className="eyebrow">{eyebrow}</p><h1 dangerouslySetInnerHTML={{ __html: title }} /></div><div className="actions">{actions}</div></div>{children}</main> }
function State({ title, text, retry }) { return <div className="state-box"><span>⌁</span><h2>{title}</h2><p>{text}</p>{retry && <button className="text-button" onClick={retry}>Retry</button>}</div> }
function Loading() { return <div className="state-box"><div className="spinner" /><p>Loading archive data…</p></div> }
function Refresh({ onClick }) { return <button className="secondary-button" onClick={onClick}>Refresh ↻</button> }

function SatelliteExplorer({ satellites, observations, onRefresh, onError, user }) {
  const [search, setSearch] = useState(''); const [selected, setSelected] = useState(null); const [editing, setEditing] = useState(false)
  const filtered = satellites.filter((s) => `${s.satellite_name} ${s.orbit_type} ${s.status}`.toLowerCase().includes(search.toLowerCase()))
  const current = satellites.find((s) => s.satellite_id === selected) || filtered[0]
  const satObs = observations.filter((o) => current && String(o.satellite_name) === String(current.satellite_name))
  const save = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      satellite_name: formData.get('satellite_name'),
      launch_date: formData.get('launch_date'),
      orbit_type: formData.get('orbit_type'),
      orbit_altitude_km: Number(formData.get('orbit_altitude_km')),
      status: formData.get('status'),
    }
    try {
      await api.updateSatellite(current.satellite_id, data)
      setEditing(false)
      onRefresh()
    } catch (err) { onError(err.message) }
  }
  const remove = async () => { if (!window.confirm('Delete this satellite? Related records may prevent deletion.')) return; try { await api.deleteSatellite(current.satellite_id); setSelected(null); onRefresh() } catch (err) { onError(err.message) } }
  return <Section eyebrow="03 / SATELLITE EXPLORER" title="Orbiting <em>platforms.</em>" actions={<Refresh onClick={onRefresh} />}><div className="explorer-layout"><aside className="list-panel"><input className="full-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search satellites" />{filtered.map((s) => <button className={`list-item ${current?.satellite_id === s.satellite_id ? 'selected' : ''}`} key={s.satellite_id} onClick={() => setSelected(s.satellite_id)}><strong>{s.satellite_name}</strong><span>{s.orbit_type} · {s.status}</span></button>)}{!filtered.length && <p className="muted">No satellites match this search.</p>}</aside><div className="detail-panel">{!current ? <State title="No satellites available" text="The authenticated satellites endpoint returned no records." /> : editing ? <EditSatellite item={current} onSave={save} onCancel={() => setEditing(false)} /> : <><div className="detail-header"><div><p className="eyebrow">SATELLITE {current.satellite_id}</p><h2>{current.satellite_name}</h2><p className="detail-subtitle">{current.orbit_type} orbit · {current.orbit_altitude_km} km</p></div><span className="quality-badge">{current.status}</span></div><div className="info-grid"><Info label="Launch date" text={value(current.launch_date)} /><Info label="Orbit type" text={value(current.orbit_type)} /><Info label="Altitude" text={`${value(current.orbit_altitude_km)} km`} /><Info label="Observations" text={satObs.length} /></div><h3 className="subheading">Associated observations</h3><div className="mini-table">{satObs.map((o) => <div key={o.observation_id}><b>#{o.observation_id}</b><span>{o.area_name}</span><span>{o.observation_status}</span><span>{o.cloud_cover_percent}% cloud</span></div>)}{!satObs.length && <p className="muted">No SQL observations are associated with this satellite.</p>}</div>{user?.role === 'ADMIN' && <div className="admin-actions"><button className="secondary-button" onClick={() => setEditing(true)}>Edit satellite</button><button className="danger-button" onClick={remove}>Delete satellite</button></div>}<p className="source-note">Source: authenticated <code>GET /api/satellites</code> and <code>GET /api/observations</code>.</p></>}</div></div></Section>
}
function EditSatellite({ item, onSave, onCancel }) { return <form className="edit-form" onSubmit={onSave}><h2>Edit satellite</h2>{[['satellite_name', 'Name'], ['launch_date', 'Launch date'], ['orbit_type', 'Orbit type'], ['orbit_altitude_km', 'Altitude (km)'], ['status', 'Status']].map(([key, label]) => <label key={key}>{label}<input name={key} required defaultValue={item[key]} /></label>)}<div className="admin-actions"><button type="submit" className="primary-button">Save</button><button type="button" className="secondary-button" onClick={onCancel}>Cancel</button></div></form> }

function ObservationExplorer({ observations, satellites, onRefresh, onError, user }) {
  const [filters, setFilters] = useState({ query: '', location: '', satellite: '', status: '', cloud: '' }); const [applied, setApplied] = useState(filters); const [editing, setEditing] = useState(null)
  const filtered = observations.filter((o) => { const f = applied; return (!f.query || String(o.observation_id).includes(f.query)) && (!f.location || `${o.area_name} ${o.location_country}`.toLowerCase().includes(f.location.toLowerCase())) && (!f.satellite || o.satellite_name === f.satellite) && (!f.status || o.observation_status === f.status) && (!f.cloud || Number(o.cloud_cover_percent) <= Number(f.cloud)) })
  const apply = (e) => { e.preventDefault(); setApplied(filters); onRefresh() }
  const save = async (id, data) => { try { await api.updateObservation(id, data); setEditing(null); onRefresh() } catch (err) { onError(err.message) } }
  const remove = async (id) => { if (!window.confirm(`Delete observation ${id}?`)) return; try { await api.deleteObservation(id); onRefresh() } catch (err) { onError(err.message) } }
  return <Section eyebrow="04 / OBSERVATION CONTEXT" title="The archive, <em>in detail.</em>" actions={<Refresh onClick={onRefresh} />}><form className="filter-bar wide" onSubmit={apply}><label>Observation ID<input value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value.replace(/\D/g, '') })} placeholder="e.g. 1" /></label><label>Location<input value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} placeholder="Berlin" /></label><label>Satellite<select value={filters.satellite} onChange={(e) => setFilters({ ...filters, satellite: e.target.value })}><option value="">All satellites</option>{satellites.map((s) => <option key={s.satellite_id}>{s.satellite_name}</option>)}</select></label><label>Status<select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option>{[...new Set(observations.map((o) => o.observation_status))].map((s) => <option key={s}>{s}</option>)}</select></label><label>Cloud ≤ %<input type="number" min="0" max="100" value={filters.cloud} onChange={(e) => setFilters({ ...filters, cloud: e.target.value })} /></label><button className="primary-button">Apply filters</button></form><p className="result-count"><b>{filtered.length}</b> observations returned from the SQL API. Applying filters refreshes the backend dataset before the displayed criteria are applied.</p>{!observations.length ? <State title="No observations available" text="The authenticated observations endpoint returned no records." retry={onRefresh} /> : !filtered.length ? <State title="No matching observations" text="Try broadening the filters." /> : <div className="table-wrap"><table><thead><tr><th>ID</th><th>Satellite / sensor</th><th>Location</th><th>Ground station</th><th>Start / end</th><th>Orbit</th><th>Cloud</th><th>Status</th>{user?.role === 'ADMIN' && <th>Admin</th>}</tr></thead><tbody>{filtered.map((o) => <tr key={o.observation_id}><td><b>#{o.observation_id}</b></td><td>{o.satellite_name}<small>{o.sensor_name}</small></td><td>{o.area_name}<small>{o.location_country}</small></td><td>{value(o.ground_station_id)}</td><td>{formatDate(o.observation_start)}<small>{formatDate(o.observation_end)}</small></td><td>{value(o.orbit_number)}</td><td>{value(o.cloud_cover_percent)}%</td><td><span className="status">{o.observation_status}</span></td>{user?.role === 'ADMIN' && <td><button className="table-action" onClick={() => setEditing(o)}>Edit</button><button className="table-action danger" onClick={() => remove(o.observation_id)}>Delete</button></td>}</tr>)}</tbody></table></div>}{editing && <ObservationEdit item={editing} onSave={save} onCancel={() => setEditing(null)} />}</Section>
}
function ObservationEdit({ item, onSave, onCancel }) { const [form, setForm] = useState(item); const change = (key, v) => setForm({ ...form, [key]: v }); return <div className="modal-backdrop"><form className="panel modal" onSubmit={(e) => { e.preventDefault(); onSave(item.observation_id, { sensor_id: Number(form.sensor_id), ground_station_id: Number(form.ground_station_id), geo_location_id: Number(form.geo_location_id), observation_start: form.observation_start, observation_end: form.observation_end, orbit_number: Number(form.orbit_number), cloud_cover_percent: Number(form.cloud_cover_percent), observation_status: form.observation_status }) }}><h2>Edit observation #{item.observation_id}</h2>{[['sensor_id', 'Sensor ID'], ['ground_station_id', 'Ground station ID'], ['geo_location_id', 'Location ID'], ['observation_start', 'Start'], ['observation_end', 'End'], ['orbit_number', 'Orbit number'], ['cloud_cover_percent', 'Cloud cover %'], ['observation_status', 'Status']].map(([key, label]) => <label key={key}>{label}<input required={key !== 'observation_end'} value={form[key] || ''} onChange={(e) => change(key, e.target.value)} /></label>)}<div className="admin-actions"><button className="primary-button">Save changes</button><button type="button" className="secondary-button" onClick={onCancel}>Cancel</button></div></form></div> }

function Analytics({ observations, metadata }) {
  const statuses = useMemo(() => [...new Set(observations.map((o) => o.observation_status))].map((status) => [status, observations.filter((o) => o.observation_status === status).length]), [observations])
  const areas = useMemo(() => { const groups = {}; observations.forEach((o) => { const key = o.area_name; const cloudCover = Number(o.cloud_cover_percent); if (!key || !Number.isFinite(cloudCover)) return; const list = groups[key] || []; list.push(cloudCover); groups[key] = list }); return Object.entries(groups).map(([name, values]) => [name, values.reduce((a, b) => a + b, 0) / values.length, values.length]) }, [observations])
  const metadataAreas = useMemo(() => { const groups = {}; metadata.forEach((m) => { const key = m.location?.area_name; if (key) groups[key] = (groups[key] || 0) + 1 }); return Object.entries(groups) }, [metadata])
  const levels = useMemo(() => { const groups = {}; metadata.forEach((m) => { const level = m.image_metadata?.source_product?.match(/L[0-9A-Z]+/)?.[0] || 'Metadata linked'; groups[level] = (groups[level] || 0) + 1 }); return Object.entries(groups) }, [metadata])
  const average = metadata.length ? metadata.reduce((sum, m) => sum + Number(m.quality_metadata?.cloud_cover_percent || 0), 0) / metadata.length : 0
  return <Section eyebrow="05 / QUALITY INTELLIGENCE" title="Read the archive <em>at scale.</em>"><div className="metric-grid"><Metric label="Total observations" value={observations.length} /><Metric label="Average cloud cover" value={`${average.toFixed(1)}%`} /><Metric label="Metadata records" value={metadata.length} /><Metric label="Above average cloud" value={metadata.filter((m) => Number(m.quality_metadata?.cloud_cover_percent) > average).length} /></div><div className="analytics-grid"><Chart title="Observation counts by status" rows={statuses} /><BarChart data={areas} /><Chart title="Data-product processing levels" rows={levels} /><Chart title="Areas with multiple observations" rows={metadataAreas.filter(([, count]) => count > 1)} empty="No area has multiple metadata records." /></div><p className="source-note">The cloud-cover chart uses the authenticated SQL observation response, grouped by its geographic area and calculated from the live <code>cloud_cover_percent</code> values. Other cards combine SQL observations with MongoDB quality metadata.</p></Section>
}
function Metric({ label, value }) { return <div className="metric-card"><span>{label}</span><strong>{value}</strong></div> }
function Chart({ title, rows, empty }) { return <div className="chart-card"><h3>{title}</h3>{rows.length ? rows.map(([name, count]) => <div className="bar-row" key={name}><span>{name}</span><b>{count}</b></div>) : <p className="muted">{empty || 'No data returned.'}</p>}</div> }
function BarChart({ data }) {
  const chartWidth = 760
  const chartHeight = 260
  const margin = { top: 16, right: 20, bottom: 58, left: 44 }
  const plotWidth = chartWidth - margin.left - margin.right
  const plotHeight = chartHeight - margin.top - margin.bottom
  const slotWidth = data.length ? plotWidth / data.length : plotWidth
  const barWidth = Math.min(58, slotWidth * 0.58)
  return <div className="chart-card bar-chart-card"><h3>Average Cloud Cover by Geographic Area</h3>{data.length ? <div className="bar-chart-wrap"><svg className="bar-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Average cloud cover by geographic area"><g className="bar-chart-grid">{[0, 25, 50, 75, 100].map((tick) => { const y = margin.top + plotHeight - (tick / 100) * plotHeight; return <g key={tick}><line x1={margin.left} x2={chartWidth - margin.right} y1={y} y2={y} /><text x={margin.left - 8} y={y + 4} textAnchor="end">{tick}%</text></g> })}</g>{data.map(([name, average], index) => { const value = Math.max(0, Math.min(100, average)); const height = (value / 100) * plotHeight; const x = margin.left + index * slotWidth + (slotWidth - barWidth) / 2; const y = margin.top + plotHeight - height; return <g className="bar-chart-column" key={name}><rect x={x} y={y} width={barWidth} height={height} rx="2"><title>{name}: {value.toFixed(1)}%</title></rect><text className="bar-chart-value" x={x + barWidth / 2} y={y - 7} textAnchor="middle">{value.toFixed(1)}%</text><text className="bar-chart-label" x={x + barWidth / 2} y={chartHeight - 22} textAnchor="middle">{name}</text></g> })}<text className="bar-chart-axis-label" x={chartWidth / 2} y={chartHeight - 4} textAnchor="middle">Geographic area</text><text className="bar-chart-axis-label" transform={`translate(14 ${chartHeight / 2}) rotate(-90)`} textAnchor="middle">Average cloud cover (%)</text></svg></div> : <p className="muted">No cloud-cover observations returned.</p>}</div>
}

function Provenance({ satellites, metadata, onError }) {
  const [satellite, setSatellite] = useState(''); const [product, setProduct] = useState(''); const [history, setHistory] = useState([]); const [busy, setBusy] = useState(false)
  const selectedMetadata = metadata.find((m) => String(m.data_product_id) === String(product)); const selectedSat = satellites.find((s) => String(s.satellite_id) === String(satellite))
  const loadHistory = async (id) => { setProduct(id); if (!id) return; setBusy(true); try { const result = await api.provenance(id); setHistory(result.data || []) } catch (err) { onError(err.message) } finally { setBusy(false) } }
  const satelliteMetadata = metadata.filter((m) => String(m.satellite?.satellite_id) === String(satellite))
  return <Section eyebrow="06 / PROCESSING & PROVENANCE" title="Follow every product <em>through time.</em>"><div className="selector-row"><label>Retrieve observations for satellite<select value={satellite} onChange={(e) => setSatellite(e.target.value)}><option value="">Select satellite</option>{satellites.map((s) => <option value={s.satellite_id} key={s.satellite_id}>{s.satellite_name}</option>)}</select></label>{selectedSat && <div className="metric-inline"><b>{satelliteMetadata.length}</b><span>Mongo metadata observations for {selectedSat.satellite_name}</span></div>}</div>{satellite && <div className="table-wrap compact"><table><thead><tr><th>Observation</th><th>Location</th><th>Product</th><th>Cloud</th><th>Quality</th></tr></thead><tbody>{satelliteMetadata.map((m) => <tr key={m.observation_id}><td>#{m.observation_id}</td><td>{m.location?.area_name}</td><td><button className="table-action" onClick={() => loadHistory(m.data_product_id)}>Product {m.data_product_id}</button></td><td>{value(m.quality_metadata?.cloud_cover_percent)}%</td><td>{value(m.quality_metadata?.quality_flag)}</td></tr>)}</tbody></table></div>}<div className="provenance-panel"><h2>Processing history</h2>{busy ? <Loading /> : !product ? <p className="muted">Select a product to retrieve its input/output processing chain from <code>GET /api/provenance/:id</code>.</p> : !history.length ? <State title="No processing history" text="No provenance activity was returned for this product." /> : history.map((item) => <div className="process-row" key={item.activity_id}><span className="process-number">{item.activity_id}</span><div><h3>{item.processing_type}</h3><p>{item.software_name} · {item.status}</p><small>{item.input_product_name} → {item.output_product_name}</small></div><time>{formatDate(item.started_at)}</time></div>)}</div>{selectedMetadata && <p className="source-note">Selected product: {selectedMetadata.image_metadata?.source_product || `#${product}`}. The SQL backend exposes provenance by product ID; transaction examples in the repository are not exposed as an HTTP action.</p>}</Section>
}

function Quality({ metadata, observations, location, onSearch, loading }) { const [query, setQuery] = useState(location); const filtered = metadata.filter((m) => !location || m.location?.area_name.toLowerCase().includes(location.toLowerCase())); return <Section eyebrow="07 / VISUAL EVIDENCE" title="Quality you can <em>inspect.</em>" actions={<form className="small-search" onSubmit={(e) => { e.preventDefault(); onSearch(query) }}><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search location" /><button>Search</button></form>}>{loading ? <Loading /> : !filtered.length ? <State title="No metadata found" text={location ? `No MongoDB metadata matched ${location}.` : 'No metadata records were returned.'} /> : <div className="quality-grid">{filtered.map((m) => <QualityCard key={m.observation_id} item={m} observation={observations.find((o) => Number(o.observation_id) === Number(m.observation_id))} />)}</div>}</Section> }
function QualityCard({ item, observation }) { const q = item.quality_metadata || {}; const p = item.processing_metadata || {}; return <article className="quality-card">{item.image_metadata?.thumbnail_path && <img src={imageUrl(item.image_metadata.thumbnail_path)} alt={`${item.location?.area_name} observation`} />}<div className="card-body"><div className="card-top"><span>OBS #{item.observation_id}</span><span className="quality-badge">{value(q.quality_flag)}</span></div><h3>{item.location?.area_name}</h3><p>{item.location?.country} · {item.satellite?.satellite_name} · {item.sensor?.name}</p><div className="quality-list"><Info label="Cloud assessment" text={`${value(q.cloud_assessment)} · ${value(q.cloud_cover_percent)}%`} /><Info label="Geometric / radiometric" text={`${value(q.geometric_quality)} / ${value(q.radiometric_quality)}`} /><Info label="Corrections" text={`${value(p.atmospheric_correction)} · ${value(p.cloud_masking)}`} /></div>{observation && <small className="source-note">SQL status: {observation.observation_status} · {formatDate(observation.observation_start)}</small>}</div></article> }
function Info({ label, text }) { return <div className="info-item"><span>{label}</span><b>{text}</b></div> }

export default App
