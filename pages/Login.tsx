import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../src/contexts/AuthContext'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleKakaoLogin = () => {
    // 실제로는 카카오 OAuth를 통해 로그인하지만, 여기서는 데모용으로 처리
    const user = {
      id: 'kakao_' + Date.now(),
      name: '카카오 사용자',
      email: 'user@kakao.com',
      provider: 'kakao' as const
    }
    login(user)
    alert('카카오 로그인 성공!')
    navigate('/')
  }

  const handleGoogleLogin = () => {
    // 실제로는 Google OAuth를 통해 로그인하지만, 여기서는 데모용으로 처리
    const user = {
      id: 'google_' + Date.now(),
      name: 'Google 사용자',
      email: 'user@gmail.com',
      provider: 'google' as const
    }
    login(user)
    alert('Google 로그인 성공!')
    navigate('/')
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}>
        {/* 로고 및 타이틀 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontSize: '36px',
            marginBottom: '16px'
          }}>
            🔧
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
            정비 예약
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            정비 예약 시스템에 로그인하세요
          </p>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 카카오 로그인 */}
          <button
            onClick={handleKakaoLogin}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#FEE500',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#000000',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FDD835'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FEE500'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C6.477 3 2 6.477 2 10.8C2 13.614 3.804 16.062 6.552 17.436L5.604 21.066C5.538 21.33 5.82 21.54 6.06 21.39L10.302 18.504C10.86 18.564 11.424 18.6 12 18.6C17.523 18.6 22 15.123 22 10.8C22 6.477 17.523 3 12 3Z" fill="#000000"/>
            </svg>
            카카오로 시작하기
          </button>

          {/* Google 로그인 */}
          <button
            onClick={handleGoogleLogin}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google로 시작하기
          </button>
        </div>

        {/* 안내 문구 */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe'
        }}>
          <p style={{ fontSize: '13px', color: '#0369a1', lineHeight: '1.6', margin: 0 }}>
            💡 <strong>데모 버전입니다.</strong><br/>
            소셜 로그인 버튼을 클릭하면 자동으로 로그인됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
