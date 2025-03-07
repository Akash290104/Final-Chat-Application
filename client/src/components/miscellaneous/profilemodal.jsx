import React from "react";
import { GrFormView } from "react-icons/gr";
import styles from "../../styling/profilemodal.module.scss";

const Profilemodal = ({ onClose, onOpen, children, profile }) => {
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <div onClick={onOpen} className={styles.viewIcon}>
          <GrFormView />
        </div>
      )}
    </>
  );
};

export default Profilemodal;
