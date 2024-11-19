import {
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
export const AppContext = createContext(null);
import { db } from "../config/Firebase";
import { useNavigate } from "react-router-dom";

const AppContextProvider = (props) => {
  const navigate = useNavigate();

  const [userdata, setuserdata] = useState(null);
  const [chatdata, setchatdata] = useState([]);
  const [messagesId, setmessagesId] = useState(null);
  const [messages, setmessages] = useState([]);
  const [chatuser, setchatuser] = useState(null);
  const [chatvisible, setchatvisible] = useState(false);
  const [isupdatingprofile, setisupdatingprofile] = useState(false);

  const loaduserData = async (uid) => {
    try {
      const userref = doc(db, "users", uid);
      const userSnap = await getDoc(userref);

      const userdata = userSnap.data();
      // console.log("the userdata in the loaduserdata is ", userdata);

      setuserdata(userdata);
      // console.log(userdata);
      if (userdata.avtar && userdata.name) {
        if (!isupdatingprofile) {
          navigate("/chat");
        }
      } else {
        navigate("/updateprofile");
      }
      await updateDoc(userref, {
        lastseen: Date.now(),
      });

      setInterval(async () => {
        await updateDoc(userref, {
          lastseen: serverTimestamp(),
        });
      }, 60000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userdata) {
      const chatref = doc(db, "chats", userdata.id);
      const unsub = onSnapshot(chatref, async (res) => {
        const chatitems = res.data().chatdata;
        const tempdata = [];
        for (const item of chatitems) {
          const userref = doc(db, "users", item.rId);
          const usersnap = await getDoc(userref);
          const userdata = usersnap.data();
          tempdata.push({ ...item, userdata });
        }
        setchatdata(tempdata.sort((a, b) => b.updatedAt - a.updatedAt));
      });
      return () => unsub();
    }
  }, [userdata]);

  const value = {
    userdata,
    setuserdata,
    chatdata,
    setchatdata,
    loaduserData,
    messagesId,
    setmessages,
    setmessagesId,
    chatuser,
    setchatuser,
    messages,
    chatvisible,
    setchatvisible,
    setisupdatingprofile
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
