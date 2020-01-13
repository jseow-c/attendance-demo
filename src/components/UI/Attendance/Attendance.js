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
    peopleStore: [people],
    stageStore: [, setStage],
    isMobile
  } = useContext(StoreContext);
  const collectionExist = Object.keys(collection).length > 0;

  return (
    <div className={`card card-register ${isMobile ? "" : "card-none"}`}>
      <div className="card-content" style={{ height: "100%" }}>
        <div className="nav">
          <h4 className={collectionExist ? classes.active : classes.notActive}>
            Attendance
          </h4>
        </div>
        <div className="main-content" style={{ paddingTop: 25 }}>
          {isMobile && (
            <div className="card-overall card-attendance">
              <div className="viewing-box">
                Now Viewing: <b>{collection.name}</b>
                <button
                  className="button is-small is-dark"
                  onClick={() => setStage(1)}
                >
                  Back
                </button>
              </div>
            </div>
          )}
          {people.length > 0 && <UIAttendanceList />}
        </div>
      </div>
    </div>
  );
};

export default UIAttendance;
