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
    stageStore: [, setStage],
    attendanceStore: [attendance],
    attendanceStatusStore: [attendanceStatus],
    isMobile
  } = useContext(StoreContext);
  const collectionExist = Object.keys(collection).length > 0;

  return (
    <div className={`card card-register ${isMobile ? "" : "card-none"}`}>
      <div className="card-content" style={{ height: "100%" }}>
        {/* Title */}
        <div className="nav">
          <h4 className={collectionExist ? classes.active : classes.notActive}>
            Attendance
          </h4>
        </div>
        {/* Navigation Bar */}
        <div className="card-options">
          {isMobile ? (
            <button
              className="button is-small is-dark"
              onClick={() => setStage(1)}
            >
              Back
            </button>
          ) : (
            <div />
          )}
        </div>
        {/* Main Content */}
        <div className="main-content">
          {/* 
            if attendance available, show attendance in a list of cards 
            else show a placeholder
          */}
          {attendance.length > 0 && !attendanceStatus && <UIAttendanceList />}
          {attendance.length === 0 && attendanceStatus && (
            <div
              style={{
                display: "flex",
                height: "50vmin",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {attendanceStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UIAttendance;
