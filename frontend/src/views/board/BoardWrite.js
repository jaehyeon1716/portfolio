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

  // 📁 파일 상태 관리 (배열)
  const [selectedFiles, setSelectedFiles] = useState([])

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/board/detail/${id}`)
          setFormData({
            category: response.data.category?.code || response.data.category,
            title: response.data.title,
            content: response.data.content,
            is_important: response.data.isImportant, 
          })
          // 수정 시 기존 파일 목록을 보여주고 싶다면 별도의 state(existingFiles) 처리가 필요합니다.
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

  // 📁 파일 선택 핸들러 (기존 목록에 추가)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles((prev) => [...prev, ...files])
    e.target.value = '' // 같은 파일 재선택 가능하게 초기화
  }

  // ❌ 선택한 파일 목록에서 제거
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const writer = localStorage.getItem('username')

    try {
      const categoryValue = typeof formData.category === 'object' 
        ? formData.category.code 
        : formData.category;

      // 1️⃣ FormData 객체 생성
      const data = new FormData();

      // 2️⃣ JSON 데이터를 Blob으로 만들어 'postData'라는 이름으로 추가 (백엔드 @RequestPart와 일치)
      const postDto = {
        title: formData.title,
        content: formData.content,
        writer: writer,
        category: categoryValue,
        isImportant: formData.is_important // 백엔드 DTO 필드명(isImportant) 확인 필요
      };

      data.append(
        'postData',
        new Blob([JSON.stringify(postDto)], { type: 'application/json' })
      );
      
      // 3️⃣ 파일 데이터 'files'라는 이름으로 추가 (백엔드 @RequestPart와 일치)
      selectedFiles.forEach(file => {
        data.append('files', file);
      });

      // 전송 설정 (Content-Type 자동 설정됨)
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (id) {
        // 수정 로직 (수정 시에도 파일을 함께 보낼 수 있도록 백엔드 수정 필요)
        await axios.put(`${apiUrl}/api/board/${id}`, data, config)
        alert('게시글이 수정되었습니다.')
        navigate(`/board/detail/${id}`)
      } else {
        // 등록 로직
        await axios.post(`${apiUrl}/api/board/save`, data, config)
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
              {/* 게시판 선택 */}
              <div className="mb-3">
                <CFormLabel htmlFor="category">게시판 선택</CFormLabel>
                <CFormSelect id="category" name="category" value={formData.category} onChange={handleChange}>
                  <option value="NOTICE">공지사항</option>
                  <option value="FREE">자유게시판</option>
                  <option value="ARCHIVE">업무 자료실</option>
                </CFormSelect>
              </div>

              {/* 중요 공지 옵션 */}
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

              {/* 📁 업무 자료실 전용 파일 업로드 섹션 */}
              {formData.category === 'ARCHIVE' && (
                <div className="mb-4 p-3 border rounded bg-light">
                  <CFormLabel htmlFor="formFileMultiple" className="fw-bold text-primary">
                    📎 업무 자료 첨부 (다중 선택 가능)
                  </CFormLabel>
                  <CFormInput 
                    type="file" 
                    id="formFileMultiple" 
                    multiple 
                    onChange={handleFileChange}
                    className="mb-2"
                  />
                  
                  {/* 선택된 파일 목록 */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-3 p-2 bg-white border rounded">
                      <div className="small fw-bold mb-2 text-secondary">첨부 예정 목록 ({selectedFiles.length})</div>
                      <ul className="list-group list-group-flush">
                        {selectedFiles.map((file, index) => (
                          <li key={index} className="list-group-item d-flex justify-content-between align-items-center px-2 py-1 small">
                            <span className="text-truncate" style={{ maxWidth: '80%' }}>{file.name}</span>
                            <CButton 
                              color="danger" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeFile(index)}
                              className="py-0 px-2"
                            >
                              삭제
                            </CButton>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 작성자 (읽기 전용) */}
              <div className="mb-3">
                <CFormLabel>작성자</CFormLabel>
                <CFormInput value={localStorage.getItem('username') || '로그인 필요'} readOnly plainText />
              </div>

              {/* 제목 */}
              <div className="mb-3">
                <CFormLabel htmlFor="title">제목</CFormLabel>
                <CFormInput type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              {/* 내용 */}
              <div className="mb-3">
                <CFormLabel htmlFor="content">내용</CFormLabel>
                <CFormTextarea id="content" name="content" rows={10} value={formData.content} onChange={handleChange} required />
              </div>

              {/* 버튼 세션 */}
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