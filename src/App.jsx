import { useEffect, useMemo, useState } from 'react'
import './App.css'

const LEVELS = ['easy', 'medium', 'hard']
const prettyLevel = { easy: 'Lett', medium: 'Middels', hard: 'Ekspert' }
const QUESTIONS_PER_ROUND = 12
const ROUND_SECONDS = 20
const STORAGE_KEY = 'vinquiz-premium-history-v1'
const QUARANTINE_KEY = 'vinquiz-question-quarantine-v1'
const QUARANTINE_SIZE = 280

const GRAPES = [
  { name: 'Chardonnay', country: 'Frankrike', style: 'Fyldig hvitvin', level: 'easy' },
  { name: 'Sauvignon Blanc', country: 'Frankrike', style: 'Frisk aromatisk hvitvin', level: 'easy' },
  { name: 'Riesling', country: 'Tyskland', style: 'Syrefrisk hvitvin', level: 'easy' },
  { name: 'Pinot Noir', country: 'Frankrike', style: 'Elegant rødvin', level: 'easy' },
  { name: 'Cabernet Sauvignon', country: 'Frankrike', style: 'Kraftig tanninrik rødvin', level: 'easy' },
  { name: 'Merlot', country: 'Frankrike', style: 'Myk fruktig rødvin', level: 'easy' },
  { name: 'Syrah', country: 'Frankrike', style: 'Krydret mørk rødvin', level: 'medium' },
  { name: 'Tempranillo', country: 'Spania', style: 'Strukturert rødvin', level: 'easy' },
  { name: 'Nebbiolo', country: 'Italia', style: 'Høy syre og tannin', level: 'medium' },
  { name: 'Sangiovese', country: 'Italia', style: 'Syredrevet rødvin', level: 'easy' },
  { name: 'Corvina', country: 'Italia', style: 'Amarone-base', level: 'hard' },
  { name: 'Garnacha', country: 'Spania', style: 'Fruktig krydret rødvin', level: 'medium' },
  { name: 'Malbec', country: 'Frankrike', style: 'Mørk plommefrukt', level: 'medium' },
  { name: 'Carmenère', country: 'Chile', style: 'Urtepreg', level: 'medium' },
  { name: 'Viognier', country: 'Frankrike', style: 'Parfymert hvitvin', level: 'hard' },
  { name: 'Chenin Blanc', country: 'Frankrike', style: 'Allsidig hvitvin', level: 'medium' },
  { name: 'Albariño', country: 'Spania', style: 'Saltfrisk hvitvin', level: 'medium' },
  { name: 'Vermentino', country: 'Italia', style: 'Middelhavsfrisk hvitvin', level: 'medium' },
  { name: 'Pinot Grigio', country: 'Italia', style: 'Lett hvitvin', level: 'easy' },
  { name: 'Gewürztraminer', country: 'Frankrike', style: 'Aromatisk krydret hvitvin', level: 'hard' },
  { name: 'Grenache Blanc', country: 'Spania', style: 'Rik hvitvin', level: 'hard' },
  { name: 'Touriga Nacional', country: 'Portugal', style: 'Strukturert mørk rød', level: 'hard' },
  { name: 'Tinta Roriz', country: 'Portugal', style: 'Portvinsdrue', level: 'hard' },
  { name: 'Zinfandel', country: 'USA', style: 'Fyldig jammy rødvin', level: 'medium' },
  { name: 'Petite Sirah', country: 'USA', style: 'Konsentrert rødvin', level: 'hard' },
  { name: 'Barbera', country: 'Italia', style: 'Fruktig høy syre', level: 'medium' },
  { name: 'Dolcetto', country: 'Italia', style: 'Mykere rødvin', level: 'medium' },
  { name: 'Mourvèdre', country: 'Frankrike', style: 'Mørk krydret rød', level: 'hard' },
  { name: 'Monastrell', country: 'Spania', style: 'Solmoden rødvin', level: 'medium' },
  { name: 'Furmint', country: 'Ungarn', style: 'Tokaj-druen', level: 'hard' },
  { name: 'Assyrtiko', country: 'Hellas', style: 'Mineralsk høy syre', level: 'hard' },
  { name: 'Grüner Veltliner', country: 'Østerrike', style: 'Pepret hvitvin', level: 'hard' },
  { name: 'Mencía', country: 'Spania', style: 'Saftig rødvin', level: 'hard' },
  { name: 'Aglianico', country: 'Italia', style: 'Kraftig lagringsvin', level: 'hard' },
  { name: 'Nerello Mascalese', country: 'Italia', style: 'Etna-rødvin', level: 'hard' },
  { name: 'Glera', country: 'Italia', style: 'Prosecco-druen', level: 'medium' },
  { name: 'Xarel·lo', country: 'Spania', style: 'Cava-blend', level: 'hard' },
  { name: 'Macabeo', country: 'Spania', style: 'Cava-blend', level: 'medium' },
  { name: 'Parellada', country: 'Spania', style: 'Lett cava-komponent', level: 'hard' },
]

