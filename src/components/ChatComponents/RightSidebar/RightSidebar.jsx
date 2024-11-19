import React, { useContext } from "react";
import "./RightSidebar.css";
import assets from "../../../assets/assets";
import { Logout } from "../../../config/Firebase";
import { AppContext } from "../../../Context/Context";
import { Navigate, useNavigate } from "react-router-dom";
const RightSidebar = () => {
  const { chatuser, messages , chatvisible ,setisupdatingprofile} = useContext(AppContext);
  const navigate = useNavigate()
  const handleprofileupdate = ()=>{
    setisupdatingprofile(true);
    navigate('/updateprofile');
  }

  return chatuser && chatvisible ? (
    <div className="rs-bar">
      <div className="rs-profile">
        {chatuser.userdata.avtar ? (
          <img src={chatuser.userdata.avtar} alt="" />
        ) : (
          <img src={assets.profile_icon} alt="" />
        )}
        <h2>{chatuser.userdata.Username}</h2>
        <p>{chatuser.userdata.bio}</p>
      </div>

      {/* <div className="media">
        <h2>Media</h2>
        <div className="media-container">
          <img src={assets.galleryicon} alt="" />
          <img src={assets.helpicon} alt="" />
          <img src={assets.logo} alt="" />
          <img src={assets.logo} alt="" />
          <img src={assets.menu_icon} alt="" />
          <img src={assets.logo} alt="" />
          <img src={assets.send} alt="" />
          <img src={assets.searchicon} alt="" />
        </div>
      </div> */}
      <div className="logout">
        <button className="profile-update-btn">
          <a href="/updateprofile">Update Profile</a>
        </button>
        <button onClick={Logout} className="logout-btn">
          <a href="/">Logout</a>
        </button>
      </div>
    </div>
  ) : (
    <div className="rs-bar">
      <div className="rs-profile">
        <img src={assets.profile_icon} alt="" />
        <h2>Hi5 user</h2>
        <p>hey there! i am using chat app </p>
      </div>

      <div className="logout">
        <button onClick={handleprofileupdate} className="profile-update-btn">
          Update Profile
        </button>
        <button onClick={Logout} className="logout-btn">
          <a href="/">Logout</a>
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
