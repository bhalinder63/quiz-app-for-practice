import { useState } from 'react';
// eslint-disable-next-line no-unused-vars -- `motion` is used via JSX member expressions (<motion.div>)
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const questionVariants = {
  enter: (dir) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

const optionsContainer = {
  center: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const optionItem = {
  enter: { y: 10, opacity: 0 },
  center: { y: 0, opacity: 1 },
};

const springTap = { type: 'spring', stiffness: 500, damping: 30 };

export default function Quiz({ questions, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [dir, setDir] = useState(1);

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
      setDir(1);
      setIdx((i) => i + 1);
      setSelected(answers[questions[idx + 1]?.id] ?? null);
    }
  }

  function prev() {
    if (idx === 0) return;
    setDir(-1);
    setIdx((i) => i - 1);
    setSelected(answers[questions[idx - 1]?.id] ?? null);
  }

  return (
    <div className="quiz">
      <div className="quiz-progress">
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <div className="progress-label">{idx + 1} of {total}</div>
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          className="quiz-body"
          key={idx}
          custom={dir}
          variants={questionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className="quiz-question">{q.question}</h2>

          <motion.div className="quiz-options" variants={optionsContainer} initial="enter" animate="center">
            {q.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isSel = selected === opt;
              return (
                <motion.button
                  key={i}
                  variants={optionItem}
                  whileTap={{ scale: 0.97 }}
                  transition={springTap}
                  className={`opt ${isSel ? 'opt--active' : ''}`}
                  onClick={() => pick(opt)}
                >
                  <span className="opt-key">{letter}</span>
                  <span className="opt-label">{opt}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="quiz-nav">
        <motion.button
          className="btn btn-ghost"
          whileTap={{ scale: 0.96 }}
          transition={springTap}
          onClick={prev}
          disabled={idx === 0}
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Previous
        </motion.button>
        <motion.button
          className="btn btn-primary"
          whileTap={{ scale: 0.96 }}
          transition={springTap}
          onClick={next}
          disabled={!selected}
        >
          {isLast ? 'Submit' : <>Next <ArrowRight size={16} strokeWidth={2.5} /></>}
        </motion.button>
      </div>
    </div>
  );
}
