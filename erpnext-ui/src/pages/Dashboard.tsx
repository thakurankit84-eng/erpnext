import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getCount } from "../api/frappe";
import { resources } from "../config/resources";

export default function Dashboard() {
  const results = useQueries({
    queries: resources.map((r) => ({
      queryKey: ["count", r.doctype],
      queryFn: () => getCount(r.doctype),
    })),
  });

  return (
    <>
      <h1>Dashboard</h1>
      <div className="tiles">
        {resources.map((r, i) => {
          const q = results[i];
          return (
            <Link key={r.slug} to={`/${r.slug}`} className="card tile">
              <div className="muted small">{r.module}</div>
              <div className="tile-label">{r.label}</div>
              <div className="tile-value">
                {q.isLoading ? "…" : q.isError ? "n/a" : (q.data ?? 0).toLocaleString()}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
