import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "./Tabs";
import Login from "./Login";
import SignUp from "./SignUp";
import styles from "../styling/homepage.module.css";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const userInfo1 = localStorage.getItem("userInfo")
    const userInfo = userInfo1? JSON.parse(userInfo1) : null
    
    if (userInfo) {
      console.log("/chats");
    }
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Talk-A-Tive</div>
      <div className="access">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "login" ? <Login /> : <SignUp />}
      </div>
    </div>
  );
};

export default Homepage;
