import React, { useContext } from "react";
import { StoreContext } from "../../../context";

const classes = {
  active: "tag clickable is-primary",
  notActive: "tag clickable is-white"
};

const UISideFRTitle = ({ name, checkNav, onClick }) => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <span className={checkNav(name)} onClick={() => onClick(name)}>
      {capitalizedName}
    </span>
  );
};

const UISideFR = () => {
  const {
    recognitionStore: [recognition, setRecognition]
  } = useContext(StoreContext);
  const checkNav = name =>
    recognition === name ? classes.active : classes.notActive;
  const onClick = name => setRecognition(name);
  const titleProps = { checkNav, onClick };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "15px 0 0 0"
      }}
    >
      <div className="tags has-addons">
        <UISideFRTitle {...titleProps} name="intercorp" />
        <UISideFRTitle {...titleProps} name="aws" />
      </div>
    </div>
  );
};

export default UISideFR;
