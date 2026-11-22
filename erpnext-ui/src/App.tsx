import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="center muted">Loading…</div>;
  if (!user) return <Login />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path=":slug" element={<ListPage />} />
        <Route path=":slug/:name" element={<DetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
