import React, { useContext } from "react";
import { StoreContext } from "../../../context";
import UIAttendanceList from "./List";

const classes = {
  active: "nav-title title-with-subtitles light-bold",
  notActive: "nav-title title-with-subtitles light-bold muted"
};

const UIAttendance = () => {
  const {
    collectionStore: [collection],
    peopleStore: [people]
  } = useContext(StoreContext);
  const collectionExist = Object.keys(collection).length > 0;

  return (
    <div className="card card-register card-none">
      <div className="card-content" style={{ height: "100%" }}>
        <div className="nav">
          <h4 className={collectionExist ? classes.active : classes.notActive}>
            Attendance
          </h4>
        </div>
        <div className="main-content">
          {people.length > 0 && <UIAttendanceList />}
        </div>
      </div>
    </div>
  );
};

export default UIAttendance;
