import React, { createContext, useState } from 'react';

export const AuthContext = createContext()

const AuthProvider = (props) => {
    const [auth,setAuth] = useState(false)

    const { children } = props;
    return (
        <AuthContext.Provider value={{ auth,setAuth }}>
            { children }
        </AuthContext.Provider>
    );
};

export default AuthProvider;