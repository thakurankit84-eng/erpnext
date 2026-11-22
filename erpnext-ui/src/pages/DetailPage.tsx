import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDoc } from "../api/frappe";
import { bySlug } from "../config/resources";

type Doc = Record<string, unknown>;

const HIDDEN = new Set(["doctype", "owner", "creation", "modified", "modified_by", "idx", "docstatus"]);

function isScalar(v: unknown): v is string | number | boolean | null {
  return v === null || ["string", "number", "boolean"].includes(typeof v);
}

function pretty(key: string): string {
  return key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export default function DetailPage() {
  const { slug = "", name = "" } = useParams();
  const resource = bySlug(slug);

  const q = useQuery({
    queryKey: ["doc", slug, name],
    enabled: !!resource,
    queryFn: () => getDoc<Doc>(resource!.doctype, name),
  });

  if (!resource) return <div className="card">Unknown section.</div>;
  if (q.isLoading) return <div className="muted">Loading…</div>;
  if (q.isError)
    return <div className="error">{q.error instanceof Error ? q.error.message : "Failed to load"}</div>;

  const doc = q.data ?? {};
  const scalars = Object.entries(doc).filter(
    ([k, v]) => !HIDDEN.has(k) && isScalar(v) && v !== "" && v !== null,
  );
  const tables = Object.entries(doc).filter(
    ([, v]) => Array.isArray(v) && v.length > 0 && typeof v[0] === "object",
  ) as [string, Doc[]][];

  return (
    <>
      <div className="muted small">
        <Link to={`/${slug}`}>← {resource.label}</Link>
      </div>
      <h1>{name}</h1>

      <div className="card">
        <dl className="fields">
          {scalars.map(([k, v]) => (
            <div key={k} className="field">
              <dt>{pretty(k)}</dt>
              <dd>{String(v)}</dd>
            </div>
          ))}
        </dl>
      </div>

      {tables.map(([k, rows]) => {
        const cols = Object.keys(rows[0]).filter((c) => !HIDDEN.has(c) && isScalar(rows[0][c]) && c !== "name" && c !== "parent" && c !== "parentfield" && c !== "parenttype");
        return (
          <div key={k} className="card table-wrap section">
            <h2>{pretty(k)}</h2>
            <table>
              <thead>
                <tr>
                  {cols.map((c) => (
                    <th key={c}>{pretty(c)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={String(r.name ?? i)}>
                    {cols.map((c) => (
                      <td key={c}>{r[c] === null || r[c] === "" ? "—" : String(r[c])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}
