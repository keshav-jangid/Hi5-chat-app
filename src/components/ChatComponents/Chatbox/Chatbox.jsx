import React, { useContext, useEffect, useState } from "react";
import "./Chatbox.css";
import assets from "../../../assets/assets";
import { AppContext } from "../../../Context/Context";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../config/Firebase";
const Chatbox = () => {
  const {
    userdata,
    chatuser,
    messagesId,
    messages,
    setmessages,
    chatvisible,
    setchatvisible,
  } = useContext(AppContext);

  const [input, setinput] = useState("");

  const sendMessage = async () => {
    // console.log("Send Message Debug:");
    // console.log("Current User Data:", userdata);
    // console.log("Chat User:", chatuser);
    // console.log("Messages ID:", messagesId);

    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          message: arrayUnion({
            sId: userdata.id,
            text: input,
            createdAt: Date.now(),
            lastseen: Date.now(),
          }),
        });


        const userIDs = [chatuser.rId, userdata.id];
        userIDs.forEach(async (id) => {
          const userchatref = doc(db, "chats", id);
          const userchatsnap = await getDoc(userchatref);
          if (userchatsnap.exists()) {
            const userchatdata = userchatsnap.data();
            const chatindex = userchatdata.chatdata.findIndex(
              (c) => c.messageId === messagesId
            );

            userchatdata.chatdata[chatindex].lastmessage = input.slice(0, 30);
            userchatdata.chatdata[chatindex].updatedAt = Date.now();
            if (userchatdata.chatdata[chatindex].rId === userdata.id) {
              userchatdata.chatdata[chatindex].messageseen = false;
            }
            await updateDoc(userchatref, {
              chatdata: userchatdata.chatdata,
            });
          }
        });
        // console.log("chatdata updated");
      }
      setinput("");
    } catch (error) {
      console.log(error);
    }
  };
  const ConvertTimestamp = (timestamp) => {
    if (timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return hours > 12
        ? `${hours - 12} : ${minutes} PM`
        : `${hours} : ${minutes} AM`;
    } else {
    }
  };

  const timstamptotimeAgo = (timestamp) => {
    const now = Date.now();
    const elapsed = now - timestamp;

    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30); // Approximate, assuming 30 days in a month
    const years = Math.floor(days / 365); // Approximate, assuming 365 days in a year

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days < 7) {
      return `${days} days ago`;
    } else if (weeks < 4) {
      return `${weeks} weeks ago`;
    } else if (months < 12) {
      return `${months} months ago`;
    } else {
      return `${years} years ago`;
    }
  };

  useEffect(() => {
    if (messagesId) {
      const unsub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setmessages(res.data().message.reverse());
      })
      return () => unsub();
    }
  }, [messagesId]);
  


  const handleimageupload = async (e) => {
    const imageinput = e.target.files[0];
    // console.log(imageinput);
    
    
  }




  return chatvisible && chatuser ? (
    <div className={`chatbox ${chatvisible ? "" : "hidden"}`}>
      <div className="chatbox-header">
        <img
          onClick={() => {
            setchatvisible(false);
          }}
          className="backicon"
          src={assets.back_icon}
          alt=""
        />
        <img   
          src={chatuser.userdata.avtar} alt="" />
        <div className="namediv">
          <p>{chatuser.userdata.Username}</p>
          <span>
            { timstamptotimeAgo(chatuser.userdata.lastseen)}
          </span>
        </div>
        <img className="help" src={assets.helpicon} alt="" />
      </div>
      <div className="chat-messages">
       
         { messages.map((msg, index) => {
          // console.log("the messages",messages);
          
           return (
              <div
                key={index}
                className={
                  msg.sId === userdata.id
                    ? "sender-message"
                    : "reciever-message"
                }
              >
                <p className="message">{msg.text}</p>
                <div>
                  <img src={  msg.sId === userdata.id? userdata.avtar : chatuser.userdata.avtar} alt="" />
                  <p>{ConvertTimestamp(msg.createdAt)}</p>
                </div>
              </div>
            );
          })}

        {/* <div className="reciever-message">
          <img className="msg-img" src={assets.user1_profile_img} alt="" />
          <div>
            <img src={assets.user1_profile_img} alt="" />
            <p>2:30</p>
          </div>
        </div>
        <div className="sender-message">
          <img className="msg-img" src={assets.user1_profile_img} alt="" />
          <div>
            <img src={assets.user1_profile_img} alt="" />
            <p>2:30</p>
          </div>
        </div> */}
      </div>
      <div className="chatinput">
        <input
          onChange={(e) => setinput(e.target.value)}
          value={input}
          className="messageinput"
          type="text "
          placeholder="write your message here .."
        />
        <input
          type="file"
          name=""
          id="file"
          onChange={handleimageupload}
          accept="image/png,image/jpeg,image/jpg"
          hidden
        />
        <label htmlFor="file">
          <img src={assets.galleryicon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send} alt="" />
      </div>
    </div>
  ) : (
    <div className={`chat-not-selected ${chatvisible ? "" : "hidden"}`}>
      <img src={assets.logo2} alt="" />
      <p>
        Developed By{" "}
        <span>
          {" "}
          <a target="_blank" href="https://www.instagram.com/ke.shav_/">
            Keshav
          </a>{" "}
        </span>{" "}
        with ❤️
      </p>
    </div>
  );
};

export default Chatbox;
