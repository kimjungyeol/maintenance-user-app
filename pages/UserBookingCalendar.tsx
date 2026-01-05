import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFavorite } from '../src/contexts/FavoriteContext'

interface Shop {
  id: string
  name: string
  region: string
  address: string
  phone: string
  rating: number
  description: string
}

interface TimeSlot {
  time: string
  status: '가능' | '요청중' | '확정'
}

interface DayTimeSlots {
  [date: string]: TimeSlot[]
}

// 샘플 데이터 - 시간대별 상태 정보
const sampleTimeSlots: DayTimeSlots = {
  '2026-01-12': [
    { time: '10:00', status: '확정' },
    { time: '11:00', status: '가능' },
    { time: '12:00', status: '가능' },
    { time: '13:00', status: '확정' },
    { time: '14:00', status: '요청중' },
    { time: '15:00', status: '가능' },
    { time: '16:00', status: '가능' },
    { time: '17:00', status: '가능' }
  ],
  '2026-01-15': [
    { time: '10:00', status: '가능' },
    { time: '11:00', status: '확정' },
    { time: '12:00', status: '가능' },
    { time: '13:00', status: '가능' },
    { time: '14:00', status: '가능' },
    { time: '15:00', status: '가능' },
    { time: '16:00', status: '가능' },
    { time: '17:00', status: '가능' }
  ]
}

const UserBookingCalendar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleFavorite, isFavorite } = useFavorite()
  const selectedShop = (location.state as { selectedShop?: Shop })?.selectedShop
  const [currentDate, setCurrentDate] = useState(new Date())
  const [timeSlots] = useState<DayTimeSlots>(sampleTimeSlots)

  // 업체가 선택되지 않은 경우 업체 선택 페이지로 리다이렉트
  React.useEffect(() => {
    if (!selectedShop) {
      navigate('/booking')
    }
  }, [selectedShop, navigate])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

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
    const selectedDate = new Date(year, month, day)
    selectedDate.setHours(0, 0, 0, 0)

    // 과거 날짜는 클릭 불가
    if (selectedDate < today) {
      return
    }

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    navigate(`/booking/calendar/${dateStr}`, { state: { selectedShop } })
  }

  const isPastDate = (day: number): boolean => {
    const date = new Date(year, month, day)
    date.setHours(0, 0, 0, 0)
    return date < today
  }

  const getDayInfo = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const slots = timeSlots[dateStr] || []

    // 예약 정보가 없으면 모든 시간대(8개)가 예약 가능
    const totalTimeSlots = 8 // 10:00 ~ 17:00 (8개 시간대)

    if (slots.length === 0) {
      return {
        availableCount: totalTimeSlots,
        confirmedCount: 0,
        requestedCount: 0,
        hasSlots: false
      }
    }

    const availableCount = slots.filter(slot => slot.status === '가능').length
    const confirmedCount = slots.filter(slot => slot.status === '확정').length
    const requestedCount = slots.filter(slot => slot.status === '요청중').length

    return {
      availableCount,
      confirmedCount,
      requestedCount,
      hasSlots: true
    }
  }

  const renderCalendarDays = () => {
    const days = []

    // 빈 셀 추가
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '8px' }}></div>)
    }

    // 날짜 셀 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const isPast = isPastDate(day)
      const dayInfo = getDayInfo(day)
      const canBook = dayInfo.availableCount > 0

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          style={{
            padding: '12px',
            border: '1px solid #e5e7eb',
            minHeight: '100px',
            cursor: isPast ? 'not-allowed' : 'pointer',
            backgroundColor: isPast ? '#f3f4f6' :
                           canBook ? '#f0f9ff' : '#fef3c7',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            opacity: isPast ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isPast) {
              e.currentTarget.style.backgroundColor =
                canBook ? '#e0f2fe' : '#fde68a'
            }
          }}
          onMouseLeave={(e) => {
            if (!isPast) {
              e.currentTarget.style.backgroundColor =
                canBook ? '#f0f9ff' : '#fef3c7'
            }
          }}
        >
          <div style={{
            fontWeight: '600',
            marginBottom: '8px',
            color: isPast ? '#9ca3af' :
                   new Date(year, month, day).getDay() === 0 ? '#dc2626' :
                   new Date(year, month, day).getDay() === 6 ? '#2563eb' : '#000'
          }}>
            {day}
          </div>
          {!isPast && (
            <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
              <div style={{
                color: '#059669',
                fontWeight: '500',
                marginBottom: '2px'
              }}>
                예약가능 {dayInfo.availableCount}건
              </div>
              <div style={{
                color: '#6b7280',
                fontWeight: '500',
                marginBottom: '4px'
              }}>
                예약확정 {dayInfo.confirmedCount}건
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: canBook ? '#0284c7' : '#dc2626',
                marginTop: '4px'
              }}>
                {canBook ? '예약 가능' : '예약 불가'}
              </div>
            </div>
          )}
        </div>
      )
    }

    return days
  }

  if (!selectedShop) {
    return null
  }

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* 선택된 업체 정보 */}
      <div style={{
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#f0f9ff',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px', color: '#1e40af' }}>
            {selectedShop.name}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '2px' }}>
            {selectedShop.address}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            {selectedShop.phone}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* 즐겨찾기 아이콘 */}
          <button
            onClick={() => toggleFavorite(selectedShop.id)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              padding: '4px',
              lineHeight: 1,
              transition: 'transform 0.2s',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
            title={isFavorite(selectedShop.id) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            {isFavorite(selectedShop.id) ? '❤️' : '🤍'}
          </button>

          <button
            onClick={() => navigate('/booking')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#fff',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff'
            }}
          >
            업체 변경
          </button>
        </div>
      </div>

      {/* 헤더 */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', minWidth: '100px', marginBottom: '0px'}}>예약 달력</h1>

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

      {/* 안내 메시지 */}
      <div style={{
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: '#fef3c7',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#78350f'
      }}>
        예약을 원하시는 날짜를 선택해주세요. 과거 날짜는 선택할 수 없습니다.
      </div>

      {/* 달력 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
        <div style={{ minWidth: '490px' }}>
          {/* 요일 헤더 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(70px, 1fr))',
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
            gridTemplateColumns: 'repeat(7, minmax(70px, 1fr))',
            gap: '0',
            flex: 1,
          }}>
            {renderCalendarDays()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserBookingCalendar
