import React from 'react'
import { useNavigate } from 'react-router-dom' // 🔹 페이지 이동을 위해 추가
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate() // 🔹 로그아웃 후 리다이렉트를 위한 훅

  // 🔹 로컬 스토리지에 토큰이 있는지 확인 (있으면 true, 없으면 false)
  const isLoggedIn = !!localStorage.getItem('token')

  // 🔹 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('token') // 저장된 JWT 토큰 삭제
    alert('로그아웃 되었습니다.')
    navigate('/login') // 로그인 페이지로 이동
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        
        {/* ...기존 아이템들 생략... */}
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">42</CBadge>
        </CDropdownItem>
        {/* ... (필요한 아이템들 유지) ... */}

        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        
        <CDropdownDivider />

        {/* 🔹 조건부 렌더링: 토큰(isLoggedIn)이 있을 때만 Logout 노출 */}
        {isLoggedIn ? (
          <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Logout
          </CDropdownItem>
        ) : (
          <CDropdownItem onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Login
          </CDropdownItem>
        )}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown