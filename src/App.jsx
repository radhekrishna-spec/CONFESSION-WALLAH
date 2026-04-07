// ---------------------------------------------//

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserConfessionPage from './pages/UserConfessionPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import SuccessPage from './pages/SuccessPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserConfessionPage />} />
        <Route path="/success" element={<SuccessPage />} />
       
      </Routes>
    </BrowserRouter>
  );
}
