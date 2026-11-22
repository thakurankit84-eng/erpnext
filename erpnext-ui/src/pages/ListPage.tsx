import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCount, getList } from "../api/frappe";
import { bySlug } from "../config/resources";
import { Cell } from "../components/Cell";

const PAGE_SIZE = 20;

export default function ListPage() {
  const { slug = "" } = useParams();
  const resource = bySlug(slug);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const orFilters = resource && search
    ? resource.searchFields.map((f) => [resource.doctype, f, "like", `%${search}%`])
    : [];

  const list = useQuery({
    queryKey: ["list", slug, search, page],
    enabled: !!resource,
    placeholderData: keepPreviousData,
    queryFn: () =>
      getList(resource!.doctype, {
        fields: Array.from(new Set(["name", ...resource!.columns.map((c) => c.field)])),
        orFilters,
        limit: PAGE_SIZE,
        start: page * PAGE_SIZE,
      }),
  });

  const total = useQuery({
    queryKey: ["total", slug, search],
    enabled: !!resource,
    queryFn: () =>
      getCount(
        resource!.doctype,
        // get_count has no or_filters, so only count unfiltered; fall back to row count when searching.
        [],
      ),
  });

  if (!resource) return <div className="card">Unknown section.</div>;

  const rows = list.data ?? [];
  const hasNext = rows.length === PAGE_SIZE;

  return (
    <>
      <div className="row between">
        <h1>{resource.label}</h1>
        <input
          className="search"
          placeholder={`Search ${resource.label.toLowerCase()}…`}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </div>

      {list.isError && (
        <div className="error">
          {list.error instanceof Error ? list.error.message : "Failed to load"}
        </div>
      )}

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              {resource.columns.map((c) => (
                <th key={c.field} className={c.type === "currency" ? "num" : undefined}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const name = String(row.name);
              return (
                <tr key={name}>
                  {resource.columns.map((c, i) => (
                    <td key={c.field} className={c.type === "currency" ? "num" : undefined}>
                      {i === 0 ? (
                        <Link to={`/${slug}/${encodeURIComponent(name)}`}>{name}</Link>
                      ) : (
                        <Cell value={row[c.field]} type={c.type} />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
            {!list.isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={resource.columns.length} className="muted center-text">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="row between pager">
        <span className="muted small">
          {search ? `${rows.length} shown` : `${total.data ?? "…"} total`} · page {page + 1}
        </span>
        <div className="row">
          <button className="btn" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <button className="btn" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}
