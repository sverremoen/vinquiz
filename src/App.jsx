import { useEffect, useMemo, useState } from 'react'
import './App.css'

const QUESTION_BANK = [
  { q: 'Hvilken drue er hoveddruen i Chablis?', a: 'Chardonnay', o: ['Sauvignon Blanc', 'Riesling', 'Chardonnay'], c: 'Druer', d: 'easy' },
  { q: 'Hvilken drue forbindes mest med Barolo?', a: 'Nebbiolo', o: ['Sangiovese', 'Nebbiolo', 'Barbera'], c: 'Druer', d: 'easy' },
  { q: 'Hva er den mest brukte blå druen i Rioja Reserva?', a: 'Tempranillo', o: ['Tempranillo', 'Garnacha', 'Monastrell'], c: 'Druer', d: 'easy' },
  { q: 'Hvilken drue er kjent for pepperpreg i Nord-Rhône?', a: 'Syrah', o: ['Malbec', 'Syrah', 'Carmenère'], c: 'Druer', d: 'medium' },
  { q: 'Hvilken drue er sentral i Sancerre?', a: 'Sauvignon Blanc', o: ['Chenin Blanc', 'Sauvignon Blanc', 'Viognier'], c: 'Druer', d: 'medium' },
  { q: 'Hvilken drue dominerer Amarone?', a: 'Corvina', o: ['Dolcetto', 'Corvina', 'Nero d’Avola'], c: 'Druer', d: 'hard' },
  { q: 'Bordeaux ligger i hvilket land?', a: 'Frankrike', o: ['Italia', 'Frankrike', 'Spania'], c: 'Regioner', d: 'easy' },
  { q: 'Chianti kommer fra hvilken italiensk region?', a: 'Toscana', o: ['Piemonte', 'Sicilia', 'Toscana'], c: 'Regioner', d: 'easy' },
  { q: 'Napa Valley ligger i hvilken delstat?', a: 'California', o: ['Oregon', 'Washington', 'California'], c: 'Regioner', d: 'easy' },
  { q: 'Douro er kjent for hvilken vintype?', a: 'Portvin', o: ['Cava', 'Portvin', 'Sherry'], c: 'Regioner', d: 'medium' },
  { q: 'Marlborough er spesielt kjent for?', a: 'Sauvignon Blanc', o: ['Pinotage', 'Sauvignon Blanc', 'Grenache'], c: 'Regioner', d: 'medium' },
  { q: 'Priorat er en region i?', a: 'Spania', o: ['Portugal', 'Spania', 'Argentina'], c: 'Regioner', d: 'hard' },
  { q: 'Hva beskriver “tannin” best?', a: 'Snerpende munnfølelse', o: ['Sukkerinnhold', 'Snerpende munnfølelse', 'Alkoholstyrke'], c: 'Smaking', d: 'easy' },
  { q: 'Hva betyr “syrefrisk” vin?', a: 'Høy syre', o: ['Høy syre', 'Høy alkohol', 'Mye eik'], c: 'Smaking', d: 'easy' },
  { q: 'Hva er “kropp” i vin?', a: 'Følelse av fylde', o: ['Mengde bobler', 'Følelse av fylde', 'Temperatur'], c: 'Smaking', d: 'easy' },
  { q: 'Primæraromaer kommer hovedsakelig fra?', a: 'Druen', o: ['Druen', 'Fatet', 'Lagring på flaske'], c: 'Smaking', d: 'medium' },
  { q: 'Hva er “finish” i vinsmaking?', a: 'Ettersmakens lengde', o: ['Fargen på vinen', 'Ettersmakens lengde', 'Hvor raskt du drikker'], c: 'Smaking', d: 'medium' },
  { q: 'Hva kjennetegner ofte en “old world”-stil?', a: 'Mer syre og jordlige toner', o: ['Høy restsødme', 'Mer syre og jordlige toner', 'Mye tropisk frukt'], c: 'Smaking', d: 'hard' },
  { q: 'Hva betyr “brut” på musserende?', a: 'Tørr', o: ['Søt', 'Halvtørr', 'Tørr'], c: 'Produksjon', d: 'easy' },
  { q: 'Malolaktisk gjæring gjør ofte vinen?', a: 'Mykere', o: ['Mer bitter', 'Mykere', 'Mer perlende'], c: 'Produksjon', d: 'medium' },
  { q: 'Hva gjør lagring på eikefat ofte med vin?', a: 'Gir krydder/vaniljepreg', o: ['Gir lavere syre', 'Gjør den musserende', 'Gir krydder/vaniljepreg'], c: 'Produksjon', d: 'medium' },
  { q: 'Champagnemetoden innebærer andregangsgjæring?', a: 'På flaske', o: ['På tank', 'På flaske', 'I eikefat'], c: 'Produksjon', d: 'hard' },
  { q: 'Hva er “sur lie” lagring?', a: 'Lagring på bunnfall', o: ['Lagring i stål', 'Lagring på bunnfall', 'Lagring i amfora'], c: 'Produksjon', d: 'hard' },
  { q: 'Klassisk match til geitost?', a: 'Sauvignon Blanc', o: ['Shiraz', 'Sauvignon Blanc', 'Portvin'], c: 'Mat & vin', d: 'easy' },
  { q: 'Rødvin med høy tannin passer ofte best til?', a: 'Fettrikt kjøtt', o: ['Sushi', 'Fettrikt kjøtt', 'Fruktsalat'], c: 'Mat & vin', d: 'easy' },
  { q: 'Hva passer ofte godt til spicy mat?', a: 'Lett sødmefull hvitvin', o: ['Tung tanninrik rød', 'Lett sødmefull hvitvin', 'Tørr sherry'], c: 'Mat & vin', d: 'medium' },
  { q: 'Hvilken vintype er klassisk til blåmuggost?', a: 'Søtvin', o: ['Søtvin', 'Ung prosecco', 'Tørr rosé'], c: 'Mat & vin', d: 'medium' },
  { q: 'Østers serveres ofte med?', a: 'Muscadet/Chablis', o: ['Muscadet/Chablis', 'Amarone', 'Zinfandel'], c: 'Mat & vin', d: 'hard' },
]

