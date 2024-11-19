import React, { useContext, useEffect } from "react";
import Login from "./components/Login/Login";
import Chat from "./components/Chat/Chat";
import UpdateProfile from "./components/UpdateProfile/UpdateProfile";
import { Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/Firebase.js";
import { AppContext } from "./Context/Context.jsx";
const App = () => {
  const navigate = useNavigate();
  const { loaduserData } = useContext(AppContext);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate("/chat");
        await loaduserData(user.uid);
      } else {
        navigate("/");
      }
    });
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/updateprofile" element={<UpdateProfile />} />
      </Routes>
    </>
  );
};

export default App;
