import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  loginHandler: null,
});

export const AuthProvider = ({ children }) => {
 const [user,setUser] = useState(null);
  const loginHandler = async (email, password) => {
    const request = await fetch(`http://127.0.0.1:3333/login`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await request.json();
    setUser(data.user);
    const userCredentials = {
        token:data.token,
        expiresIn:new Date().getTime() + (3600 * 1000)
    }
    localStorage.setItem("@user:credentials",JSON.stringify(userCredentials));
    localStorage.setItem("@user",JSON.stringify(data.user));
  };

  const logout = () => {
     localStorage.removeItem('@user:credentials')
     localStorage.removeItem('@user')
     setUser(null);
  }

  const checkIfIsLoggedIn = () => {
    const userCredentials = JSON.parse(localStorage.getItem('@user:credentials'))
    const actualDate = new Date().getTime();

    if(!userCredentials){
        return false;
    }

    if(userCredentials.token == null){
       return false;
    }
    if(actualDate > userCredentials.expiresIn){
        localStorage.removeItem("@user:credentials");
        return false;
    }else{
        if(userCredentials.token != null){
            const user = JSON.parse(localStorage.getItem("@user"));
            setUser(user);
            return true;
        }else{
            return false;
        }
    }
  }
  
  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!user, user: user, loginHandler: loginHandler,checkIfIsLoggedIn,logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
