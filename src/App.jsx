
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import AuthPage from './components/AuthPage/AuthPage';
import Layout from './components/Layout/Layout';
import SendDemo from './pages/SendDemo/SendDemo';
import Account from './pages/Account/Account';
import DemoHistory from './pages/DemoHistory/DemoHistory';
import DemoDetails from './pages/DemoDetails/DemoDetails';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
              <AuthPage />
            </div>
          </PublicRoute>
        } />
        <Route path="/" element={<Layout />}>
          <Route index element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          } />
          <Route path="senddemo" element={
            <ProtectedRoute>
              <SendDemo />
            </ProtectedRoute>
          } />
          <Route path="account" element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } />
          <Route path="demohistory" element={
            <ProtectedRoute>
              <DemoHistory />
            </ProtectedRoute>
          } />
          <Route path="demo/:demId" element={
            <ProtectedRoute>
              <DemoDetails />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
