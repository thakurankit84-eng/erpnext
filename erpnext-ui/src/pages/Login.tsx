import { useState, type FormEvent } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [usr, setUsr] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(usr, pwd);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="center">
      <form className="card login" onSubmit={submit}>
        <h1>ERP Console</h1>
        <label>
          Email or username
          <input value={usr} onChange={(e) => setUsr(e.target.value)} autoFocus required />
        </label>
        <label>
          Password
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
