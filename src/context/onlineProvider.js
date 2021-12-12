import React, { createContext, useState } from 'react';

export const OnlineContext = createContext()

const OnlineProvider = (props) => {
    const [onlineFriends,setOnlineFriends] = useState([])

    const { children } = props;
    return (
        <OnlineContext.Provider value={{ onlineFriends,setOnlineFriends }}>
            { children }
        </OnlineContext.Provider>
    );
};

export default OnlineProvider;