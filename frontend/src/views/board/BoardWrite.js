import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel,
  CFormInput, CFormTextarea, CFormSelect, CButton, CFormCheck,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const BoardWrite = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const apiUrl = `${import.meta.env.VITE_API_URL}`

  const [formData, setFormData] = useState({
    category: 'FREE',
    title: '',
    content: '',
    is_important: false,
  })

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/board/detail/${id}`)
          setFormData({
            category: response.data.category,
            title: response.data.title,
            content: response.data.content,
            is_important: response.data.isImportant, 
          })
        } catch (error) {
          console.error('데이터 불러오기 실패:', error)
          alert('게시글을 불러오는 데 실패했습니다.')
        }
      }
      fetchPost()
    }
  }, [id, apiUrl])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const writer = localStorage.getItem('username')

    try {
      // 🔹 서버의 BoardRequestDto 구조와 일치하도록 명시적으로 데이터 생성
      const categoryValue = typeof formData.category === 'object' 
        ? formData.category.code 
        : formData.category;

      const postData = { 
        title: formData.title,
        content: formData.content,
        writer: writer,
        category: categoryValue,
        is_important: formData.is_important
      }
      console.log("전송 데이터 확인:", JSON.stringify(postData));
      if (id) {
        axios.put(`${apiUrl}/api/board/${id}`, postData)
        alert('게시글이 수정되었습니다.')
        navigate(`/board/detail/${id}`)
      } else {
        axios.post(`${apiUrl}/api/board/save`, postData)
        alert('게시글이 등록되었습니다.')
        navigate(`/boardList`)
      }
    } catch (error) {
      console.error('전송 에러:', error)
      alert('처리 중 오류가 발생했습니다.')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader>
            <strong>{id ? '게시글 수정' : '새 게시글 작성'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="category">게시판 선택</CFormLabel>
                <CFormSelect id="category" name="category" value={formData.category} onChange={handleChange}>
                  <option value="NOTICE">공지사항</option>
                  <option value="FREE">자유게시판</option>
                  <option value="ARCHIVE">업무 자료실</option>
                </CFormSelect>
              </div>

              {formData.category === 'NOTICE' && (
                <div className="mb-3">
                  <CFormCheck
                    id="is_important"
                    name="is_important"
                    label="중요 공지사항으로 등록"
                    checked={formData.is_important}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="mb-3">
                <CFormLabel>작성자</CFormLabel>
                <CFormInput value={localStorage.getItem('username') || '로그인 필요'} readOnly plainText />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="title">제목</CFormLabel>
                <CFormInput type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="content">내용</CFormLabel>
                <CFormTextarea id="content" name="content" rows={10} value={formData.content} onChange={handleChange} required />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <CButton color="secondary" variant="outline" onClick={() => navigate(-1)}>취소</CButton>
                <CButton type="submit" color="primary">{id ? '수정하기' : '등록하기'}</CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BoardWrite