import { useState } from 'react';

export default function StartScreen({ quizTitle, totalQuestions, onStart }) {
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  }

  return (
    <div className="start">
      <div className="start-content">
        <div className="start-badge">{totalQuestions} questions</div>
        <h1 className="start-title">{quizTitle}</h1>
        <p className="start-desc">
          Test your knowledge. Enter your name below and press start when you are ready.
        </p>

        <form className="start-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={!name.trim()}>
            Start Quiz
          </button>
        </form>
      </div>
    </div>
  );
}
