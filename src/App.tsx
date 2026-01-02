import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import SalesPage from '../pages/SalesPage'
import ExpensesPage from '../pages/ExpensesPage'
import PayrollPage from '../pages/PayrollPage'
import ReceivablesPage from '../pages/ReceivablesPage'
import CustomersPage from '../pages/CustomersPage'
import MonthlyReportPage from '../pages/MonthlyReportPage'
import SettingsPage from '../pages/SettingsPage'

const NavItem: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void; isMobile?: boolean }> = ({ to, children, onClick, isMobile = false }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  const mobileStyle: React.CSSProperties = {
    display: 'block',
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
    color: isActive ? '#fff' : 'var(--text-color)',
    fontWeight: isActive ? 500 : 400,
    textDecoration: 'none',
  }

  const desktopStyle: React.CSSProperties = {
    display: 'block',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
    color: isActive ? '#fff' : 'var(--text-color)',
    fontWeight: isActive ? 500 : 400,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }

  return (
    <li style={{ marginBottom: isMobile ? '8px' : '0' }}>
      <Link
        to={to}
        onClick={onClick}
        style={isMobile ? mobileStyle : desktopStyle}
      >
        {children}
      </Link>
    </li>
  )
}

const HamburgerButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '44px',
        height: '44px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
      }}
      aria-label="메뉴 토글"
    >
      <span style={{ width: '24px', height: '2px', backgroundColor: 'var(--text-color)', marginBottom: '5px' }}></span>
      <span style={{ width: '24px', height: '2px', backgroundColor: 'var(--text-color)', marginBottom: '5px' }}></span>
      <span style={{ width: '24px', height: '2px', backgroundColor: 'var(--text-color)' }}></span>
    </button>
  )
}

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header container */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        {/* Header */}
        <header style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
          minHeight: '60px',
          position: 'relative',
        }}>
          {/* Left: Menu title */}
          <div style={{
            position: 'absolute',
            left: '16px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'var(--primary-color)',
          }}>
            Bro Motors
          </div>

          {/* Center: Desktop navigation menu */}
          <nav className="desktop-only">
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}>
              <NavItem to="/">홈</NavItem>
              <NavItem to="/sales">매출 관리</NavItem>
              <NavItem to="/expenses">지출 관리</NavItem>
              <NavItem to="/receivables">미수금 관리</NavItem>
              <NavItem to="/payroll">급여 관리</NavItem>
              <NavItem to="/customers">고객 관리</NavItem>
              <NavItem to="/monthly-report">월별 정산</NavItem>
              <NavItem to="/settings">기초 설정</NavItem>
            </ul>
          </nav>

          {/* Right: Hamburger button (mobile only) */}
          <div className="mobile-only" style={{
            position: 'absolute',
            right: '16px',
          }}>
            <HamburgerButton onClick={toggleMenu} />
          </div>
        </header>

        {/* Mobile navigation menu (dropdown) */}
        <nav
          className="mobile-only"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: isMenuOpen ? '400px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease-in-out',
            backgroundColor: '#fff',
            borderBottom: isMenuOpen ? '1px solid #e5e7eb' : 'none',
            boxShadow: isMenuOpen ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          <ul style={{
            listStyle: 'none',
            padding: '12px 16px',
            margin: 0,
          }}>
            <NavItem to="/" onClick={closeMenu} isMobile>홈</NavItem>
            <NavItem to="/sales" onClick={closeMenu} isMobile>매출 관리</NavItem>
            <NavItem to="/expenses" onClick={closeMenu} isMobile>지출 관리</NavItem>
            <NavItem to="/receivables" onClick={closeMenu} isMobile>미수금 관리</NavItem>
            <NavItem to="/payroll" onClick={closeMenu} isMobile>급여 관리</NavItem>
            <NavItem to="/customers" onClick={closeMenu} isMobile>고객 관리</NavItem>
            <NavItem to="/monthly-report" onClick={closeMenu} isMobile>월별 정산</NavItem>
            <NavItem to="/settings" onClick={closeMenu} isMobile>기초 설정</NavItem>
          </ul>
        </nav>
      </div>

      {/* Page content */}
      <main style={{
        flex: 1,
        padding: '24px',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
      }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/receivables" element={<ReceivablesPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/monthly-report" element={<MonthlyReportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
