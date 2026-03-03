import { useState } from 'react';

export default function StartScreen({ quizTitle, totalQuestions, onStart }) {
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  }

  return (
    <div className="start-screen">
      <h1 className="app-title">{quizTitle}</h1>
      <p className="app-subtitle">{totalQuestions} Questions</p>

      <form className="name-form" onSubmit={handleSubmit}>
        <label htmlFor="player-name">Enter your name to begin</label>
        <input
          id="player-name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <button type="submit" disabled={!name.trim()}>
          Start Quiz
        </button>
      </form>
    </div>
  );
}
