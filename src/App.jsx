import { useMemo, useState } from 'react'
import './App.css'

const QUESTION_BANK = [
  // DRUER
  { q: 'Hvilken drue er hoveddruen i Chablis?', a: 'Chardonnay', o: ['Sauvignon Blanc', 'Riesling', 'Chardonnay'], c: 'Druer', d: 'easy' },
  { q: 'Hvilken drue forbindes mest med Barolo?', a: 'Nebbiolo', o: ['Sangiovese', 'Nebbiolo', 'Barbera'], c: 'Druer', d: 'easy' },
  { q: 'Hva er den mest brukte blå druen i Rioja Reserva?', a: 'Tempranillo', o: ['Tempranillo', 'Garnacha', 'Monastrell'], c: 'Druer', d: 'easy' },
  { q: 'Hvilken drue er kjent for pepperpreg i Nord-Rhône?', a: 'Syrah', o: ['Malbec', 'Syrah', 'Carmenère'], c: 'Druer', d: 'medium' },
  { q: 'Hvilken drue er sentral i Sancerre?', a: 'Sauvignon Blanc', o: ['Chenin Blanc', 'Sauvignon Blanc', 'Viognier'], c: 'Druer', d: 'medium' },
  { q: 'Hvilken drue dominerer Amarone?', a: 'Corvina', o: ['Dolcetto', 'Corvina', 'Nero d’Avola'], c: 'Druer', d: 'hard' },

  // REGIONER
  { q: 'Bordeaux ligger i hvilket land?', a: 'Frankrike', o: ['Italia', 'Frankrike', 'Spania'], c: 'Regioner', d: 'easy' },
  { q: 'Chianti kommer fra hvilken italiensk region?', a: 'Toscana', o: ['Piemonte', 'Sicilia', 'Toscana'], c: 'Regioner', d: 'easy' },
  { q: 'Napa Valley ligger i hvilken delstat?', a: 'California', o: ['Oregon', 'Washington', 'California'], c: 'Regioner', d: 'easy' },
  { q: 'Douro er kjent for hvilken vintype?', a: 'Portvin', o: ['Cava', 'Portvin', 'Sherry'], c: 'Regioner', d: 'medium' },
  { q: 'Marlborough er spesielt kjent for?', a: 'Sauvignon Blanc', o: ['Pinotage', 'Sauvignon Blanc', 'Grenache'], c: 'Regioner', d: 'medium' },
  { q: 'Priorat er en region i?', a: 'Spania', o: ['Portugal', 'Spania', 'Argentina'], c: 'Regioner', d: 'hard' },

  // SMAKING
  { q: 'Hva beskriver “tannin” best?', a: 'Snerpende munnfølelse', o: ['Sukkerinnhold', 'Snerpende munnfølelse', 'Alkoholstyrke'], c: 'Smaking', d: 'easy' },
  { q: 'Hva betyr “syrefrisk” vin?', a: 'Høy syre', o: ['Høy syre', 'Høy alkohol', 'Mye eik'], c: 'Smaking', d: 'easy' },
  { q: 'Hva er “kropp” i vin?', a: 'Følelse av fylde', o: ['Mengde bobler', 'Følelse av fylde', 'Temperatur'], c: 'Smaking', d: 'easy' },
  { q: 'Primæraromaer kommer hovedsakelig fra?', a: 'Druen', o: ['Druen', 'Fatet', 'Lagring på flaske'], c: 'Smaking', d: 'medium' },
  { q: 'Hva er “finish” i vinsmaking?', a: 'Ettersmakens lengde', o: ['Fargen på vinen', 'Ettersmakens lengde', 'Hvor raskt du drikker'], c: 'Smaking', d: 'medium' },
  { q: 'Hva kjennetegner ofte en “old world”-stil?', a: 'Mer syre og jordlige toner', o: ['Høy restsødme', 'Mer syre og jordlige toner', 'Mye tropisk frukt'], c: 'Smaking', d: 'hard' },

  // PRODUKSJON
  { q: 'Hva betyr “brut” på musserende?', a: 'Tørr', o: ['Søt', 'Halvtørr', 'Tørr'], c: 'Produksjon', d: 'easy' },
  { q: 'Malolaktisk gjæring gjør ofte vinen?', a: 'Mykere', o: ['Mer bitter', 'Mykere', 'Mer perlende'], c: 'Produksjon', d: 'medium' },
  { q: 'Hva gjør lagring på eikefat ofte med vin?', a: 'Gir krydder/vaniljepreg', o: ['Gir lavere syre', 'Gjør den musserende', 'Gir krydder/vaniljepreg'], c: 'Produksjon', d: 'medium' },
  { q: 'Champagnemetoden innebærer andregangsgjæring?', a: 'På flaske', o: ['På tank', 'På flaske', 'I eikefat'], c: 'Produksjon', d: 'hard' },
  { q: 'Hva er “sur lie” lagring?', a: 'Lagring på bunnfall', o: ['Lagring i stål', 'Lagring på bunnfall', 'Lagring i amfora'], c: 'Produksjon', d: 'hard' },

  // MAT & VIN
  { q: 'Klassisk match til geitost?', a: 'Sauvignon Blanc', o: ['Shiraz', 'Sauvignon Blanc', 'Portvin'], c: 'Mat & vin', d: 'easy' },
  { q: 'Rødvin med høy tannin passer ofte best til?', a: 'Fettrikt kjøtt', o: ['Sushi', 'Fettrikt kjøtt', 'Fruktsalat'], c: 'Mat & vin', d: 'easy' },
  { q: 'Hva passer ofte godt til spicy mat?', a: 'Lett sødmefull hvitvin', o: ['Tung tanninrik rød', 'Lett sødmefull hvitvin', 'Tørr sherry'], c: 'Mat & vin', d: 'medium' },
  { q: 'Hvilken vintype er klassisk til blåmuggost?', a: 'Søtvin', o: ['Søtvin', 'Ung prosecco', 'Tørr rosé'], c: 'Mat & vin', d: 'medium' },
  { q: 'Østers serveres ofte med?', a: 'Muscadet/Chablis', o: ['Muscadet/Chablis', 'Amarone', 'Zinfandel'], c: 'Mat & vin', d: 'hard' },
]

