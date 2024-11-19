import React, { useContext, useState } from "react";
import "./LeftSidebar.css";
import assets from "../../../assets/assets";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, Logout } from "../../../config/Firebase";
import { AppContext } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
const LeftSidebar = () => {
  const {
    userdata,
    chatdata,
    messagesId,
    setmessagesId,
    chatuser,
    setchatuser,
    chatvisible,
    setchatvisible,
  } = useContext(AppContext);

  const navigate = useNavigate()

  const [user, setuser] = useState(null);
  const [showsearch, setshowsearch] = useState(false);
  const [searchinput, setsearchinput] = useState();

  const inputhandler = async (e) => {
    try {
      const input = e.target.value;
      setsearchinput(input);

      if (input) {
        setshowsearch(true);
        const userref = collection(db, "users");
        const q = query(userref, where("Username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userdata.id) {
          let userExists = false;
          chatdata.some((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExists = true;
            }
          });
          if (!userExists) {
            setuser(querySnap.docs[0].data());
          }
        } else {
          setuser(null);
        }
      } else {
        setshowsearch(false);
      }
    } catch (error) {
      console.log(error);
    }
    // console.log("user is ", user);
  };

  const addchat = async () => {
    const messageref = collection(db, "messages");
    const chatsref = collection(db, "chats");

    try {
      const userExists = chatdata.some((chat) => chat.rId === user.id);
      if (userExists) {
        console.log("Chat already exists with this user.");
        return; // Exit the function if chat already exists
      }
      const newmessageref = doc(messageref);

      await setDoc(newmessageref, {
        createAt: serverTimestamp(),
        message: [],
      });
      await updateDoc(doc(chatsref, user.id), {
        chatdata: arrayUnion({
          messageId: newmessageref.id,
          lastmessage: "",
          rId: userdata.id,
          updatedAt: Date.now(),
          messageseen: true,
        }),
      });
      await updateDoc(doc(chatsref, userdata.id), {
        chatdata: arrayUnion({
          messageId: newmessageref.id,
          lastmessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageseen: true,
        }),
      });
      // console.log("chatdata after clicking to addchat ", chatdata);
      setsearchinput("");
      setshowsearch(false);
    } catch (error) {
      console.log(error);
    }
  };

  const setchat = async (item) => {
    try {
      setmessagesId(item.messageId);
      setchatuser(item);
      setchatvisible(true);

      const userchatsref = doc(db, "chats", userdata.id);

      const userchatsnapshot = await getDoc(userchatsref);
      const userchatsdata = userchatsnapshot.data();
      const chatdata = userchatsdata.chatdata;
      // console.log("userchatsdata", chatdata);

      const chatindex = userchatsdata.chatdata.findIndex(
        (c) => c.messageId === item.messageId
      );
      userchatsdata.chatdata[chatindex].messageseen = true;
      await updateDoc(userchatsref, {
        chatdata: userchatsdata.chatdata,
      });
    } catch (error) {
      console.log(error);
    }
    // console.log(item);
  };

  return (
    <div className={`ls-bar ${chatvisible ? "hidden" : ""}`}>
      <div className="ls-bar-top">
        <div className="ls-bar-nav">
          <div className="logo">
            <img src={assets.logo1} alt="" />
          </div>
          <div className="menu">

          <div className="submenu">
           <button onClick={()=> navigate('/updateprofile')}>edit profile</button>
            <hr />
           <button onClick={Logout}>logout</button>
          </div>
          <img className="menuicon" src={assets.menu_icon} alt="" />
          </div>
        </div>

        <div className="search">
          <img src={assets.searchicon} alt="" />
          <input onChange={inputhandler} type="text" placeholder="Search your friend" />
        </div>
      </div>
      <div className="friends">
        {showsearch && user ? (
          <div onClick={addchat} className={"friends-list"}>
            <img src={user.avtar} alt="" />
            <div>
              <p>{user.Username}</p>
              <span>{user.lastmessage}</span>
            </div>
          </div>
        ) : (
          chatdata.map((item, index) => (
            <div
              onClick={() => setchat(item)}
              key={index}
              className={`friends-list ${
                item.messageseen || item.messageId === messagesId
                  ? " "
                  : "border"
              }`}
            >
              <img src={item.userdata.avtar} alt="" />
              <div>
                <p>{item.userdata.Username}</p>
                <span>{item.lastmessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="name">
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
    </div>
  );
};

export default LeftSidebar;
