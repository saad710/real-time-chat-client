import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversations/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from 'react'

import axios from 'axios'
import { io } from 'socket.io-client'
import { LoginContext } from '../../context/LoginProvider'
import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  Grid,
  Card,
} from '@mui/material'
import { ChatUserContext } from '../../context/ChatListUserDataProvider'
import FeatherIcon from 'feather-icons-react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'

export default function Messenger() {
  const history = useHistory()
  const [open, setOpen] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [activeChat, setActiveChat] = useState(0)

  const { userData, setUserData } = useContext(LoginContext)
  const [onlineMatch, setOnlineMatch] = useState([])
  const [findChatUser, setFindChatUser] = useState()
  const [chatUserOnline, setChatUserOnline] = useState()

  const [conversations, setConversations] = useState([])
  console.log(conversations[0])
  const [currentChat, setCurrentChat] = useState(conversations[0])
  console.log(currentChat)
  const [messages, setMessages] = useState([])
  console.log(messages)
  const [newMessage, setNewMessage] = useState('')
  console.log(newMessage)
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])

  const socket = useRef()

  // useEffect(()=>{
  //   if(conversations){
  //     setCurrentChat(conversations[0])
  //   }
  // },[conversations])

  async function populateQuote() {
    const req = await fetch('http://localhost:8800/api/auth/me', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
    })

    const data = await req.json()
    console.log(data)
    if (data) {
      setUserData(data)
    } else {
      alert(data.error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = jwt.decode(token)
      if (!user) {
        localStorage.removeItem('token')
        history.replace('/login')
      } else {
        populateQuote()
      }
    }
  }, [])

  // console.log(userData._id)
  const scrollRef = useRef()

  useEffect(() => {
    socket.current = io('ws://localhost:8900')
    console.log(socket.current)
    socket.current.on('getMessage', (data) => {
      console.log(data)
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      })
    })
  }, [])
  console.log(arrivalMessage)

  console.log(socket)

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage, currentChat])
  console.log(currentChat)

  useEffect(() => {
    socket.current.emit('addUser', userData._id)
    socket.current.on('getUsers', (users) => {
      console.log(users)
      setOnlineUsers(
        userData?.followings?.filter((f) => users?.some((u) => u.userId === f)),
      )
    })
  }, [userData])
  console.log(onlineUsers)

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/conversations/${userData._id}`,
        )
        setConversations(res.data)
        setCurrentChat(res.data[0])
      } catch (err) {
        console.log(err)
      }
    }
    getConversations()
  }, [userData, setCurrentChat])

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8800/api/messages/' + currentChat?._id,
        )
        console.log(res.data)
        setMessages(res?.data)
      } catch (err) {
        console.log(err)
      }
    }
    getMessages()
  }, [currentChat])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const message = {
      sender: userData._id,
      text: newMessage,
      conversationId: currentChat._id,
    }

    const receiverId = currentChat?.members.find(
      (member) => member !== userData._id,
    )

    socket.current.emit('sendMessage', {
      senderId: userData._id,
      receiverId,
      text: newMessage,
    })

    try {
      const res = await axios.post(
        'http://localhost:8800/api/messages',
        message,
      )
      console.log(res.data)
      setMessages([...messages, res.data])
      setNewMessage('')
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  console.log(conversations)

  useEffect(() => {
    const chatOnlineMatch = onlineMatch?.filter((f) =>
      onlineUsers?.includes(f._id),
    )
    console.log(chatOnlineMatch)
    const matchData = chatOnlineMatch?.filter(
      (user) => user.username === findChatUser,
    )
    console.log(matchData)
    console.log(matchData.length === 0)
    if (matchData.length === 0) {
      setChatUserOnline(false)
    } else {
      setChatUserOnline(true)
    }
  }, [findChatUser, onlineUsers, onlineMatch])

  const handleUserChat = (c, index) => {
    console.log(c)
    setCurrentChat(c)
  }

  useEffect(() => {
    const findCurrentChat = currentChat?.members?.filter(
      (userInfo) => userInfo !== userData._id,
    )
    const findCurrentChatId = findCurrentChat?.toString()
    console.log(findCurrentChatId)
    axios
      .get(`http://localhost:8800/api/users?userId=${findCurrentChatId}`)
      .then((response) => {
        const data = response.data
        console.log(data)
        setFindChatUser(data.username)
      })
      .catch((err) => {
        console.log(err)
      })
    axios
      .get(`http://localhost:8800/api/users/friends/${userData._id}`)
      .then((response) => {
        const data = response.data
        console.log(data)
        setOnlineMatch(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [currentChat, userData])

  const handleOpenUsers = () => {
    setOpen(true)
  
  }
  const handleClose = () => setOpen(false)

  console.log(conversations)
  useEffect(() => {
    let mData = []
    conversations.map((all) => {
      mData.push(all.members.find((data) => data !== userData._id))
    })
    console.log(mData)
    const filterSameData = [...new Set(mData.map((unique) => unique))]
    console.log(filterSameData)
  })

  return (
    <>
      {/* <h1>messenger page</h1> */}
      <Topbar
        // allUsers={allUsers}
        // setAllUsers={setAllUsers}
        conversations={conversations}
        setConversations={setConversations}
        handleOpenUsers={handleOpenUsers}
        handleClose={handleClose}
        open={open}
      />
      {/* <Card  style={{backgroundColor:"#03295c",color:'white'}}> */}
      <Box
        style={{ padding: '3vh', backgroundColor: '#03295c', color: 'white' }}
      >
        <div className="messenger">
          <div className="chatMenu">
            <div className="chatMenuWrapper">
              {/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
              <Box>
                <TextField
                  id="outlined-search"
                  placeholder="Search contacts"
                  size="small"
                  type="search"
                  variant="outlined"
                  inputProps={{ 'aria-label': 'Search Contacts' }}
                  fullWidth
                  style={{ backgroundColor: 'white', borderRadius: '5px' }}
                  // onChange={(e) => dispatch(chatSearch(e.target.value))}
                />
              </Box>
              {conversations.map((c, index) => (
                <div key={index} onClick={() => handleUserChat(c, index)}>
                  <Conversation
                    conversation={c}
                    allConversations={conversations}
                    currentUser={userData}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="chatBox">
            <div className="chatBoxWrapper">
              <Box
                display="flex"
                alignItems="center"
                p={2}
                sx={{
                  pt: '8px',
                  pb: '7px',
                }}
              >
                <Box
                  sx={{
                    display: { xs: 'block', md: 'block', lg: 'none' },
                    mr: '10px',
                  }}
                >
                  <FeatherIcon icon="menu" width="18" />
                </Box>
                <ListItem dense disableGutters>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h4">{findChatUser}</Typography>
                    }
                    secondary={
                      <Typography variant="p">
                        {chatUserOnline ? 'online' : 'offline'}{' '}
                      </Typography>
                    }
                  />
                </ListItem>
              </Box>
              <Divider />
              {currentChat ? (
                <>
                  <div className="chatBoxTop">
                    {messages.map((m, index) => (
                      <div key={index} ref={scrollRef}>
                        <Message message={m} own={m.sender === userData._id} />
                      </div>
                    ))}
                  </div>
                  <Grid>
                    <form onSubmit={handleSubmit} className="chatBoxBottom">
                      <TextField
                        id="msg-sent"
                        className="chatMessageInput"
                        fullWidth
                        value={newMessage}
                        placeholder="Type a Message"
                        size="small"
                        type="text"
                        variant="outlined"
                        style={{ backgroundColor: 'white' }}
                        inputProps={{ 'aria-label': 'Type a Message' }}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />

                      <button className="chatSubmitButton" type="submit">
                        <FeatherIcon icon="send" width="24" />
                      </button>
                    </form>

                    {/* <TextField
          id="msg-sent"
          className="chatMessageInput"
         
          value={newMessage}
          placeholder="Type a Message"
          size="small"
          type="text"
          variant="outlined"
          inputProps={{ 'aria-label': 'Type a Message' }}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <IconButton
          aria-label="delete"
          className="chatSubmitButton"
          color="primary"
          onClick={handleSubmit}
          disabled={!newMessage}
        >
          <FeatherIcon icon="send" width="24" />
        </IconButton> */}
                  </Grid>
                </>
              ) : (
                <span className="noConversationText"></span>
              )}
            </div>
          </div>
          <div className="chatOnline">
            <div className="chatOnlineWrapper">
              <ChatOnline
                onlineUsers={onlineUsers}
                currentId={userData._id}
                setCurrentChat={setCurrentChat}
              />
            </div>
          </div>
        </div>
      </Box>
      {/* </Card> */}
    </>
  )
}
