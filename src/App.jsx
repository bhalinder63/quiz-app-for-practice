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

  function handleStart(name) {
    setPlayerName(name);
  }

  function handleFinish(userAnswers) {
    setAnswers(userAnswers);
  }

  function handleRestart() {
    setPlayerName(null);
    setAnswers(null);
  }

  const toggle = (
    <button className="theme-toggle" onClick={() => setDark((d) => !d)} title="Toggle theme">
      {dark ? '☀︎' : '☾'}
    </button>
  );

  if (!playerName) {
    return (
      <div className="app">
        {toggle}
        <StartScreen
          quizTitle={quizConfig.title}
          totalQuestions={questions.length}
          onStart={handleStart}
        />
      </div>
    );
  }

  if (answers) {
    return (
      <div className="app">
        {toggle}
        <Results
          quizTitle={quizConfig.title}
          playerName={playerName}
          questions={questions}
          answers={answers}
          googleSheetUrl={quizConfig.googleSheetUrl}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  return (
    <div className="app">
      {toggle}
      <h1 className="app-title">{quizConfig.title}</h1>
      <p className="app-subtitle">{playerName} &middot; {questions.length} Questions</p>
      <Quiz questions={questions} onFinish={handleFinish} />
    </div>
  );
}
