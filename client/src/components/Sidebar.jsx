import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineChartBar, HiOutlinePlusCircle, HiOutlineClipboardList, HiOutlineX } from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <HiOutlineChartBar /> },
    { path: '/transactions', label: 'Transactions', icon: <HiOutlineClipboardList /> },
    { path: '/add', label: 'Add New', icon: <HiOutlinePlusCircle /> },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>💸 BudgetPal</h1>
          <p>Personal Finance Tracker</p>
        </div>

        {/* Close button for mobile */}
        <button
          className="btn-icon"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'none',
          }}
          id="sidebar-close-btn"
        >
          <HiOutlineX />
        </button>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavigate(item.path)}
              id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-light)' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            © 2026 BudgetPal
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
