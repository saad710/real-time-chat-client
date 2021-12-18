import './topbar.css'
import { Search, Person, Chat, Notifications } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'

import { LoginContext } from '../../context/LoginProvider'
import { useHistory } from 'react-router-dom'
import { Avatar, Button, Divider, Grid, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import axios from 'axios'
import { OnlineContext } from '../../context/onlineProvider'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#03295c',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'scroll',
}

export default function Topbar(props) {
  const {
    handleOpenUsers,
    handleClose,
    open,
    conversations,
    setConversations,
  } = props

  const [sideUser, setSideUser] = useState([])
  const [addUser, setAddUser] = useState()
  console.log(sideUser)
  const { onlineFriends, setOnlineFriends } = useContext(OnlineContext)
  const history = useHistory()
  const { userData, setUserData } = useContext(LoginContext)
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
    // history.replace('/login')
  }

  useEffect(() => {
    axios
      .get(`http://localhost:8800/api/users/all`)
      .then((response) => {
        const data = response.data
        console.log(data)
        const withoutCurrentUser = data?.filter(
          (info) => info._id !== userData._id,
        )
        let result = withoutCurrentUser?.filter(
          (all) => !sideUser.some((side) => all.username === side.username),
        )
        console.log(result)
        setAddUser(result)
        // setAllUsers(withoutCurrentUser)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [sideUser, userData])

  useEffect(() => {
    let combineData = []
    conversations.map((con) => {
      const friendId = con.members.find((m) => m !== userData._id)
      axios
        .get(`http://localhost:8800/api/users?userId=${friendId}`)
        .then((response) => {
          console.log(response.data)
          combineData.push(response.data)
          setSideUser(combineData)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }, [conversations, userData, setSideUser])

  const handleAddContact = (all) => {
    const filteredItem = addUser.filter((ind) => {
      return ind._id !== all._id
    })
    setAddUser(filteredItem)
    console.log(all)
    const bothUserId = {
      senderId: userData._id,
      receiverId: all._id,
    }
    axios
      .get(
        `http://localhost:8800/api/conversations/find/${userData._id}/${all._id}`,
      )
      .then((response) => {
        console.log(response.data)
        if (!response.data) {
          axios
            .post(`http://localhost:8800/api/conversations`, bothUserId)
            .then((response) => {
              console.log(response.data)
              conversations.push(response.data)
            })
            .catch((err) => {
              console.log(err)
            })
          const userInfo = { userId: userData._id }
          axios
            .put(`http://localhost:8800/api/users/${all._id}/follow`, userInfo)
            .then((response) => {
              console.log(response.data)
              // const followData = {"username" : all.username,"_id":all._id}
              // onlineFriends.push(followData)
              setUserData(
                userData.map((user) => {
                  return { ...user, followings: user.followings.push(all._id) }
                }),
              )
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })

    //  conversations.push()
  }

  return (
    <div className="topbarContainer">
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        style={{ padding: '2vh' }}
      >
        <Typography style={{ color: 'white', fontWeight: 'bold' }}>
          {' '}
          <ChatBubbleOutlineIcon style={{ marginTop: '1vh' }} />
        </Typography>
        <Typography
          style={{ color: 'white', fontWeight: 'bold' }}
        >{`Account Name : ${userData.username}`}</Typography>
        <Button
          onClick={handleOpenUsers}
          style={{ fontWeight: 'bold', backgroundColor: '#ADD8E6' }}
        >
          Add Contact
        </Button>
        <Button variant="contained" onClick={handleLogout}>
          Logout
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {addUser?.map((all) => (
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                key={all._id}
              >
                <Avatar />
                <p style={{ color: '#ADD8E6', marginRight: '22vh' }}>
                  {all.username}
                </p>

                <Button
                  onClick={() => handleAddContact(all)}
                  style={{ fontWeight: 'bold', backgroundColor: '#ADD8E6' }}
                >
                  {/* {all.username === "nishat" ? "Added" : "Add"} */}
                  Add
                </Button>
              </Grid>
            ))}
          </Box>
        </Modal>
      </Grid>
    </div>
  )
}
