import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendMsg } from "../../../redux/chats/Action";
import { IconButton, Box } from "@material-ui/core";

import FeatherIcon from "feather-icons-react";

import { CustomTextField } from "../../forms/custom-elements/CustomTextField";

const ChatMsgSent = () => {
  const [msg, setMsg] = useState("");

  const handleChatMsgChange = (e) => {
    setMsg(e.target.value);
  };

  const onChatMsgSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(sendMsg(id, msg));
    setMsg("");
  };

  const id = useSelector((state) => state.chatReducer.chatContent);

  const dispatch = useDispatch();

  return (
    <Box p={2}>
      <form
        onSubmit={onChatMsgSubmit.bind()}
        style={{ display: "flex", alignItems: "center" }}
      >
        <CustomTextField
          id="msg-sent"
          fullWidth
          value={msg}
          placeholder="Type a Message"
          size="small"
          type="text"
          variant="outlined"
          inputProps={{ 'aria-label': 'Type a Message' }}
          onChange={handleChatMsgChange.bind(null)}
        />
        <IconButton
          aria-label="delete"
          color="primary"
          onClick={() => {
            dispatch(sendMsg(id, msg));
            setMsg("");
          }}
          disabled={!msg}
        >
          <FeatherIcon icon="send" width="18" />
        </IconButton>
      </form>
    </Box>
  );
};

export default ChatMsgSent;
