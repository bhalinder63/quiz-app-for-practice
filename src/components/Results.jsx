import { useEffect, useRef, useMemo } from 'react';

export default function Results({ quizTitle, playerName, questions, answers, googleSheetUrl, onRestart }) {
  const saved = useRef(false);
  const total = questions.length;

  const { correct, incorrect, details, percentage } = useMemo(() => {
    let c = 0;
    const wrong = [];
    const det = [];

    questions.forEach((q, i) => {
      const userAnswer = answers[q.id] ?? '(not answered)';
      const isCorrect = userAnswer === q.answer;
      if (isCorrect) c++;
      else wrong.push({ question: q.question, yourAnswer: userAnswer, correctAnswer: q.answer });
      det.push({ qNo: i + 1, question: q.question, userAnswer, correctAnswer: q.answer, result: isCorrect ? 'Correct' : 'Wrong' });
    });

    return { correct: c, incorrect: wrong, details: det, percentage: Math.round((c / questions.length) * 100) };
  }, [questions, answers]);

  let grade;
  if (percentage >= 90) grade = 'Excellent';
  else if (percentage >= 70) grade = 'Good';
  else if (percentage >= 50) grade = 'Average';
  else grade = 'Poor';

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    const payload = { name: playerName, quiz: quizTitle, score: `${correct}/${total}`, percentage, grade, correct, incorrect: total - correct, date: new Date().toLocaleString(), details };

    fetch(new URL('/api/history', window.location.origin).href, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    }).catch(() => {});

    if (googleSheetUrl) {
      fetch(googleSheetUrl, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload),
      }).catch(() => {});
    }
  }, [playerName, quizTitle, correct, total, percentage, grade, googleSheetUrl, details]);

  const gradeClass = grade.toLowerCase();
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="results">
      <div className="results-hero">
        <div className={`ring ring--${gradeClass}`}>
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" className="ring-track" />
            <circle cx="60" cy="60" r="54" className="ring-value"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="ring-label">
            <span className="ring-pct">{percentage}</span>
            <span className="ring-pct-sign">%</span>
          </div>
        </div>

        <h2 className="results-grade">{grade}</h2>
        <p className="results-sub">{playerName} &middot; {quizTitle}</p>
      </div>

      <div className="results-stats">
        <div className="stat stat--correct">
          <div className="stat-value">{correct}</div>
          <div className="stat-key">Correct</div>
        </div>
        <div className="stat stat--wrong">
          <div className="stat-value">{total - correct}</div>
          <div className="stat-key">Wrong</div>
        </div>
        <div className="stat">
          <div className="stat-value">{total}</div>
          <div className="stat-key">Total</div>
        </div>
      </div>

      {incorrect.length > 0 && (
        <div className="review">
          <h3 className="review-heading">Review</h3>
          <div className="review-list">
            {incorrect.map((item, i) => (
              <div key={i} className="review-card">
                <p className="review-q">{item.question}</p>
                <div className="review-answers">
                  <div className="review-ans review-ans--wrong">
                    <span className="review-icon">✕</span>
                    <span>{item.yourAnswer}</span>
                  </div>
                  <div className="review-ans review-ans--right">
                    <span className="review-icon">✓</span>
                    <span>{item.correctAnswer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {incorrect.length === 0 && (
        <div className="perfect">
          <span className="perfect-icon">★</span>
          Perfect score — every answer was correct.
        </div>
      )}

      <button className="btn btn-primary btn-lg results-btn" onClick={onRestart}>
        Retake Quiz
      </button>
    </div>
  );
}