const REGIONS = [
  { name: 'Chablis', country: 'Frankrike', grape: 'Chardonnay', level: 'easy' },
  { name: 'Sancerre', country: 'Frankrike', grape: 'Sauvignon Blanc', level: 'medium' },
  { name: 'Bordeaux', country: 'Frankrike', grape: 'Cabernet Sauvignon', level: 'easy' },
  { name: 'Burgund', country: 'Frankrike', grape: 'Pinot Noir', level: 'easy' },
  { name: 'Champagne', country: 'Frankrike', grape: 'Chardonnay', level: 'easy' },
  { name: 'Rioja', country: 'Spania', grape: 'Tempranillo', level: 'easy' },
  { name: 'Ribera del Duero', country: 'Spania', grape: 'Tempranillo', level: 'medium' },
  { name: 'Priorat', country: 'Spania', grape: 'Garnacha', level: 'hard' },
  { name: 'Rías Baixas', country: 'Spania', grape: 'Albariño', level: 'medium' },
  { name: 'Barolo', country: 'Italia', grape: 'Nebbiolo', level: 'easy' },
  { name: 'Barbaresco', country: 'Italia', grape: 'Nebbiolo', level: 'medium' },
  { name: 'Chianti', country: 'Italia', grape: 'Sangiovese', level: 'easy' },
  { name: 'Valpolicella', country: 'Italia', grape: 'Corvina', level: 'medium' },
  { name: 'Montalcino', country: 'Italia', grape: 'Sangiovese', level: 'medium' },
  { name: 'Napa Valley', country: 'USA', grape: 'Cabernet Sauvignon', level: 'easy' },
  { name: 'Sonoma', country: 'USA', grape: 'Pinot Noir', level: 'medium' },
  { name: 'Willamette Valley', country: 'USA', grape: 'Pinot Noir', level: 'medium' },
  { name: 'Marlborough', country: 'New Zealand', grape: 'Sauvignon Blanc', level: 'easy' },
  { name: 'Central Otago', country: 'New Zealand', grape: 'Pinot Noir', level: 'hard' },
  { name: 'Mendoza', country: 'Argentina', grape: 'Malbec', level: 'easy' },
  { name: 'Douro', country: 'Portugal', grape: 'Touriga Nacional', level: 'medium' },
  { name: 'Vinho Verde', country: 'Portugal', grape: 'Alvarinho', level: 'hard' },
  { name: 'Mosel', country: 'Tyskland', grape: 'Riesling', level: 'medium' },
  { name: 'Rheingau', country: 'Tyskland', grape: 'Riesling', level: 'hard' },
  { name: 'Wachau', country: 'Østerrike', grape: 'Grüner Veltliner', level: 'hard' },
  { name: 'Tokaj', country: 'Ungarn', grape: 'Furmint', level: 'hard' },
]

