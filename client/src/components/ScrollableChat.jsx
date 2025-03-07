
import React, { useEffect, useRef } from "react";
import {
  isLastMessage,
  isSameSender,
  isCurrentUser,
} from "../config/isSameSender";
import { ChatState } from "../context/chatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Trigger scroll when messages change

  return (
    <div style={{ overflowY: "auto", maxHeight: "500px" }}>
      {messages?.map((m, i) => (
        <div
          key={m._id}
          style={{
            display: "flex",
            justifyContent: isCurrentUser(m, user) ? "flex-end" : "flex-start",
            marginBottom: "10px",
          }}
          ref={i === messages.length - 1 ? scrollRef : null} // Attach ref to the last message
        >
          {(isSameSender(messages, m, i) || isLastMessage(messages, i)) && (
            <div
              style={{
                width: "45px",
                height: "45px",
                marginLeft: isCurrentUser(m, user) ? "10px" : "10px",
                marginRight: isCurrentUser(m, user) ? "10px" : "10px",
                marginTop: "10px",
                borderRadius: "50%",
              }}
            >
              <img
                style={{
                  width: "90%",
                  height: "90%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
                src={m.sender?.pic}
                alt={m.sender?.name}
                title={m.sender?.name}
              />
            </div>
          )}
          <div
            style={{
              backgroundColor: `${isCurrentUser(m, user) ? "green" : "blue"}`,
              padding: "5px",
              color: "white",
              maxWidth: "50%",
              flexWrap: "wrap",
              borderRadius: "10px",
              marginRight: isCurrentUser(m, user) ? "10px" : "0px",
              marginLeft: isCurrentUser(m, user) ? "0px" : "10px",
            }}
          >
            {m.content}
          </div>
        </div>
      ))}
      {/* Dummy div to ensure scrolling */}
      <div ref={scrollRef} />
    </div>
  );
};

export default ScrollableChat;