const LEVELS = ['easy', 'medium', 'hard']
const prettyLevel = { easy: 'Lett', medium: 'Middels', hard: 'Ekspert' }
const QUESTIONS_PER_ROUND = 12
const ROUND_SECONDS = 20
const STORAGE_KEY = 'vinquiz-premium-history-v1'

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)
const nowDateKey = () => new Date().toISOString().slice(0, 10)

function seededPick(arr, n, seed) {
  const copy = [...arr]
  let x = seed || 17
  const out = []
  while (copy.length && out.length < n) {
    x = (x * 9301 + 49297) % 233280
    const idx = x % copy.length
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}

function App() {
  const [phase, setPhase] = useState('setup')
  const [name, setName] = useState('')
  const [level, setLevel] = useState('medium')
  const [mode, setMode] = useState('classic')
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timer, setTimer] = useState(ROUND_SECONDS)
  const [feedback, setFeedback] = useState('')
  const [categoryStats, setCategoryStats] = useState({})
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  const current = questions[index]

  useEffect(() => {
    if (phase !== 'play') return
    const t = setInterval(() => setTimer((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [phase, index])

  useEffect(() => {
    if (phase !== 'play') return
    if (timer > 0) return
    onAnswer('__TIMEOUT__')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, phase])

  const scorePct = questions.length ? Math.round((score / questions.length) * 100) : 0

  const strongestWeakest = useMemo(() => {
    const rows = Object.entries(categoryStats).map(([cat, s]) => ({ cat, pct: s.total ? (s.correct / s.total) * 100 : 0, ...s }))
    if (!rows.length) return { strong: null, weak: null }
    const sorted = [...rows].sort((a, b) => b.pct - a.pct)
    return { strong: sorted[0], weak: sorted[sorted.length - 1] }
  }, [categoryStats])

  const achievements = useMemo(() => {
    const list = []
    if (scorePct >= 85) list.push('🏆 Grand Cru Genius')
    if (bestStreak >= 5) list.push('🔥 Hot Streak')
    if (Object.keys(categoryStats).length >= 4) list.push('🧭 Allrounder')
    if (strongestWeakest.strong?.pct >= 90) list.push('✨ Kategori-konge')
    return list
  }, [scorePct, bestStreak, categoryStats, strongestWeakest])

  function buildQuestions() {
    const pool = QUESTION_BANK.filter((q) => q.d === level)
    if (mode === 'daily') {
      const seed = Number(nowDateKey().replaceAll('-', '')) % 99991
      return seededPick(pool, QUESTIONS_PER_ROUND, seed).map((q) => ({ ...q, o: shuffle(q.o) }))
    }
    return shuffle(pool).slice(0, QUESTIONS_PER_ROUND).map((q) => ({ ...q, o: shuffle(q.o) }))
  }

  function startGame() {
    setQuestions(buildQuestions())
    setIndex(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setFeedback('')
    setTimer(ROUND_SECONDS)
    setCategoryStats({})
    setPhase('play')
  }

  function onAnswer(option) {
    if (!current) return
    const isCorrect = option === current.a

    setCategoryStats((prev) => {
      const old = prev[current.c] || { correct: 0, total: 0 }
      return {
        ...prev,
        [current.c]: { correct: old.correct + (isCorrect ? 1 : 0), total: old.total + 1 },
      }
    })

    if (isCorrect) {
      setScore((s) => s + 1)
      setStreak((s) => {
        const next = s + 1
        setBestStreak((b) => Math.max(b, next))
        return next
      })
      setFeedback('Riktig! Elegant svar 🍷')
    } else if (option === '__TIMEOUT__') {
      setStreak(0)
      setFeedback(`Tiden ute! Riktig svar: ${current.a}`)
    } else {
      setStreak(0)
      setFeedback(`Nesten! Riktig svar: ${current.a}`)
    }

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setPhase('result')
      } else {
        setIndex((i) => i + 1)
        setTimer(ROUND_SECONDS)
        setFeedback('')
      }
    }, 700)
  }

  function saveSessionAndFinish() {
    const entry = {
      ts: new Date().toISOString(),
      name: name || 'Vinelsker',
      level,
      mode,
      score,
      total: questions.length,
      pct: scorePct,
      bestStreak,
      categories: categoryStats,
    }
    const next = [entry, ...history].slice(0, 20)
    setHistory(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  useEffect(() => {
    if (phase === 'result' && questions.length) saveSessionAndFinish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const avgPct = history.length ? Math.round(history.reduce((a, b) => a + b.pct, 0) / history.length) : 0

  return (
    <div className="app">
      <header className="hero">
        <h1>VinQuiz Premium</h1>
        <p>Spillbar læring med nivåer, daglig challenge, streaks og smart kategori-analyse.</p>
      </header>

      {phase === 'setup' && (
        <section className="card setup">
          <div className="grid2">
            <div>
              <label>Navn</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="F.eks. Sommelier Sara" />

              <label>Vanskelighetsgrad</label>
              <div className="chips">
                {LEVELS.map((l) => <button key={l} className={level === l ? 'active' : ''} onClick={() => setLevel(l)}>{prettyLevel[l]}</button>)}
              </div>

              <label>Modus</label>
              <div className="chips">
                <button className={mode === 'classic' ? 'active' : ''} onClick={() => setMode('classic')}>Classic</button>
                <button className={mode === 'daily' ? 'active' : ''} onClick={() => setMode('daily')}>Daily Challenge</button>
              </div>

              <button className="primary" onClick={startGame}>Start premium-runde</button>
            </div>

            <div className="miniStats">
              <h3>Din progresjon</h3>
              <p>Snittscore: <strong>{avgPct}%</strong></p>
              <p>Tidligere runder: <strong>{history.length}</strong></p>
              <p>Dagens challenge: <strong>{nowDateKey()}</strong></p>
            </div>
          </div>
        </section>
      )}

      {phase === 'play' && current && (
        <section className="card play">
          <div className="topline">
            <span>{name || 'Vinelsker'} • {prettyLevel[level]} • {mode === 'daily' ? 'Daily' : 'Classic'}</span>
            <span>Spm {index + 1}/{questions.length}</span>
            <span>Poeng {score}</span>
            <span>🔥 {streak}</span>
          </div>

          <div className="progressWrap"><div className="progress" style={{ width: `${(timer / ROUND_SECONDS) * 100}%` }} /></div>

          <div className="meta">
            <span className="pill">Kategori: {current.c}</span>
            <span className="pill">Tid igjen: {timer}s</span>
          </div>

          <h2>{current.q}</h2>
          <div className="answers">
            {current.o.map((opt) => <button key={opt} onClick={() => onAnswer(opt)}>{opt}</button>)}
          </div>
          <p className="feedback">{feedback}</p>
        </section>
      )}

      {phase === 'result' && (
        <section className="card result">
          <h2>Resultat for {name || 'Vinelsker'}</h2>
          <p className="big">{score}/{questions.length} • {scorePct}%</p>

          <div className="achievements">
            {achievements.length ? achievements.map((a) => <span key={a} className="ach">{a}</span>) : <span className="ach">🎯 Fortsett – neste badge er nær!</span>}
          </div>

          <h3>Styrke/svakhet</h3>
          <p><strong>Best:</strong> {strongestWeakest.strong ? `${strongestWeakest.strong.cat} (${Math.round(strongestWeakest.strong.pct)}%)` : '-'}</p>
          <p><strong>Jobb med:</strong> {strongestWeakest.weak ? `${strongestWeakest.weak.cat} (${Math.round(strongestWeakest.weak.pct)}%)` : '-'}</p>

          <div className="categoryList">
            {Object.entries(categoryStats).map(([cat, s]) => {
              const pct = Math.round((s.correct / s.total) * 100)
              return (
                <div key={cat} className="catRow">
                  <div className="catHead"><span>{cat}</span><span>{s.correct}/{s.total} • {pct}%</span></div>
                  <div className="bar"><div className="fill" style={{ width: `${pct}%` }} /></div>
                </div>
              )
            })}
          </div>

          <div className="row">
            <button className="primary" onClick={startGame}>Ny runde</button>
            <button onClick={() => setPhase('setup')}>Hjem</button>
          </div>
        </section>
      )}
    </div>
  )
}

export default App
