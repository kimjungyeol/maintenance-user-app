import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { FavoriteProvider } from './contexts/FavoriteContext'
import MaintenanceHistory from '../pages/MaintenanceHistory'
import AdminScheduleCalendar from '../pages/AdminScheduleCalendar'
import AdminDaySchedule from '../pages/AdminDaySchedule'
import ShopSearch from '../pages/ShopSearch'
import UserBookingCalendar from '../pages/UserBookingCalendar'
import UserBookingTime from '../pages/UserBookingTime'
import Login from '../pages/Login'

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
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logout()
      navigate('/login')
    }
  }

  const handleLogin = () => {
    navigate('/login')
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
            정비 예약
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
              <NavItem to="/booking">예약하기</NavItem>
              <NavItem to="/schedule">스케줄 관리</NavItem>
            </ul>
          </nav>

          {/* Right: Login/Logout & Hamburger button */}
          <div style={{
            position: 'absolute',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {/* 로그인/로그아웃 버튼 */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="desktop-only" style={{ fontSize: '14px', color: '#6b7280' }}>
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#fff',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>🚪</span>
                  <span className="desktop-only">로그아웃</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--primary-color)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#fff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                <span style={{ fontSize: '16px' }}>🔑</span>
                <span className="desktop-only">로그인</span>
              </button>
            )}

            {/* 햄버거 버튼 (모바일 전용) */}
            <div className="mobile-only">
              <HamburgerButton onClick={toggleMenu} />
            </div>
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
            <NavItem to="/booking" onClick={closeMenu} isMobile>예약하기</NavItem>
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
          <Route path="/login" element={<Login />} />
          <Route path="/history" element={<MaintenanceHistory />} />
          <Route path="/booking" element={<ShopSearch />} />
          <Route path="/booking/calendar" element={<UserBookingCalendar />} />
          <Route path="/booking/calendar/:date" element={<UserBookingTime />} />
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
      <AuthProvider>
        <FavoriteProvider>
          <AppContent />
        </FavoriteProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
