import { useState } from "react";

function App() {
  const [g, setG] = useState("");
  const [max, setMax] = useState("");
  const [base, setBase] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("https://mersenne-backend.onrender.com/api/mersenne", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    g: Number(g || 0),
    max: Number(max || 0),
    base: Number(base || 0),
  }),
});

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      // basic validation
      if (!Array.isArray(data)) {
        throw new Error("Invalid response from server");
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div style={styles.page}>
    <div style={styles.container}>
      <h1>Mersenne Generalizer</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input placeholder="g" value={g} onChange={(e) => setG(e.target.value)} />
        <input placeholder="max n" value={max} onChange={(e) => setMax(e.target.value)} />
        <input placeholder="base" value={base} onChange={(e) => setBase(e.target.value)} />
        <button type="submit">Generate</button>
      </form>

      <hr />

      {results.map((r) => (
        <div key={r.n} style={styles.block}>

          <p><b>Gn = {r.value}</b></p>
          <p>In base {base}: {r.base_value}</p>

          <p><b>Factors:</b></p>
          <ul>
            {r.factors.map((f, i) => (
              <div key={i}>
                {f.prime}
                {f.exp > 1 && <sup>{f.exp}</sup>} in base {base}: {f.base_value}
              </div>
            ))}
          </ul>

          <pre style={styles.line}>------------------------------------------------------------------------------------------------------------------------------------------------------------------------</pre>
        </div>
      ))}
    </div>
  </div>
);
}

const styles = {
  page: {
    minHeight: "100vh",
  width: "100vw",
  background: "#0f172a",
  color: "white",
  fontFamily: "Arial",

  display: "block", // IMPORTANT: remove flex centering
  },

  container: {
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto", // keeps it clean but not centered layout trap
  padding: "30px",
  textAlign: "left",
  },

  form: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-start", // LEFT align inputs
    marginBottom: "15px",
  },

  block: {
    marginBottom: "20px",
  },

  line: {
    color: "#94a3b8",
    margin: "5px 0",
  },
};
   

export default App;