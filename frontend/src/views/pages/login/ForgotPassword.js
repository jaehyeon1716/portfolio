import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
import { cilEnvelopeClosed, cilUser } from '@coreui/icons'

const ForgotPassword = () => {
  const [username, setUsername] = useState('') // 아이디 상태 추가
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // 백엔드에 아이디와 이메일을 함께 보냅니다.
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }), 
      });

      if (response.ok) {
        setMessage('입력하신 정보가 일치하면 이메일로 재설정 링크가 전송됩니다.');
        setLoading(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '정보를 다시 확인해주세요.');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleResetPassword}>
                  <h1>비밀번호 찾기</h1>
                  <p className="text-body-secondary">
                    가입하신 아이디와 이메일 주소를 입력해주세요.
                  </p>

                  {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
                  {message && <p style={{ color: 'green', fontSize: '0.9rem' }}>{message}</p>}

                  {/* 아이디 입력란 추가 */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="아이디를 입력하세요"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  {/* 이메일 입력란 */}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeClosed} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="가입 시 등록한 이메일을 입력하세요"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol xs={12}>
                      <CButton color="primary" className="px-4 w-100" type="submit" disabled={loading}>
                        {loading ? '확인 중...' : '비밀번호 재설정 요청'}
                      </CButton>
                    </CCol>
                  </CRow>

                  <div className="mt-4 text-center">
                    <Link to="/login">
                      <CButton color="link" className="px-0">
                        로그인 화면으로 돌아가기
                      </CButton>
                    </Link>
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

export default ForgotPassword