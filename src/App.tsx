import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import MaintenanceHistory from '../pages/MaintenanceHistory'
import AdminScheduleCalendar from '../pages/AdminScheduleCalendar'
import AdminDaySchedule from '../pages/AdminDaySchedule'
import UserBookingCalendar from '../pages/UserBookingCalendar'
import UserBookingTime from '../pages/UserBookingTime'

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
              <NavItem to="/history">정비 이력</NavItem>
              <NavItem to="/booking">예약 달력</NavItem>
              <NavItem to="/schedule">스케줄 관리</NavItem>
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
            <NavItem to="/history" onClick={closeMenu} isMobile>정비 이력</NavItem>
            <NavItem to="/booking" onClick={closeMenu} isMobile>예약 달력</NavItem>
            <NavItem to="/schedule" onClick={closeMenu} isMobile>스케줄 관리</NavItem>
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
          <Route path="/" element={<div>홈 페이지</div>} />
          <Route path="/history" element={<MaintenanceHistory />} />
          <Route path="/booking" element={<UserBookingCalendar />} />
          <Route path="/booking/:date" element={<UserBookingTime />} />
          <Route path="/schedule" element={<AdminScheduleCalendar />} />
          <Route path="/schedule/:date" element={<AdminDaySchedule />} />
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
