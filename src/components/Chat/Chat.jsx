import React, { useContext, useState } from "react";
import "./Chat.css";
import LeftSidebar from "../ChatComponents/LeftSidebar/LeftSidebar";
import Chatbox from "../ChatComponents/Chatbox/Chatbox";
import RightSidebar from "../ChatComponents/RightSidebar/RightSidebar";
const Chat = () => {
  return (

    <div className="chat">

      <div className="chat-container">
        <LeftSidebar />
        <Chatbox />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Chat;
