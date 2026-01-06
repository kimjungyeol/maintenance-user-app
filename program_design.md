# 정비 예약 시스템 프로그램 설계서

## 1. 메뉴 구조

### 1.1 전체 메뉴 목록

| 메뉴 ID | 메뉴명 | 경로 | Actor | 설명 |
|---------|--------|------|-------|------|
| M01 | 대시보드 | / | ALL | 메인 대시보드, 가까운 정비소 찾기 |
| M02 | 로그인 | /login | ALL | 사용자 로그인 |
| M03 | 정비 이력 | /maintenance-history | 고객 | 고객의 정비 이력 조회 |
| M04 | 예약하기 | /booking | 고객 | 정비 예약 등록/삭제 |
| M05 | 스케줄 관리 | /schedule | 업체 | 예약 스케줄 관리 및 확인 |
| M06 | 예약 설정 | /reservation-settings | 업체 | 예약 시간/제외일자 관리 |
| M06-1 | 예약 시간 관리 | /reservation-settings/time | 업체 | 예약 가능 시간 설정 |
| M06-2 | 예약 제외 일자 관리 | /reservation-settings/exclude-dates | 업체 | 예약 불가 일자 설정 |

### 1.2 권한별 메뉴 접근

- **고객(CUSTOMER)**: M01, M02, M03, M04
- **업체(BUSINESS)**: M01, M02, M05, M06, M06-1, M06-2
- **전체(ALL)**: M01, M02

---

## 2. 업무별 코드 정의 (2자리)

| 업무 코드 | 업무명 | 설명 |
|-----------|--------|------|
| SH | Shop | 정비소 관리 |
| AU | Auth | 인증/로그인 |
| MH | MaintenanceHistory | 정비 이력 |
| BK | Booking | 예약 관리 |
| SC | Schedule | 스케줄 관리 |
| RS | ReservationSettings | 예약 설정 |
| NT | Notification | 알림(카카오톡) |

---

## 3. 화면별 기능 및 API 설계

### 3.1 대시보드 (SH - Shop)

#### 기능
- 가까운 정비소 검색 (지역별)

#### API 엔드포인트

| 기능 | HTTP Method | URI | Request DTO | Response DTO |
|------|-------------|-----|-------------|--------------|
| 지역별 정비소 조회 | GET | /api/shop/search | ShopSearchRequestDTO | ShopListResponseDTO |
| 정비소 상세 조회 | GET | /api/shop/{shopId} | - | ShopDetailResponseDTO |

---

### 3.2 로그인/인증 (AU - Auth)

#### 기능
- 로그인
- 로그아웃
- 토큰 갱신
- 사용자 정보 조회

#### API 엔드포인트

| 기능 | HTTP Method | URI | Request DTO | Response DTO |
|------|-------------|-----|-------------|--------------|
| 로그인 | POST | /api/auth/login | LoginRequestDTO | LoginResponseDTO |
| 로그아웃 | POST | /api/auth/logout | - | ApiResponseDTO |
| 토큰 갱신 | POST | /api/auth/refresh | RefreshTokenRequestDTO | TokenResponseDTO |
| 사용자 정보 조회 | GET | /api/auth/user | - | UserInfoResponseDTO |

---

### 3.3 정비 이력 (MH - MaintenanceHistory)

#### 기능
- 나의 정비 이력 목록 조회 (고객)
- 정비 이력 상세 조회

#### API 엔드포인트

| 기능 | HTTP Method | URI | Request DTO | Response DTO |
|------|-------------|-----|-------------|--------------|
| 정비 이력 목록 조회 | GET | /api/maintenance-history/list | MaintenanceHistorySearchDTO | MaintenanceHistoryListResponseDTO |
| 정비 이력 상세 조회 | GET | /api/maintenance-history/{historyId} | - | MaintenanceHistoryDetailResponseDTO |

---

### 3.4 예약하기 (BK - Booking)

#### 기능
- 예약 가능 날짜/시간 조회
- 예약 등록
- 예약 삭제
- 내 예약 목록 조회

#### API 엔드포인트

| 기능 | HTTP Method | URI | Request DTO | Response DTO |
|------|-------------|-----|-------------|--------------|
| 예약 가능 날짜 조회 | GET | /api/booking/available-dates | AvailableDatesRequestDTO | AvailableDatesResponseDTO |
| 예약 가능 시간 조회 | GET | /api/booking/available-times | AvailableTimesRequestDTO | AvailableTimesResponseDTO |
| 예약 등록 | POST | /api/booking | BookingCreateRequestDTO | BookingResponseDTO |
| 예약 삭제 | DELETE | /api/booking/{bookingId} | - | ApiResponseDTO |
| 내 예약 목록 조회 | GET | /api/booking/my-list | - | BookingListResponseDTO |

