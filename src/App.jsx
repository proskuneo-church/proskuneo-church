import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import RequireRole from "./components/auth/RequireRole";
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import HomePage from "./pages/public/HomePage";
import DevotionalDetailPage from "./pages/public/DevotionalDetailPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminDevotionalsPage from "./pages/admin/AdminDevotionalsPage";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminSermonsPage from "./pages/admin/AdminSermonsPage";
import AdminMediaPage from "./pages/admin/AdminMediaPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import HashScrollHandler from "./components/common/HashScrollHandler";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <HashScrollHandler />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/devotional/bulanan/:slug" element={<DevotionalDetailPage type="monthly" />} />
            <Route path="/devotional/harian/:slug" element={<DevotionalDetailPage type="daily" />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="devotionals" element={<AdminDevotionalsPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="sermons" element={<AdminSermonsPage />} />
              <Route path="media" element={<AdminMediaPage />} />
              <Route
                path="users"
                element={
                  <RequireRole roles={["super_admin"]}>
                    <AdminUsersPage />
                  </RequireRole>
                }
              />
            </Route>
          </Route>

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
