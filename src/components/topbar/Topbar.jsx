import './topbar.css'
import { Search, Person, Chat, Notifications } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'

import { LoginContext } from '../../context/LoginProvider'
import { useHistory } from 'react-router-dom'
import { Button, Divider, Grid, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import axios from 'axios'

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
  const { allUsers, handleOpenUsers, handleClose, open,conversations,setConversations } = props
  const history = useHistory()
  const { userData } = useContext(LoginContext)
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
    // history.replace('/login')
  }
  const handleAddContact = (all) => {
    console.log(all)
    const bothUserId = {
      "senderId" : userData._id,
      "receiverId" : all._id
    }
    axios.post(`http://localhost:8800/api/conversations`,bothUserId)
    .then((response) => {
     console.log(response.data)
     conversations.push(response.data)
    })
  .catch((err) => {
    console.log(err)
 });
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
          <ChatBubbleOutlineIcon style={{ marginTop: '1vh' }} />{' '}
        </Typography>
        <Typography
          style={{ color: 'white', fontWeight: 'bold' }}
        >{`Account Name : ${userData.username}`}</Typography>
        <Button onClick={handleOpenUsers}>Add Contact</Button>
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
            {allUsers.map((all) => (
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                key={all._id}
              >
                <h4 style={{color:'grey'}}>{all.username}</h4>
                <Button
                  variant="contained"
                  onClick={() => handleAddContact(all)}
                >
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
