import React, { useEffect, useState } from "react";
import { ChatContext } from "../context/chatProvider";
import SideDrawer from "./SideDrawer.jsx";
import MyChats from "./MyChats.jsx";
import ChatBox from "./ChatBox.jsx";
import io from "socket.io-client";
import { useContext } from "react";

const ENDPOINT = "http://localhost:5000"; // Ensure this is HTTPS
let socket;

const Chatpage = () => {
  const { user } = useContext(ChatContext);

  const [fetchAgain, setFetchAgain] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const token = user?.token;

  useEffect(() => {
    if (token) {
      socket = io(ENDPOINT, {
        transports: ["websocket", "polling"],
        secure: true,
        rejectUnauthorized: false,
        reconnection: true,
      });

      socket.on("connect", () => {
        console.log("Connected to socket io");
        setSocketConnected(true);
        socket.emit("setup", user);
      });

      socket.on("connect_error", (reason) => {
        console.log("Connection error", reason);
        setTimeout(() => socket.connect(), 5000);
      });

      socket.on("disconnect", (reason) => {
        console.log("Disconnected", reason);
        setSocketConnected(false);
        if (reason === "io server disconnect") {
          socket.connect();
        }
      });

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [user, token]);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px",
        }}
      >
        {user && <MyChats fetchAgain={fetchAgain} socket={socket} />}
        {user && (
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            socket={socket}
            socketConnected={socketConnected}
          />
        )}
      </div>
    </div>
  );
};

export default Chatpage;
