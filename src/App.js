import React from "react";
import UISide from "./components/UI/Side/Side";
import UIMeraki from "./components/UI/Meraki/Meraki";
import UIAttendance from "./components/UI/Attendance/Attendance";

const App = () => {
  return (
    <div>
      <div className="container is-fluid wh-full">
        <div className="columns wh-full">
          <div className="column is-one-third wh-full">
            <UISide />
          </div>
          <div className="column is-one-third wh-full">
            <UIMeraki />
          </div>
          <div className="column is-one-third wh-full">
            <UIAttendance />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
