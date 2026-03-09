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
  CBadge, // 🔹 뱃지 컴포넌트 추가
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const BoardList = () => {
  const [activeTab, setActiveTab] = useState('NOTICE')
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const navigate = useNavigate()
  const apiUrl = `${import.meta.env.VITE_API_URL}`;

  const isLoggedIn = !!localStorage.getItem('token')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/board/list/${activeTab}`, {
          params: { page: page, size: 10 }
        })
        
        setPosts(response.data.content)
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.error('데이터를 불러오는 중 에러 발생:', error)
        setPosts([])
        setTotalPages(0)
      }
    }

    fetchPosts()
  }, [activeTab, page])

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
                    onClick={() => { setActiveTab(tab); setPage(0); }}
                    style={{ cursor: 'pointer' }}
                  >
                    {tab === 'NOTICE' ? '공지사항' : tab === 'FREE' ? '자유게시판' : '자료실'}
                  </CNavLink>
                </CNavItem>
              ))}
            </CNav>

            <div className="d-flex justify-content-end mb-3">
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
                      // 🔹 중요 게시글 행 배경색 강조
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
                        {/* 🔹 중요 게시글 뱃지 표시 */}
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

            {/* Pagination 생략 (기존과 동일) */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BoardList