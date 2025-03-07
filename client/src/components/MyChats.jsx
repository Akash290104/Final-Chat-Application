import React, { useEffect, useRef, useState, useCallback } from "react";
import { ChatState } from "../context/chatProvider";
import axios from "axios";
import styles from "../styling/MyChats.module.scss";
import GetSender from "../config/GetSender";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_LOCAL
    : process.env.REACT_APP_BACKEND_DEPLOYED;

const MyChats = ({ fetchAgain, socket }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, setSelectedChat } = ChatState();

  const fetchChats = useCallback(async () => {
    if (!user || !user?.token) {
      console.log("User not logged in or token missing");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const response = await axios.get(
          `${ENDPOINT}/api/chat`,
        config
      );

      setChats(response.data.result);
    } catch (error) {
      console.log("Error fetching the chats of the logged in user", error);
    }
  }, [user, setChats]);

  useEffect(() => {
    if (socket) {
      socket.on("groupNameChanged", (data) => {
        console.log("Socket in MyChats");
        let updatedChat = data.chat;
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === updatedChat._id ? updatedChat : chat
          )
        );
        setSelectedChat(updatedChat);
      });

      socket.on("user was removed", (data) => {
        console.log("Socket user was removed");
        let updatedChat = data.chat;
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === updatedChat._id ? updatedChat : chat
          )
        );
      });

      socket.on("user was added", (data) => {
        console.log("Socket user was added");
        let updatedChat = data.chat;
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === updatedChat._id ? updatedChat : chat
          )
        );
      });

      socket.on("groupChat was created", (data) => {
        console.log("Socket groupChat was created");
        let updatedChat = data.chat;
        setChats((prevChats) => [updatedChat, ...prevChats]);
      });

      return () => {
        socket.off("groupNameChanged");
        socket.off("user was removed");
        socket.off("user was added");
        socket.off("groupChat was created");
      };
    }
  }, [socket, setChats, setSelectedChat]);

  
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain, fetchChats]);

  const [groupChatModal, setGroupChatModal] = useState(false);

  const showGroupChatModal = () => {
    setGroupChatModal(true);
  };

  const hideGroupChatModal = () => {
    setGroupChatModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.text}>My Chats</div>
        <div className={styles.groupChatbtn}>
          <button onClick={() => showGroupChatModal()}>New Group Chat +</button>
        </div>
      </div>
      {chats.map(
        (c) =>
          c.isGroupChat ? (
            <ChatSender key={c._id} name={c.chatName} chat={c} />
          ) : (
            <ChatSender key={c._id} name={GetSender(c, loggedUser)} chat={c} />
          )
        // if (c.isGroupChat) {
        //   return <ChatSender key={c._id} name={c.chatName} chat={c} />;
        // } else {
        //   const sender = GetSender(c, loggedUser);
        //   return <ChatSender key={c._id} name={sender} chat={c} />;
        // }
      )}

      {groupChatModal && (
        <GroupChatModal
          hideGroupChatModal={hideGroupChatModal}
          socket={socket}
        />
      )}
    </div>
  );
};

export default MyChats;

const ChatSender = ({ name, chat }) => {
  const chatRef = useRef();

  const { selectedChat, setSelectedChat } = ChatState();
  // console.log({ chat, selectedChat });

  const handleChatSelect = () => {
    setSelectedChat(chat);
  };

  return (
    <div
      ref={chatRef}
      onClick={handleChatSelect}
      className={`${styles.senderContainer} chatsender`}
      style={{
        backgroundColor: chat._id === selectedChat?._id ? "#32afc6" : "grey",
      }}
    >
      {name}
    </div>
  );
};
