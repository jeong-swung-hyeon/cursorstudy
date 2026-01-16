import { useState, useEffect } from 'react'
import './App.css'

const API_BASE_URL = 'http://localhost:8000/api/sport-facilities'

function App() {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pageNo, setPageNo] = useState(1)
  const [numOfRows, setNumOfRows] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState({
    facilityName: '',
    city: '',
    district: ''
  })

  // 서버 연결 확인
  const checkServerConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/health')
      if (!response.ok) {
        throw new Error('서버가 응답하지 않습니다')
      }
      return true
    } catch (err) {
      return false
    }
  }

  // 데이터 가져오기
  const fetchFacilities = async (page = 1) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        pageNo: page.toString(),
        numOfRows: numOfRows.toString(),
        resultType: 'json',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      })

      console.log(`[API 요청] ${API_BASE_URL}?${params}`)

      const response = await fetch(`${API_BASE_URL}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors', // CORS 명시적 설정
      })

      console.log(`[API 응답] Status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorText}`)
        }
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.message || '데이터를 가져오는 중 오류가 발생했습니다.')
      }

      // 응답 구조에 따라 데이터 추출
      if (data.response && data.response.body) {
        const body = data.response.body
        const items = body.items?.item || []
        setFacilities(Array.isArray(items) ? items : [items])
        setTotalCount(parseInt(body.totalCount || 0))
      } else if (data.data) {
        setFacilities(Array.isArray(data.data) ? data.data : [data.data])
        setTotalCount(data.currentCount || 0)
      } else {
        setFacilities([])
        setTotalCount(0)
      }
    } catch (err) {
      let errorMessage = err.message
      
      // 네트워크 오류 처리
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.name === 'TypeError') {
        // 서버 연결 확인 시도
        try {
          const healthCheck = await fetch('http://localhost:8000/health')
          if (healthCheck.ok) {
            errorMessage = 'API 요청이 실패했습니다. 서버는 실행 중이지만 데이터를 가져올 수 없습니다.\n\n확인 사항:\n1. 브라우저 개발자 도구(F12)의 Network 탭에서 요청 상태를 확인하세요.\n2. 서버 터미널에서 오류 메시지가 있는지 확인하세요.\n3. Console 탭에서 자세한 오류 메시지를 확인하세요.'
          } else {
            errorMessage = '백엔드 서버에 연결할 수 없습니다.\n\n확인 사항:\n1. 백엔드 서버가 http://localhost:8000에서 실행 중인지 확인하세요.\n2. backend 폴더에서 start_server.bat 파일을 실행했는지 확인하세요.\n3. 방화벽이 연결을 차단하지 않는지 확인하세요.'
          }
        } catch {
          errorMessage = '백엔드 서버에 연결할 수 없습니다.\n\n확인 사항:\n1. 백엔드 서버가 http://localhost:8000에서 실행 중인지 확인하세요.\n2. backend 폴더에서 start_server.bat 파일을 실행했는지 확인하세요.\n3. 방화벽이 연결을 차단하지 않는지 확인하세요.\n4. 브라우저 콘솔(F12)에서 CORS 오류가 있는지 확인하세요.'
        }
      }
      
      setError(errorMessage)
      setFacilities([])
      console.error('API 호출 오류:', err)
      console.error('오류 상세:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      })
    } finally {
      setLoading(false)
    }
  }

  // 초기 로드
  useEffect(() => {
    fetchFacilities(pageNo)
  }, [pageNo, numOfRows])

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault()
    setPageNo(1)
    fetchFacilities(1)
  }

  // 필터 변경 핸들러
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // 페이지 변경
  const handlePageChange = (newPage) => {
    setPageNo(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalCount / numOfRows)

  return (
    <div className="app">
      {/* 헤더 */}
      <header className="header fade-in">
        <div className="header-content">
          <h1>🏃 스포츠 시설 대시보드</h1>
          <div className="header-actions">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              총 {totalCount.toLocaleString()}개 시설
            </span>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="main-content">
        {/* 검색 및 필터 섹션 */}
        <section className="search-section slide-in">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="form-group">
              <label htmlFor="facilityName">시설명</label>
              <input
                id="facilityName"
                type="text"
                placeholder="시설명 검색"
                value={filters.facilityName}
                onChange={(e) => handleFilterChange('facilityName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">시/도</label>
              <input
                id="city"
                type="text"
                placeholder="시/도 검색"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="district">시/군/구</label>
              <input
                id="district"
                type="text"
                placeholder="시/군/구 검색"
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="numOfRows">페이지당 항목 수</label>
              <select
                id="numOfRows"
                value={numOfRows}
                onChange={(e) => {
                  setNumOfRows(Number(e.target.value))
                  setPageNo(1)
                }}
              >
                <option value={10}>10개</option>
                <option value={20}>20개</option>
                <option value={50}>50개</option>
                <option value={100}>100개</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              🔍 검색
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setFilters({ facilityName: '', city: '', district: '' })
                setPageNo(1)
                setTimeout(() => fetchFacilities(1), 100)
              }}
            >
              🔄 초기화
            </button>
          </form>
        </section>

        {/* 에러 메시지 */}
        {error && (
          <div className="error fade-in">
            <strong>⚠️ 오류 발생</strong>
            <div>{error}</div>
            <div className="error-details">
              <strong>문제 해결 방법:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>백엔드 서버가 실행 중인지 확인하세요 (http://localhost:8000)</li>
                <li>브라우저 개발자 도구(F12)의 Network 탭에서 요청 상태를 확인하세요</li>
                <li>서버 터미널에서 오류 메시지가 있는지 확인하세요</li>
              </ul>
            </div>
          </div>
        )}

        {/* 로딩 상태 */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        )}

        {/* 시설 목록 */}
        {!loading && !error && (
          <>
            {facilities.length > 0 ? (
              <div className="facilities-grid">
                {facilities.map((facility, index) => (
                  <FacilityCard
                    key={facility.facilityId || index}
                    facility={facility}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state fade-in">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3>시설 정보가 없습니다</h3>
                <p>검색 조건을 변경해보세요.</p>
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="pagination fade-in">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pageNo === 1}
                >
                  « 처음
                </button>
                <button
                  onClick={() => handlePageChange(pageNo - 1)}
                  disabled={pageNo === 1}
                >
                  ‹ 이전
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (pageNo <= 3) {
                    pageNum = i + 1
                  } else if (pageNo >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = pageNo - 2 + i
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={pageNo === pageNum ? 'active' : ''}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => handlePageChange(pageNo + 1)}
                  disabled={pageNo === totalPages}
                >
                  다음 ›
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={pageNo === totalPages}
                >
                  마지막 »
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

// 시설 카드 컴포넌트
function FacilityCard({ facility, index }) {
  // 시설 정보 추출 (API 응답 구조에 따라 조정 필요)
  const facilityName = facility.facilityName || facility.facilityNm || facility.name || '시설명 없음'
  const address = facility.address || facility.addr || facility.location || '주소 정보 없음'
  const city = facility.city || facility.sido || ''
  const district = facility.district || facility.sigungu || ''
  const phone = facility.phone || facility.tel || facility.phoneNumber || ''
  const type = facility.type || facility.facilityType || ''

  return (
    <div
      className="facility-card"
      style={{
        animationDelay: `${index * 0.05}s`
      }}
    >
      <h3>{facilityName}</h3>
      <div className="facility-info">
        {type && (
          <div className="facility-info-item">
            <span>🏷️</span>
            <span><strong>유형:</strong> {type}</span>
          </div>
        )}
        {(city || district) && (
          <div className="facility-info-item">
            <span>📍</span>
            <span>
              <strong>위치:</strong> {city && district ? `${city} ${district}` : city || district}
            </span>
          </div>
        )}
        {address && (
          <div className="facility-info-item">
            <span>🏠</span>
            <span><strong>주소:</strong> {address}</span>
          </div>
        )}
        {phone && (
          <div className="facility-info-item">
            <span>📞</span>
            <span><strong>연락처:</strong> {phone}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
