import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom' // 1️⃣ useNavigate 임포트
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Register = () => {
  const navigate = useNavigate() // 2️⃣ 네비게이트 함수 초기화

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()

    if (password !== repeatPassword) {
      alert('비밀번호가 일치하지 않습니다!')
      return
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        username,
        email,
        password,
      })
      
      alert(response.data.message || '회원가입이 성공적으로 완료되었습니다!')
      
      // 3️⃣ 성공 시 로그인 페이지로 이동
      navigate('/login') 
      
    } catch (error) {
      console.error('회원가입 실패:', error.response ? error.response.data : error)
      alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleRegister}>
                  <h1>회원가입</h1>
                  <p className="text-body-secondary">새 계정을 생성하세요</p>
                  
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput
                      placeholder="사용자명(ID)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="이메일 주소"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="비밀번호"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="비밀번호 확인"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton type="submit" color="success">계정 생성하기</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register