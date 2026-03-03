import { useState } from 'react';

export default function Quiz({ questions, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  const current = questions[currentIndex];
  const total = questions.length;
  const isLast = currentIndex === total - 1;

  function handleSelect(option) {
    setSelected(option);
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
  }

  function handleNext() {
    if (selected === null) return;
    if (isLast) {
      onFinish(answers);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(answers[questions[currentIndex + 1]?.id] ?? null);
    }
  }

  function handlePrev() {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
    setSelected(answers[questions[currentIndex - 1]?.id] ?? null);
  }

  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="quiz-container">
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="question-counter">
        Question {currentIndex + 1} of {total}
      </p>

      <h2 className="question-text">{current.question}</h2>

      <div className="options-list">
        {current.options.map((option, i) => (
          <button
            key={i}
            className={`option-btn ${selected === option ? 'selected' : ''}`}
            onClick={() => handleSelect(option)}
          >
            <span className="option-letter">
              {String.fromCharCode(65 + i)}
            </span>
            {option}
          </button>
        ))}
      </div>

      <div className="nav-buttons">
        <button
          className="nav-btn prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <button
          className="nav-btn next"
          onClick={handleNext}
          disabled={selected === null}
        >
          {isLast ? 'Finish Quiz' : 'Next'}
        </button>
      </div>
    </div>
  );
}
