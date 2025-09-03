import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [includeDateTeams, setIncludeDateTeams] = useState(false);
  const [dateTeams, setDateTeams] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedInclude = JSON.parse(localStorage.getItem("includeDateTeams") || "false");
    const storedTeams = JSON.parse(localStorage.getItem("dateTeams") || "[]");
    setIncludeDateTeams(storedInclude);
    setDateTeams(storedTeams);
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem("includeDateTeams", JSON.stringify(includeDateTeams));
  }, [includeDateTeams]);

  useEffect(() => {
    localStorage.setItem("dateTeams", JSON.stringify(dateTeams));
  }, [dateTeams]);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        includeDateTeams,
        setIncludeDateTeams,
        dateTeams,
        setDateTeams,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
