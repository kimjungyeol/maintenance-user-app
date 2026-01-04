import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface TimeSlot {
  time: string
  status: '가능' | '요청중' | '확정'
  vehicleNumber?: string
  serviceType?: string
}

// 샘플 데이터
const sampleTimeSlots: { [key: string]: TimeSlot[] } = {
  '2026-01-12': [
    { time: '10:00', status: '확정', vehicleNumber: '12루1234', serviceType: '엔진오일 교체' },
    { time: '11:00', status: '가능' },
    { time: '12:00', status: '가능' },
    { time: '13:00', status: '확정', vehicleNumber: '45가2456', serviceType: '타이어 교체' },
    { time: '14:00', status: '요청중', vehicleNumber: '78나9012', serviceType: '정기 점검' },
    { time: '15:00', status: '가능' },
    { time: '16:00', status: '가능' },
    { time: '17:00', status: '가능' }
  ]
}

const UserBookingTime: React.FC = () => {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    serviceType: '',
    customerName: '',
    phone: '',
    memo: ''
  })

  // 10:00 ~ 17:00 시간대 생성
  const getTimeSlots = (): TimeSlot[] => {
    const existing = sampleTimeSlots[date || ''] || []
    const defaultSlots: TimeSlot[] = []

    for (let hour = 10; hour < 18; hour++) {
      const timeStr = `${hour}:00`
      const existingSlot = existing.find(slot => slot.time === timeStr)
      defaultSlots.push(existingSlot || { time: timeStr, status: '가능' })
    }

    return defaultSlots
  }

  const timeSlots = getTimeSlots()

  const handleTimeSlotClick = (slot: TimeSlot) => {
    if (slot.status === '가능') {
      setSelectedTime(slot.time)
      setShowBookingForm(true)
    }
  }

  const handleBack = () => {
    navigate('/booking')
  }

  const handleCloseForm = () => {
    setShowBookingForm(false)
    setSelectedTime(null)
    setFormData({
      vehicleNumber: '',
      serviceType: '',
      customerName: '',
      phone: '',
      memo: ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`예약이 요청되었습니다.\n날짜: ${date}\n시간: ${selectedTime}\n차량번호: ${formData.vehicleNumber}`)
    handleCloseForm()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getStatusColor = (status: '가능' | '요청중' | '확정') => {
    switch (status) {
      case '가능': return '#10b981'
      case '요청중': return '#f59e0b'
      case '확정': return '#6b7280'
      default: return '#e5e7eb'
    }
  }

  const getStatusText = (status: '가능' | '요청중' | '확정') => {
    switch (status) {
      case '가능': return '예약 가능'
      case '요청중': return '요청중'
      case '확정': return '확정'
      default: return ''
    }
  }

  const maskVehicleNumber = (vehicleNumber: string): string => {
    if (!vehicleNumber || vehicleNumber.length <= 4) {
      return vehicleNumber
    }
    const prefix = vehicleNumber.slice(0, 3)
    const suffix = vehicleNumber.slice(-1)
    const masked = '*'.repeat(vehicleNumber.length - 4)
    return prefix + masked + suffix
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={handleBack}
          style={{
            padding: '8px 16px',
            backgroundColor: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          ← 달력으로 돌아가기
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
          {date} 예약 가능 시간
        </h1>
      </div>

      {/* 안내 메시지 */}
      <div style={{
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: '#dbeafe',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#1e40af'
      }}>
        예약 가능한 시간을 선택하여 예약을 진행하세요. '요청중' 또는 '확정' 상태인 시간은 예약할 수 없습니다.
      </div>

      {/* 시간별 예약 카드 */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {timeSlots.map((slot) => (
          <div
            key={slot.time}
            onClick={() => handleTimeSlotClick(slot)}
            style={{
              padding: '20px',
              border: '2px solid',
              borderColor: getStatusColor(slot.status),
              borderRadius: '8px',
              cursor: slot.status === '가능' ? 'pointer' : 'not-allowed',
              backgroundColor: slot.status === '가능' ? '#fff' : '#f9fafb',
              transition: 'all 0.2s',
              opacity: slot.status === '가능' ? 1 : 0.7,
            }}
            onMouseEnter={(e) => {
              if (slot.status === '가능') {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (slot.status === '가능') {
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  minWidth: '80px'
                }}>
                  {slot.time}
                </div>

                {slot.vehicleNumber && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                      {maskVehicleNumber(slot.vehicleNumber)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {slot.serviceType}
                    </div>
                  </div>
                )}
              </div>

              <div style={{
                padding: '6px 16px',
                backgroundColor: getStatusColor(slot.status),
                color: '#fff',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {getStatusText(slot.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 예약 폼 모달 */}
      {showBookingForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseForm}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div style={{
              backgroundColor: '#0284c7',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}>
                  ✍️
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', margin: 0 }}>예약 신청</h2>
              </div>
              <button
                onClick={handleCloseForm}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* 내용 */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#0369a1',
                  fontWeight: '600',
                  display: 'inline-block',
                  backgroundColor: '#e0f2fe',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '6px'
                }}>
                  📅 예약 일시
                </label>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  {date} {selectedTime}
                </p>
              </div>

              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#0369a1',
                  fontWeight: '600',
                  display: 'inline-block',
                  backgroundColor: '#e0f2fe',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '6px'
                }}>
                  🚗 차량번호 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                  placeholder="예: 12루1234"
                />
              </div>

              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#0369a1',
                  fontWeight: '600',
                  display: 'inline-block',
                  backgroundColor: '#e0f2fe',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '6px'
                }}>
                  🔧 정비 항목 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                  placeholder="예: 엔진오일 교체"
                />
              </div>

              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#0369a1',
                  fontWeight: '600',
                  display: 'inline-block',
                  backgroundColor: '#e0f2fe',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '6px'
                }}>
                  👤 고객명 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                  placeholder="예: 홍길동"
                />
              </div>

              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#0369a1',
                  fontWeight: '600',
                  display: 'inline-block',
                  backgroundColor: '#e0f2fe',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '6px'
                }}>
                  📞 연락처 *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                  placeholder="예: 010-1234-5678"
                />
              </div>

              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#0369a1',
                  fontWeight: '600',
                  display: 'inline-block',
                  backgroundColor: '#e0f2fe',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '6px'
                }}>
                  📝 메모
                </label>
                <textarea
                  value={formData.memo}
                  onChange={(e) => handleInputChange('memo', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical',
                  }}
                  placeholder="특별히 요청하실 사항이 있으면 적어주세요"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#fff',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'var(--primary-color)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  예약 신청
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserBookingTime
