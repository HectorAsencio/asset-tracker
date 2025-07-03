import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import DepositPage from './pages/DepositPage';
import DepositFormPage from './pages/DepositFormPage';
import {Navigation} from './components/Navigation';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/deposits/" />} />
            <Route path="/deposits/" element={<DepositPage />} />
            <Route path="/deposits/create" element={<DepositFormPage />} />
          </Routes>
        </main>
        <ThemeToggle />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;