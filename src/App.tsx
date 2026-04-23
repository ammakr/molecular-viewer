import { useEffect, useRef, useState } from 'react'
import * as NGL from 'ngl'
import './App.css'

type RepStyle = 'cartoon' | 'ball+stick' | 'surface' | 'ribbon' | 'licorice'

const PRESETS: { id: string; name: string; desc: string }[] = [
  { id: '1CRN', name: 'Crambin', desc: 'Small plant seed protein' },
  { id: '1HHO', name: 'Hemoglobin', desc: 'Oxygen-carrying protein in blood' },
  { id: '1BNA', name: 'B-DNA', desc: 'Classic double helix DNA' },
  { id: '4HHB', name: 'Deoxyhemoglobin', desc: 'Hemoglobin without oxygen' },
  { id: '2HHB', name: 'Oxyhemoglobin', desc: 'Hemoglobin with bound oxygen' },
]

const REP_STYLES: { value: RepStyle; label: string }[] = [
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'ribbon', label: 'Ribbon' },
  { value: 'ball+stick', label: 'Ball & Stick' },
  { value: 'licorice', label: 'Licorice' },
  { value: 'surface', label: 'Surface' },
]

export default function App() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<NGL.Stage | null>(null)
  const componentRef = useRef<NGL.StructureComponent | null>(null)
  const loadGenRef = useRef(0)

  const [pdbInput, setPdbInput] = useState('1CRN')
  const [repStyle, setRepStyle] = useState<RepStyle>('cartoon')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState<string | null>(null)

  async function loadStructure(id: string, style: RepStyle, stage?: NGL.Stage) {
    const s = stage ?? stageRef.current
    if (!s) return

    const trimmed = id.trim().toUpperCase()
    if (!trimmed) return

    const gen = ++loadGenRef.current

    setLoading(true)
    setError(null)

    try {
      s.removeAllComponents()
      const comp = await s.loadFile(`rcsb://${trimmed}`)
      if (gen !== loadGenRef.current) return
      const structComp = comp as NGL.StructureComponent
      componentRef.current = structComp
      structComp.addRepresentation(style, { colorScheme: 'chainname' })
      structComp.autoView()
      setLoaded(trimmed)
    } catch {
      if (gen !== loadGenRef.current) return
      setError(`Could not load "${trimmed}". Check the PDB ID and try again.`)
    } finally {
      if (gen === loadGenRef.current) setLoading(false)
    }
  }

  useEffect(() => {
    if (!viewportRef.current) return
    const stage = new NGL.Stage(viewportRef.current, {
      backgroundColor: 'rgb(16, 17, 29)',
    })
    stageRef.current = stage

    const handleResize = () => stage.handleResize()
    window.addEventListener('resize', handleResize)

    loadStructure('1CRN', 'cartoon', stage)

    return () => {
      window.removeEventListener('resize', handleResize)
      stage.dispose()
    }
  }, [])

  function changeRepresentation(style: RepStyle) {
    setRepStyle(style)
    const comp = componentRef.current
    if (!comp) return
    comp.removeAllRepresentations()
    comp.addRepresentation(style, { colorScheme: 'chainname' })
  }

  function handleLoad(e: React.FormEvent) {
    e.preventDefault()
    loadStructure(pdbInput, repStyle)
  }

  function handlePreset(id: string) {
    setPdbInput(id)
    loadStructure(id, repStyle)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1>Molecular Viewer</h1>
            <span className="badge">NGL</span>
          </div>
          <p className="header-subtitle">Built by <a href="https://ammarakram.com" target="_blank" rel="noopener noreferrer">Ammar Akram</a></p>
        </div>
        <p className="subtitle">Interactive 3D protein &amp; nucleic acid structures</p>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <section className="panel">
            <h2>Load Structure</h2>
            <form onSubmit={handleLoad} className="load-form">
              <input
                type="text"
                value={pdbInput}
                onChange={(e) => setPdbInput(e.target.value)}
                placeholder="PDB ID (e.g. 1CRN)"
                className="pdb-input"
                maxLength={10}
                spellCheck={false}
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Loading…' : 'Load'}
              </button>
            </form>
            {error && <p className="error">{error}</p>}
            {loaded && !error && (
              <p className="loaded-tag">Showing <strong>{loaded}</strong></p>
            )}
          </section>

          <section className="panel">
            <h2>Representation</h2>
            <div className="rep-grid">
              {REP_STYLES.map(({ value, label }) => (
                <button
                  key={value}
                  className={`rep-btn ${repStyle === value ? 'active' : ''}`}
                  onClick={() => changeRepresentation(value)}
                  disabled={!loaded}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>Presets</h2>
            <ul className="presets">
              {PRESETS.map((p) => (
                <li key={p.id}>
                  <button
                    className={`preset-btn ${loaded === p.id ? 'active' : ''}`}
                    onClick={() => handlePreset(p.id)}
                  >
                    <span className="preset-id">{p.id}</span>
                    <span className="preset-info">
                      <span className="preset-name">{p.name}</span>
                      <span className="preset-desc">{p.desc}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel hints">
            <h2>Controls</h2>
            <ul>
              <li><kbd>Drag</kbd> Rotate</li>
              <li><kbd>Scroll</kbd> Zoom</li>
              <li><kbd>Right-drag</kbd> Pan</li>
            </ul>
          </section>
        </aside>

        <main className="viewer-wrap">
          <div ref={viewportRef} className="viewport" />
          {loading && (
            <div className="loading-overlay">
              <div className="spinner" />
              <span>Fetching structure…</span>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
