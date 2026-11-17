import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

const TYPE_LABELS = {
  MultipleChoice: "Multiple choice",
  FillInTheBlank: "Fill in the blank",
  SpotTheBug: "Spot the bug",
  OrderTheLines: "Order the lines",
};

export default function LevelPage() {
  const { id } = useParams();
  // key={id} resets all the state when we move to the next level
  return <LevelView key={id} id={id} />;
}

function LevelView({ id }) {
  const { updateXp } = useAuth();
  const [level, setLevel] = useState(null);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [ordered, setOrdered] = useState([]);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/api/levels/${id}`)
      .then((data) => {
        setLevel(data);
        setOrdered(data.options);
      })
      .catch((err) => {
        if (err.status === 403) setError("This level is locked. Complete the previous levels first.");
        else if (err.status === 404) setError("Level not found.");
        else setError("Could not load the level.");
      });
  }, [id]);

  if (error) {
    return (
      <div className="app">
        <Navbar />
        <main className="page">
          <p className="error">{error}</p>
          <Link to="/">Back to worlds</Link>
        </main>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="app">
        <Navbar />
        <main className="page">
          <p className="muted">Loading...</p>
        </main>
      </div>
    );
  }

  const type = level.challengeType;
  const completed = result?.isCorrect === true;

  function move(index, direction) {
    const copy = [...ordered];
    const target = index + direction;
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setOrdered(copy);
  }

  function canSubmit() {
    if (type === "FillInTheBlank") return textAnswer.trim() !== "";
    if (type === "OrderTheLines") return true;
    return selectedId !== null;
  }

  async function submit() {
    setSubmitting(true);

    const body = {};
    if (type === "MultipleChoice" || type === "SpotTheBug") body.selectedOptionId = selectedId;
    if (type === "FillInTheBlank") body.textAnswer = textAnswer;
    if (type === "OrderTheLines") body.orderedOptionIds = ordered.map((o) => o.id);

    try {
      const data = await api.post(`/api/levels/${id}/submit`, body);
      setResult(data);
      updateXp(data.totalXp);
    } catch {
      setResult({ isCorrect: false, message: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <Link to="/">Back to worlds</Link>

        <section className="card level-card">
          <div className="chips">
            <span className="chip">{TYPE_LABELS[type]}</span>
            <span className="chip xp">{level.xpReward} XP</span>
          </div>

          <h1>{level.title}</h1>
          <p className="muted question">{level.question}</p>

          {level.codeSnippet && <pre className="snippet">{level.codeSnippet}</pre>}

          {(type === "MultipleChoice" || type === "SpotTheBug") &&
            level.options.map((option, index) => (
              <button
                key={option.id}
                className={`opt ${selectedId === option.id ? "sel" : ""}`}
                aria-pressed={selectedId === option.id}
                disabled={completed}
                onClick={() => setSelectedId(option.id)}
              >
                <span className="opt-num">
                  {type === "SpotTheBug" ? index + 1 : String.fromCharCode(65 + index)}
                </span>
                {option.text}
              </button>
            ))}

          {type === "FillInTheBlank" && (
            <div>
              <label htmlFor="answer">Your answer</label>
              <input
                id="answer"
                value={textAnswer}
                disabled={completed}
                onChange={(e) => setTextAnswer(e.target.value)}
              />
            </div>
          )}

          {type === "OrderTheLines" &&
            ordered.map((option, index) => (
              <div key={option.id} className="order-row">
                <div className="opt">
                  <span className="opt-num">{index + 1}</span>
                  {option.text}
                </div>
                <div className="order-btns">
                  <button
                    className="btn small-btn"
                    disabled={completed || index === 0}
                    onClick={() => move(index, -1)}
                    aria-label="Move line up"
                  >
                    Up
                  </button>
                  <button
                    className="btn small-btn"
                    disabled={completed || index === ordered.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label="Move line down"
                  >
                    Down
                  </button>
                </div>
              </div>
            ))}

          {result && (
            <div className={`feedback ${result.isCorrect ? "ok" : "bad"}`} role="status">
              {result.message}
            </div>
          )}

          <div className="actions">
            {!completed && (
              <button className="btn primary" disabled={!canSubmit() || submitting} onClick={submit}>
                Submit
              </button>
            )}

            {completed && result.nextLevelId && (
              <Link className="btn primary" to={`/levels/${result.nextLevelId}`}>
                Next level
              </Link>
            )}

            {completed && (
              <Link className="btn" to="/">
                Back to worlds
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}