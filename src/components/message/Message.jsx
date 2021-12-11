import './message.css'
import { format } from 'timeago.js'
import profile from '../../images/profile.jpg'
// import Scrollbar from "../custom-scroll/Scrollbar";
import { Box } from '@mui/system'
import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material'

export default function Message({ message, own }) {
  return (
    // <div className={own ? "message own" : "message"}>
    //   <div className="messageTop">
    //     <img
    //       className="messageImg"
    //       src={profile}
    //       alt=""
    //     />
    //     <p className="messageText">{message.text}</p>
    //   </div>
    //   <div className="messageBottom">{format(message.createdAt)}</div>
    // </div>
    // <Scrollbar style={{ height: "calc(100vh - 445px)" }}>
    <Box>
      <div>
        <Box p={2}>
          {own ? (
            <Box display="flex" alignItems="start   " flexDirection="row">
              <ListItemAvatar>
                <Avatar
                  // alt={chatDetails.name}
                  src={profile}
                />
              </ListItemAvatar>
              <div className="pl-3">
                <Box
                  mb={1}
                  sx={{
                    p: 2,
                    backgroundColor: '#ADD8E6',
                    borderRadius: '6px',
                    color: 'black',
                  }}
                >
                  {message.text}
                </Box>
                <div className="messageBottom">{format(message.createdAt)}</div>
              </div>
            </Box>
          ) : (
            <Box
              mb={1}
              display="flex"
              alignItems="flex-end"
              flexDirection="row-reverse"
              className="chat-content"
            >
              <div className="pl-3">
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: '#ADD8E6',
                    ml: 'auto',
                    borderRadius: '6px',
                    color: 'black',
                  }}
                >
                  {message.text}
                </Box>
                <div className="messageBottom">{format(message.createdAt)}</div>
              </div>
            </Box>
          )}
        </Box>
      </div>
    </Box>
    // </Scrollbar>
  )
}