---

### 3.5 스케줄 관리 (SC - Schedule)

#### 기능
- 달력 정보 조회 (예약 건수)
- 예약 정보 목록 조회
- 예약 확정/취소
- 정비 정보 저장 (등록/수정/삭제)

#### API 엔드포인트

| 기능 | HTTP Method | URI | Request DTO | Response DTO |
|------|-------------|-----|-------------|--------------|
| 달력 정보 조회 | GET | /api/schedule/calendar | CalendarRequestDTO | CalendarResponseDTO |
| 예약 목록 조회 | GET | /api/schedule/bookings | BookingSearchRequestDTO | BookingListResponseDTO |
| 예약 확정 | PUT | /api/schedule/booking/{bookingId}/confirm | - | ApiResponseDTO |
| 예약 취소 | PUT | /api/schedule/booking/{bookingId}/cancel | BookingCancelRequestDTO | ApiResponseDTO |
| 정비 정보 등록 | POST | /api/schedule/maintenance | MaintenanceCreateRequestDTO | MaintenanceResponseDTO |
| 정비 정보 수정 | PUT | /api/schedule/maintenance/{maintenanceId} | MaintenanceUpdateRequestDTO | MaintenanceResponseDTO |
| 정비 정보 삭제 | DELETE | /api/schedule/maintenance/{maintenanceId} | - | ApiResponseDTO |

---

### 3.6 예약 설정 (RS - ReservationSettings)

#### 기능
- 예약 시간 관리
  - 예약 시간 목록 조회
  - 예약 시간 등록/수정/삭제
  - 예약 가능 팀 수 수정
- 예약 제외 일자 관리
  - 달력 조회 (제외 일자 표시)
  - 예약 제외 일자 등록/삭제

#### API 엔드포인트

| 기능 | HTTP Method | URI | Request DTO | Response DTO |
|------|-------------|-----|-------------|--------------|
| 예약 시간 목록 조회 | GET | /api/reservation-settings/times | - | ReservationTimeListResponseDTO |
| 예약 시간 등록 | POST | /api/reservation-settings/time | ReservationTimeCreateRequestDTO | ReservationTimeResponseDTO |
| 예약 시간 수정 | PUT | /api/reservation-settings/time/{timeId} | ReservationTimeUpdateRequestDTO | ReservationTimeResponseDTO |
| 예약 시간 삭제 | DELETE | /api/reservation-settings/time/{timeId} | - | ApiResponseDTO |
| 예약 가능 팀 수 수정 | PUT | /api/reservation-settings/time/{timeId}/teams | TeamCountUpdateRequestDTO | ApiResponseDTO |
| 예약 제외 일자 목록 조회 | GET | /api/reservation-settings/exclude-dates | ExcludeDateSearchRequestDTO | ExcludeDateListResponseDTO |
| 예약 제외 일자 등록 | POST | /api/reservation-settings/exclude-date | ExcludeDateCreateRequestDTO | ExcludeDateResponseDTO |
| 예약 제외 일자 삭제 | DELETE | /api/reservation-settings/exclude-date/{excludeDateId} | - | ApiResponseDTO |

---

### 3.7 알림 (NT - Notification)

#### 기능
- 카카오톡 알림 전송
  - 예약 등록 시
  - 예약 확정/취소 시
  - 정비 완료 시

#### API 엔드포인트

| 기능 | HTTP Method | URI | Request DTO | Response DTO |
|------|-------------|-----|-------------|--------------|
| 카카오톡 알림 전송 | POST | /api/notification/kakao | KakaoNotificationRequestDTO | ApiResponseDTO |

---

## 4. Java DTO 정의

### 4.1 공통 DTO

#### ApiResponseDTO
```java
package com.maintenance.dto.common;

public class ApiResponseDTO<T> {
    private boolean success;
    private String message;
    private T data;
    private String errorCode;
}
```

---

### 4.2 Shop (SH) DTO

#### ShopSearchRequestDTO
```java
package com.maintenance.dto.shop;

public class ShopSearchRequestDTO {
    private String region;        // 지역 (시/도)
    private String district;      // 구/군
    private Double latitude;      // 위도
    private Double longitude;     // 경도
    private Integer radius;       // 검색 반경 (km)
}
```

#### ShopListResponseDTO
```java
package com.maintenance.dto.shop;

import java.util.List;

public class ShopListResponseDTO {
    private List<ShopDTO> shops;
    private int totalCount;
}
```

#### ShopDTO
```java
package com.maintenance.dto.shop;

public class ShopDTO {
    private Long shopId;
    private String shopName;
    private String address;
    private String phone;
    private String businessHours;
    private Double latitude;
    private Double longitude;
    private Double distance;      // 사용자로부터의 거리 (km)
    private String imageUrl;
}
```

