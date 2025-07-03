import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import DepositPage from './pages/DepositPage';
import DepositFormPage from './pages/DepositFormPage';
import {Navigation} from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
    <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/deposits/" />} />
        <Route path="/deposits/" element={<DepositPage />} />
        <Route path="/deposits/create" element={<DepositFormPage />} />
      </Routes>
    </BrowserRouter>

    
  );
}

export default App;