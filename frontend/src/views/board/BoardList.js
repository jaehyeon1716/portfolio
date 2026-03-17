import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CNav,
  CNavItem,
  CNavLink,
  CButton,
  CPagination,
  CPaginationItem,
  CBadge,
  CFormSelect,
  CInputGroup,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const BoardList = () => {
  const [activeTab, setActiveTab] = useState('NOTICE')
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  // 검색을 위한 상태
  const [searchType, setSearchType] = useState('title')
  const [keyword, setKeyword] = useState('')

  const navigate = useNavigate()
  const apiUrl = `${import.meta.env.VITE_API_URL}`
  const isLoggedIn = !!localStorage.getItem('token')

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/board/list/${activeTab}`, {
        params: { 
          page: page, 
          size: 10,
          searchType: keyword ? searchType : null,
          keyword: keyword
        }
      })
      
      setPosts(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('데이터를 불러오는 중 에러 발생:', error)
      setPosts([])
      setTotalPages(0)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [activeTab, page])

  const handleSearch = () => {
    setPage(0) // 검색 시 첫 페이지로 초기화
    fetchPosts()
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>업무 게시판</strong>
          </CCardHeader>
          <CCardBody>
            <CNav variant="tabs" className="mb-3">
              {['NOTICE', 'FREE', 'ARCHIVE'].map((tab) => (
                <CNavItem key={tab}>
                  <CNavLink 
                    active={activeTab === tab} 
                    onClick={() => { setActiveTab(tab); setPage(0); setKeyword(''); }}
                    style={{ cursor: 'pointer' }}
                  >
                    {tab === 'NOTICE' ? '공지사항' : tab === 'FREE' ? '자유게시판' : '자료실'}
                  </CNavLink>
                </CNavItem>
              ))}
            </CNav>

            <div className="d-flex justify-content-between align-items-center mb-3">
              {/* 검색창 영역 */}
              <CInputGroup style={{ width: '400px' }}>
                <CFormSelect 
                  style={{ maxWidth: '120px' }}
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="title">제목</option>
                  <option value="writer">작성자</option>
                </CFormSelect>
                <CFormInput 
                  placeholder="검색어를 입력하세요" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <CButton color="secondary" variant="outline" onClick={handleSearch}>검색</CButton>
              </CInputGroup>

              {/* 글쓰기 버튼 */}
              {isLoggedIn && (
                <CButton color="primary" variant="outline" onClick={() => navigate('/boardWrite')}>
                  <CIcon icon={cilPencil} className="me-2" />
                  글쓰기
                </CButton>
              )}
            </div>

            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell className="text-center" style={{ width: '80px' }}>번호</CTableHeaderCell>
                  <CTableHeaderCell>제목</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={{ width: '120px' }}>작성자</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={{ width: '150px' }}>날짜</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={{ width: '100px' }}>조회수</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <CTableRow 
                      key={post.id}
                      style={post.important ? { backgroundColor: '#fff8f8' } : {}}
                    >
                      <CTableDataCell className="text-center">
                        {post.important ? <strong className="text-danger">공지</strong> : post.id}
                      </CTableDataCell>
                      
                      <CTableDataCell 
                        className="fw-semibold" 
                        style={{ cursor: 'pointer', color: '#321fdb' }}
                        onClick={() => navigate(`/board/detail/${post.id}`)}
                      >
                        {post.important && <CBadge color="danger" className="me-2">중요</CBadge>}
                        {post.title}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">{post.writer}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {post.regDate ? post.regDate.substring(0, 10) : '-'}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{post.hit}</CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="5" className="text-center py-5 text-muted">
                      등록된 게시글이 없습니다.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
              <CPagination aria-label="Page navigation">
                <CPaginationItem disabled={page === 0} onClick={() => setPage(page - 1)}>이전</CPaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <CPaginationItem key={i} active={i === page} onClick={() => setPage(i)}>
                    {i + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>다음</CPaginationItem>
              </CPagination>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BoardList;