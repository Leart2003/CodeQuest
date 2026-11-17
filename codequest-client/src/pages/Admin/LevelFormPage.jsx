import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, errorMessages } from "../../api";
import Navbar from "../../Components/NavBar";

const TYPES = [
  { value: "MultipleChoice", label: "Multiple choice" },
  { value: "FillInTheBlank", label: "Fill in the blank" },
  { value: "SpotTheBug", label: "Spot the bug" },
  { value: "OrderTheLines", label: "Order the lines" },
];

const emptyOptions = () => [
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
];

export default function LevelFormPage() {
  // new level: /admin/worlds/:worldId/levels/new   edit: /admin/levels/:id/edit
  const { id, worldId: worldIdParam } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== undefined;

  const [worldId, setWorldId] = useState(worldIdParam ? Number(worldIdParam) : null);
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [challengeType, setChallengeType] = useState("MultipleChoice");
  const [xpReward, setXpReward] = useState(10);
  const [order, setOrder] = useState(1);
  const [options, setOptions] = useState(emptyOptions());
  const [answers, setAnswers] = useState([""]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (isEdit) {
          const level = await api.get(`/api/admin/levels/${id}`);
          setWorldId(level.worldId);
          setTitle(level.title);
          setQuestion(level.question);
          setCodeSnippet(level.codeSnippet ?? "");
          setChallengeType(level.challengeType);
          setXpReward(level.xpReward);
          setOrder(level.order);
          setOptions(
            level.options.length > 0
              ? level.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect }))
              : emptyOptions()
          );
          setAnswers(level.answers.length > 0 ? level.answers : [""]);
        } else {
          // default the order to "last level + 1"
          const levels = await api.get(`/api/admin/levels?worldId=${worldIdParam}`);
          setOrder(levels.length + 1);
        }
      } catch (err) {
        setErrors(errorMessages(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, worldIdParam, isEdit]);

  const isFill = challengeType === "FillInTheBlank";
  const isOrder = challengeType === "OrderTheLines";
  const isChoice = challengeType === "MultipleChoice" || challengeType === "SpotTheBug";

  // ---- options ----
  function updateOption(index, changes) {
    setOptions(options.map((o, i) => (i === index ? { ...o, ...changes } : o)));
  }
  function setCorrect(index) {
    setOptions(options.map((o, i) => ({ ...o, isCorrect: i === index })));
  }
  function addOption() {
    setOptions([...options, { text: "", isCorrect: false }]);
  }
  function removeOption(index) {
    setOptions(options.filter((_, i) => i !== index));
  }
  function moveOption(index, direction) {
    const copy = [...options];
    const target = index + direction;
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setOptions(copy);
  }

  // ---- accepted answers ----
  function updateAnswer(index, value) {
    setAnswers(answers.map((a, i) => (i === index ? value : a)));
  }
  function addAnswer() {
    setAnswers([...answers, ""]);
  }
  function removeAnswer(index) {
    setAnswers(answers.filter((_, i) => i !== index));
  }

  async function save(e) {
    e.preventDefault();
    setErrors([]);

    const body = {
      worldId,
      title,
      question,
      codeSnippet: codeSnippet.trim() === "" ? null : codeSnippet,
      challengeType,
      xpReward: Number(xpReward),
      order: Number(order),
      // for OrderTheLines the row order IS the correct order
      options: isFill
        ? []
        : options.map((o, i) => ({
            text: o.text,
            isCorrect: isOrder ? false : o.isCorrect,
            correctPosition: isOrder ? i + 1 : null,
          })),
      answers: isFill ? answers : [],
    };

    try {
      if (isEdit) await api.put(`/api/admin/levels/${id}`, body);
      else await api.post("/api/admin/levels", body);
      navigate(`/admin/worlds/${worldId}`);
    } catch (err) {
      setErrors(errorMessages(err));
    }
  }

  if (loading) {
    return (
      <div className="app">
        <Navbar />
        <main className="page">
          <p className="muted">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <Link to={`/admin/worlds/${worldId}`}>Back to levels</Link>
        <h1 style={{ marginTop: 16 }}>{isEdit ? "Edit level" : "New level"}</h1>

        <form className="card admin-form" onSubmit={save}>
          <div className="field-row">
            <div style={{ flex: 3 }}>
              <label htmlFor="title">Title</label>
              <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label htmlFor="type">Challenge type</label>
              <select id="type" value={challengeType} onChange={(e) => setChallengeType(e.target.value)}>
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-row">
            <div>
              <label htmlFor="xp">XP reward</label>
              <input id="xp" type="number" value={xpReward} onChange={(e) => setXpReward(e.target.value)} />
            </div>
            <div>
              <label htmlFor="order">Order in world</label>
              <input id="order" type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
            </div>
          </div>

          <div>
            <label htmlFor="question">Question</label>
            <textarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>

          {!isOrder && (
            <div>
              <label htmlFor="snippet">
                Code snippet {isFill ? "(use ___ where the blank goes)" : "(optional)"}
              </label>
              <textarea
                id="snippet"
                className="code-input"
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
              />
            </div>
          )}

          {(isChoice || isOrder) && (
            <fieldset className="options-box">
              <legend>
                {isOrder && "Lines, in the correct order (top to bottom)"}
                {challengeType === "MultipleChoice" && "Options (select the correct one)"}
                {challengeType === "SpotTheBug" && "Code lines (select the buggy one)"}
              </legend>

              {options.map((option, index) => (
                <div key={index} className="option-row">
                  {isChoice && (
                    <input
                      type="radio"
                      name="correct"
                      checked={option.isCorrect}
                      onChange={() => setCorrect(index)}
                      aria-label={`Option ${index + 1} is correct`}
                    />
                  )}
                  {isOrder && <span className="opt-num">{index + 1}</span>}

                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(index, { text: e.target.value })}
                    aria-label={`Option ${index + 1} text`}
                  />

                  {isOrder && (
                    <>
                      <button
                        type="button"
                        className="btn small-btn"
                        disabled={index === 0}
                        onClick={() => moveOption(index, -1)}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        className="btn small-btn"
                        disabled={index === options.length - 1}
                        onClick={() => moveOption(index, 1)}
                      >
                        Down
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    className="btn small-btn"
                    disabled={options.length <= 2}
                    onClick={() => removeOption(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div>
                <button type="button" className="btn small-btn" onClick={addOption}>
                  Add option
                </button>
              </div>
            </fieldset>
          )}

          {isFill && (
            <fieldset className="options-box">
              <legend>Accepted answers</legend>

              {answers.map((answer, index) => (
                <div key={index} className="option-row">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => updateAnswer(index, e.target.value)}
                    aria-label={`Accepted answer ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="btn small-btn"
                    disabled={answers.length <= 1}
                    onClick={() => removeAnswer(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div>
                <button type="button" className="btn small-btn" onClick={addAnswer}>
                  Add accepted answer
                </button>
              </div>
            </fieldset>
          )}

          {errors.length > 0 && (
            <ul className="error-list">
              {errors.map((message, i) => (
                <li key={i}>{message}</li>
              ))}
            </ul>
          )}

          <div className="row-actions">
            <button className="btn primary" type="submit">
              Save level
            </button>
            <Link className="btn" to={`/admin/worlds/${worldId}`}>
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