#### ShopDetailResponseDTO
```java
package com.maintenance.dto.shop;

public class ShopDetailResponseDTO {
    private Long shopId;
    private String shopName;
    private String address;
    private String phone;
    private String businessHours;
    private String description;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
    private List<String> services;  // 제공 서비스 목록
}
```

---

### 4.3 Auth (AU) DTO

#### LoginRequestDTO
```java
package com.maintenance.dto.auth;

public class LoginRequestDTO {
    private String username;
    private String password;
    private String userType;      // CUSTOMER, BUSINESS
}
```

#### LoginResponseDTO
```java
package com.maintenance.dto.auth;

public class LoginResponseDTO {
    private String accessToken;
    private String refreshToken;
    private Long expiresIn;
    private UserInfoDTO userInfo;
}
```

#### UserInfoDTO
```java
package com.maintenance.dto.auth;

public class UserInfoDTO {
    private Long userId;
    private String username;
    private String name;
    private String email;
    private String phone;
    private String userType;      // CUSTOMER, BUSINESS
    private Long shopId;          // 업체인 경우
}
```

#### RefreshTokenRequestDTO
```java
package com.maintenance.dto.auth;

public class RefreshTokenRequestDTO {
    private String refreshToken;
}
```

#### TokenResponseDTO
```java
package com.maintenance.dto.auth;

public class TokenResponseDTO {
    private String accessToken;
    private Long expiresIn;
}
```

#### UserInfoResponseDTO
```java
package com.maintenance.dto.auth;

public class UserInfoResponseDTO {
    private UserInfoDTO userInfo;
}
```

---

### 4.4 MaintenanceHistory (MH) DTO

#### MaintenanceHistorySearchDTO
```java
package com.maintenance.dto.maintenance;

import java.time.LocalDate;

public class MaintenanceHistorySearchDTO {
    private Long userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer page;
    private Integer size;
}
```

#### MaintenanceHistoryListResponseDTO
```java
package com.maintenance.dto.maintenance;

import java.util.List;

public class MaintenanceHistoryListResponseDTO {
    private List<MaintenanceHistoryDTO> histories;
    private int totalCount;
    private int currentPage;
    private int totalPages;
}
```

#### MaintenanceHistoryDTO
```java
package com.maintenance.dto.maintenance;

import java.time.LocalDateTime;

public class MaintenanceHistoryDTO {
    private Long historyId;
    private Long shopId;
    private String shopName;
    private LocalDateTime maintenanceDate;
    private String serviceType;
    private Integer amount;
    private String status;        // COMPLETED, CANCELLED
    private String memo;
}
```

#### MaintenanceHistoryDetailResponseDTO
```java
package com.maintenance.dto.maintenance;

import java.time.LocalDateTime;
import java.util.List;

public class MaintenanceHistoryDetailResponseDTO {
    private Long historyId;
    private Long shopId;
    private String shopName;
    private String shopPhone;
    private LocalDateTime maintenanceDate;
    private String serviceType;
    private List<String> serviceDetails;
    private Integer amount;
    private String paymentType;
    private String status;
    private String memo;
    private String technicianName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

---

### 4.5 Booking (BK) DTO

#### AvailableDatesRequestDTO
```java
package com.maintenance.dto.booking;

import java.time.LocalDate;

public class AvailableDatesRequestDTO {
    private Long shopId;
    private LocalDate startDate;
    private LocalDate endDate;
}
```

#### AvailableDatesResponseDTO
```java
package com.maintenance.dto.booking;

import java.time.LocalDate;
import java.util.List;

public class AvailableDatesResponseDTO {
    private List<LocalDate> availableDates;
    private List<LocalDate> excludedDates;
}
```

#### AvailableTimesRequestDTO
```java
package com.maintenance.dto.booking;

import java.time.LocalDate;

public class AvailableTimesRequestDTO {
    private Long shopId;
    private LocalDate date;
}
```

#### AvailableTimesResponseDTO
```java
package com.maintenance.dto.booking;

import java.util.List;

public class AvailableTimesResponseDTO {
    private List<TimeSlotDTO> timeSlots;
}
```

#### TimeSlotDTO
```java
package com.maintenance.dto.booking;

import java.time.LocalTime;

public class TimeSlotDTO {
    private Long timeSlotId;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer totalTeams;
    private Integer availableTeams;
    private boolean isAvailable;
}
```

#### BookingCreateRequestDTO
```java
package com.maintenance.dto.booking;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingCreateRequestDTO {
    private Long shopId;
    private LocalDate bookingDate;
    private Long timeSlotId;
    private String carNumber;
    private String serviceType;
    private String memo;
}
```

#### BookingResponseDTO
```java
package com.maintenance.dto.booking;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

