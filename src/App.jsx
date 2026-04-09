// ---------------------------------------------//

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserConfessionPage from './pages/UserConfessionPage';

import SuccessPage from './pages/SuccessPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:collegeId" element={<UserConfessionPage />} />
        <Route path="/" element={<UserConfessionPage />} />

        <Route path="/:collegeId/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}