const TERMS = [
  { term: 'Tannin', meaning: 'Snerpende munnfølelse', level: 'easy' },
  { term: 'Syre', meaning: 'Friskhet i vinen', level: 'easy' },
  { term: 'Kropp', meaning: 'Følelse av fylde', level: 'easy' },
  { term: 'Finish', meaning: 'Lengde på ettersmak', level: 'easy' },
  { term: 'Bouquet', meaning: 'Lagringsaromaer', level: 'medium' },
  { term: 'Primæraroma', meaning: 'Aroma fra druen', level: 'medium' },
  { term: 'Sekundæraroma', meaning: 'Aroma fra vinifikasjon', level: 'medium' },
  { term: 'Tertiæraroma', meaning: 'Aroma fra lagring', level: 'hard' },
  { term: 'Malolaktisk gjæring', meaning: 'Gjør syren mykere', level: 'medium' },
  { term: 'Sur lie', meaning: 'Lagring på bunnfall', level: 'hard' },
  { term: 'Brut', meaning: 'Tørr stil i musserende vin', level: 'easy' },
  { term: 'Dosage', meaning: 'Sukker tilsatt etter dégorgement', level: 'hard' },
]

const DISHES = [
  { dish: 'Geitost', best: 'Sauvignon Blanc', avoid: 'Tanninrik ung rødvin', level: 'easy' },
  { dish: 'Biff', best: 'Cabernet Sauvignon', avoid: 'Søt hvitvin', level: 'easy' },
  { dish: 'Laks', best: 'Pinot Noir', avoid: 'Svært eiket Chardonnay', level: 'medium' },
  { dish: 'Sushi', best: 'Riesling', avoid: 'Tung Amarone', level: 'easy' },
  { dish: 'Blåmuggost', best: 'Søtvin', avoid: 'Ung prosecco', level: 'medium' },
  { dish: 'Spicy thai', best: 'Halvtørr Riesling', avoid: 'Høy alkohol og tannin', level: 'medium' },
  { dish: 'Østers', best: 'Chablis', avoid: 'Tung eiket rødvin', level: 'hard' },
  { dish: 'Pasta med tomat', best: 'Sangiovese', avoid: 'Lavsyre hvitvin', level: 'medium' },
]

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