public class BookingResponseDTO {
    private Long bookingId;
    private Long shopId;
    private String shopName;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String carNumber;
    private String serviceType;
    private String status;        // PENDING, CONFIRMED, CANCELLED, COMPLETED
    private String memo;
    private LocalDateTime createdAt;
}
```

#### BookingListResponseDTO
```java
package com.maintenance.dto.booking;

import java.util.List;

public class BookingListResponseDTO {
    private List<BookingResponseDTO> bookings;
    private int totalCount;
}
```

---

### 4.6 Schedule (SC) DTO

#### CalendarRequestDTO
```java
package com.maintenance.dto.schedule;

public class CalendarRequestDTO {
    private Long shopId;
    private Integer year;
    private Integer month;
}
```

#### CalendarResponseDTO
```java
package com.maintenance.dto.schedule;

import java.util.List;

public class CalendarResponseDTO {
    private Integer year;
    private Integer month;
    private List<DayScheduleDTO> daySchedules;
}
```

#### DayScheduleDTO
```java
package com.maintenance.dto.schedule;

import java.time.LocalDate;

public class DayScheduleDTO {
    private LocalDate date;
    private Integer bookingCount;
    private Integer pendingCount;
    private Integer confirmedCount;
    private boolean isExcluded;
}
```

#### BookingSearchRequestDTO
```java
package com.maintenance.dto.schedule;

import java.time.LocalDate;

public class BookingSearchRequestDTO {
    private Long shopId;
    private LocalDate date;
    private String status;        // ALL, PENDING, CONFIRMED, CANCELLED
}
```

#### BookingCancelRequestDTO
```java
package com.maintenance.dto.schedule;

public class BookingCancelRequestDTO {
    private String cancelReason;
}
```

#### MaintenanceCreateRequestDTO
```java
package com.maintenance.dto.schedule;

import java.time.LocalDateTime;

public class MaintenanceCreateRequestDTO {
    private Long bookingId;
    private LocalDateTime maintenanceDate;
    private String serviceType;
    private String serviceDetails;
    private Integer amount;
    private String paymentType;
    private String technicianName;
    private String memo;
}
```

#### MaintenanceUpdateRequestDTO
```java
package com.maintenance.dto.schedule;

public class MaintenanceUpdateRequestDTO {
    private String serviceDetails;
    private Integer amount;
    private String paymentType;
    private String technicianName;
    private String memo;
}
```

#### MaintenanceResponseDTO
```java
package com.maintenance.dto.schedule;

import java.time.LocalDateTime;

public class MaintenanceResponseDTO {
    private Long maintenanceId;
    private Long bookingId;
    private LocalDateTime maintenanceDate;
    private String serviceType;
    private String serviceDetails;
    private Integer amount;
    private String paymentType;
    private String technicianName;
    private String memo;
    private LocalDateTime createdAt;
}
```

---

### 4.7 ReservationSettings (RS) DTO

#### ReservationTimeListResponseDTO
```java
package com.maintenance.dto.reservation;

import java.util.List;

public class ReservationTimeListResponseDTO {
    private List<ReservationTimeDTO> times;
}
```

#### ReservationTimeDTO
```java
package com.maintenance.dto.reservation;

import java.time.LocalTime;

public class ReservationTimeDTO {
    private Long timeId;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer availableTeams;
    private boolean isActive;
}
```

#### ReservationTimeCreateRequestDTO
```java
package com.maintenance.dto.reservation;

import java.time.LocalTime;

public class ReservationTimeCreateRequestDTO {
    private Long shopId;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer availableTeams;
}
```

#### ReservationTimeUpdateRequestDTO
```java
package com.maintenance.dto.reservation;

import java.time.LocalTime;

public class ReservationTimeUpdateRequestDTO {
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer availableTeams;
    private Boolean isActive;
}
```

#### ReservationTimeResponseDTO
```java
package com.maintenance.dto.reservation;

import java.time.LocalTime;

public class ReservationTimeResponseDTO {
    private Long timeId;
    private Long shopId;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer availableTeams;
    private boolean isActive;
}
```

#### TeamCountUpdateRequestDTO
```java
package com.maintenance.dto.reservation;

public class TeamCountUpdateRequestDTO {
    private Integer availableTeams;
}
```

#### ExcludeDateSearchRequestDTO
```java
package com.maintenance.dto.reservation;

public class ExcludeDateSearchRequestDTO {
    private Long shopId;
    private Integer year;
    private Integer month;
}
```

#### ExcludeDateListResponseDTO
```java
package com.maintenance.dto.reservation;

import java.util.List;

