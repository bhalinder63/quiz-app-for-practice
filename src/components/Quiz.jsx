import { useState } from 'react';

export default function Quiz({ questions, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  const q = questions[idx];
  const total = questions.length;
  const isLast = idx === total - 1;
  const progress = ((idx + 1) / total) * 100;

  function pick(option) {
    setSelected(option);
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
  }

  function next() {
    if (selected === null) return;
    if (isLast) {
      onFinish(answers);
    } else {
      setIdx((i) => i + 1);
      setSelected(answers[questions[idx + 1]?.id] ?? null);
    }
  }

  function prev() {
    if (idx === 0) return;
    setIdx((i) => i - 1);
    setSelected(answers[questions[idx - 1]?.id] ?? null);
  }

  return (
    <div className="quiz">
      <div className="quiz-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-label">{idx + 1} of {total}</div>
      </div>

      <div className="quiz-body" key={idx}>
        <h2 className="quiz-question">{q.question}</h2>

        <div className="quiz-options">
          {q.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isSel = selected === opt;
            return (
              <button
                key={i}
                className={`opt ${isSel ? 'opt--active' : ''}`}
                onClick={() => pick(opt)}
              >
                <span className="opt-key">{letter}</span>
                <span className="opt-label">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="quiz-nav">
        <button className="btn btn-ghost" onClick={prev} disabled={idx === 0}>
          ← Previous
        </button>
        <button className="btn btn-primary" onClick={next} disabled={!selected}>
          {isLast ? 'Submit' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
