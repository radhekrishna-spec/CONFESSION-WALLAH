// ---------------------------------------------//

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserConfessionPage from './pages/UserConfessionPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserConfessionPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
