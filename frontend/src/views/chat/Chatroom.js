import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CListGroup,
  CListGroupItem,
  CAvatar,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilCommentBubble } from '@coreui/icons'

const Chatroom = () => {
  const [chatRooms, setChatRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const currentUsername = localStorage.getItem('username')
  const navigate = useNavigate(); // navigate

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!currentUsername) return // 사용자 정보 없으면 실행 안 함

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat/chatroom`, {
          params: { username: currentUsername },
        })

        // 백엔드 데이터: [{lastMessage, lastTime, otherUser, roomId}, ...]
        setChatRooms(response.data)
        setLoading(false)
      } catch (error) {
        console.error('대화방 목록을 불러오는데 실패했습니다:', error)
        setLoading(false)
      }
    }

    fetchChatRooms()
  }, [currentUsername])

  // 대화방 삭제 함수
  const deleteRoom = async (roomId) => {
    if (window.confirm('정말 이 대화방을 삭제하시겠습니까?')) {
      try {
        // 백엔드 삭제 API가 있다면 호출 (예시)
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/chat/chatroom/${roomId}`);
        
        // 화면에서 즉시 제거
        setChatRooms((prevRooms) => prevRooms.filter((room) => room.roomId !== roomId))

        alert('대화방이 삭제되었습니다.')

      } catch (error) {
        console.error('대화방 삭제 중 에러 발생:', error)
        alert('삭제에 실패했습니다. 서버 상태를 확인해주세요.')
      }
    }
  }

  // 날짜/시간 포맷팅 함수 (ISO 문자열을 읽기 좋게 변환)
  const formatTime = (timeString) => {
    if (!timeString) return ''
    const date = new Date(timeString)
    return date.toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleChat = (room) => {
    if (!room) return
    navigate(`/chat?roomId=${room.roomId}&with=${room.otherUser}`);
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>내 대화방 목록</strong>
          </CCardHeader>
          <CCardBody>
            <CListGroup flush>
              {chatRooms.length > 0 ? (
                chatRooms.map((room) => (
                  <CListGroupItem
                    key={room.roomId} // id -> roomId
                    className="d-flex justify-content-between align-items-center py-3"
                  >
                    <div className="d-flex align-items-center">
                      <CAvatar color="primary" textColor="white" className="me-3">
                        {/* 상대방 이름의 첫 글자 표시 */}
                        {room.otherUser ? room.otherUser.charAt(0) : '?'}
                      </CAvatar>

                      <div>
                        {/* user -> otherUser */}
                        <div className="fw-bold">{room.otherUser}</div>
                        <div
                          className="small text-medium-emphasis text-truncate"
                          style={{ maxWidth: '250px' }}
                        >
                          {room.lastMessage}
                        </div>
                        <div
                          className="small text-medium-emphasis"
                          style={{ fontSize: '0.75rem' }}
                        >
                          {/* time -> lastTime */}
                          {formatTime(room.lastTime)}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <CButton color="info" variant="outline" size="sm"
                            onClick={() => handleChat(room)}>
                        <CIcon icon={cilCommentBubble} className="me-1" /> 입장
                      </CButton>
                      <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRoom(room.roomId)} // id -> roomId
                      >
                        <CIcon icon={cilTrash} /> 삭제
                      </CButton>
                    </div>
                  </CListGroupItem>
                ))
              ) : (
                <div className="text-center py-5 text-medium-emphasis">
                  {loading ? '데이터를 불러오는 중...' : '활성화된 대화방이 없습니다.'}
                </div>
              )}
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Chatroom