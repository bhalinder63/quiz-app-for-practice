import { useEffect, useRef } from 'react';

export default function Results({ quizTitle, playerName, questions, answers, googleSheetUrl, onRestart }) {
  const saved = useRef(false);
  const total = questions.length;
  let correct = 0;
  const incorrect = [];

  questions.forEach((q) => {
    if (answers[q.id] === q.answer) {
      correct++;
    } else {
      incorrect.push({
        question: q.question,
        yourAnswer: answers[q.id] ?? '(not answered)',
        correctAnswer: q.answer,
      });
    }
  });

  const percentage = Math.round((correct / total) * 100);

  let grade;
  if (percentage >= 90) grade = 'excellent';
  else if (percentage >= 70) grade = 'good';
  else if (percentage >= 50) grade = 'average';
  else grade = 'poor';

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;

    const payload = {
      name: playerName,
      quiz: quizTitle,
      score: `${correct}/${total}`,
      percentage,
      date: new Date().toLocaleString(),
    };

    fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});

    if (googleSheetUrl) {
      fetch(googleSheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  }, [playerName, quizTitle, correct, total, percentage, googleSheetUrl]);

  return (
    <div className="results-container">
      <h2 className="results-title">Quiz Complete!</h2>
      <p className="results-player">{playerName}</p>

      <div className={`score-card ${grade}`}>
        <div className="score-circle">
          <span className="score-number">{percentage}%</span>
        </div>
        <p className="score-summary">
          You got <strong>{correct}</strong> out of <strong>{total}</strong>{' '}
          correct
        </p>
      </div>

      {incorrect.length > 0 && (
        <div className="incorrect-section">
          <h3>Review Incorrect Answers</h3>
          {incorrect.map((item, i) => (
            <div key={i} className="incorrect-card">
              <p className="incorrect-question">{item.question}</p>
              <p className="your-answer">
                Your answer: <span>{item.yourAnswer}</span>
              </p>
              <p className="correct-answer">
                Correct answer: <span>{item.correctAnswer}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {incorrect.length === 0 && (
        <p className="perfect-msg">
          Perfect score! You answered every question correctly.
        </p>
      )}

      <button className="restart-btn" onClick={onRestart}>
        Take Again
      </button>
    </div>
  );
}
