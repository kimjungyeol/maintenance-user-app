import React, { useState } from 'react'

interface MaintenanceRecord {
  id: string
  date: string
  vehicleNumber: string
  mileage: number
  serviceType: string
  memo: string
}

// 샘플 데이터
const sampleRecords: MaintenanceRecord[] = [
  {
    id: '1',
    date: '2025-01-15',
    vehicleNumber: '12루1234',
    mileage: 45000,
    serviceType: '엔진오일 교체',
    memo: '정기 점검 완료. 브레이크 패드 80% 남음'
  },
  {
    id: '2',
    date: '2025-02-20',
    vehicleNumber: '12루1234',
    mileage: 45500,
    serviceType: '타이어 교체',
    memo: '전륜 타이어 2개 교체. 다음 점검 90,000km'
  },
  {
    id: '3',
    date: '2025-03-10',
    vehicleNumber: '12루1234',
    mileage: 46000,
    serviceType: '정기 점검',
    memo: '에어컨 필터 교체 권장'
  }
]

const MaintenanceHistory: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null)
  const [records] = useState<MaintenanceRecord[]>(sampleRecords)

  const handleRecordClick = (record: MaintenanceRecord) => {
    setSelectedRecord(record)
  }

  const handleCloseDetail = () => {
    setSelectedRecord(null)
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>정비 이력</h1>

      {/* 정비 이력 목록 */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {records.map((record) => (
          <div
            key={record.id}
            onClick={() => handleRecordClick(record)}
            style={{
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: '#fff',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.borderColor = 'var(--primary-color)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  {record.serviceType}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  차량번호: {record.vehicleNumber}
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  날짜: {record.date}
                </p>
              </div>
              <div style={{
                padding: '4px 12px',
                backgroundColor: '#f3f4f6',
                borderRadius: '16px',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                {record.mileage.toLocaleString()}km
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 상세 정보 모달 */}
      {selectedRecord && (
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
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>정비 상세 정보</h2>
              <button
                onClick={handleCloseDetail}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  정비 항목
                </label>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>{selectedRecord.serviceType}</p>
              </div>

              <div>
                <label style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  차량번호
                </label>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>{selectedRecord.vehicleNumber}</p>
              </div>

              <div>
                <label style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  킬로수
                </label>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>{selectedRecord.mileage.toLocaleString()}km</p>
              </div>

              <div>
                <label style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  정비 날짜
                </label>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>{selectedRecord.date}</p>
              </div>

              <div>
                <label style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  메모
                </label>
                <p style={{
                  fontSize: '16px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  lineHeight: '1.6'
                }}>
                  {selectedRecord.memo}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaintenanceHistory
