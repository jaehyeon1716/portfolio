import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CListGroup,
  CListGroupItem,
  CInputGroup,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCommentSquare } from '@coreui/icons'

const BoardDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([]) 
  const [newComment, setNewComment] = useState('')
  
  // 수정을 위한 상태값
  const [editingId, setEditingId] = useState(null) 
  const [editContent, setEditContent] = useState('')
  
  const apiUrl = `${import.meta.env.VITE_API_URL}`
  const currentUser = localStorage.getItem('username')

  // 게시글 및 댓글 데이터 로딩
  const fetchData = useCallback(async () => {
    try {
      const [postRes, commentRes] = await Promise.all([
        axios.get(`${apiUrl}/api/board/detail/${id}`),
        axios.get(`${apiUrl}/api/comment/${id}`)
      ])
      setPost(postRes.data)
      setComments(commentRes.data)
    } catch (error) {
      console.error('데이터 로딩 에러:', error)
    }
  }, [id, apiUrl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 게시글 삭제
  const handleDelete = async () => {
    if (window.confirm('정말 게시글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${apiUrl}/api/board/${id}`)
        alert('삭제되었습니다.')
        navigate('/boardList')
      } catch (error) {
        alert('삭제 중 에러가 발생했습니다.')
      }
    }
  }

  // 댓글 등록
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return alert('댓글을 입력하세요.')
    try {
      await axios.post(`${apiUrl}/api/comment/save`, {
        boardId: id,
        writer: currentUser,
        content: newComment
      })
      setNewComment('')
      fetchData()
    } catch (error) {
      alert('댓글 등록에 실패했습니다.')
    }
  }

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${apiUrl}/api/comment/${commentId}`)
        fetchData()
      } catch (error) {
        alert('댓글 삭제에 실패했습니다.')
      }
    }
  }

  // 수정 시작 및 종료
  const startEdit = (comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  // 댓글 수정 저장
  const handleUpdateSubmit = async (commentId) => {
    if (!editContent.trim()) return alert('내용을 입력하세요.')
    try {
      await axios.put(`${apiUrl}/api/comment/${commentId}`, {
        content: editContent
      })
      alert('수정되었습니다.')
      setEditingId(null)
      fetchData()
    } catch (error) {
      console.error('수정 실패:', error)
      alert('수정 중 오류가 발생했습니다.')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleCommentSubmit()
  }

  if (!post) return <div>로딩 중...</div>

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>{post.title}</strong>
            <span className="text-muted">{post.regDate?.substring(0, 10)}</span>
          </CCardHeader>
          <CCardBody>
            <div className="mb-3 pb-3 border-bottom">
              <span className="me-3"><strong>작성자:</strong> {post.writer}</span>
              <span><strong>조회수:</strong> {post.hit}</span>
            </div>
            <div className="mb-4" style={{ minHeight: '300px', whiteSpace: 'pre-wrap' }}>
              {post.content}
            </div>

            <div className="d-flex justify-content-end gap-2 mb-5">
              <CButton color="secondary" onClick={() => navigate('/boardList')}>목록으로</CButton>
              {currentUser && currentUser === post.writer && (
                <>
                  <CButton color="info" variant="outline" onClick={() => navigate(`/boardUpdate/${id}`)}>수정</CButton>
                  <CButton color="danger" variant="outline" onClick={handleDelete}>삭제</CButton>
                </>
              )}
            </div>

            {/* 댓글 영역 */}
            <div className="mt-4 pt-4 border-top">
              <h6><CIcon icon={cilCommentSquare} className="me-2" /> 댓글 ({comments.length})</h6>
              <CListGroup flush className="mb-3">
                {[...comments].reverse().map((c) => (
                  <CListGroupItem key={c.id}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <span className="fw-bold me-2">{c.writer}</span>
                            <small className="text-muted">{c.regDate?.substring(0, 10)}</small>
                        </div>
                        {currentUser === c.writer && editingId !== c.id && (
                          <div className="d-flex gap-2">
                            <CButton color="link" className="text-info p-0" size="sm" style={{ textDecoration: 'none' }} onClick={() => startEdit(c)}>
                              수정
                            </CButton>
                            <CButton color="link" className="text-danger p-0" size="sm" style={{ textDecoration: 'none' }} onClick={() => handleCommentDelete(c.id)}>
                              삭제
                            </CButton>
                          </div>
                        )}
                    </div>
                    
                    {editingId === c.id ? (
                      <div className="mt-2">
                        <CFormInput 
                          value={editContent} 
                          onChange={(e) => setEditContent(e.target.value)}
                          className="mb-2"
                          onKeyPress={(e) => e.key === 'Enter' && handleUpdateSubmit(c.id)}
                        />
                        <div className="d-flex justify-content-end gap-2">
                          <CButton color="secondary" size="sm" onClick={cancelEdit}>취소</CButton>
                          <CButton color="info" size="sm" onClick={() => handleUpdateSubmit(c.id)}>확인</CButton>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1">{c.content}</div>
                    )}
                  </CListGroupItem>
                ))}
              </CListGroup>

              {currentUser && (
                <CInputGroup>
                  <CFormInput 
                    placeholder="댓글을 입력하세요..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <CButton color="primary" onClick={handleCommentSubmit}>등록</CButton>
                </CInputGroup>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BoardDetail