import { useEffect, useRef, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars -- `motion` is used via JSX member expressions (<motion.button>, <motion.circle>, <motion.span>)
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { X, Check, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Results({ quizTitle, playerName, questions, answers, googleSheetUrl, onRestart }) {
  const saved = useRef(false);
  const celebrated = useRef(false);
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

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, percentage, { duration: 1.2, ease: [0.4, 0, 0.2, 1] });
    return controls.stop;
  }, [count, percentage]);

  useEffect(() => {
    if (celebrated.current || grade !== 'Excellent') return;
    celebrated.current = true;
    const timer = setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 80,
        startVelocity: 38,
        origin: { y: 0.35 },
        colors: ['#7c3aed', '#a855f7', '#34d399', '#fbbf24'],
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [grade]);

  return (
    <div className="results">
      <div className="results-hero">
        <div className={`ring ring--${gradeClass}`}>
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" className="ring-track" />
            <motion.circle
              cx="60" cy="60" r="54" className="ring-value"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            />
          </svg>
          <div className="ring-label">
            <motion.span className="ring-pct">{rounded}</motion.span>
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
                    <X className="review-icon" size={14} strokeWidth={3} />
                    <span>{item.yourAnswer}</span>
                  </div>
                  <div className="review-ans review-ans--right">
                    <Check className="review-icon" size={14} strokeWidth={3} />
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
          <Star className="perfect-icon" size={18} strokeWidth={2.5} fill="currentColor" />
          Perfect score — every answer was correct.
        </div>
      )}

      <motion.button
        className="btn btn-primary btn-lg results-btn"
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        onClick={onRestart}
      >
        Retake Quiz
      </motion.button>
    </div>
  );
}
