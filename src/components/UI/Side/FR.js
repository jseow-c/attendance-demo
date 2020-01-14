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
    isMobile,
    navStore: [nav, setNav],
    collectionStore: [, setCollection],
    imageStore: [, setImage],
    stageStore: [, setStage],
    peopleStore: [, setPeople],
    attendanceStore: [, setAttendance],
    recognitionStore: [recognition, setRecognition]
  } = useContext(StoreContext);
  const checkNav = name =>
    recognition === name ? classes.active : classes.notActive;
  const onClick = name => {
    setRecognition(name);
    setNav("Collections");
    setCollection({});
    setPeople([]);
    setAttendance([]);
    setImage(null);
  };
  const titleProps = { checkNav, onClick };
  return (
    <div className="card-options">
      {isMobile ? (
        <button
          className="button is-small is-dark"
          style={{ opacity: 0, cursor: "default" }}
        >
          Back
        </button>
      ) : (
        <div />
      )}
      <div className="tags has-addons">
        <UISideFRTitle {...titleProps} name="intercorp" />
        <UISideFRTitle {...titleProps} name="aws" />
      </div>
      {isMobile ? (
        <button
          className="button is-small is-dark"
          style={nav === "Collections" ? { opacity: 0, cursor: "default" } : {}}
          onClick={() => {
            if (nav === "People") setStage(1);
          }}
        >
          Next
        </button>
      ) : (
        <div />
      )}
    </div>
  );
};

export default UISideFR;
