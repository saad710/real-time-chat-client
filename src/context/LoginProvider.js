import React, { createContext, useState } from 'react';

export const LoginContext = createContext()

const LoginProvider = (props) => {
    const [userData,setUserData] = useState({})

    const { children } = props;
    return (
        <LoginContext.Provider value={{ userData,setUserData }}>
            { children }
        </LoginContext.Provider>
    );
};

export default LoginProvider;