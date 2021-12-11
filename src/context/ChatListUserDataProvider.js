import React, { createContext, useState } from 'react';

export const ChatUserContext = createContext()

const ChatListUserDataProvider = (props) => {
    const [userChat,setUserChat] = useState("")

    const { children } = props;
    return (
        <ChatUserContext.Provider value={{ userChat,setUserChat }}>
            { children }
        </ChatUserContext.Provider>
    );
};

export default ChatListUserDataProvider;