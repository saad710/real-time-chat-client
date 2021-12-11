import React from "react";
import { Drawer, useMediaQuery } from "@material-ui/core";
import ChatListing from "./ChatListing";

const drawerWidth = 240;

const ChatSidebar = (props) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  if (lgUp) {
    return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { position: "relative" },
        }}
        variant="permanent"
      >
        <ChatListing />
      </Drawer>
    );
  }
  return (
    <Drawer
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      variant="temporary"
      sx={{zIndex:1, [`& .MuiDrawer-paper`]: {paddingTop:'70px'}}}
    >
      <ChatListing />
    </Drawer>
  );
};

export default ChatSidebar;
