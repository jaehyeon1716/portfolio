import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CListGroup,
  CListGroupItem,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilChatBubble, cilNotes, cilBell } from '@coreui/icons'

const Dashboard = () => {
  // 실제 서비스에서는 여기서 axios로 데이터를 불러와 state에 저장하세요.
  const notices = ['시스템 점검 안내', '새로운 게임 업데이트!', '이벤트 당첨자 발표']
  const schedules = ['팀 회의 - 14:00', '게임 개발 스터디 - 19:00', '프로젝트 마감일']
  const recentChats = ['개발팀: 화이팅!', '잡담방: 오늘 점심 뭐 먹지?', '공지: 금일 회식 장소']
  const alerts = ['게시글에 댓글이 달렸습니다.', '새로운 친구 요청이 있습니다.']

  return (
    <>
      {/* 상단: 알림 및 요약 영역 */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader><CIcon icon={cilBell} className="me-2" /> 새 알림</CCardHeader>
            <CListGroup flush>
              {alerts.map((a, i) => (
                <CListGroupItem key={i} className="text-info">{a}</CListGroupItem>
              ))}
            </CListGroup>
          </CCard>
        </CCol>
      </CRow>

      {/* 메인 콘텐츠 영역 */}
      <CRow>
        {/* 왼쪽: 공지사항 및 일정 */}
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader><CIcon icon={cilNotes} className="me-2" /> 공지사항</CCardHeader>
            <CListGroup flush>
              {notices.map((n, i) => <CListGroupItem key={i}>{n}</CListGroupItem>)}
            </CListGroup>
          </CCard>

          <CCard className="mb-4">
            <CCardHeader><CIcon icon={cilCalendar} className="me-2" /> 오늘의 일정</CCardHeader>
            <CListGroup flush>
              {schedules.map((s, i) => <CListGroupItem key={i}>{s}</CListGroupItem>)}
            </CListGroup>
          </CCard>
        </CCol>

        {/* 오른쪽: 채팅 영역 */}
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader><CIcon icon={cilChatBubble} className="me-2" /> 최근 채팅</CCardHeader>
            <CListGroup flush>
              {recentChats.map((c, i) => (
                <CListGroupItem key={i} className="d-flex justify-content-between">
                  {c}
                  <CBadge color="info">New</CBadge>
                </CListGroupItem>
              ))}
            </CListGroup>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard