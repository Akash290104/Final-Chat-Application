import React, { useState } from "react";
import styles from "../../styling/UpdateGroupChatModal.module.scss";
import { ChatState } from "../../context/chatProvider";
import { ChatLoading } from "./SearchBar";
import axios from "axios";
import { debounce } from "../../config/debounce";

const UserBadge = ({ user, handleFunction }) => (
  <div className={styles.badgecontainer}>
    <div className={styles.badgecontent}>
      <div className={styles.badgename}>{user?.name}</div>
      <div className={styles.badgeclose}>
        <button onClick={handleFunction}>X</button>
      </div>
    </div>
  </div>
);

const User = ({ user, handleFunction }) => (
  <div className={styles.customUser} onClick={handleFunction}>
    <div className={styles.pic}>
      <img src={user?.pic} alt="User" />
    </div>
    <div className={styles.details}>
      <div className={styles.name1}>{user?.name}</div>
      <div className={styles.mail}>{user?.email}</div>
    </div>
  </div>
);

const UpdateGroupChatModal = ({
  hideUpdateModal,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
  socket,
}) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupchatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [noUsers, setNoUsers] = useState(false);

  const handleSearch = debounce(async (searchTerm) => {
    if (!searchTerm) {
      setSearchResult([]);
      setNoUsers(false);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:5000/api/user?search=${searchTerm}`,
        config
      );
      setLoading(false);
      setNoUsers(response.data.users.length === 0);
      setSearchResult(response.data.users);
    } catch (error) {
      setLoading(false);
      console.error("Error finding searched users", error);
      alert("Error finding searched users");
    }
  }, 500);

  const handleAddUser = async (selectedUser) => {
    if (selectedChat.users.find((u) => u._id === selectedUser?._id)) {
      alert("Selected user is already a member of the group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user?.existingUser?._id) {
      alert("Unauthorized access. Only admin can add or remove members");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const response = await axios.put(
        "http://localhost:5000/api/chat/addtogroup",
        { chatId: selectedChat._id, userId: selectedUser?._id },
        config
      );

      setSelectedChat(response.data.added);
      setFetchAgain((prev) => !prev);

      socket.emit("user added", {
        updatedChat: response.data.added,
        name: selectedUser.name,
      });
    } catch (error) {
      console.error("Error adding the selected user to the group", error);
      alert("Error adding the selected user to the group");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (selectedUser) => {
    if (
      selectedChat.groupAdmin._id !== user?.existingUser?._id &&
      selectedUser?._id !== user?.existingUser?._id
    ) {
      alert("Unauthorized access. Only admin can remove members.");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const response = await axios.put(
        "http://localhost:5000/api/chat/removefromgroup",
        { chatId: selectedChat._id, userId: selectedUser?._id },
        config
      );

      socket.emit("user removed", {
        updatedChat: response.data.removed,
      });

      if (selectedUser?._id === user?.existingUser?._id) {
        alert(`You are leaving the group ${selectedChat.chatName}`);
        setSelectedChat();
        hideUpdateModal();
      } else {
        setSelectedChat(response.data.removed);
        alert("User removed from the group");
      }
      setFetchAgain((prev) => !prev);
      fetchMessages();
    } catch (error) {
      console.error("Error removing the selected user from the group", error);
      alert("Error removing the selected user from the group");
    } finally {
      setLoading(false);
    }
  };

  const updateName = async () => {
    if (!groupchatName) {
      alert("Please enter a group chat name");
      return;
    }

    setRenameLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const response = await axios.put(
        "http://localhost:5000/api/chat/rename",
        { id: selectedChat._id, name: groupchatName },
        config
      );
      console.log(response);

      let renamedChat = response.data.updatedChat;
      setSelectedChat(() => renamedChat);

      socket.emit("groupRenamed", {
        chat: renamedChat,
        newName: groupchatName,
      });

      alert("Group chat name updated");
    } catch (error) {
      console.error("Error updating group chat name", error);
      alert("Error updating group chat name");
    } finally {
      setRenameLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    handleSearch(value);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.container}>
        <div className={styles.closebtn}>
          <button
            onClick={() => {
              hideUpdateModal();
              setNoUsers(false);
            }}
          >
            X
          </button>
        </div>
        <div className={styles.name}>{selectedChat.chatName}</div>
        <div className={styles.users}>
          {selectedChat.users.map((user) => (
            <UserBadge
              key={user?._id}
              user={user}
              handleFunction={() => handleRemoveUser(user)}
            />
          ))}
        </div>
        <div className={styles.nameUpdate}>
          <div className={styles.text}>Rename Group</div>
          <div className={styles.nameField}>
            <input
              type="text"
              value={groupchatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              placeholder="Enter Group name"
            />
          </div>
          <div className={styles.updateBtn}>
            <button onClick={updateName} disabled={renameLoading}>
              {renameLoading ? "Updating..." : "Update"}
            </button>
          </div>
          {renameLoading && <ChatLoading />}
        </div>
        <div className={styles.nameUpdate}>
          <div className={styles.text}>Add Users</div>
          <div className={styles.nameField}>
            <input
              type="text"
              value={search}
              onChange={handleInputChange}
              placeholder="Search users"
            />
          </div>
        </div>
        <div className={styles.addUsers}>
          {loading ? (
            <ChatLoading />
          ) : searchResult.length > 0 ? (
            searchResult.map((user) => (
              <User
                key={user?._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          ) : noUsers ? (
            "No users found"
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UpdateGroupChatModal;
