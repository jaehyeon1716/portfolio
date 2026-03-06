import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CButton,
  CFormCheck, // 🔹 체크박스 컴포넌트 추가
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BoardWrite = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    category: 'FREE',
    title: '',
    content: '',
    is_important: false, // 🔹 중요 게시글 여부 초기값
  })
  const [file, setFile] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    // 🔹 체크박스인 경우 value 대신 checked 값을 사용하도록 처리
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    })
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const writer = localStorage.getItem('username');

    if (!writer) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      return;
    }
    
    try {
      const postData = {
        ...formData,
        writer: writer
      };

      const response = await axios.post('/api/board/save', postData);

      if (response.status === 200) {
        alert('게시글이 성공적으로 등록되었습니다.');
        navigate('/boardList'); 
      }
    } catch (error) {
      console.error('전송 에러:', error);
      alert('서버 전송 중 오류가 발생했습니다.');
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader>
            <strong>새 게시글 작성</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {/* 카테고리 선택 */}
              <div className="mb-3">
                <CFormLabel htmlFor="category">게시판 선택</CFormLabel>
                <CFormSelect 
                  id="category" 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="NOTICE">공지사항</option>
                  <option value="FREE">자유게시판</option>
                  <option value="ARCHIVE">업무 자료실</option>
                </CFormSelect>
              </div>

              {/* 🔹 공지사항 선택 시에만 출력되는 중요 체크박스 */}
              {formData.category === 'NOTICE' && (
                <div className="mb-3">
                  <CFormCheck
                    id="is_important"
                    name="is_important"
                    label="중요 공지사항으로 등록 (목록 상단 노출)"
                    checked={formData.is_important}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* 작성자 표시 */}
              <div className="mb-3">
                <CFormLabel htmlFor="writer">작성자</CFormLabel>
                <CFormInput
                  type="text"
                  id="writer"
                  value={localStorage.getItem('username') || '로그인 필요'}
                  readOnly
                  plainText
                />
              </div>

              {/* 제목 입력 */}
              <div className="mb-3">
                <CFormLabel htmlFor="title">제목</CFormLabel>
                <CFormInput
                  type="text"
                  id="title"
                  name="title"
                  placeholder="제목을 입력하세요"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* 내용 입력 */}
              <div className="mb-3">
                <CFormLabel htmlFor="content">내용</CFormLabel>
                <CFormTextarea
                  id="content"
                  name="content"
                  rows={10}
                  placeholder="내용을 입력하세요"
                  value={formData.content}
                  onChange={handleChange}
                  required
                ></CFormTextarea>
              </div>

              {/* 파일 첨부 */}
              <div className="mb-4">
                <CFormLabel htmlFor="formFile">파일 첨부 (선택사항)</CFormLabel>
                <CFormInput type="file" id="formFile" onChange={handleFileChange} />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <CButton color="secondary" variant="outline" onClick={() => navigate(-1)}>
                  취소
                </CButton>
                <CButton type="submit" color="primary">
                  등록하기
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BoardWrite