import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error(
          "Failed to load saved user:",
          error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
      }
    }

    setLoading(false);
  }, []);


  const register = async ({
    name,
    email,
    password,
  }) => {
    const response = await api.post(
      "/auth/register",
      {
        name,
        email,
        password,
      }
    );


    return response.data;
  };


  const login = async ({
    email,
    password,
  }) => {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    console.log(
      "LOGIN RESPONSE:",
      response.data
    );

    const { token, user } =
      response.data.data;

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);

    return response.data;
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};