import { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import Quiz from './components/Quiz';
import Results from './components/Results';
import sampleQuestions from './data/sampleQuestions.json';
import quizConfig from './data/quizConfig.json';
import './App.css';

const questions = sampleQuestions.map((q, i) => ({ ...q, id: q.id ?? i + 1 }));

export default function App() {
  const [playerName, setPlayerName] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = (
    <button
      className="theme-toggle"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle theme"
    >
      <span className="toggle-icon">{dark ? '☀' : '☽'}</span>
    </button>
  );

  if (!playerName) {
    return (
      <div className="shell">
        <nav className="topbar">
          <span className="brand">QuizPractice</span>
          {toggle}
        </nav>
        <main className="main">
          <StartScreen
            quizTitle={quizConfig.title}
            totalQuestions={questions.length}
            onStart={setPlayerName}
          />
        </main>
      </div>
    );
  }

  if (answers) {
    return (
      <div className="shell">
        <nav className="topbar">
          <span className="brand">QuizPractice</span>
          {toggle}
        </nav>
        <main className="main">
          <Results
            quizTitle={quizConfig.title}
            playerName={playerName}
            questions={questions}
            answers={answers}
            googleSheetUrl={quizConfig.googleSheetUrl}
            onRestart={() => { setPlayerName(null); setAnswers(null); }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="shell">
      <nav className="topbar">
        <span className="brand">{quizConfig.title}</span>
        <span className="topbar-meta">{playerName}</span>
        {toggle}
      </nav>
      <main className="main">
        <Quiz questions={questions} onFinish={setAnswers} />
      </main>
    </div>
  );
}
