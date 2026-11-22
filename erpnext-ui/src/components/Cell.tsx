import type { ColumnType } from "../config/resources";

export function formatValue(value: unknown, type: ColumnType = "text"): string {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "currency") {
    const n = Number(value);
    return Number.isFinite(n)
      ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : String(value);
  }
  if (type === "date") {
    const d = new Date(String(value));
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
  }
  return String(value);
}

export function Cell({ value, type }: { value: unknown; type?: ColumnType }) {
  if (type === "status" && value) {
    const key = String(value).toLowerCase().replace(/\s+/g, "-");
    return <span className={`badge badge-${key}`}>{String(value)}</span>;
  }
  return <span className={type === "currency" ? "num" : undefined}>{formatValue(value, type)}</span>;
}
