import { useEffect, useRef, useMemo } from 'react';

export default function Results({ quizTitle, playerName, questions, answers, googleSheetUrl, onRestart }) {
  const saved = useRef(false);
  const total = questions.length;

  const { correct, incorrect, details, percentage } = useMemo(() => {
    let correctCount = 0;
    const incorrectList = [];
    const detailList = [];

    questions.forEach((q, i) => {
      const userAnswer = answers[q.id] ?? '(not answered)';
      const isCorrect = userAnswer === q.answer;
      if (isCorrect) {
        correctCount++;
      } else {
        incorrectList.push({
          question: q.question,
          yourAnswer: userAnswer,
          correctAnswer: q.answer,
        });
      }
      detailList.push({
        qNo: i + 1,
        question: q.question,
        userAnswer,
        correctAnswer: q.answer,
        result: isCorrect ? 'Correct' : 'Wrong',
      });
    });

    return {
      correct: correctCount,
      incorrect: incorrectList,
      details: detailList,
      percentage: Math.round((correctCount / questions.length) * 100),
    };
  }, [questions, answers]);

  let grade;
  if (percentage >= 90) grade = 'Excellent';
  else if (percentage >= 70) grade = 'Good';
  else if (percentage >= 50) grade = 'Average';
  else grade = 'Poor';

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;

    const payload = {
      name: playerName,
      quiz: quizTitle,
      score: `${correct}/${total}`,
      percentage,
      grade,
      correct,
      incorrect: total - correct,
      date: new Date().toLocaleString(),
      details,
    };

    fetch(new URL('/api/history', window.location.origin).href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});

    if (googleSheetUrl) {
      fetch(googleSheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  }, [playerName, quizTitle, correct, total, percentage, grade, googleSheetUrl, details]);

  const gradeClass = grade.toLowerCase();

  return (
    <div className="results-container">
      <h2 className="results-title">Quiz Complete!</h2>
      <p className="results-player">{playerName}</p>

      <div className={`score-card ${gradeClass}`}>
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
