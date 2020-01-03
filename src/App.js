import React, { useContext } from "react";
import UISide from "./components/UI/Side/Side";
import UIMeraki from "./components/UI/Meraki/Meraki";
import UIAttendance from "./components/UI/Attendance/Attendance";
import { StoreContext } from "./context";

const classes = {
  col: {
    mobile: "column is-full column-mobile",
    desktop: "column is-one-third wh-full"
  },
  cols: {
    mobile: "columns wh-full columns-mobile",
    desktop: "columns wh-full"
  }
};

const App = () => {
  const {
    isMobile,
    stageStore: [stage]
  } = useContext(StoreContext);
  const colClass = isMobile ? classes.col.mobile : classes.col.desktop;
  const colsClass = isMobile ? classes.cols.mobile : classes.cols.desktop;
  const showColumn = stageNum => (isMobile && stage === stageNum) || !isMobile;
  return (
    <div style={isMobile ? { display: "flex" } : {}}>
      <div className="container is-fluid wh-full">
        <div className={colsClass}>
          {showColumn(0) && (
            <div className={colClass}>
              <UISide />
            </div>
          )}
          {showColumn(1) && (
            <div className={colClass}>
              <UIMeraki />
            </div>
          )}
          {showColumn(2) && (
            <div className={colClass}>
              <UIAttendance />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
