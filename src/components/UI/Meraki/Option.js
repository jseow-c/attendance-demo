import React, { useContext } from "react";
import { StoreContext } from "../../../context";

const classes = {
  active: "tag clickable is-primary",
  notActive: "tag clickable is-gray"
};

const UIMerakiOptionTitle = ({ name, checkNav, onClick }) => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <span className={checkNav(name)} onClick={() => onClick(name)}>
      {capitalizedName}
    </span>
  );
};

const UIMerakiOption = () => {
  const {
    cameraTypeStore: [cameraType, setCameraType]
  } = useContext(StoreContext);
  const checkNav = name =>
    cameraType === name ? classes.active : classes.notActive;
  const onClick = name => {
    setCameraType(name);
  };
  const titleProps = { checkNav, onClick };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "15px 0 10px 0"
      }}
    >
      <div className="tags has-addons">
        <UIMerakiOptionTitle {...titleProps} name="static" />
        <UIMerakiOptionTitle {...titleProps} name="sense" />
      </div>
    </div>
  );
};

export default UIMerakiOption;