const LEVELS = ['easy', 'medium', 'hard']
const QUESTIONS_PER_ROUND = 12

const prettyLevel = { easy: 'Lett', medium: 'Middels', hard: 'Vanskelig' }

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function App() {
  const [phase, setPhase] = useState('setup')
  const [level, setLevel] = useState('medium')
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [categoryStats, setCategoryStats] = useState({})

  const current = questions[index]

  const scorePct = questions.length ? Math.round((score / questions.length) * 100) : 0

  const strongestWeakest = useMemo(() => {
    const rows = Object.entries(categoryStats).map(([cat, s]) => ({
      cat,
      pct: s.total ? (s.correct / s.total) * 100 : 0,
      ...s,
    }))
    if (!rows.length) return { strong: null, weak: null }
    const sorted = [...rows].sort((a, b) => b.pct - a.pct)
    return { strong: sorted[0], weak: sorted[sorted.length - 1] }
  }, [categoryStats])

  function startGame() {
    const pool = QUESTION_BANK.filter((q) => q.d === level)
    const picked = shuffle(pool).slice(0, QUESTIONS_PER_ROUND).map((q) => ({ ...q, o: shuffle(q.o) }))
    setQuestions(picked)
    setIndex(0)
    setScore(0)
    setStreak(0)
    setFeedback('')
    setCategoryStats({})
    setPhase('play')
  }

  function answer(option) {
    const isCorrect = option === current.a
    const cat = current.c

    setCategoryStats((prev) => {
      const old = prev[cat] || { correct: 0, total: 0 }
      return {
        ...prev,
        [cat]: {
          correct: old.correct + (isCorrect ? 1 : 0),
          total: old.total + 1,
        },
      }
    })

    if (isCorrect) {
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
      setFeedback('Riktig! 🍷')
    } else {
      setStreak(0)
      setFeedback(`Feil. Riktig svar er: ${current.a}`)
    }

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setPhase('result')
      } else {
        setIndex((i) => i + 1)
        setFeedback('')
      }
    }, 700)
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>VinQuiz Master</h1>
        <p>Lær vin på en måte som faktisk er gøy — med nivåvalg, kategori-score og tydelige styrker/svakheter.</p>
      </header>

      {phase === 'setup' && (
        <section className="card setup">
          <h2>Velg vanskelighetsgrad</h2>
          <div className="levels">
            {LEVELS.map((l) => (
              <button key={l} className={level === l ? 'active' : ''} onClick={() => setLevel(l)}>{prettyLevel[l]}</button>
            ))}
          </div>
          <p>Runde: {QUESTIONS_PER_ROUND} spørsmål • Nivå: <strong>{prettyLevel[level]}</strong></p>
          <button className="primary" onClick={startGame}>Start quiz</button>
        </section>
      )}

      {phase === 'play' && current && (
        <section className="card play">
          <div className="topline">
            <span>Spørsmål {index + 1}/{questions.length}</span>
            <span>Poeng: {score}</span>
            <span>🔥 Streak: {streak}</span>
          </div>

          <div className="meta">
            <span className="pill">Kategori: {current.c}</span>
            <span className="pill">Nivå: {prettyLevel[current.d]}</span>
          </div>

          <h2>{current.q}</h2>

          <div className="answers">
            {current.o.map((opt) => (
              <button key={opt} onClick={() => answer(opt)}>{opt}</button>
            ))}
          </div>

          <p className="feedback">{feedback}</p>
        </section>
      )}

      {phase === 'result' && (
        <section className="card result">
          <h2>Resultat</h2>
          <p className="big">{score} / {questions.length} ({scorePct}%)</p>

          <h3>Kategori-oversikt</h3>
          <div className="categoryList">
            {Object.entries(categoryStats).map(([cat, s]) => {
              const pct = Math.round((s.correct / s.total) * 100)
              return (
                <div key={cat} className="catRow">
                  <div className="catHead">
                    <span>{cat}</span>
                    <span>{s.correct}/{s.total} • {pct}%</span>
                  </div>
                  <div className="bar">
                    <div className="fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="insight">
            <p><strong>Styrke:</strong> {strongestWeakest.strong ? `${strongestWeakest.strong.cat} (${Math.round(strongestWeakest.strong.pct)}%)` : '-'}</p>
            <p><strong>Forbedringsområde:</strong> {strongestWeakest.weak ? `${strongestWeakest.weak.cat} (${Math.round(strongestWeakest.weak.pct)}%)` : '-'}</p>
          </div>

          <div className="row">
            <button className="primary" onClick={startGame}>Spill igjen</button>
            <button onClick={() => setPhase('setup')}>Endre nivå</button>
          </div>
        </section>
      )}
    </div>
  )
}

export default App
