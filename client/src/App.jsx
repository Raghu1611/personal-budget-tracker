import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import { HiOutlineMenu } from 'react-icons/hi';
import './index.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleDataChange = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(true)}
          id="menu-toggle-btn"
          aria-label="Open menu"
        >
          <HiOutlineMenu />
        </button>

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Dashboard refreshTrigger={refreshTrigger} />}
            />
            <Route
              path="/transactions"
              element={
                <Transactions
                  onToast={showToast}
                  onDataChange={handleDataChange}
                />
              }
            />
            <Route
              path="/add"
              element={
                <AddTransaction
                  onToast={showToast}
                  onDataChange={handleDataChange}
                />
              }
            />
          </Routes>
        </main>

        {/* Toast Notifications */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </Router>
  );
}

export default App;
