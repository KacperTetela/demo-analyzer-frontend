
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage/AuthPage';
import Layout from './components/Layout/Layout';
import SendDemo from './pages/SendDemo/SendDemo';
import Account from './pages/Account/Account';
import DemoHistory from './pages/DemoHistory/DemoHistory';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
            <AuthPage />
          </div>
        } />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/senddemo" replace />} />
          <Route path="senddemo" element={<SendDemo />} />
          <Route path="account" element={<Account />} />
          <Route path="demohistory" element={<DemoHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
