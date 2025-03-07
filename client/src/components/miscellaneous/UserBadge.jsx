import React from "react";
import styles from "../../styling/UserBadge.module.scss";

const UserBadge = ({ user, handleFunction }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.name}>{user?.name}</div>
        <div className={styles.close}>
          <button onClick={handleFunction}>X</button>
        </div>
      </div>
    </div>
  );
};

export default UserBadge;