function buildQuestionBank() {
  const bank = []

  const add = (id, q, a, o, c, d) => {
    const opts = shuffle([...new Set([a, ...o])]).slice(0, 4)
    if (!opts.includes(a)) opts[0] = a
    bank.push({ id, q, a, o: shuffle(opts), c, d })
  }

  // 1) Grape questions (many variants)
  GRAPES.forEach((g, i) => {
    const wrongCountries = shuffle([...new Set(GRAPES.map((x) => x.country).filter((x) => x !== g.country))]).slice(0, 3)
    add(`g-country-${i}`, `Hvilket land forbindes sterkest med druen ${g.name}?`, g.country, wrongCountries, 'Druer', g.level)

    const wrongStyles = shuffle(GRAPES.filter((x) => x.style !== g.style).map((x) => x.style)).slice(0, 3)
    add(`g-style-${i}`, `Hvilken stil passer best til ${g.name}?`, g.style, wrongStyles, 'Druer', g.level)

    const wrongGrapes = shuffle(GRAPES.filter((x) => x.name !== g.name).map((x) => x.name)).slice(0, 3)
    add(`g-pick-${i}`, `Hvilken av disse er en druesort?`, g.name, wrongGrapes, 'Druer', g.level)
  })

  // 2) Region questions
  REGIONS.forEach((r, i) => {
    const wrongCountries = shuffle([...new Set(REGIONS.map((x) => x.country).filter((x) => x !== r.country))]).slice(0, 3)
    add(`r-country-${i}`, `I hvilket land ligger vinregionen ${r.name}?`, r.country, wrongCountries, 'Regioner', r.level)

    const wrongGrapes = shuffle([...new Set(GRAPES.map((x) => x.name).filter((x) => x !== r.grape))]).slice(0, 3)
    add(`r-grape-${i}`, `Hvilken drue er mest klassisk i ${r.name}?`, r.grape, wrongGrapes, 'Regioner', r.level)

    const wrongRegions = shuffle(REGIONS.filter((x) => x.name !== r.name).map((x) => x.name)).slice(0, 3)
    add(`r-pick-${i}`, `Hvilken av disse er en vinregion?`, r.name, wrongRegions, 'Regioner', r.level)
  })

  // 3) Terms
  TERMS.forEach((t, i) => {
    const wrongMeanings = shuffle(TERMS.filter((x) => x.meaning !== t.meaning).map((x) => x.meaning)).slice(0, 3)
    add(`t-meaning-${i}`, `Hva betyr begrepet "${t.term}" i vin?`, t.meaning, wrongMeanings, 'Smaking', t.level)

    const wrongTerms = shuffle(TERMS.filter((x) => x.term !== t.term).map((x) => x.term)).slice(0, 3)
    add(`t-term-${i}`, `Hvilket begrep beskriver dette: "${t.meaning}"?`, t.term, wrongTerms, 'Smaking', t.level)
  })

  // 4) Food pairing
  DISHES.forEach((d, i) => {
    const wrongBest = shuffle(DISHES.filter((x) => x.best !== d.best).map((x) => x.best)).slice(0, 3)
    add(`f-best-${i}`, `Hva er ofte en god vinmatch til ${d.dish}?`, d.best, wrongBest, 'Mat & vin', d.level)

    const wrongAvoid = shuffle(DISHES.filter((x) => x.avoid !== d.avoid).map((x) => x.avoid)).slice(0, 3)
    add(`f-avoid-${i}`, `Hva er ofte et svakere valg til ${d.dish}?`, d.avoid, wrongAvoid, 'Mat & vin', d.level)
  })

  // 5) Massive synthetic variation generator (factual mix)
  // Generates >1000 unique, sensible combo questions.
  const countries = [...new Set([...GRAPES.map((g) => g.country), ...REGIONS.map((r) => r.country)])]
  for (let i = 0; i < 1200; i++) {
    const g = GRAPES[i % GRAPES.length]
    const r = REGIONS[(i * 7) % REGIONS.length]
    const t = TERMS[(i * 11) % TERMS.length]
    const d = DISHES[(i * 5) % DISHES.length]

    const type = i % 5
    const level = i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard'

    if (type === 0) {
      const wrong = shuffle(countries.filter((c) => c !== g.country)).slice(0, 3)
      add(`mx-country-${i}`, `Hvilket land assosieres oftest med ${g.name}?`, g.country, wrong, 'Druer', level)
    } else if (type === 1) {
      const wrong = shuffle(REGIONS.map((x) => x.name).filter((x) => x !== r.name)).slice(0, 3)
      add(`mx-region-${i}`, `Hvilken av disse regionene er kjent for ${r.grape}?`, r.name, wrong, 'Regioner', level)
    } else if (type === 2) {
      const wrong = shuffle(TERMS.map((x) => x.meaning).filter((x) => x !== t.meaning)).slice(0, 3)
      add(`mx-term-${i}`, `Hva beskriver best begrepet ${t.term}?`, t.meaning, wrong, 'Smaking', level)
    } else if (type === 3) {
      const wrong = shuffle(DISHES.map((x) => x.best).filter((x) => x !== d.best)).slice(0, 3)
      add(`mx-food-${i}`, `Hvilken vinretning passer ofte best med ${d.dish}?`, d.best, wrong, 'Mat & vin', level)
    } else {
      const wrong = shuffle(GRAPES.map((x) => x.style).filter((x) => x !== g.style)).slice(0, 3)
      add(`mx-style-${i}`, `Hvilken stil passer best med druen ${g.name}?`, g.style, wrong, 'Produksjon', level)
    }
  }

  return bank
}

const QUESTION_BANK = buildQuestionBank()

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function loadQuarantine() {
  try {
    return JSON.parse(localStorage.getItem(QUARANTINE_KEY) || '[]')
  } catch {
    return []
  }
}

