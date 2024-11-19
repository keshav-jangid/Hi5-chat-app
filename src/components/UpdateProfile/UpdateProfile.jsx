import React, { useEffect, useState, useContext } from "react";
import "./UpdateProfile.css";
import assets from "../../assets/assets";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/Context";

const UpdateProfile = () => {
  const [image, setimage] = useState(false);
  const [prevImage, setprevImage] = useState("");
  const [name, setname] = useState("");
  const [bio, setbio] = useState("");
  const [uid, setuid] = useState("");

  const { setuserdata, setisupdatingprofile } = useContext(AppContext);
  const navigate = useNavigate();

  const updateprofileinfo = async (event) => {
    event.preventDefault();

    try {
      if (!prevImage && image) {
        // console.log("upload image");
      }
      const docref = doc(db, "users", uid);
      // console.log(name, bio);

      if (image) {
        // const imageurl = await upload(image);
        // setprevImage(image)

        await updateDoc(docref, {
          avtar: prevImage,
          name: name,
          bio: bio,
        });
        console.log("profile updated with image");
      } else {
        await updateDoc(docref, {
          name: name,
          bio: bio,
        });
        console.log("profile updated without image");
      }

      const snap = await getDoc(docref);
      console.log(snap.data());
      setisupdatingprofile(false);
      setuserdata(snap.data());

      navigate("/chat");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setuid(user.uid);
        const docref = doc(db, "users", user.uid);
        const docsnap = await getDoc(docref);

        if (docsnap.data().name) {
          setname(docsnap.data().name);
        }
        if (docsnap.data().bio) {
          setbio(docsnap.data().bio);
        }
        if (docsnap.data().avtar) {
          setprevImage(docsnap.data().avtar);
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  const handleprofileinput = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) return;

    const profileimagedata = new FormData();
    profileimagedata.append("file", file);
    profileimagedata.append("upload_preset", "hi5_profile_image");
    profileimagedata.append("cloud_name", "dm8zc5ji8");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dm8zc5ji8/image/upload",
      {
        method: "Post",
        body: profileimagedata,
      }
    );
    const uploadimageurl = await res.json();
    // console.log("upload image url is ", uploadimageurl.url);
    setimage(true);
    setprevImage(uploadimageurl.secure_url);

    console.log(file);
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-details">
          <h2>Update Profile</h2>
          <form onSubmit={updateprofileinfo} className="profile-form">
            <label htmlFor="uploadprofileimg">
              <img src={image ? prevImage : prevImage? prevImage :assets.profile_icon} alt="" />
              <input
                onChange={handleprofileinput}
                type="file"
                id="uploadprofileimg"
                hidden
                accept=".png, .jpg, .jpeg"
                
              />
              uplaod profile image
            </label>
            <input
              onChange={(e) => setname(e.target.value)}
              value={name}
              type="text"
              name=""
              id=""
              placeholder="name"
              required
            />
            <textarea
              onChange={(e) => setbio(e.target.value)}
              value={bio}
              placeholder="write your Bio"
            />
            <button type="submit">Save</button>
          </form>
        </div>
        <img
          className="logoimg"
          src={image ? prevImage : assets.logo2}
          alt=""
        />
      </div>
    </div>
  );
};

export default UpdateProfile;
