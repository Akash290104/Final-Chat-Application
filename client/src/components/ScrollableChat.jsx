import React, { useEffect, useRef } from "react";
import {
  isLastMessage,
  isSameSender,
  isCurrentUser,
} from "../config/isSameSender";
import { ChatState } from "../context/chatProvider";

// Utility to format date headers
const formatDateHeader = (dateString) => {
  const today = new Date();
  const msgDate = new Date(dateString);
  const diff = today.setHours(0, 0, 0, 0) - msgDate.setHours(0, 0, 0, 0);

  if (diff === 0) return "Today";
  if (diff === 86400000) return "Yesterday";
  return msgDate.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages?.reduce((acc, message) => {
    const dateKey = new Date(message.createdAt).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(message);
    return acc;
  }, {});

  return (
    <div style={{ overflowY: "auto", maxHeight: "500px", padding: "10px" }}>
      {groupedMessages &&
        Object.entries(groupedMessages).map(([dateKey, msgs]) => (
          <div key={dateKey}>
            <div
              style={{
                textAlign: "center",
                margin: "20px 0 10px",
                fontWeight: "bold",
                color: "#e7f91d",
              }}
            >
              {formatDateHeader(dateKey)}
            </div>

            {msgs.map((m, i) => {
              const isUser = isCurrentUser(m, user);
              const showAvatar =
                isSameSender(msgs, m, i) || isLastMessage(msgs, i);
              const timeString = new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={m._id}
                  style={{
                    display: "flex",
                    flexDirection: isUser ? "row-reverse" : "row",
                    alignItems: "flex-end",
                    marginBottom: "10px",
                  }}
                  ref={
                    i === msgs.length - 1 &&
                    dateKey ===
                      new Date(
                        messages[messages.length - 1].createdAt
                      ).toDateString()
                      ? scrollRef
                      : null
                  }
                >
                  {showAvatar && (
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        margin: "0 8px",
                      }}
                    >
                      <img
                        src={m.sender?.pic}
                        alt={m.sender?.name}
                        title={m.sender?.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid #ccc",
                        }}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      backgroundColor: isUser ? "#4caf50" : "#3f51b5",
                      color: "#fff",
                      padding: "10px 15px",
                      borderRadius: "15px",
                      maxWidth: "60%",
                      wordWrap: "break-word",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      marginLeft: isUser ? "auto" : "0",
                      marginRight: isUser ? "0" : "auto",
                      position: "relative",
                    }}
                  >
                    {m.content}
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#ccc",
                        marginTop: "5px",
                        textAlign: "right",
                      }}
                    >
                      {timeString}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default ScrollableChat;
