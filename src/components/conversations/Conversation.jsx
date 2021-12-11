import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ChatUserContext } from "../../context/ChatListUserDataProvider";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
  console.log(conversation)
  const [user, setUser] = useState('');
  console.log(user?.username)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;


  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    console.log(friendId)

    const getUser = async () => {
      try {
        const res = await axios(`http://localhost:8800/api/users?userId=${friendId}`);
        console.log(res.data)
        setUser(res.data);
       
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div>
      <List>
            <ListItem
              button
              alignItems="flex-start"
            >
              <ListItemAvatar>
                <Avatar alt="Remy Sharp"  />
              </ListItemAvatar>
              <ListItemText style={{marginTop:'1.7vh'}}   primary={user?.username}  />
            </ListItem>
      </List>
    </div>
  );
}
