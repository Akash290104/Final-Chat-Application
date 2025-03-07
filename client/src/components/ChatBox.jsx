import React from "react";
import SingleChat from "./SingleChat.jsx";
import styles from "../styling/ChatBox.module.scss";

const ChatBox = ({ fetchAgain, setFetchAgain, socket, socketConnected }) => {
  return (
    <div className={styles.container}>
      <div className="singlechat">
        <SingleChat
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          socket={socket}
          socketConnected={socketConnected}
        />
      </div>
    </div>
  );
};

export default ChatBox;