public class ExcludeDateListResponseDTO {
    private List<ExcludeDateDTO> excludeDates;
}
```

#### ExcludeDateDTO
```java
package com.maintenance.dto.reservation;

import java.time.LocalDate;

public class ExcludeDateDTO {
    private Long excludeDateId;
    private LocalDate excludeDate;
    private String reason;
}
```

#### ExcludeDateCreateRequestDTO
```java
package com.maintenance.dto.reservation;

import java.time.LocalDate;

public class ExcludeDateCreateRequestDTO {
    private Long shopId;
    private LocalDate excludeDate;
    private String reason;
}
```

#### ExcludeDateResponseDTO
```java
package com.maintenance.dto.reservation;

import java.time.LocalDate;

public class ExcludeDateResponseDTO {
    private Long excludeDateId;
    private Long shopId;
    private LocalDate excludeDate;
    private String reason;
}
```

---

### 4.8 Notification (NT) DTO

#### KakaoNotificationRequestDTO
```java
package com.maintenance.dto.notification;

import java.util.Map;

public class KakaoNotificationRequestDTO {
    private String templateCode;    // BOOKING_CREATED, BOOKING_CONFIRMED, BOOKING_CANCELLED, MAINTENANCE_COMPLETED
    private String phoneNumber;
    private Map<String, String> parameters;
}
```

---

## 5. Database 설계

### 5.1 논리 설계 (ERD)

#### 주요 엔티티

1. **사용자 (User)**
   - 사용자 ID (PK)
   - 사용자명
   - 비밀번호
   - 이름
   - 이메일
   - 전화번호
   - 사용자 타입 (고객/업체)
   - 정비소 ID (FK)

2. **정비소 (Shop)**
   - 정비소 ID (PK)
   - 정비소명
   - 주소
   - 전화번호
   - 영업시간
   - 설명
   - 위도
   - 경도
   - 이미지 URL

3. **예약 (Booking)**
   - 예약 ID (PK)
   - 정비소 ID (FK)
   - 사용자 ID (FK)
   - 예약 날짜
   - 시간대 ID (FK)
   - 차량번호
   - 서비스 타입
   - 상태 (대기/확정/취소/완료)
   - 메모
   - 생성일시
   - 수정일시

4. **정비 이력 (MaintenanceHistory)**
   - 사용자 ID (PK)
   - 정비소 ID (PK)
   - 정비 이력 ID (PK)
   - 예약 ID
   - 정비일시
   - 서비스 타입
   - 서비스 상세
   - 금액
   - 결제 타입
   - 담당자명
   - 상태
   - 메모
   - 생성일시
   - 수정일시

5. **예약 시간대 (ReservationTime)**
   - 정비소 ID (PK)
   - 시간대 ID (PK)
   - 시간대
   - 가능 팀 수
   - 활성 여부

6. **예약 제외 일자 (ExcludeDate)**
   - 정비소 ID (PK)
   - 제외 일자 ID (PK)
   - 제외 날짜
   - 사유

7. **알림 이력 (NotificationHistory)**
   - 알림 ID (PK)
   - 사용자 ID (FK)
   - 알림 타입
   - 전화번호
   - 템플릿 코드
   - 발송 상태
   - 발송일시

---

### 5.2 물리 설계 (테이블 정의)

#### TB_USER (사용자)

| 컬럼명 | 데이터 타입 | NULL | 키 | 설명 |
|--------|------------|------|-----|------|
| USER_ID | BIGINT | NOT NULL | PK | 사용자 ID (자동증가) |
| USERNAME | VARCHAR(50) | NOT NULL | UQ | 사용자명 |
| PASSWORD | VARCHAR(255) | NOT NULL | | 비밀번호 (암호화) |
| NAME | VARCHAR(100) | NOT NULL | | 이름 |
| EMAIL | VARCHAR(100) | NULL | | 이메일 |
| PHONE | VARCHAR(20) | NOT NULL | | 전화번호 |
| USER_TYPE | VARCHAR(20) | NOT NULL | | 사용자 타입 (CUSTOMER, BUSINESS) |
| SHOP_ID | BIGINT | NULL | FK | 정비소 ID (업체인 경우) |
| CREATED_AT | DATETIME | NOT NULL | | 생성일시 |
| UPDATED_AT | DATETIME | NOT NULL | | 수정일시 |

#### TB_SHOP (정비소)

| 컬럼명 | 데이터 타입 | NULL | 키 | 설명 |
|--------|------------|------|-----|------|
| SHOP_ID | BIGINT | NOT NULL | PK | 정비소 ID (자동증가) |
| SHOP_NAME | VARCHAR(200) | NOT NULL | | 정비소명 |
| ADDRESS | VARCHAR(500) | NOT NULL | | 주소 |
| PHONE | VARCHAR(20) | NOT NULL | | 전화번호 |
| BUSINESS_HOURS | VARCHAR(100) | NULL | | 영업시간 |
| DESCRIPTION | TEXT | NULL | | 설명 |
| LATITUDE | DECIMAL(10,7) | NULL | | 위도 |
| LONGITUDE | DECIMAL(10,7) | NULL | | 경도 |
| IMAGE_URL | VARCHAR(500) | NULL | | 이미지 URL |
| CREATED_AT | DATETIME | NOT NULL | | 생성일시 |
| UPDATED_AT | DATETIME | NOT NULL | | 수정일시 |

#### TB_BOOKING (예약)

| 컬럼명 | 데이터 타입 | NULL | 키 | 설명 |
|--------|------------|------|-----|------|
| BOOKING_ID | BIGINT | NOT NULL | PK | 예약 ID (자동증가) |
| SHOP_ID | BIGINT | NOT NULL | FK | 정비소 ID |
| USER_ID | BIGINT | NOT NULL | FK | 사용자 ID |
| BOOKING_DATE | DATE | NOT NULL | | 예약 날짜 |
| TIME_SLOT_ID | BIGINT | NOT NULL | FK | 시간대 ID |
| CAR_NUMBER | VARCHAR(20) | NOT NULL | | 차량번호 |
| SERVICE_TYPE | VARCHAR(100) | NOT NULL | | 서비스 타입 |
| STATUS | VARCHAR(20) | NOT NULL | | 상태 (PENDING, CONFIRMED, CANCELLED, COMPLETED) |
| MEMO | TEXT | NULL | | 메모 |
| CREATED_AT | DATETIME | NOT NULL | | 생성일시 |
| UPDATED_AT | DATETIME | NOT NULL | | 수정일시 |

#### TB_MAINTENANCE_HISTORY (정비 이력)

| 컬럼명 | 데이터 타입 | NULL | 키 | 설명 |
|--------|------------|------|-----|------|
| HISTORY_ID | BIGINT | NOT NULL | PK | 정비 이력 ID (자동증가) |
| BOOKING_ID | BIGINT | NULL | FK | 예약 ID |
| SHOP_ID | BIGINT | NOT NULL | FK | 정비소 ID |
| USER_ID | BIGINT | NOT NULL | FK | 사용자 ID |
| MAINTENANCE_DATE | DATETIME | NOT NULL | | 정비일시 |
| SERVICE_TYPE | VARCHAR(100) | NOT NULL | | 서비스 타입 |
| SERVICE_DETAILS | TEXT | NULL | | 서비스 상세 |
| AMOUNT | INT | NULL | | 금액 |
| PAYMENT_TYPE | VARCHAR(20) | NULL | | 결제 타입 (CASH, CARD, TRANSFER) |
| TECHNICIAN_NAME | VARCHAR(100) | NULL | | 담당자명 |
| STATUS | VARCHAR(20) | NOT NULL | | 상태 (COMPLETED, CANCELLED) |
| MEMO | TEXT | NULL | | 메모 |
| CREATED_AT | DATETIME | NOT NULL | | 생성일시 |
| UPDATED_AT | DATETIME | NOT NULL | | 수정일시 |

#### TB_RESERVATION_TIME (예약 시간대)

| 컬럼명 | 데이터 타입 | NULL | 키 | 설명 |
|--------|------------|------|-----|------|
| TIME_SLOT_ID | BIGINT | NOT NULL | PK | 시간대 ID (자동증가) |
| SHOP_ID | BIGINT | NOT NULL | FK | 정비소 ID |
| START_TIME | TIME | NOT NULL | | 시작 시간 |
| END_TIME | TIME | NOT NULL | | 종료 시간 |
| AVAILABLE_TEAMS | INT | NOT NULL | | 가능 팀 수 |
| IS_ACTIVE | BOOLEAN | NOT NULL | | 활성 여부 |
| CREATED_AT | DATETIME | NOT NULL | | 생성일시 |
| UPDATED_AT | DATETIME | NOT NULL | | 수정일시 |

#### TB_EXCLUDE_DATE (예약 제외 일자)

| 컬럼명 | 데이터 타입 | NULL | 키 | 설명 |
|--------|------------|------|-----|------|
| EXCLUDE_DATE_ID | BIGINT | NOT NULL | PK | 제외 일자 ID (자동증가) |
| SHOP_ID | BIGINT | NOT NULL | FK | 정비소 ID |
| EXCLUDE_DATE | DATE | NOT NULL | | 제외 날짜 |
| REASON | VARCHAR(200) | NULL | | 사유 |
| CREATED_AT | DATETIME | NOT NULL | | 생성일시 |

#### TB_NOTIFICATION_HISTORY (알림 이력)

| 컬럼명 | 데이터 타입 | NULL | 키 | 설명 |
|--------|------------|------|-----|------|
| NOTIFICATION_ID | BIGINT | NOT NULL | PK | 알림 ID (자동증가) |
| USER_ID | BIGINT | NOT NULL | FK | 사용자 ID |
| NOTIFICATION_TYPE | VARCHAR(50) | NOT NULL | | 알림 타입 (KAKAO) |
| PHONE_NUMBER | VARCHAR(20) | NOT NULL | | 전화번호 |
| TEMPLATE_CODE | VARCHAR(50) | NOT NULL | | 템플릿 코드 |
| STATUS | VARCHAR(20) | NOT NULL | | 발송 상태 (SUCCESS, FAILED) |
| SENT_AT | DATETIME | NOT NULL | | 발송일시 |

---

## 6. Spring Boot Controller/Service/Mapper 파일 구조

### 6.1 Controller 파일

| 업무 코드 | Controller 파일명 | 설명 |
|-----------|------------------|------|
| SH | ShopController.java | 정비소 관리 Controller |
| AU | AuthController.java | 인증/로그인 Controller |
| MH | MaintenanceHistoryController.java | 정비 이력 Controller |
| BK | BookingController.java | 예약 관리 Controller |
| SC | ScheduleController.java | 스케줄 관리 Controller |
| RS | ReservationSettingsController.java | 예약 설정 Controller |
| NT | NotificationController.java | 알림 Controller |

### 6.2 Service 파일

| 업무 코드 | Service 파일명 | 설명 |
|-----------|---------------|------|
| SH | ShopService.java | 정비소 관리 Service |
| AU | AuthService.java | 인증/로그인 Service |
| MH | MaintenanceHistoryService.java | 정비 이력 Service |
| BK | BookingService.java | 예약 관리 Service |
| SC | ScheduleService.java | 스케줄 관리 Service |
| RS | ReservationSettingsService.java | 예약 설정 Service |
| NT | NotificationService.java | 알림 Service |

### 6.3 Mapper 파일 (MyBatis)

| 업무 코드 | Mapper Interface 파일명 | Mapper XML 파일명 | 설명 |
|-----------|------------------------|------------------|------|
| SH | ShopMapper.java | ShopMapper.xml | 정비소 관리 Mapper |
| AU | AuthMapper.java | AuthMapper.xml | 인증/로그인 Mapper |
| MH | MaintenanceHistoryMapper.java | MaintenanceHistoryMapper.xml | 정비 이력 Mapper |
| BK | BookingMapper.java | BookingMapper.xml | 예약 관리 Mapper |
| SC | ScheduleMapper.java | ScheduleMapper.xml | 스케줄 관리 Mapper |
| RS | ReservationSettingsMapper.java | ReservationSettingsMapper.xml | 예약 설정 Mapper |
| NT | NotificationMapper.java | NotificationMapper.xml | 알림 Mapper |

---

## 7. 패키지 구조

```
com.maintenance
├── controller
│   ├── AuthController.java
│   ├── BookingController.java
│   ├── MaintenanceHistoryController.java
│   ├── NotificationController.java
│   ├── ReservationSettingsController.java
│   ├── ScheduleController.java
│   └── ShopController.java
├── service
│   ├── AuthService.java
│   ├── BookingService.java
│   ├── MaintenanceHistoryService.java
│   ├── NotificationService.java
│   ├── ReservationSettingsService.java
│   ├── ScheduleService.java
│   └── ShopService.java
├── mapper
│   ├── AuthMapper.java
│   ├── BookingMapper.java
│   ├── MaintenanceHistoryMapper.java
│   ├── NotificationMapper.java
│   ├── ReservationSettingsMapper.java
│   ├── ScheduleMapper.java
│   └── ShopMapper.java
├── dto
│   ├── common
│   │   └── ApiResponseDTO.java
│   ├── auth
│   │   ├── LoginRequestDTO.java
│   │   ├── LoginResponseDTO.java
│   │   ├── RefreshTokenRequestDTO.java
│   │   ├── TokenResponseDTO.java
│   │   ├── UserInfoDTO.java
│   │   └── UserInfoResponseDTO.java
│   ├── booking
│   │   ├── AvailableDatesRequestDTO.java
│   │   ├── AvailableDatesResponseDTO.java
│   │   ├── AvailableTimesRequestDTO.java
│   │   ├── AvailableTimesResponseDTO.java
│   │   ├── BookingCreateRequestDTO.java
│   │   ├── BookingListResponseDTO.java
│   │   ├── BookingResponseDTO.java
│   │   └── TimeSlotDTO.java
│   ├── maintenance
│   │   ├── MaintenanceHistoryDetailResponseDTO.java
│   │   ├── MaintenanceHistoryDTO.java
│   │   ├── MaintenanceHistoryListResponseDTO.java
│   │   └── MaintenanceHistorySearchDTO.java
│   ├── notification
│   │   └── KakaoNotificationRequestDTO.java
│   ├── reservation
│   │   ├── ExcludeDateCreateRequestDTO.java
│   │   ├── ExcludeDateDTO.java
│   │   ├── ExcludeDateListResponseDTO.java
│   │   ├── ExcludeDateResponseDTO.java
│   │   ├── ExcludeDateSearchRequestDTO.java
│   │   ├── ReservationTimeCreateRequestDTO.java
│   │   ├── ReservationTimeDTO.java
│   │   ├── ReservationTimeListResponseDTO.java
│   │   ├── ReservationTimeResponseDTO.java
│   │   ├── ReservationTimeUpdateRequestDTO.java
│   │   └── TeamCountUpdateRequestDTO.java
│   ├── schedule
│   │   ├── BookingCancelRequestDTO.java
│   │   ├── BookingSearchRequestDTO.java
│   │   ├── CalendarRequestDTO.java
│   │   ├── CalendarResponseDTO.java
│   │   ├── DayScheduleDTO.java
│   │   ├── MaintenanceCreateRequestDTO.java
│   │   ├── MaintenanceResponseDTO.java
│   │   └── MaintenanceUpdateRequestDTO.java
│   └── shop
│       ├── ShopDetailResponseDTO.java
│       ├── ShopDTO.java
│       ├── ShopListResponseDTO.java
│       └── ShopSearchRequestDTO.java
├── entity
│   ├── Booking.java
│   ├── ExcludeDate.java
│   ├── MaintenanceHistory.java
│   ├── NotificationHistory.java
│   ├── ReservationTime.java
│   ├── Shop.java
│   └── User.java
└── config
    ├── SecurityConfig.java
    ├── MyBatisConfig.java
    └── WebConfig.java
