import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import { ChatState } from "../context/chatProvider.js";
import "../styling/SideDrawer.css";
import Profilemodal from "./miscellaneous/profilemodal";
import Modal from "./miscellaneous/Modal.jsx";
import { useNavigate } from "react-router-dom";
import SearchBar from "./miscellaneous/SearchBar.jsx";
import GetSender from "../config/GetSender.js";

const SideDrawer = () => {
  const navigate = useNavigate();
  const { user, setSelectedChat, storedNotification, setStoredNotification } =
    ChatState();

  let pic = "";

  try {
    pic = user?.existingUser?.pic;
  } catch (error) {
    console.log("Error in providing pic", error);
  }

  const [displayNotification, setDisplayNotification] = useState(false);

  const showNotification = () => {
    setDisplayNotification(!displayNotification);
  };



  const [profile, setProfile] = useState(false);

  const showProfile = () => {
    // console.log("showProfile");
    setProfile(true);
  };

  const hideProfile = () => {
    // console.log("hideProfile");
    setProfile(false);
  };

  const [searchBar, setSearchBar] = useState(false);
  const showSearchBar = () => {
    setSearchBar(true);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  useEffect(() => {
    const storedNotif = localStorage.getItem("storedNotification");
    const notifications = storedNotif ? JSON.parse(storedNotif) : [];
    setStoredNotification(notifications);
  }, [setStoredNotification]);
  

  const handleNotificationOnClick = (notif) => {
    setSelectedChat(notif.chat);
    const updatedNotifications = storedNotification.filter(
      (n) => n._id !== notif._id
    );

    setStoredNotification(updatedNotifications);
    localStorage.setItem(
      "storedNotification",
      JSON.stringify(updatedNotifications)
    );
  };

  return (
    <>
      <div className="navbar">
        <div className="search">
          <div className="search-btn">
            <button onClick={showSearchBar}>Search Users</button>
          </div>
        </div>
        <div className="text">Talk-A-Tive</div>
        <div className="notification">
          <div className="bell" onClick={() => showNotification()}>
            <FaBell />
            <div
              className="number"
              style={{
                backgroundColor:
                  // notification.length === 0 ? "transparent" : "red",
                  storedNotification.length === 0 ? "transparent" : "red",
              }}
            >
              {storedNotification.length === 0 ? "" : storedNotification.length}
            </div>
            {displayNotification && storedNotification.length > 0 && (
              <div className="notifications">
                {storedNotification.map((notif) => (
                  <div
                    key={notif._id}
                    className="one"
                    onClick={() => {
                      handleNotificationOnClick(notif);
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New message in ${notif.chat.chatName}`
                      : `New message from ${GetSender(notif.chat, user)}`}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dropdown">
            <Dropdown align="end" className="profile-dropdown">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <img src={pic} alt="Profile" className="profile-pic" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Profilemodal
                  onClose={hideProfile}
                  onOpen={showProfile}
                  profile={profile}
                >
                  {/* <Dropdown.Item onClick={showProfile}>Profile</Dropdown.Item> */}
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Profilemodal>
                <Dropdown.Item onClick={logout}>Log out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      {profile && <Modal handleClose={hideProfile} user={user} />}
      <SearchBar isVisible={searchBar} setIsVisible={setSearchBar} />
    </>
  );
};

export default SideDrawer;
