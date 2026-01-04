import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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

interface TimeSlot {
  time: string
  appointment: Appointment | null
}

// 샘플 데이터
const sampleAppointments: { [key: string]: Appointment[] } = {
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
  ]
}

const AdminDaySchedule: React.FC = () => {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // 10:00 ~ 18:00 시간대 생성
  const timeSlots: TimeSlot[] = []
  for (let hour = 10; hour < 18; hour++) {
    const timeStr = `${hour}:00`
    const appointment = sampleAppointments[date || '']?.find(apt => apt.time === timeStr) || null
    timeSlots.push({ time: timeStr, appointment })
  }

  const handleTimeSlotClick = (slot: TimeSlot) => {
    if (slot.appointment) {
      setSelectedAppointment(slot.appointment)
    }
  }

  const handleCloseDetail = () => {
    setSelectedAppointment(null)
  }

  const handleBack = () => {
    navigate('/schedule')
  }

  const handleConfirm = () => {
    if (selectedAppointment) {
      alert(`예약을 확정했습니다.\n차량번호: ${selectedAppointment.vehicleNumber}\n시간: ${selectedAppointment.time}`)
      handleCloseDetail()
    }
  }

  const handleCancel = () => {
    if (selectedAppointment) {
      if (confirm(`예약을 취소하시겠습니까?\n차량번호: ${selectedAppointment.vehicleNumber}\n시간: ${selectedAppointment.time}`)) {
        alert('예약이 취소되었습니다.')
        handleCloseDetail()
      }
    }
  }

  const handleCancelConfirmed = () => {
    if (selectedAppointment) {
      if (confirm(`확정된 예약을 취소하시겠습니까?\n차량번호: ${selectedAppointment.vehicleNumber}\n시간: ${selectedAppointment.time}`)) {
        alert('확정이 취소되었습니다.')
        handleCloseDetail()
      }
    }
  }

  const getStatusColor = (status: '요청중' | '확정') => {
    return status === '확정' ? '#10b981' : '#f59e0b'
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
          {date} 예약 현황
        </h1>
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
              borderColor: slot.appointment ? getStatusColor(slot.appointment.status) : '#e5e7eb',
              borderRadius: '8px',
              cursor: slot.appointment ? 'pointer' : 'default',
              backgroundColor: slot.appointment ? '#fff' : '#f9fafb',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (slot.appointment) {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (slot.appointment) {
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  minWidth: '80px',
                  color: slot.appointment ? '#000' : '#9ca3af'
                }}>
                  {slot.time}
                </div>

                {slot.appointment ? (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                        {slot.appointment.vehicleNumber} - {slot.appointment.customerName}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {slot.appointment.serviceType}
                      </div>
                    </div>
                    <div style={{
                      padding: '6px 16px',
                      backgroundColor: getStatusColor(slot.appointment.status),
                      color: '#fff',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {slot.appointment.status}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                    예약 없음
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 예약 상세 정보 모달 */}
      {selectedAppointment && (
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
          onClick={handleCloseDetail}
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
              backgroundColor: '#7c3aed',
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
                  📋
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', margin: 0 }}>예약 상세 정보</h2>
              </div>
              <button
                onClick={handleCloseDetail}
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
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#6b21a8',
                  fontWeight: '600',
                  display: 'inline-block',
                  backgroundColor: '#f3e8ff',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '6px'
                }}>
                  ⏰ 예약 시간
                </label>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{selectedAppointment.time}</p>
              </div>

              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#6b21a8',
                  fontWeight: '600',
                  display: 'inline-block',
                  backgroundColor: '#f3e8ff',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '6px'
                }}>
                  🚗 차량번호
                </label>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{selectedAppointment.vehicleNumber}</p>
              </div>

              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#6b21a8',
                  fontWeight: '600',
                  display: 'inline-block',
                  backgroundColor: '#f3e8ff',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '6px'
                }}>
                  👤 고객명
                </label>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{selectedAppointment.customerName}</p>
              </div>

              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#6b21a8',
                  fontWeight: '600',
                  display: 'inline-block',
                  backgroundColor: '#f3e8ff',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '6px'
                }}>
                  📞 연락처
                </label>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{selectedAppointment.phone}</p>
              </div>

              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#6b21a8',
                  fontWeight: '600',
                  display: 'inline-block',
                  backgroundColor: '#f3e8ff',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '6px'
                }}>
                  🔧 정비 항목
                </label>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{selectedAppointment.serviceType}</p>
              </div>

              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#6b21a8',
                  fontWeight: '600',
                  display: 'inline-block',
                  backgroundColor: '#f3e8ff',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '6px'
                }}>
                  ✅ 상태
                </label>
                <div>
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    backgroundColor: getStatusColor(selectedAppointment.status),
                    color: '#fff',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {selectedAppointment.status}
                  </div>
                </div>
              </div>

              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#6b21a8',
                  fontWeight: '600',
                  display: 'inline-block',
                  backgroundColor: '#f3e8ff',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginBottom: '6px'
                }}>
                  📝 메모
                </label>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1f2937',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  lineHeight: '1.6',
                  minHeight: '60px'
                }}>
                  {selectedAppointment.memo || '메모 없음'}
                </p>
              </div>

              {/* 상태별 버튼 */}
              <div style={{ marginTop: '8px', display: 'flex', gap: '12px' }}>
                {selectedAppointment.status === '요청중' && (
                  <>
                    <button
                      onClick={handleConfirm}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#059669'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#10b981'
                      }}
                    >
                      확정
                    </button>
                    <button
                      onClick={handleCancel}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ef4444'
                      }}
                    >
                      취소
                    </button>
                  </>
                )}

                {selectedAppointment.status === '확정' && (
                  <button
                    onClick={handleCancelConfirmed}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#f59e0b',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#d97706'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f59e0b'
                    }}
                  >
                    확정취소
                  </button>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDaySchedule
