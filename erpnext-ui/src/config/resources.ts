// Declarative description of the ERPNext doctypes the UI exposes.
// Add a doctype here and it automatically gets a sidebar link, a list page and a detail page.

export type ColumnType = "text" | "currency" | "date" | "status";

export interface Column {
  field: string;
  label: string;
  type?: ColumnType;
}

export interface Resource {
  doctype: string;
  slug: string;
  label: string;
  module: string;
  columns: Column[];
  /** Fields searched (LIKE) by the search box. */
  searchFields: string[];
}

export const resources: Resource[] = [
  // ---- Sales & CRM ----
  {
    doctype: "Customer",
    slug: "customers",
    label: "Customers",
    module: "Sales & CRM",
    columns: [
      { field: "name", label: "ID" },
      { field: "customer_name", label: "Name" },
      { field: "customer_group", label: "Group" },
      { field: "territory", label: "Territory" },
    ],
    searchFields: ["name", "customer_name"],
  },
  {
    doctype: "Quotation",
    slug: "quotations",
    label: "Quotations",
    module: "Sales & CRM",
    columns: [
      { field: "name", label: "ID" },
      { field: "party_name", label: "Party" },
      { field: "transaction_date", label: "Date", type: "date" },
      { field: "grand_total", label: "Total", type: "currency" },
      { field: "status", label: "Status", type: "status" },
    ],
    searchFields: ["name", "party_name"],
  },
  {
    doctype: "Sales Order",
    slug: "sales-orders",
    label: "Sales Orders",
    module: "Sales & CRM",
    columns: [
      { field: "name", label: "ID" },
      { field: "customer_name", label: "Customer" },
      { field: "transaction_date", label: "Date", type: "date" },
      { field: "grand_total", label: "Total", type: "currency" },
      { field: "status", label: "Status", type: "status" },
    ],
    searchFields: ["name", "customer_name"],
  },
  {
    doctype: "Sales Invoice",
    slug: "sales-invoices",
    label: "Sales Invoices",
    module: "Sales & CRM",
    columns: [
      { field: "name", label: "ID" },
      { field: "customer_name", label: "Customer" },
      { field: "posting_date", label: "Date", type: "date" },
      { field: "grand_total", label: "Total", type: "currency" },
      { field: "outstanding_amount", label: "Outstanding", type: "currency" },
      { field: "status", label: "Status", type: "status" },
    ],
    searchFields: ["name", "customer_name"],
  },
  // ---- Inventory ----
  {
    doctype: "Item",
    slug: "items",
    label: "Items",
    module: "Inventory",
    columns: [
      { field: "name", label: "Code" },
      { field: "item_name", label: "Name" },
      { field: "item_group", label: "Group" },
      { field: "stock_uom", label: "UoM" },
    ],
    searchFields: ["name", "item_name"],
  },
  {
    doctype: "Warehouse",
    slug: "warehouses",
    label: "Warehouses",
    module: "Inventory",
    columns: [
      { field: "name", label: "ID" },
      { field: "warehouse_name", label: "Name" },
      { field: "company", label: "Company" },
    ],
    searchFields: ["name", "warehouse_name"],
  },
  {
    doctype: "Stock Entry",
    slug: "stock-entries",
    label: "Stock Entries",
    module: "Inventory",
    columns: [
      { field: "name", label: "ID" },
      { field: "stock_entry_type", label: "Type" },
      { field: "posting_date", label: "Date", type: "date" },
      { field: "total_amount", label: "Amount", type: "currency" },
    ],
    searchFields: ["name", "stock_entry_type"],
  },
  // ---- Accounting ----
  {
    doctype: "Payment Entry",
    slug: "payments",
    label: "Payment Entries",
    module: "Accounting",
    columns: [
      { field: "name", label: "ID" },
      { field: "party", label: "Party" },
      { field: "payment_type", label: "Type" },
      { field: "posting_date", label: "Date", type: "date" },
      { field: "paid_amount", label: "Amount", type: "currency" },
    ],
    searchFields: ["name", "party"],
  },
  {
    doctype: "Journal Entry",
    slug: "journal-entries",
    label: "Journal Entries",
    module: "Accounting",
    columns: [
      { field: "name", label: "ID" },
      { field: "voucher_type", label: "Type" },
      { field: "posting_date", label: "Date", type: "date" },
      { field: "total_debit", label: "Debit", type: "currency" },
    ],
    searchFields: ["name", "voucher_type"],
  },
  {
    doctype: "Purchase Invoice",
    slug: "purchase-invoices",
    label: "Purchase Invoices",
    module: "Accounting",
    columns: [
      { field: "name", label: "ID" },
      { field: "supplier_name", label: "Supplier" },
      { field: "posting_date", label: "Date", type: "date" },
      { field: "grand_total", label: "Total", type: "currency" },
      { field: "status", label: "Status", type: "status" },
    ],
    searchFields: ["name", "supplier_name"],
  },
  // ---- HR & Payroll ----
  {
    doctype: "Employee",
    slug: "employees",
    label: "Employees",
    module: "HR & Payroll",
    columns: [
      { field: "name", label: "ID" },
      { field: "employee_name", label: "Name" },
      { field: "department", label: "Department" },
      { field: "designation", label: "Designation" },
      { field: "status", label: "Status", type: "status" },
    ],
    searchFields: ["name", "employee_name"],
  },
  {
    doctype: "Attendance",
    slug: "attendance",
    label: "Attendance",
    module: "HR & Payroll",
    columns: [
      { field: "name", label: "ID" },
      { field: "employee_name", label: "Employee" },
      { field: "attendance_date", label: "Date", type: "date" },
      { field: "status", label: "Status", type: "status" },
    ],
    searchFields: ["name", "employee_name"],
  },
  {
    doctype: "Leave Application",
    slug: "leave-applications",
    label: "Leave Applications",
    module: "HR & Payroll",
    columns: [
      { field: "name", label: "ID" },
      { field: "employee_name", label: "Employee" },
      { field: "leave_type", label: "Leave type" },
      { field: "from_date", label: "From", type: "date" },
      { field: "to_date", label: "To", type: "date" },
      { field: "status", label: "Status", type: "status" },
    ],
    searchFields: ["name", "employee_name"],
  },
  {
    doctype: "Salary Slip",
    slug: "salary-slips",
    label: "Salary Slips",
    module: "HR & Payroll",
    columns: [
      { field: "name", label: "ID" },
      { field: "employee_name", label: "Employee" },
      { field: "posting_date", label: "Date", type: "date" },
      { field: "net_pay", label: "Net pay", type: "currency" },
      { field: "status", label: "Status", type: "status" },
    ],
    searchFields: ["name", "employee_name"],
  },
];

export const modules = Array.from(new Set(resources.map((r) => r.module)));

export const bySlug = (slug: string) => resources.find((r) => r.slug === slug);
