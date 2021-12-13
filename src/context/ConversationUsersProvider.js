import React, { createContext, useState } from 'react';

export const ConversationContext = createContext()

const ConversationUserProvider = (props) => {
    const [user,setUser] = useState("")

    const { children } = props;
    return (
        <ConversationContext.Provider value={{ user,setUser }}>
            { children }
        </ConversationContext.Provider>
    );
};

export default ConversationUserProvider;