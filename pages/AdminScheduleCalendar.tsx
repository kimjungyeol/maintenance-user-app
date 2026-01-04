import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Appointment {
  id: string
  time: string
  vehicleNumber: string
  serviceType: string
  status: '요청중' | '확정'
  customerName: string
  phone: string
  memo: string
}

interface DayAppointments {
  [date: string]: Appointment[]
}

// 샘플 데이터
const sampleAppointments: DayAppointments = {
  '2026-01-12': [
    {
      id: '1',
      time: '10:00',
      vehicleNumber: '12루1234',
      serviceType: '엔진오일 교체',
      status: '확정',
      customerName: '김철수',
      phone: '010-1234-5678',
      memo: '오일 필터도 함께 교체 요청'
    },
    {
      id: '2',
      time: '13:00',
      vehicleNumber: '45가2456',
      serviceType: '타이어 교체',
      status: '확정',
      customerName: '박영희',
      phone: '010-9876-5432',
      memo: '전륜 타이어 2개 교체'
    },
    {
      id: '3',
      time: '14:00',
      vehicleNumber: '78나9012',
      serviceType: '정기 점검',
      status: '요청중',
      customerName: '이민수',
      phone: '010-5555-6666',
      memo: ''
    }
  ],
  '2024-01-15': [
    {
      id: '4',
      time: '11:00',
      vehicleNumber: '33다7890',
      serviceType: '정기 점검',
      status: '확정',
      customerName: '최지훈',
      phone: '010-7777-8888',
      memo: ''
    }
  ]
}

const AdminScheduleCalendar: React.FC = () => {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments] = useState<DayAppointments>(sampleAppointments)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    navigate(`/schedule/${dateStr}`)
  }

  const getAppointmentCount = (day: number): number => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayAppointments = appointments[dateStr] || []
    return dayAppointments.length
  }

  const renderCalendarDays = () => {
    const days = []

    // 빈 셀 추가
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '8px' }}></div>)
    }

    // 날짜 셀 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const appointmentCount = getAppointmentCount(day)
      const hasAppointments = appointmentCount > 0

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          style={{
            padding: '12px',
            border: '1px solid #e5e7eb',
            minHeight: '100px',
            cursor: 'pointer',
            backgroundColor: hasAppointments ? '#f0f9ff' : '#fff',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = hasAppointments ? '#e0f2fe' : '#f9fafb'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = hasAppointments ? '#f0f9ff' : '#fff'
          }}
        >
          <div style={{
            fontWeight: '600',
            marginBottom: '8px',
            color: new Date(year, month, day).getDay() === 0 ? '#dc2626' :
                   new Date(year, month, day).getDay() === 6 ? '#2563eb' : '#000'
          }}>
            {day}
          </div>
          {hasAppointments && (
            <div style={{
              fontSize: '13px',
              color: '#0284c7',
              fontWeight: '600',
              marginTop: '4px'
            }}>
              예약 {appointmentCount}건
            </div>
          )}
        </div>
      )
    }

    return days
  }

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>스케줄 관리 (업체용)</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handlePrevMonth}
            style={{
              padding: '8px 16px',
              backgroundColor: '#fff',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            이전 달
          </button>

          <div style={{ fontSize: '18px', fontWeight: '600', minWidth: '150px', textAlign: 'center' }}>
            {year}년 {month + 1}월
          </div>

          <button
            onClick={handleNextMonth}
            style={{
              padding: '8px 16px',
              backgroundColor: '#fff',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            다음 달
          </button>
        </div>
      </div>

      {/* 달력 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 요일 헤더 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0',
          marginBottom: '2px'
        }}>
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <div
              key={day}
              style={{
                padding: '12px',
                textAlign: 'center',
                fontWeight: '600',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                color: idx === 0 ? '#dc2626' : idx === 6 ? '#2563eb' : '#000'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0',
          flex: 1,
        }}>
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  )
}

export default AdminScheduleCalendar