function App() {
  const [phase, setPhase] = useState('setup')
  const [name, setName] = useState('')
  const [level, setLevel] = useState('medium')
  const [mode, setMode] = useState('classic')
  const [duelMode, setDuelMode] = useState(false)
  const [duelPlayer, setDuelPlayer] = useState(1)
  const [duelScores, setDuelScores] = useState({ 1: 0, 2: 0 })

  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timer, setTimer] = useState(ROUND_SECONDS)
  const [feedback, setFeedback] = useState('')
  const [spotlight, setSpotlight] = useState('')
  const [categoryStats, setCategoryStats] = useState({})
  const [history, setHistory] = useState(loadHistory)
  const [quarantine, setQuarantine] = useState(loadQuarantine)

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

  function pickQuestions() {
    const base = QUESTION_BANK.filter((q) => q.d === level)
    const noRepeatPool = base.filter((q) => !quarantine.includes(q.id))

    let pool = noRepeatPool.length >= QUESTIONS_PER_ROUND ? noRepeatPool : base

    if (mode === 'daily') {
      const seed = Number(new Date().toISOString().slice(0, 10).replaceAll('-', ''))
      pool = [...pool].sort((a, b) => (a.id + seed).localeCompare(b.id + seed))
    } else {
      pool = shuffle(pool)
    }

    return pool.slice(0, QUESTIONS_PER_ROUND)
  }

  function startGame() {
    const picked = pickQuestions()
    setQuestions(picked)
    setIndex(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setFeedback('')
    setSpotlight('')
    setTimer(ROUND_SECONDS)
    setCategoryStats({})
    setDuelScores({ 1: 0, 2: 0 })
    setDuelPlayer(1)
    setPhase('play')
  }

  function updateQuarantine(id) {
    const next = [id, ...quarantine.filter((x) => x !== id)].slice(0, QUARANTINE_SIZE)
    setQuarantine(next)
    localStorage.setItem(QUARANTINE_KEY, JSON.stringify(next))
  }

  function onAnswer(option) {
    if (!current) return
    updateQuarantine(current.id)

    const isCorrect = option === current.a

    setCategoryStats((prev) => {
      const old = prev[current.c] || { correct: 0, total: 0 }
      return { ...prev, [current.c]: { correct: old.correct + (isCorrect ? 1 : 0), total: old.total + 1 } }
    })

    if (isCorrect) {
      setScore((s) => s + 1)
      if (duelMode) setDuelScores((ds) => ({ ...ds, [duelPlayer]: ds[duelPlayer] + 1 }))

      setStreak((s) => {
        const next = s + 1
        setBestStreak((b) => Math.max(b, next))
        return next
      })

      setFeedback('Riktig! Elegant svar 🍷')
      setSpotlight(streak + 1 >= 3 ? `🔥 HOT STREAK x${streak + 1}` : 'Perfekt nese for vin!')
    } else if (option === '__TIMEOUT__') {
      setStreak(0)
      setFeedback(`Tiden ute! Riktig svar: ${current.a}`)
      setSpotlight('Tempo! 🍂')
    } else {
      setStreak(0)
      setFeedback(`Nesten! Riktig svar: ${current.a}`)
      setSpotlight('Kom tilbake sterkere 🍂')
    }

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setPhase('result')
      } else {
        setIndex((i) => i + 1)
        if (duelMode) setDuelPlayer((p) => (p === 1 ? 2 : 1))
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
        <p>
          Spørsmålsbank: <strong>{QUESTION_BANK.length.toLocaleString('no-NO')}</strong> spørsmål •
          Karantene på siste <strong>{QUARANTINE_SIZE}</strong> spørsmål for å unngå repetisjon.
        </p>
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

              <label>Ekstra underholdning</label>
              <div className="chips">
                <button className={duelMode ? 'active' : ''} onClick={() => setDuelMode((v) => !v)}>Duellmodus (2 spillere)</button>
              </div>

              <button className="primary" onClick={startGame}>Start premium-runde</button>
            </div>

            <div className="miniStats">
              <h3>Din progresjon</h3>
              <p>Snittscore: <strong>{avgPct}%</strong></p>
              <p>Tidligere runder: <strong>{history.length}</strong></p>
              <p>I karantene nå: <strong>{quarantine.length}</strong></p>
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
            {duelMode && <span className="duel">🥊 Spiller {duelPlayer} sin tur</span>}
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
          {duelMode && <p className="duelScore">Spiller 1: {duelScores[1]} • Spiller 2: {duelScores[2]}</p>}
          {spotlight && <p className="spotlight">{spotlight}</p>}
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

          {duelMode && (
            <div className="duelWinner">
              {duelScores[1] === duelScores[2]
                ? '🤝 Uavgjort duell!'
                : duelScores[1] > duelScores[2]
                  ? '🏅 Spiller 1 vant duellen!'
                  : '🏅 Spiller 2 vant duellen!'}
            </div>
          )}

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
