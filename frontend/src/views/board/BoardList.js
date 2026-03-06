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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const BoardList = () => {
  const [activeTab, setActiveTab] = useState('NOTICE')
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0) // 🔹 현재 페이지 (0부터 시작)
  const [totalPages, setTotalPages] = useState(0) // 🔹 전체 페이지 수
  const navigate = useNavigate()

  const isLoggedIn = !!localStorage.getItem('token')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/board/list/${activeTab}`, {
          params: { page: page, size: 10 }
        })
        
        // 백엔드 Page 객체에서 데이터와 전체 페이지 수 추출
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

  const goToWrite = () => {
    navigate('/boardWrite')
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
                <CButton color="primary" variant="outline" onClick={goToWrite}>
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
                    <CTableRow key={post.id}>
                      <CTableDataCell className="text-center">{post.id}</CTableDataCell>
                      <CTableDataCell className="fw-semibold">{post.title}</CTableDataCell>
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

            {/* 🔹 페이징 UI */}
            {totalPages > 0 && (
              <CPagination align="center" className="mt-3">
                <CPaginationItem disabled={page === 0} onClick={() => setPage(page - 1)}>
                  이전
                </CPaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <CPaginationItem 
                    key={i} 
                    active={i === page} 
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </CPaginationItem>
                ))}
                
                <CPaginationItem disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                  다음
                </CPaginationItem>
              </CPagination>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BoardList