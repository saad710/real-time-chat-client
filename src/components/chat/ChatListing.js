import React, { useEffect } from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Box,
} from "@material-ui/core";

import { CustomTextField } from "../../forms/custom-elements/CustomTextField";

import { useSelector, useDispatch } from "react-redux";
import { openChat, fetchChats, chatSearch } from "../../../redux/chats/Action";

import Scrollbar from "../../custom-scroll/Scrollbar";

const ChatListing = () => {
  //const searchTerm = useSelector((state) => state.chatReducer.chatSearch);
  const dispatch = useDispatch();
  const activeChat = useSelector((state) => state.chatReducer.chatContent);
  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const filterChats = (chats, chatSearch) => {
    if (chats)
      return chats.filter((t) =>
        t.name.toLocaleLowerCase().includes(chatSearch.toLocaleLowerCase())
      );
    else return chats;
  };

  const chats = useSelector((state) =>
    filterChats(state.chatReducer.chats, state.chatReducer.chatSearch)
  );
  return (
    <div>
      <Box
        p={2}
        sx={{
          pt: "21px",
          pb: "21px",
        }}
      >
        <CustomTextField
          id="outlined-search"
          placeholder="Search contacts"
          size="small"
          type="search"
          variant="outlined"
          inputProps={{ 'aria-label': 'Search Contacts' }}
          fullWidth
          onChange={(e) => dispatch(chatSearch(e.target.value))}
        />
      </Box>
      <Divider />
      <List sx={{ height: { lg: "calc(100vh - 365px)", sm: "100vh" }, p: 1 }}>
        <Scrollbar>
          {chats.map((chat) => (
            <ListItem
              button
              alignItems="flex-start"
              key={chat.id}
              onClick={() => dispatch(openChat(chat.id))}
              selected={activeChat === chat.id}
            >
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={chat.thumb} />
              </ListItemAvatar>
              <ListItemText primary={chat.name} secondary={chat.excerpt} />
            </ListItem>
          ))}
        </Scrollbar>
      </List>
    </div>
  );
};

export default ChatListing;
