import React from "react";
import styles from "../../styling/Modal.module.scss";

const Modal2 = ({ user,  handleClose}) => {
  console.log("Modal 2 user is ", user);

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.container}>
        <div className={styles.topbar}>
          <div className={styles.text1}>User Profile</div>
          <div onClick={handleClose} className={styles.closebtn}>
            X
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.profilePic}>
            <img className={styles.dp} src={`${user?.pic}`} alt="User" />
          </div>
          <div className={styles.details}>
            <p>Name : {user?.name}</p>
            <p>Email : {user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal2;
