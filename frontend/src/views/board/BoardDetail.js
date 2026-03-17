import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CButton,
  CListGroup, CListGroupItem, CInputGroup, CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCommentSquare, cilSave } from '@coreui/icons' // cilSave 아이콘 추가

const BoardDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  const [replyingId, setReplyingId] = useState(null)
  const [replyContent, setReplyContent] = useState('')

  const apiUrl = `${import.meta.env.VITE_API_URL}`
  const currentUser = localStorage.getItem('username')

  // 📁 파일 다운로드 핸들러
  const handleFileDownload = async (fileId, originalName) => {
    try {
      // 다운로드 API 호출 (responseType: 'blob' 필수)
      const response = await axios.get(`${apiUrl}/api/board/file/download/${fileId}`, {
        responseType: 'blob',
      })

      // 파일 다운로드 처리
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', originalName)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('다운로드 실패:', error)
      alert('파일 다운로드에 실패했습니다.')
    }
  }

  const countTotalComments = (commentList) => {
    let count = commentList.length
    commentList.forEach((c) => {
      if (c.children && c.children.length > 0) count += countTotalComments(c.children)
    })
    return count
  }

  const fetchData = useCallback(async () => {
    try {
      const [postRes, commentRes] = await Promise.all([
        axios.get(`${apiUrl}/api/board/detail/${id}`),
        axios.get(`${apiUrl}/api/comment/${id}`),
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

  const handleDeletePost = async () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return
    try {
      await axios.delete(`${apiUrl}/api/board/${id}`)
      alert('삭제되었습니다.')
      navigate('/boardList')
    } catch (error) {
      alert('게시글 삭제에 실패했습니다.')
    }
  }

  const openEdit = (c) => {
    setEditingId(c.id); setEditContent(c.content); setReplyingId(null);
  }
  const openReply = (c) => {
    setReplyingId(c.id); setReplyContent(''); setEditingId(null);
  }
  const cancelAll = () => {
    setEditingId(null); setReplyingId(null);
  }

  const handleCommentSubmit = async (parentId = null) => {
    const content = parentId ? replyContent : newComment
    if (!content.trim()) return alert('내용을 입력하세요.')
    try {
      await axios.post(`${apiUrl}/api/comment/save`, {
        boardId: id,
        writer: currentUser,
        content: content,
        parentId: parentId,
      })
      parentId ? (setReplyContent(''), setReplyingId(null)) : setNewComment('')
      fetchData()
    } catch (error) { alert('등록 실패') }
  }

  const handleUpdateSubmit = async (commentId) => {
    if (!editContent.trim()) return alert('내용을 입력하세요.')
    try {
      await axios.put(`${apiUrl}/api/comment/${commentId}`, { content: editContent })
      cancelAll(); fetchData()
    } catch (error) { alert('수정 실패') }
  }

  const renderComment = (c, depth = 0) => (
    <div key={c.id} style={{ marginLeft: `${depth * 30}px` }}>
      <CListGroupItem className="border-0 border-top">
        <div className="d-flex justify-content-between">
          <span className="fw-bold">{c.writer}</span>
          <div className="d-flex gap-2">
            <CButton color="link" size="sm" className="p-0 text-secondary" style={{ textDecoration: 'none' }} onClick={() => openReply(c)}>답글</CButton>
            {currentUser === c.writer && (
              <>
                <CButton color="link" size="sm" className="p-0 text-info" style={{ textDecoration: 'none' }} onClick={() => openEdit(c)}>수정</CButton>
                <CButton color="link" size="sm" className="p-0 text-danger" style={{ textDecoration: 'none' }} onClick={() => axios.delete(`${apiUrl}/api/comment/${c.id}`).then(fetchData)}>삭제</CButton>
              </>
            )}
          </div>
        </div>
        {editingId === c.id ? (
          <div className="mt-2">
            <CFormInput value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            <div className="d-flex gap-2 mt-2">
              <CButton size="sm" color="info" onClick={() => handleUpdateSubmit(c.id)}>확인</CButton>
              <CButton size="sm" color="secondary" onClick={cancelAll}>취소</CButton>
            </div>
          </div>
        ) : <div className="mt-1">{c.content}</div>}
        {replyingId === c.id && (
          <CInputGroup className="mt-2">
            <CFormInput value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="답글 작성..." />
            <CButton color="primary" onClick={() => handleCommentSubmit(c.id)}>등록</CButton>
            <CButton color="secondary" onClick={cancelAll}>취소</CButton>
          </CInputGroup>
        )}
      </CListGroupItem>
      {c.children && c.children.map((child) => renderComment(child, depth + 1))}
    </div>
  )

  if (!post) return <div>로딩 중...</div>

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>{post.title}</strong>
            {currentUser === post.writer && (
              <div className="d-flex gap-2">
                <CButton color="info" variant="outline" size="sm" onClick={() => navigate(`/boardUpdate/${id}`)}>수정</CButton>
                <CButton color="danger" variant="outline" size="sm" onClick={handleDeletePost}>삭제</CButton>
              </div>
            )}
          </CCardHeader>
          <CCardBody>
            <div className="d-flex justify-content-between text-muted small mb-3">
              <span>작성자: {post.writer}</span>
              <span>조회수: {post.hit} | 작성일: {new Date(post.regDate).toLocaleString()}</span>
            </div>

            {/* 📁 첨부 파일 섹션 추가 */}
            {post.files && post.files.length > 0 && (
              <div className="mb-4 p-3 border rounded bg-light">
                <div className="small fw-bold mb-2 text-primary">📎 첨부 파일 목록</div>
                <div className="d-flex flex-wrap gap-2">
                  {post.files.map((file) => (
                    <CButton 
                      key={file.id} 
                      color="secondary" 
                      variant="outline" 
                      size="sm" 
                      className="bg-white"
                      onClick={() => handleFileDownload(file.id, file.originalName)}
                    >
                      <CIcon icon={cilSave} className="me-1" />
                      {file.originalName}
                    </CButton>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4 p-2" style={{ minHeight: '300px', whiteSpace: 'pre-wrap' }}>
              {post.content}
            </div>

            {/* 댓글 섹션 */}
            <div className="mt-4 pt-4 border-top">
              <h6><CIcon icon={cilCommentSquare} className="me-2" /> 댓글 ({countTotalComments(comments)})</h6>
              <CListGroup flush>{comments.map((c) => renderComment(c))}</CListGroup>
              {currentUser && (
                <CInputGroup className="mt-3">
                  <CFormInput value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글 작성..." />
                  <CButton color="primary" onClick={() => handleCommentSubmit()}>등록</CButton>
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