import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

// 샘플 제휴 업체 데이터
const partnerShops: Shop[] = [
  {
    id: 'shop1',
    name: '서울자동차정비',
    region: '서울',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    rating: 4.8,
    description: '20년 경력의 전문 정비소'
  },
  {
    id: 'shop2',
    name: '강남카센터',
    region: '서울',
    address: '서울시 강남구 역삼동 456',
    phone: '02-2345-6789',
    rating: 4.5,
    description: '수입차 전문 정비'
  },
  {
    id: 'shop3',
    name: '부산모터스',
    region: '부산',
    address: '부산시 해운대구 센텀로 789',
    phone: '051-3456-7890',
    rating: 4.7,
    description: '해운대 최고의 정비소'
  },
  {
    id: 'shop4',
    name: '인천오토',
    region: '인천',
    address: '인천시 연수구 송도대로 321',
    phone: '032-4567-8901',
    rating: 4.6,
    description: '친절한 서비스, 합리적인 가격'
  },
  {
    id: 'shop5',
    name: '대구자동차',
    region: '대구',
    address: '대구시 수성구 범어동 654',
    phone: '053-5678-9012',
    rating: 4.4,
    description: '국산차 전문'
  },
  {
    id: 'shop6',
    name: '서울프리미엄정비',
    region: '서울',
    address: '서울시 송파구 잠실동 987',
    phone: '02-6789-0123',
    rating: 4.9,
    description: '프리미엄 수입차 전문'
  },
  {
    id: 'shop7',
    name: '부산카테크',
    region: '부산',
    address: '부산시 남구 대연동 147',
    phone: '051-7890-1234',
    rating: 4.3,
    description: '첨단 장비 보유'
  },
  {
    id: 'shop8',
    name: '경기오토서비스',
    region: '경기',
    address: '경기도 성남시 분당구 정자동 258',
    phone: '031-8901-2345',
    rating: 4.5,
    description: '분당 지역 대표 정비소'
  }
]

const ShopSearch: React.FC = () => {
  const navigate = useNavigate()
  const { favoriteShopIds, toggleFavorite, isFavorite } = useFavorite()
  const [searchRegion, setSearchRegion] = useState('')
  const [searchName, setSearchName] = useState('')
  const [filteredShops, setFilteredShops] = useState<Shop[]>(partnerShops)

  const regions = ['전체', '서울', '부산', '인천', '대구', '경기']
  const favoriteShops = partnerShops.filter(shop => isFavorite(shop.id))

  const handleSearch = () => {
    let results = partnerShops

    if (searchRegion && searchRegion !== '전체') {
      results = results.filter(shop => shop.region === searchRegion)
    }

    if (searchName.trim()) {
      results = results.filter(shop =>
        shop.name.toLowerCase().includes(searchName.toLowerCase())
      )
    }

    setFilteredShops(results)
  }

  const handleReset = () => {
    setSearchRegion('')
    setSearchName('')
    setFilteredShops(partnerShops)
  }

  const handleShopSelect = (shop: Shop) => {
    navigate('/booking/calendar', { state: { selectedShop: shop } })
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} style={{ color: '#fbbf24' }}>★</span>
        ))}
        {hasHalfStar && <span style={{ color: '#fbbf24' }}>☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} style={{ color: '#d1d5db' }}>☆</span>
        ))}
        <span style={{ marginLeft: '4px', fontSize: '14px', color: '#6b7280' }}>
          {rating.toFixed(1)}
        </span>
      </div>
    )
  }

  const renderShopCard = (shop: Shop) => (
    <div
      key={shop.id}
      onClick={() => handleShopSelect(shop)}
      style={{
        padding: '20px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary-color)'
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '4px',
            color: '#111827'
          }}>
            {shop.name}
          </h3>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            {shop.description}
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            padding: '4px 12px',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500'
          }}>
            {shop.region}
          </span>
          {/* 즐겨찾기 아이콘 */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(shop.id)
            }}
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
            title={isFavorite(shop.id) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            {isFavorite(shop.id) ? '❤️' : '🤍'}
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div style={{ fontSize: '14px', color: '#374151' }}>
          <span style={{ fontWeight: '500' }}>주소:</span> {shop.address}
        </div>
        <div style={{ fontSize: '14px', color: '#374151' }}>
          <span style={{ fontWeight: '500' }}>전화:</span> {shop.phone}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {renderStars(shop.rating)}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleShopSelect(shop)
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
        >
          예약하기
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* 즐겨찾기 섹션 */}
      {favoriteShops.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>❤️</span>
            즐겨찾기 ({favoriteShops.length})
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {favoriteShops.map(shop => renderShopCard(shop))}
          </div>
        </div>
      )}
      
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
        정비업체 선택
      </h1>

      {/* 검색 영역 */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          {/* 지역 선택 */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              지역
            </label>
            <select
              value={searchRegion}
              onChange={(e) => setSearchRegion(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="">전체</option>
              {regions.filter(r => r !== '전체').map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* 업체명 검색 */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              업체명
            </label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="업체명 입력"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 24px',
              backgroundColor: 'var(--primary-color)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            검색
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '10px 24px',
              backgroundColor: '#fff',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff'
            }}
          >
            초기화
          </button>
        </div>
      </div>

      {/* 검색 결과 */}
      <div style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
        총 {filteredShops.length}개의 제휴 업체
      </div>

      {/* 업체 목록 */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredShops.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            color: '#6b7280'
          }}>
            검색 결과가 없습니다.
          </div>
        ) : (
          filteredShops.map(shop => renderShopCard(shop))
        )}
      </div>
    </div>
  )
}

export default ShopSearch
