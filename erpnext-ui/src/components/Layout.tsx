import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { modules, resources } from "../config/resources";

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">ERP Console</div>
        <nav>
          <NavLink to="/" end className="navlink">
            Dashboard
          </NavLink>
          {modules.map((m) => (
            <div key={m} className="navgroup">
              <div className="navgroup-title">{m}</div>
              {resources
                .filter((r) => r.module === m)
                .map((r) => (
                  <NavLink key={r.slug} to={`/${r.slug}`} className="navlink">
                    {r.label}
                  </NavLink>
                ))}
            </div>
          ))}
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <span className="muted">{user}</span>
          <button className="btn" onClick={() => void logout()}>
            Sign out
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
