
import { Routes, Route, Navigate } from "react-router";

import Layout from "./components/Layout";
import HomePage from "./page/HomePage";
import ImportTraineePage from "./page/Trainee/ImportTraineePage";
import VerifyCertificatePage from "./page/Certificate/PublicCertificatePage";
import LoginPage from "./page/Login/LoginPage";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public route - Login (không có wrapper) */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Public route - Verify Certificate */}
      <Route path="/verify" element={<VerifyCertificatePage />} />
      
      {/* Protected routes - Require authentication */}
      <Route
        path="/"
        element={
          <div className="flex min-h-screen bg-white text-gray-900">
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          </div>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="trainees-import" element={<ImportTraineePage />} />
      </Route>
      
      {/* Redirect any unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;