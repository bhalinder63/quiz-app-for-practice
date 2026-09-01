import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
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
      {dark
        ? <Sun className="toggle-icon" size={18} strokeWidth={2.25} />
        : <Moon className="toggle-icon" size={18} strokeWidth={2.25} />}
    </button>
  );

  let brand = 'QuizPractice';
  let meta = null;
  let content;

  if (!playerName) {
    content = (
      <StartScreen
        quizTitle={quizConfig.title}
        totalQuestions={questions.length}
        onStart={setPlayerName}
      />
    );
  } else if (answers) {
    content = (
      <Results
        quizTitle={quizConfig.title}
        playerName={playerName}
        questions={questions}
        answers={answers}
        googleSheetUrl={quizConfig.googleSheetUrl}
        onRestart={() => { setPlayerName(null); setAnswers(null); }}
      />
    );
  } else {
    brand = quizConfig.title;
    meta = playerName;
    content = <Quiz questions={questions} onFinish={setAnswers} />;
  }

  return (
    <div className="shell">
      <div className="bg-mesh" aria-hidden="true" />
      <nav className="topbar">
        <span className="brand">{brand}</span>
        {meta && <span className="topbar-meta">{meta}</span>}
        {toggle}
      </nav>
      <main className="main">{content}</main>
    </div>
  );
}
