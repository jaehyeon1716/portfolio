import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAvatar,
  CBadge,
  CSpinner,
  CButton // <-- 이게 빠져있어서 에러가 난 것입니다!
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilPeople, cilChatBubble } from '@coreui/icons';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 대화 시작 함수
  const handleChat = (otherUser) => {
    const myName = localStorage.getItem('username');
    
    if (!myName) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (myName === otherUser.username) {
      alert("자신과는 대화할 수 없습니다.");
      return;
    }

    // 알파벳 순 정렬로 고유 RoomId 생성
    const sortedParticipants = [myName, otherUser.username].sort();
    const roomId = `${sortedParticipants[0]}_${sortedParticipants[1]}`;

    navigate(`/chat?roomId=${roomId}&with=${otherUser.username}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users/list');
        if (!response.ok) throw new Error('네트워크 응답 문제');
        const data = await response.json();
        
        const formattedData = data.map(user => ({
          ...user,
          createdAt: user.createdAt ? user.createdAt.split('T')[0] : '-'
        }));
        
        setUsers(formattedData);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = (users || []).filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <CRow className="mb-4 justify-content-center">
        <CCol md={8}>
          <div className="d-flex align-items-center mb-2">
            <CIcon icon={cilPeople} size="xl" className="me-2 text-primary" />
            <h3 className="mb-0">우리 멤버들</h3>
          </div>
          <p className="text-muted">현재 사이트에 함께하고 있는 소중한 멤버들입니다.</p>
        </CCol>
      </CRow>

      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard className="shadow-sm border-0">
            <CCardHeader className="bg-white border-bottom-0 pt-4">
              <CInputGroup className="flex-nowrap">
                <CInputGroupText className="bg-light border-end-0">
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  className="bg-light border-start-0"
                  placeholder="찾으시는 멤버의 아이디를 입력하세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCardHeader>
            
            <CCardBody className="px-0">
              <CTable align="middle" hover responsive className="mb-0">
                <CTableHead className="text-muted">
                  <CTableRow>
                    <CTableHeaderCell className="ps-4">프로필</CTableHeaderCell>
                    <CTableHeaderCell>멤버 이름</CTableHeaderCell>
                    <CTableHeaderCell>역할</CTableHeaderCell>
                    <CTableHeaderCell>가입 시기</CTableHeaderCell>
                    <CTableHeaderCell className="pe-4 text-center">채팅</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className="text-center py-5">
                        <CSpinner color="primary" />
                      </CTableDataCell>
                    </CTableRow>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <CTableRow key={user.id}>
                        <CTableDataCell className="ps-4">
                          <CAvatar color={user.role === 'ADMIN' ? 'warning' : 'secondary'} textColor="white">
                            {user.username?.charAt(0).toUpperCase()}
                          </CAvatar>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold text-dark">{user.username}</div>
                          <small className="text-muted">{user.email}</small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={user.role === 'ADMIN' ? 'danger' : 'light'} shape="rounded-pill" className={user.role !== 'ADMIN' ? 'text-dark border' : ''}>
                            {user.role}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-muted small">
                          {user.createdAt}
                        </CTableDataCell>
                        <CTableDataCell className="pe-4 text-center">
                          <CButton 
                            color="primary" 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleChat(user)}
                          >
                            <CIcon icon={cilChatBubble} size="sm" className="me-1" />
                            대화
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className="text-center py-5 text-muted">일치하는 멤버가 없어요.</CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default UserList;