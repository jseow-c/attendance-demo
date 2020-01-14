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
    isMobile,
    stageStore: [, setStage],
    cameraTypeStore: [cameraType, setCameraType]
  } = useContext(StoreContext);
  const checkNav = name =>
    cameraType === name ? classes.active : classes.notActive;
  const onClick = name => {
    setCameraType(name);
  };
  const titleProps = { checkNav, onClick };
  return (
    <div className="card-options">
      {isMobile ? (
        <button className="button is-small is-dark" onClick={() => setStage(0)}>
          Back
        </button>
      ) : (
        <div />
      )}
      <div className="tags has-addons">
        <UIMerakiOptionTitle {...titleProps} name="static" />
        <UIMerakiOptionTitle {...titleProps} name="sense" />
      </div>
      {isMobile ? (
        <button
          className="button is-small is-dark"
          style={{ opacity: 0, cursor: "default" }}
        >
          Next
        </button>
      ) : (
        <div />
      )}
    </div>
  );
};

export default UIMerakiOption;