```

---

## 8. 추가 고려사항

### 8.1 보안
- JWT 기반 인증 구현
- 비밀번호 암호화 (BCrypt)
- CORS 설정
- XSS, CSRF 방어

### 8.2 성능
- 데이터베이스 인덱스 최적화
  - TB_BOOKING: (SHOP_ID, BOOKING_DATE, STATUS)
  - TB_MAINTENANCE_HISTORY: (USER_ID, MAINTENANCE_DATE)
  - TB_USER: (USERNAME), (PHONE)
  - TB_RESERVATION_TIME: (SHOP_ID, IS_ACTIVE)
- 캐싱 전략 (Redis)
  - 예약 가능 시간대
  - 예약 제외 일자

### 8.3 알림
- 카카오톡 알림톡 연동
- 템플릿 관리
  - BOOKING_CREATED: 예약 생성
  - BOOKING_CONFIRMED: 예약 확정
  - BOOKING_CANCELLED: 예약 취소
  - MAINTENANCE_COMPLETED: 정비 완료

### 8.4 로깅
- 요청/응답 로깅
- 예외 처리 로깅
- 알림 발송 이력

### 8.5 트랜잭션 관리
- 예약 생성 + 알림 발송
- 정비 완료 + 이력 저장 + 알림 발송
- 예약 확정/취소 + 알림 발송

---

## 9. API 응답 형식

### 9.1 성공 응답
```json
{
  "success": true,
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": {
    // 응답 데이터
  },
  "errorCode": null
}
```

### 9.2 실패 응답
```json
{
  "success": false,
  "message": "오류가 발생했습니다.",
  "data": null,
  "errorCode": "ERR_001"
}
```

### 9.3 에러 코드
- ERR_001: 인증 실패
- ERR_002: 권한 없음
- ERR_003: 필수 파라미터 누락
- ERR_004: 데이터 없음
- ERR_005: 중복 데이터
- ERR_006: 예약 시간 중복
- ERR_007: 예약 불가 날짜
- ERR_008: 알림 발송 실패

---

## 10. 개발 우선순위

### Phase 1: 기본 인증 및 정비소 조회
1. 로그인/로그아웃 (AuthController)
2. 정비소 검색 (ShopController)

### Phase 2: 예약 기능
1. 예약 시간 설정 (ReservationSettingsController)
2. 예약 등록/조회 (BookingController)

### Phase 3: 스케줄 관리
1. 스케줄 관리 (ScheduleController)
2. 정비 이력 (MaintenanceHistoryController)

### Phase 4: 알림 기능
1. 카카오톡 알림 (NotificationController)

---

**작성일**: 2026-01-06
**작성자**: Claude Code Assistant
**버전**: 1.0
