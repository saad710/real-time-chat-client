import { Avatar } from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../context/LoginProvider'
import { OnlineContext } from '../../context/onlineProvider'
import './chatOnline.css'

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  console.log(currentId)
  console.log(onlineUsers)
  const [friends, setFriends] = useState([])
  console.log(friends)
  const { onlineFriends, setOnlineFriends } = useContext(OnlineContext)
  console.log(onlineFriends)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  console.log(currentId)
  const { userData } = useContext(LoginContext)
  console.log(userData)

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(
        `http://localhost:8800/api/users/friends/${currentId}`,
      )
      console.log(res.data)
      setFriends(res.data)
    }
    getFriends()
  }, [currentId])

  useEffect(() => {
    setOnlineFriends(friends?.filter((f) => onlineUsers?.includes(f._id)))
  }, [friends, onlineUsers, setOnlineFriends])

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/conversations/find/${currentId}/${user._id}`,
      )
      setCurrentChat(res.data)
    } catch (err) {
      console.log(err)
    }
  }
  console.log(onlineFriends)

  return (
    <div className="chatOnline">
      {onlineFriends.map((o, index) => (
        <div
          key={index}
          className="chatOnlineFriend"
          onClick={() => handleClick(o)}
        >
          <div className="chatOnlineImgContainer">
            {/* <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ? PF + o.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
            /> */}
            <Avatar className="chatOnlineImg" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  )
}
